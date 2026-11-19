# Service point of the visits already recorded (#222)

Since #222, #678 and #691 a new visit records the service chosen when it is started and its
encounters are filed there. Visits recorded before that keep the location of whoever opened them
(reception for most), and some consultations were filed at reception too, because their clinician
was signed in there. The reports read both:

| Report | Reads |
|---|---|
| PBF registers, « PBF Synthèse mensuelle », MoH sheet 15 (`SERVICE`) | location of the consultation encounter |
| Visits report, « Service (point de prestation) » | location of the visit's consultation encounter |
| Visits report « Lieu d'accueil », visits started per service | location of the visit |

`visit_service_point.py` corrects both on the OpenMRS database, once. Standard-library Python 3,
run from a laptop; nothing is installed on the server. The report queries do not change: the
analytics tables follow the corrected rows through the change-data-capture pipeline.

## The rule

1. **A consultation** (Outpatient Consultation, Inpatient Consultation) filed at a location
   where no patient is seen (`notAService` in the site file: reception, cashier, laboratory,
   pharmacy and its dispensing boxes, X-ray, Unknown Location) moves to the service where **the
   same clinician** (the account that recorded it) filed the other consultations of the same type:
   - on the **same day**, when they are all at one service;
   - otherwise in the **30 days before and after**, when at least 90 % of them, and at least 5,
     are at one service (the clinician's **usual service**).

   Neither: the consultation is left as it is and counted as undecided. Its observations that
   carry the old location move with it, as OpenMRS does when an encounter's location is edited.
2. **A visit** opened at such a location takes the location of its consultation, after step 1:
   Outpatient Consultation first, else Inpatient Consultation; if several, the most recent. This
   is the rule of the visits report. A ward that is not a « Visit Location » gives its nearest
   parent that is. A visit with **no consultation**, or whose consultation is undecided, is left
   as it is and counted as undecided.

Nothing else moves: a visit opened at a service keeps it even when its consultation is elsewhere;
vitals and orders stay where they were filed; voided rows and the test location (`ignored`) are
not touched. Consultations the script has moved are never used as evidence, so a second run
decides nothing new.

The lists and the three thresholds (`windowDays`, `minShare`, `minEvidence`) are in
`visit-service-point.mugamba.json`. Every uuid is checked on the server first.

## What is written, and how it is undone

`apply` writes in **one transaction**. Each row is first copied to the table
`uvl_service_point_correction` (run id, entity `visit` / `encounter` / `obs`, row id, old and new
location, basis, the previous `changed_by` and `date_changed`), then `location_id` is set, with
`changed_by` (the `--user` account, `admin` by default) and `date_changed` on visits and
encounters. A row that changed between the plan and the write stops the transaction: nothing is
written. `restore --run-id` puts the rows of a run back from that table, with their previous
`changed_by` and `date_changed`; a row somebody edited after the correction is left and counted.

The Odoo and Orthanc bridges do not read the `visit`, `encounter` or `obs` tables, so they need
not be stopped. OpenMRS is not stopped either; step 4 checks that it shows the new location.

## The procedure

In **bash** (zsh does not split `$U` into words). The same on UAT and in production; only `U`,
the container name if it differs, and the `--target` label change.

```sh
S=scripts/visit-service-point
U='ssh -F ~/work/scaleway-deploy/uvl-emr-uat-scw/ssh_config uvl-uat-scw'
MYSQL="$U docker exec -i ozone-msf-mugamba-mysql-1 sh -c \\'mysql -uroot -p\\\$MYSQL_ROOT_PASSWORD -B -N openmrs\\'"
```

1. **Back up** the three tables on the server (production: after the nightly backup is confirmed
   too). The dump stays on the server, it holds patient data:

   ```sh
   $U "docker exec ozone-msf-mugamba-mysql-1 sh -c 'mysqldump -uroot -p\$MYSQL_ROOT_PASSWORD --single-transaction openmrs visit encounter obs' | gzip > ~/before-222-\$(date +%Y%m%d-%H%M).sql.gz && ls -lh ~/before-222-*.sql.gz"
   ```

2. **Dry run.** Counts by month, by from → to location and by basis, and the undecided ones by
   reason. Counts only, never a row. Read them before going on.

   ```sh
   $S/visit_service_point.py plan --mysql "$MYSQL" --site $S/visit-service-point.mugamba.json
   ```

   `--since` and `--before` (yyyy-mm-dd) limit the rows corrected to a period; the evidence is
   always read from every date.

3. **Apply.** Note the run id it prints.

   ```sh
   $S/visit_service_point.py apply --mysql "$MYSQL" --site $S/visit-service-point.mugamba.json \
       --target uvl-uat --i-confirm-target=uvl-uat
   ```

   It ends with « A new plan now finds 0 row(s) to correct ». Exit code 1 otherwise.

4. **Check.** A second `plan` shows 0 to correct and the same undecided counts as the first.
   Open one corrected visit in OpenMRS: the visit and its consultation show the service (if
   they still show the old location, restart OpenMRS). The reports follow once the analytics
   pipeline has processed the changes.

5. **Undo**, if the result is not what the product owner expects:

   ```sh
   $S/visit_service_point.py restore --mysql "$MYSQL" --run-id <run id>            # dry run
   $S/visit_service_point.py restore --mysql "$MYSQL" --run-id <run id> --commit
   ```

   The dump of step 1 is the last resort only: restoring it would lose everything recorded
   since.

## Tests

```sh
python3 -m unittest discover -s scripts/visit-service-point
```
