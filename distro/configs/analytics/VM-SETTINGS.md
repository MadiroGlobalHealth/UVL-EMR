# Analytics stack settings that do not live in this folder

These are values of the analytics VM (`/home/ubuntu/ANALYTICS/uvl-analytics`) that the pipeline needs and that no file of this
repository carries. Keep them when the stack is rebuilt or the source (UAT / production) is switched.

## 1. Odoo tables that need REPLICA IDENTITY FULL (source database)
The Flink sources read Debezium changes with the `debezium-json` format and `ignore-parse-errors`. An UPDATE whose `before` image is
empty (Postgres REPLICA IDENTITY DEFAULT) is dropped silently, so the analytics keep the first version of the row. Every Odoo table
the pipeline reads must be `FULL`:

    ALTER TABLE account_move REPLICA IDENTITY FULL;
    ALTER TABLE account_move_line REPLICA IDENTITY FULL;
    ALTER TABLE account_payment REPLICA IDENTITY FULL;
    ALTER TABLE account_partial_reconcile REPLICA IDENTITY FULL;
    -- undo: ALTER TABLE <t> REPLICA IDENTITY DEFAULT;

The stack's own mechanism is the `odoo-replica-identity-migration` service (compose profile `prod-write`, Liquibase `liquibase/odoo`),
driven by the VM `.env` variable (the four finance tables were added on 24 Nov 2026):

    ODOO_ANALYTICS_TABLES='databasechangelog,account_account,product_category,sale_order,sale_order_line,res_partner,product_product,product_template,ir_model_data,account_move,account_move_line,account_payment,account_partial_reconcile'

Check on the source: `select relname, relreplident from pg_class where relkind='r' and relreplident='f';` must list all of them.
(`account_journal`, `res_users`, `product_pricelist` are still DEFAULT: a rename there would not propagate.)

## 2. Debezium date converter (setup-connect.sh, both connectors)
`timestampConverter.format.date` was `YYYY-MM-dd` (week-year): a DATE at the end of December came out one year late (e.g. 2026-12-31
as 2027-12-31). It must be `yyyy-MM-dd`. The stack builds `uvl-analytics-setup-connect:2.6.0-scw` from `scw-setup-connect/Dockerfile`,
which rewrites `/opt/setup-connect.sh` of the upstream image with `sed`; the same line is changed in `setup-connect/setup-connect.sh`.
After the change every table must be re-snapshotted (empty the sink tables, wipe Kafka, `restart-analytics.sh`).

## 3. Debezium MySQL decimals
`"decimal.handling.mode": "double"` on the openmrs connector (added by `scw-setup-connect/Dockerfile`): stock quantities are DECIMAL and
otherwise reach Flink as base64.

## 4. Flink memory and slots (`.env`, read by `docker-compose-streaming-common.yaml`)
    TASK_MANAGER_SLOTS=30      # one job per query file: more than 26 jobs
    MANAGED_MEMORY_SIZE=4g     # RocksDB: the 1g default shared by 40 slots caused a memtable flush storm (2-2.6x slower catch-up)
`recreate-flink.sh` (VM only) recreates the jobmanager alone. Flink does not resume from a checkpoint: a restart re-reads from the committed Kafka offsets.

## 5. Analytics database role
`ALTER ROLE analytics SET synchronous_commit = off;` (undo `RESET`): no measured speed-up, harmless because Kafka re-sends.

## 6. Kafka topics
`CREATE_TOPICS` lists the `emr.openmrs.stockmgmt_*` and `erp.public.account_*` topics (they are also auto-created).
It must also list `emr.openmrs.bed_patient_assignment_map`: production has no bed assignment yet, so Debezium never creates that topic, and the Flink job `bed_assignments` then restarts in a loop (« Failed to list subscribed topic partitions ») and never reaches RUNNING. Seen at the switch back to production on 26 Nov 2026; added to the VM's `.env` then. Any source table that can be empty needs its topic in `CREATE_TOPICS`.

## 7. Kafka Connect task watchdog (cron on the analytics VM)
Script: `scripts/connect-task-watchdog.sh`, installed as `/home/ubuntu/ANALYTICS/uvl-analytics/connect-task-watchdog.sh`.
Why: a normal deploy recreates the source database containers; afterwards `odoo-connector` reports RUNNING while its task 0 is FAILED, so invoices and payments silently stop flowing.
What it does: for every connector from `GET /connectors` (through `docker exec ozone-analytics-connect-1 curl`), it reads `/status`. A FAILED task is logged (UTC time, connector, task id, first line of the trace with everything after `jdbc:` or `password` cut), restarted with `POST /connectors/<name>/tasks/<id>/restart`, and its state re-read after 20 s. A FAILED connector gets `POST /connectors/<name>/restart?includeTasks=true&onlyFailed=true`. It never deletes, pauses or reconfigures anything and never touches replication slots.
Limit: at most 3 restarts per task (or connector) per hour, tracked in `.connect-task-watchdog.state` next to the script; after that it logs `giving up, needs a human` (once an hour) so a broken source does not loop. If the Connect REST API does not answer it logs once and skips.
Cron (ubuntu): `*/5 * * * * /home/ubuntu/ANALYTICS/uvl-analytics/connect-task-watchdog.sh >/dev/null 2>&1`
Log: `/home/ubuntu/ANALYTICS/logs/connect-task-watchdog.log` (the script trims it to the last 2000 lines; one heartbeat line per hour when all is RUNNING).
Disable: comment the cron line. Test without touching a real task: `WATCHDOG_DRY_RUN=1 WATCHDOG_STATUS_FILE=<json {name: status}> WATCHDOG_STATE_FILE=<tmp> WATCHDOG_LOG=<tmp> WATCHDOG_LOCK=<tmp> ./connect-task-watchdog.sh`.
