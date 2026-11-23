#!/usr/bin/env python3
"""
Tests scripts/form-concept-references.py (#841): which strings count as concept references in the
forms and in the frontend config, and the SQL it prints.

  python3 scripts/test/form-concept-references/test.py
"""
import importlib.util
import json
import os
import tempfile
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
spec = importlib.util.spec_from_file_location('fcr', os.path.join(ROOT, 'scripts', 'form-concept-references.py'))
fcr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fcr)

U1 = '5d32f886-732b-439c-956c-82c0415f17c9'
U2 = '238652d6-4aca-451a-9c8e-8336cea6fff4'
LEGACY = '1115' + 'A' * 32


class Classify(unittest.TestCase):
    def test_uuid_legacy_uuid_and_mapping(self):
        self.assertEqual(fcr.classify(U1), ('uuid', U1))
        self.assertEqual(len(LEGACY), 36)
        self.assertEqual(fcr.classify(LEGACY), ('uuid', LEGACY))
        self.assertEqual(fcr.classify('CIEL:169402'), ('mapping', 'CIEL:169402'))

    def test_other_strings_are_not_references(self):
        for value in ('Weight (kg)', 'https://x.org/a', '', None, 12, '1115A'):
            self.assertIsNone(fcr.classify(value), value)


class Forms(unittest.TestCase):
    def test_reads_every_concept_value_at_any_depth(self):
        form = {
            'encounterType': U2,
            'pages': [{'sections': [{'questions': [{
                'label': 'Weight',
                'questionOptions': {
                    'concept': U1,
                    'answers': [{'label': 'Yes', 'concept': LEGACY}, {'label': 'No', 'concept': 'CIEL:169403'}],
                },
                'questions': [{'questionOptions': {'concept': U2}}],
            }]}]}],
        }
        self.assertEqual(
            sorted(fcr.form_references(form)),
            sorted([('uuid', U1), ('uuid', LEGACY), ('mapping', 'CIEL:169403'), ('uuid', U2)]),
        )

    def test_every_concept_value_of_the_site_forms_is_a_reference(self):
        """A concept written in a shape the script does not know would be left unchecked."""
        import glob
        for path in glob.glob(fcr.FORMS_GLOB):
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
            values = []

            def walk(node):
                if isinstance(node, dict):
                    for k, v in node.items():
                        if k == 'concept' and isinstance(v, str):
                            values.append(v)
                        walk(v)
                elif isinstance(node, list):
                    for i in node:
                        walk(i)

            walk(data)
            self.assertEqual(len(values), len(fcr.form_references(data)), os.path.basename(path))


class Config(unittest.TestCase):
    def test_concept_keys_are_read_and_other_metadata_is_not(self):
        config = {
            '@openmrs/esm-patient-vitals-app': {'concepts': {'pulseUuid': U1}},
            '@x': {'newbornConcepts': [U2, LEGACY], 'encounterTypeUuid': 'aaaaaaaa-0000-0000-0000-000000000000'},
            '@y': {'visitTypes': ['bbbbbbbb-0000-0000-0000-000000000000'], 'translations': {'fr': {'k': 'en:Hello'}}},
            '@z': {'labOrderTypeUuid': 'cccccccc-0000-0000-0000-000000000000', 'concept': 'CIEL:5089'},
        }
        self.assertEqual(
            sorted(fcr.config_references(config)),
            sorted([('uuid', U1), ('uuid', U2), ('uuid', LEGACY), ('mapping', 'CIEL:5089')]),
        )


class Sql(unittest.TestCase):
    def test_sql_checks_uuids_and_mappings_and_quotes_them(self):
        text = fcr.sql([('uuid', U1), ('uuid', LEGACY), ('mapping', 'CIEL:169402')])
        self.assertIn("SELECT '{}' AS ref".format(U1), text)
        self.assertIn("SELECT 'CIEL:169402' AS ref, 'CIEL' AS source, '169402' AS code", text)
        self.assertIn('LEFT JOIN concept c ON c.uuid = r.ref', text)
        self.assertIn('concept_reference_map', text)
        for forbidden in ('INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE'):
            self.assertNotIn(forbidden, text)

    def test_a_quote_cannot_leave_its_string(self):
        self.assertEqual(fcr.quote("a'b"), "'a''b'")

    def test_the_site_references_make_sql_with_each_of_them_once(self):
        references = fcr.collect()
        self.assertTrue(references)
        text = fcr.sql(references)
        for kind, ref in references:
            if kind == 'uuid':
                self.assertEqual(text.count("SELECT '{}' AS ref".format(ref)), 2, ref)

# A tiny built bundle: the shape of a minified config schema (#841), with a vitals-like group, an
# array whose items have their own defaults, a map keyed by a concept and a default that is a variable
BUNDLE = (
    'let r="x",o={a:1};'
    'function s(){return{}}'
    'let c={concepts:{systolicUuid:{_type:n.Type.ConceptUuid,_default:"5085' + 'A' * 32 + '"},'
    'noteUuid:{_type:n.Type.ConceptUuid,_description:`A ${r} note`,_default:"' + U1 + '"}},'
    'vitals:{encounterTypeUuid:{_type:n.Type.UUID,_default:"' + U2 + '"},'
    'useForm:{_type:n.Type.Boolean,_default:!1},'
    'title:{_type:n.Type.String,_default:"it\\u0027s",_validators:[n.validators.isUrl(o)]},'
    'viaVariable:{_type:n.Type.UUID,_default:o}},'
    'tiles:{_type:n.Type.Array,_elements:{_type:n.Type.Object,'
    'concept:{_type:n.Type.ConceptUuid,_default:"1066' + 'A' * 32 + '"}},'
    '_default:[{concept:"1065' + 'A' * 32 + '"}]},'
    'unitsMap:{_type:n.Type.Object,_default:{"1072' + 'A' * 32 + '":1}}};'
)


class AppDefaults(unittest.TestCase):
    def leaves(self):
        trees = fcr.schema_objects(BUNDLE)
        self.assertEqual(len(trees), 1)
        return fcr.schema_leaves(trees[0])

    def test_the_schema_is_read_with_its_key_paths_and_types(self):
        by_path = {path: (kind, default) for path, kind, default in self.leaves()}
        self.assertEqual(by_path['concepts.systolicUuid'], ('ConceptUuid', '5085' + 'A' * 32))
        self.assertEqual(by_path['vitals.encounterTypeUuid'], ('UUID', U2))
        self.assertEqual(by_path['vitals.useForm'], ('Boolean', False))
        self.assertEqual(by_path['vitals.title'], ('String', "it's"))
        self.assertEqual(by_path['tiles[].concept'][0], 'ConceptUuid')
        self.assertIsInstance(by_path['vitals.viaVariable'][1], fcr.Expr)

    def test_every_uuid_of_a_default_is_found_with_its_place_in_the_default(self):
        found = {}
        for path, _, default in self.leaves():
            for sub, ident in fcr.default_ids(default):
                found.setdefault(path + fcr.sub_path(sub), set()).add(ident)
        self.assertEqual(found['concepts.systolicUuid'], {'5085' + 'A' * 32})
        self.assertEqual(found['concepts.noteUuid'], {U1})
        self.assertEqual(found['vitals.encounterTypeUuid'], {U2})
        # the item schema's own default and the id inside the array's default list, at the same place
        self.assertEqual(found['tiles[].concept'], {'1066' + 'A' * 32, '1065' + 'A' * 32})
        # a default map has the id as a key
        self.assertEqual(found['unitsMap.' + '1072' + 'A' * 32], {'1072' + 'A' * 32})
        self.assertNotIn('vitals.viaVariable', found)
        self.assertEqual(fcr.default_ids('Weight'), [])

    def test_a_block_of_statements_is_not_read_as_a_schema(self):
        self.assertEqual(fcr.schema_objects('if(a){b();c={d:1}}'), [])

    def test_kind_comes_from_the_key_name_then_the_schema_type(self):
        for path, kind, expected in (
            ('vitals.encounterTypeUuid', 'UUID', 'encounter_type'),
            ('orderEncounterType', 'UUID', 'encounter_type'),
            ('vitals.clinicianEncounterRole', 'String', 'encounter_role'),
            ('drugOrderTypeUUID', 'UUID', 'order_type'),
            ('formConceptUuid', 'UUID', 'form'),
            ('diagnosisConceptClass', 'UUID', 'concept_class'),
            ('visitAttributeTypes[].uuid', 'UUID', 'visit_attribute_type'),
            ('stockItemCategoryUUID', 'ConceptUuid', 'concept'),
            ('visitDiagnosesConceptUuid', 'ConceptUuid', 'concept'),
            ('valueSets.reasonForPause.uuid', 'UUID', 'unknown'),
        ):
            self.assertEqual(fcr.classify_kind(path, kind), expected, path)
        self.assertEqual(fcr.classify_kind('notesConceptUuids[]', 'Array'), 'concept')

    def test_the_apps_that_save_and_the_keys_written_on_save_are_marked(self):
        self.assertEqual(fcr.saves_flag('@openmrs/esm-patient-vitals-app', 'concepts.pulseUuid'), 'yes: vitals')
        self.assertEqual(fcr.saves_flag('@openmrs/esm-ward-app', 'x'), 'yes: ward')
        self.assertEqual(fcr.saves_flag('@openmrs/esm-patient-chart-app', 'visitDiagnosisConceptUuid'), 'yes: key')
        self.assertEqual(fcr.saves_flag('@openmrs/esm-patient-chart-app', 'tileDefinitions[].columns[].encounterType'), '')
        self.assertEqual(fcr.saves_flag('@openmrs/esm-home-app', 'patientPhotoConceptUuid'), '')

    def test_a_default_is_dropped_only_where_the_site_config_sets_the_key(self):
        app = '@openmrs/x-app'
        site = [{app: {'concepts': {'systolicUuid': U1}, 'unitsMap': {'1072' + 'A' * 32: 5}, 'tiles': [{'other': 1}]}}]

        def row(leaf, sub=(), element=False, parent=None):
            return {'app': app, 'leaf': leaf, 'sub': sub, 'element': element, 'parent_default': parent}

        self.assertFalse(fcr.in_effect(row('concepts.systolicUuid'), site))
        self.assertTrue(fcr.in_effect(row('concepts.noteUuid'), site))  # a sibling key is not set
        self.assertTrue(fcr.in_effect(row('vitals.encounterTypeUuid'), site))
        self.assertTrue(fcr.in_effect(row('unitsMap', ('1073' + 'A' * 32,)), site))  # objects merge
        self.assertFalse(fcr.in_effect(row('unitsMap', ('1072' + 'A' * 32,)), site))
        # an item default applies to the site's items that omit the key
        self.assertTrue(fcr.in_effect(row('tiles[].concept', element=True), site))
        self.assertFalse(fcr.in_effect(row('tiles[].concept', element=True), [{app: {'tiles': [{'concept': U1}]}}]))
        # no list set by the site: only the app's own non-empty list has items
        self.assertFalse(fcr.in_effect(row('tiles[].concept', element=True, parent=[]), []))
        self.assertTrue(fcr.in_effect(row('tiles[].concept', element=True, parent=[{}]), []))

    def test_a_bundle_folder_is_read_and_unread_defaults_are_counted(self):
        with tempfile.TemporaryDirectory() as folder:
            with open(os.path.join(folder, 'a.js'), 'w', encoding='utf-8') as f:
                f.write(BUNDLE + 'x={y:{_type:T.String,_default:`a${b}`},z:(1,{_default:q})}')
            leaves, unread = fcr.read_bundle(folder)
        self.assertIn('concepts.systolicUuid', [p for p, _, _ in leaves])
        self.assertEqual(unread, 1)

    def test_sql_returns_each_default_with_app_and_key_and_only_selects(self):
        row = {'app': '@openmrs/x-app', 'key_path': 'concepts.pulseUuid', 'kind': 'concept', 'id': U1, 'saves': 'yes: vitals'}
        text = fcr.defaults_sql([row, dict(row, kind='unknown', key_path="a'b")])
        self.assertIn("'@openmrs/x-app' AS app, 'concepts.pulseUuid' AS key_path, 'concept' AS kind, '{}' AS ref".format(U1), text)
        self.assertIn("r.kind = 'concept' AND NOT EXISTS (SELECT 1 FROM concept t WHERE t.uuid = r.ref)", text)
        self.assertIn("'a''b'", text)
        self.assertIn('FROM encounter_type', text.replace('SELECT 1 ', ''))
        for forbidden in ('INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE'):
            self.assertNotIn(forbidden, text)
        self.assertEqual(fcr.defaults_sql([]), '')

    def test_the_apps_patched_in_the_repository_are_read_without_unread_defaults(self):
        apps = [a for a in fcr.assembled_apps() if a[2]]
        self.assertTrue(apps)
        for name, _, dist, _ in apps:
            leaves, unread = fcr.read_bundle(dist)
            self.assertEqual(unread, 0, name)



if __name__ == '__main__':
    unittest.main()
