#!/usr/bin/env python3
"""
ICD-10 codes for the UVL diagnosis concepts (#584).

The 1,198 Diagnosis concepts of uvl-dx (source UVL-Burundi/uvl-custom) carry their ICD-10
code only at the start of their English name ("A00 Cholera"). None of them is mapped to
ICD-10-WHO, so OpenMRS has no code for them: the diagnosis search cannot find them by code
and reporting has nothing in concept_reference_map. This script reads the code from the
name and produces one SAME-AS mapping to /orgs/WHO/sources/ICD-10-WHO/concepts/<code>/ per
concept, with a deterministic UUID, in two places that must agree:

  ocl  creates the mappings in OCL (uvl-custom), each with that UUID as its external_id,
       and can release a new uvl-custom version. OCL stays the source of truth.
  sql  writes the Liquibase SQL that puts the same mappings into OpenMRS now, with the same
       UUIDs, without re-exporting uvl-dx (a re-export of uvl-dx HEAD would drop 154
       concepts until #533 is settled). When uvl-dx is re-exported later, the openconceptlab
       module finds each concept_reference_map by that UUID and updates it instead of adding
       a second one.

The six codes WHO no longer has (NOT_IN_ICD10_WHO) were left without a map by #584 and given
the current WHO code of the same meaning on 12 Nov 2026 (REPLACED_CODES, #585). Their maps
are in a file of their own, run by a later changeset, because diagnosis_icd10_maps.sql is
already applied and Liquibase refuses a changed file.

Usage:
  python3 scripts/diagnosis-icd10-maps.py sql \
      sites/mugamba/configs/openmrs/initializer_config/ocl/UVL_dx_v4.zip \
      sites/mugamba/configs/openmrs/initializer_config/liquibase/sql/diagnosis_icd10_maps.sql
  python3 scripts/diagnosis-icd10-maps.py sql --replaced \
      sites/mugamba/configs/openmrs/initializer_config/ocl/UVL_dx_v4.zip \
      sites/mugamba/configs/openmrs/initializer_config/liquibase/sql/diagnosis_icd10_maps_replaced.sql
  OCL_TOKEN=... python3 scripts/diagnosis-icd10-maps.py ocl <zip> [--apply] [--release VERSION]

`ocl` without --apply only reports what it would create. Both modes are idempotent.
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
import uuid
import zipfile

OCL_API = 'https://api.openconceptlab.org'
SOURCE_URL = '/orgs/UVL-Burundi/sources/uvl-custom/'
ICD10_URL = '/orgs/WHO/sources/ICD-10-WHO/'
MAP_TYPE = 'SAME-AS'

# Namespace of the mapping and term UUIDs. Never change it: OpenMRS and OCL both hold the
# UUIDs derived from it.
NAMESPACE = uuid.uuid5(uuid.NAMESPACE_URL, 'https://github.com/MadiroGlobalHealth/UVL-EMR/issues/584')

# Names whose code cannot be read from the English name. Keyed by concept external_id.
CODE_OVERRIDES = {
    # "C Malignant neoplasm of the ampulla of Vater"; the French name says "C 24.1".
    'a61f7a7e-be38-4970-b841-3adc2efdb46c': 'C24.1',
}

# Codes the names carry that WHO ICD-10 (the ICD-10-WHO source in OCL) does not have: they
# were removed or moved in later revisions. These concepts get no mapping until someone
# decides their code. `ocl` checks this list against OCL and stops if it is out of date.
NOT_IN_ICD10_WHO = {
    'I84',    # Hemorrhoids - WHO moved haemorrhoids to K64 (2016)
    'N18.0',  # End-stage renal failure - WHO replaced N18.0 with N18.5 (2010)
    'U80',    # Agents resistant to penicillin - U80-U89 replaced by U82-U85 (2016)
    'U81',    # Agents resistant to vancomycin
    'U88',    # Agents resistant to multiple antibiotics
    'U89',    # Agents resistant to other and unspecified antibiotics
}

# The current WHO code chosen for each code of NOT_IN_ICD10_WHO (decision of 12 Nov 2026 on
# #585), by the meaning of the diagnosis name.
REPLACED_CODES = {
    'I84': 'K64.9',    # Hemorrhoids -> Haemorrhoids, unspecified
    'N18.0': 'N18.5',  # End-stage renal failure -> Chronic kidney disease, stage 5
    'U80': 'U82.0',    # Agents resistant to penicillin and related -> Resistance to penicillin
    'U81': 'U83.0',    # Agents resistant to vancomycin and related -> Resistance to vancomycin
    'U88': 'U83.7',    # Agents resistant to multiple antibiotics -> Resistance to multiple antibiotics
    'U89': 'U83.9',    # Agents resistant to other and unspecified antibiotics -> Resistance to unspecified antibiotic
}

CODE = re.compile(r'[A-Z]\d\d(\.\d)?')


def english_name(concept):
    for name in concept['names']:
        if name['locale'] == 'en' and name['name_type'] == 'Fully Specified':
            return name['name']
    return concept['display_name']


def code_of(concept):
    """The ICD-10 code at the start of the English name, or None."""
    if concept['external_id'] in CODE_OVERRIDES:
        return CODE_OVERRIDES[concept['external_id']]
    token = english_name(concept).split(' ', 1)[0]
    if token.startswith('2017-'):            # "2017-A98.4 Ebola virus disease"
        token = token[len('2017-'):]
    if re.fullmatch(r'[A-Z]\d{3}', token):   # "B881 Tungiasis" is B88.1
        token = token[:3] + '.' + token[3:]
    return token if CODE.fullmatch(token) else None


def map_uuid(concept_uuid, code):
    return str(uuid.uuid5(NAMESPACE, f'{concept_uuid}|ICD-10-WHO|{code}'))


def term_uuid(code):
    return str(uuid.uuid5(NAMESPACE, f'ICD-10-WHO|{code}'))


def load(zip_path):
    """[(concept, code)] for every Diagnosis concept, code None when it has none."""
    with zipfile.ZipFile(zip_path) as z:
        export = json.loads(z.read('export.json'))
    rows = []
    for concept in export['concepts']:
        if concept['concept_class'] != 'Diagnosis' or concept['retired']:
            continue
        rows.append((concept, code_of(concept)))
    return sorted(rows, key=lambda r: int(r[0]['id']) if r[0]['id'].isdigit() else r[0]['id'])


def mappable(rows):
    return [(c, code) for c, code in rows if code and code not in NOT_IN_ICD10_WHO]


def replaced(rows):
    """The concepts of NOT_IN_ICD10_WHO with the code they are mapped to instead (#585)."""
    return [(c, REPLACED_CODES[code]) for c, code in rows if code in NOT_IN_ICD10_WHO]


def report(rows):
    unparsed = [c for c, code in rows if not code]
    skipped = [(c, code) for c, code in rows if code in NOT_IN_ICD10_WHO]
    print(f'{len(rows)} diagnosis concepts, {len(mappable(rows))} mapped', file=sys.stderr)
    for c in unparsed:
        print(f'  no code in name: {c["id"]} {english_name(c)}', file=sys.stderr)
    for c, code in skipped:
        print(f'  not in ICD-10-WHO: {c["id"]} {english_name(c)} -> {code}, mapped to {REPLACED_CODES[code]}',
              file=sys.stderr)


def sql_literal(text):
    return "'" + text.replace('\\', '\\\\').replace("'", "''") + "'"


HEADER = [
    '-- #584: one SAME-AS map to ICD-10-WHO per uvl-dx diagnosis concept, the code read from',
    '-- the English name. Run by the changeset diagnosis_icd10_maps-20261111 in ../liquibase.xml.',
]
HEADER_REPLACED = [
    '-- #585: one SAME-AS map to ICD-10-WHO for each uvl-dx diagnosis whose name carries a code',
    '-- WHO no longer has, to the current code of the same meaning (REPLACED_CODES). Run by the',
    '-- changeset diagnosis_icd10_maps_replaced-20261112 in ../liquibase.xml.',
]


def write_sql(rows, out, header=HEADER):
    lines = [
        '-- GENERATED by scripts/diagnosis-icd10-maps.py from UVL_dx_v4.zip; do not edit by hand.',
        '--',
    ] + header + [
        '-- map_uuid is the external_id of the same mapping in OCL (uvl-custom), so a later uvl-dx',
        '-- re-export updates these rows instead of adding a second map. A concept that does not',
        '-- exist, a code that already has a term, and a concept already mapped to the code (or a',
        '-- map with the same uuid) are all left alone, so it can run on any database.',
        '',
        'CREATE TEMPORARY TABLE uvl_dx_icd10 (',
        '    concept_uuid CHAR(38) NOT NULL,',
        '    code VARCHAR(255) NOT NULL,',
        '    map_uuid CHAR(38) NOT NULL,',
        '    term_uuid CHAR(38) NOT NULL',
        ') DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        '',
        'INSERT INTO uvl_dx_icd10 (concept_uuid, code, map_uuid, term_uuid) VALUES',
    ]
    values = []
    for concept, code in rows:
        cu = concept['external_id']
        values.append(f'    ({sql_literal(cu)}, {sql_literal(code)}, {sql_literal(map_uuid(cu, code))}, '
                      f'{sql_literal(term_uuid(code))})')
    for i, (value, (concept, _)) in enumerate(zip(values, rows)):
        sep = ';' if i == len(values) - 1 else ','
        # Liquibase splits on ';' before it strips comments, so none may be in one.
        comment = re.sub(r"[\n;']", ' ', english_name(concept))
        lines.append(f'{value}{sep} -- {comment}')
    lines += [
        '',
        '-- A term per code that ICD-10-WHO does not have yet.',
        'INSERT INTO concept_reference_term (concept_source_id, code, creator, date_created, retired, uuid)',
        'SELECT DISTINCT s.concept_source_id, t.code, 1, NOW(), 0, t.term_uuid',
        '  FROM uvl_dx_icd10 t',
        '  JOIN concept c ON c.uuid = t.concept_uuid',
        '  JOIN concept_reference_source s ON s.name = \'ICD-10-WHO\' AND s.retired = 0',
        ' WHERE NOT EXISTS (SELECT 1 FROM concept_reference_term r',
        '                    WHERE r.concept_source_id = s.concept_source_id AND r.code = t.code)',
        '   AND NOT EXISTS (SELECT 1 FROM concept_reference_term r WHERE r.uuid = t.term_uuid);',
        '',
        '-- The map, to the oldest term of that code (an existing one is reused).',
        'INSERT INTO concept_reference_map (concept_reference_term_id, concept_map_type_id, creator, date_created, concept_id, uuid)',
        'SELECT (SELECT MIN(r.concept_reference_term_id) FROM concept_reference_term r',
        '         WHERE r.concept_source_id = s.concept_source_id AND r.code = t.code),',
        '       mt.concept_map_type_id, 1, NOW(), c.concept_id, t.map_uuid',
        '  FROM uvl_dx_icd10 t',
        '  JOIN concept c ON c.uuid = t.concept_uuid',
        '  JOIN concept_reference_source s ON s.name = \'ICD-10-WHO\' AND s.retired = 0',
        '  JOIN concept_map_type mt ON mt.name = \'SAME-AS\'',
        ' WHERE NOT EXISTS (SELECT 1 FROM concept_reference_map m WHERE m.uuid = t.map_uuid)',
        '   AND NOT EXISTS (SELECT 1 FROM concept_reference_map m',
        '                     JOIN concept_reference_term r ON r.concept_reference_term_id = m.concept_reference_term_id',
        '                    WHERE m.concept_id = c.concept_id',
        '                      AND r.concept_source_id = s.concept_source_id AND r.code = t.code);',
        '',
        'DROP TEMPORARY TABLE uvl_dx_icd10;',
        '',
    ]
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(lines))
    print(f'wrote {out}: {len(rows)} maps', file=sys.stderr)


def ocl(method, path, token, body=None):
    req = urllib.request.Request(OCL_API + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': f'Token {token}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        text = resp.read()
        return json.loads(text) if text else None


def ocl_all(path, token):
    out, page = [], 1
    while True:
        sep = '&' if '?' in path else '?'
        batch = ocl('GET', f'{path}{sep}limit=1000&page={page}', token)
        out += batch
        if len(batch) < 1000:
            return out
        page += 1


def run_ocl(rows, apply, release):
    token = os.environ.get('OCL_TOKEN')
    if not token:
        sys.exit('OCL_TOKEN is not set')

    who = {c['id'] for c in ocl_all(f'{ICD10_URL}concepts/?includeRetired=true', token)
           if c.get('concept_class') == 'Code' and not c.get('retired')}
    absent = {code for _, code in rows if code and code not in who}
    if absent != NOT_IN_ICD10_WHO:
        sys.exit(f'NOT_IN_ICD10_WHO is out of date: OCL lacks {sorted(absent)}, '
                 f'the list says {sorted(NOT_IN_ICD10_WHO)}')
    if set(REPLACED_CODES) != NOT_IN_ICD10_WHO or not set(REPLACED_CODES.values()) <= who:
        sys.exit(f'REPLACED_CODES must give a code ICD-10-WHO has to each of {sorted(NOT_IN_ICD10_WHO)}')

    existing = ocl_all(f'{SOURCE_URL}mappings/?verbose=true', token)
    by_external_id = {m['external_id'] for m in existing if m.get('external_id')}
    by_pair = {(m['from_concept_url'], m['to_concept_url']) for m in existing}

    todo = []
    for concept, code in mappable(rows) + replaced(rows):
        from_url = f'{SOURCE_URL}concepts/{concept["id"]}/'
        to_url = f'{ICD10_URL}concepts/{code}/'
        ext = map_uuid(concept['external_id'], code)
        if ext in by_external_id or (from_url, to_url) in by_pair:
            continue
        todo.append({'map_type': MAP_TYPE, 'from_concept_url': from_url, 'to_concept_url': to_url,
                     'external_id': ext})
    print(f'{len(todo)} mappings to create in {SOURCE_URL}', file=sys.stderr)
    if not apply:
        return

    created = 0
    for body in todo:
        try:
            ocl('POST', f'{SOURCE_URL}mappings/', token, body)
            created += 1
        except urllib.error.HTTPError as e:
            print(f'  FAILED {body["from_concept_url"]} -> {body["to_concept_url"]}: {e.code} {e.read()[:300]}',
                  file=sys.stderr)
    print(f'created {created} of {len(todo)}', file=sys.stderr)

    if release:
        try:
            ocl('POST', f'{SOURCE_URL}versions/', token,
                {'id': release, 'released': True,
                 'description': 'UVL-EMR#584, #585: ICD-10-WHO SAME-AS mappings for the diagnosis concepts'})
        except urllib.error.HTTPError as e:
            # 409: the version id is taken, often by another release the same day.
            sys.exit(f'release {release} failed: {e.code} {e.read()[:300]}; choose another version id')
        print(f'released {SOURCE_URL}versions/{release}/', file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='mode', required=True)
    p_sql = sub.add_parser('sql')
    p_sql.add_argument('--replaced', action='store_true',
                       help='write only the maps of the codes WHO no longer has (REPLACED_CODES, #585)')
    p_sql.add_argument('zip')
    p_sql.add_argument('out')
    p_ocl = sub.add_parser('ocl')
    p_ocl.add_argument('zip')
    p_ocl.add_argument('--apply', action='store_true')
    p_ocl.add_argument('--release')
    args = parser.parse_args()

    rows = load(args.zip)
    report(rows)
    if args.mode == 'sql' and args.replaced:
        write_sql(replaced(rows), args.out, HEADER_REPLACED)
    elif args.mode == 'sql':
        write_sql(mappable(rows), args.out)
    else:
        run_ocl(rows, args.apply, args.release)


if __name__ == '__main__':
    main()
