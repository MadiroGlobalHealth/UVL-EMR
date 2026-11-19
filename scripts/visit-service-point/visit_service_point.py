#!/usr/bin/env python3
"""
Correct the service point of visits and consultations already recorded (UVL-EMR#222).

Since #222, #678 and #691 a NEW visit records the service chosen when it is started, and its
encounters are filed at that service. Before that, a visit took the location of whoever opened
it (reception for most), and a consultation took the location its clinician was signed in at,
which was sometimes reception too. The reports read the service from the location of the
consultation encounter (PBF registers, monthly PBF summary, MoH sheet 15, the « Service (point
de prestation) » column) and from the location of the visit (« Lieu d'accueil », visits
started), so both are corrected here, once, on the OpenMRS database.

The rule, in this order:

  1. A consultation (the encounter types of `consultationEncounterTypes`) filed at a location
     where no patient is seen (`notAService`: reception, cashier, laboratory, pharmacy, X-ray)
     moves to the service where the same clinician (the account that recorded it) filed the
     other consultations of the same type:
       a. on the same day, when they are all at one service (basis « same day »);
       b. otherwise in the `windowDays` days before and after, when at least `minShare` of
          them, and at least `minEvidence`, are at one service (basis « usual service »).
     Neither: the consultation is left as it is and counted as undecided. Consultations this
     script has already moved are never used as evidence, so a second run decides nothing new.
     The observations of a moved consultation that carry its old location move with it, as
     OpenMRS does when an encounter's location is edited.
  2. A visit opened at a `notAService` location takes the location of its consultation, after
     step 1: Outpatient Consultation first, else Inpatient Consultation; if several, the most
     recent one. This is the rule of the visits report. A service that is not tagged « Visit
     Location » (a ward) gives its nearest parent that is. A visit with no consultation, or
     whose consultation is undecided, is left as it is and counted as undecided.

Nothing else moves: a visit opened at a service keeps it even when its consultation is
elsewhere, vitals and orders stay where they were filed, voided rows and the locations of
`ignored` (test data) are not touched.

    plan     the dry run: counts by month, by from -> to location and by basis, and the
             undecided ones by reason. Read-only. Prints counts only, never a row.
    apply    the same plan, written in ONE transaction. Every changed row is first copied to
             the table uvl_service_point_correction (old and new location, basis, the previous
             changed_by and date_changed) under a run id. A row that changed between the plan
             and the write stops the transaction; nothing is written.
    restore  puts back the rows of one run id from that table, dry run unless --commit. A row
             somebody changed after the correction is left and counted.

Each database is reached through a shell command that reads SQL on stdin, so the script runs
from a laptop over SSH and needs nothing on the server:

    U='ssh -F ~/work/scaleway-deploy/uvl-emr-uat-scw/ssh_config uvl-uat-scw'
    MYSQL="$U docker exec -i ozone-msf-mugamba-mysql-1 sh -c \\\\'mysql -uroot -p\\\\\\$MYSQL_ROOT_PASSWORD -B -N openmrs\\\\'"
    S=scripts/visit-service-point
    $S/visit_service_point.py plan  --mysql "$MYSQL" --site $S/visit-service-point.mugamba.json
    $S/visit_service_point.py apply --mysql "$MYSQL" --site $S/visit-service-point.mugamba.json \\
        --target uvl-uat --i-confirm-target=uvl-uat
    $S/visit_service_point.py restore --mysql "$MYSQL" --run-id <run id> [--commit]

README.md in this folder gives the whole procedure, with the backup to take first.

Exit codes: 0 ok · 1 failed · 2 refused, nothing written.
"""
import argparse
import bisect
import collections
import datetime
import json
import re
import subprocess
import sys

TABLE = "uvl_service_point_correction"
MARK = "#visit_service_point"
VISIT_LOCATION_TAG = "Visit Location"
CHUNK = 500
STALE = "visit_service_point: rows changed since the plan was made, nothing written"

Location = collections.namedtuple("Location", "id uuid name parent retired visit_tag")
Encounter = collections.namedtuple("Encounter", "id visit clinician when location type")
Visit = collections.namedtuple("Visit", "id started location")
Change = collections.namedtuple("Change", "entity id when old new basis")
Undecided = collections.namedtuple("Undecided", "entity id when location reason")

SAME_DAY = "same day"
USUAL = "usual service"
CONSULTATION = "consultation of the visit"
NO_EVIDENCE = "no other consultation of this clinician at a service"
SEVERAL = "clinician consults in several services"
TOO_FEW = "too few other consultations of this clinician at a service"
NO_CONSULTATION = "no consultation in the visit"
CONSULTATION_UNDECIDED = "consultation of the visit not at a service"
NOT_VISIT_LOCATION = "service and its parents are not a visit location"


class Refused(Exception):
    """Raised before anything is written; exit code 2."""


# ---------------------------------------------------------------------------
# The rule
# ---------------------------------------------------------------------------

class Rule:
    """Which locations are services, and the thresholds of step 1b."""

    def __init__(self, locations, not_a_service, ignored, types, window_days=30, min_share=0.9,
                 min_evidence=5):
        self.locations = {l.id: l for l in locations}
        self.not_a_service, self.ignored = set(not_a_service), set(ignored)
        self.types = list(types)                      # encounter type ids, the preferred one first
        self.window = datetime.timedelta(days=window_days)
        self.min_share, self.min_evidence = min_share, min_evidence

    def to_correct(self, location):
        return location is None or location in self.not_a_service

    def is_service(self, location):
        known = self.locations.get(location)
        return (known is not None and not known.retired
                and location not in self.not_a_service and location not in self.ignored)

    def visit_location(self, location):
        """The location itself when a visit can be there, else its nearest parent that can."""
        seen = set()
        while location in self.locations and location not in seen:
            seen.add(location)
            if self.is_service(location) and self.locations[location].visit_tag:
                return location
            location = self.locations[location].parent
        return None

    def preference(self, encounter):
        return (-self.types.index(encounter.type), encounter.when, encounter.id)


class Evidence:
    """Where each clinician filed consultations at a service, untouched by this script."""

    def __init__(self, encounters, rule, corrected=()):
        self.rule = rule
        self.days = collections.defaultdict(collections.Counter)
        self.dates = collections.defaultdict(list)
        corrected = set(corrected)
        for e in encounters:
            if e.id in corrected or not rule.is_service(e.location):
                continue
            self.days[(e.clinician, e.type, e.when.date())][e.location] += 1
            self.dates[(e.clinician, e.type)].append((e.when.date(), e.location))
        for dated in self.dates.values():
            dated.sort()

    def decide(self, encounter):
        """(service, basis), or (None, reason)."""
        who, day = (encounter.clinician, encounter.type), encounter.when.date()
        same_day = self.days.get(who + (day,))
        if same_day and len(same_day) == 1:
            return next(iter(same_day)), SAME_DAY
        dated = self.dates.get(who, [])
        low = bisect.bisect_left(dated, (day - self.rule.window, -1))
        high = bisect.bisect_right(dated, (day + self.rule.window, float("inf")))
        around = collections.Counter(location for _, location in dated[low:high])
        if not around:
            return None, NO_EVIDENCE
        (service, count), total = around.most_common(1)[0], sum(around.values())
        if count < self.rule.min_share * total:
            return None, SEVERAL
        if count < self.rule.min_evidence:
            return None, TOO_FEW
        return service, USUAL


def make_plan(encounters, visits, rule, corrected=(), since=None, before=None):
    """The changes to make and the rows left undecided, encounters first."""

    def in_period(when):
        return (since is None or when.date() >= since) and (before is None or when.date() < before)

    evidence = Evidence(encounters, rule, corrected)
    changes, undecided, after = [], [], {}
    for e in sorted(encounters, key=lambda e: e.id):
        after[e.id] = e.location
        if not rule.to_correct(e.location) or not in_period(e.when):
            continue
        service, basis = evidence.decide(e)
        if service is None:
            undecided.append(Undecided("encounter", e.id, e.when, e.location, basis))
        else:
            after[e.id] = service
            changes.append(Change("encounter", e.id, e.when, e.location, service, basis))

    of_visit = collections.defaultdict(list)
    for e in encounters:
        if e.visit is not None:
            of_visit[e.visit].append(e)
    for v in sorted(visits, key=lambda v: v.id):
        if not rule.to_correct(v.location) or not in_period(v.started):
            continue
        consultations = of_visit.get(v.id)
        if not consultations:
            undecided.append(Undecided("visit", v.id, v.started, v.location, NO_CONSULTATION))
            continue
        service = after[max(consultations, key=rule.preference).id]
        if not rule.is_service(service):
            undecided.append(Undecided("visit", v.id, v.started, v.location, CONSULTATION_UNDECIDED))
            continue
        target = rule.visit_location(service)
        if target is None:
            undecided.append(Undecided("visit", v.id, v.started, v.location, NOT_VISIT_LOCATION))
        else:
            changes.append(Change("visit", v.id, v.started, v.location, target, CONSULTATION))
    return changes, undecided


# ---------------------------------------------------------------------------
# Talking to the database
# ---------------------------------------------------------------------------

def sql_str(value):
    return "'" + str(value).replace("\\", "\\\\").replace("'", "''") + "'"


def sql_int(value):
    return "NULL" if value is None else "%d" % value


def chunks(values, size=CHUNK):
    for i in range(0, len(values), size):
        yield values[i:i + size]


class MySQL:
    """Runs one SQL script through a shell command and returns its tab-separated rows."""

    def __init__(self, command, runner=None):
        self.command = command
        self.runner = runner or self._run

    @staticmethod
    def _run(command, sql):
        proc = subprocess.run(command, shell=True, input=sql, capture_output=True, text=True)
        return proc.returncode, proc.stdout, proc.stderr

    def script(self, sql):
        code, out, err = self.runner(self.command, "SET NAMES utf8mb4;\n" + sql)
        if code != 0:
            tail = [l for l in err.splitlines() if l.strip()][-3:]
            raise RuntimeError("mysql failed (exit %s): %s" % (code, " | ".join(tail)))
        return [line.split("\t") for line in out.splitlines() if line != ""]

    def queries(self, statements):
        """Each statement's rows, in order. One round trip for the lot."""
        sql = "".join("SELECT '%s', %d;\n%s;\n" % (MARK, i, s.rstrip().rstrip(";"))
                      for i, s in enumerate(statements))
        return split_results(self.script(sql), len(statements))


def split_results(rows, count):
    results, current = [[] for _ in range(count)], None
    for row in rows:
        if row[0] == MARK:
            current = int(row[1])
        elif current is None:
            raise RuntimeError("mysql printed output before the first query: is it running with "
                               "the options this script documents?")
        else:
            results[current].append(row)
    return results


def integer(text):
    return None if text == "NULL" else int(text)


def moment(text):
    return datetime.datetime.strptime(text[:19], "%Y-%m-%d %H:%M:%S")


def load_site(path):
    with open(path, encoding="utf-8") as f:
        site = json.load(f)
    for key in ("consultationEncounterTypes", "notAService"):
        if not site.get(key):
            raise Refused("%s: « %s » is missing or empty" % (path, key))
    return site


def uuids(entries):
    return [(e["uuid"] if isinstance(e, dict) else e).lower() for e in entries]


def read_server(db, site):
    """(rule, encounters, visits, encounters already corrected) from the server, read-only."""
    types = uuids(site["consultationEncounterTypes"])
    type_list = ", ".join(sql_str(u) for u in types)
    has_table = db.queries(["SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = "
                            "DATABASE() AND table_name = '%s'" % TABLE])[0][0][0] != "0"
    locations, type_rows, encounters, visits, corrected = db.queries([
        "SELECT l.location_id, LOWER(l.uuid), l.name, l.parent_location, l.retired, EXISTS ("
        "SELECT 1 FROM location_tag_map m JOIN location_tag t ON t.location_tag_id = m.location_tag_id "
        "WHERE m.location_id = l.location_id AND t.name = %s AND t.retired = 0) FROM location l"
        % sql_str(VISIT_LOCATION_TAG),
        "SELECT encounter_type_id, LOWER(uuid) FROM encounter_type WHERE uuid IN (%s)" % type_list,
        "SELECT e.encounter_id, e.visit_id, e.creator, e.encounter_datetime, e.location_id, "
        "e.encounter_type FROM encounter e JOIN encounter_type t ON t.encounter_type_id = "
        "e.encounter_type WHERE e.voided = 0 AND t.uuid IN (%s)" % type_list,
        "SELECT visit_id, date_started, location_id FROM visit WHERE voided = 0",
        ("SELECT entity_id FROM %s WHERE entity = 'encounter' AND restored_at IS NULL" % TABLE)
        if has_table else "SELECT 1 FROM DUAL WHERE 1 = 0",
    ])
    locations = [Location(int(r[0]), r[1], r[2], integer(r[3]), r[4] == "1", r[5] == "1")
                 for r in locations]
    by_uuid = {l.uuid: l.id for l in locations}
    type_ids = {r[1]: int(r[0]) for r in type_rows}

    def resolve(key, known, what):
        missing = [u for u in uuids(site.get(key, [])) if u not in known]
        if missing:
            raise Refused("%s of « %s » not on the server: %s" % (what, key, ", ".join(missing)))
        return [known[u] for u in uuids(site.get(key, []))]

    rule = Rule(locations, resolve("notAService", by_uuid, "location"),
                resolve("ignored", by_uuid, "location"),
                resolve("consultationEncounterTypes", type_ids, "encounter type"),
                site.get("windowDays", 30), site.get("minShare", 0.9), site.get("minEvidence", 5))
    encounters = [Encounter(int(r[0]), integer(r[1]), int(r[2]), moment(r[3]), integer(r[4]), int(r[5]))
                  for r in encounters]
    visits = [Visit(int(r[0]), moment(r[1]), integer(r[2])) for r in visits]
    return rule, encounters, visits, {int(r[0]) for r in corrected}


def count_observations(db, changes):
    """Observations that move with their consultation: those still at its old location."""
    total = 0
    for part in chunks([c for c in changes if c.entity == "encounter"]):
        total += int(db.queries([
            "SELECT COUNT(*) FROM obs o JOIN encounter e ON e.encounter_id = o.encounter_id "
            "WHERE o.location_id <=> e.location_id AND e.encounter_id IN (%s)"
            % ", ".join("%d" % c.id for c in part)])[0][0][0])
    return total


# ---------------------------------------------------------------------------
# Writing
# ---------------------------------------------------------------------------

CREATE_TABLE = """CREATE TABLE IF NOT EXISTS %s (
  correction_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  run_id VARCHAR(40) NOT NULL,
  entity VARCHAR(10) NOT NULL COMMENT 'visit, encounter or obs',
  entity_id INT NOT NULL,
  old_location_id INT NULL,
  new_location_id INT NOT NULL,
  basis VARCHAR(60) NOT NULL,
  old_changed_by INT NULL,
  old_date_changed DATETIME NULL,
  corrected_at DATETIME NOT NULL,
  restored_at DATETIME NULL,
  UNIQUE KEY uvl_spc_run_row (run_id, entity, entity_id),
  KEY uvl_spc_row (entity, entity_id)
) COMMENT = 'UVL-EMR#222: rows whose location visit_service_point.py corrected';
""" % TABLE

# entity -> (table, primary key, has changed_by and date_changed)
ENTITIES = (("encounter", "encounter", "encounter_id", True), ("visit", "visit", "visit_id", True))


def apply_sql(changes, run_id, user_id):
    """One transaction: copy the rows to the correction table, check them, then move them."""
    run = sql_str(run_id)
    out = [CREATE_TABLE,
           "CREATE TEMPORARY TABLE uvl_spc_plan (entity VARCHAR(10) NOT NULL, entity_id INT NOT NULL, "
           "old_location_id INT NULL, new_location_id INT NOT NULL, basis VARCHAR(60) NOT NULL, "
           "PRIMARY KEY (entity, entity_id));",
           "START TRANSACTION;", "SET @now = NOW();"]
    for part in chunks(changes):
        out.append("INSERT INTO uvl_spc_plan VALUES %s;" % ", ".join(
            "(%s, %d, %s, %d, %s)" % (sql_str(c.entity), c.id, sql_int(c.old), c.new, sql_str(c.basis))
            for c in part))
    for entity, table, key, _ in ENTITIES:
        out.append(
            "INSERT INTO %s (run_id, entity, entity_id, old_location_id, new_location_id, basis, "
            "old_changed_by, old_date_changed, corrected_at) SELECT %s, p.entity, p.entity_id, "
            "r.location_id, p.new_location_id, p.basis, r.changed_by, r.date_changed, @now "
            "FROM uvl_spc_plan p JOIN `%s` r ON r.`%s` = p.entity_id AND r.location_id <=> "
            "p.old_location_id AND r.voided = 0 WHERE p.entity = %s;"
            % (TABLE, run, table, key, sql_str(entity)))
    out.append(
        "INSERT INTO %s (run_id, entity, entity_id, old_location_id, new_location_id, basis, "
        "corrected_at) SELECT %s, 'obs', o.obs_id, o.location_id, p.new_location_id, p.basis, @now "
        "FROM uvl_spc_plan p JOIN obs o ON o.encounter_id = p.entity_id AND o.location_id <=> "
        "p.old_location_id WHERE p.entity = 'encounter';" % (TABLE, run))
    # A planned row that is no longer as planned was not copied: stop, the client then
    # disconnects and the transaction is rolled back.
    out.append(
        "DELIMITER //\nBEGIN NOT ATOMIC\n  IF (SELECT COUNT(*) FROM %s WHERE run_id = %s AND entity "
        "<> 'obs') <> %d THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = %s;\n  END IF;\nEND//\n"
        "DELIMITER ;" % (TABLE, run, len(changes), sql_str(STALE)))
    for entity, table, key, _ in ENTITIES:
        out.append(
            "UPDATE `%s` r JOIN %s c ON c.run_id = %s AND c.entity = %s AND c.entity_id = r.`%s` "
            "SET r.location_id = c.new_location_id, r.changed_by = %d, r.date_changed = @now;"
            % (table, TABLE, run, sql_str(entity), key, user_id))
    out.append("UPDATE obs r JOIN %s c ON c.run_id = %s AND c.entity = 'obs' AND c.entity_id = "
               "r.obs_id SET r.location_id = c.new_location_id;" % (TABLE, run))
    out += ["COMMIT;", "SELECT '%s', 0;" % MARK,
            "SELECT entity, COUNT(*) FROM %s WHERE run_id = %s GROUP BY entity;" % (TABLE, run)]
    return "\n".join(out) + "\n"


def restore_queries(run_id):
    """Rows of the run that can be put back, and those changed since, per entity."""
    run = sql_str(run_id)
    live = " UNION ALL ".join(
        "SELECT %s AS entity, `%s` AS entity_id, location_id FROM `%s`" % (sql_str(e), key, table)
        for e, table, key in [(e, t, k) for e, t, k, _ in ENTITIES] + [("obs", "obs", "obs_id")])
    return ["SELECT c.entity, SUM(r.location_id <=> c.new_location_id), "
            "SUM(NOT (r.location_id <=> c.new_location_id)) FROM %s c JOIN (%s) r ON r.entity = "
            "c.entity AND r.entity_id = c.entity_id WHERE c.run_id = %s AND c.restored_at IS NULL "
            "GROUP BY c.entity" % (TABLE, live, run)]


def restore_sql(run_id):
    run = sql_str(run_id)
    out = ["START TRANSACTION;", "SET @now = NOW();"]
    for entity, table, key, audited in ENTITIES + (("obs", "obs", "obs_id", False),):
        audit = ", r.changed_by = c.old_changed_by, r.date_changed = c.old_date_changed" if audited else ""
        out.append(
            "UPDATE `%s` r JOIN %s c ON c.run_id = %s AND c.entity = %s AND c.entity_id = r.`%s` "
            "AND c.restored_at IS NULL AND r.location_id <=> c.new_location_id "
            "SET r.location_id = c.old_location_id%s, c.restored_at = @now;"
            % (table, TABLE, run, sql_str(entity), key, audit))
    out += ["COMMIT;", "SELECT '%s', 0;" % MARK,
            "SELECT entity, SUM(restored_at IS NOT NULL), SUM(restored_at IS NULL) FROM %s "
            "WHERE run_id = %s GROUP BY entity;" % (TABLE, run)]
    return "\n".join(out) + "\n"


# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------

def table(rows, header, out):
    rows = [[str(c) for c in r] for r in rows]
    widths = [max(len(r[i]) for r in [header] + rows) for i in range(len(header))]
    for r in [header] + rows:
        print("  " + "  ".join(c.ljust(w) for c, w in zip(r, widths)).rstrip(), file=out)


def print_plan(changes, undecided, rule, observations, out):
    def name(location):
        return rule.locations[location].name if location in rule.locations else "(none)"

    for entity, title in (("encounter", "Consultations filed at a location that is not a service"),
                          ("visit", "Visits opened at a location that is not a service")):
        moved = [c for c in changes if c.entity == entity]
        left = [u for u in undecided if u.entity == entity]
        print("\n%s: %d to correct, %d undecided" % (title, len(moved), len(left)), file=out)
        if moved:
            counts = collections.Counter((c.when.strftime("%Y-%m"), name(c.old), name(c.new), c.basis)
                                         for c in moved)
            table([k + (n,) for k, n in sorted(counts.items())],
                  ["month", "from", "to", "basis", "count"], out)
            print("  by resulting service:", file=out)
            table(collections.Counter(name(c.new) for c in moved).most_common(), ["service", "count"], out)
        if left:
            print("  undecided, left as they are:", file=out)
            counts = collections.Counter((u.when.strftime("%Y-%m"), name(u.location), u.reason) for u in left)
            table([k + (n,) for k, n in sorted(counts.items())], ["month", "at", "reason", "count"], out)
    if observations is not None:
        print("\nObservations moving with their consultation: %d" % observations, file=out)


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def planned(args, db):
    site = load_site(args.site)
    rule, encounters, visits, corrected = read_server(db, site)
    changes, undecided = make_plan(encounters, visits, rule, corrected, args.since, args.before)
    return rule, changes, undecided


def cmd_plan(args, db, out):
    rule, changes, undecided = planned(args, db)
    print("DRY RUN, nothing is written.", file=out)
    print_plan(changes, undecided, rule, count_observations(db, changes), out)
    return 0


def cmd_apply(args, db, out):
    if args.confirm != args.target:
        raise Refused("apply needs --i-confirm-target=%s (the --target label, repeated)" % args.target)
    if not re.match(r"^[A-Za-z0-9._-]{1,40}$", args.run_id):
        raise Refused("--run-id: letters, digits, « . », « _ » and « - » only, 40 at most")
    user = db.queries(["SELECT user_id FROM users WHERE retired = 0 AND (username = %s OR system_id = %s)"
                       % (sql_str(args.user), sql_str(args.user))])[0]
    if len(user) != 1:
        raise Refused("--user %s: %d accounts on the server, need exactly one" % (args.user, len(user)))
    rule, changes, undecided = planned(args, db)
    print("APPLY on %s, run id %s." % (args.target, args.run_id), file=out)
    print_plan(changes, undecided, rule, None, out)
    if not changes:
        print("\nNothing to correct.", file=out)
        return 0
    used = db.queries([CREATE_TABLE.rstrip().rstrip(";"),
                       "SELECT COUNT(*) FROM %s WHERE run_id = %s" % (TABLE, sql_str(args.run_id))])[1]
    if used[0][0] != "0":
        raise Refused("run id %s already has rows in %s" % (args.run_id, TABLE))
    done = split_results(db.script(apply_sql(changes, args.run_id, int(user[0][0]))), 1)[0]
    print("\nWritten in one transaction, rows copied to %s under run id %s:" % (TABLE, args.run_id), file=out)
    table(sorted(done), ["entity", "rows"], out)
    _, again, _ = planned(args, db)
    print("A new plan now finds %d row(s) to correct (0 expected)." % len(again), file=out)
    return 0 if not again else 1


def cmd_restore(args, db, out):
    exists = db.queries(["SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = "
                         "DATABASE() AND table_name = '%s'" % TABLE])[0][0][0] != "0"
    rows = db.queries(restore_queries(args.run_id))[0] if exists else []
    if not rows:
        raise Refused("run id %s has no row to restore in %s" % (args.run_id, TABLE))
    if not args.commit:
        print("DRY RUN, nothing is written. Rows of run id %s:" % args.run_id, file=out)
        table(sorted(rows), ["entity", "to restore", "changed since, left"], out)
        return 0
    done = split_results(db.script(restore_sql(args.run_id)), 1)[0]
    print("RESTORED run id %s in one transaction:" % args.run_id, file=out)
    table(sorted(done), ["entity", "restored", "changed since, left"], out)
    return 0


def iso_date(text):
    return datetime.datetime.strptime(text, "%Y-%m-%d").date()


def main(argv=None, runner=None, out=None):
    out = out or sys.stdout
    ap = argparse.ArgumentParser(description="Correct the service point of recorded visits (UVL-EMR#222).")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("plan", "apply", "restore"):
        p = sub.add_parser(name)
        p.add_argument("--mysql", required=True, help="shell command running `mysql -B -N openmrs`, SQL on stdin")
        if name == "restore":
            p.add_argument("--run-id", required=True)
            p.add_argument("--commit", action="store_true", help="write; without it, a dry run")
            continue
        p.add_argument("--site", required=True, help="the site's JSON: consultation types, locations that are not a service")
        p.add_argument("--since", type=iso_date, help="only rows dated from this day (yyyy-mm-dd)")
        p.add_argument("--before", type=iso_date, help="only rows dated before this day (yyyy-mm-dd)")
        if name == "apply":
            p.add_argument("--target", required=True, help="a label for the server, e.g. uvl-uat")
            p.add_argument("--i-confirm-target", dest="confirm")
            p.add_argument("--user", default="admin", help="OpenMRS account recorded as changed_by")
            p.add_argument("--run-id", default="222-" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
    args = ap.parse_args(argv)
    try:
        db = MySQL(args.mysql, runner)
        if db.queries(["SELECT 'visit_service_point'"])[0] != [["visit_service_point"]]:
            raise Refused("--mysql must run mysql with -B -N (batch, no column names)")
        return {"plan": cmd_plan, "apply": cmd_apply, "restore": cmd_restore}[args.cmd](args, db, out)
    except Refused as e:
        print("REFUSED: %s" % e, file=sys.stderr)
        return 2
    except (RuntimeError, OSError, ValueError) as e:
        print("FAILED: %s" % e, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
