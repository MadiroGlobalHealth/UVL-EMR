#!/usr/bin/env python3
"""
Tests scripts/form-concept-references.py (#841): which strings count as concept references in the
forms and in the frontend config, and the SQL it prints.

  python3 scripts/test/form-concept-references/test.py
"""
import importlib.util
import json
import os
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


if __name__ == '__main__':
    unittest.main()
