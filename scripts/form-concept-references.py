#!/usr/bin/env python3
"""
Every concept the site's forms, its frontend config and the frontend apps' built-in defaults refer
to, and the SQL to check them against a database (#841).

OpenMRS refuses a whole encounter when one obs names a concept it cannot resolve, and the form
engine does not know before the save: the form loads, the user fills it in, and the save fails with
a conversion error (HTTP 400, about 15 KB, a stack trace). The forms are the only place the site
names these concepts, so this reads them and says which concept each reference is.

Reads, never writes, and never connects to a database: it prints the SQL and the person who runs it
chooses the server (a read-only user is enough, the queries only SELECT).

  list      one line per distinct reference (forms and frontend config): kind, reference, where
  defaults  the apps' built-in defaults in effect (third source, below), as a table
  sql       the SELECT statements: the references with no concept behind them (that is the answer
         to the question "which concept does a save fail on"), then the ones that resolve to a
         retired concept, which still saves but is hidden from the concept search; then the
         apps' defaults in effect that resolve to nothing, with the app and the key path in the row

A reference is one of:
  uuid     a concept UUID (a padded legacy CIEL one, "1115AAAA...", is a UUID as far as OpenMRS goes)
  mapping  SOURCE:code, resolved through concept_reference_map (CIEL:169402)

Forms: every `concept` value of the form JSON (questions, answers, obs groups).
Frontend config: every UUID or mapping under a key that names a concept (conceptUuid,
systolicBloodPressureUuid, motherConcepts, answerConceptSetUuid ...). Keys that name other
metadata (encounter, order and visit types, person attribute types, provider roles, forms) are
not concepts and are left out.

Third source, the apps' built-in defaults (#841). A frontend app carries defaults in its config
schema (`{_type: Type.ConceptUuid, _default: "5085AAAA..."}`), and uses one whenever the site config
does not set that key. The order basket, the vitals, the visit note and the ward apps save a bare
`POST /encounter` that names such concepts, so an unresolved default fails the save like an
unresolved form concept does, and no form or site config shows it. This reads the apps listed in
distro/configs/openmrs/frontend_assembly/spa-assemble-config.json (frontendModules minus
frontendModuleExcludes), takes every uuid (36 characters, or a legacy `NNNNAAAA...` id) found in a
`_default` with the config key path it belongs to, drops the keys the site (or the distro) config
sets, and classifies what is left by the key name and schema type (concept, encounter type, visit
type, order type, location, attribute type, program, form ...; "unknown" is checked against every
table). The `defaults` table marks the keys an app writes on save.
Where the bundles come from: the apps patched in this repository (`file:` entries) are read from
distro/frontend/<app>/dist, version from its package.json. The other apps are not in the repository:
  --bundles DIR   read them from DIR/<package name with "/" as "__">/ (the package's dist/ inside,
                  e.g. extracted from the npm tarball or copied from a served frontend image)
  --fetch         first download the missing ones into DIR (a temporary folder when no --bundles)
                  with `npm pack <name>@<pinned version> --ignore-scripts` run outside the
                  repository; this is the only use of the network and nothing is installed or run
Without either option no network is used and those apps are listed as not scanned.
The schemas are read with a small parser of the JavaScript object literals of the built code
(not a regex on text) so the key path is exact; a `_default` it could not read is counted and
reported, never skipped silently.

Usage:
  python3 scripts/form-concept-references.py list
  python3 scripts/form-concept-references.py defaults [--fetch --bundles DIR] [--all]
  python3 scripts/form-concept-references.py sql > /tmp/concept-check.sql
  # then, read-only, against the database to check:
  mysql -N openmrs < /tmp/concept-check.sql
"""
import argparse
import glob
import json
import os
import re
import subprocess
import sys
import tarfile
import tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SITE_CONFIG = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'openmrs')
FORMS_GLOB = os.path.join(SITE_CONFIG, 'initializer_config', 'ampathforms', '*.json')
FRONTEND_GLOB = os.path.join(SITE_CONFIG, 'frontend_config', '*.json')
# The distro's own frontend config is merged under the site's: both override an app default
DISTRO_FRONTEND_GLOB = os.path.join(ROOT, 'distro', 'configs', 'openmrs', 'frontend_config', '*.json')
ASSEMBLE_CONFIG = os.path.join(ROOT, 'distro', 'configs', 'openmrs', 'frontend_assembly', 'spa-assemble-config.json')
FRONTEND_MODULES = os.path.join(ROOT, 'distro', 'frontend')

UUID = re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
# Legacy CIEL concepts keep their numeric id padded with A to 36 characters
LEGACY_UUID = re.compile(r'^[0-9]+A+$')
MAPPING = re.compile(r'^([A-Za-z][A-Za-z0-9_.-]*):([A-Za-z0-9_.-]+)$')
# Frontend config keys whose value is another kind of metadata, not a concept
NOT_A_CONCEPT_KEY = re.compile(
    r'encounterType|orderType|visitType|attributeType|providerRole|FormUuid|sessionLocation|billableService|^uuid$',
    re.I,
)


def classify(value):
    """('uuid'|'mapping', normalised reference), or None when the string is not a reference."""
    if not isinstance(value, str):
        return None
    if UUID.match(value) or (len(value) == 36 and LEGACY_UUID.match(value)):
        return 'uuid', value
    m = MAPPING.match(value)
    if m:
        return 'mapping', value
    return None


def form_references(data):
    """Every `concept` string of a form."""
    found = []

    def walk(node):
        if isinstance(node, dict):
            for key, value in node.items():
                if key == 'concept':
                    ref = classify(value)
                    if ref:
                        found.append(ref)
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(data)
    return found


def config_references(data):
    """Every reference under a frontend config key that is not metadata of another kind. The key is
    the nearest dictionary key above the value, so a list of concepts is read under its list's name."""
    found = []

    def walk(node, key):
        if isinstance(node, dict):
            for k, value in node.items():
                walk(value, k)
        elif isinstance(node, list):
            for item in node:
                walk(item, key)
        elif key and not NOT_A_CONCEPT_KEY.search(key):
            ref = classify(node)
            # A bare SOURCE:code needs a concept key too: "en:Hello" or a URL part is not one
            if ref and (ref[0] == 'uuid' or re.search(r'concept', key, re.I)):
                found.append(ref)

    walk(data, None)
    return found


def collect(forms_glob=FORMS_GLOB, frontend_glob=FRONTEND_GLOB):
    """{(kind, reference): sorted list of places}"""
    places = {}
    for path in sorted(glob.glob(forms_glob)):
        with open(path, encoding='utf-8') as f:
            for ref in form_references(json.load(f)):
                places.setdefault(ref, set()).add('form ' + os.path.basename(path))
    for path in sorted(glob.glob(frontend_glob)):
        with open(path, encoding='utf-8') as f:
            for ref in config_references(json.load(f)):
                places.setdefault(ref, set()).add('config ' + os.path.basename(path))
    return {ref: sorted(where) for ref, where in places.items()}


def quote(value):
    return "'" + value.replace('\\', '\\\\').replace("'", "''") + "'"


def sql(references):
    uuids = sorted(r for k, r in references if k == 'uuid')
    mappings = sorted(r for k, r in references if k == 'mapping')
    out = [
        '-- Concept references of the forms and the frontend config (UVL-EMR #841).',
        '-- {} concept UUIDs, {} SOURCE:code mappings. Read-only: SELECT only.'.format(len(uuids), len(mappings)),
        '-- An empty result is the good answer. Run each query on its own.',
        '',
    ]
    if uuids:
        rows = '\n  UNION ALL '.join('SELECT {} AS ref'.format(quote(u)) for u in uuids)
        derived = '(\n  {}\n) r'.format(rows)
        out += [
            '-- 1. UUIDs with no concept: a save naming one fails with a conversion error',
            'SELECT r.ref AS unresolved_uuid',
            'FROM ' + derived,
            'LEFT JOIN concept c ON c.uuid = r.ref',
            'WHERE c.concept_id IS NULL',
            'ORDER BY r.ref;',
            '',
            '-- 2. UUIDs of a retired concept: still saved, hidden from the concept search',
            'SELECT r.ref AS retired_uuid, cn.name AS name',
            'FROM ' + derived,
            'JOIN concept c ON c.uuid = r.ref AND c.retired = 1',
            'LEFT JOIN concept_name cn ON cn.concept_id = c.concept_id AND cn.locale_preferred = 1 AND cn.voided = 0',
            'ORDER BY r.ref;',
            '',
        ]
    if mappings:
        pairs = [m.split(':', 1) for m in mappings]
        rows = '\n  UNION ALL '.join(
            'SELECT {} AS ref, {} AS source, {} AS code'.format(quote(m), quote(s), quote(c))
            for m, (s, c) in zip(mappings, pairs)
        )
        derived = '(\n  {}\n) r'.format(rows)
        resolve = (
            'LEFT JOIN (\n'
            '  SELECT s.name AS source, t.code AS code, c.concept_id AS concept_id, c.retired AS retired\n'
            '  FROM concept_reference_map m\n'
            '  JOIN concept_reference_term t ON t.concept_reference_term_id = m.concept_reference_term_id\n'
            '  JOIN concept_reference_source s ON s.concept_source_id = t.concept_source_id\n'
            '  JOIN concept c ON c.concept_id = m.concept_id\n'
            '  WHERE t.retired = 0 AND s.retired = 0\n'
            ') x ON x.source = r.source AND x.code = r.code'
        )
        out += [
            '-- 3. SOURCE:code mappings that point to no concept',
            'SELECT r.ref AS unresolved_mapping',
            'FROM ' + derived,
            resolve,
            'WHERE x.concept_id IS NULL',
            'ORDER BY r.ref;',
            '',
            '-- 4. SOURCE:code mappings whose only concepts are retired, or that point to several concepts',
            'SELECT r.ref AS suspect_mapping, COUNT(x.concept_id) AS concepts, SUM(x.retired) AS retired',
            'FROM ' + derived,
            resolve,
            'WHERE x.concept_id IS NOT NULL',
            'GROUP BY r.ref',
            'HAVING COUNT(x.concept_id) > 1 OR SUM(x.retired) = COUNT(x.concept_id)',
            'ORDER BY r.ref;',
            '',
        ]
    return '\n'.join(out)

# ---- third source: the apps' built-in defaults -------------------------------------------------


class JsParseError(Exception):
    pass


class Expr(str):
    """A JavaScript expression the reader does not evaluate (a variable, a call, a template)."""


_IDENT = re.compile(r'[A-Za-z_$][\w$]*')
_NUMBER = re.compile(r'-?\d+(\.\d+)?([eE][+-]?\d+)?')
_ESCAPE = re.compile(r'\\(?:u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|(.))', re.S)
_SIMPLE_ESCAPES = {'n': '\n', 't': '\t', 'r': '\r'}


def _skip_string(src, i):
    quote = src[i]
    i += 1
    while i < len(src):
        if src[i] == '\\':
            i += 2
        elif src[i] == quote:
            return i + 1
        else:
            i += 1
    raise JsParseError('unterminated string')


def _read_string(src, i):
    end = _skip_string(src, i)
    body = src[i + 1:end - 1]
    if src[i] == '`' and '${' in body:
        return Expr(src[i:end]), end
    body = _ESCAPE.sub(
        lambda m: chr(int(m.group(1) or m.group(2), 16)) if (m.group(1) or m.group(2))
        else _SIMPLE_ESCAPES.get(m.group(3), m.group(3)),
        body,
    )
    return body, end


def _skip_expression(src, i):
    """Past a JavaScript expression we do not read, up to the `,` or closing bracket that ends it."""
    start, depth = i, 0
    while i < len(src):
        c = src[i]
        if c in '"\'`':
            i = _skip_string(src, i)
            continue
        if c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                break
            depth -= 1
        elif c == ',' and depth == 0:
            break
        i += 1
    else:
        raise JsParseError('unterminated expression')
    if i == start:
        raise JsParseError('empty expression')
    return Expr(src[start:i]), i


def _parse_value(src, i, depth):
    if depth > 60:
        raise JsParseError('too deep')
    c = src[i]
    if c == '{':
        return _parse_object(src, i, depth + 1)
    if c == '[':
        i += 1
        items = []
        while src[i] != ']':
            value, i = _parse_value(src, i, depth + 1)
            items.append(value)
            if src[i] == ',':
                i += 1
            elif src[i] != ']':
                raise JsParseError('array')
        return items, i + 1
    if c in '"\'`':
        value, end = _read_string(src, i)
        if src[end] in ',}]':
            return value, end
        return _skip_expression(src, i)
    for literal, value in (('!0', True), ('!1', False)):
        if src.startswith(literal, i) and src[i + 2] in ',}]':
            return value, i + 2
    m = _NUMBER.match(src, i)
    if m and src[m.end()] in ',}]':
        text = m.group(0)
        return (float(text) if re.search(r'[.eE]', text) else int(text)), m.end()
    return _skip_expression(src, i)


def _parse_object(src, i, depth=0):
    """The object literal starting at src[i] == '{': (dict, index after it). Raises JsParseError
    on anything that is not one (a block of statements, a method, a computed key)."""
    i += 1
    out = {}
    while src[i] != '}':
        if src.startswith('...', i):
            _, i = _skip_expression(src, i + 3)
        else:
            if src[i] in '"\'':
                key, i = _read_string(src, i)
            else:
                m = _IDENT.match(src, i) or _NUMBER.match(src, i)
                if not m:
                    raise JsParseError('key')
                key, i = m.group(0), m.end()
            if src[i] == ':':
                out[key], i = _parse_value(src, i + 1, depth)
            elif src[i] in ',}':
                out[key] = Expr(key)
            else:
                raise JsParseError('property')
        if src[i] == ',':
            i += 1
        elif src[i] != '}':
            raise JsParseError('object')
    return out, i + 1


def schema_objects(src):
    """The object literals of a built bundle that hold config schema leaves (a `_default` or a
    `_type` key at any depth). An object that parses and holds none is stepped over whole."""
    found, i = [], 0
    while True:
        i = src.find('{', i)
        if i < 0:
            return found
        try:
            tree, end = _parse_object(src, i)
        except (JsParseError, IndexError, RecursionError):
            i += 1
            continue
        if '_default' in src[i:end] or '_type' in src[i:end]:
            found.append(tree)
        i = end


def schema_leaves(node, path=''):
    """[(key path, schema type, default)] of a config schema. A leaf is an object with `_type` or
    `_default`; `_elements` describes the items of an array (path ends in `[]`); an object-typed
    leaf can carry sub-keys of its own."""
    out = []
    if not isinstance(node, dict):
        return out
    if '_default' in node or '_type' in node:
        # the type is `<minified name>.Type.ConceptUuid`: keep the last part, the same in every app
        out.append((path, str(node.get('_type', '')).rsplit('.', 1)[-1], node.get('_default')))
        children = [(k, v) for k, v in node.items() if not k.startswith('_')]
        if isinstance(node.get('_elements'), dict):
            children.append(('[]', node['_elements']))
        for k, v in children:
            out += schema_leaves(v, path + k if k == '[]' else (path + '.' if path else '') + k)
        return out
    for k, v in node.items():
        out += schema_leaves(v, (path + '.' if path else '') + k)
    return out


def is_id(value):
    return isinstance(value, str) and not isinstance(value, Expr) and classify(value) == ('uuid', value)


def default_ids(value, sub=()):
    """[(sub path, id)] of every uuid inside a default: a string, a list, an object's values and keys
    (a map keyed by concept). `sub` is the path inside the default: a key, or '[]' for a list item."""
    if is_id(value):
        return [(sub, value)]
    out = []
    if isinstance(value, list):
        for item in value:
            out += default_ids(item, sub + ('[]',))
    elif isinstance(value, dict):
        for k, v in value.items():
            if is_id(k):
                out.append((sub + (k,), k))
            out += default_ids(v, sub + (k,))
    return out


def sub_path(sub):
    return ''.join('[]' if s == '[]' else '.' + s for s in sub)


def read_bundle(dist_dir):
    """Every default of every schema in a bundle's dist/*.js:
    ([(key path, schema type, default)], number of `_default:` the reader did not get)."""
    leaves, expected, seen = [], 0, 0
    for path in sorted(glob.glob(os.path.join(dist_dir, '**', '*.js'), recursive=True)):
        with open(path, encoding='utf-8', errors='replace') as f:
            src = f.read()
        expected += len(re.findall(r'\b_default:', src))
        for tree in schema_objects(src):
            found = schema_leaves(tree)
            seen += sum(1 for _, _, d in found if d is not None)
            leaves += found
    return leaves, max(0, expected - seen)


def assembled_apps(assemble=ASSEMBLE_CONFIG, modules=FRONTEND_MODULES):
    """[(package name, version, dist dir or None, patched)] of the apps the distribution serves."""
    with open(assemble, encoding='utf-8') as f:
        config = json.load(f)
    excluded = set(config.get('frontendModuleExcludes', []))
    local = {}
    for pkg in glob.glob(os.path.join(modules, '*', 'package.json')):
        with open(pkg, encoding='utf-8') as f:
            meta = json.load(f)
        local[meta.get('name')] = (os.path.dirname(pkg), meta.get('version'))
    apps = []
    for name, spec in config.get('frontendModules', {}).items():
        if name in excluded:
            continue
        if spec.startswith('file:'):
            folder, version = local.get(name, (None, None))
            dist = os.path.join(folder, 'dist') if folder and os.path.isdir(os.path.join(folder, 'dist')) else None
            apps.append((name, version or spec, dist, True))
        else:
            apps.append((name, spec, None, False))
    return apps


def bundle_folder(bundles, name):
    return os.path.join(bundles, name.replace('/', '__'))


def fetch_bundle(name, version, bundles):
    """npm pack <name>@<version> into a scratch folder outside the repository (no install, no
    script run), then keep package.json and dist/ of the tarball under bundles/<name>/."""
    target = bundle_folder(bundles, name)
    with tempfile.TemporaryDirectory() as scratch:
        subprocess.run(['npm', 'pack', '{}@{}'.format(name, version), '--ignore-scripts', '--silent',
                        '--pack-destination', scratch], cwd=scratch, check=True, stdout=subprocess.DEVNULL)
        tarballs = glob.glob(os.path.join(scratch, '*.tgz'))
        if len(tarballs) != 1:
            raise RuntimeError('npm pack gave {} for {}'.format(tarballs, name))
        os.makedirs(target, exist_ok=True)
        with tarfile.open(tarballs[0]) as tar:
            for member in tar.getmembers():
                rel = member.name.split('/', 1)[1] if '/' in member.name else ''
                if not member.isfile() or not (rel == 'package.json' or rel.startswith('dist/')):
                    continue
                if rel.startswith('/') or '..' in rel.split('/'):
                    continue
                dest = os.path.join(target, rel)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                with open(dest, 'wb') as out:
                    out.write(tar.extractfile(member).read())
    return os.path.join(target, 'dist')


def bundle_for(app, bundles, fetch):
    """The dist folder to read for an assembled app, or None."""
    name, version, dist, patched = app
    if dist:
        return dist
    if bundles:
        folder = os.path.join(bundle_folder(bundles, name), 'dist')
        if os.path.isdir(folder):
            return folder
    if fetch and bundles and not patched:
        try:
            return fetch_bundle(name, version, bundles)
        except (subprocess.CalledProcessError, OSError, RuntimeError, tarfile.TarError) as e:
            print('not fetched: {}@{}: {}'.format(name, version, e), file=sys.stderr)
    return None


FRAMEWORK = '@openmrs/esm-framework'
# The framework's own config schema is bundled in every app; its keys sit under these site config keys
FRAMEWORK_SITE_KEYS = (FRAMEWORK, '@openmrs/esm-styleguide', 'core')

# What kind of object a key names, from the key name (the last segment that says it comes first).
# (pattern, kind); kinds are keys of KIND_TABLE
KIND_BY_NAME = [
    (re.compile(r'^form(Concept)?Uuid$|formUuid$', re.I), 'form'),
    (re.compile(r'conceptClass', re.I), 'concept_class'),
    (re.compile(r'encounterRole', re.I), 'encounter_role'),
    (re.compile(r'encounterType', re.I), 'encounter_type'),
    (re.compile(r'visitType', re.I), 'visit_type'),
    (re.compile(r'orderType', re.I), 'order_type'),
    (re.compile(r'careSetting', re.I), 'care_setting'),
    (re.compile(r'visitAttribute|visit\w*AttributeUuid', re.I), 'visit_attribute_type'),
    (re.compile(r'personAttribute|contactAttribute', re.I), 'person_attribute_type'),
    (re.compile(r'attributeType', re.I), 'attribute_type'),
    (re.compile(r'identifierType', re.I), 'patient_identifier_type'),
    (re.compile(r'location', re.I), 'location'),
    (re.compile(r'program', re.I), 'program'),
    (re.compile(r'concept', re.I), 'concept'),
]
# kind -> tables that can hold the uuid. `attribute_type` is an attribute type of either kind;
# `unknown` is anything we know a table for
KIND_TABLE = {
    'concept': ['concept'],
    'concept_class': ['concept_class'],
    'encounter_type': ['encounter_type'],
    'encounter_role': ['encounter_role'],
    'visit_type': ['visit_type'],
    'order_type': ['order_type'],
    'care_setting': ['care_setting'],
    'visit_attribute_type': ['visit_attribute_type'],
    'person_attribute_type': ['person_attribute_type'],
    'attribute_type': ['person_attribute_type', 'visit_attribute_type'],
    'patient_identifier_type': ['patient_identifier_type'],
    'location': ['location'],
    'program': ['program'],
    'form': ['form'],
}
KIND_TABLE['unknown'] = sorted({t for tables in KIND_TABLE.values() for t in tables})

# Apps that save a bare `POST /encounter` (the saves refused on production, #841)
SAVING_APPS = {
    '@openmrs/esm-patient-vitals-app': 'vitals',
    '@openmrs/esm-patient-notes-app': 'visit note',
    '@openmrs/esm-patient-orders-app': 'order basket',
    '@openmrs/esm-ward-app': 'ward',
}
# In any other app, a key that names something written on save
SAVE_KEY = re.compile(
    r'diagnos|problemList|encounterNote|encounterRole|encounterType|stickyNote|PatientNote|freeTextField|'
    r'notesConcept|systolic|diastolic|pulse|temperature|oxygen|respiratory|height|weight|bodyMass|'
    r'midUpperArm|vitalSigns',
    re.I,
)
# Keys that only read (the chart's tiles show the last vitals, they do not write them)
READ_ONLY_KEY = re.compile(r'tileDefinitions|resultsViewer', re.I)


def classify_kind(key_path, schema_type, element_type=''):
    """Kind of object a default names. Segments are tried from the last: the key name first, the
    schema type (ConceptUuid) after the leaf's own name, then the names above it."""
    segments = [s for s in re.split(r'[.\[\]]+', key_path) if s]
    for position, segment in enumerate(reversed(segments)):
        for pattern, kind in KIND_BY_NAME:
            if pattern.search(segment):
                return kind
        if position == 0 and (schema_type == 'ConceptUuid' or element_type == 'ConceptUuid'):
            return 'concept'
    return 'unknown'


def saves_flag(app, key_path):
    if app in SAVING_APPS:
        return 'yes: ' + SAVING_APPS[app]
    if SAVE_KEY.search(key_path) and not READ_ONLY_KEY.search(key_path):
        return 'yes: key'
    return ''


def site_sets(configs, app_keys, parts, sub=()):
    """True when the site (or distro) config overrides the default at key path `parts` (a list of
    keys, '[]' for array items), and `sub` inside it. Objects merge key by key, arrays are replaced."""
    for config in configs:
        for app_key in app_keys:
            if app_key in config and _sets(config[app_key], list(parts), list(sub)):
                return True
    return False


def _sets(node, parts, sub):
    if parts:
        part = parts[0]
        if part == '[]':
            return isinstance(node, list) and len(node) > 0 and all(_sets(item, parts[1:], sub) for item in node)
        return isinstance(node, dict) and part in node and _sets(node[part], parts[1:], sub)
    while sub:
        part = sub[0]
        if part == '[]' or not isinstance(node, dict):
            return True  # the list was replaced, or the key's value is not an object that merges
        if part not in node:
            return False
        node, sub = node[part], sub[1:]
    return True


def site_array_items(configs, app_keys, parts):
    """The items the site sets for the array at `parts`, or None when it sets none."""
    items = None
    for config in configs:
        for app_key in app_keys:
            node = config.get(app_key)
            for part in parts:
                node = node.get(part) if isinstance(node, dict) else None
            if isinstance(node, list):
                items = (items or []) + node
    return items


def app_defaults(apps, bundles=None, fetch=False):
    """Every uuid default of the assembled apps: (rows, scanned, skipped, unread).
    A row is a dict: app, key_path, sub (inside the default), kind, id, saves, element (item default)."""
    per_app, scanned, skipped, unread = {}, [], [], {}
    for app in apps:
        dist = bundle_for(app, bundles, fetch)
        if not dist:
            skipped.append(app)
            continue
        leaves, missed = read_bundle(dist)
        per_app[app[0]] = leaves
        scanned.append(app)
        if missed:
            unread[app[0]] = missed
    # A schema found in at least half of the apps (and three) is the framework's, bundled in each
    counts = {}
    for leaves in per_app.values():
        for signature in {(p, t, repr(d)) for p, t, d in leaves}:
            counts[signature] = counts.get(signature, 0) + 1
    threshold = max(3, (len(per_app) + 1) // 2)
    rows, seen = [], set()
    for name, leaves in per_app.items():
        types = {p: t for p, t, _ in leaves}
        defaults = {p: d for p, _, d in leaves}
        for path, schema_type, default in leaves:
            owner = FRAMEWORK if counts[(path, schema_type, repr(default))] >= threshold else name
            for sub, ident in default_ids(default):
                key = (owner, path, sub, ident)
                if key in seen:
                    continue
                seen.add(key)
                full = path + sub_path(sub)
                rows.append({
                    'app': owner, 'key_path': full, 'leaf': path, 'sub': sub, 'id': ident,
                    'kind': classify_kind(full, schema_type, types.get(path + '[]', '')),
                    'saves': saves_flag(owner, full),
                    'element': '[]' in path,
                    'parent_default': defaults.get(path.rsplit('[]', 1)[0]) if '[]' in path else None,
                })
    rows.sort(key=lambda r: (r['app'], r['key_path'], r['id']))
    return rows, scanned, skipped, unread


def site_configs(*globs):
    configs = []
    for pattern in globs:
        for path in sorted(glob.glob(pattern)):
            with open(path, encoding='utf-8') as f:
                configs.append(json.load(f))
    return configs


def in_effect(row, configs):
    """True when no site config key replaces this default."""
    app_keys = FRAMEWORK_SITE_KEYS if row['app'] == FRAMEWORK else (row['app'],)
    parts = [p for p in re.split(r'(\[\])|\.', row['leaf']) if p]
    if row['element']:
        # An item default applies to the items that omit the key: the site's items, or the app's own list
        cut = row['leaf'].index('[]')
        array_parts = [p for p in re.split(r'\.', row['leaf'][:cut]) if p]
        items = site_array_items(configs, app_keys, array_parts)
        if items is None:
            return isinstance(row['parent_default'], list) and len(row['parent_default']) > 0
        return not site_sets(configs, app_keys, parts, row['sub'])
    return not site_sets(configs, app_keys, parts, row['sub'])


def defaults_report(rows, scanned, skipped, unread, configs, show_all=False):
    effective = [r for r in rows if in_effect(r, configs)]
    out = [
        'Built-in defaults of the frontend apps, minus the keys the site config sets (UVL-EMR #841).',
        '',
        'apps scanned: {}; not scanned (no bundle, use --bundles/--fetch): {}'.format(len(scanned), len(skipped)),
        'defaults found: {}; overridden by the site: {}; in effect: {}'.format(
            len(rows), len(rows) - len(effective), len(effective)),
    ]
    if unread:
        out.append('WARNING: `_default` not read: ' + ', '.join('{} ({})'.format(a, n) for a, n in sorted(unread.items())))
    out += ['', 'SAVES = the app (or the key) writes it when it saves an encounter: an unresolved concept there '
            'makes the save fail (HTTP 400).', '']
    shown = rows if show_all else effective
    header = ('app', 'key path', 'kind', 'default', 'saves')
    table = [header] + [(r['app'], r['key_path'], r['kind'], r['id'], r['saves'] or '-') for r in shown]
    widths = [max(len(row[i]) for row in table) for i in range(len(header))]
    for row in table:
        out.append('  '.join(cell.ljust(widths[i]) for i, cell in enumerate(row)).rstrip())
    if skipped:
        out += ['', 'not scanned: ' + ', '.join('{}@{}'.format(a[0], a[1]) for a in skipped)]
    return '\n'.join(out)


def defaults_sql(effective):
    """The SELECT that returns each default in effect that resolves to nothing."""
    if not effective:
        return ''
    rows = '\n  UNION ALL '.join(
        'SELECT {} AS app, {} AS key_path, {} AS kind, {} AS ref, {} AS saves'.format(
            quote(r['app']), quote(r['key_path']), quote(r['kind']), quote(r['id']), quote(r['saves'] or '-'))
        for r in effective
    )
    clauses = []
    for kind in sorted(KIND_TABLE):
        missing = ' AND '.join(
            'NOT EXISTS (SELECT 1 FROM {t} t WHERE t.uuid = r.ref)'.format(t=t) for t in KIND_TABLE[kind])
        clauses.append("(r.kind = {} AND {})".format(quote(kind), missing))
    return '\n'.join([
        "-- 5. The frontend apps' built-in defaults in effect (the site config does not set the key) that",
        '--    resolve to nothing: a save by the app that uses one fails like an unresolved concept does.',
        '--    {} defaults checked; saves = yes means the app writes it on save. `unknown` kinds are looked up'.format(len(effective)),
        '--    in every metadata table below.',
        'SELECT r.app, r.key_path, r.kind, r.ref AS unresolved_default, r.saves',
        'FROM (\n  {}\n) r'.format(rows),
        'WHERE ' + '\n   OR '.join(clauses),
        'ORDER BY r.saves = \'-\', r.app, r.key_path;',
        '',
    ])



def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('command', choices=['list', 'defaults', 'sql'])
    parser.add_argument('--forms', default=FORMS_GLOB, help='glob of the form JSON files')
    parser.add_argument('--frontend-config', default=FRONTEND_GLOB, help='glob of the frontend config JSON files')
    parser.add_argument('--bundles', help='folder of app bundles, one <package with / as __>/dist per app')
    parser.add_argument('--fetch', action='store_true',
                        help='download the apps that are not in the repository (npm pack, needs the network) into --bundles')
    parser.add_argument('--all', action='store_true', help='defaults: also list the defaults the site config overrides')
    parser.add_argument('--no-app-defaults', action='store_true', help='sql: leave out the apps\' defaults query')
    args = parser.parse_args(argv)
    bundles = args.bundles
    if args.fetch and not bundles:
        bundles = tempfile.mkdtemp(prefix='frontend-bundles-')
    if args.command == 'list':
        references = collect(args.forms, args.frontend_config)
        for (kind, ref), where in sorted(references.items()):
            print('\t'.join([kind, ref, ', '.join(where)]))
        return 0
    if args.command == 'sql':
        print(sql(collect(args.forms, args.frontend_config)))
        if args.no_app_defaults:
            return 0
    rows, scanned, skipped, unread = app_defaults(assembled_apps(), bundles, args.fetch)
    configs = site_configs(DISTRO_FRONTEND_GLOB, args.frontend_config)
    if args.command == 'defaults':
        print(defaults_report(rows, scanned, skipped, unread, configs, args.all))
    else:
        print('-- Apps scanned for defaults: {}; not scanned: {}. {} defaults found, {} in effect.'.format(
            len(scanned), len(skipped), len(rows), sum(1 for r in rows if in_effect(r, configs))))
        print(defaults_sql([r for r in rows if in_effect(r, configs)]))
    return 0


if __name__ == '__main__':
    sys.exit(main())
