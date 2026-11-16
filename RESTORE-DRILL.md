# Restore drill: a restic snapshot onto a scratch machine

The drill proves that the restic backups can rebuild UVL-EMR: one snapshot restored onto a
scratch machine, the counts matching the source, a sign-in working on each app, and an X-ray
image that opens. The dump-file restore was done in September 2026; the restic path never was
(#261). Run it with the local support lead during the handover, then once a year and after any
change to the backup set-up.

This repository is **public**. Addresses, passwords and the repository password come from the
handover, never from this file.

**Never restore onto UAT or production.** The script refuses to run where the `backup` container
runs, which both of them have.

---

## 1. What a snapshot holds

Checked on UAT, 16 Nov 2026 (`rcb status`, `restic ls`).

| Data | In a snapshot | How |
|---|---|---|
| OpenMRS database, and the bridges' databases (`openmrs_eip_mgt_*`) | yes | `mysqldump --all-databases` |
| Keycloak, Odoo, and Orthanc's index | yes | `pg_dumpall` |
| OpenMRS patient photos and attachments | yes | `openmrs` volumes |
| OpenMRS configuration checksums | yes, **not restored** | cleared instead, so the configuration is applied again |
| Odoo filestore (attachments, invoice PDFs) | **only after the LIME-EMR-Tooling change of #261 is deployed** | `odoo` volume label |
| X-ray images (Orthanc DICOM files) | **only after the LIME-EMR-Tooling change of #261 is deployed** | `orthanc` volume label |
| Orthanc worklists | no | rebuilt by the bridge within a minute |
| Analytics (Superset) | no | separate server |
| The env file (passwords, including the repository password) | no | kept apart, from the handover |

**Schedule.** `CRON_SCHEDULE='*/5 * * * *'` comes from `Scripts/Bundled-Docker/secrets/template.env`
in LIME-EMR-Tooling. Every deploy regenerates the env file from that template, so a change made
in the env file on the server does not survive the next update: change the template. A backup
run takes about ten seconds. The cleanup after each run (`RESTIC_KEEP_DAILY=7`, `WEEKLY=4`,
`MONTHLY=12`, `YEARLY=3`) keeps only the newest snapshot of each day, so the list shows one
snapshot per day at 23:55 UTC plus the latest of today, at most five minutes old. The "hourly
incremental" of the LIME service documentation describes the older MariaBackup scripts
(`Procedures/Backups`), which this deployment does not run.

**Where.** `RESTIC_REPOSITORY=/restic_data`, mounted from a directory on the server's own disk.
A snapshot alone does not survive the loss of the server: only a copy kept elsewhere does. The
drill restores from a copy, which is also what a real disaster would need.

Snapshots taken before the label change hold neither the Odoo filestore nor the X-ray images.
Restoring one of them, `counts` reports `odoo.files_missing` and `orthanc.files_missing` above 0
and the drill fails checks 7 and 9. That is the honest result for those snapshots.

---

## 2. Before the drill (about 1 h 30, the day before)

| # | Step | Time |
|---|---|---|
| P1 | Scratch machine: Ubuntu 24.04, **x86-64** (the UVL images are built for amd64), 4 vCPU, 16 GB RAM, free disk at least three times the repository size plus 40 GB. A laptop works only if it is x86-64 with 16 GB given to Docker. Not the UAT or production server | 15 min |
| P2 | Close it: firewall open for SSH only. The restored data is real patient data, so reach every web page through an SSH tunnel and never publish a port | 5 min |
| P3 | Deploy the stack with `deploy-lime.sh setup` (flags in LIME-EMR-Tooling `Documentation/deploy-lime.md`): the same `--distro`, `--site`, `--env`, `--image-prefix` and `--docker-image-tag` as the source, and `--enable-sso --enable-odoo --enable-orthanc`. **Leave out** `--enable-backups`, `--enable-monitoring`, `--enable-https` and `--domain`: no backup container, nothing reported to Grafana as the site, and nothing pointing at the production addresses. Wait until every container is healthy | 30–45 min |
| P4 | Download `restore-backups/` of LIME-EMR-Tooling (its README, step 1) to the scratch machine | 5 min |
| P5 | Copy the repository from the source to the scratch machine (read-only on the source). Find the directory with `docker inspect ozone-msf-mugamba-backup-1 --format '{{range .Mounts}}{{if eq .Destination "/restic_data"}}{{.Source}}{{end}}{{end}}'`, then copy it with `rsync -a` or `tar` over SSH, a few minutes after a backup run (they start every 5 minutes). Use the off-site copy instead if there is one | 5–30 min |
| P6 | Put the repository password (`RESTIC_PASSWORD` of the source's env file) in the password manager. The drill reads it from the environment only | 5 min |
| P7 | List the snapshots and choose one: the newest 23:55 UTC snapshot, because nobody works at night, so the source counts up to that time are exact. Write its id and time on the drill sheet | 5 min |

```bash
read -rs RESTIC_PASSWORD; export RESTIC_PASSWORD      # typed, not stored in shell history
bash restore-backups/restore-from-restic.sh snapshots --repo=/srv/restic-copy
```

---

## 3. The drill (about 2 h)

Record the start and end time of every step on the drill sheet.

| # | Step | Time |
|---|---|---|
| D1 | **Source counts, read-only.** On the source server: `sudo bash restore-backups/restore-from-restic.sh counts --until='<snapshot time, UTC>' > source-counts.tsv`. Copy the file to the scratch machine. It holds counts only, no patient data | 5 min |
| D2 | **Pick the spot checks**, on the source, written on paper and not in the issue: one patient with an encounter before the snapshot, one Odoo invoice number from before it, one X-ray study from before it | 10 min |
| D3 | **Dry run.** `sudo -E bash restore-backups/restore-from-restic.sh restore --repo=/srv/restic-copy --snapshot=<id> --dry-run`. It extracts the snapshot and checks that both dumps are complete. It changes nothing | 5–15 min |
| D4 | **Restore.** The same command without `--dry-run`, then type `RESTORE`. It stops every app, loads the databases, copies the files, clears the checksums, restarts the apps and saves `counts-restored.tsv` | 5–30 min |
| D5 | **Wait for the apps.** `docker ps --filter health=unhealthy` prints only its header line. OpenMRS takes 10–15 minutes | 15 min |
| D6 | **Compare the counts** (below) | 5 min |
| D7 | **Sign-ins** (below) | 15 min |
| D8 | **The spot checks of D2** on the scratch machine | 15 min |
| D9 | **An image opens** (below) | 10 min |
| D10 | **Clean up** (section 5) | 15 min |

### D6. Compare the counts

```bash
sudo bash restore-backups/restore-from-restic.sh counts --until='<snapshot time, UTC>' > scratch-counts.tsv
diff <(grep -v until_utc source-counts.tsv) <(grep -v until_utc scratch-counts.tsv) && echo IDENTICAL
```

The lines cover OpenMRS patients, people, encounters, visits, obs, orders and users; Odoo
partners, sale orders and their lines, invoices and attachments; Keycloak users per realm; and
Orthanc patients, studies, series and instances. `*.files_missing` counts the files a database
points to that are not on disk; it must be 0. Orthanc keeps no creation date, so its lines also
count studies received after the snapshot: a difference there is explained only by studies
dated after the snapshot in the source's PACS.

### D7. Sign-ins

Single sign-on is **not** tried on the scratch machine: the restored Keycloak holds production's
addresses and signing keys, and a scratch machine set up to answer for them could exchange
tokens with the real production server. Each app is signed in to directly instead, each with
the **source's** password from the handover, because the restore brought the source's users:

- **OpenMRS:** `docker exec -it ozone-msf-mugamba-openmrs-1 curl -s -u admin http://localhost:8080/openmrs/ws/rest/v1/session`
  (curl asks for the password). Pass: the answer has `"authenticated":true`.
- **Odoo:** open the Odoo port through the SSH tunnel, `/web/login`, sign in as the Odoo
  administrator. Pass: « Ventes » opens and lists quotes.
- **Keycloak:** `docker exec -it ozone-msf-mugamba-keycloak-1 /opt/bitnami/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user <admin user>`,
  then `kcadm.sh get users -r ozone --fields username` (same path). Pass: sign-in accepted and
  the users of realm `ozone` are listed.

### D9. An image opens

The viewer needs single sign-on, so open the file itself. On the scratch machine:

```bash
P=ozone-msf-mugamba
docker exec $P-postgresql-1 psql -U postgres -d orthanc -Atc \
  "SELECT substr(uuid,1,2)||'/'||substr(uuid,3,2)||'/'||uuid FROM attachedfiles WHERE filetype = 1 LIMIT 1"
docker cp $P-orthanc-1:/var/lib/orthanc/db/<the path printed> /tmp/drill.dcm
```

Copy `/tmp/drill.dcm` to the laptop through SSH and open it in a DICOM viewer (Weasis,
MicroDicom). For the X-ray study of D2, pick its instance in the Orthanc index instead of the
first one. Pass: the X-ray shows. Then delete the file on both machines: it is patient data.
(UVL's Orthanc stores files uncompressed, `compressiontype` 1, so the file is plain DICOM.)

---

## 4. Pass or fail

The drill passes only if every line passes.

| # | Check | Pass |
|---|---|---|
| 1 | The chosen snapshot is listed in the copy and its age is known | id and time on the sheet |
| 2 | Dry run | exit 0, "Both dumps complete" |
| 3 | Restore | exit 0, no "unexpected PostgreSQL errors" |
| 4 | Apps healthy | no unhealthy container 20 minutes after the restore |
| 5 | OpenMRS, Odoo and Keycloak counts | identical to the source's |
| 6 | Orthanc counts | identical, or the difference is studies dated after the snapshot |
| 7 | `odoo.files_missing` and `orthanc.files_missing` | both 0 |
| 8 | Sign-ins to OpenMRS, Odoo and Keycloak | all three accepted |
| 9 | An X-ray image opens | it shows in the viewer |
| 10 | Spot checks of D2 | the patient's encounter, the invoice and the study are there |
| 11 | Time from the start of D3 to the end of D5 | written down: it is the time a real restore needs |

After a real restore, also follow `RUNBOOK.md` section 4, "After any restore". On the scratch
machine, clearing the Odoo checksums puts radiology prices back to `radiology_exams.csv`; that is
expected and not a drill failure.

---

## 5. After the drill

1. **Destroy the scratch machine and the repository copy.** They hold patient data. A laptop:
   `docker compose down -v` for the project, then delete the copy and the extraction folder
   (`/var/tmp/restic-restore-<id>`).
2. **Record the result on #261:** date, snapshot id and age, the pass or fail of each check, the
   times of check 11. No patient data, no addresses, no passwords.
3. **Update `RUNBOOK.md` section 4** with the date of the last successful drill.
4. A failed check is a GitHub issue, linked from #261, before the drill counts as done.
