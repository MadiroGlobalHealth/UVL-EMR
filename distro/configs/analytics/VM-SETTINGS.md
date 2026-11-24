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
