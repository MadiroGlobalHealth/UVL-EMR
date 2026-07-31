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
import json
import os
import subprocess
import time
import urllib.error
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

IDENTIFIER_TYPE_UUID = "05a29f94-c0ed-11e2-94be-8c13b969e334"
IDENTIFIER_LOCATION_UUID = "EBE3BE01-BA1C-0FDD-0B19-9DB2F07EA7DB"
PERSON_ATTRIBUTE_TYPE_UUID = "9816ffad-781b-423f-a21d-1ab06afb4dcc"

auth_header = "Basic " + base64.b64encode(f"{openmrs_user}:{openmrs_password}".encode()).decode()
run_started = time.time()
run_id = str(int(run_started))
patient_identifier = f"CX-UVL002-NOTIER-{run_id}"


def elapsed_seconds():
    return int(time.time() - run_started)


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


def wait_for_openmrs():
    deadline = time.time() + 300
    last_error = None
    while time.time() < deadline:
        try:
            status, payload = request_json("GET", "/session", timeout=20)
            if status == 200 and payload.get("authenticated"):
                return
        except Exception as exc:
            last_error = exc
        print(f"  waiting for OpenMRS... elapsed={elapsed_seconds()}s last_error={last_error}", flush=True)
        time.sleep(5)
    raise RuntimeError(f"OpenMRS did not become ready within 300 seconds: {last_error}")


def create_patient_without_insurance_tier():
    payload = {
        "person": {
            "names": [{"givenName": "NoTier", "familyName": "InsuranceFailClosed"}],
            "gender": "M",
            "birthdate": "1990-01-01",
            "addresses": [{"address1": "Synthetic local no-tier fail-closed test"}],
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


def patient_has_insurance_attribute(patient_uuid):
    _, patient = request_json("GET", f"/patient/{patient_uuid}?v=full")
    attrs = patient.get("person", {}).get("attributes", [])
    return any(attr.get("attributeType", {}).get("uuid") == PERSON_ATTRIBUTE_TYPE_UUID for attr in attrs)


def eip_logs_since_start():
    cmd = [
        "docker",
        "logs",
        "--since",
        f"{max(0, int(elapsed_seconds()) + 10)}s",
        f"{compose_project}-eip-odoo-openmrs-1",
    ]
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout + result.stderr


def wait_for_eip_missing_tier_error(patient_uuid):
    expected = f"Patient {patient_uuid} is missing required Insurance Coverage Tier person attribute"
    deadline = time.time() + 240
    last_logs = ""
    while time.time() < deadline:
        last_logs = eip_logs_since_start()
        if expected in last_logs:
            return expected
        print(f"  waiting for EIP fail-closed error patient={patient_uuid} elapsed={elapsed_seconds()}s", flush=True)
        time.sleep(5)
    raise RuntimeError(f"Timed out waiting for EIP missing-tier error: {expected!r}. Recent logs tail:\n{last_logs[-4000:]}")


def odoo_partner_count(patient_uuid):
    common = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/common")
    uid = common.authenticate(odoo_db, odoo_user, odoo_password, {})
    if not uid:
        raise RuntimeError("Could not authenticate to Odoo XML-RPC")
    models = xmlrpc.client.ServerProxy(f"{odoo_url}/xmlrpc/2/object", allow_none=True)
    partners = models.execute_kw(
        odoo_db,
        uid,
        odoo_password,
        "res.partner",
        "search_read",
        [[["ref", "=", patient_uuid]]],
        {"fields": ["id", "name", "ref", "property_product_pricelist"], "limit": 5},
    )
    return partners


print("[1/5] OpenMRS ready", flush=True)
wait_for_openmrs()

print("[2/5] Creating patient without Insurance Coverage Tier", flush=True)
patient_uuid = create_patient_without_insurance_tier()
print(f"patient_uuid={patient_uuid}", flush=True)
print(f"patient_identifier={patient_identifier}", flush=True)

if patient_has_insurance_attribute(patient_uuid):
    raise RuntimeError(f"Patient {patient_uuid} unexpectedly has Insurance Coverage Tier")
print("[3/5] OpenMRS patient has no Insurance Coverage Tier", flush=True)

expected_error = wait_for_eip_missing_tier_error(patient_uuid)
print(f"[4/5] EIP failed closed: {expected_error}", flush=True)

partners = odoo_partner_count(patient_uuid)
if partners:
    raise RuntimeError(f"Expected no Odoo partner for missing-tier patient {patient_uuid}, got {partners!r}")
print("[5/5] Odoo partner was not created through fallback", flush=True)

print("result=PASS", flush=True)
print("missing_tier_policy=required", flush=True)
print(f"openmrs_patient_uuid={patient_uuid}", flush=True)
PY
