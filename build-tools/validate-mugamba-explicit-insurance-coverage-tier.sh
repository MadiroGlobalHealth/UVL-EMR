#!/usr/bin/env bash
set -euo pipefail

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

PERSON_ATTRIBUTE_TYPE_UUID = "9816ffad-781b-423f-a21d-1ab06afb4dcc"
INSURANCE_TIER_SET_UUID = "e8ebb02b-5b87-4997-801c-a606ee471204"
INSURANCE_TIER_CONCEPTS = {
    "Insurance 50%": "1133ae34-0581-4be5-811c-dfd77a8970ff",
    "Insurance 60%": "608471b2-f62b-4e99-8c0f-b836e13e5e8c",
    "Insurance 70%": "1eef7fe1-45bd-43c7-a44c-9930bed4af2a",
    "Insurance 80%": "0fe17a13-98f9-432b-b930-b9d694f454bf",
    "Insurance 90%": "3b1f57fd-bed4-4533-b607-e2a06925c5aa",
    "Insurance 100%": "107e6a2e-1178-4b22-81d0-f7388185063f",
}
TEST_ORDER_CONCEPT_UUID = "4d713ce0-419e-4635-bb58-3654eeb533f4"
ORDER_TYPE_UUID = "67a92e56-0f88-11ea-8d71-362b9e155667"
CARE_SETTING_UUID = "6f0c9a92-6f24-11e3-af88-005056821db0"
VISIT_TYPE_UUID = "31fe9bef-4b22-4686-acb2-4ecce1fdd8b9"
ENCOUNTER_TYPE_UUID = "39da3525-afe4-45ff-8977-c53b7b359158"
LOCATION_UUID = "44c3efb0-2583-4c80-a79e-1f756a03c0a1"
IDENTIFIER_TYPE_UUID = "05a29f94-c0ed-11e2-94be-8c13b969e334"
IDENTIFIER_LOCATION_UUID = "EBE3BE01-BA1C-0FDD-0B19-9DB2F07EA7DB"
PROVIDER_UUID = "361ebccc-0992-46c5-a99f-ac523bed386e"
ENCOUNTER_ROLE_UUID = "240b26f9-dd88-4172-823d-4a8bfeb7841f"

auth_header = "Basic " + base64.b64encode(f"{openmrs_user}:{openmrs_password}".encode()).decode()
run_id = str(int(time.time()))
patient_identifier = f"CX-UVL002-{run_id}"
patient_family = "InsuranceTierE2E"
patient_given = "Codex"
initial_tier = os.environ.get("INITIAL_TIER", "50")
initial_tier_label = f"Insurance {initial_tier}%"
if initial_tier_label not in INSURANCE_TIER_CONCEPTS:
    raise RuntimeError(f"INITIAL_TIER must be one of 50, 60, 70, 80, 90, 100; got {initial_tier!r}")
run_started = time.time()


def checkpoint(step, message):
    print(f"[{step}/12] {message}", flush=True)


def elapsed_seconds():
    return int(time.time() - run_started)


def request_json(method, path, payload=None, timeout=60, expect=None):
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
            if expect is not None and response.status != expect:
                raise RuntimeError(f"{method} {path} expected HTTP {expect}, got {response.status}: {body[:2000]}")
            return response.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode(errors="replace")
        if expect is not None and exc.code == expect:
            return exc.code, json.loads(body) if body else {"raw": body}
        raise RuntimeError(f"{method} {path} failed with HTTP {exc.code}: {body[:2000]}") from exc


def request_text(url, timeout=60):
    req = urllib.request.Request(url, headers={"Authorization": auth_header, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.status, response.read().decode()


def psql_odoo(query):
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


def mysql_openmrs(query):
    cmd = [
        "docker",
        "exec",
        f"{compose_project}-mysql-1",
        "sh",
        "-lc",
        "mysql -uopenmrs -ppassword openmrs -N -B -e " + shlex.quote(query),
    ]
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return [line.split("\t") for line in result.stdout.splitlines() if line.strip()]


def wait_for_openmrs():
    deadline = time.time() + 600
    last_error = None
    while time.time() < deadline:
        try:
            status, payload = request_json("GET", "/session", timeout=20)
            if status == 200 and payload.get("authenticated"):
                return payload
        except Exception as exc:
            last_error = exc
        print(f"  waiting for OpenMRS... elapsed={elapsed_seconds()}s last_error={last_error}", flush=True)
        time.sleep(5)
    raise RuntimeError(f"OpenMRS did not become ready within 600 seconds: {last_error}")


def assert_equals(actual, expected, label):
    if actual != expected:
        raise RuntimeError(f"{label} expected {expected!r}, got {actual!r}")


def assert_contains(actual, expected, label):
    if expected not in actual:
        raise RuntimeError(f"{label} expected to contain {expected!r}, got {actual!r}")


def assert_pricelist_cardinality(name):
    rows = psql_odoo(
        f"""
        select id, name::text
        from product_pricelist
        where name->>'en_US' = '{name}'
        order by id;
        """
    )
    if len(rows) != 1:
        raise RuntimeError(f"Expected exactly one Odoo pricelist named {name}, found {len(rows)} rows: {rows!r}")
    return int(rows[0][0])


def pricelist_name_by_id(pricelist_id):
    rows = psql_odoo(
        f"""
        select id, name->>'en_US'
        from product_pricelist
        where id = {int(pricelist_id)}
        order by id;
        """
    )
    if len(rows) != 1:
        raise RuntimeError(f"Expected exactly one Odoo pricelist with id={pricelist_id}, found {len(rows)} rows: {rows!r}")
    return rows[0][1]


def insurance_concept_answers():
    _, payload = request_json("GET", f"/concept/{INSURANCE_TIER_SET_UUID}?v=full")
    answers = payload.get("answers", [])
    result = {}
    for answer in answers:
        concept = answer.get("answerConcept") or answer
        if concept.get("display"):
            result[concept["display"]] = concept.get("uuid")
    return result


def get_patient_by_uuid(patient_uuid):
    _, payload = request_json("GET", f"/patient/{patient_uuid}?v=full")
    return payload


def get_person_attribute(patient_uuid, attribute_type_uuid):
    patient = get_patient_by_uuid(patient_uuid)
    matches = [attr for attr in patient["person"].get("attributes", []) if attr["attributeType"]["uuid"] == attribute_type_uuid]
    if not matches:
        raise RuntimeError(f"Patient {patient_uuid} is missing person attribute type {attribute_type_uuid}")
    if len(matches) > 1:
        raise RuntimeError(f"Patient {patient_uuid} has multiple values for person attribute type {attribute_type_uuid}: {matches!r}")
    return matches[0]


def set_person_attribute(patient_uuid, value_uuid):
    person_uuid = get_patient_by_uuid(patient_uuid)["person"]["uuid"]
    existing = get_person_attribute(patient_uuid, PERSON_ATTRIBUTE_TYPE_UUID)
    payload = {"attributeType": PERSON_ATTRIBUTE_TYPE_UUID, "hydratedObject": value_uuid, "value": value_uuid}
    _, updated = request_json("POST", f"/person/{person_uuid}/attribute/{existing['uuid']}", payload)
    return updated


def add_person_attribute(patient_uuid, value_uuid):
    person_uuid = get_patient_by_uuid(patient_uuid)["person"]["uuid"]
    payload = {"attributeType": PERSON_ATTRIBUTE_TYPE_UUID, "hydratedObject": value_uuid, "value": value_uuid}
    _, created = request_json("POST", f"/person/{person_uuid}/attribute", payload)
    return created


def fetch_fhir_patient(patient_uuid):
    status, body = request_text(f"{openmrs_base}/ws/fhir2/R4/Patient/{patient_uuid}")
    if status != 200:
        raise RuntimeError(f"FHIR Patient/{patient_uuid} expected HTTP 200, got {status}")
    return json.loads(body)


def fhir_insurance_label(fhir_patient):
    for extension in fhir_patient.get("extension", []):
        if extension.get("url") != "http://fhir.openmrs.org/ext/person-attribute":
            continue
        attr_name = None
        attr_value = None
        for nested in extension.get("extension", []):
            if nested.get("url") == "http://fhir.openmrs.org/ext/person-attribute-type":
                attr_name = nested.get("valueString")
            elif nested.get("url") == "http://fhir.openmrs.org/ext/person-attribute-value":
                attr_value = nested
        if attr_name == "Insurance Coverage Tier":
            concept = attr_value.get("valueCodeableConcept", {})
            if concept.get("text"):
                return concept["text"]
            coding = concept.get("coding", [])
            if coding and coding[0].get("display"):
                return coding[0]["display"]
    raise RuntimeError("FHIR patient does not expose Insurance Coverage Tier person attribute")


def fhir_has_insurance_extension(fhir_patient):
    for extension in fhir_patient.get("extension", []):
        if extension.get("url") != "http://fhir.openmrs.org/ext/person-attribute":
            continue
        for nested in extension.get("extension", []):
            if nested.get("url") == "http://fhir.openmrs.org/ext/person-attribute-type" and nested.get("valueString") == "Insurance Coverage Tier":
                return True
    return False


def attribute_audit_info(attribute):
    audit = attribute.get("auditInfo") or {}
    return {
        "uuid": attribute.get("uuid"),
        "display": attribute.get("display"),
        "creator": (audit.get("creator") or {}).get("display"),
        "dateCreated": audit.get("dateCreated"),
        "changedBy": (audit.get("changedBy") or {}).get("display"),
        "dateChanged": audit.get("dateChanged"),
    }


def attribute_audit_info_db(attribute_uuid):
    rows = mysql_openmrs(
        f"""
        select pa.uuid,
               pa.creator,
               creator.username,
               pa.date_created,
               pa.changed_by,
               changer.username,
               pa.date_changed,
               pa.value
        from person_attribute pa
        join users creator on creator.user_id = pa.creator
        left join users changer on changer.user_id = pa.changed_by
        where pa.uuid = '{attribute_uuid}'
        """
    )
    if len(rows) != 1:
        raise RuntimeError(f"Expected exactly one person_attribute row for uuid={attribute_uuid}, got {rows!r}")
    row = rows[0]
    return {
        "uuid": row[0],
        "creatorId": row[1],
        "creator": row[2],
        "dateCreated": row[3],
        "changedById": row[4],
        "changedBy": row[5],
        "dateChanged": row[6],
        "value": row[7],
    }


def odoo_partner_for_patient(patient_uuid):
    partners = models.execute_kw(
        odoo_db,
        uid,
        odoo_password,
        "res.partner",
        "search_read",
        [[["ref", "=", patient_uuid]]],
        {"fields": ["id", "name", "ref", "property_product_pricelist"], "limit": 2},
    )
    if len(partners) != 1:
        raise RuntimeError(f"Expected exactly one Odoo partner for ref={patient_uuid}, got {partners!r}")
    return partners[0]


def partner_pricelist_name(patient_uuid):
    partner = odoo_partner_for_patient(patient_uuid)
    pricelist = partner.get("property_product_pricelist")
    if not pricelist:
        raise RuntimeError(f"Odoo partner {patient_uuid} is missing property_product_pricelist")
    return partner, pricelist_name_by_id(pricelist[0])


def wait_for_partner_pricelist(patient_uuid, expected_name, expected_id=None, timeout_seconds=240):
    deadline = time.time() + timeout_seconds
    last_seen = None
    while time.time() < deadline:
        try:
            partner = odoo_partner_for_patient(patient_uuid)
            pricelist = partner.get("property_product_pricelist")
            if pricelist:
                actual_id = pricelist[0]
                actual_name = pricelist_name_by_id(actual_id)
                if expected_id is not None and actual_id == expected_id and actual_name == expected_name:
                    return partner
                if expected_id is None and actual_name == expected_name:
                    return partner
                last_seen = {"id": actual_id, "display": pricelist[1], "canonical_name": actual_name}
            else:
                last_seen = pricelist
        except RuntimeError as exc:
            last_seen = str(exc)
        print(
            f"  waiting for Odoo partner pricelist patient={patient_uuid} expected={expected_name} expected_id={expected_id} elapsed={elapsed_seconds()}s last_seen={last_seen!r}",
            flush=True,
        )
        time.sleep(5)
    raise RuntimeError(
        f"Timed out waiting for Odoo partner {patient_uuid} pricelist {expected_name} id={expected_id}; last seen {last_seen!r}"
    )


def recent_eip_log_contains(snippet, since="5m"):
    cmd = [
        "docker",
        "logs",
        "--since",
        since,
        f"{compose_project}-eip-odoo-openmrs-1",
    ]
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return snippet in result.stdout


def recent_openmrs_log_contains(snippet, since="5m"):
    cmd = [
        "docker",
        "logs",
        "--since",
        since,
        f"{compose_project}-openmrs-1",
    ]
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return snippet in result.stdout


def wait_for_sale_order(visit_uuid, timeout_seconds=240):
    deadline = time.time() + timeout_seconds
    query = f"""
        select so.id, so.name, so.partner_id, rp.name, so.pricelist_id,
               pp.name->>'en_US', so.client_order_ref, so.amount_total, so.state, so.invoice_status
        from sale_order so
        join res_partner rp on rp.id = so.partner_id
        join product_pricelist pp on pp.id = so.pricelist_id
        where so.client_order_ref = '{visit_uuid}'
        order by so.id desc
        limit 1;
    """
    while time.time() < deadline:
        rows = psql_odoo(query)
        if rows:
            return rows[0]
        print(
            f"  waiting for Odoo sale_order client_order_ref={visit_uuid} elapsed={elapsed_seconds()}s last_seen=<none>",
            flush=True,
        )
        time.sleep(5)
    raise RuntimeError(f"Timed out waiting for Odoo sale_order with client_order_ref={visit_uuid}")


def sale_order_lines(sale_order_id):
    rows = psql_odoo(
        f"""
        select sol.id,
               pt.name->>'en_US' as product_name,
               sol.product_uom_qty,
               sol.price_unit,
               sol.price_subtotal,
               sol.price_total
        from sale_order_line sol
        join product_product pp on pp.id = sol.product_id
        join product_template pt on pt.id = pp.product_tmpl_id
        where sol.order_id = {int(sale_order_id)}
        order by sol.id;
        """
    )
    if not rows:
        raise RuntimeError(f"No sale_order_line rows found for sale_order_id={sale_order_id}")
    return rows


def create_patient():
    payload = {
        "person": {
            "names": [{"givenName": patient_given, "familyName": patient_family}],
            "gender": "M",
            "birthdate": "1990-01-01",
            "addresses": [{"address1": "Synthetic local UVL-002 test"}],
        },
        "identifiers": [
            {
                "identifier": patient_identifier,
                "identifierType": IDENTIFIER_TYPE_UUID,
                "location": IDENTIFIER_LOCATION_UUID,
                "preferred": True,
            }
        ],
    }
    _, patient = request_json("POST", "/patient", payload)
    return patient["uuid"]


def create_visit(patient_uuid):
    now = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%S.000+0000")
    _, visit = request_json(
        "POST",
        "/visit",
        {
            "patient": patient_uuid,
            "visitType": VISIT_TYPE_UUID,
            "location": LOCATION_UUID,
            "startDatetime": now,
        },
    )
    return visit["uuid"], now


def create_visit_at(patient_uuid, when_iso):
    _, visit = request_json(
        "POST",
        "/visit",
        {
            "patient": patient_uuid,
            "visitType": VISIT_TYPE_UUID,
            "location": LOCATION_UUID,
            "startDatetime": when_iso,
        },
    )
    return visit["uuid"], when_iso


def close_visit(visit_uuid, stop_datetime):
    request_json(
        "POST",
        f"/visit/{visit_uuid}",
        {
            "stopDatetime": stop_datetime,
        },
    )


def create_procedure_order(patient_uuid, visit_uuid, encounter_datetime):
    _, encounter = request_json(
        "POST",
        "/encounter",
        {
            "patient": patient_uuid,
            "encounterType": ENCOUNTER_TYPE_UUID,
            "encounterDatetime": encounter_datetime,
            "location": LOCATION_UUID,
            "visit": visit_uuid,
            "encounterProviders": [{"provider": PROVIDER_UUID, "encounterRole": ENCOUNTER_ROLE_UUID}],
        },
    )
    _, order = request_json(
        "POST",
        "/order",
        {
            "type": "testorder",
            "patient": patient_uuid,
            "concept": TEST_ORDER_CONCEPT_UUID,
            "encounter": encounter["uuid"],
            "orderer": PROVIDER_UUID,
            "careSetting": CARE_SETTING_UUID,
            "orderType": ORDER_TYPE_UUID,
            "action": "NEW",
            "urgency": "ROUTINE",
        },
    )
    return encounter["uuid"], order["uuid"], order["orderNumber"]


def ensure_invoice(sale_order_id, sale_order_name, state):
    if state == "draft":
        models.execute_kw(odoo_db, uid, odoo_password, "sale.order", "action_confirm", [[int(sale_order_id)]])
    current = models.execute_kw(
        odoo_db,
        uid,
        odoo_password,
        "sale.order",
        "read",
        [[int(sale_order_id)]],
        {"fields": ["invoice_ids", "name"]},
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
            if "cannot marshal None" not in str(exc):
                raise
    rows = psql_odoo(
        f"""
        select am.id, am.name, am.move_type, am.invoice_origin, am.amount_total, am.state, am.payment_state
        from account_move am
        where am.invoice_origin = '{sale_order_name}'
        order by am.id desc
        limit 1;
        """
    )
    if not rows:
        raise RuntimeError(f"No invoice found for sale order {sale_order_name}")
    if os.environ.get("POST_INVOICES", "0") == "1" and rows[0][5] == "draft":
        models.execute_kw(
            odoo_db,
            uid,
            odoo_password,
            "account.move",
            "action_post",
            [[int(rows[0][0])]],
        )
        rows = psql_odoo(
            f"""
            select am.id, am.name, am.move_type, am.invoice_origin, am.amount_total, am.state, am.payment_state
            from account_move am
            where am.id = {int(rows[0][0])};
            """
        )
        if not rows or rows[0][5] != "posted":
            raise RuntimeError(f"Expected posted invoice for sale order {sale_order_name}, got {rows!r}")
    return rows[0]


checkpoint(1, "OpenMRS ready")
wait_for_openmrs()

common = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/common")
uid = common.authenticate(odoo_db, odoo_user, odoo_password, {})
if not uid:
    raise RuntimeError("Could not authenticate to Odoo XML-RPC")
models = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/object", allow_none=True)

checkpoint(2, "Odoo ready")

pricelist_ids = {pricelist_name: assert_pricelist_cardinality(pricelist_name) for pricelist_name in INSURANCE_TIER_CONCEPTS}

_, concept_search = request_json("GET", f"/concept/{INSURANCE_TIER_SET_UUID}")
assert_equals(concept_search["uuid"], INSURANCE_TIER_SET_UUID, "Insurance Coverage Tier concept UUID")
_, attr_type_search = request_json("GET", f"/personattributetype/{PERSON_ATTRIBUTE_TYPE_UUID}?v=full")
assert_equals(attr_type_search["uuid"], PERSON_ATTRIBUTE_TYPE_UUID, "Insurance Coverage Tier person attribute type UUID")
concept_answers = insurance_concept_answers()
if concept_answers != INSURANCE_TIER_CONCEPTS:
    raise RuntimeError(f"Insurance Coverage Tier concept answers mismatch: expected {INSURANCE_TIER_CONCEPTS!r}, got {concept_answers!r}")
if recent_eip_log_contains("uvl_002_insurance_coverage_tier_answers.csv ('conceptsets' domain) was processed and 6 out of 6 entities were not saved.", since="24h"):
    raise RuntimeError("OpenMRS logs still contain the UVL-002 conceptset initializer failure summary")

checkpoint(3, "Insurance metadata valid")

patient_uuid = create_patient()
created_attribute = add_person_attribute(patient_uuid, INSURANCE_TIER_CONCEPTS[initial_tier_label])
created_attr_uuid = created_attribute["uuid"]
created_audit = attribute_audit_info_db(created_attr_uuid)

checkpoint(4, f"Synthetic patient created with {initial_tier_label}")

stored_attribute = get_person_attribute(patient_uuid, PERSON_ATTRIBUTE_TYPE_UUID)
stored_value = stored_attribute["value"]["display"] if isinstance(stored_attribute.get("value"), dict) else stored_attribute.get("display")
assert_contains(stored_value, initial_tier_label, "OpenMRS stored Insurance Coverage Tier")

fhir_patient = fetch_fhir_patient(patient_uuid)
assert_equals(fhir_insurance_label(fhir_patient), initial_tier_label, "FHIR Insurance Coverage Tier label")

checkpoint(5, f"FHIR emits {initial_tier_label}")

partner_initial = wait_for_partner_pricelist(patient_uuid, initial_tier_label, expected_id=pricelist_ids[initial_tier_label])
partner_pricelist_initial = pricelist_name_by_id(partner_initial["property_product_pricelist"][0])

checkpoint(6, f"Odoo partner explicit {initial_tier_label}")

request_json(
    "POST",
    f"/person/{get_patient_by_uuid(patient_uuid)['person']['uuid']}/attribute/{created_attr_uuid}",
    {"attributeType": PERSON_ATTRIBUTE_TYPE_UUID, "value": "95%"},
)
time.sleep(10)
bad_attribute = get_person_attribute(patient_uuid, PERSON_ATTRIBUTE_TYPE_UUID)
assert_equals(bad_attribute["display"], "95%", "Unsupported OpenMRS Insurance Coverage Tier raw display")
bad_fhir_patient = fetch_fhir_patient(patient_uuid)
if fhir_has_insurance_extension(bad_fhir_patient):
    raise RuntimeError("Unsupported Insurance Coverage Tier 95% should not survive into FHIR")
partner_after_bad, partner_pricelist_after_bad = partner_pricelist_name(patient_uuid)
assert_equals(partner_pricelist_after_bad, initial_tier_label, "Odoo partner pricelist after unsupported OpenMRS tier")
if not recent_openmrs_log_contains("No concept found for '95%'", since="10m"):
    raise RuntimeError("Expected visible OpenMRS validation warning for unsupported Insurance Coverage Tier 95%")
if not recent_openmrs_log_contains("Could not create a FHIR value for attribute", since="10m"):
    raise RuntimeError("Expected visible OpenMRS FHIR translation warning after unsupported Insurance Coverage Tier 95%")

set_person_attribute(patient_uuid, INSURANCE_TIER_CONCEPTS[initial_tier_label])
fhir_patient = fetch_fhir_patient(patient_uuid)
assert_equals(fhir_insurance_label(fhir_patient), initial_tier_label, "Recovered FHIR Insurance Coverage Tier label")
partner_initial = wait_for_partner_pricelist(patient_uuid, initial_tier_label, expected_id=pricelist_ids[initial_tier_label])
partner_pricelist_initial = pricelist_name_by_id(partner_initial["property_product_pricelist"][0])

visit_1_uuid, encounter_1_time = create_visit(patient_uuid)
encounter_1_uuid, order_1_uuid, order_1_number = create_procedure_order(patient_uuid, visit_1_uuid, encounter_1_time)

checkpoint(7, "Procedure order created")

sale_order_1 = wait_for_sale_order(visit_1_uuid)
assert_equals(sale_order_1[5], initial_tier_label, "First Odoo sale order pricelist")
sale_order_1_lines = sale_order_lines(sale_order_1[0])
checkpoint(8, f"Sale order created with {initial_tier_label}")
invoice_1 = ensure_invoice(sale_order_1[0], sale_order_1[1], sale_order_1[8])
checkpoint(9, f"Invoice created with expected {initial_tier_label} result")

updated_attribute = set_person_attribute(patient_uuid, INSURANCE_TIER_CONCEPTS["Insurance 100%"])
stored_attribute_100 = get_person_attribute(patient_uuid, PERSON_ATTRIBUTE_TYPE_UUID)
stored_value_100 = stored_attribute_100["value"]["display"] if isinstance(stored_attribute_100.get("value"), dict) else stored_attribute_100.get("display")
assert_contains(stored_value_100, "Insurance 100%", "Updated OpenMRS stored Insurance Coverage Tier")
updated_audit = attribute_audit_info_db(updated_attribute["uuid"])
if not updated_audit["changedById"] or not updated_audit["dateChanged"]:
    raise RuntimeError(f"Expected attribute audit changedBy/dateChanged after Insurance 100% update, got {updated_audit!r}")
if created_audit["uuid"] != updated_audit["uuid"]:
    raise RuntimeError(f"Expected same person attribute to be updated in place, got created={created_audit!r} updated={updated_audit!r}")
if created_audit["dateCreated"] == updated_audit["dateChanged"]:
    raise RuntimeError(f"Expected distinct creation and update timestamps, got created={created_audit!r} updated={updated_audit!r}")

checkpoint(10, "Patient changed to 100%")

fhir_patient_100 = fetch_fhir_patient(patient_uuid)
assert_equals(fhir_insurance_label(fhir_patient_100), "Insurance 100%", "Updated FHIR Insurance Coverage Tier label")

partner_100 = wait_for_partner_pricelist(patient_uuid, "Insurance 100%", expected_id=pricelist_ids["Insurance 100%"])
partner_pricelist_100 = pricelist_name_by_id(partner_100["property_product_pricelist"][0])
assert_equals(int(partner_initial["id"]), int(partner_100["id"]), "Odoo partner identity after tier update")

checkpoint(11, "Odoo partner explicit 100%")

visit_1_start = dt.datetime.strptime(encounter_1_time, "%Y-%m-%dT%H:%M:%S.000+0000").replace(tzinfo=dt.timezone.utc)
visit_1_stop = (visit_1_start + dt.timedelta(minutes=1)).strftime("%Y-%m-%dT%H:%M:%S.000+0000")
visit_2_start = (visit_1_start + dt.timedelta(minutes=2)).strftime("%Y-%m-%dT%H:%M:%S.000+0000")
close_visit(visit_1_uuid, visit_1_stop)
visit_2_uuid, encounter_2_time = create_visit_at(patient_uuid, visit_2_start)
encounter_2_uuid, order_2_uuid, order_2_number = create_procedure_order(patient_uuid, visit_2_uuid, encounter_2_time)
sale_order_2 = wait_for_sale_order(visit_2_uuid)
assert_equals(sale_order_2[5], "Insurance 100%", "Second Odoo sale order pricelist")
sale_order_2_lines = sale_order_lines(sale_order_2[0])
invoice_2 = ensure_invoice(sale_order_2[0], sale_order_2[1], sale_order_2[8])
invoice_1_after = psql_odoo(
    f"""
    select am.id, am.name, am.move_type, am.invoice_origin, am.amount_total, am.state, am.payment_state
    from account_move am
    where am.id = {int(invoice_1[0])};
    """
)[0]
assert_equals(invoice_1[4], sale_order_1[7], "First invoice total matches first sale order total")
assert_equals(invoice_2[4], sale_order_2[7], "Second invoice total matches second sale order total")
assert_equals(invoice_1_after[4], invoice_1[4], "Posted first invoice total remains unchanged after coverage update")
assert_equals(invoice_1_after[5], "posted", "First invoice remains posted after coverage update")
if initial_tier == "100" and float(sale_order_1[7]) != 0:
    raise RuntimeError(f"Expected initial Insurance 100% sale order to be fully covered, got {sale_order_1!r} lines={sale_order_1_lines!r}")
if float(sale_order_2[7]) != 0:
    raise RuntimeError(
        f"Expected Insurance 100% sale order total to be fully covered, got sale_order_2={sale_order_2!r} lines={sale_order_2_lines!r}"
    )

assert_equals(sale_order_1[5], initial_tier_label, "First sale order retained original pricelist")
assert_equals(sale_order_2[5], "Insurance 100%", "Second sale order used updated pricelist")

checkpoint(12, "Second sale order/invoice proves 100%")

print("[pass] UVL-002 explicit insurance coverage tier validated against the local Mugamba stack.")
print(f"validation_date=Friday, July 31, 2026")
print(f"patient_identifier={patient_identifier}")
print(f"patient_uuid={patient_uuid}")
print(f"person_attribute_type_uuid={PERSON_ATTRIBUTE_TYPE_UUID}")
print(f"insurance_tier_concept_uuid={INSURANCE_TIER_SET_UUID}")
print(f"first_attribute_uuid={created_attr_uuid}")
print(f"openmrs_initial_tier={initial_tier_label}")
print(f"openmrs_unsupported_tier_attempt=95%")
print(f"openmrs_updated_tier=Insurance 100%")
print(f"odoo_partner_id={partner_100['id']}")
print(f"odoo_partner_pricelist_initial={partner_pricelist_initial}")
print(f"odoo_partner_pricelist_after_unsupported_attempt={partner_pricelist_after_bad}")
print(f"odoo_partner_pricelist_updated={partner_pricelist_100}")
print(f"visit_1_uuid={visit_1_uuid}")
print(f"encounter_1_uuid={encounter_1_uuid}")
print(f"order_1_uuid={order_1_uuid}")
print(f"order_1_number={order_1_number}")
print(f"sale_order_1={sale_order_1[1]}")
print(f"sale_order_1_pricelist={sale_order_1[5]}")
print(f"invoice_1={invoice_1[1]}")
print(f"invoice_1_state={invoice_1[5]}")
print(f"visit_2_uuid={visit_2_uuid}")
print(f"encounter_2_uuid={encounter_2_uuid}")
print(f"order_2_uuid={order_2_uuid}")
print(f"order_2_number={order_2_number}")
print(f"sale_order_2={sale_order_2[1]}")
print(f"sale_order_2_pricelist={sale_order_2[5]}")
print(f"invoice_2={invoice_2[1]}")
print(f"invoice_2_state={invoice_2[5]}")
print(f"openmrs_attribute_uuid={updated_audit['uuid']}")
print(f"openmrs_attribute_creator={created_audit['creator']}")
print(f"openmrs_attribute_date_created={created_audit['dateCreated']}")
print(f"openmrs_attribute_changed_by={updated_audit['changedBy']}")
print(f"openmrs_attribute_date_changed={updated_audit['dateChanged']}")
print(f"openmrs_attribute_old_value={initial_tier_label}")
print(f"openmrs_attribute_new_value=Insurance 100%")
PY
