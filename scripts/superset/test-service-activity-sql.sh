#!/usr/bin/env bash
# Runs the service_activity dataset (UVL-EMR#243) against a throwaway PostgreSQL
# loaded with fixtures/service-activity.sql (synthetic records) and checks the
# service mapping. Needs Docker.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
dataset="$repo/distro/configs/superset/assets/datasets/Analytics/service_activity.yaml"
image="${PG_IMAGE:-postgres:13-alpine}"
name="uvl-service-sql-test-$$"
work="$(mktemp -d)"
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

awk '/^sql: \|-$/ { inside = 1; next } inside && /^[^ ]/ { exit } inside { sub(/^  /, ""); print }' "$dataset" > "$work/q.sql"
[ -s "$work/q.sql" ] || { echo "FAIL: no sql block"; exit 1; }

docker run -d --name "$name" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=analytics "$image" >/dev/null
for _ in $(seq 1 60); do docker exec "$name" psql -U postgres -d analytics -tAc 'SELECT 1' >/dev/null 2>&1 && break; sleep 1; done
psql_run() { docker exec -i "$name" psql -U postgres -d analytics -v ON_ERROR_STOP=1 -tA -F '|' "$@"; }
psql_run -q < "$here/fixtures/service-activity.sql" >/dev/null

query() { { printf '%s\n' "${1/FROM virtual_table/FROM (}"; cat "$work/q.sql"; printf '\n) AS virtual_table %s\n' "${2:-}"; } | psql_run; }
failures=0
check() { if [ "$2" = "$3" ]; then echo "ok   $1 = $3"; else echo "FAIL $1: expected [$2], got [$3]"; failures=$((failures + 1)); fi; }

check "encounters per service" \
  "Bloc opératoire|1|1;Hospitalisation|2|1;Maternité|2|1;Nutrition|1|1;Néonatologie|1|1;Urgences|1|1;" \
  "$(query 'SELECT service, COUNT(*), COUNT(DISTINCT patient_uuid) FROM virtual_table' 'GROUP BY service ORDER BY service COLLATE "C"' | tr '\n' ';')"
check "caesarean room admission counts under Maternité" "Maternité" \
  "$(query 'SELECT service FROM virtual_table' "WHERE location = 'Salle de césarienne'")"
check "unmapped OPD encounter and voided admission excluded" "8" "$(query 'SELECT COUNT(*) FROM virtual_table')"
check "each encounter counted once" "0" "$(query 'SELECT COUNT(*) - COUNT(DISTINCT encounter_datetime::text || patient_uuid) FROM virtual_table')"

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
