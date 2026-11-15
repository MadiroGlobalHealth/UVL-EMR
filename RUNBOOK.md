# UVL-EMR support runbook

For the person who runs, supports and deploys UVL-EMR at the clinic after the handover
(December 2026). It says what to check, what to do when something breaks, and when to call
for help.

This repository is **public**. The runbook has no server addresses, passwords or names.
You get those in the handover, and they stay out of git, chat and email:

- **Server access:** your SSH key on the production server and on UAT, added by Madiro.
- **Secrets:** the deployment env file on each server, which `deploy-lime.sh` loads, plus the
  admin passwords given to you at handover (Keycloak, Odoo, OpenMRS `admin`, Grafana).
- **Private deploy tooling:** read access to `MSF-OCG/LIME-EMR-Tooling` and a GitHub token for it.
  The deploy script and the detailed deploy and restore guides live there.

Read these too. This runbook links to them and does not repeat them:

| Document | What it covers |
|---|---|
| [ONBOARDING.md](ONBOARDING.md), step 4 | The apps and repositories, and how an order moves between them |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Where configuration lives, its traps, prices in Odoo, privacy |
| [CHANGELOG.md](CHANGELOG.md) | What each release changed, where it is live, and its extra steps |
| LIME-EMR-Tooling `Procedures/deploy-uvl-runbook.md` | The full deploy, step by step. Its host values are old: use the ones from the handover |
| LIME-EMR-Tooling `Documentation/deploy-lime.md` | Every `deploy-lime.sh` action and flag |
| LIME-EMR-Tooling `restore-backups/README.md` | Whole-instance restore from dump files |

---

## 1. What runs where

There are three environments. Each one is a single server running Docker containers.

- **Production:** what the clinic uses. Changes only in the agreed window (section 3).
- **UAT:** the test copy. Every change goes there first, and the product owner tests it there.
- **Analytics:** a separate server for reports (Superset).

Containers on the production and UAT servers (names start with `ozone-msf-mugamba-`):

| Container | What it does |
|---|---|
| `openmrs`, `frontend` | OpenMRS 3: registration, visits, forms, orders, results, dispensing, beds, stock |
| `mysql` | The OpenMRS database (patient records) |
| `keycloak` | Sign-in (SSO) for OpenMRS, Odoo and Superset, and each user's roles |
| `odoo` | Billing: quotes (« Devis »), invoices (« Factures »), payments, products and prices |
| `postgresql` | The Odoo and Keycloak databases |
| `eip-odoo-openmrs`, `fhir-odoo` | The bridge that turns OpenMRS orders and dispenses into Odoo quote lines |
| `orthanc`, `orthanc-auth-service`, `eip-openmrs-orthanc` | Imaging: the X-ray worklist and images. Only a paid order reaches the worklist |
| `backup`, `backup-metrics` | restic backups (section 4), and the "backup age" figure shown in Grafana |
| `grafana-agent`, `node-exporter`, `cadvisor` | Monitoring: logs and metrics sent to Grafana Cloud |
| `lime-shared-traefik-traefik-1` | The web entry point: HTTPS certificates, routes each address to the right app |

On the analytics server, Kafka and Flink copy the EMR data into an analytics database, and
Superset shows the dashboards. It restarts every night at 01:00 UTC (03:00 in Burundi) and
reloads the dashboards stored in this repository (`distro/configs/superset/assets`).

---

## 2. Daily checks (10 minutes, every morning)

1. **The EMR opens.** Sign in, search for a test patient, open the chart.
2. **Billing receives orders.** In Odoo, « Ventes › Commandes › Devis »: yesterday's visits have
   quotes. No quotes while the clinic was working means the bridge stopped (section 5).
3. **Grafana, "Fleet Overview":** every container up, disk under 70 %, backup age under one day.
4. **Reports.** Superset shows yesterday's activity.

If you have server access, also look at:

```bash
docker ps --filter health=unhealthy                       # should print only the header line
df -h /                                                   # disk use, should be under 70 %
docker exec ozone-msf-mugamba-backup-1 restic snapshots --compact | tail -3   # newest under 1 day old
```

Every week, run the read-only `deploy-lime.sh audit` (flags in `Documentation/deploy-lime.md`).
It checks disk, firewall, the TLS certificate expiry and backups, and changes nothing.

Write down anything odd in a GitHub issue (section 8), even if it fixed itself.

---

## 3. Deploying a release

### Rules

- **UAT first, always.** Production gets only what the product owner has tested on UAT.
- **Window:** night of Tuesday to Wednesday, 00:00–06:00 Burundi time. Thursday 00:00–06:00 is
  the fallback. Agree it with the clinic and tell the wards in advance.
- **Before you start, write down the rollback cut-off time** (for example 02:30). If production
  is not healthy by then, restore (section 4) instead of continuing to fix.
- Never run `setup --fresh` on production: it deletes the databases.
- Never start production with a plain `docker compose up`: the env file holds a template image
  name, and only `deploy-lime.sh` replaces it with the UVL images.
- Never run `odoo shell` on a server. A second Odoo process once used all the memory of UAT.

### Steps

1. **Images are built.** A change merged to `main` is built by the **CI** workflow on GitHub
   (Actions). Wait until every run on that merge commit is green.
2. **Deploy to UAT.** GitHub › Actions › **Deploy to UAT** › Run workflow (or the Deploy button in
   Implementer AI). It refuses to run if another deploy holds UAT.
3. **The product owner tests on UAT** and confirms in the issue.
4. **Note the image digest UAT runs.** UAT and production both use the `dev` tag, so a merge in
   between would put untested code on production. `Procedures/deploy-uvl-runbook.md`, step 1,
   shows how to check this.
5. **On the production server, in the window: back up first.** `deploy-lime.sh backup-now`, or
   `docker exec ozone-msf-mugamba-backup-1 rcb backup`. Check the new snapshot is listed.
6. **Update.** Run `deploy-lime.sh update` with the production flags. The exact command is in the
   handover and in `Procedures/deploy-uvl-runbook.md`, step 4. Its shape:

   ```bash
   curl -sSL -H "Authorization: token $GH_TOKEN" \
     https://raw.githubusercontent.com/MSF-OCG/LIME-EMR-Tooling/dev/Procedures/deploy-lime.sh \
     | sudo bash -s -- update --distro=uvl --site=mugamba --env=prod \
       --github-token="$GH_TOKEN" --image-prefix=<image prefix> --docker-image-tag=dev \
       --branch=dev --domain=<production domain> --enable-https --openmrs-port=80 \
       --enable-sso --enable-odoo --enable-orthanc --enable-backups --enable-monitoring --yes
   ```

   Keep `--enable-monitoring` and `--enable-backups`, or those containers are removed.
   Check `--domain` twice: the same command with the UAT domain has been typed by mistake before.
7. **Wait.** OpenMRS takes 10–15 minutes to become healthy. The script can report a failed
   health check while OpenMRS is still starting. Wait before you act.
8. **Check** (section 5 has the fixes):
   - the OpenMRS log has no `Continuing past` line (`docker logs ozone-msf-mugamba-openmrs-1 2>&1 | grep "Continuing past"`);
   - sign in as a ward user, not `admin`: open a patient, place an order, and check that it
     reaches Odoo as a quote line;
   - do the extra steps listed for that release in the CHANGELOG (for example Keycloak roles).
9. **Record it.** In the CHANGELOG, tag the release `Production` with the date. Tell the wards
   it is done, and the product owner which issues are now live.

---

## 4. Backups and restore

### What is backed up

The `backup` container runs restic. Each snapshot holds the OpenMRS database, the Odoo and
Keycloak databases, and OpenMRS files (patient photos, attachments, configuration checksums).
How often it runs and how long snapshots are kept is set in the env file (`CRON_SCHEDULE`,
`RESTIC_KEEP_*`). Where they are stored is set by `RESTIC_REPOSITORY`. There may also be nightly
dump files under `~/BACKUPS/` on the production server.

### Check backups

```bash
docker exec ozone-msf-mugamba-backup-1 rcb status
docker exec ozone-msf-mugamba-backup-1 restic snapshots --compact
```

Backups once stopped for five weeks before anyone noticed. A backup counts only if it can be
restored, so look at its age every day (section 2).

### Restore

- **Practise on UAT, never on production first.** A restore replaces everything entered after
  the snapshot.
- **From dump files:** `restore-backups/restore-instance.sh` in LIME-EMR-Tooling, following its
  README (dry run first). This was done in September 2026, twice on UAT and once on production.
- **From a restic snapshot:** LIME-EMR-Tooling's `docker-compose-restore.yml`, with
  `RESTIC_RESTORE_SNAPSHOT` set to the snapshot id. This has not been rehearsed yet. The restore
  drill (#261) does it with the local support lead and adds the tested steps here.
- **After any restore:**
  1. clear the Odoo initializer checksums and restart Odoo (section 5, first row);
  2. check that OpenMRS orders still reach Odoo;
  3. sign in as a ward user and open a patient you know was recorded before the snapshot.

---

## 5. Common incidents

Restart a single container with `docker restart ozone-msf-mugamba-<name>-1`. Restarting OpenMRS
takes the EMR down for 2–15 minutes: do it on production only when the clinic is quiet, or
when the EMR is already down.

| Symptom | Cause | Fix |
|---|---|---|
| After a restore or migration, Odoo is missing products or fields, and the bridge logs `Invalid field 'x_external_identifier'` | Odoo's initializer remembers which config files it has applied (`odoo-checksums` volume), so it skips them on a restored database | In the `odoo` container, delete the files under `/mnt/checksums/`, then restart `odoo`. Warning: this also re-applies the prices in `radiology_exams.csv`, so radiology prices typed in the UI go back to the file's |
| A form fixed in a release still does not appear; the log says `Could not find a form named …` | The form failed to load once, but OpenMRS still recorded it as loaded (stale checksum) | Delete its files in `/openmrs/data/configuration_checksums/` (`ampathforms/<Form>.checksum` and both `ampathformstranslations/<Form>_translations_*.checksum`), then restart `openmrs` only |
| After a release, stock items or other data are missing; the log says `Continuing past: … despite precondition failure` | That part of the update needs data that is only loaded later in the first start | Restart `openmrs` once, then check again |
| After a deploy, the sign-in page loads but nobody can sign in | Recreating OpenMRS turned SSO off (`oauth2login.started` = false) | `Procedures/deploy-uvl-runbook.md`, step 5 |
| A user got a new role but cannot see the menu or app | OpenMRS copies Keycloak roles only when the user signs in through the browser | The user signs out (« Se déconnecter ») and signs in again |
| Orders stop reaching Odoo | The `eip-odoo-openmrs` bridge stopped or is failing | `docker logs --tail 200 ozone-msf-mugamba-eip-odoo-openmrs-1`. Restart it once. If errors continue, escalate with the log |
| An imaging order is paid but not on the worklist | `eip-openmrs-orthanc` stopped, or the payment is not on the invoice that holds that order's line | Check the invoice in Odoo, then that container's log. Escalate if the invoice is right |
| A module does not start (`SUPER privilege and binary logging is enabled`), yet OpenMRS says healthy | A database setting needed by modules that create triggers | Escalate. Do not change versions |
| A module does not start (`ValidationFailedException … checksum`) | Production's update history differs from UAT's | Escalate. Do not edit the database |
| A container stays unhealthy after an update | The first start after a release or restore is slow | Wait 15 minutes. Then read its log (`docker logs --tail 200 …`) and escalate with it |
| Disk above 90 % | Old images and logs | `docker image prune` (unused images only). Never prune volumes. Escalate if it stays high |
| Reports: Flink logs `All jobs are completed. Exiting` | The nightly restart kept old Zookeeper data | The nightly script clears it since 3 Nov 2026. If it happens again, escalate |
| Reports: a chart added to « UVL Report V1 » is gone the next morning | The nightly 01:00 UTC restart reloads the dashboards stored in the repository | Build new charts on a new dashboard. To keep one for good, export it and attach it to a GitHub issue |
| Reports: Superset is slow or times out | Database statistics or memory settings on the analytics server | Escalate |
| The server is slow, with processes you do not recognise | Possible intrusion | Do not delete anything. Escalate at once (section 9) |

---

## 6. Users and roles (Keycloak)

All sign-ins go through Keycloak, realm `ozone`. Roles are given there, never in OpenMRS
directly.

**Add a user:** Keycloak admin console › realm `ozone` › Users (« Utilisateurs ») › Add user:

1. Username `firstname.lastname`, first and last name. Save.
2. Credentials › Set password, **Temporary** on. The user picks their own at
   first sign-in.
3. Role mapping › Assign role › filter by clients:
   - **`openmrs`**: the clinical role, for example `Register patients`, `Nurse`, `Doctor`,
     `Outpatient Consultant`, `Inpatient Consultant`, `Midwife`, `Lab Technician`,
     `X-Ray Technician`, `Pharmacist`, `Central Pharmacist`, `Inventory Administrator`,
     `Anesthesist`, `Dentist`, `Ophtalmologist`. `System Developer` is the administrator role:
     keep it to very few people.
   - **`odoo`**: only for billing and pharmacy staff, for example `Invoicing / Billing`,
     `Sales / User: All Documents`; finance gets `Invoicing / Billing Administrator`.
4. The user signs in through the browser. Their roles reach OpenMRS at that moment.

Pharmacists also need their stock locations set in the OpenMRS stock app after their first
sign-in. See the CHANGELOG entry for #438 and `sites/mugamba/configs/keycloak/users/staff-roster.example.csv`.

**Someone leaves:** Users › the user › turn **Enabled** off. Do not delete the user: their name
stays on the records they signed.

**Many users at once:** `keycloak-apply-users.sh` with a roster file. The format is in
`staff-roster.example.csv`. The filled-in roster names staff, so keep it with the secrets,
never in this repository.

**A new role** (one that is not in the list) is a change: open an issue (section 8). Editing
`ozone-realm.json` does nothing on a running server. The realm file is read only when Keycloak
is empty.

---

## 7. Prices (Odoo)

The clinic sets its own prices in the Odoo UI. The repository does not hold prices, and a price
put in a CSV file is not applied.

- **Change a price:** Odoo › « Ventes › Produits › Produits » › open the product › « Prix de vente »
  › « Enregistrer ». Finance does this, with the Odoo role `Invoicing / Billing Administrator`.
- **New products** arrive at 1.00 FBu when nobody gave a price. Price them before they are used.
- Odoo keeps no history of price changes. Note the old price in a GitHub issue or the finance
  sheet before you change it.
- Insurance rules (the share each payer covers, MFP price ceilings) are configuration, not
  prices: changing them is a change request (section 8). See
  `sites/mugamba/configs/odoo/initializer_config/insurance_coverage/README.md`.

---

## 8. Asking for a change

1. **Open a GitHub issue** on this repository: what you expected, what happened, which role you
   were signed in as, and screenshots without real patient data. For a new requirement, also
   put the document in the Drive folder `2 _ REQUIREMENTS`.
2. **The Madiro implementation lead** triages it at the weekly meeting and puts it in the plan.
   Urgent issues: say so in the issue, and message the implementation lead. They are not swapped
   in silently.
3. **It is built through Implementer AI**: a pull request, deployed to UAT, tested there by the
   product owner, then merged and deployed to production in the next window (section 3).

No patient data in issues, ever: describe the case ("a patient with two visits on the same day"),
not the patient.

---

## 9. Escalation

| Level | Who | For |
|---|---|---|
| 1 | Local support lead (clinic) | User questions, passwords, roles, prices, daily checks, the fixes in section 5 |
| 2 | Product owner (clinic) | Whether something is a requirement, UAT sign-off, training, the deploy window |
| 3 | Madiro implementation lead | Code or configuration changes, scope and dates, anything section 5 does not fix, a failed deploy or restore, suspected intrusion or data loss |

- **Production is down during clinic hours:** go to level 3 at once, and tell the product owner
  so the wards switch to paper.
- **Suspected intrusion or data loss:** stop, change nothing, escalate. Keep the logs.
- **DNS** (the web addresses) is managed by Madiro: ask at least two days ahead.

The phone numbers and the people at each level are in the handover document, not here.
