#!/usr/bin/env bash
# Runs the PBF and MoH report datasets (UVL-EMR#240, #241, #242) against a
# throwaway PostgreSQL loaded with fixtures/pbf-moh-analytics.sql (synthetic
# records only) and checks the figures. Needs Docker.
#
#   scripts/superset/test-pbf-moh-sql.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
assets="$repo/distro/configs/superset/assets/datasets/Analytics"
image="${PG_IMAGE:-postgres:13-alpine}"
name="uvl-pbf-sql-test-$$"
work="$(mktemp -d)"

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

dataset_sql() {
  awk '/^sql: \|-$/ { inside = 1; next } inside && /^[^ ]/ { exit } inside { sub(/^  /, ""); print }' "$1"
}
for d in pbf_indicators_monthly pbf_indicator_lines moh_ambulatory_consultations moh_ambulatory_morbidity; do
  dataset_sql "$assets/$d.yaml" > "$work/$d.sql"
  [ -s "$work/$d.sql" ] || { echo "FAIL: no sql block in $d"; exit 1; }
done

docker run -d --name "$name" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=analytics "$image" >/dev/null
for _ in $(seq 1 60); do
  docker exec "$name" psql -U postgres -d analytics -tAc 'SELECT 1' >/dev/null 2>&1 && break
  sleep 1
done
psql_run() { docker exec -i "$name" psql -U postgres -d analytics -v ON_ERROR_STOP=1 -tA -F '|' "$@"; }
psql_run -q < "$here/fixtures/pbf-moh-analytics.sql" >/dev/null

query() { # <dataset> <outer select using virtual_table> [tail]
  { printf '%s\n' "${2/FROM virtual_table/FROM (}"; cat "$work/$1.sql"; printf '\n) AS virtual_table %s\n' "${3:-}"; } | psql_run
}
failures=0
check() { if [ "$2" = "$3" ]; then echo "ok   $1 = $3"; else echo "FAIL $1: expected [$2], got [$3]"; failures=$((failures + 1)); fi; }
pbf() { # <month> <code>
  query pbf_indicators_monthly "SELECT COALESCE(value::text, 'NULL') || '|' || status FROM virtual_table" \
    "WHERE period_start = '$1' AND indicator_code = '$2'"
}

S=2026-09-01; A=2026-08-01
check "PBF-01 Sep consultations (voided visit/person excluded)" "4|computed" "$(pbf $S PBF-01)"
check "PBF-01 Aug consultations" "1|computed" "$(pbf $A PBF-01)"
check "PBF-02 Sep new cases" "1|partial" "$(pbf $S PBF-02)"
check "PBF-03 Aug referrals received" "1|partial" "$(pbf $A PBF-03)"
check "PBF-04 Sep admissions" "1|partial" "$(pbf $S PBF-04)"
check "PBF-05 Sep bed-days (5 Sep -> 8 Sep)" "3|partial" "$(pbf $S PBF-05)"
check "PBF-06 Sep lab exams (NEW only; voided order and voided person excluded)" "2|partial" "$(pbf $S PBF-06)"
check "PBF-07 Sep X-rays" "1|partial" "$(pbf $S PBF-07)"
check "PBF-08 Sep ultrasounds" "1|partial" "$(pbf $S PBF-08)"
check "PBF-09 Sep caesareans" "1|partial" "$(pbf $S PBF-09)"
check "PBF-10 Aug severe malnutrition" "1|partial" "$(pbf $A PBF-10)"
check "PBF-10 Sep (voided diagnosis excluded)" "0|partial" "$(pbf $S PBF-10)"
check "PBF-11 not captured stays empty" "NULL|not captured" "$(pbf $S PBF-11)"
check "16 indicators every month" "16" "$(query pbf_indicators_monthly 'SELECT COUNT(*) FROM virtual_table' "WHERE period_start = '$S'")"

# The verification lines add up to the monthly totals for every indicator.
diff_rows="$(query pbf_indicator_lines "SELECT indicator_code || ':' || period_start || ':' || SUM(quantity) FROM virtual_table" 'GROUP BY indicator_code, period_start ORDER BY 1' | tr '\n' ';')"
monthly_rows="$(query pbf_indicators_monthly "SELECT indicator_code || ':' || period_start || ':' || value FROM virtual_table" "WHERE value > 0 ORDER BY 1" | tr '\n' ';')"
check "lines sum to monthly totals" "$monthly_rows" "$diff_rows"
check "lines carry the UVL ID" "UVL-2004" "$(query pbf_indicator_lines 'SELECT uvl_id FROM virtual_table' "WHERE indicator_code = 'PBF-04'")"

# MoH consultations.
check "MoH Sep consultations by age band" "2. 12-59 mois|M|Ancien cas;3. 5-14 ans|F|Non renseigné;4. 15 ans et plus|M|Nouveau cas;9. Âge inconnu|F|Non renseigné;" \
  "$(query moh_ambulatory_consultations 'SELECT age_band, sex, case_type FROM virtual_table' "WHERE period_start = '$S' ORDER BY age_band" | tr '\n' ';')"
check "MoH Aug infant" "1. 0-11 mois|Nouveau cas" "$(query moh_ambulatory_consultations 'SELECT age_band, case_type FROM virtual_table' "WHERE period_start = '$A'")"
check "MoH service point = most recent OPD consultation" "Consultation externe (OPD)" \
  "$(query moh_ambulatory_consultations 'SELECT service_point FROM virtual_table' 'WHERE visit_id = 2')"
check "MoH consultations equal PBF-01 (Sep)" "4" "$(query moh_ambulatory_consultations 'SELECT COUNT(*) FROM virtual_table' "WHERE period_start = '$S'")"
check "MoH morbidity Sep (confirmed only, once per visit)" "Malaria|2. 12-59 mois|M;Malaria|4. 15 ans et plus|M;" \
  "$(query moh_ambulatory_morbidity 'SELECT diagnosis, age_band, sex FROM virtual_table' "WHERE period_start = '$S' ORDER BY age_band" | tr '\n' ';')"

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
