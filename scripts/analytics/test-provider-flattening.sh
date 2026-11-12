#!/usr/bin/env bash
# Checks the provider flattening queries (UVL-EMR#222, #205) against MySQL:
# builds the source tables from the Flink table definitions the job uses,
# loads synthetic rows, runs encounter_providers.sql and providers.sql, and
# compares the output column order with the Liquibase changelog that creates
# the analytics tables (the flattening job inserts by position). Needs Docker.
#
# This is a stand-in for the Flink job: it proves the queries reference real
# columns and return the right shape, not that Flink accepts every construct.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
dsl="$repo/distro/configs/analytics/dsl/flattening"
changelog="$repo/distro/configs/analytics/liquibase/analytics/changelogs/0005-encounter_providers_tbl.xml"
name="uvl-flatten-test-$$"
image="${MYSQL_IMAGE:-mysql:8.0}"

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$name" -e MYSQL_ROOT_PASSWORD=test -e MYSQL_DATABASE=openmrs "$image" >/dev/null
for _ in $(seq 1 90); do
  docker exec "$name" mysql -uroot -ptest -e 'SELECT 1' openmrs >/dev/null 2>&1 && break
  sleep 2
done
my() { docker exec -i "$name" mysql -uroot -ptest --batch openmrs 2>/dev/null; }

# Flink DDL -> MySQL DDL.
to_mysql() { sed -e 's/ NOT ENFORCED//' -e 's/VARCHAR/VARCHAR(255)/g' -e 's/`uuid` char/`uuid` CHAR(38)/' "$1"; printf ';\n'; }

{
  for t in encounter_provider provider encounter_role; do to_mysql "$dsl/tables/openmrs/$t.sql"; done
  # Base Ozone tables the queries join (only the columns they use).
  cat <<'SQL'
CREATE TABLE encounter (encounter_id int PRIMARY KEY, uuid VARCHAR(38));
CREATE TABLE person (person_id int PRIMARY KEY, uuid VARCHAR(38));
CREATE TABLE person_name (person_name_id int PRIMARY KEY, preferred BOOLEAN, person_id int,
  given_name VARCHAR(255), family_name VARCHAR(255), voided BOOLEAN);
INSERT INTO encounter VALUES (1, 'e-1'), (2, 'e-2');
INSERT INTO person VALUES (10, 'per-10'), (11, 'per-11');
INSERT INTO person_name VALUES (100, true, 10, 'Docteur', 'Alpha', false),
  (101, false, 10, 'Old', 'Name', false), (102, true, 11, 'Voided', 'Name', true);
INSERT INTO provider (provider_id, person_id, name, identifier, retired, uuid) VALUES
  (1, 10, NULL, 'DR-1', false, 'prov-1'), (2, 11, 'Provider Sans Nom', 'DR-2', false, 'prov-2');
INSERT INTO encounter_role (encounter_role_id, name, retired, uuid) VALUES (1, 'Clinician', false, 'role-1');
INSERT INTO encounter_provider (encounter_provider_id, encounter_id, provider_id, encounter_role_id, voided, uuid) VALUES
  (1000, 1, 1, 1, false, 'ep-1'), (1001, 2, 2, 1, true, 'ep-2');
SQL
} | my

failures=0
check() { if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1: expected [$2], got [$3]"; failures=$((failures + 1)); fi; }

liquibase_cols() { # <table>
  awk -v t="$1" '$0 ~ "createTable tableName=\""t"\"" { inside = 1; next } inside && /<\/createTable>/ { exit }
    inside && /<column name=/ { match($0, /name="[^"]+"/); print substr($0, RSTART + 6, RLENGTH - 7) }' "$changelog" | paste -sd, -
}

out="$(my < "$dsl/queries/encounter_providers.sql")"
check "encounter_providers column order matches Liquibase" "$(liquibase_cols encounter_providers)" "$(head -1 <<<"$out" | tr '\t' ',')"
check "encounter_providers rows" $'1000\te-1\t1\tprov-1\tDocteur Alpha\tClinician\t0\n1001\te-2\t2\tprov-2\tProvider Sans Nom\tClinician\t1' "$(tail -n +2 <<<"$out")"

out="$(my < "$dsl/queries/providers.sql")"
check "providers column order matches Liquibase" "$(liquibase_cols providers)" "$(head -1 <<<"$out" | tr '\t' ',')"
check "providers rows" $'1\tprov-1\tper-10\tDocteur Alpha\tDR-1\t0\n2\tprov-2\tper-11\tProvider Sans Nom\tDR-2\t0' "$(tail -n +2 <<<"$out")"

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
