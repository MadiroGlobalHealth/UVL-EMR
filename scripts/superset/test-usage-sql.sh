#!/usr/bin/env bash
# Runs the usage and adoption SQL (UVL-EMR#285) against a throwaway PostgreSQL
# loaded with fixtures/usage-analytics.sql, and checks the numbers.
#
# The SQL is read from where Superset reads it: the `sql:` block of the dataset
# YAMLs, and the SQL Lab baseline query. Needs Docker.
#
#   scripts/superset/test-usage-sql.sh
#
# PG_IMAGE overrides the image (default postgres:13-alpine, the major version the
# UVL postgresql image runs).
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
assets="$repo/distro/configs/superset/assets/datasets/Analytics"
baseline="$repo/distro/configs/superset/sql/usage_baseline.sql"
image="${PG_IMAGE:-postgres:13-alpine}"
name="uvl-usage-sql-test-$$"
work="$(mktemp -d)"

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

# Prints the literal block scalar that follows `sql: |-`, without its indent.
dataset_sql() {
  awk '
    /^sql: \|-$/ { inside = 1; next }
    inside && /^[^ ]/ { exit }
    inside { sub(/^  /, ""); print }
  ' "$1"
}

dataset_sql "$assets/usage_activity.yaml" > "$work/usage_activity.sql"
dataset_sql "$assets/usage_summary.yaml" > "$work/usage_summary.sql"
for f in "$work/usage_activity.sql" "$work/usage_summary.sql"; do
  [ -s "$f" ] || { echo "FAIL: no sql block extracted for $(basename "$f")"; exit 1; }
done

docker run -d --name "$name" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=analytics "$image" >/dev/null
for _ in $(seq 1 60); do
  docker exec "$name" pg_isready -U postgres -d analytics >/dev/null 2>&1 && break
  sleep 1
done
# pg_isready answers before the init restart; wait for a real query to succeed.
for _ in $(seq 1 30); do
  docker exec "$name" psql -U postgres -d analytics -tAc 'SELECT 1' >/dev/null 2>&1 && break
  sleep 1
done

psql_run() { docker exec -i "$name" psql -U postgres -d analytics -v ON_ERROR_STOP=1 -tA -F '|' "$@"; }

psql_run -q < "$here/fixtures/usage-analytics.sql" >/dev/null

# Wraps a dataset query the way Superset does for a virtual dataset.
query() { # <sql file> <outer select, using virtual_table>
  { printf '%s\n' "${2/FROM virtual_table/FROM (}"; cat "$1"; printf '\n) AS virtual_table %s\n' "${3:-}"; } | psql_run
}

failures=0
check() { # <label> <expected> <actual>
  if [ "$2" = "$3" ]; then
    echo "ok   $1 = $3"
  else
    echo "FAIL $1: expected [$2], got [$3]"
    failures=$((failures + 1))
  fi
}

window="WHERE activity_datetime >= '2026-09-16' AND activity_datetime < '2026-09-23'"

# usage_activity: the dataset's metric expressions over the baseline window,
# exactly as the dashboard's date filter applies them.
got="$(query "$work/usage_activity.sql" "SELECT COUNT(DISTINCT user_key),
  SUM(CASE WHEN activity_kind = 'Registration' THEN 1 ELSE 0 END),
  COUNT(DISTINCT CASE WHEN activity_kind IN ('Encounter', 'Visit') THEN patient_uuid END),
  SUM(CASE WHEN activity_kind = 'Visit' THEN 1 ELSE 0 END),
  SUM(CASE WHEN activity_kind = 'Encounter' THEN 1 ELSE 0 END),
  SUM(CASE WHEN activity_kind = 'Order' THEN 1 ELSE 0 END) FROM virtual_table" "$window")"
check "activity: users|registered|seen|visits|encounters|orders" "4|2|4|2|5|2" "$got"

got="$(query "$work/usage_activity.sql" "SELECT service, COUNT(*) FROM virtual_table" \
  "$window AND activity_kind = 'Encounter' GROUP BY service ORDER BY service" | tr '\n' ';')"
check "activity: encounters per service" "Admission|1;Outpatient Consultation|2;Vitals|2;" "$got"

got="$(query "$work/usage_activity.sql" "SELECT service, COUNT(*) FROM virtual_table" \
  "$window AND activity_kind = 'Order' GROUP BY service ORDER BY service" | tr '\n' ';')"
check "activity: orders per type" "Drug Order|1;Test Order|1;" "$got"

# usage_summary: weekly and monthly rows.
row() { # <grain> <period_start> <metric> <service>
  query "$work/usage_summary.sql" "SELECT actual, COALESCE(target_pct::text, '-'), COALESCE(target_value::text, '-'), COALESCE(pct_of_target::text, '-') FROM virtual_table" \
    "WHERE period_grain = '$1' AND period_start = '$2' AND metric = '$3' AND service = '$4'"
}
check "summary: week 14 Sep active users (no denominator yet)" "3|0.80|-|-" "$(row week 2026-09-14 'Active users' '(all)')"
check "summary: week 21 Sep active users" "2|0.80|-|-" "$(row week 2026-09-21 'Active users' '(all)')"
check "summary: week 14 Sep encounters" "5|0.80|-|-" "$(row week 2026-09-14 Encounters '(all)')"
check "summary: week 21 Sep encounters" "2|0.80|-|-" "$(row week 2026-09-21 Encounters '(all)')"
check "summary: week 14 Sep vitals encounters (no target row)" "2|-|-|-" "$(row week 2026-09-14 Encounters Vitals)"
check "summary: week 14 Sep orders" "2|0.80|-|-" "$(row week 2026-09-14 Orders '(all)')"
check "summary: week 07 Sep registrations" "1|-|-|-" "$(row week 2026-09-07 'Patients registered' '(all)')"
check "summary: September encounters" "7|0.80|-|-" "$(row month 2026-09-01 Encounters '(all)')"
check "summary: September patients seen" "5|-|-|-" "$(row month 2026-09-01 'Patients seen' '(all)')"

# Targets are parameters: setting the weekly Active users denominator to 5
# (80% -> target 4) must give 3 / 4 = 75% for the week of 14 Sep.
sed "s/('week',  'Active users', '(all)', CAST(NULL AS numeric), 0.80,/('week',  'Active users', '(all)', CAST(5 AS numeric), 0.80,/" \
  "$work/usage_summary.sql" > "$work/usage_summary_target.sql"
if cmp -s "$work/usage_summary.sql" "$work/usage_summary_target.sql"; then
  check "summary: targets row found for substitution" "changed" "unchanged"
else
  got="$(query "$work/usage_summary_target.sql" "SELECT actual, target_value, pct_of_target FROM virtual_table" \
    "WHERE period_grain = 'week' AND period_start = '2026-09-14' AND metric = 'Active users'")"
  check "summary: week 14 Sep active users against a target of 4" "3|4|75.0" "$got"
fi

# The SQL Lab baseline query must agree with the dashboard over its default window.
got="$(psql_run < "$baseline" | awk -F'|' '{ print $2 "=" $4 }' | tr '\n' ';')"
check "baseline query" \
  "Active users=4;Patients registered=2;Patients seen=4;Visits=2;Encounters=5;Encounters=2;Encounters=2;Encounters=1;Orders=2;Orders=1;Orders=1;" \
  "$got"

if [ "$failures" -ne 0 ]; then
  echo "$failures check(s) failed"
  exit 1
fi
echo "all checks passed"
