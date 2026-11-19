#!/usr/bin/env python3
"""Unit tests for synthetic_dataset.py, against a fake OpenMRS. No network, no server.

    python3 -m unittest discover -s scripts/uat-dataset
"""
import datetime
import io
import json
import os
import sys
import unittest
import urllib.parse
from contextlib import redirect_stderr, redirect_stdout

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synthetic_dataset as sd  # noqa: E402

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "synthetic-dataset.mugamba.json")
TODAY = datetime.date(2026, 10, 7)
NOW = datetime.datetime(2026, 10, 7, 8, 0, 0)


class FakeResponse:
    def __init__(self, status, body):
        self.status, self._raw = status, json.dumps(body).encode()

    def read(self):
        return self._raw

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class FakeOpenMRS:
    """Answers the calls synthetic_dataset makes and records every write."""

    def __init__(self, missing=()):
        self.missing = set(missing)
        self.writes = []
        self.next_id = 1000

    def __call__(self, req, timeout=None):
        url = urllib.parse.urlparse(req.full_url)
        path = url.path
        if req.get_method() == "POST":
            body = json.loads(req.data or b"{}")
            self.writes.append((path, body))
            if path.endswith("/identifier"):
                self.next_id += 1
                return FakeResponse(200, {"identifier": "SYN%d" % self.next_id})
            return FakeResponse(201, {"uuid": "uuid-%d" % len(self.writes)})
        if path.endswith("/session"):
            return FakeResponse(200, {"authenticated": True, "currentProvider": {"uuid": "prov-1"}})
        if path.endswith("/idgen/identifiersource"):
            site = json.load(open(SITE))
            return FakeResponse(200, {"results": [{"uuid": "src-1", "identifierType": {"uuid": site["identifierType"]}}]})
        if path.endswith("/patient"):
            return FakeResponse(200, {"results": []})
        if path.rsplit("/", 1)[-1] in self.missing:
            raise sd.urllib.error.HTTPError(req.full_url, 404, "nf", {}, io.BytesIO(b"{}"))
        return FakeResponse(200, {"uuid": path.rsplit("/", 1)[-1]})


def run(argv, fake=None):
    out, err = io.StringIO(), io.StringIO()
    os.environ["SYNTH_OPENMRS_USER"], os.environ["SYNTH_OPENMRS_PASSWORD"] = "u", "p"
    with redirect_stdout(out), redirect_stderr(err):
        code = sd.main(argv, opener=fake, today=TODAY, now=NOW)
    return code, out.getvalue(), err.getvalue()


LOAD = ["load", "--site", SITE, "--url", "http://localhost:8080/openmrs", "--env", "uat", "--patients", "8"]


class Plan(unittest.TestCase):

    def test_is_deterministic_and_obviously_synthetic(self):
        site = sd.load_site(SITE)
        a = sd.build_plan(site, 30, 263, TODAY)
        self.assertEqual(a, sd.build_plan(site, 30, 263, TODAY))
        self.assertEqual(30, len(a))
        for e in a:
            self.assertTrue(sd.is_synthetic_family(e["family"]), e)
            self.assertIn(e["given"], sd.GIVEN_NAMES)

    def test_every_workflow_stage_is_populated(self):
        plan = sd.build_plan(sd.load_site(SITE), 8, 1, TODAY)
        self.assertEqual(set(sd.STAGES), {e["stage"] for e in plan})
        ordered = [e for e in plan if e["stage"] == "orders"]
        self.assertTrue(all(len(e["orders"]) == 3 and "vitals" in e for e in ordered))


class Guards(unittest.TestCase):

    def test_production_is_not_a_choice(self):
        for env in ("prod", "production", "PROD"):
            code, _, err = run(LOAD[:-4] + ["--env", env, "--patients", "8", "--apply",
                                            "--i-confirm-target=localhost"], FakeOpenMRS())
            self.assertEqual(2, code, env)
            self.assertIn("never writes to production", err)

    def test_apply_needs_the_host_repeated(self):
        fake = FakeOpenMRS()
        code, _, err = run(LOAD + ["--apply", "--i-confirm-target=uvl-emr-uat.madiro.org"], fake)
        self.assertEqual(2, code)
        self.assertIn("--i-confirm-target=localhost", err)
        self.assertEqual([], fake.writes)

    def test_dry_run_writes_nothing(self):
        fake = FakeOpenMRS()
        code, out, _ = run(LOAD, fake)
        self.assertEqual(0, code)
        self.assertIn("DRY RUN", out)
        self.assertEqual([], fake.writes)

    def test_missing_metadata_stops_before_any_write(self):
        fake = FakeOpenMRS(missing={"e3dea2c8-62c6-4487-bdaa-1d009642f7ad"})
        code, _, err = run(LOAD + ["--apply", "--i-confirm-target=localhost"], fake)
        self.assertEqual(2, code)
        self.assertIn("concept/e3dea2c8", err)
        self.assertEqual([], fake.writes)


class Load(unittest.TestCase):

    def test_creates_patients_visits_vitals_and_orders(self):
        fake = FakeOpenMRS()
        code, out, err = run(LOAD + ["--apply", "--i-confirm-target=localhost"], fake)
        self.assertEqual(0, code, err)
        self.assertIn("8 created", out)
        paths = [p for p, _ in fake.writes]
        self.assertEqual(8, paths.count("/openmrs/ws/rest/v1/patient"))
        self.assertEqual(6, paths.count("/openmrs/ws/rest/v1/visit"))  # every stage but "registered"
        encounters = [b for p, b in fake.writes if p.endswith("/encounter")]
        orders = [o for b in encounters for o in b.get("orders", [])]
        self.assertEqual(2 * 3, len(orders))
        self.assertTrue(all(o["orderer"] == "prov-1" and o["action"] == "NEW" for o in orders))
        names = [b["person"]["names"][0]["familyName"] for p, b in fake.writes if p.endswith("/patient")]
        self.assertTrue(all(sd.is_synthetic_family(n) for n in names))


if __name__ == "__main__":
    unittest.main()
