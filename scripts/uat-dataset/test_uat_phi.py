#!/usr/bin/env python3
"""Unit tests for uat_phi.py, against an in-memory schema and a fake database. No server.

    python3 -m unittest discover -s scripts/uat-dataset
"""
import datetime
import io
import os
import re
import sys
import unittest
from contextlib import redirect_stderr, redirect_stdout

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synthetic_dataset as sd  # noqa: E402
import uat_phi as up  # noqa: E402

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "synthetic-dataset.mugamba.json")


class Names(unittest.TestCase):

    def test_synthetic_prefixes_need_a_boundary(self):
        for name in ("SYNTH-0001", "synth-0042", "QA-Reg 7", "QA", "E2E Clinic", "Test 3", "DEMO_1", "qa1"):
            self.assertTrue(up.is_synthetic_name(name), name)
        for name in ("QAsim", "Testa", "Demosthene", "Realfamily", "", None, " QA"):
            self.assertFalse(up.is_synthetic_name(name), name)

    def test_every_planned_patient_counts_as_synthetic(self):
        plan = sd.build_plan(sd.load_site(SITE), 60, 263, datetime.date(2026, 11, 16))
        self.assertTrue(all(up.is_synthetic_name(p["family"]) for p in plan))

    def test_sql_uses_the_same_rule(self):
        self.assertIn(up.SYNTHETIC_PATTERN, up.SYNTHETIC_PATIENT)
        self.assertIn("NOT EXISTS", up.SYNTHETIC_PATIENT)   # every name, voided ones included


# A small OpenMRS-like schema: (table, column, parent, parent column)
EDGES = [
    ("patient", "patient_id", "person", "person_id"),
    ("person_name", "person_id", "person", "person_id"),
    ("users", "person_id", "person", "person_id"),
    ("provider", "person_id", "person", "person_id"),
    ("encounter", "patient_id", "patient", "patient_id"),
    ("obs", "person_id", "person", "person_id"),
    ("obs", "encounter_id", "encounter", "encounter_id"),
    ("obs", "obs_group_id", "obs", "obs_id"),
    ("orders", "patient_id", "patient", "patient_id"),
    ("orders", "encounter_id", "encounter", "encounter_id"),
    ("orders", "orderer", "provider", "provider_id"),
    ("stockmgmt_stock_item_transaction", "patient_id", "patient", "patient_id"),
    ("appointment_occurrence", "encounter_id", "encounter", "encounter_id"),
    ("audit_by_user", "user_id", "users", "user_id"),
]
PKS = {"person": ["person_id"], "patient": ["patient_id"], "person_name": ["person_name_id"],
       "users": ["user_id"], "provider": ["provider_id"], "encounter": ["encounter_id"],
       "obs": ["obs_id"], "orders": ["order_id"], "stockmgmt_stock_item_transaction": ["id"],
       "audit_by_user": ["id"]}
NULLABLE = {"obs": {"obs_group_id": True, "encounter_id": True, "person_id": False},
            "stockmgmt_stock_item_transaction": {"patient_id": True}}
DATA = {
    "person": [{"person_id": "1"}, {"person_id": "2"}, {"person_id": "10"}, {"person_id": "20"}],
    "patient": [{"patient_id": "10"}, {"patient_id": "20"}],
    "person_name": [{"person_name_id": "1", "person_id": "10"}, {"person_name_id": "2", "person_id": "20"}],
    "users": [{"user_id": "1", "person_id": "1"}],
    "provider": [{"provider_id": "1", "person_id": "2"}],
    "encounter": [{"encounter_id": "100", "patient_id": "10"}, {"encounter_id": "200", "patient_id": "20"}],
    "obs": [{"obs_id": "1000", "person_id": "10", "encounter_id": "100", "obs_group_id": "NULL"},
            {"obs_id": "1001", "person_id": "99", "encounter_id": "NULL", "obs_group_id": "1000"},
            {"obs_id": "2000", "person_id": "20", "encounter_id": "200", "obs_group_id": "NULL"}],
    "orders": [{"order_id": "5", "patient_id": "10", "encounter_id": "100", "orderer": "1"}],
    "stockmgmt_stock_item_transaction": [{"id": "7", "patient_id": "10"}, {"id": "8", "patient_id": "NULL"}],
    "appointment_occurrence": [{"encounter_id": "100"}, {"encounter_id": "200"}],
    "audit_by_user": [{"id": "1", "user_id": "1"}],
}


def schema(edges=EDGES, pks=PKS):
    columns = {}
    for t, c, p, pc in edges:
        columns.setdefault(t, {})[c] = NULLABLE.get(t, {}).get(c, True)
    return up.Schema(list(edges), dict(pks), columns)


def fake_fetch(data):
    def fetch(requests):
        out = []
        for table, columns, column, values in requests:
            rows = [r for r in data.get(table, []) if r.get(column) in values]
            if columns == ["COUNT(*)"]:
                out.append([[str(len(rows))]])
            else:
                out.append([[r.get(c, "NULL") for c in columns] for r in rows])
        return out
    return fetch


class Reach(unittest.TestCase):

    def closure(self, roots=("10",)):
        return up.build_closure(schema(), list(roots), fake_fetch(DATA))

    def test_follows_every_link_including_obs_groups(self):
        c = self.closure()
        self.assertEqual({("10",)}, c.rows["patient"])
        self.assertEqual({("100",)}, c.rows["encounter"])
        self.assertEqual({("1000",), ("1001",)}, c.rows["obs"])     # 1001 only through its group
        self.assertEqual({("5",)}, c.rows["orders"])
        self.assertNotIn(("2000",), c.rows["obs"])

    def test_staff_rows_are_counted_never_collected(self):
        c = self.closure()
        self.assertEqual(0, c.stop["users"])
        self.assertNotIn("users", c.rows)
        self.assertNotIn("audit_by_user", c.rows)
        self.assertEqual(1, self.closure(("10", "1")).stop["users"])

    def test_ledger_rows_are_detached(self):
        c = self.closure()
        self.assertEqual(1, c.detach[("stockmgmt_stock_item_transaction", "patient_id")])
        self.assertNotIn("stockmgmt_stock_item_transaction", c.rows)
        self.assertEqual({("stockmgmt_stock_item_transaction", "patient_id"): {"10"}}, c.detach_values(schema()))

    def test_keyless_leaf_is_deleted_by_its_link(self):
        c = self.closure()
        self.assertEqual([1, {"100"}], c.keyless[("appointment_occurrence", "encounter_id")])

    def test_keyless_table_with_children_is_refused(self):
        edges = EDGES + [("child", "encounter_id", "appointment_occurrence", "encounter_id")]
        with self.assertRaises(up.Refused):
            up.build_closure(schema(edges), ["10"], fake_fetch(DATA))


class Order(unittest.TestCase):

    def test_children_go_before_parents(self):
        s = schema()
        c = up.build_closure(s, ["10"], fake_fetch(DATA))
        order, links = up.delete_order(s, c)
        for child, parent in (("obs", "encounter"), ("encounter", "patient"), ("patient", "person"),
                              ("orders", "encounter"), ("person_name", "person")):
            self.assertLess(order.index(child), order.index(parent), (child, parent))
        self.assertEqual([("obs", "obs_group_id")], links)

    def test_sql_is_one_transaction_and_detaches_first(self):
        s = schema()
        sql = up.purge_sql(s, up.build_closure(s, ["10"], fake_fetch(DATA)))
        lines = sql.splitlines()
        self.assertEqual("START TRANSACTION;", lines[1])
        self.assertEqual("COMMIT;", lines[-1])
        self.assertIn("SET SESSION foreign_key_checks = 1;", lines[0])
        detach = next(i for i, l in enumerate(lines) if l.startswith("UPDATE `stockmgmt_stock_item_transaction`"))
        first_delete = next(i for i, l in enumerate(lines) if l.startswith("DELETE"))
        self.assertLess(detach, first_delete)
        self.assertIn("DELETE FROM `appointment_occurrence` WHERE `encounter_id` IN (100);", lines)
        self.assertIn("UPDATE `obs` SET `obs_group_id` = NULL WHERE `obs_id` IN (1000, 1001);", lines)
        self.assertNotIn("users", sql)

    def test_self_link_that_cannot_be_cleared_is_refused(self):
        NULLABLE["obs"]["obs_group_id"] = False
        try:
            s = schema()
            with self.assertRaises(up.Refused):
                up.purge_sql(s, up.build_closure(s, ["10"], fake_fetch(DATA)))
        finally:
            NULLABLE["obs"]["obs_group_id"] = True

    def test_composite_keys_and_strings_are_quoted(self):
        s = up.Schema([], {"t": ["a", "b"]}, {})
        self.assertEqual("(`a`, `b`) IN ((1, 'x''y'))", up.where_keys(s, "t", [("1", "x'y")]))


class Odoo(unittest.TestCase):
    LINKS = [("sale_order", "partner_id"), ("account_move", "partner_id"), ("res_partner", "parent_id"),
             ("mail_message", "author_id"), ("res_users", "partner_id")]
    COLUMNS = {"res_partner": {"name": "character varying", "ref": "character varying", "phone": "character varying",
                               "x_customer_dob": "date", "x_external_identifier": "character varying",
                               "complete_name": "character varying"},
               "sale_order": {"name": "character varying", "note": "text", "x_external_identifier": "character varying"},
               "account_move": {"invoice_partner_display_name": "character varying", "date": "date"},
               "mail_message": {"body": "text"}}

    def test_pseudonymises_in_one_checked_transaction(self):
        sql = up.odoo_purge_sql(self.LINKS, self.COLUMNS, ["keep-uuid"])
        self.assertTrue(sql.startswith("BEGIN;"))
        self.assertTrue(sql.rstrip().endswith("COMMIT;"))
        self.assertIn("'keep-uuid'", sql)
        self.assertIn("NOT IN (SELECT partner_id FROM res_users", sql)
        self.assertIn("UPDATE account_move x SET invoice_partner_display_name = replace(", sql)
        self.assertIn("UPDATE sale_order x SET note = NULL, x_external_identifier = NULL", sql)
        self.assertIn("x_customer_dob = NULL", sql)
        self.assertIn("RAISE EXCEPTION", sql)
        self.assertNotIn("UPDATE res_users", sql)

    def test_copies_are_looked_for_in_text_columns_only(self):
        copies = up.name_copy_columns(self.LINKS, self.COLUMNS)
        self.assertIn(("account_move", "partner_id", "invoice_partner_display_name"), copies)
        self.assertNotIn(("account_move", "partner_id", "date"), copies)
        self.assertFalse([c for c in copies if c[0] == "res_partner"])


class FakeDb:
    """Answers uat_phi's marked queries by pattern and records every script it is sent."""

    def __init__(self, answers):
        self.answers, self.scripts = answers, []

    def __call__(self, command, sql):
        self.scripts.append(sql)
        parts = re.split(r"SELECT '%s', (\d+);\n" % up.MARK, sql)
        out = []
        for i in range(1, len(parts), 2):
            out.append("%s\t%s" % (up.MARK, parts[i]))
            for pattern, rows in self.answers:
                if re.search(pattern, parts[i + 1]):
                    out += ["\t".join(r) for r in rows]
                    break
        return 0, "\n".join(out) + "\n", ""

    def writes(self):
        return [s for s in self.scripts if re.search(r"^(DELETE|UPDATE|START|PURGE|FLUSH|BEGIN)", s, re.M)]


def openmrs_db(readers="0", recent="0"):
    return FakeDb([
        (r"^SELECT 'uat_phi'", [["uat_phi"]]),
        (r"Binlog Dump", [[readers]]),
        (r"^SELECT COUNT\(\*\) FROM patient p WHERE EXISTS", [["40"]]),
        (r"^SELECT COUNT\(\*\), COALESCE", [["5210", "3", recent]]),
        (r"^SELECT COUNT\(\*\) FROM person x", [["0"]]),
        (r"^SELECT p2.uuid", [["u-1"]]),
        (r"^SELECT p.patient_id", [["10"]]),
        (r"KEY_COLUMN_USAGE.*REFERENCED_TABLE_NAME IS NOT NULL", [list(e) for e in EDGES[:2]]),
        (r"CONSTRAINT_NAME = 'PRIMARY'", [["person", "person_id"], ["patient", "patient_id"]]),
        (r"information_schema.COLUMNS", [["patient", "patient_id", "NO"]]),
        (r"FROM `patient` WHERE", [["10"]]),
        (r"@@log_bin", [["0"]]),
    ])


def run(argv, db):
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        code = up.main(argv, runner=db)
    return code, out.getvalue(), err.getvalue()


BASE = ["--mysql", "mysql", "--no-odoo", "--no-orthanc"]


class Cli(unittest.TestCase):

    def test_audit_reports_counts_only_and_fails_when_real_patients_remain(self):
        code, out, _ = run(["audit"] + BASE, openmrs_db())
        self.assertEqual(1, code)
        self.assertIn("5210 NOT synthetic (3 of them voided)", out)
        self.assertIn("Do not grant volunteer access", out)

    def test_dry_run_writes_nothing(self):
        db = openmrs_db(readers="2")
        code, out, _ = run(["purge"] + BASE + ["--target", "uvl-uat"], db)
        self.assertEqual(0, code)
        self.assertIn("WOULD REFUSE: 2 binary-log reader(s)", out)
        self.assertEqual([], db.writes())

    def test_apply_needs_the_target_repeated(self):
        db = openmrs_db()
        code, _, err = run(["purge"] + BASE + ["--target", "uvl-uat", "--apply"], db)
        self.assertEqual(2, code)
        self.assertIn("--i-confirm-target=uvl-uat", err)
        self.assertEqual([], db.writes())

    def test_production_is_refused_by_name(self):
        db = openmrs_db()
        code, _, err = run(["purge"] + BASE + ["--target", "uvl-prod", "--apply", "--i-confirm-target=uvl-prod"], db)
        self.assertEqual(2, code)
        self.assertEqual([], db.writes())

    def test_connected_bridges_or_fresh_registrations_refuse_apply(self):
        for db, why in ((openmrs_db(readers="1"), "binary-log reader"), (openmrs_db(recent="4"), "looks like production")):
            code, _, err = run(["purge"] + BASE + ["--target", "uvl-uat", "--apply", "--i-confirm-target=uvl-uat"], db)
            self.assertEqual(2, code)
            self.assertIn(why, err)
            self.assertEqual([], db.writes())

    def test_apply_deletes_in_one_transaction(self):
        db = openmrs_db()
        code, out, _ = run(["purge"] + BASE + ["--target", "uvl-uat", "--apply", "--i-confirm-target=uvl-uat"], db)
        self.assertEqual(0, code, out)
        writes = db.writes()
        self.assertEqual(1, len(writes))
        self.assertIn("DELETE FROM `patient` WHERE `patient_id` IN (10);", writes[0])
        self.assertIn("DELETE FROM `person` WHERE `person_id` IN (10);", writes[0])

    def test_mysql_must_run_in_batch_mode(self):
        db = FakeDb([(r"^SELECT 'uat_phi'", [["uat_phi"], ["uat_phi"]])])
        code, _, err = run(["audit"] + BASE, db)
        self.assertEqual(2, code)
        self.assertIn("-B -N", err)


if __name__ == "__main__":
    unittest.main()
