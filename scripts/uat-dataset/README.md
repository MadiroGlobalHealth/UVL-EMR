# UAT without real patient data (#263)

UAT is restored from production, so it holds real patients. Before anyone outside the
hospital and Madiro (volunteers first, #257) gets a UAT account, the real records come out and
UAT is filled with synthetic patients instead. Two scripts do it, both standard-library Python 3:

| Script | What it does |
|---|---|
| `uat_phi.py audit` | Counts patients that are not synthetic in OpenMRS (voided rows too), Odoo and Orthanc. Exit 1 if any remain. Read-only, counts only. |
| `uat_phi.py purge` | Removes them. A dry run unless `--apply`; see its `--help` and docstring for what it touches and what it refuses. |
| `synthetic_dataset.py load` | Creates `SYNTH-nnnn` patients through the REST API: registered, in a visit, with vitals, with orders (consultation, lab, X-ray). The orders reach Odoo, the lab and Orthanc through the bridges, as a clinician's do. |

A patient is **synthetic** when every name it has, voided ones included, starts with `SYNTH-`,
or with `E2E`, `QA`, `TEST` or `DEMO` followed by a non-letter (`QA-Reg 7`, `E2E Clinic`). Anything
else counts as real: `QAsim` is real. When in doubt a record is removed, never kept.

## The procedure

Run from a laptop with the UAT SSH config, in **bash** (zsh does not split `$U` into words).
Nothing is installed on the server. Do steps 3–6 in a
quiet hour: the bridges are stopped meanwhile, so what users do in OpenMRS then does not reach
Odoo.

```sh
D=scripts/uat-dataset
U='ssh -F ~/work/scaleway-deploy/uvl-emr-uat-scw/ssh_config uvl-uat-scw'
IP=$($U docker inspect -f "'{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}'" ozone-msf-mugamba-openmrs-1 | awk '{print $1}')
MYSQL="$U docker exec -i ozone-msf-mugamba-mysql-1 sh -c \\'mysql -uroot -p\\\$MYSQL_ROOT_PASSWORD -B -N openmrs\\'"
PSQL="$U docker exec -i ozone-msf-mugamba-postgresql-1 sh -c \\'psql -U \\\$POSTGRES_USER -X -d postgres\\'"
```

1. **Audit** (read-only): `$D/uat_phi.py audit --mysql "$MYSQL" --psql "$PSQL"`
2. **Dry run** (read-only, about a minute): `$D/uat_phi.py purge --mysql "$MYSQL" --psql "$PSQL" --target uvl-uat`.
   It lists the rows per table, the staff rows reached (must be 0) and what would block `--apply`.
   Read the "not covered by a foreign key" list: those columns are not purged.
3. **Stop the bridges.** They read the MariaDB binary log and would turn the deletions into Odoo
   deletions; the purge refuses while they are connected.
   `$U docker stop ozone-msf-mugamba-eip-odoo-openmrs-1 ozone-msf-mugamba-eip-openmrs-orthanc-1`
4. **Purge**: the step-2 command plus `--apply --i-confirm-target=uvl-uat`. OpenMRS deletes run in one
   transaction (all or nothing), then Odoo's pseudonymisation in another, then the binary logs that
   hold the deleted rows are purged. Re-running is safe: it only finds what is left.
5. **Reset the bridges' binlog position and start them.** Their saved position points into a purged
   binary log. With no saved position they take a schema-only snapshot (`debezium.snapshotMode=schema_only`)
   and carry on from now, without re-sending old records:
   ```sh
   for b in odoo:eip-odoo-openmrs orthanc:eip-openmrs-orthanc; do
     $U "docker run --rm --entrypoint rm -v ozone-msf-mugamba_eip-home-${b%%:*}:/eip-home \
         \$(docker inspect -f '{{.Config.Image}}' ozone-msf-mugamba-${b#*:}-1) -f /eip-home/.offsets.txt /eip-home/.history.txt"
   done
   $U docker start ozone-msf-mugamba-eip-odoo-openmrs-1 ozone-msf-mugamba-eip-openmrs-orthanc-1
   ```
6. **Clear what OpenMRS keeps outside the database.** Restart OpenMRS (its cache still holds the
   deleted patients): `$U docker restart ozone-msf-mugamba-openmrs-1`. Once it answers, rebuild the
   patient search index, whose files hold the old names, through a tunnel
   (`$U -N -L 8080:$IP:8080 &`):
   `curl -u admin:… -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:8080/openmrs/ws/rest/v1/searchindexupdate`
   (or System Administration › Search Index). Remove the files in `/openmrs/data/complex_obs` that
   no obs references any more (attachments of deleted patients).
7. **Old backups.** The UAT backup repository (`/restic_data` on the UAT host) keeps snapshots taken
   before the purge. After the next scheduled backup, keep only that one:
   `$U docker exec ozone-msf-mugamba-backup-1 restic forget --keep-last 1 --prune`.
   This drops UAT's older restore points; decide it with the person who owns UAT.
8. **Fill UAT**: `export SYNTH_OPENMRS_USER=admin SYNTH_OPENMRS_PASSWORD=…`, keep the step-6
   tunnel open, then
   `$D/synthetic_dataset.py load --site $D/synthetic-dataset.mugamba.json --url http://localhost:8080/openmrs --env uat`
   (dry run; it checks every uuid in the site file first), then again with `--apply --i-confirm-target=localhost`.
9. **Audit again.** Exit 0 is the condition for the access below. Record the date and the output
   (counts only) on #263.

Odoo prints invoices and stores them as attachments; the deleted attachments' files leave the
filestore at Odoo's next daily clean-up.

**A restore of production onto UAT puts every real record back** (a restore drill, #261, or a
refresh). Disable the volunteer accounts before it, and run steps 1–9 again after it.

## Who may have UAT access, and on what basis

| Who | Access | Basis |
|---|---|---|
| Madiro delivery (maintainers) | Admin, server, databases | Build, deploy and support UAT |
| Hospital staff testing a change | Their own account, with their production role | Product owner's request; they see real records in production already |
| Product owner | Their own account | Tests and signs off every change on UAT |
| Volunteers (#257) | One account each, with the role their issue needs; never admin, never server, database, backup or Keycloak administration | The last audit exited 0, and the issue they work on needs UAT |

- A volunteer account is created only after step 9 passes, and disabled whenever UAT is restored
  from production again, until the audit passes once more.
- The server, the databases and the backups stay with the maintainers: the backup repository,
  logs and binary logs from before the purge may still hold real records.
- An account is removed when its holder stops working on UVL-EMR.
