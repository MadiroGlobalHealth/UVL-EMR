#!/usr/bin/env bash
set -euo pipefail

PROJECT="${PROJECT:-ozone-uvl-mugamba}"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-${PROJECT}-mysql-1}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-${PROJECT}-postgresql-1}"

mysql_query() {
  docker exec "${MYSQL_CONTAINER}" sh -c "mysql -uopenmrs -p\${OPENMRS_DB_PASSWORD:-password} openmrs -N -e \"$1\""
}

postgres_query() {
  docker exec "${POSTGRES_CONTAINER}" sh -c "psql -U odoo -d odoo -At -c \"$1\""
}

assert_equals() {
  local expected="$1"
  local actual="$2"
  local label="$3"

  if [[ "${actual}" != "${expected}" ]]; then
    echo "[fail] ${label}: expected ${expected}, got ${actual}" >&2
    exit 1
  fi
}

echo "[openmrs] payment modes"
mysql_query "select payment_mode_id, name, uuid from cashier_payment_mode order by payment_mode_id;"
assert_equals "1" "$(mysql_query "select count(*) from cashier_payment_mode where uuid = '94bd1d63-fe27-48a0-9a1b-d536c0ab3944' and name = 'Insured Cost';")" "OpenMRS Insured Cost payment mode"
assert_equals "1" "$(mysql_query "select count(*) from cashier_payment_mode where uuid = 'fcf90cf7-7852-4bd5-a8b5-32f2ba8806ec' and name = 'Non-Insured Cost';")" "OpenMRS Non-Insured Cost payment mode"

echo "[openmrs] item prices by payment mode"
mysql_query "select pm.payment_mode_id, pm.name, count(*) from cashier_item_price cip join cashier_payment_mode pm on pm.payment_mode_id = cip.payment_mode group by pm.payment_mode_id, pm.name order by pm.payment_mode_id;"
assert_equals "182" "$(mysql_query "select count(*) from cashier_item_price cip join cashier_payment_mode pm on pm.payment_mode_id = cip.payment_mode where pm.uuid = '94bd1d63-fe27-48a0-9a1b-d536c0ab3944';")" "OpenMRS insured item prices"
assert_equals "182" "$(mysql_query "select count(*) from cashier_item_price cip join cashier_payment_mode pm on pm.payment_mode_id = cip.payment_mode where pm.uuid = 'fcf90cf7-7852-4bd5-a8b5-32f2ba8806ec';")" "OpenMRS non-insured item prices"

echo "[openmrs] mugamba liquibase changesets"
mysql_query "select id, author, filename, exectype from liquibasechangelog where id in ('add_item_prices', 'add_serial_object_', 'add_reporting_report_request', 'add_reporting_report_design') order by id;"
assert_equals "1" "$(mysql_query "select count(*) from liquibasechangelog where id = 'add_item_prices' and exectype in ('EXECUTED', 'MARK_RAN');")" "OpenMRS add_item_prices changeset"

echo "[odoo] insurance pricelists"
postgres_query "select id, name::text, active from product_pricelist where name::text ilike '%Insurance%' or name::text ilike '%Insured%' order by id;"

echo "[odoo] insurance pricelist items"
postgres_query "select pp.name::text, ppi.applied_on, ppi.compute_price, ppi.percent_price from product_pricelist_item ppi join product_pricelist pp on pp.id = ppi.pricelist_id where pp.name::text ilike '%Insurance%' or pp.name::text ilike '%Insured%' order by pp.name::text, ppi.id;"

for percentage in 50 60 70 80 90 100; do
  assert_equals "1" "$(postgres_query "select count(*) from product_pricelist where name->>'en_US' = 'Insurance ${percentage}%';")" "Odoo Insurance ${percentage}% pricelist"
  assert_equals "1" "$(postgres_query "select count(*) from product_pricelist_item ppi join product_pricelist pp on pp.id = ppi.pricelist_id where pp.name->>'en_US' = 'Insurance ${percentage}%' and ppi.compute_price = 'percentage' and ppi.percent_price = ${percentage};")" "Odoo Insurance ${percentage}% percentage rule"
done

assert_equals "1" "$(postgres_query "select count(*) from product_pricelist where name->>'en_US' = 'Insurance 100%' and sequence < all (select sequence from product_pricelist where name->>'en_US' in ('Insurance 50%', 'Insurance 60%', 'Insurance 70%', 'Insurance 80%', 'Insurance 90%'));")" "Odoo Insurance 100% deterministic fallback priority"

python3 - <<'PY'
import os
import sys
import xmlrpc.client

odoo_url = os.environ.get("ODOO_URL", "http://localhost:8069").rstrip("/")
odoo_db = os.environ.get("ODOO_DB", "odoo")
odoo_user = os.environ.get("ODOO_USER", "admin")
odoo_password = os.environ.get("ODOO_PASSWORD", "admin")

common = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/common")
uid = common.authenticate(odoo_db, odoo_user, odoo_password, {})
if not uid:
  print("[fail] Could not authenticate to Odoo XML-RPC", file=sys.stderr)
  sys.exit(1)

models = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/object")
partner_id = models.execute_kw(
  odoo_db,
  uid,
  odoo_password,
  "res.partner",
  "create",
  [{"name": "Codex Pricelist Fallback Validator"}],
)
partner = models.execute_kw(
  odoo_db,
  uid,
  odoo_password,
  "res.partner",
  "read",
  [[partner_id], ["property_product_pricelist"]],
)[0]
pricelist = partner.get("property_product_pricelist")
if not pricelist or "Insurance 100%" not in pricelist[1]:
  print(f"[fail] New Odoo partner fallback pricelist expected Insurance 100%, got {pricelist!r}", file=sys.stderr)
  sys.exit(1)

models.execute_kw(odoo_db, uid, odoo_password, "res.partner", "unlink", [[partner_id]])
print("[odoo] new partner fallback pricelist:", pricelist[1])
PY

echo "[pass] Mugamba insurance bootstrap evidence is present."
