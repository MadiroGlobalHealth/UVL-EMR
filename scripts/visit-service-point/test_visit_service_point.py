#!/usr/bin/env python3
"""Unit tests for visit_service_point.py, against made-up rows and a fake database. No server.

    python3 -m unittest discover -s scripts/visit-service-point
"""
import datetime
import io
import json
import os
import sys
import unittest
from contextlib import redirect_stderr

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import visit_service_point as vsp  # noqa: E402

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "visit-service-point.mugamba.json")

RECEPTION, OPD, OFFICE, WARDS, NEONATAL, TEST, CASHIER, CLOSED, ANNEX = 5, 6, 10, 11, 14, 16, 9, 2, 40
OUT, IN = 1, 2          # encounter type ids: outpatient (preferred), inpatient
DR_A, DR_B = 101, 102


def location(key, name, parent=None, retired=False, visit_tag=True):
    return vsp.Location(key, "uuid-%d" % key, name, parent, retired, visit_tag)


LOCATIONS = [
    location(RECEPTION, "Reception"), location(CASHIER, "Cashier"), location(OPD, "Outpatients"),
    location(OFFICE, "Medical office"), location(WARDS, "Wards"),
    location(NEONATAL, "Neonatal room", parent=WARDS, visit_tag=False),
    location(ANNEX, "Annex", visit_tag=False), location(TEST, "Test"),
    location(CLOSED, "Closed pharmacy", retired=True),
]


def rule(**thresholds):
    return vsp.Rule(LOCATIONS, [RECEPTION, CASHIER], [TEST], [OUT, IN], **thresholds)


def day(text, hour=9):
    return datetime.datetime.strptime(text, "%Y-%m-%d") + datetime.timedelta(hours=hour)


class Rows:
    """Builds encounters and visits with ids in the order they are added."""

    def __init__(self):
        self.encounters, self.visits = [], []

    def consultation(self, when, where, clinician=DR_A, kind=OUT, visit=None, hour=9):
        e = vsp.Encounter(len(self.encounters) + 1, visit, clinician, day(when, hour), where, kind)
        self.encounters.append(e)
        return e

    def visit(self, when, where):
        v = vsp.Visit(len(self.visits) + 1, day(when, 8), where)
        self.visits.append(v)
        return v

    def plan(self, rule_=None, **options):
        return vsp.make_plan(self.encounters, self.visits, rule_ or rule(), **options)


def only(changes, entity):
    return {c.id: (c.new, c.basis) for c in changes if c.entity == entity}


def reasons(undecided, entity):
    return {u.id: u.reason for u in undecided if u.entity == entity}


class Consultations(unittest.TestCase):

    def test_same_day_at_one_service(self):
        r = Rows()
        r.consultation("2026-10-05", OPD)
        wrong = r.consultation("2026-10-05", RECEPTION)
        changes, undecided = r.plan()
        self.assertEqual(only(changes, "encounter"), {wrong.id: (OPD, vsp.SAME_DAY)})
        self.assertEqual(undecided, [])

    def test_same_day_wins_over_the_usual_service(self):
        r = Rows()
        for d in range(10, 20):
            r.consultation("2026-10-%02d" % d, OPD)
        r.consultation("2026-10-05", OFFICE)
        wrong = r.consultation("2026-10-05", RECEPTION)
        self.assertEqual(only(r.plan()[0], "encounter"), {wrong.id: (OFFICE, vsp.SAME_DAY)})

    def test_usual_service_within_the_window(self):
        r = Rows()
        for d in range(1, 6):
            r.consultation("2026-09-%02d" % d, OPD)
        near = r.consultation("2026-10-04", RECEPTION)     # 29 to 33 days after the evidence
        far = r.consultation("2026-10-06", RECEPTION)      # 31 days after the last of it
        changes, undecided = r.plan(rule(min_evidence=2))
        self.assertEqual(only(changes, "encounter"), {near.id: (OPD, vsp.USUAL)})
        self.assertEqual(reasons(undecided, "encounter"), {far.id: vsp.NO_EVIDENCE})

    def test_usual_service_needs_enough_consultations(self):
        r = Rows()
        for d in range(1, 5):
            r.consultation("2026-10-%02d" % d, OPD)
        wrong = r.consultation("2026-10-10", RECEPTION)
        self.assertEqual(reasons(r.plan()[1], "encounter"), {wrong.id: vsp.TOO_FEW})
        r.consultation("2026-10-06", OPD)
        self.assertEqual(only(r.plan()[0], "encounter"), {wrong.id: (OPD, vsp.USUAL)})

    def test_a_clinician_in_several_services_is_undecided(self):
        r = Rows()
        for d in range(1, 9):
            r.consultation("2026-10-%02d" % d, OPD)
        r.consultation("2026-10-09", OFFICE)
        r.consultation("2026-10-11", OFFICE)
        wrong = r.consultation("2026-10-10", RECEPTION)     # 8 of 10 at outpatients: under 90 %
        self.assertEqual(reasons(r.plan()[1], "encounter"), {wrong.id: vsp.SEVERAL})
        r.consultation("2026-10-12", OPD, hour=10)
        r.consultation("2026-10-13", OPD)
        r.consultation("2026-10-14", OPD)                   # 11 of 13: still under
        self.assertEqual(reasons(r.plan()[1], "encounter"), {wrong.id: vsp.SEVERAL})
        for d in range(15, 23):
            r.consultation("2026-10-%02d" % d, OPD)         # 19 of 21
        self.assertEqual(only(r.plan()[0], "encounter"), {wrong.id: (OPD, vsp.USUAL)})

    def test_two_services_on_the_same_day_fall_back_to_the_usual_one(self):
        r = Rows()
        r.consultation("2026-10-05", OPD)
        r.consultation("2026-10-05", OFFICE)
        wrong = r.consultation("2026-10-05", RECEPTION)
        self.assertEqual(reasons(r.plan()[1], "encounter"), {wrong.id: vsp.SEVERAL})

    def test_evidence_is_the_same_clinician_and_the_same_type(self):
        r = Rows()
        r.consultation("2026-10-05", OPD, clinician=DR_B)
        r.consultation("2026-10-05", WARDS, kind=IN)
        wrong = r.consultation("2026-10-05", RECEPTION)
        self.assertEqual(reasons(r.plan()[1], "encounter"), {wrong.id: vsp.NO_EVIDENCE})

    def test_test_and_retired_locations_are_neither_corrected_nor_evidence(self):
        r = Rows()
        r.consultation("2026-10-05", TEST)
        r.consultation("2026-10-05", CLOSED)
        wrong = r.consultation("2026-10-05", RECEPTION)
        changes, undecided = r.plan()
        self.assertEqual(changes, [])
        self.assertEqual(reasons(undecided, "encounter"), {wrong.id: vsp.NO_EVIDENCE})

    def test_a_consultation_at_a_service_is_never_moved(self):
        r = Rows()
        for d in range(1, 9):
            r.consultation("2026-10-%02d" % d, OPD)
        r.consultation("2026-10-09", OFFICE)
        self.assertEqual(r.plan(), ([], []))

    def test_corrected_consultations_are_not_evidence(self):
        two = rule(min_evidence=2)
        r = Rows()
        r.consultation("2026-10-05", OPD)
        first = r.consultation("2026-10-05", RECEPTION)
        later = r.consultation("2026-10-20", RECEPTION)
        changes, undecided = r.plan(two)
        self.assertEqual(only(changes, "encounter"), {first.id: (OPD, vsp.SAME_DAY)})
        self.assertEqual(reasons(undecided, "encounter"), {later.id: vsp.TOO_FEW})
        # after apply the first one is at outpatients: two consultations there, one of them ours
        r.encounters[first.id - 1] = first._replace(location=OPD)
        self.assertEqual(only(r.plan(two)[0], "encounter"), {later.id: (OPD, vsp.USUAL)})
        changes, undecided = r.plan(two, corrected={first.id})
        self.assertEqual(changes, [])
        self.assertEqual(reasons(undecided, "encounter"), {later.id: vsp.TOO_FEW})

    def test_period(self):
        r = Rows()
        r.consultation("2026-09-30", OPD)
        september = r.consultation("2026-09-30", RECEPTION)
        r.consultation("2026-10-01", OPD)
        october = r.consultation("2026-10-01", RECEPTION)
        self.assertEqual(set(only(r.plan()[0], "encounter")), {september.id, october.id})
        since = r.plan(since=datetime.date(2026, 10, 1))[0]
        before = r.plan(before=datetime.date(2026, 10, 1))[0]
        self.assertEqual(set(only(since, "encounter")), {october.id})
        self.assertEqual(set(only(before, "encounter")), {september.id})


class Visits(unittest.TestCase):

    def test_visit_takes_its_consultation_service(self):
        r = Rows()
        v = r.visit("2026-10-05", RECEPTION)
        r.consultation("2026-10-05", OPD, visit=v.id)
        changes, undecided = r.plan()
        self.assertEqual(only(changes, "visit"), {v.id: (OPD, vsp.CONSULTATION)})
        self.assertEqual(undecided, [])

    def test_visit_follows_a_consultation_corrected_in_the_same_run(self):
        r = Rows()
        r.consultation("2026-10-05", OFFICE)
        v = r.visit("2026-10-05", RECEPTION)
        wrong = r.consultation("2026-10-05", RECEPTION, visit=v.id)
        changes, _ = r.plan()
        self.assertEqual(only(changes, "encounter"), {wrong.id: (OFFICE, vsp.SAME_DAY)})
        self.assertEqual(only(changes, "visit"), {v.id: (OFFICE, vsp.CONSULTATION)})
        self.assertEqual([c.entity for c in changes], ["encounter", "visit"])

    def test_outpatient_first_then_the_most_recent(self):
        r = Rows()
        v = r.visit("2026-10-05", RECEPTION)
        r.consultation("2026-10-05", OFFICE, visit=v.id, hour=9)
        r.consultation("2026-10-05", OPD, visit=v.id, hour=11)
        r.consultation("2026-10-05", WARDS, visit=v.id, kind=IN, hour=15)
        self.assertEqual(only(r.plan()[0], "visit"), {v.id: (OPD, vsp.CONSULTATION)})

    def test_inpatient_consultation_when_there_is_no_outpatient_one(self):
        r = Rows()
        v = r.visit("2026-10-05", CASHIER)
        r.consultation("2026-10-05", WARDS, visit=v.id, kind=IN)
        self.assertEqual(only(r.plan()[0], "visit"), {v.id: (WARDS, vsp.CONSULTATION)})

    def test_same_time_the_later_record_wins(self):
        r = Rows()
        v = r.visit("2026-10-05", RECEPTION)
        r.consultation("2026-10-05", OFFICE, visit=v.id)
        r.consultation("2026-10-05", OPD, visit=v.id)
        self.assertEqual(only(r.plan()[0], "visit"), {v.id: (OPD, vsp.CONSULTATION)})

    def test_visit_without_consultation_is_undecided(self):
        r = Rows()
        v = r.visit("2026-10-05", RECEPTION)
        changes, undecided = r.plan()
        self.assertEqual(changes, [])
        self.assertEqual(reasons(undecided, "visit"), {v.id: vsp.NO_CONSULTATION})

    def test_visit_whose_consultation_is_undecided_or_test_data(self):
        r = Rows()
        a = r.visit("2026-10-05", RECEPTION)
        r.consultation("2026-10-05", RECEPTION, visit=a.id)
        b = r.visit("2026-10-06", RECEPTION)
        r.consultation("2026-10-06", TEST, visit=b.id, clinician=DR_B)
        changes, undecided = r.plan()
        self.assertEqual(only(changes, "visit"), {})
        self.assertEqual(reasons(undecided, "visit"),
                         {a.id: vsp.CONSULTATION_UNDECIDED, b.id: vsp.CONSULTATION_UNDECIDED})

    def test_visit_opened_at_a_service_keeps_it(self):
        r = Rows()
        v = r.visit("2026-10-05", WARDS)
        r.consultation("2026-10-05", OPD, visit=v.id)
        t = r.visit("2026-10-05", TEST)
        r.consultation("2026-10-05", OPD, visit=t.id)
        self.assertEqual(r.plan(), ([], []))

    def test_visit_without_location_is_corrected(self):
        r = Rows()
        v = r.visit("2026-10-05", None)
        r.consultation("2026-10-05", OPD, visit=v.id)
        self.assertEqual(only(r.plan()[0], "visit"), {v.id: (OPD, vsp.CONSULTATION)})

    def test_a_ward_gives_its_parent_that_is_a_visit_location(self):
        r = Rows()
        v = r.visit("2026-10-05", RECEPTION)
        r.consultation("2026-10-05", NEONATAL, visit=v.id)
        w = r.visit("2026-10-06", RECEPTION)
        r.consultation("2026-10-06", ANNEX, visit=w.id)
        changes, undecided = r.plan()
        self.assertEqual(only(changes, "visit"), {v.id: (WARDS, vsp.CONSULTATION)})
        self.assertEqual(reasons(undecided, "visit"), {w.id: vsp.NOT_VISIT_LOCATION})

    def test_second_run_finds_nothing(self):
        r = Rows()
        r.consultation("2026-10-05", OPD)
        v = r.visit("2026-10-05", RECEPTION)
        wrong = r.consultation("2026-10-05", RECEPTION, visit=v.id)
        changes, _ = r.plan()
        self.assertEqual(len(changes), 2)
        for c in changes:
            if c.entity == "encounter":
                r.encounters[c.id - 1] = r.encounters[c.id - 1]._replace(location=c.new)
            else:
                r.visits[c.id - 1] = r.visits[c.id - 1]._replace(location=c.new)
        self.assertEqual(r.plan(corrected={wrong.id}), ([], []))


CHANGES = [vsp.Change("encounter", 11, day("2026-10-05"), RECEPTION, OPD, vsp.SAME_DAY),
           vsp.Change("visit", 7, day("2026-10-05"), None, OPD, vsp.CONSULTATION)]


class Sql(unittest.TestCase):

    def test_apply_copies_checks_then_moves_in_one_transaction(self):
        sql = vsp.apply_sql(CHANGES, "222-test", 1)
        self.assertEqual(sql.count("START TRANSACTION;"), 1)
        self.assertEqual(sql.count("COMMIT;"), 1)
        copy, check, move = sql.index("INSERT INTO %s" % vsp.TABLE), sql.index("SIGNAL"), sql.index("UPDATE")
        self.assertTrue(sql.index("START TRANSACTION;") < copy < check < move < sql.index("COMMIT;"))
        self.assertIn("('encounter', 11, 5, 6, 'same day')", sql)
        self.assertIn("('visit', 7, NULL, 6, 'consultation of the visit')", sql)
        # the check counts the two planned rows, and a row is copied only if it is still as planned
        self.assertIn("entity <> 'obs') <> 2 THEN", sql)
        self.assertEqual(sql.count("r.location_id <=> p.old_location_id AND r.voided = 0"), 2)
        self.assertNotIn("DELETE", sql)
        self.assertNotIn("DROP", sql)

    def test_apply_only_moves_copied_rows_and_stamps_who_and_when(self):
        updates = [l for l in vsp.apply_sql(CHANGES, "222-test", 42).splitlines() if l.startswith("UPDATE")]
        self.assertEqual(len(updates), 3)
        for line in updates:
            self.assertIn("JOIN %s c ON c.run_id = '222-test'" % vsp.TABLE, line)
        self.assertEqual(sum("r.changed_by = 42, r.date_changed = @now" in l for l in updates), 2)

    def test_restore_puts_back_only_rows_still_as_corrected(self):
        sql = vsp.restore_sql("222-test")
        updates = [l for l in sql.splitlines() if l.startswith("UPDATE")]
        self.assertEqual(len(updates), 3)
        for line in updates:
            self.assertIn("c.restored_at IS NULL AND r.location_id <=> c.new_location_id", line)
            self.assertIn("r.location_id = c.old_location_id", line)
            self.assertIn("c.run_id = '222-test'", line)
        self.assertEqual(sum("r.changed_by = c.old_changed_by" in l for l in updates), 2)

    def test_quoting(self):
        self.assertEqual(vsp.sql_str("o'k\\"), "'o''k\\\\'")
        self.assertEqual(vsp.sql_int(None), "NULL")


class FakeServer:
    """Answers the script's queries from made-up rows; records every script it receives."""

    def __init__(self, consultations=(), visits=(), corrected=None, users=("1",)):
        self.consultations, self.visits = list(consultations), list(visits)
        self.corrected, self.users, self.scripts = corrected, list(users), []

    def answer(self, statement):
        if statement.startswith("SELECT 'visit_service_point'"):
            return ["visit_service_point"]
        if "information_schema.tables" in statement:
            return ["0" if self.corrected is None else "1"]
        if statement.startswith("SELECT l.location_id"):
            return ["5\tbb9c7bdc-e654-060e-5e6c-4eef309c7a04\tReception\tNULL\t0\t1",
                    "6\t44c3efb0-2583-4c80-a79e-1f756a03c0a1\tOutpatients\tNULL\t0\t1"]
        if statement.startswith("SELECT encounter_type_id"):
            return ["1\t0ff55309-1897-476b-a647-c7c180b102c8", "2\t43f383ec-90fd-4273-be45-9c1906dda9aa"]
        if statement.startswith("SELECT e.encounter_id"):
            return self.consultations
        if statement.startswith("SELECT visit_id"):
            return self.visits
        if statement.startswith("SELECT entity_id"):
            return self.corrected or []
        if statement.startswith("SELECT user_id"):
            return self.users
        if statement.startswith("SELECT COUNT(*) FROM obs"):
            return ["12"]
        if statement.startswith("SELECT COUNT(*) FROM %s WHERE run_id" % vsp.TABLE):
            return ["0"]
        return []

    def __call__(self, command, sql):
        self.scripts.append(sql)
        if "START TRANSACTION" in sql:
            return 0, "%s\t0\nencounter\t1\nobs\t12\nvisit\t1\n" % vsp.MARK, ""
        out = []
        for statement in sql.split(";\n"):
            statement = statement.strip()
            if statement.startswith("SELECT '%s'" % vsp.MARK):
                out.append("%s\t%s" % (vsp.MARK, statement.rsplit(",", 1)[1].strip()))
            elif statement and not statement.startswith("SET NAMES"):
                out += self.answer(statement)
        return 0, "\n".join(out) + "\n", ""


ROWS = dict(
    consultations=["1\tNULL\t101\t2026-10-05 09:00:00\t6\t1", "2\t1\t101\t2026-10-05 10:00:00\t5\t1"],
    visits=["1\t2026-10-05 08:00:00\t5", "2\t2026-10-06 08:00:00\t5"])
LIMITED_SITE = {"consultationEncounterTypes": ["0ff55309-1897-476b-a647-c7c180b102c8"],
                "notAService": ["BB9C7BDC-E654-060E-5E6C-4EEF309C7A04"]}


class Commands(unittest.TestCase):

    def run_main(self, argv, server):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stderr(err):
            code = vsp.main(argv + ["--mysql", "fake"], runner=server, out=out)
        return code, out.getvalue(), err.getvalue()

    def site(self, content):
        path = os.path.join(os.path.dirname(SITE), ".test-site.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(content, f)
        self.addCleanup(os.remove, path)
        return path

    def test_site_file_is_complete(self):
        site = vsp.load_site(SITE)
        self.assertEqual(vsp.uuids(site["consultationEncounterTypes"])[0], "0ff55309-1897-476b-a647-c7c180b102c8")
        listed = vsp.uuids(site["notAService"]) + vsp.uuids(site["ignored"])
        self.assertEqual(len(listed), len(set(listed)))

    def test_plan_prints_counts_and_writes_nothing(self):
        server = FakeServer(**ROWS)
        code, out, _ = self.run_main(["plan", "--site", self.site(LIMITED_SITE)], server)
        self.assertEqual(code, 0)
        self.assertIn("DRY RUN, nothing is written.", out)
        self.assertIn("Consultations filed at a location that is not a service: 1 to correct, 0 undecided", out)
        self.assertIn("2026-10  Reception  Outpatients  same day", out)
        self.assertIn("Visits opened at a location that is not a service: 1 to correct, 1 undecided", out)
        self.assertIn("no consultation in the visit", out)
        self.assertIn("Observations moving with their consultation: 12", out)
        for script in server.scripts:
            for word in ("UPDATE", "INSERT", "DELETE", "CREATE", "START TRANSACTION"):
                self.assertNotIn(word, script)

    def test_a_uuid_unknown_on_the_server_is_refused(self):
        code, _, err = self.run_main(["plan", "--site", SITE], FakeServer(**ROWS))
        self.assertEqual(code, 2)
        self.assertIn("not on the server", err)

    def test_apply_needs_the_target_twice(self):
        server = FakeServer(**ROWS)
        code, _, err = self.run_main(["apply", "--site", self.site(LIMITED_SITE), "--target", "uvl-uat"], server)
        self.assertEqual(code, 2)
        self.assertIn("--i-confirm-target=uvl-uat", err)
        self.assertFalse(any("START TRANSACTION" in s for s in server.scripts))

    def test_apply_needs_one_account(self):
        server = FakeServer(users=[], **ROWS)
        code, _, err = self.run_main(["apply", "--site", self.site(LIMITED_SITE), "--target", "t",
                                      "--i-confirm-target=t"], server)
        self.assertEqual(code, 2)
        self.assertIn("need exactly one", err)

    def test_apply_writes_one_script(self):
        server = FakeServer(**ROWS)
        code, out, _ = self.run_main(["apply", "--site", self.site(LIMITED_SITE), "--target", "t",
                                      "--i-confirm-target=t", "--run-id", "222-test"], server)
        writes = [s for s in server.scripts if "START TRANSACTION" in s]
        self.assertEqual(len(writes), 1)
        self.assertIn("('encounter', 2, 5, 6, 'same day')", writes[0])
        self.assertIn("('visit', 1, 5, 6, 'consultation of the visit')", writes[0])
        self.assertIn("run id 222-test", out)
        # the fake server does not move rows, so the plan made afterwards still finds them
        self.assertEqual(code, 1)
        self.assertIn("A new plan now finds 2 row(s) to correct (0 expected).", out)

    def test_restore_of_an_unknown_run_is_refused(self):
        code, _, err = self.run_main(["restore", "--run-id", "nope"], FakeServer(corrected=[]))
        self.assertEqual(code, 2)
        self.assertIn("no row to restore", err)


if __name__ == "__main__":
    unittest.main()
