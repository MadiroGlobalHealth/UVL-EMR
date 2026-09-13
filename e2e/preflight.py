#!/usr/bin/env python3
"""
Pre-flight checks P1-P5 for the UVL EMR patient-journey suite.

Runs on the Docker host of a deployed stack, straight after a deploy on UAT, and
before the Claude-driven journeys. Everything here is read-only and static: no
browser, no writes, a few seconds.

Each check exists because something it catches actually broke Mugamba production
on 2026-09-13 -- see e2e/FLOW.md.

    P1  every form concept resolves and is not retired
    P2  every question's rendering matches its concept datatype
    P3  every clinical role holds the privileges its journey needs
    P4  the Keycloak `openmrs` client still has every expected role
    P5  every concept referenced by the frontend config resolves

Exit status: 0 all good (known gaps tolerated), 1 a check failed, 2 could not run.

    ./preflight.py                          # defaults to project ozone-msf-mugamba
    ./preflight.py --project ozone-msf-x    # another stack on the same host
    ./preflight.py --strict                 # known gaps fail too
    ./preflight.py --only P1,P4
"""

import argparse
import base64
import json
import subprocess
import sys
from collections import defaultdict

# --------------------------------------------------------------------------
# What each role must be able to do. Privileges are resolved through role_role
# inheritance before comparing, so list only what the journey genuinely needs.
# --------------------------------------------------------------------------
REQUIRED_PRIVILEGES = {
    "Nurse": [
        "Add Encounters", "Add Visits", "Edit Observations", "Get Observations",
        "Get Encounters", "Get Visits", "Get Concepts", "Get Concept Attribute Types",
        "Get Concept Datatypes", "Get Locations",
    ],
    "Doctor": [
        "Add Encounters", "Add Visits", "Edit Observations", "Get Observations",
        "Get Encounters", "Get Visits", "Get Concepts", "Get Concept Attribute Types",
        "Get Diagnoses", "Edit Diagnoses", "Add Orders", "Edit Orders",
    ],
    "Lab Technician": ["Get Encounters", "Get Observations", "Get Concepts"],
}

# Gaps that are real, known, and tracked. Reported loudly but do not fail the
# build unless --strict. Remove an entry the moment it is fixed, so that fixing
# it is what turns the check green.
KNOWN_GAPS = [
    ("Nurse", "Add Orders",
     "a nurse cannot create an order; consultation journeys that order will stop here"),
    ("Nurse", "Get Forms",
     "held only by Doctor and the Privilege Level roles; unverified whether the O3 form "
     "engine needs it to load a schema, so confirm during journey A before promoting it"),
    ("Doctor", "App: stockmanagement.stockItems",
     "held by no clinical role at all; GenerateBillFromOrderAdvice demands it on order creation"),
]

# Keycloak client roles that must exist on the `openmrs` client. A missing one
# means users sign in carrying no OpenMRS roles -- OpenMRS itself never notices.
EXPECTED_KC_ROLES = {
    "Anonymous", "Doctor", "Help Nurse", "Inpatient Consultant", "Lab Technician",
    "Nurse", "Outpatient Consultant", "Print Patient Label Sticker",
    "Register patients", "System Developer",
}

# O3 form-engine rendering -> acceptable concept datatypes.
RENDERING_DATATYPES = {
    "radio": {"Coded"}, "select": {"Coded"}, "checkbox": {"Coded"},
    "multiCheckbox": {"Coded"}, "content-switcher": {"Coded"},
    "select-concept-answers": {"Coded"},
    # ui-select-extended is backed by an external datasource (locations, providers),
    # so its concept stores the selection as text as often as it is coded.
    "ui-select-extended": {"Coded", "Text"},
    "toggle": {"Coded", "Boolean"},
    "text": {"Text"}, "textarea": {"Text"},
    "number": {"Numeric"}, "numeric": {"Numeric"},
    "date": {"Date", "Datetime"}, "datetime": {"Date", "Datetime"},
    "file": {"Complex"},
}

GREEN, RED, YELLOW, DIM, RESET = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"


class CheckError(Exception):
    """The check could not be run at all, as opposed to finding a problem."""


# --------------------------------------------------------------------------
# plumbing
# --------------------------------------------------------------------------

def run(cmd, stdin=None):
    p = subprocess.run(cmd, input=stdin, capture_output=True, text=True)
    if p.returncode != 0:
        raise CheckError(f"{' '.join(cmd[:4])}... exited {p.returncode}: {p.stderr.strip()[:300]}")
    return p.stdout


def mysql(project, sql):
    """Rows from the OpenMRS database as lists of strings, tab-separated, NULL as ''."""
    out = run(
        ["docker", "exec", "-i", f"{project}-mysql-1", "sh", "-c",
         'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" openmrs -N -B --default-character-set=utf8mb4'],
        stdin=sql,
    )
    rows = []
    for line in out.split("\n"):
        if not line:
            continue
        rows.append(["" if c == "NULL" else c for c in line.split("\t")])
    return rows


def psql(project, db, sql):
    out = run(
        ["docker", "exec", "-i", f"{project}-postgresql-1",
         "psql", "-U", "postgres", "-d", db, "-t", "-A", "-F", "\t"],
        stdin=sql,
    )
    return [line.split("\t") for line in out.split("\n") if line.strip()]


def concept_index(project):
    """uuid -> {datatype, retired, is_set}, plus the set of resolvable SOURCE:CODE mappings."""
    by_uuid = {}
    for uuid, datatype, retired, is_set in mysql(project, """
        SELECT c.uuid, cd.name, c.retired, c.is_set
          FROM concept c JOIN concept_datatype cd ON cd.concept_datatype_id = c.datatype_id;
    """):
        by_uuid[uuid] = {"datatype": datatype, "retired": retired == "1", "is_set": is_set == "1"}

    mappings = {}
    for source, code, uuid in mysql(project, """
        SELECT crs.name, crt.code, c.uuid
          FROM concept_reference_term crt
          JOIN concept_reference_source crs ON crs.concept_source_id = crt.concept_source_id
          JOIN concept_reference_map crm ON crm.concept_reference_term_id = crt.concept_reference_term_id
          JOIN concept c ON c.concept_id = crm.concept_id;
    """):
        mappings[f"{source}:{code}"] = uuid
    return by_uuid, mappings


def deployed_forms(project):
    """[(form name, parsed schema)] for every published, non-retired form."""
    # TO_BASE64 wraps every 76 characters, and mysql -B escapes those newlines as
    # a literal backslash-n; strip both so the row survives as a single field.
    forms = []
    for name, b64 in mysql(project, r"""
        SELECT f.name, REPLACE(TO_BASE64(c.value), '\n', '')
          FROM form f
          JOIN form_resource fr ON fr.form_id = f.form_id AND fr.name = 'JSON schema'
          JOIN clob_datatype_storage c ON c.uuid = fr.value_reference
         WHERE f.retired = 0;
    """):
        b64 = b64.replace("\\n", "").replace("\n", "").strip()
        raw = base64.b64decode(b64).decode("utf-8")
        try:
            forms.append((name, json.loads(raw)))
        except json.JSONDecodeError as e:
            raise CheckError(f"form {name!r} has an unparseable JSON schema: {e}")
    return forms


def iter_questions(schema):
    """Yield every node carrying questionOptions.concept, depth-first."""
    def walk(node):
        if isinstance(node, dict):
            qo = node.get("questionOptions")
            if isinstance(qo, dict) and qo.get("concept"):
                yield node, qo
            for v in node.values():
                yield from walk(v)
        elif isinstance(node, list):
            for v in node:
                yield from walk(v)
    yield from walk(schema)


def resolve(ref, by_uuid, mappings):
    """A concept reference is either a plain uuid or a SOURCE:CODE mapping."""
    if ref in by_uuid:
        return by_uuid[ref]
    if ":" in ref and ref in mappings:
        return by_uuid.get(mappings[ref])
    return None


# --------------------------------------------------------------------------
# checks
# --------------------------------------------------------------------------

def p1_form_concepts_resolve(project, ctx):
    by_uuid, mappings = ctx["concepts"]
    problems, checked = [], 0
    for form_name, schema in ctx["forms"]:
        for node, qo in iter_questions(schema):
            refs = [("question", node.get("label") or node.get("id"), qo["concept"])]
            refs += [("answer", a.get("label"), a["concept"])
                     for a in (qo.get("answers") or []) if a.get("concept")]
            for kind, label, ref in refs:
                checked += 1
                c = resolve(ref, by_uuid, mappings)
                if c is None:
                    problems.append(f"{form_name}: {kind} {label!r} -> {ref} DOES NOT EXIST")
                elif c["retired"]:
                    problems.append(f"{form_name}: {kind} {label!r} -> {ref} is RETIRED")
    return problems, f"{checked} concept references across {len(ctx['forms'])} forms"


def p2_rendering_matches_datatype(project, ctx):
    by_uuid, mappings = ctx["concepts"]
    problems, checked = [], 0
    for form_name, schema in ctx["forms"]:
        for node, qo in iter_questions(schema):
            c = resolve(qo["concept"], by_uuid, mappings)
            if c is None:
                continue  # already reported by P1
            rendering = qo.get("rendering")
            label = node.get("label") or node.get("id")
            checked += 1
            if rendering == "group":
                if not c["is_set"]:
                    problems.append(
                        f"{form_name}: {label!r} renders as a group but its concept is not a set")
                continue
            allowed = RENDERING_DATATYPES.get(rendering)
            if allowed and c["datatype"] not in allowed:
                problems.append(
                    f"{form_name}: {label!r} renders as {rendering} "
                    f"(needs {'/'.join(sorted(allowed))}) but its concept is {c['datatype']}")
    return problems, f"{checked} questions"


def effective_privileges(role, role_privs, inherits):
    """Privileges of a role including everything it inherits, transitively.

    OpenMRS grants `Authenticated` to every signed-in user on top of their own
    roles, so it belongs in the closure. Leaving it out makes the check report
    privileges as missing that every user in fact holds -- `Get Concept
    Datatypes` and `Get Locations` both sit on `Authenticated` at Mugamba.
    """
    seen, stack, privs = set(), [role, "Authenticated"], set()
    while stack:
        r = stack.pop()
        if r in seen:
            continue
        seen.add(r)
        privs |= role_privs.get(r, set())
        stack.extend(inherits.get(r, ()))
    return privs


def p3_role_privileges(project, ctx):
    role_privs = defaultdict(set)
    for role, priv in mysql(project, "SELECT role, privilege FROM role_privilege;"):
        role_privs[role].add(priv)

    # role_role(parent_role, child_role): the CHILD inherits the PARENT.
    inherits = defaultdict(set)
    for parent, child in mysql(project, "SELECT parent_role, child_role FROM role_role;"):
        inherits[child].add(parent)

    existing = {r[0] for r in mysql(project, "SELECT role FROM role;")}
    known = {(r, p) for r, p, _ in KNOWN_GAPS}

    problems, gaps, checked = [], [], 0
    for role, required in REQUIRED_PRIVILEGES.items():
        if role not in existing:
            problems.append(f"role {role!r} does not exist in OpenMRS")
            continue
        held = effective_privileges(role, role_privs, inherits)
        for priv in required:
            checked += 1
            if priv not in held:
                (gaps if (role, priv) in known else problems).append(
                    f"{role} is missing {priv!r}")
    for role, priv, note in KNOWN_GAPS:
        if role in existing and priv not in effective_privileges(role, role_privs, inherits):
            if f"{role} is missing {priv!r}" not in gaps:
                gaps.append(f"{role} is missing {priv!r}")
    ctx["known_gap_notes"] = {f"{r} is missing {p!r}": n for r, p, n in KNOWN_GAPS}
    return problems, f"{checked} role/privilege pairs", gaps


def p4_keycloak_roles(project, ctx):
    rows = psql(project, "keycloak", """
        SELECT r.name FROM keycloak.keycloak_role r
          JOIN keycloak.client c ON c.id = r.client
         WHERE r.client_role = true AND c.client_id = 'openmrs';
    """)
    present = {r[0].strip() for r in rows}
    problems = [f"Keycloak client 'openmrs' has no role {r!r} "
                f"-- users holding it will sign in with NO OpenMRS roles"
                for r in sorted(EXPECTED_KC_ROLES - present)]

    unmapped = psql(project, "keycloak", """
        SELECT u.username FROM keycloak.user_entity u
         WHERE u.enabled = true AND NOT EXISTS (
           SELECT 1 FROM keycloak.user_role_mapping m
             JOIN keycloak.keycloak_role r ON r.id = m.role_id
             JOIN keycloak.client c ON c.id = r.client
            WHERE m.user_id = u.id AND c.client_id = 'openmrs')
         ORDER BY u.username;
    """)
    # Service accounts reach OpenMRS through client_credentials and carry their
    # roles on the service-account user, not through an `openmrs` client role.
    gaps = [f"enabled Keycloak user {u[0].strip()!r} has no 'openmrs' client role"
            for u in unmapped if not u[0].strip().startswith("service-account-")]
    extra = present - EXPECTED_KC_ROLES
    note = f"{len(present)} client roles"
    if extra:
        note += f" ({len(extra)} beyond the expected set: {', '.join(sorted(extra))})"
    return problems, note, gaps


def p5_frontend_config_concepts(project, ctx):
    by_uuid, mappings = ctx["concepts"]
    listing = run(["docker", "exec", f"{project}-frontend-1", "sh", "-c",
                   "ls /usr/share/nginx/html/configs/*.json 2>/dev/null || true"])
    paths = [p for p in listing.split("\n") if p.strip()]
    if not paths:
        raise CheckError("no frontend config JSON found in the frontend container")

    problems, checked = [], 0
    for path in paths:
        body = run(["docker", "exec", f"{project}-frontend-1", "cat", path])
        try:
            cfg = json.loads(body)
        except json.JSONDecodeError as e:
            problems.append(f"{path.split('/')[-1]}: not valid JSON ({e})")
            continue

        def walk(node, trail):
            nonlocal checked
            if isinstance(node, dict):
                for k, v in node.items():
                    walk(v, trail + [str(k)])
            elif isinstance(node, list):
                for i, v in enumerate(node):
                    walk(v, trail + [f"[{i}]"])
            elif isinstance(node, str):
                dotted = ".".join(trail)
                if "concept" not in dotted.lower():
                    return
                if not (len(node) == 36 and node.count("-") == 4):
                    return
                checked += 1
                if resolve(node, by_uuid, mappings) is None:
                    problems.append(f"{path.split('/')[-1]}: {dotted} -> {node} DOES NOT EXIST")
        walk(cfg, [])
    return problems, f"{checked} concept references in {len(paths)} config files"


CHECKS = [
    ("P1", "form concepts resolve", p1_form_concepts_resolve),
    ("P2", "rendering matches concept datatype", p2_rendering_matches_datatype),
    ("P3", "roles hold the privileges their journey needs", p3_role_privileges),
    ("P4", "Keycloak 'openmrs' client roles intact", p4_keycloak_roles),
    ("P5", "frontend config concepts resolve", p5_frontend_config_concepts),
]


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", default="ozone-msf-mugamba",
                    help="docker compose project name (default: ozone-msf-mugamba)")
    ap.add_argument("--only", help="comma-separated check ids, e.g. P1,P4")
    ap.add_argument("--strict", action="store_true",
                    help="treat known gaps as failures")
    ap.add_argument("--no-colour", action="store_true")
    args = ap.parse_args()

    if args.no_colour or not sys.stdout.isatty():
        globals().update(GREEN="", RED="", YELLOW="", DIM="", RESET="")

    wanted = {c.strip().upper() for c in args.only.split(",")} if args.only else None
    selected = [c for c in CHECKS if wanted is None or c[0] in wanted]
    if not selected:
        print(f"no checks matched --only {args.only}", file=sys.stderr)
        return 2

    print(f"pre-flight checks against project {args.project}\n")

    ctx = {}
    try:
        needs_data = any(cid in {"P1", "P2", "P5"} for cid, _, _ in selected)
        ctx["concepts"] = concept_index(args.project)
        if needs_data:
            ctx["forms"] = deployed_forms(args.project)
    except CheckError as e:
        print(f"{RED}cannot run:{RESET} {e}", file=sys.stderr)
        return 2

    failed, gap_total = 0, 0
    for cid, title, fn in selected:
        try:
            result = fn(args.project, ctx)
        except CheckError as e:
            print(f"{RED}ERROR{RESET} {cid}  {title}\n        {e}")
            failed += 1
            continue
        problems, note, gaps = (result + ([],))[:3] if len(result) == 2 else result

        if problems:
            failed += 1
            print(f"{RED}FAIL {RESET} {cid}  {title}  {DIM}({note}){RESET}")
            for p in problems:
                print(f"        {RED}x{RESET} {p}")
        else:
            print(f"{GREEN}pass {RESET} {cid}  {title}  {DIM}({note}){RESET}")
        for g in gaps:
            gap_total += 1
            note_txt = ctx.get("known_gap_notes", {}).get(g)
            print(f"        {YELLOW}known{RESET} {g}" + (f" {DIM}-- {note_txt}{RESET}" if note_txt else ""))

    print()
    if failed:
        print(f"{RED}{failed} check(s) failed{RESET} -- do not run the journeys, and do not "
              f"let this deploy reach production")
        return 1
    if gap_total and args.strict:
        print(f"{RED}{gap_total} known gap(s), --strict{RESET}")
        return 1
    if gap_total:
        print(f"{GREEN}all checks passed{RESET}, {YELLOW}{gap_total} known gap(s) "
              f"still open{RESET} -- see e2e/FLOW.md")
        return 0
    print(f"{GREEN}all checks passed{RESET}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
