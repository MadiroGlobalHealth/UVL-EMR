#!/usr/bin/env python3
"""
Find, remove and confirm the absence of real patient data on a UAT copy (UVL-EMR#263).

UAT was restored from Mugamba production, so it holds real patients. Volunteers with
external addresses must not see them. This script works on the databases directly,
because the REST API neither sees voided rows nor reaches Odoo:

    audit  count the patients that are not synthetic, in OpenMRS (voided rows too),
           in Odoo (patient partners) and in the Orthanc index. Exit 1 if any remain.
           Read-only. Prints counts only, never a name or an identifier.
    purge  remove them. Dry run unless --apply: prints, per table, how many rows the
           purge would delete or detach. Read-only until --apply.

A patient is synthetic when every one of its names (voided ones included) has a
family or given name starting with SYNTH-, or with E2E, QA, TEST or DEMO followed by
a non-letter (the names synthetic_dataset.py and the uat-qa runs create). Anything
else is treated as real, so a doubtful record is removed, never kept.

What --apply does:

  OpenMRS  deletes the real patients' persons and every row that reaches them through
           a foreign key (names, addresses, attributes, identifiers, visits,
           encounters, obs, orders, appointments, conditions, ...), found from the live
           schema, in one transaction with foreign-key checks on. Stock ledger rows are
           kept with their patient, encounter and order links cleared, so stock levels
           do not move. Then it rotates the binary log and purges the old files, which
           would otherwise still hold the deleted rows.
  Odoo     cannot delete posted invoices, so it pseudonymises instead: each real
           patient partner becomes PURGED-<id> with its contact, identifier and
           birth-date fields cleared; copies of the old name on linked records are
           replaced; chatter messages, followers and attachments of those records are
           deleted.
  Orthanc  is only audited. A non-synthetic study is deleted by hand in Orthanc.

Guards, all checked before the first write:
  - --apply needs the --target label repeated as --i-confirm-target; a label naming
    production is refused.
  - no binary-log reader may be connected: stop eip-odoo-openmrs and
    eip-openmrs-orthanc first, or they turn the deletions into Odoo deletions.
  - no real patient may have been registered in the last --recent-days days (14):
    production registers patients every day, a UAT copy does not.
  - the purge must not reach a user or provider row (staff accounts).

Each database is reached through a shell command that reads SQL on stdin, so the
script runs from a laptop over SSH and needs nothing on the server:

    U='ssh -F ~/work/scaleway-deploy/uvl-emr-uat-scw/ssh_config uvl-uat-scw'
    MYSQL="$U docker exec -i ozone-msf-mugamba-mysql-1 sh -c \\\\'mysql -uroot -p\\\\\\$MYSQL_ROOT_PASSWORD -B -N openmrs\\\\'"
    PSQL="$U docker exec -i ozone-msf-mugamba-postgresql-1 sh -c \\\\'psql -U \\\\\\$POSTGRES_USER -X -d postgres\\\\'"
    scripts/uat-dataset/uat_phi.py audit --mysql "$MYSQL" --psql "$PSQL"
    scripts/uat-dataset/uat_phi.py purge --mysql "$MYSQL" --psql "$PSQL" --target uvl-uat
    scripts/uat-dataset/uat_phi.py purge ... --target uvl-uat --apply --i-confirm-target=uvl-uat

README.md in this folder gives the whole procedure.

Exit codes: 0 ok (audit: clean) · 1 failed (audit: not clean) · 2 refused, nothing written.
"""
import argparse
import re
import subprocess
import sys
import time

SYNTHETIC_PATTERN = r"^(SYNTH-|(E2E|QA|TEST|DEMO)([^A-Z]|$))"
PURGED_PREFIX = "PURGED-"
UUID_PATTERN = "^[0-9a-fA-F-]{36}$"
# Staff accounts: the purge never deletes them, and refuses if it would.
STOP_TABLES = ("users", "provider")
# Ledger rows: kept, with their links to the purged rows cleared.
DETACH_TABLES = ("stockmgmt_stock_item_transaction", "stockmgmt_reservation_transaction")
# References that the schema does not declare as foreign keys: (table, column, parent, parent column).
EXTRA_EDGES = (("uvl_insurance_card_history", "person_id", "person", "person_id"),)
# Free-text columns cleared on Odoo records linked to a pseudonymised partner.
ODOO_FREE_TEXT = ("note", "narration", "comment", "client_order_ref", "signed_by",
                  "openupgrade_legacy_15_0_note")
# Partner columns cleared on top of every x_* text or date column.
ODOO_PARTNER_CLEAR = ("ref", "email", "email_normalized", "phone", "phone_sanitized", "mobile",
                      "street", "street2", "city", "zip", "comment", "function", "vat",
                      "website", "additional_info", "company_registry", "company_name")
CHUNK = 1000
MARK = "#uat_phi"


class Refused(Exception):
    """Raised before anything is written; exit code 2."""


def is_synthetic_name(name):
    return bool(name) and re.match(SYNTHETIC_PATTERN, name.upper()) is not None


def sql_str(value):
    return "'" + str(value).replace("\\", "\\\\").replace("'", "''") + "'"


def sql_value(value):
    return value if re.match(r"^-?\d+$", value) else sql_str(value)


def chunks(values, size=CHUNK):
    values = sorted(values, key=lambda v: (len(v), v))
    for i in range(0, len(values), size):
        yield values[i:i + size]


# ---------------------------------------------------------------------------
# Talking to the databases
# ---------------------------------------------------------------------------

class Shell:
    """Runs one SQL script through a shell command and returns its tab-separated rows."""

    def __init__(self, command, name, runner=None):
        self.command, self.name = command, name
        self.runner = runner or self._run

    @staticmethod
    def _run(command, sql):
        proc = subprocess.run(command, shell=True, input=sql, capture_output=True, text=True)
        return proc.returncode, proc.stdout, proc.stderr

    def script(self, sql):
        code, out, err = self.runner(self.command, sql)
        if code != 0:
            tail = [l for l in err.splitlines() if l.strip()][-3:]
            raise RuntimeError("%s failed (exit %s): %s" % (self.name, code, " | ".join(tail)))
        return [line.split("\t") for line in out.splitlines() if line != ""]

    def queries(self, statements):
        """Each statement's rows, in order. One round trip for the lot."""
        sql = "".join("SELECT '%s', %d;\n%s;\n" % (MARK, i, s.rstrip().rstrip(";"))
                      for i, s in enumerate(statements))
        results, current = [[] for _ in statements], None
        for row in self.script(self.prelude() + sql):
            if row[0] == MARK:
                current = int(row[1])
            elif current is None:
                raise RuntimeError("%s printed output before the first query: is it running with "
                                   "the options this script documents?" % self.name)
            else:
                results[current].append(row)
        return results

    def prelude(self):
        return ""


class MySQL(Shell):
    def __init__(self, command, runner=None):
        Shell.__init__(self, command, "mysql", runner)


class Psql(Shell):
    def __init__(self, command, database, runner=None):
        Shell.__init__(self, command, "psql (%s)" % database, runner)
        self.database = database

    def prelude(self):
        return ("\\set QUIET on\n\\set ON_ERROR_STOP on\n\\pset format unaligned\n"
                "\\pset tuples_only on\n\\pset fieldsep '\\t'\n\\pset null NULL\n\\c %s\n" % self.database)


# ---------------------------------------------------------------------------
# OpenMRS: classification
# ---------------------------------------------------------------------------

def mysql_synthetic(column):
    return "UPPER(COALESCE(%s, '')) REGEXP '%s'" % (column, SYNTHETIC_PATTERN)


SYNTHETIC_PATIENT = (
    "EXISTS (SELECT 1 FROM person_name n WHERE n.person_id = p.patient_id) AND NOT EXISTS ("
    "SELECT 1 FROM person_name n WHERE n.person_id = p.patient_id AND NOT (%s OR %s))"
    % (mysql_synthetic("n.family_name"), mysql_synthetic("n.given_name")))


def openmrs_counts(db, recent_days):
    real = "NOT (%s)" % SYNTHETIC_PATIENT
    rows = db.queries([
        "SELECT COUNT(*) FROM patient p WHERE %s" % SYNTHETIC_PATIENT,
        "SELECT COUNT(*), COALESCE(SUM(p.voided), 0), COALESCE(SUM(p.date_created > NOW() - INTERVAL %d DAY), 0)"
        " FROM patient p WHERE %s" % (recent_days, real),
        "SELECT COUNT(*) FROM person x WHERE x.person_id NOT IN (SELECT patient_id FROM patient)"
        " AND x.person_id NOT IN (SELECT person_id FROM users)"
        " AND x.person_id NOT IN (SELECT person_id FROM provider WHERE person_id IS NOT NULL)"
        " AND NOT EXISTS (SELECT 1 FROM person_name n WHERE n.person_id = x.person_id AND (%s OR %s))"
        % (mysql_synthetic("n.family_name"), mysql_synthetic("n.given_name")),
    ])
    real_total, real_voided, real_recent = (int(v) for v in rows[1][0])
    return {"synthetic": int(rows[0][0][0]), "real": real_total, "real_voided": real_voided,
            "real_recent": real_recent, "other_persons": int(rows[2][0][0])}


def synthetic_patient_uuids(db):
    return [r[0] for r in db.queries(["SELECT p2.uuid FROM patient p JOIN person p2 ON p2.person_id = p.patient_id"
                                      " WHERE %s" % SYNTHETIC_PATIENT])[0]]


# ---------------------------------------------------------------------------
# OpenMRS: what the purge reaches
# ---------------------------------------------------------------------------

class Schema:
    def __init__(self, edges, primary_keys, columns):
        self.edges = edges                    # [(table, column, parent, parent_column)]
        self.primary_keys = primary_keys      # {table: [column, ...]}
        self.columns = columns                # {table: {column: nullable}}

    @classmethod
    def read(cls, db):
        fk, pk, cols = db.queries([
            "SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME"
            " FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE()"
            " AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY 1, 2",
            "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE"
            " WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'PRIMARY' ORDER BY TABLE_NAME, ORDINAL_POSITION",
            "SELECT c.TABLE_NAME, c.COLUMN_NAME, c.IS_NULLABLE FROM information_schema.COLUMNS c"
            " JOIN information_schema.TABLES t ON t.TABLE_SCHEMA = c.TABLE_SCHEMA AND t.TABLE_NAME = c.TABLE_NAME"
            " WHERE c.TABLE_SCHEMA = DATABASE() AND t.TABLE_TYPE = 'BASE TABLE'",
        ])
        primary_keys, columns = {}, {}
        for table, column in pk:
            primary_keys.setdefault(table, []).append(column)
        for table, column, nullable in cols:
            columns.setdefault(table, {})[column] = nullable == "YES"
        edges = [tuple(r) for r in fk]
        edges += [e for e in EXTRA_EDGES if e[1] in columns.get(e[0], {}) and e not in edges]
        return cls(edges, primary_keys, columns)

    def children(self, parent):
        return [(t, c, pc) for t, c, p, pc in self.edges if p == parent]

    def reachable(self):
        """Tables a purge can delete from, whatever the data."""
        seen, todo = {"person"}, ["person"]
        while todo:
            for table, _, _ in self.children(todo.pop()):
                if table not in seen and table not in STOP_TABLES and table not in DETACH_TABLES:
                    seen.add(table)
                    todo.append(table)
        return seen

    def referenced_columns(self, table):
        return sorted({pc for t, c, p, pc in self.edges if p == table and t not in STOP_TABLES})


class Closure:
    """Every row reachable from the root persons through foreign keys, as primary-key tuples."""

    def __init__(self):
        self.rows = {}      # table -> set of primary-key tuples
        self.detach = {}    # (table, column) -> rows whose link to a purged row gets cleared
        self.keyless = {}   # (table, column) -> [rows, parent values]: leaf tables without a primary key
        self.stop = {}      # table -> rows the purge would reach (must stay 0)

    def detach_values(self, schema):
        """(table, column) -> the purged parent keys that link points at."""
        out = {}
        for (table, column) in self.detach:
            for t, c, parent, pc in schema.edges:
                if (t, c) == (table, column) and parent in self.rows:
                    if schema.primary_keys.get(parent) != [pc]:
                        raise Refused("%s.%s points at %s.%s, which is not its primary key"
                                      % (table, column, parent, pc))
                    out.setdefault((table, column), set()).update(k[0] for k in self.rows[parent])
        return out


def build_closure(schema, roots, fetch):
    """fetch(requests) answers [(table, columns, where_column, values)] with rows per request."""
    closure = Closure()
    closure.rows["person"] = {(r,) for r in roots}
    pending = {("person", "person_id"): set(roots)}
    while pending:
        requests, origin = [], []
        for (parent, parent_column), values in sorted(pending.items()):
            for table, column, pc in schema.children(parent):
                if pc != parent_column:
                    continue
                if table in STOP_TABLES or table in DETACH_TABLES:
                    origin.append(("count", table, column))
                    requests.append((table, ["COUNT(*)"], column, values))
                    continue
                pk = schema.primary_keys.get(table)
                if not pk:
                    if schema.children(table):
                        raise Refused("%s.%s reaches purged rows but %s has no primary key and is referenced"
                                      % (table, column, table))
                    entry = closure.keyless.setdefault((table, column), [0, set()])
                    entry[1].update(values)
                    origin.append(("keyless", table, column))
                    requests.append((table, ["COUNT(*)"], column, values))
                    continue
                origin.append(("rows", table, column))
                requests.append((table, pk + schema.referenced_columns(table), column, values))
        pending = {}
        for (kind, table, column), rows in zip(origin, fetch(requests)):
            if kind == "keyless":
                closure.keyless[(table, column)][0] += sum(int(r[0]) for r in rows)
                continue
            if kind == "count":
                n = sum(int(r[0]) for r in rows)
                if table in STOP_TABLES:
                    closure.stop[table] = closure.stop.get(table, 0) + n
                elif n:
                    closure.detach[(table, column)] = closure.detach.get((table, column), 0) + n
                continue
            pk = schema.primary_keys[table]
            refs = schema.referenced_columns(table)
            known = closure.rows.setdefault(table, set())
            for row in rows:
                key = tuple(row[:len(pk)])
                if key in known:
                    continue
                known.add(key)
                for i, rc in enumerate(refs):
                    value = row[len(pk) + i]
                    if value != "NULL":
                        pending.setdefault((table, rc), set()).add(value)
    return closure


def mysql_fetch(db):
    def fetch(requests):
        statements, owner = [], []
        for i, (table, columns, column, values) in enumerate(requests):
            for part in chunks(values):
                statements.append("SELECT %s FROM `%s` WHERE `%s` IN (%s)" % (
                    ", ".join(c if c == "COUNT(*)" else "`%s`" % c for c in columns), table, column,
                    ", ".join(sql_value(v) for v in part)))
                owner.append(i)
        answers = [[] for _ in requests]
        if statements:
            for i, rows in zip(owner, db.queries(statements)):
                answers[i].extend(rows)
        return answers
    return fetch


def delete_order(schema, closure):
    """Tables children-first, plus the nullable links to clear first to break cycles."""
    tables = set(closure.rows)
    deps = {t: set() for t in tables}            # table -> parents that must outlive it
    self_links, cut = [], []
    for t, c, p, pc in schema.edges:
        if t in tables and p in tables:
            if t == p:
                self_links.append((t, c))
            else:
                deps[t].add((p, c))
    order = []
    remaining = set(tables)
    while remaining:
        # A table can go once no remaining table still references it.
        ready = sorted(t for t in remaining
                       if not any(p == t for other in remaining if other != t for p, _ in deps[other]))
        if not ready:
            # A cycle: clear one nullable link inside it and try again.
            candidate = next(((o, p, c) for o in sorted(remaining) for p, c in sorted(deps[o])
                              if p in remaining and schema.columns.get(o, {}).get(c)), None)
            if not candidate:
                raise Refused("tables %s reference each other through NOT NULL columns" % sorted(remaining))
            o, p, c = candidate
            deps[o].discard((p, c))
            cut.append((o, c))
            continue
        order.extend(ready)
        remaining -= set(ready)
    for t, c in self_links + cut:
        if not schema.columns.get(t, {}).get(c, False):
            raise Refused("%s.%s links purged rows together but is NOT NULL" % (t, c))
    return order, sorted(set(self_links + cut))


def purge_sql(schema, closure):
    order, links = delete_order(schema, closure)
    out = ["SET SESSION foreign_key_checks = 1;", "START TRANSACTION;"]
    for (table, column), values in sorted(closure.detach_values(schema).items()):
        if not schema.columns.get(table, {}).get(column, False):
            raise Refused("%s.%s must be cleared but is NOT NULL" % (table, column))
        for part in chunks(values):
            out.append("UPDATE `%s` SET `%s` = NULL WHERE `%s` IN (%s);"
                       % (table, column, column, ", ".join(sql_value(v) for v in part)))
    for (table, column), (_, values) in sorted(closure.keyless.items()):
        out += ["DELETE FROM `%s` WHERE `%s` IN (%s);" % (table, column, ", ".join(sql_value(v) for v in part))
                for part in chunks(values)]
    for table, column in links:
        out += ["UPDATE `%s` SET `%s` = NULL WHERE %s;" % (table, column, where_keys(schema, table, part))
                for part in chunks_of_keys(closure.rows[table])]
    for table in order:
        out += ["DELETE FROM `%s` WHERE %s;" % (table, where_keys(schema, table, part))
                for part in chunks_of_keys(closure.rows[table])]
    out.append("COMMIT;")
    return "\n".join(out) + "\n"


def chunks_of_keys(keys):
    keys = sorted(keys)
    for i in range(0, len(keys), CHUNK):
        yield keys[i:i + CHUNK]


def where_keys(schema, table, keys):
    pk = schema.primary_keys[table]
    if len(pk) == 1:
        return "`%s` IN (%s)" % (pk[0], ", ".join(sql_value(k[0]) for k in keys))
    return "(%s) IN (%s)" % (", ".join("`%s`" % c for c in pk),
                             ", ".join("(%s)" % ", ".join(sql_value(v) for v in k) for k in keys))


def unconstrained_columns(schema):
    """Columns that look like patient references but no foreign key covers: a reviewer reads these."""
    linked = {(t, c) for t, c, _, _ in schema.edges}
    reachable = schema.reachable()
    found = []
    for table, cols in sorted(schema.columns.items()):
        if table in reachable or table.endswith("_type"):
            continue
        for column in sorted(cols):
            if re.search("patient|person|subject|identifier", column) and (table, column) not in linked \
                    and schema.primary_keys.get(table) != [column]:
                found.append("%s.%s" % (table, column))
    return found


# ---------------------------------------------------------------------------
# Odoo
# ---------------------------------------------------------------------------

def odoo_schema(db):
    links, cols, models = db.queries([
        "SELECT kcu.table_name, kcu.column_name FROM information_schema.table_constraints tc"
        " JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = tc.constraint_name"
        " AND kcu.constraint_schema = tc.constraint_schema"
        " JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name"
        " AND ccu.constraint_schema = tc.constraint_schema"
        " WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'"
        " AND ccu.table_name = 'res_partner' AND ccu.column_name = 'id' ORDER BY 1, 2",
        "SELECT table_name, column_name, data_type FROM information_schema.columns"
        " WHERE table_schema = 'public' AND data_type IN ('character varying', 'text', 'date')",
        "SELECT DISTINCT replace(model, '.', '_') FROM ir_model",
    ])
    columns = {}
    for table, column, kind in cols:
        columns.setdefault(table, {})[column] = kind
    model_tables = {m[0] for m in models}
    return [tuple(l) for l in links if l[0] == "res_partner" or l[0] in model_tables], columns


def odoo_keep_cte(keep_uuids):
    values = ", ".join("(%s)" % sql_str(u) for u in keep_uuids) or "(NULL)"
    return ("WITH keep(uuid) AS (VALUES %s), roots AS (SELECT p.id, p.name AS old_name FROM res_partner p"
            " WHERE p.ref ~ '%s' AND p.ref NOT IN (SELECT uuid FROM keep WHERE uuid IS NOT NULL)"
            " AND COALESCE(p.is_company, false) = false AND p.name NOT LIKE '%s%%'"
            " AND p.id NOT IN (SELECT partner_id FROM res_users WHERE partner_id IS NOT NULL)),"
            " target AS (SELECT id, old_name FROM roots UNION SELECT c.id, c.name FROM res_partner c"
            " JOIN roots r ON c.parent_id = r.id) " % (values, UUID_PATTERN, PURGED_PREFIX))


def name_copy_columns(links, columns):
    """(table, partner column, text column) where a copy of the partner's name may sit."""
    out = []
    for table, fk in links:
        if table == "res_partner":
            continue
        for column, kind in sorted(columns.get(table, {}).items()):
            if kind != "date" and column != fk:
                out.append((table, fk, column))
    return out


def odoo_counts(db, keep_uuids):
    rows = db.queries([
        odoo_keep_cte(keep_uuids) + "SELECT (SELECT COUNT(*) FROM roots), (SELECT COUNT(*) FROM target)",
        "SELECT CASE WHEN p.ref = ANY(ARRAY[%s]::text[]) THEN 'synthetic' WHEN p.name LIKE '%s%%' THEN 'purged'"
        " ELSE 'real' END, COUNT(*) FROM res_partner p WHERE (p.ref ~ '%s' OR p.name LIKE '%s%%')"
        " AND COALESCE(p.is_company, false) = false"
        " AND p.id NOT IN (SELECT partner_id FROM res_users WHERE partner_id IS NOT NULL) GROUP BY 1"
        % (", ".join(sql_str(u) for u in keep_uuids) or "NULL", PURGED_PREFIX, UUID_PATTERN, PURGED_PREFIX),
    ])
    by = {k: int(n) for k, n in rows[1]}
    return {"to_pseudonymise": int(rows[0][0][0]), "with_contacts": int(rows[0][0][1]),
            "synthetic": by.get("synthetic", 0), "purged": by.get("purged", 0), "real": by.get("real", 0)}


def linked_records(links):
    """Tables (other than res_partner) whose rows belong to a target partner, with their partner columns."""
    out = {}
    for table, fk in links:
        if table not in ("res_partner", "res_users", "res_company", "mail_followers", "mail_message"):
            out.setdefault(table, []).append(fk)
    return out


def odoo_purge_sql(links, columns, keep_uuids):
    linked = linked_records(links)
    partner_cols = columns.get("res_partner", {})
    clear = [c for c in ODOO_PARTNER_CLEAR if c in partner_cols]
    clear += sorted(c for c in partner_cols if c.startswith("x_") and c not in clear)
    out = ["BEGIN;",
           "CREATE TEMP TABLE uvl_phi_target ON COMMIT DROP AS " + odoo_keep_cte(keep_uuids)
           + "SELECT id, old_name FROM target;"]
    # Records that belong to a target partner, by model, for chatter and attachments.
    out.append("CREATE TEMP TABLE uvl_phi_record (model varchar, res_id integer) ON COMMIT DROP;")
    out.append("INSERT INTO uvl_phi_record SELECT 'res.partner', id FROM uvl_phi_target;")
    for table, fks in sorted(linked.items()):
        out.append("INSERT INTO uvl_phi_record SELECT m.model, x.id FROM %s x"
                   " JOIN ir_model m ON replace(m.model, '.', '_') = '%s'"
                   " WHERE %s;" % (table, table, " OR ".join("x.%s IN (SELECT id FROM uvl_phi_target)" % fk
                                                             for fk in fks)))
    for table, fk, column in name_copy_columns(links, columns):
        out.append("UPDATE %s x SET %s = replace(x.%s, t.old_name, '%s' || t.id) FROM uvl_phi_target t"
                   " WHERE x.%s = t.id AND length(t.old_name) >= 3 AND x.%s LIKE '%%' || t.old_name || '%%';"
                   % (table, column, column, PURGED_PREFIX, fk, column))
    for table, fks in sorted(linked.items()):
        wipe = [c for c in sorted(columns.get(table, {}))
                if c in ODOO_FREE_TEXT or c.startswith("x_")]
        if wipe:
            out.append("UPDATE %s x SET %s WHERE %s;" % (
                table, ", ".join("%s = NULL" % c for c in wipe),
                " OR ".join("x.%s IN (SELECT id FROM uvl_phi_target)" % fk for fk in fks)))
    out.append("DELETE FROM mail_message m USING uvl_phi_record r WHERE m.model = r.model AND m.res_id = r.res_id;")
    out.append("DELETE FROM ir_attachment a USING uvl_phi_record r WHERE a.res_model = r.model AND a.res_id = r.res_id;")
    out.append("DELETE FROM mail_followers f WHERE f.partner_id IN (SELECT id FROM uvl_phi_target)"
               " OR (f.res_model, f.res_id) IN (SELECT model, res_id FROM uvl_phi_record);")
    sets = ["name = '%s' || p.id" % PURGED_PREFIX]
    if "complete_name" in partner_cols:
        sets.append("complete_name = '%s' || p.id" % PURGED_PREFIX)
    sets += ["%s = NULL" % c for c in clear]
    out.append("UPDATE res_partner p SET %s FROM uvl_phi_target t WHERE p.id = t.id;" % ", ".join(sets))
    checks = ["(SELECT COUNT(*) FROM %s x JOIN uvl_phi_target t ON x.%s = t.id WHERE length(t.old_name) >= 3"
              " AND x.%s LIKE '%%' || t.old_name || '%%')" % (table, fk, column)
              for table, fk, column in name_copy_columns(links, columns)]
    checks.append("(SELECT COUNT(*) FROM res_partner p JOIN uvl_phi_target t ON p.id = t.id"
                  " WHERE p.name NOT LIKE '%s%%')" % PURGED_PREFIX)
    out.append("DO $$ BEGIN IF (%s) > 0 THEN RAISE EXCEPTION 'a partner name survived the pseudonymisation;"
               " nothing was changed'; END IF; END $$;" % " + ".join(checks))
    out.append("SELECT COUNT(*) FROM uvl_phi_target;")
    out.append("COMMIT;")
    return "\n".join(out) + "\n"


# ---------------------------------------------------------------------------
# Orthanc
# ---------------------------------------------------------------------------

def orthanc_counts(db):
    rows = db.queries([
        "SELECT CASE WHEN upper(value) ~ '%s' THEN 'synthetic' ELSE 'real' END, COUNT(DISTINCT id)"
        " FROM maindicomtags WHERE taggroup = 16 AND tagelement = 16 GROUP BY 1" % SYNTHETIC_PATTERN])
    by = {k: int(n) for k, n in rows[0]}
    return {"synthetic": by.get("synthetic", 0), "real": by.get("real", 0)}


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_audit(args, mysql, odoo, orthanc):
    om = openmrs_counts(mysql, args.recent_days)
    keep = synthetic_patient_uuids(mysql)
    print("OpenMRS  patients: %d synthetic · %d NOT synthetic (%d of them voided)"
          % (om["synthetic"], om["real"], om["real_voided"]))
    print("         persons that are neither patient, user nor provider, not synthetic: %d" % om["other_persons"])
    dirty = om["real"] + om["other_persons"]
    if odoo:
        oc = odoo_counts(odoo, keep)
        print("Odoo     patient partners: %d synthetic · %d pseudonymised · %d NOT synthetic"
              % (oc["synthetic"], oc["purged"], oc["real"]))
        dirty += oc["real"]
    if orthanc:
        dc = orthanc_counts(orthanc)
        print("Orthanc  DICOM patient names: %d synthetic · %d NOT synthetic" % (dc["synthetic"], dc["real"]))
        dirty += dc["real"]
    if dirty:
        print("NOT CLEAN: %d record(s) are not synthetic. Do not grant volunteer access." % dirty)
        return 1
    print("Clean: every patient record checked is synthetic or pseudonymised.")
    return 0


def check_target(args):
    if re.search("prod", args.target, re.I):
        raise Refused("--target %r names production; this script never runs there" % args.target)
    if args.apply and args.confirm != args.target:
        raise Refused("--apply writes to %s. Repeat it as --i-confirm-target=%s to proceed."
                      % (args.target, args.target))


def cmd_purge(args, mysql, odoo, orthanc):
    check_target(args)
    om = openmrs_counts(mysql, args.recent_days)
    readers = int(mysql.queries(["SELECT COUNT(*) FROM information_schema.PROCESSLIST"
                                 " WHERE COMMAND LIKE 'Binlog Dump%'"])[0][0][0])
    roots = [r[0] for r in mysql.queries(["SELECT p.patient_id FROM patient p WHERE NOT (%s)"
                                          % SYNTHETIC_PATIENT])[0]]
    keep = synthetic_patient_uuids(mysql)
    schema = Schema.read(mysql)
    closure = build_closure(schema, roots, mysql_fetch(mysql))
    print("%s on %s" % ("APPLY" if args.apply else "DRY RUN", args.target))
    print("OpenMRS  %d real patient(s) to remove (%d voided), %d synthetic kept."
          % (om["real"], om["real_voided"], om["synthetic"]))
    for table in sorted(closure.rows, key=lambda t: (-len(closure.rows[t]), t)):
        if closure.rows[table]:
            print("         delete %8d  %s" % (len(closure.rows[table]), table))
    for (table, column), (n, _) in sorted(closure.keyless.items()):
        if n:
            print("         delete %8d  %s (by %s, no primary key)" % (n, table, column))
    print("         (%d more tables reachable, no rows in them)" % sum(1 for t in closure.rows if not closure.rows[t]))
    for (table, column), n in sorted(closure.detach.items()):
        print("         detach %8d  %s.%s (row kept, link cleared)" % (n, table, column))
    for table in STOP_TABLES:
        print("         staff  %8d  %s rows reached (must be 0)" % (closure.stop.get(table, 0), table))
    review = unconstrained_columns(schema)
    if review:
        print("         not covered by a foreign key, review by hand: %s" % ", ".join(review))
    print("         binary-log readers connected: %d · real patients registered in the last %d days: %d"
          % (readers, args.recent_days, om["real_recent"]))
    if om["other_persons"]:
        print("         %d person(s) are neither patient, user nor provider and not synthetic: not purged,"
              " review by hand" % om["other_persons"])
    links = columns = None
    if odoo:
        oc = odoo_counts(odoo, keep)
        links, columns = odoo_schema(odoo)
        print("Odoo     %d patient partner(s) to pseudonymise (%d with their contacts); %d linked tables"
              % (oc["to_pseudonymise"], oc["with_contacts"], len(linked_records(links))))
    if orthanc:
        dc = orthanc_counts(orthanc)
        print("Orthanc  %d DICOM patient name(s) not synthetic%s"
              % (dc["real"], ": delete those studies in Orthanc by hand" if dc["real"] else ""))

    problems = []
    if any(closure.stop.values()):
        problems.append("the purge would reach staff accounts (users/provider)")
    if readers:
        problems.append("%d binary-log reader(s) connected: stop eip-odoo-openmrs and eip-openmrs-orthanc"
                        % readers)
    if om["real_recent"] and not args.allow_recent:
        problems.append("%d real patient(s) were registered in the last %d days, which looks like production;"
                        " pass --allow-recent only for a copy restored that recently"
                        % (om["real_recent"], args.recent_days))
    if not args.apply:
        for p in problems:
            print("WOULD REFUSE: " + p)
        print("Nothing written. Re-run with --apply --i-confirm-target=%s to purge." % args.target)
        return 0
    if problems:
        raise Refused("; ".join(problems))

    if closure.rows.get("person"):
        mysql.script(purge_sql(schema, closure))
        print("OpenMRS  purged %d patient(s)." % len(closure.rows["person"]))
    if odoo:
        done = odoo.script(odoo.prelude() + odoo_purge_sql(links, columns, keep))
        print("Odoo     pseudonymised %s partner(s)." % (done[0][0] if done else "?"))
    rotate_binlog(mysql)
    print("Done. Next: README.md steps 5-7 (bridge offsets, old backups, audit).")
    return 0


def rotate_binlog(mysql, attempts=10, wait=3):
    """Start a new binary log and drop the older ones, which hold the deleted rows.

    MariaDB keeps a file until its transactions are checkpointed, and says so only in a
    warning, so the result is checked and the purge retried for a while."""
    rows = mysql.queries(["SELECT @@log_bin"])[0]
    if not rows or rows[0][0] not in ("1", "ON"):
        return
    mysql.script("FLUSH BINARY LOGS;\n")
    current = mysql.queries(["SHOW MASTER STATUS"])[0][0][0]
    for attempt in range(attempts):
        mysql.script("PURGE BINARY LOGS TO %s;\n" % sql_str(current))
        older = [r[0] for r in mysql.queries(["SHOW BINARY LOGS"])[0] if r[0] != current]
        if not older:
            print("MariaDB  binary logs before %s purged (they held the deleted rows)." % current)
            return
        if attempt + 1 < attempts:
            time.sleep(wait)
    print("WARNING  %d older binary log(s) are still there (not yet checkpointed). Run later, as root in"
          " MariaDB: PURGE BINARY LOGS TO '%s';" % (len(older), current))


def main(argv=None, runner=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[1].strip())
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("audit", "purge"):
        p = sub.add_parser(name)
        p.add_argument("--mysql", required=True, help="shell command running `mysql -B -N openmrs`, SQL on stdin")
        p.add_argument("--psql", help="shell command running psql as a superuser, SQL on stdin")
        p.add_argument("--odoo-db", default="odoo")
        p.add_argument("--orthanc-db", default="orthanc")
        p.add_argument("--no-odoo", action="store_true")
        p.add_argument("--no-orthanc", action="store_true")
        p.add_argument("--recent-days", type=int, default=14)
        if name == "purge":
            p.add_argument("--target", required=True, help="a label for the server, e.g. uvl-uat")
            p.add_argument("--apply", action="store_true", help="write; without it, a dry run")
            p.add_argument("--i-confirm-target", dest="confirm")
            p.add_argument("--allow-recent", action="store_true")
    args = ap.parse_args(argv)
    try:
        mysql = MySQL(args.mysql, runner)
        if mysql.queries(["SELECT 'uat_phi'"])[0] != [["uat_phi"]]:
            raise Refused("--mysql must run mysql with -B -N (batch, no column names)")
        odoo = Psql(args.psql, args.odoo_db, runner) if args.psql and not args.no_odoo else None
        orthanc = Psql(args.psql, args.orthanc_db, runner) if args.psql and not args.no_orthanc else None
        if not args.psql and not (args.no_odoo and args.no_orthanc):
            raise Refused("--psql is required unless both --no-odoo and --no-orthanc are given")
        return (cmd_audit if args.cmd == "audit" else cmd_purge)(args, mysql, odoo, orthanc)
    except Refused as e:
        print("REFUSED: %s" % e, file=sys.stderr)
        return 2
    except (RuntimeError, OSError) as e:
        print("FAILED: %s" % e, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
