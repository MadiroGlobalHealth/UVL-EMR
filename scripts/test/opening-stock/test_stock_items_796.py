#!/usr/bin/env python3
"""
Checks the stock items of #796 (Aerius Sirop 2.5mg/5ml 60ml, Aerius Comprimé, Desloratadine
Comprimé 5mg): the seed, its rollback and its changeset fit together, the drugs exist in the
drugs CSV, each item is counted in the unit of the Deslova item of the same form, and the
opening-stock matching holds no line for them (their count is still to come from the pharmacy).

  python3 scripts/test/opening-stock/test_stock_items_796.py
"""
import csv
import glob
import os
import re
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
INIT = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'openmrs', 'initializer_config')
LIQUIBASE = os.path.join(INIT, 'liquibase')
MATCHING = os.path.join(ROOT, 'sites', 'mugamba', 'requirements', 'opening-stock-matching.csv')

FLACON = '04144d11-cfed-4930-8ffc-f1b8be92440b'
COMPRIME = '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9'
SIROP = 'bf712910-1c7f-4e72-9d50-6eb5453efcfd'  # dosage form of the syrups, Millilitre as a stock unit

# French name: (drug, stock item, packaging unit, stock unit, dosage form, stock item of the Deslova of that form)
NEW = {'Aerius Sirop 2.5mg/5ml 60ml': ('aa2cc0d6-2c0e-401b-9d77-f68771061a3d', '977a55e6-305a-5055-a743-83200191755e',
                                       '43d1f9c7-3f49-5fcb-b638-6afddee407df', FLACON, SIROP, '953db035-2439-51c0-a17e-ee5eabc7897d'),
       'Aerius Comprimé': ('df92def0-857f-4b6e-ae3f-e20ab0cf5298', '94d5158a-34f0-5927-8f86-87559c76d65e',
                           'eb3363fc-1745-5001-b083-d36c4e0a0641', COMPRIME, COMPRIME, '4d536152-d935-503c-8db5-ffe949d7c6ed'),
       'Desloratadine Comprimé 5mg': ('127fa80c-ff57-48d8-b643-869217524ced', '86019059-2d9b-5c38-ad45-d10ac837f2b0',
                                      'b73331c0-f35e-5873-accd-fb3c045c3518', COMPRIME, COMPRIME, '4d536152-d935-503c-8db5-ffe949d7c6ed')}
SEED = 'stock_items_aerius_desloratadine.sql'
ROLLBACK = 'stock_items_aerius_desloratadine_rollback.sql'
CHANGESET = 'add_stock_items_aerius_desloratadine-20261119'


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def sql(name):
    return read(os.path.join(LIQUIBASE, 'sql', name))


class StockItems796(unittest.TestCase):

    def test_drugs_exist_with_their_form(self):
        with open(os.path.join(INIT, 'drugs', 'uvl-drugs.csv'), newline='', encoding='utf-8') as f:
            drugs = {r['Name:fr']: r for r in csv.DictReader(f)}
        for name, (drug, _, _, _, form, _) in NEW.items():
            self.assertEqual((drugs[name]['Uuid'], drugs[name]['Concept Dosage Form']), (drug, form), name)
            self.assertNotEqual(drugs[name].get('Void/Retire', '').upper(), 'TRUE', name)

    def test_seed_rollback_and_changeset(self):
        seed, rollback = sql(SEED), sql(ROLLBACK)
        changelog = read(os.path.join(LIQUIBASE, 'liquibase.xml'))
        self.assertEqual(changelog.count('id="%s"' % CHANGESET), 1)
        start = changelog.index('id="%s"' % CHANGESET)
        changeset = changelog[start:changelog.index('</changeSet>', start)]
        for name, (drug, item, packaging, unit, _, _) in NEW.items():
            self.assertIn("('%s', '%s', 1, '%s', '%s', '%s')" % (drug, unit, item, packaging, name), seed)
            self.assertIn(item, rollback)
            self.assertIn(drug, changeset)  # waits for the drug
            self.assertIn(unit, changeset)  # and for its unit
        self.assertIn('onFail="CONTINUE"', changeset)
        self.assertIn('expectedResult="3"', changeset)
        self.assertIn(SEED, changeset)
        self.assertIn(ROLLBACK, changeset)
        # an item the pharmacy has used is never removed
        self.assertIn('stockmgmt_stock_batch', rollback)
        self.assertIn('stockmgmt_stock_item_transaction', rollback)

    def test_no_other_seed_names_these_drugs_or_uuids(self):
        for path in glob.glob(os.path.join(LIQUIBASE, 'sql', '*.sql')):
            if os.path.basename(path) in (SEED, ROLLBACK):
                continue
            other = read(path)
            for name, (drug, item, packaging, _, _, _) in NEW.items():
                for uuid in (drug, item, packaging):
                    self.assertNotIn(uuid, other, '%s in %s' % (name, os.path.basename(path)))

    def test_unit_is_the_one_of_the_deslova_item_of_the_same_form(self):
        """The last unit a seed gives the Deslova item: #437 created it, sheet 3 (#455) moved the syrup to Flacon."""
        created = sql('stock_items.sql')
        moved = sql('stock_item_units_sheet3.sql')
        for name, (_, _, _, unit, _, deslova) in NEW.items():
            row = re.search(r"\('[0-9a-f-]{36}', '([0-9a-f-]{36})', 1, '%s'" % deslova, created)
            self.assertTrue(row, name)
            change = re.search(r"\('%s', '[0-9a-f-]{36}', '([0-9a-f-]{36})'" % deslova, moved)
            self.assertEqual((change or row).group(1), unit, name)

    def test_no_opening_stock_line_for_them(self):
        """No quantity, lot or expiry is known yet: the matching must not enter a batch for these items."""
        matching = read(MATCHING)
        for name, (_, item, _, _, _, _) in NEW.items():
            self.assertNotIn(item, matching, name)


if __name__ == '__main__':
    unittest.main()
