#!/usr/bin/env python3
"""
Every concept the site's forms and frontend config refer to, and the SQL to check them against a
database (#841).

OpenMRS refuses a whole encounter when one obs names a concept it cannot resolve, and the form
engine does not know before the save: the form loads, the user fills it in, and the save fails with
a conversion error (HTTP 400, about 15 KB, a stack trace). The forms are the only place the site
names these concepts, so this reads them and says which concept each reference is.

Reads, never writes, and never connects to a database: it prints the SQL and the person who runs it
chooses the server (a read-only user is enough, the queries only SELECT).

  list   one line per distinct reference: kind, reference, where it is used
  sql    the SELECT statements: the references with no concept behind them (that is the answer
         to the question "which concept does a save fail on"), then the ones that resolve to a
         retired concept, which still saves but is hidden from the concept search

A reference is one of:
  uuid     a concept UUID (a padded legacy CIEL one, "1115AAAA...", is a UUID as far as OpenMRS goes)
  mapping  SOURCE:code, resolved through concept_reference_map (CIEL:169402)

Forms: every `concept` value of the form JSON (questions, answers, obs groups).
Frontend config: every UUID or mapping under a key that names a concept (conceptUuid,
systolicBloodPressureUuid, motherConcepts, answerConceptSetUuid ...). Keys that name other
metadata (encounter, order and visit types, person attribute types, provider roles, forms) are
not concepts and are left out.

Usage:
  python3 scripts/form-concept-references.py list
  python3 scripts/form-concept-references.py sql > /tmp/concept-check.sql
  # then, read-only, against the database to check:
  mysql -N openmrs < /tmp/concept-check.sql
"""
import argparse
import glob
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SITE_CONFIG = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'openmrs')
FORMS_GLOB = os.path.join(SITE_CONFIG, 'initializer_config', 'ampathforms', '*.json')
FRONTEND_GLOB = os.path.join(SITE_CONFIG, 'frontend_config', '*.json')

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


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('command', choices=['list', 'sql'])
    parser.add_argument('--forms', default=FORMS_GLOB, help='glob of the form JSON files')
    parser.add_argument('--frontend-config', default=FRONTEND_GLOB, help='glob of the frontend config JSON files')
    args = parser.parse_args(argv)
    references = collect(args.forms, args.frontend_config)
    if args.command == 'list':
        for (kind, ref), where in sorted(references.items()):
            print('\t'.join([kind, ref, ', '.join(where)]))
    else:
        print(sql(references))
    return 0


if __name__ == '__main__':
    sys.exit(main())
