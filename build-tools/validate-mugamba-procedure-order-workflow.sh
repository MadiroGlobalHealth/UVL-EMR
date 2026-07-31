#!/usr/bin/env bash
set -euo pipefail

# Fail-closed live workflow validator for the local Mugamba demo stack.
#
# This script proves the real synthetic path:
# OpenMRS patient -> visit -> order encounter -> Procedure order -> EIP -> Odoo sale order
# -> Odoo invoice.
#
# It intentionally uses live OpenMRS/Odoo APIs and the live Odoo PostgreSQL database.
# It does not use fixtures or mocked state.

OPENMRS_BASE_URL="${OPENMRS_BASE_URL:-http://localhost/openmrs}"
OPENMRS_USER="${OPENMRS_USER:-admin}"
OPENMRS_PASSWORD="${OPENMRS_PASSWORD:-Admin123}"
ODOO_URL="${ODOO_URL:-http://localhost:8069}"
ODOO_DB="${ODOO_DB:-odoo}"
ODOO_USER="${ODOO_USER:-admin}"
ODOO_PASSWORD="${ODOO_PASSWORD:-admin}"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-ozone-uvl-mugamba}"

python3 - <<'PY'
import base64
import datetime as dt
import json
import os
import shlex
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xmlrpc.client

openmrs_base = os.environ.get("OPENMRS_BASE_URL", "http://localhost/openmrs").rstrip("/")
openmrs_user = os.environ.get("OPENMRS_USER", "admin")
openmrs_password = os.environ.get("OPENMRS_PASSWORD", "Admin123")
odoo_url = os.environ.get("ODOO_URL", "http://localhost:8069").rstrip("/")
odoo_db = os.environ.get("ODOO_DB", "odoo")
odoo_user = os.environ.get("ODOO_USER", "admin")
odoo_password = os.environ.get("ODOO_PASSWORD", "admin")
compose_project = os.environ.get("COMPOSE_PROJECT", "ozone-uvl-mugamba")

patient_family = "WorkflowE2E"
run_id = str(int(time.time()))
patient_identifier = f"CX-WF-{run_id}"

auth_header = "Basic " + base64.b64encode(f"{openmrs_user}:{openmrs_password}".encode()).decode()


def request_json(method, path, payload=None, timeout=60):
    url = f"{openmrs_base}/ws/rest/v1{path}"
    headers = {"Authorization": auth_header, "Accept": "application/json"}
    data = None
    if payload is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode()
            return response.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode(errors="replace")
        raise RuntimeError(f"{method} {path} failed with HTTP {exc.code}: {body[:2000]}") from exc


def psql(query):
    cmd = [
        "docker",
        "exec",
        f"{compose_project}-postgresql-1",
        "sh",
        "-lc",
        "PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -d odoo -t -A -F '|' -c "
        + shlex.quote(query),
    ]
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return [line.split("|") for line in result.stdout.splitlines() if line.strip()]


def wait_for_sale_order(visit_uuid, timeout_seconds=180):
    deadline = time.time() + timeout_seconds
    query = f"""
        select so.id, so.name, so.partner_id, rp.name, so.pricelist_id,
               pp.name::text, so.client_order_ref, so.amount_total, so.state, so.invoice_status
        from sale_order so
        join res_partner rp on rp.id = so.partner_id
        join product_pricelist pp on pp.id = so.pricelist_id
        where so.client_order_ref = '{visit_uuid}'
        order by so.id desc
        limit 1;
    """
    while time.time() < deadline:
        rows = psql(query)
        if rows:
            return rows[0]
        time.sleep(5)
    raise RuntimeError(f"Timed out waiting for Odoo sale_order with client_order_ref={visit_uuid}")


def sale_line_for_order(sale_order_id):
    rows = psql(
        f"""
        select sol.id, sol.order_id, sol.name, sol.product_id, sol.product_uom_qty,
               sol.price_unit, sol.price_subtotal, sol.price_total
        from sale_order_line sol
        where sol.order_id = {int(sale_order_id)}
        order by sol.id desc
        limit 1;
        """
    )
    if not rows:
        raise RuntimeError(f"No sale_order_line found for sale_order id {sale_order_id}")
    return rows[0]


def invoice_for_sale_order(origin):
    rows = psql(
        f"""
        select am.id, am.name, am.move_type, am.invoice_origin, am.amount_total,
               am.state, am.payment_state
        from account_move am
        where am.invoice_origin = '{origin}'
        order by am.id desc
        limit 1;
        """
    )
    if not rows:
        raise RuntimeError(f"No account_move invoice found for origin {origin}")
    return rows[0]


def assert_contains(value, expected, label):
    if expected not in value:
        raise RuntimeError(f"{label} expected to contain {expected!r}, got {value!r}")


now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+0000")

common = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/common")
uid = common.authenticate(odoo_db, odoo_user, odoo_password, {})
if not uid:
    raise RuntimeError("Could not authenticate to Odoo XML-RPC")
models = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/object", allow_none=True)

patient_payload = {
    "person": {
        "names": [{"givenName": "Codex", "familyName": patient_family}],
        "gender": "M",
        "birthdate": "1990-01-01",
        "addresses": [{"address1": "Synthetic local test"}],
    },
    "identifiers": [
        {
            "identifier": patient_identifier,
            "identifierType": "05a29f94-c0ed-11e2-94be-8c13b969e334",
            "location": "EBE3BE01-BA1C-0FDD-0B19-9DB2F07EA7DB",
            "preferred": True,
        }
    ],
}

_, patient = request_json("POST", "/patient", patient_payload)
patient_uuid = patient["uuid"]

_, visit = request_json(
    "POST",
    "/visit",
    {
        "patient": patient_uuid,
        "visitType": "31fe9bef-4b22-4686-acb2-4ecce1fdd8b9",
        "location": "44c3efb0-2583-4c80-a79e-1f756a03c0a1",
        "startDatetime": now,
    },
)
visit_uuid = visit["uuid"]

_, encounter = request_json(
    "POST",
    "/encounter",
    {
        "patient": patient_uuid,
        "encounterType": "39da3525-afe4-45ff-8977-c53b7b359158",
        "encounterDatetime": now,
        "location": "44c3efb0-2583-4c80-a79e-1f756a03c0a1",
        "visit": visit_uuid,
        "encounterProviders": [
            {
                "provider": "361ebccc-0992-46c5-a99f-ac523bed386e",
                "encounterRole": "240b26f9-dd88-4172-823d-4a8bfeb7841f",
            }
        ],
    },
)
encounter_uuid = encounter["uuid"]

_, order = request_json(
    "POST",
    "/order",
    {
        "type": "testorder",
        "patient": patient_uuid,
        "concept": "4d713ce0-419e-4635-bb58-3654eeb533f4",
        "encounter": encounter_uuid,
        "orderer": "361ebccc-0992-46c5-a99f-ac523bed386e",
        "careSetting": "6f0c9a92-6f24-11e3-af88-005056821db0",
        "orderType": "67a92e56-0f88-11ea-8d71-362b9e155667",
        "action": "NEW",
        "urgency": "ROUTINE",
    },
)
order_uuid = order["uuid"]
order_number = order["orderNumber"]

sale_order = wait_for_sale_order(visit_uuid)
sale_order_id, sale_order_name, partner_id, partner_name, pricelist_id, pricelist_name, client_ref, amount_total, state, invoice_status = sale_order

assert_contains(partner_name, patient_family, "Odoo partner name")
assert_contains(pricelist_name, "Insurance 100%", "Odoo pricelist")
if client_ref != visit_uuid:
    raise RuntimeError(f"sale_order client_order_ref mismatch: expected {visit_uuid}, got {client_ref}")

partner = models.execute_kw(
    odoo_db,
    uid,
    odoo_password,
    "res.partner",
    "read",
    [[int(partner_id)], ["property_product_pricelist"]],
)[0]
partner_pricelist = partner.get("property_product_pricelist")
if not partner_pricelist or "Insurance 100%" not in partner_pricelist[1]:
    raise RuntimeError(f"Expected synced Odoo patient partner pricelist Insurance 100%, got {partner_pricelist!r}")

sale_line = sale_line_for_order(sale_order_id)
if "Vital Signs Check" not in sale_line[2]:
    raise RuntimeError(f"Expected Vital Signs Check sale line, got {sale_line[2]!r}")

if state == "draft":
    models.execute_kw(odoo_db, uid, odoo_password, "sale.order", "action_confirm", [[int(sale_order_id)]])

current = models.execute_kw(
    odoo_db,
    uid,
    odoo_password,
    "sale.order",
    "read",
    [[int(sale_order_id)]],
    {"fields": ["state", "invoice_status", "invoice_ids", "name"]},
)[0]

if not current.get("invoice_ids"):
    wizard_id = models.execute_kw(
        odoo_db,
        uid,
        odoo_password,
        "sale.advance.payment.inv",
        "create",
        [{"advance_payment_method": "delivered"}],
        {"context": {"active_model": "sale.order", "active_ids": [int(sale_order_id)], "active_id": int(sale_order_id)}},
    )
    try:
        models.execute_kw(
            odoo_db,
            uid,
            odoo_password,
            "sale.advance.payment.inv",
            "create_invoices",
            [[wizard_id]],
            {"context": {"active_model": "sale.order", "active_ids": [int(sale_order_id)], "active_id": int(sale_order_id)}},
        )
    except (TypeError, xmlrpc.client.Fault) as exc:
        # Odoo may return an action containing None, which the stdlib XML-RPC encoder dislikes.
        # Treat database state below as the source of truth.
        if "cannot marshal None" not in str(exc):
            raise

invoice = invoice_for_sale_order(sale_order_name)

print("[pass] Mugamba Procedure-order workflow evidence is present.")
print(f"patient_identifier={patient_identifier}")
print(f"patient_uuid={patient_uuid}")
print(f"visit_uuid={visit_uuid}")
print(f"encounter_uuid={encounter_uuid}")
print(f"order_uuid={order_uuid}")
print(f"order_number={order_number}")
print(f"sale_order={sale_order_name}")
print(f"sale_order_partner={partner_name}")
print(f"partner_pricelist={partner_pricelist[1]}")
print(f"sale_order_pricelist={pricelist_name}")
print(f"sale_order_amount_total={amount_total}")
print(f"sale_line={sale_line[2]}")
print(f"invoice={invoice[1]}")
print(f"invoice_origin={invoice[3]}")
print(f"invoice_amount_total={invoice[4]}")
print(f"invoice_state={invoice[5]}")
PY
