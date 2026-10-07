#!/usr/bin/env bash
# Runs the visits dataset SQL (dashboard 4, chart 22; UVL-EMR#205, #222, #239)
# against a throwaway PostgreSQL loaded with fixtures/visits-analytics.sql
# (synthetic records only), and checks the new columns. Needs Docker.
#
#   scripts/superset/test-visits-sql.sh
#
# PG_IMAGE overrides the image (default postgres:13-alpine).
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
dataset="$repo/distro/configs/superset/assets/datasets/PostgreSQL/Patient_Analytics_Query_V4.yaml"
image="${PG_IMAGE:-postgres:13-alpine}"
name="uvl-visits-sql-test-$$"
work="$(mktemp -d)"

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT

# Prints the literal block scalar that follows `sql: |-`, without its indent.
awk '
  /^sql: \|-$/ { inside = 1; next }
  inside && /^[^ ]/ { exit }
  inside { sub(/^  /, ""); print }
' "$dataset" > "$work/visits.sql"
[ -s "$work/visits.sql" ] || { echo "FAIL: no sql block extracted"; exit 1; }

docker run -d --name "$name" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=analytics "$image" >/dev/null
for _ in $(seq 1 60); do
  docker exec "$name" psql -U postgres -d analytics -tAc 'SELECT 1' >/dev/null 2>&1 && break
  sleep 1
done

psql_run() { docker exec -i "$name" psql -U postgres -d analytics -v ON_ERROR_STOP=1 -tA -F '|' "$@"; }
psql_run -q < "$here/fixtures/visits-analytics.sql" >/dev/null

# Wraps the dataset query the way Superset does for a virtual dataset.
query() { # <outer select using virtual_table> [where/order]
  { printf '%s\n' "${1/FROM virtual_table/FROM (}"; cat "$work/visits.sql"; printf '\n) AS virtual_table %s\n' "${2:-}"; } | psql_run
}

failures=0
check() {
  if [ "$2" = "$3" ]; then echo "ok   $1 = $3"; else echo "FAIL $1: expected [$2], got [$3]"; failures=$((failures + 1)); fi
}
col() { # <visit id> <column>
  query "SELECT \"$2\" FROM virtual_table" "WHERE \"ID de visite\" = $1"
}

check "voided visits excluded" "4" "$(query 'SELECT COUNT(*) FROM virtual_table')"
check "v1 Lieu d'accueil" "Accueil-Triage (REG-TRI)" "$(col 1 "Lieu d'accueil")"
check "v1 Lieu de consultation (OPD before IPD)" "Bureau médical (MedCo)" "$(col 1 'Lieu de consultation')"
check "v1 Lieux de soins" "Accueil-Triage (REG-TRI), Bureau médical (MedCo), Hospitalisation (IPD)" "$(col 1 'Lieux de soins')"
check "v1 Médecin traitant (voided provider dropped)" "Docteur Alpha" "$(col 1 'Médecin traitant')"
check "v1 Prescripteur(s)" "Docteur Alpha; Docteur Beta" "$(col 1 'Prescripteur(s)')"
check "v1 ID du patient" "UVL-1001" "$(col 1 'ID du patient')"
check "v1 Prénom|Nom" "Testa|Alpha" "$(query 'SELECT "Prénom", "Nom" FROM virtual_table' 'WHERE "ID de visite" = 1')"
check "v1 CNI Burundi" "12.345/678.901" "$(col 1 'CNI Burundi')"
check "v1 Legacy ID" "OLD-77" "$(col 1 'Ancien ID (Legacy ID)')"
check "v1 Chef de ménage" "Testeur Chef" "$(col 1 'Chef de ménage')"
check "v1 Taux de couverture" "Insurance 80%" "$(col 1 'Taux de couverture')"
check "v1 Type de cas|Type de consultation|Catégorie" "New case|General consultation|Infectious" \
  "$(query 'SELECT "Type de cas", "Type de consultation", "Catégorie de maladie" FROM virtual_table' 'WHERE "ID de visite" = 1')"
check "v1 Assurance (payer)" "Supplementary insurance" "$(col 1 'Assurance')"
check "v1 Assurance complémentaire" "Supplementary insurance" "$(col 1 'Assurance complémentaire')"
check "v1 Liste de prix Odoo" "Insurance 80%" "$(col 1 'Liste de prix Odoo')"
check "v1 confirmed diagnoses" "Malaria" "$(col 1 'Liste des diagnostics confirmés')"
check "v1 lab and drug cost" "2000|1000" "$(query 'SELECT "Coût des examens de laboratoire", "Coût des médicaments" FROM virtual_table' 'WHERE "ID de visite" = 1')"
check "v2 Lieu de consultation (most recent OPD, voided ignored)" "Consultation externe (OPD)" "$(col 2 'Lieu de consultation')"
check "v2 Médecin traitant" "Docteur Beta" "$(col 2 'Médecin traitant')"
check "v2 Prénom (given + middle)" "Testb Mid" "$(col 2 'Prénom')"
check "v2 Assurance|complémentaire" "CAM|-" "$(query 'SELECT "Assurance", "Assurance complémentaire" FROM virtual_table' 'WHERE "ID de visite" = 2')"
check "v2 CNI absent" "-" "$(col 2 'CNI Burundi')"
check "v3 no consultation" "-|-" "$(query 'SELECT "Lieu de consultation", "Médecin traitant" FROM virtual_table' 'WHERE "ID de visite" = 3')"
check "v3 OpenMRS ID, no UVL ID" "10003-X" "$(col 3 'ID OpenMRS')"
check "v3 Chef de ménage absent" "-" "$(col 3 'Chef de ménage')"
check "v3 Assurance with no payer and no pricelist" "-" "$(col 3 'Assurance')"
check "v5 inpatient fallback" "Hospitalisation (IPD)|Docteur Beta" "$(query 'SELECT "Lieu de consultation", "Médecin traitant" FROM virtual_table' 'WHERE "ID de visite" = 5')"

# The dashboard's date filter applies to "Date de visite".
check "date filter column" "2" "$(query 'SELECT COUNT(*) FROM virtual_table' "WHERE \"Date de visite\" >= '2026-09-11' AND \"Date de visite\" < '2026-09-13'")"

# Every column the chart lists must exist in the dataset output.
chart="$repo/distro/configs/superset/assets/charts/Patient_Analytics_Query_Chart_V5_22.yaml"
got_cols="$({ printf 'SELECT * FROM (\n'; cat "$work/visits.sql"; printf '\n) AS virtual_table LIMIT 0\n'; } | docker exec -i "$name" psql -U postgres -d analytics -v ON_ERROR_STOP=1 -A -F '|' | head -1)"
missing=0
while IFS= read -r c; do
  case "|$got_cols|" in *"|$c|"*) ;; *) echo "FAIL chart column missing from dataset: $c"; missing=$((missing + 1));; esac
done < <(awk '/^  all_columns:/ { inside = 1; next } inside && /^  [^ -]/ { exit } inside { sub(/^  - /, ""); gsub(/^"|"$/, ""); print }' "$chart")
check "chart 22 columns all present" "0" "$missing"

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
