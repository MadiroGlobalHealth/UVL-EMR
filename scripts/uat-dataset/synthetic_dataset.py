#!/usr/bin/env python3
"""
PHI-free UAT dataset: synthetic patients, loaded through the same REST API the UI uses.

UAT held production patient data restored from Mugamba. Volunteers with external
addresses must not see real records (UVL-EMR#263). uat_phi.py removes the real
records and confirms the result; this script fills UAT with patients nobody can
mistake for a person. README.md in this folder gives the order of the steps.

Two subcommands:

    plan   print the dataset as JSON. Offline, deterministic for a given --seed.
    load   create it on a server. Dry run unless --apply; refuses production.

Every synthetic patient has the family name SYNTH-<nnnn> and a NATO-alphabet given
name, so it cannot be mistaken for a person. Loading goes through the REST API on
purpose: the orders then flow through eip-odoo-openmrs to Odoo (billing), to the
lab, and to Orthanc (imaging) exactly as a clinician's would, so the dataset
exercises the real workflows instead of bypassing them with SQL.

Patients are spread over the workflow so testers find work at every step:
registered only, in an open visit, with vitals, and with orders (consultation,
lab test, imaging). The orders are left unpaid and unresulted for the tester.

    export SYNTH_OPENMRS_USER=admin SYNTH_OPENMRS_PASSWORD=...
    D=scripts/uat-dataset
    $D/synthetic_dataset.py plan --site $D/synthetic-dataset.mugamba.json
    $D/synthetic_dataset.py load --site $D/synthetic-dataset.mugamba.json \\
        --url http://localhost:8080/openmrs --env uat --patients 40          # dry run
    $D/synthetic_dataset.py load ... --apply --i-confirm-target=localhost

Reach OpenMRS directly (an SSH tunnel to the container's 8080), not through the
Keycloak-fronted public URL: the REST calls use basic auth, as the EIP bridges do.

Exit codes: 0 ok · 1 failed · 2 refused or misconfigured, nothing written.
"""
import argparse
import base64
import datetime
import json
import os
import random
import sys
import urllib.error
import urllib.parse
import urllib.request

FAMILY_PREFIX = "SYNTH-"
GIVEN_NAMES = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
               "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
               "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey",
               "Xray", "Yankee", "Zulu"]
# Each patient stops at one of these; cycling keeps every stage populated.
STAGES = ["registered", "visit", "vitals", "orders"]
# There is no "prod" choice on purpose.
ALLOWED_ENVS = ("local", "dev", "uat")
REST = "/ws/rest/v1"


class Refused(Exception):
    """Raised before anything is written; exit code 2."""


# ---------------------------------------------------------------------------
# The dataset (pure, offline)
# ---------------------------------------------------------------------------

def build_plan(site, patients, seed, today):
    """The dataset as plain data. Same site, patients, seed and day -> same plan."""
    if patients < 1:
        raise Refused("--patients must be at least 1")
    rng = random.Random(seed)
    plan = []
    for i in range(1, patients + 1):
        age_years = rng.choice([0, 1, 3, 7, 15, 24, 31, 45, 58, 67, 80])
        birthdate = today - datetime.timedelta(days=age_years * 365 + rng.randint(0, 364))
        stage = STAGES[(i - 1) % len(STAGES)]
        entry = {
            "family": "%s%04d" % (FAMILY_PREFIX, i),
            "given": GIVEN_NAMES[(i - 1) % len(GIVEN_NAMES)],
            "gender": "F" if i % 2 else "M",
            "birthdate": birthdate.isoformat(),
            "stage": stage,
        }
        if STAGES.index(stage) >= STAGES.index("vitals"):
            entry["vitals"] = {
                name: round(rng.uniform(spec["min"], spec["max"]), spec.get("decimals", 0))
                for name, spec in sorted(site.get("vitals", {}).get("obs", {}).items())
            }
        if stage == "orders":
            entry["orders"] = [o["label"] for o in site["orders"]]
        plan.append(entry)
    return plan


def is_synthetic_family(family):
    return family is not None and family.startswith(FAMILY_PREFIX)


# ---------------------------------------------------------------------------
# Guards
# ---------------------------------------------------------------------------

def check_target(url, env, confirm, apply):
    """Refuse anything that is not plainly a non-production target the operator named."""
    if env not in ALLOWED_ENVS:
        raise Refused("--env must be one of %s; this script never writes to production" % ", ".join(ALLOWED_ENVS))
    host = urllib.parse.urlparse(url).hostname
    if not host:
        raise Refused("--url has no host: %r" % url)
    if apply and confirm != host:
        raise Refused("--apply writes to %s. Repeat that host as --i-confirm-target=%s to proceed." % (host, host))
    return host


REQUIRED_SITE_KEYS = ("identifierType", "registrationLocation", "visitLocation", "visitType",
                      "orderEncounterType", "encounterRole", "careSetting", "orders")


def load_site(path):
    with open(path) as f:
        site = json.load(f)
    missing = [k for k in REQUIRED_SITE_KEYS if not site.get(k)]
    if missing:
        raise Refused("%s is missing: %s" % (path, ", ".join(missing)))
    for o in site["orders"]:
        if not all(o.get(k) for k in ("label", "orderType", "concept")):
            raise Refused("every order in %s needs label, orderType and concept: %r" % (path, o))
    return site


def metadata_refs(site):
    """(resource, uuid) for every uuid the load relies on, checked before any write."""
    refs = [("patientidentifiertype", site["identifierType"]),
            ("location", site["registrationLocation"]),
            ("location", site["visitLocation"]),
            ("visittype", site["visitType"]),
            ("encountertype", site["orderEncounterType"]),
            ("encounterrole", site["encounterRole"]),
            ("caresetting", site["careSetting"])]
    for o in site["orders"]:
        refs += [("ordertype", o["orderType"]), ("concept", o["concept"])]
    vitals = site.get("vitals")
    if vitals:
        refs.append(("encountertype", vitals["encounterType"]))
        refs += [("concept", spec["concept"]) for spec in vitals["obs"].values()]
    return refs


# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------

class OpenMRS:
    def __init__(self, base_url, user, password, opener=None):
        self.base = base_url.rstrip("/")
        token = base64.b64encode(("%s:%s" % (user, password)).encode()).decode()
        self.headers = {"Authorization": "Basic " + token, "Accept": "application/json",
                        "Content-Type": "application/json"}
        self.opener = opener or urllib.request.urlopen

    def call(self, method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(self.base + path, data=data, method=method, headers=self.headers)
        try:
            with self.opener(req, timeout=60) as resp:
                raw = resp.read()
                return resp.status, (json.loads(raw) if raw else {})
        except urllib.error.HTTPError as e:
            return e.code, {"error": e.read().decode(errors="replace")[:500]}

    def get(self, path):
        return self.call("GET", path)

    def post(self, path, body):
        return self.call("POST", path, body)


# ---------------------------------------------------------------------------
# Load
# ---------------------------------------------------------------------------

def preflight(om, site):
    status, session = om.get(REST + "/session?v=custom:(authenticated,currentProvider:(uuid))")
    if status != 200 or not session.get("authenticated"):
        raise Refused("cannot sign in to %s (HTTP %s)" % (om.base, status))
    provider = (session.get("currentProvider") or {}).get("uuid")
    if not provider:
        raise Refused("the signed-in user has no provider; orders need an orderer")
    missing = []
    for resource, uuid in metadata_refs(site):
        if om.get("%s/%s/%s?v=custom:(uuid)" % (REST, resource, uuid))[0] != 200:
            missing.append("%s/%s" % (resource, uuid))
    if missing:
        raise Refused("not on this server: " + ", ".join(sorted(set(missing))))
    status, sources = om.get(REST + "/idgen/identifiersource?v=custom:(uuid,identifierType:(uuid))")
    source = next((s["uuid"] for s in sources.get("results", [])
                   if (s.get("identifierType") or {}).get("uuid") == site["identifierType"]), None)
    if status != 200 or not source:
        raise Refused("no idgen identifier source for identifier type %s" % site["identifierType"])
    return provider, source


def expect(result, what):
    status, body = result
    if status not in (200, 201):
        raise RuntimeError("%s failed (HTTP %s): %s" % (what, status, body.get("error", body)))
    return body


def load_patient(om, site, entry, provider, source, now):
    status, found = om.get(REST + "/patient?q=" + urllib.parse.quote(entry["family"]) + "&v=custom:(uuid)")
    if status == 200 and found.get("results"):
        return "exists"
    ident = expect(om.post("%s/idgen/identifiersource/%s/identifier" % (REST, source), {}), "identifier")
    patient = expect(om.post(REST + "/patient", {
        "person": {"names": [{"givenName": entry["given"], "familyName": entry["family"]}],
                   "gender": entry["gender"], "birthdate": entry["birthdate"]},
        "identifiers": [{"identifier": ident["identifier"], "identifierType": site["identifierType"],
                         "location": site["registrationLocation"], "preferred": True}],
    }), "patient " + entry["family"])["uuid"]
    if entry["stage"] == "registered":
        return "created"
    stamp = now.strftime("%Y-%m-%dT%H:%M:%S.000+0000")
    visit = expect(om.post(REST + "/visit", {
        "patient": patient, "visitType": site["visitType"], "location": site["visitLocation"],
        "startDatetime": stamp}), "visit " + entry["family"])["uuid"]
    providers = [{"provider": provider, "encounterRole": site["encounterRole"]}]
    if "vitals" in entry:
        vitals = site["vitals"]
        expect(om.post(REST + "/encounter", {
            "patient": patient, "visit": visit, "location": site["visitLocation"],
            "encounterType": vitals["encounterType"], "encounterDatetime": stamp,
            "encounterProviders": providers,
            "obs": [{"concept": vitals["obs"][name]["concept"], "value": value}
                    for name, value in sorted(entry["vitals"].items())],
        }), "vitals " + entry["family"])
    if "orders" in entry:
        expect(om.post(REST + "/encounter", {
            "patient": patient, "visit": visit, "location": site["visitLocation"],
            "encounterType": site["orderEncounterType"], "encounterDatetime": stamp,
            "encounterProviders": providers,
            "orders": [{"type": "testorder", "action": "NEW", "urgency": "ROUTINE",
                        "patient": patient, "concept": o["concept"], "orderType": o["orderType"],
                        "careSetting": site["careSetting"], "orderer": provider}
                       for o in site["orders"]],
        }), "orders " + entry["family"])
    return "created"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def credentials():
    user = os.environ.get("SYNTH_OPENMRS_USER")
    password = os.environ.get("SYNTH_OPENMRS_PASSWORD")
    if not user or not password:
        raise Refused("set SYNTH_OPENMRS_USER and SYNTH_OPENMRS_PASSWORD")
    return user, password


def main(argv=None, opener=None, today=None, now=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("plan")
    p.add_argument("--site", required=True)
    p.add_argument("--patients", type=int, default=40)
    p.add_argument("--seed", type=int, default=263)
    l_ = sub.add_parser("load")
    l_.add_argument("--site", required=True)
    l_.add_argument("--url", required=True, help="OpenMRS base URL, e.g. http://localhost:8080/openmrs")
    l_.add_argument("--env", required=True, help="one of: " + ", ".join(ALLOWED_ENVS))
    l_.add_argument("--patients", type=int, default=40)
    l_.add_argument("--seed", type=int, default=263)
    l_.add_argument("--apply", action="store_true", help="write; without it, a dry run")
    l_.add_argument("--i-confirm-target", default=None, dest="confirm")
    args = ap.parse_args(argv)
    today = today or datetime.date.today()
    now = now or datetime.datetime.now(datetime.timezone.utc)

    try:
        if args.cmd == "plan":
            print(json.dumps(build_plan(load_site(args.site), args.patients, args.seed, today), indent=2))
            return 0
        site = load_site(args.site)
        host = check_target(args.url, args.env, args.confirm, args.apply)
        plan = build_plan(site, args.patients, args.seed, today)
        om = OpenMRS(args.url, *credentials(), opener=opener)
        provider, source = preflight(om, site)
        if not args.apply:
            stages = {s: sum(1 for e in plan if e["stage"] == s) for s in STAGES}
            print("DRY RUN on %s (%s): would create %d synthetic patients %s; metadata checked."
                  % (host, args.env, len(plan), stages))
            print("Re-run with --apply --i-confirm-target=%s to write." % host)
            return 0
        counts = {"created": 0, "exists": 0}
        for entry in plan:
            counts[load_patient(om, site, entry, provider, source, now)] += 1
        print("Loaded on %s: %d created, %d already there." % (host, counts["created"], counts["exists"]))
        return 0
    except Refused as e:
        print("REFUSED: %s" % e, file=sys.stderr)
        return 2
    except (RuntimeError, urllib.error.URLError, OSError) as e:
        print("FAILED: %s" % e, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
