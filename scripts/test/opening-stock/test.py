#!/usr/bin/env python3
"""
Tests scripts/opening-stock.py (#457, #773, #776, #797) on a small made-up count file, and checks that the
product matching (sites/mugamba/requirements/opening-stock-matching.csv) only names stock items
the Liquibase seeds create, so the same matching holds on every server. The server side of apply
(unit check by concept, stock scope check) runs against a fake stockmanagement REST API.

  python3 scripts/test/opening-stock/test.py
"""
import argparse
import contextlib
import csv
import datetime
import glob
import importlib.util
import io
import os
import tempfile
import re
import shutil
import subprocess
import time
import unittest
import uuid as uuid_
import zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
spec = importlib.util.spec_from_file_location('opening_stock', os.path.join(ROOT, 'scripts', 'opening-stock.py'))
os_ = importlib.util.module_from_spec(spec)
spec.loader.exec_module(os_)
LIQUIBASE = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'openmrs', 'initializer_config', 'liquibase')

M = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'


def xlsx(path, rows):
    """A minimal workbook: rows of cell values; str -> shared string, float -> number."""
    strings, sheet = [], []
    for i, row in enumerate(rows, 1):
        cells = []
        for j, v in enumerate(row):
            ref = '%s%d' % ('ABCDEFGH'[j], i)
            if v is None:
                continue
            if isinstance(v, float):
                cells.append('<c r="%s"><v>%s</v></c>' % (ref, v))
            else:
                strings.append(v)
                cells.append('<c r="%s" t="s"><v>%d</v></c>' % (ref, len(strings) - 1))
        sheet.append('<row r="%d">%s</row>' % (i, ''.join(cells)))
    with zipfile.ZipFile(path, 'w') as z:
        z.writestr('xl/workbook.xml', '<workbook xmlns="%s" xmlns:r="%s"><sheets><sheet name="Feuil1" sheetId="1" r:id="rId1"/></sheets></workbook>' % (M, R))
        z.writestr('xl/_rels/workbook.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="x"/></Relationships>')
        z.writestr('xl/sharedStrings.xml', '<sst xmlns="%s">%s</sst>' % (M, ''.join('<si><t>%s</t></si>' % s for s in strings)))
        z.writestr('xl/worksheets/sheet1.xml', '<worksheet xmlns="%s"><sheetData>%s</sheetData></worksheet>' % (M, ''.join(sheet)))


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def serial(d):
    return float((d - datetime.date(1899, 12, 30)).days)


class Plan(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.file = os.path.join(self.dir, 'stock.xlsx')
        later = serial(datetime.date(2028, 1, 31))
        xlsx(self.file, [
            ['N°', 'PRODUIT', 'Forme', 'Dosage', 'N° de Lot', 'Date de peremption', 'Stock', ' Prix Unitaire'],
            ['   Médicaments Hôpital '],
            [1.0, 'PARACETAMOL inj', 'flacon', None, 'LOT-A', later, 193.0, 9500.0],
            [1.0, 'PARACETAMOL  inj', 'flacon', None, 251068.0, serial(datetime.date(2028, 12, 31)), 100.0, 9500.0],
            [2.0, 'ANGINOVAG spray', 'spray', None, 'A1', '31/09/2029', 24.0, 35000.0],
            [3.0, 'CHLORHEXIDINE 1% flacon', 'flacon', None, 'C1', '28/02.2027', 2.0, None],
            [4.0, 'CETIRIZINE sirop', 'flacon', None, 'X1', serial(datetime.date(2026, 1, 6)), 71.0, 3000.0],
            [5.0, 'ACUPAN inj', 'amp', None, None, None, 0.0, 55000.0],
            [6.0, 'NO LOT', 'cp', None, None, later, 5.0, 1.0],
            [7.0, 'NOT MATCHED', 'cp', None, 'N1', later, 5.0, 1.0],
            [8.0, 'TO CONFIRM', 'cp', None, 'T1', later, 5.0, 1.0],
            ['   Laboratoire Hôpital '],
            [1.0, 'LAME', 'Unite', None, None, None, 150.0, 0.0],
        ])
        self.matching = os.path.join(self.dir, 'matching.csv')
        with open(self.matching, 'w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(['row', 'produit', 'forme', 'dosage', 'status', 'stock_item_uuid', 'stock_item', 'stock_item_unit', 'confidence', 'reason'])
            for p, st in [('PARACETAMOL inj', 'import'), ('ANGINOVAG spray', 'import'), ('CHLORHEXIDINE 1% flacon', 'new-item'),
                          ('CETIRIZINE sirop', 'import'), ('NO LOT', 'import'), ('TO CONFIRM', 'confirm')]:
                w.writerow(['', p, '', '', st, 'uuid-' + p, p, 'Flacon', 'high', 'test'])
        lines = os_.file_lines(os_.read_xlsx(self.file))
        self.entries = {(e['line']['produit'].strip(), e['lot']): e
                        for e in os_.plan(lines, os_.load_matching(self.matching), datetime.date(2026, 11, 17))}

    def test_sections_and_zero_stock(self):
        self.assertNotIn(('ACUPAN inj', ''), self.entries)
        self.assertEqual(self.entries[('LAME', '')]['line']['section'], 'Laboratoire Hôpital')
        self.assertEqual(self.entries[('PARACETAMOL inj', 'LOT-A')]['line']['section'], 'Médicaments Hôpital')

    def test_two_batches_of_one_item(self):
        a, b = self.entries[('PARACETAMOL inj', 'LOT-A')], self.entries[('PARACETAMOL  inj', '251068')]
        self.assertTrue(a['entered'] and b['entered'])
        self.assertEqual(a['match']['stock_item_uuid'], b['match']['stock_item_uuid'])
        self.assertEqual((a['qty'], a['expiry']), (193, datetime.date(2028, 1, 31)))

    def test_impossible_and_mistyped_dates(self):
        a = self.entries[('ANGINOVAG spray', 'A1')]
        self.assertEqual(a['expiry'], datetime.date(2029, 9, 30))
        self.assertTrue(a['entered'] and a['date_note'])
        c = self.entries[('CHLORHEXIDINE 1% flacon', 'C1')]
        self.assertEqual(c['expiry'], datetime.date(2027, 2, 28))
        self.assertTrue(c['entered'] and c['date_note'])

    def test_left_out(self):
        self.assertIn('expired', self.entries[('CETIRIZINE sirop', 'X1')]['note'])
        self.assertEqual(self.entries[('NO LOT', '')]['note'], 'no lot number')
        self.assertTrue(self.entries[('NOT MATCHED', 'N1')]['note'].startswith('unmatched'))
        self.assertTrue(self.entries[('TO CONFIRM', 'T1')]['note'].startswith('confirm'))
        self.assertFalse(any(self.entries[k]['entered'] for k in
                             [('CETIRIZINE sirop', 'X1'), ('NO LOT', ''), ('NOT MATCHED', 'N1'), ('TO CONFIRM', 'T1'), ('LAME', '')]))

    def test_parse_expiry(self):
        self.assertEqual(os_.parse_expiry('2027-01-31 00:00:00')[0], datetime.date(2027, 1, 31))
        self.assertEqual(os_.parse_expiry('15/03/2028'), (datetime.date(2028, 3, 15), ''))
        self.assertIsNone(os_.parse_expiry('soon')[0])
        self.assertIsNone(os_.parse_expiry('')[0])


class Matching(unittest.TestCase):
    """The repository's matching names only stock items the Liquibase seeds create."""

    def test_stock_items_are_seeded(self):
        seeds = ''.join(read(f) for f in glob.glob(os.path.join(LIQUIBASE, 'sql', '*.sql')))
        new_items = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_opening_stock.sql'))
        with open(os_.DEFAULT_MATCHING, newline='', encoding='utf-8') as f:
            rows = list(csv.DictReader(f))
        self.assertTrue(rows)
        os_.load_matching(os_.DEFAULT_MATCHING)  # one stock item per product
        for r in rows:
            self.assertIn(r['status'], ('import', 'new-item', 'confirm', 'excluded', 'unmatched'), r['produit'])
            self.assertTrue(r['reason'] or r['status'] == 'import', r['produit'])
            if r['status'] in os_.ENTERED:
                self.assertIn(r['stock_item_uuid'], seeds, r['produit'])
            if r['status'] == 'new-item':
                self.assertIn(r['stock_item_uuid'], new_items, r['produit'])


class AnsweredLines(unittest.TestCase):
    """#773: the four lines the product owner answered on 18 Nov 2026 are entered, as on production."""

    ANSWERS = {
        'AMOXICILLINE sirop 250 mg': ('e217acfc-3811-59a4-be77-815167af5e4d', 'Amoxicillin Suspension 250mg/5ml 100ml', 'Flacon'),
        'DIPYRONE 500 mg inj': ('dfc5c05b-f5b9-5278-84c7-b26fdcf04dfc', 'Dipyrone Injection 1g/2ml', 'Ampoule(s)'),
        'IBUPROFEN sirop 100 mg': ('e1abef4d-5486-51b2-b957-10a5ea7c9ac6', 'Ibuprofen Suspension 100mg/5ml 100ml', 'Flacon'),
        'LIGNOCAÏNE': ('ce43e252-73be-538f-907b-f62d7b009152', 'Lidocaïne Injectable 2%', 'Flacon'),
    }

    def test_planned_as_entered(self):
        d = tempfile.mkdtemp()
        path = os.path.join(d, 'stock.xlsx')
        later = serial(datetime.date(2028, 5, 31))
        xlsx(path, [['N°', 'PRODUIT', 'Forme', 'Dosage', 'N° de Lot', 'Date de peremption', 'Stock', 'Prix Unitaire']]
             + [[float(i), p, None, None, 'L%d' % i, later, 10.0, 1.0] for i, p in enumerate(self.ANSWERS, 1)])
        entries = os_.plan(os_.file_lines(os_.read_xlsx(path)), os_.load_matching(os_.DEFAULT_MATCHING),
                           datetime.date(2026, 11, 18))
        self.assertEqual(len(entries), 4)
        for e in entries:
            m = e['match']
            self.assertTrue(e['entered'], e['note'])
            self.assertEqual((m['stock_item_uuid'], m['stock_item'], m['stock_item_unit']), self.ANSWERS[e['line']['produit']])
            self.assertEqual((m['status'], m['confidence']), ('import', 'high'))
            self.assertTrue(m['reason'].startswith('product owner, 18 Nov 2026'), m['reason'])


class AnsweredLines776(unittest.TestCase):
    """#776: the seven lines the product owner answered on 18 Nov 2026 are entered, from the repository's
    matching, and the corrected expiry replaces the file's date for the one line it names."""

    ANSWERS = {
        # produit: (stock item uuid, stock item, unit, lot, expiry of the file, expected expiry, quantity)
        'ANAMOL sp': ('d9738e95-bc17-5ff5-8353-d1394ea6895e', 'Anamol Sirop', 'Flacon', '5814791B', datetime.date(2028, 5, 31), None, 21),
        'A-CERUMEN': ('52771744-0938-581c-8eec-d0c282ac42d2', 'A-Cerumen Gouttes Auriculaires', 'Flacon', 'A24c515', datetime.date(2027, 10, 31), None, 125),
        'CETIRIZINE sirop': ('e7d2802a-f441-5279-931e-9f99c3e46e49', 'Cetirizine Sirop 10mg/ml', 'Flacon', '89537', datetime.date(2026, 1, 6), datetime.date(2028, 4, 30), 71),
        'CIMETIDINE 200 mg inj': ('c8b8d121-716e-5652-adf7-c5a56d6ec6eb', 'Cimetidine Injection 200mg/2ml', 'Ampoule(s)', '251283', datetime.date(2028, 12, 31), None, 98),
        'MIDAZOLAM inj': ('5dc5f1d7-6916-52d6-8d31-4b99633ee356', 'Midazolam Injection 5mg/ml', 'Ampoule(s)', '0060301254', datetime.date(2028, 1, 31), None, 5),
        'VIT K inj': ('37ff9e44-0689-559b-a9e1-53c4367dc894', 'Injection de Vitamine K 10mg', 'Ampoule(s)', 'OOPPHYIE001', datetime.date(2028, 1, 31), None, 51),
        'Gants non stériles': ('09a8a405-e566-5f89-b7b3-483cc4e9e896', 'Gants Non Stériles', 'Pièce', '21404539LPZA', datetime.date(2031, 3, 31), None, 5540),
    }
    ROWS = {'ANAMOL sp': 19, 'A-CERUMEN': 50, 'CETIRIZINE sirop': 60, 'CIMETIDINE 200 mg inj': 67, 'MIDAZOLAM inj': 190,
            'VIT K inj': 271, 'Gants non stériles': 298}

    def entries(self, matching=None, extra=()):
        d = tempfile.mkdtemp()
        path = os.path.join(d, 'stock.xlsx')
        rows = [['N°', 'PRODUIT', 'Forme', 'Dosage', 'N° de Lot', 'Date de peremption', 'Stock', 'Prix Unitaire']]
        for p, (_, _, _, lot, exp, _, qty) in self.ANSWERS.items():
            rows.append([1.0, p, None, None, lot, serial(exp), float(qty), 1.0])
        xlsx(path, rows + list(extra))
        file = os_.file_lines(os_.read_xlsx(path))
        for line, p in zip(file, self.ANSWERS):
            line['row'] = self.ROWS[p]  # the worksheet row the real count file has them on
        return os_.plan(file, os_.load_matching(matching or os_.DEFAULT_MATCHING), datetime.date(2026, 11, 18))

    def test_planned_as_entered(self):
        entries = self.entries()
        self.assertEqual(len(entries), 7)
        for e in entries:
            uuid, name, unit, lot, _, corrected, qty = self.ANSWERS[e['line']['produit']]
            m = e['match']
            self.assertTrue(e['entered'], (e['line']['produit'], e['note']))
            self.assertEqual((m['stock_item_uuid'], m['stock_item'], m['stock_item_unit']), (uuid, name, unit))
            self.assertEqual((m['status'], m['confidence']), ('import', 'high'))
            self.assertTrue(m['reason'].startswith('product owner, 18 Nov 2026'), m['reason'])
            self.assertEqual((e['lot'], e['qty']), (lot, qty))
            self.assertEqual(bool(e['date_note']), corrected is not None, e['line']['produit'])

    def test_expiry_corrected_from_the_matching(self):
        e = next(e for e in self.entries() if e['line']['produit'] == 'CETIRIZINE sirop')
        self.assertEqual(e['expiry'], datetime.date(2028, 4, 30))
        self.assertIn('expiry corrected by the product owner', e['date_note'])
        self.assertIn('06/01/2026', e['date_note'])  # what the file had
        self.assertIn('30/04/2028', e['date_note'])
        out = io.StringIO()
        os_.report([e], out)
        self.assertIn('Expiry dates corrected (1)', out.getvalue())

    def test_without_the_correction_the_line_is_expired(self):
        d = tempfile.mkdtemp()
        matching = os.path.join(d, 'matching.csv')
        with open(os_.DEFAULT_MATCHING, newline='', encoding='utf-8') as f, open(matching, 'w', newline='', encoding='utf-8') as g:
            rows = list(csv.DictReader(f))
            w = csv.DictWriter(g, fieldnames=list(rows[0].keys()), lineterminator='\n')
            w.writeheader()
            for r in rows:
                r['expiry'] = ''
                w.writerow(r)
        e = next(e for e in self.entries(matching) if e['line']['produit'] == 'CETIRIZINE sirop')
        self.assertFalse(e['entered'])
        self.assertIn('expired 06/01/2026', e['note'])

    def test_correction_names_its_line(self):
        """A matching row with a row number corrects that line of the file only; without one, every line."""
        m = {'row': '60', 'expiry': '2028-04-30'}
        self.assertEqual(os_.matching_expiry(m, {'row': 60}), datetime.date(2028, 4, 30))
        self.assertIsNone(os_.matching_expiry(m, {'row': 61}))
        self.assertEqual(os_.matching_expiry({'row': '', 'expiry': '2028-04-30'}, {'row': 61}), datetime.date(2028, 4, 30))
        self.assertIsNone(os_.matching_expiry({'row': '60', 'expiry': ''}, {'row': 60}))
        self.assertIsNone(os_.matching_expiry({'row': '60'}, {'row': 60}))  # a row of a file without the column

    def test_correction_must_be_an_iso_date(self):
        d = tempfile.mkdtemp()
        matching = os.path.join(d, 'matching.csv')
        with open(matching, 'w', newline='', encoding='utf-8') as f:
            f.write('row,produit,forme,dosage,status,stock_item_uuid,stock_item,stock_item_unit,confidence,reason,expiry\n'
                    '60,X,,,import,u,X,Flacon,high,test,30/04/2028\n')
        with self.assertRaises(SystemExit) as e:
            os_.load_matching(matching)
        self.assertIn('not an ISO date', str(e.exception))

    def test_matching_rows_without_the_column_still_load(self):
        d = tempfile.mkdtemp()
        matching = os.path.join(d, 'matching.csv')
        with open(matching, 'w', newline='', encoding='utf-8') as f:
            f.write('row,produit,forme,dosage,status,stock_item_uuid,stock_item,stock_item_unit,confidence,reason\n'
                    '60,X,,,import,u,X,Flacon,high,test\n')
        self.assertIn('x', os_.load_matching(matching))


class AnsweredSeeds776(unittest.TestCase):
    """#776: the two new items, the two unit changes and the two new drugs fit together."""

    NEW = {'A-Cerumen Gouttes Auriculaires': ('e9638191-c538-5b6e-9dbe-0d3d4bbf1721', '52771744-0938-581c-8eec-d0c282ac42d2', '04144d11-cfed-4930-8ffc-f1b8be92440b'),
           'Midazolam Injection 5mg/ml': ('76dfeba4-e78a-5c6d-9bac-4c2c2ade50a0', '5dc5f1d7-6916-52d6-8d31-4b99633ee356', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2')}
    UNITS = {'d9738e95-bc17-5ff5-8353-d1394ea6895e': '04144d11-cfed-4930-8ffc-f1b8be92440b',   # Anamol Sirop -> Flacon
             'c8b8d121-716e-5652-adf7-c5a56d6ec6eb': 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2'}  # Cimetidine -> Ampoule
    INIT = os.path.join(LIQUIBASE, '..')

    def test_new_drugs_in_openmrs_and_odoo(self):
        with open(os.path.join(self.INIT, 'drugs', 'uvl-drugs-issue776.csv'), newline='', encoding='utf-8') as f:
            drugs = {r['Name']: r for r in csv.DictReader(f)}
        odoo = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'odoo', 'initializer_config', 'product_variant', 'uvl-drugs-issue776.csv')
        with open(odoo, newline='', encoding='utf-8') as f:
            products = {r['name']: r for r in csv.DictReader(f)}
        self.assertEqual(set(drugs), set(self.NEW))
        self.assertEqual(set(products), set(self.NEW))
        for name, (drug, _, unit) in self.NEW.items():
            self.assertEqual((drugs[name]['Uuid'], drugs[name]['Concept Dosage Form'], drugs[name]['Name:fr']), (drug, unit, name))
            self.assertEqual((products[name]['id'], products[name]['uom_id/id']), ('init.' + drug, 'init.' + unit))
        self.assertEqual(drugs['Midazolam Injection 5mg/ml']['Concept Drug'], '79853AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')  # CIEL Midazolam

    def test_new_drug_concepts_are_in_the_ocl_export(self):
        """The drugs load only if their concepts come with an OCL export in the repository (a drugs CSV that
        fails its first load keeps its checksum)."""
        import json
        path = os.path.join(self.INIT, 'ocl', 'UVL_drugs_776_20261118.zip')
        with zipfile.ZipFile(path) as z:
            concepts = {c['external_id']: c for c in json.load(z.open('export.json'))['concepts']}
        with open(os.path.join(self.INIT, 'drugs', 'uvl-drugs-issue776.csv'), newline='', encoding='utf-8') as f:
            for r in csv.DictReader(f):
                c = concepts[r['Concept Drug']]
                self.assertEqual((c['concept_class'], c['datatype'], c['retired']), ('Drug', 'N/A', False), r['Name'])
        self.assertEqual(concepts['79853AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA']['source'], 'uvl-ciel')
        self.assertEqual(concepts['f837d2dc-144d-533c-9bbf-6ca637b2ae83']['source'], 'uvl-custom')

    def test_new_stock_items_and_their_changeset(self):
        seed = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_opening_stock_answered.sql'))
        rollback = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_opening_stock_answered_rollback.sql'))
        changelog = read(os.path.join(LIQUIBASE, 'liquibase.xml'))
        start = changelog.index('id="add_stock_items_opening_stock_answered-20261118"')
        changeset = changelog[start:changelog.index('</changeSet>', start)]
        for name, (drug, item_uuid, unit) in self.NEW.items():
            self.assertIn("'%s', '%s', 1, '%s'" % (drug, unit, item_uuid), seed)
            self.assertIn("'%s'" % name, seed)
            self.assertIn(item_uuid, rollback)
            self.assertIn(drug, changeset)  # waits for the drug
        self.assertIn('expectedResult="2"', changeset)
        self.assertIn('stock_items_opening_stock_answered_rollback.sql', changeset)

    def test_unit_changes_are_for_existing_items_and_guarded(self):
        seed = read(os.path.join(LIQUIBASE, 'sql', 'stock_item_units_opening_stock.sql'))
        rollback = read(os.path.join(LIQUIBASE, 'sql', 'stock_item_units_opening_stock_rollback.sql'))
        items = read(os.path.join(LIQUIBASE, 'sql', 'stock_items.sql'))
        changelog = read(os.path.join(LIQUIBASE, 'liquibase.xml'))
        start = changelog.index('id="stock_item_units_opening_stock-20261118"')
        changeset = changelog[start:changelog.index('</changeSet>', start)]
        for item_uuid, unit in self.UNITS.items():
            self.assertIn(item_uuid, items)  # created by #437
            row = next(l for l in seed.splitlines() if l.lstrip().startswith("('%s'" % item_uuid))
            self.assertIn("'%s'" % unit, row.split(',')[2])  # the unit_uuid column
            self.assertIn(item_uuid, rollback)
            self.assertIn(item_uuid, changeset)
        # not while the items hold stock: a count in millilitres would be re-read in bottles
        self.assertIn('stockmgmt_stock_batch', changeset)
        self.assertIn('stockmgmt_stock_item_transaction', changeset)
        self.assertEqual(changeset.count('expectedResult="0"'), 2)
        # a packaging unit that something refers to is never rewritten in place
        self.assertIn('NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction', seed)


class AnsweredLines797(unittest.TestCase):
    """#797: the two lines the product owner answered on 19 Nov 2026 from the boxes. Carbamazepine is a new
    200 mg tablet (drug, Odoo product, stock item); Dicytam is the existing 500 mg tablet. Both keep the
    expiry of the count file."""

    DRUG, ITEM, UNIT = 'a4e0ea16-0744-5fb7-871a-e3674ab87895', '2a3155b3-f014-5f3f-bc51-a5fb11755eb9', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9'
    NAME = 'Carbamazepine Comprimé 200mg'
    ANSWERS = {
        # produit: (worksheet row, stock item uuid, stock item, lot, expiry of the file, quantity)
        'CARBAMAZEPINE cp': (52, ITEM, NAME, '5815145A', datetime.date(2028, 9, 30), 330),
        'DICYTAM gel': (108, '74cf1542-770f-58df-b93a-311e9386993c', 'Dicytam Comprimé 500mg', 'EYT-102501', datetime.date(2028, 9, 30), 2000),
    }
    INIT = os.path.join(LIQUIBASE, '..')

    def test_planned_as_entered_with_the_expiry_of_the_file(self):
        d = tempfile.mkdtemp()
        path = os.path.join(d, 'stock.xlsx')
        rows = [['N°', 'PRODUIT', 'Forme', 'Dosage', 'N° de Lot', 'Date de peremption', 'Stock', 'Prix Unitaire']]
        for p, (_, _, _, lot, exp, qty) in self.ANSWERS.items():
            rows.append([1.0, p, None, None, lot, serial(exp), float(qty), 1.0])
        xlsx(path, rows)
        file = os_.file_lines(os_.read_xlsx(path))
        for line, p in zip(file, self.ANSWERS):
            line['row'] = self.ANSWERS[p][0]
        entries = os_.plan(file, os_.load_matching(os_.DEFAULT_MATCHING), datetime.date(2026, 11, 19))
        self.assertEqual(len(entries), 2)
        for e in entries:
            row, uuid, name, lot, exp, qty = self.ANSWERS[e['line']['produit']]
            m = e['match']
            self.assertTrue(e['entered'], (e['line']['produit'], e['note']))
            self.assertEqual((m['row'], m['stock_item_uuid'], m['stock_item'], m['stock_item_unit']), (str(row), uuid, name, 'Comprimé'))
            self.assertEqual((m['status'], m['confidence'], m.get('expiry') or ''), ('import', 'high', ''))  # no override
            self.assertTrue(m['reason'].startswith('product owner, 19 Nov 2026'), m['reason'])
            self.assertEqual((e['lot'], e['qty'], e['expiry'], e['date_note']), (lot, qty, exp, ''))

    def test_dicytam_is_the_existing_tablet_item(self):
        seed = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_catalogue_alignment.sql'))
        self.assertIn("'75264f61-a28e-4670-aa0c-1fdaf148207e', '%s', 1, '74cf1542-770f-58df-b93a-311e9386993c'" % self.UNIT, seed)

    def test_new_drug_follows_the_400mg_one_in_openmrs_and_odoo(self):
        with open(os.path.join(self.INIT, 'drugs', 'uvl-drugs-issue797.csv'), newline='', encoding='utf-8') as f:
            new = list(csv.DictReader(f))
        with open(os.path.join(self.INIT, 'drugs', 'uvl-drugs.csv'), newline='', encoding='utf-8') as f:
            old = next(r for r in csv.DictReader(f) if r['Name:fr'] == 'Carbamazepine Comprimé 400mg')
        self.assertEqual(len(new), 1)
        self.assertEqual(new[0], dict(old, Uuid=self.DRUG, Strength='200mg', Name='Carbamazepine 200mg Tablet', **{'Name:fr': self.NAME}))
        odoo = os.path.join(ROOT, 'sites', 'mugamba', 'configs', 'odoo', 'initializer_config', 'product_variant', 'uvl-drugs.csv')
        with open(odoo, newline='', encoding='utf-8') as f:
            products = {r['name']: r for r in csv.DictReader(f)}
        self.assertEqual(products[self.NAME], dict(products['Carbamazepine Comprimé 400mg'], id='init.' + self.DRUG, name=self.NAME))
        self.assertNotIn('lst_price', products[self.NAME])  # Finance enters the price in Odoo

    def test_its_concept_is_in_an_ocl_export(self):
        """No new concept: the drug loads only if the Carbamazepine concept comes with an OCL export in the
        repository (a drugs CSV that fails its first load keeps its checksum)."""
        import json
        with open(os.path.join(self.INIT, 'drugs', 'uvl-drugs-issue797.csv'), newline='', encoding='utf-8') as f:
            concept = next(csv.DictReader(f))['Concept Drug']
        found = []
        for path in glob.glob(os.path.join(self.INIT, 'ocl', '*.zip')):
            with zipfile.ZipFile(path) as z:
                found += [c for c in json.load(z.open('export.json'))['concepts'] if c['external_id'] == concept]
        self.assertTrue(found)
        for c in found:
            self.assertEqual((c['concept_class'], c['retired']), ('Drug', False))
            self.assertIn('Carbamazepine', [n['name'] for n in c['names']])

    def test_stock_item_and_its_changeset(self):
        seed = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_carbamazepine_200mg.sql'))
        rollback = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_carbamazepine_200mg_rollback.sql'))
        changelog = read(os.path.join(LIQUIBASE, 'liquibase.xml'))
        self.assertEqual(changelog.count('id="add_stock_item_carbamazepine_200mg-20261119"'), 1)
        start = changelog.index('id="add_stock_item_carbamazepine_200mg-20261119"')
        changeset = changelog[start:changelog.index('</changeSet>', start)]
        self.assertIn("'%s', '%s', 1, '%s'" % (self.DRUG, self.UNIT, self.ITEM), seed)
        self.assertIn("'%s'" % self.NAME, seed)
        self.assertIn(self.ITEM, rollback)
        self.assertIn(self.DRUG, changeset)  # waits for the drug
        self.assertIn(self.UNIT, changeset)  # and for the Comprimé unit
        self.assertIn('onFail="CONTINUE"', changeset)
        self.assertIn('stock_items_carbamazepine_200mg_rollback.sql', changeset)


class NewItems795(unittest.TestCase):
    """#795: six hand-made Odoo products became real items, each modelled on its sibling. The drug uuids
    are uuid5 (URL namespace) of .../issues/795/drug/<French name>, as in #797."""

    INIT = os.path.join(LIQUIBASE, '..')
    BASE = 'https://github.com/MadiroGlobalHealth/UVL-EMR/issues/795/'
    # French name: (sibling, strength, English name)
    NEW = {
        'Ababacter 300ml': ('Ababacter 125ml', '300ml', 'Ababacter 300ml'),
        'Ataktan Comprimé 50mg': ('Ataktan Comprimé 100mg', '50mg', 'Ataktan 50mg Tablet'),
        'Contam Gélule 500mg': ('Contam Suspension 250mg/ml 60ml', '500mg', 'Contam 500mg Capsule'),
        'Faux Papillon Lunettes +0,50': ('Faux Papillon Lunettes +0.25', '0.50', 'Faux Papillon Glasses +0.50'),
        'Lunettes de lecture +0,50': ('Lunettes de lecture +0,25', '0.50', 'Reading Glasses +0.50'),
        'Lunettes de lecture -0,50': ('Lunettes de lecture -0,25', '-0.50', 'Reading Glasses -0.50'),
    }
    CAPSULE = '94b2f0e7-0885-430f-8733-e2a93f03095d'
    STOCKED = {'Ataktan Comprimé 50mg': '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 'Contam Gélule 500mg': CAPSULE}

    def rows(self, *path):
        with open(os.path.join(self.INIT, *path), newline='', encoding='utf-8') as f:
            return list(csv.DictReader(f))

    def uuid(self, name):
        return str(uuid_.uuid5(uuid_.NAMESPACE_URL, self.BASE + 'drug/' + name))

    def test_drugs_follow_their_sibling_on_its_concept(self):
        new = {r['Name:fr']: r for r in self.rows('drugs', 'uvl-drugs-issue795.csv')}
        old = {r['Name:fr']: r for r in self.rows('drugs', 'uvl-drugs.csv')}
        self.assertEqual(sorted(new), sorted(self.NEW))
        for name, (sibling, strength, english) in self.NEW.items():
            expected = dict(old[sibling], Uuid=self.uuid(name), Strength=strength, Name=english, **{'Name:fr': name})
            if name in self.STOCKED and self.STOCKED[name] == self.CAPSULE:
                expected['Concept Dosage Form'] = self.CAPSULE  # the sibling is a suspension
            self.assertEqual(new[name], expected, name)

    def test_odoo_products_follow_their_sibling_without_a_price(self):
        products = {r['name']: r for r in self.rows('..', '..', 'odoo', 'initializer_config', 'product_variant', 'uvl-drugs.csv')}
        for name, (sibling, _, _) in self.NEW.items():
            expected = dict(products[sibling], id='init.' + self.uuid(name), name=name)
            if name in self.STOCKED and self.STOCKED[name] == self.CAPSULE:
                expected.update({'uom_id/id': 'init.' + self.CAPSULE, 'uom_po_id/id': 'init.' + self.CAPSULE})
            self.assertEqual(products[name], expected, name)
            self.assertNotIn('lst_price', products[name])  # Finance enters the price in Odoo

    def test_stock_items_only_where_the_sibling_has_one(self):
        seed = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_795.sql'))
        rollback = read(os.path.join(LIQUIBASE, 'sql', 'stock_items_795_rollback.sql'))
        changelog = read(os.path.join(LIQUIBASE, 'liquibase.xml'))
        self.assertEqual(changelog.count('id="add_stock_items_795-20261120b"'), 1)
        start = changelog.index('id="add_stock_items_795-20261120b"')
        changeset = changelog[start:changelog.index('</changeSet>', start)]
        self.assertEqual(seed.count("', 1, '"), len(self.STOCKED))
        for name, unit in self.STOCKED.items():
            drug = self.uuid(name)
            item = str(uuid_.uuid5(uuid_.NAMESPACE_URL, self.BASE + 'stock-item/' + drug))
            pack = str(uuid_.uuid5(uuid_.NAMESPACE_URL, self.BASE + 'stock-item-packaging-uom/' + drug))
            self.assertIn("('%s', '%s', 1, '%s', '%s', '%s')" % (drug, unit, item, pack, name), seed)
            self.assertIn(item, rollback)
            self.assertIn(drug, changeset)
        self.assertIn('onFail="CONTINUE"', changeset)
        self.assertIn('stock_items_795_rollback.sql', changeset)

    def test_seed_inserts_the_stock_items(self):
        """The first version of the seed (UAT build b50-four) kept its temp table, the packaging unit INSERT
        and the UPDATE but lost the INSERT into stockmgmt_stock_item, so it created nothing and the changeset
        still ran EXECUTED. test_stock_items_and_their_changeset only looked for the seed's values and the
        uuids in the rollback, never for the statements that write the items: this one checks them, and
        the MariaDB test below runs them."""
        seed = re.sub(r'--[^\n]*', '', read(os.path.join(LIQUIBASE, 'sql', 'stock_items_795.sql')))
        statements = [' '.join(x.split()) for x in seed.split(';') if x.strip()]
        kinds = [x.split(' (')[0].split(' SELECT')[0].split(' SET')[0] for x in statements]
        self.assertEqual(kinds, ['CREATE TEMPORARY TABLE uvl_stock_item_seed',
                                 'INSERT INTO uvl_stock_item_seed',
                                 'INSERT INTO stockmgmt_stock_item',
                                 'INSERT INTO stockmgmt_stock_item_packaging_uom',
                                 'UPDATE stockmgmt_stock_item si JOIN uvl_stock_item_seed s ON s.stock_item_uuid = si.uuid JOIN stockmgmt_stock_item_packaging_uom p ON p.uuid = s.packaging_uom_uuid',
                                 'DROP TEMPORARY TABLE uvl_stock_item_seed'])


    def test_concepts_are_in_an_ocl_export(self):
        import json
        wanted = {r['Concept Drug'] for r in self.rows('drugs', 'uvl-drugs-issue795.csv')}
        found = set()
        for path in glob.glob(os.path.join(self.INIT, 'ocl', '*.zip')):
            with zipfile.ZipFile(path) as z:
                found |= {c['external_id'] for c in json.load(z.open('export.json'))['concepts'] if not c['retired']}
        self.assertEqual(wanted - found, set())


@unittest.skipUnless(shutil.which('docker'), 'needs docker for a throwaway MariaDB')
class SeedOnMariaDB795(unittest.TestCase):
    """Runs the seed and its rollback (comments stripped, as Liquibase does) on a MariaDB with only the
    tables they touch: the two items are created with their unit, a second run changes nothing, a server
    where the first (empty) version ran gets the items too, and the rollback removes only unused items."""

    IMAGE = 'mariadb:10.11'
    SCHEMA = """
    CREATE TABLE concept (concept_id INT AUTO_INCREMENT PRIMARY KEY, uuid CHAR(38) NOT NULL);
    CREATE TABLE drug (drug_id INT AUTO_INCREMENT PRIMARY KEY, concept_id INT NOT NULL, uuid CHAR(38) NOT NULL);
    CREATE TABLE stockmgmt_stock_item (stock_item_id INT AUTO_INCREMENT PRIMARY KEY, drug_id INT, concept_id INT,
      item_type INT, is_drug TINYINT(1), has_expiration TINYINT(1), dispensing_unit_id INT, common_name VARCHAR(255),
      dispensing_unit_packaging_uom_id INT NULL, default_stock_operations_uom_id INT NULL,
      creator INT, date_created DATETIME, voided TINYINT(1), uuid CHAR(38) NOT NULL);
    CREATE TABLE stockmgmt_stock_item_packaging_uom (stock_item_packaging_uom_id INT AUTO_INCREMENT PRIMARY KEY,
      stock_item_id INT, packaging_uom_id INT, factor DOUBLE, creator INT, date_created DATETIME, voided TINYINT(1),
      uuid CHAR(38) NOT NULL);
    CREATE TABLE stockmgmt_stock_batch (stock_batch_id INT AUTO_INCREMENT PRIMARY KEY, stock_item_id INT);
    CREATE TABLE stockmgmt_stock_item_transaction (stock_item_transaction_id INT AUTO_INCREMENT PRIMARY KEY, stock_item_id INT);
    """
    DRUGS = {'e19e9f80-b35b-592f-9e93-d29f9771c04b': 'Ataktan Comprimé 50mg', 'f9a6bad8-25ad-5156-871c-a5d789bc78c3': 'Contam Gélule 500mg'}
    ITEMS = ('92731684-2c74-5f9a-a413-be8748ef6366', '78526bee-df0a-5d70-830e-1370c37055f9')
    UNITS = ('391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', '94b2f0e7-0885-430f-8733-e2a93f03095d')

    @classmethod
    def setUpClass(cls):
        cls.name = 'uvl795-mariadb-%d' % os.getpid()
        out = subprocess.run(['docker', 'run', '-d', '--rm', '--name', cls.name, '-e', 'MARIADB_ROOT_PASSWORD=t', '-e', 'MARIADB_DATABASE=t', cls.IMAGE],
                             capture_output=True, text=True)
        if out.returncode:
            raise unittest.SkipTest('cannot start ' + cls.IMAGE + ': ' + out.stderr.strip()[:200])
        for _ in range(90):
            if subprocess.run(['docker', 'exec', cls.name, 'mariadb', '-uroot', '-pt', '-e', 'SELECT 1'], capture_output=True).returncode == 0:
                return
            time.sleep(1)
        cls.tearDownClass()
        raise unittest.SkipTest('MariaDB did not start')

    @classmethod
    def tearDownClass(cls):
        subprocess.run(['docker', 'rm', '-f', cls.name], capture_output=True)

    def sql(self, text, query=False):
        out = subprocess.run(['docker', 'exec', '-i', self.name, 'mariadb', '-uroot', '-pt', 't', '--default-character-set=utf8mb4', '-N', '-B'],
                             input=text.encode('utf-8'), capture_output=True)
        self.assertEqual(out.returncode, 0, out.stderr.decode())
        return [tuple(l.split('\t')) for l in out.stdout.decode().splitlines()]

    def file(self, name):
        return re.sub(r'--[^\n]*', '', read(os.path.join(LIQUIBASE, 'sql', name)))

    def setUp(self):
        self.sql('DROP TABLE IF EXISTS concept, drug, stockmgmt_stock_item, stockmgmt_stock_item_packaging_uom, '
                 'stockmgmt_stock_batch, stockmgmt_stock_item_transaction;' + self.SCHEMA)
        self.sql("INSERT INTO concept (uuid) VALUES %s;" % ','.join("('%s')" % u for u in self.UNITS)
                 + "".join("INSERT INTO concept (uuid) VALUES ('c-%s'); INSERT INTO drug (concept_id, uuid) VALUES (LAST_INSERT_ID(), '%s');" % (d[:8], d) for d in self.DRUGS))

    def state(self):
        return self.sql("SELECT si.uuid, d.uuid, si.common_name, c.uuid, si.has_expiration, p.uuid, p.factor, "
                        "si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id, si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id "
                        "FROM stockmgmt_stock_item si JOIN drug d ON d.drug_id = si.drug_id JOIN concept c ON c.concept_id = si.dispensing_unit_id "
                        "LEFT JOIN stockmgmt_stock_item_packaging_uom p ON p.stock_item_id = si.stock_item_id ORDER BY si.uuid")

    def test_creates_the_two_items_once(self):
        self.assertEqual(self.state(), [])
        self.sql(self.file('stock_items_795.sql'))
        first = self.state()
        self.assertEqual([r[0] for r in first], sorted(self.ITEMS))
        by_item = {r[0]: r for r in first}
        for item, drug, unit in zip(self.ITEMS, self.DRUGS, self.UNITS):
            r = by_item[item]
            self.assertEqual((r[1], r[2], r[3], r[4], r[6], r[7], r[8]), (drug, self.DRUGS[drug], unit, '1', '1', '1', '1'))
        self.sql(self.file('stock_items_795.sql'))
        self.assertEqual(self.state(), first)  # a second run changes nothing
        self.assertEqual(self.sql('SELECT COUNT(*) FROM stockmgmt_stock_item'), [('2',)])

    def test_a_server_that_ran_the_empty_version_gets_the_items(self):
        """What the first version left on UAT: no item, hence no packaging unit (its INSERT joins the items)."""
        broken = ''.join(x for x in re.split(r'(?<=;)', self.file('stock_items_795.sql')) if 'INSERT INTO stockmgmt_stock_item (' not in x)
        self.sql(broken)
        self.assertEqual(self.state(), [])
        self.sql(self.file('stock_items_795.sql'))
        self.assertEqual(len(self.state()), 2)

    def test_rollback_removes_unused_items_only(self):
        self.sql(self.file('stock_items_795.sql'))
        self.sql("INSERT INTO stockmgmt_stock_batch (stock_item_id) SELECT stock_item_id FROM stockmgmt_stock_item WHERE uuid = '%s'" % self.ITEMS[1])
        self.sql(self.file('stock_items_795_rollback.sql'))
        self.assertEqual([r[0] for r in self.state()], [self.ITEMS[1]])  # the one with a batch stays

class FakeServer:
    """The stockmanagement REST calls apply makes, with one stock location and its stock items."""

    LOCATION = 'loc-rx'

    def __init__(self, items, scopes, concepts, created=None):
        self.items, self.scopes, self.concepts = items, scopes, concepts
        self.created = created if created is not None else {'uuid': 'op-1', 'operationNumber': 'IST-1'}
        self.posts, self.concept_reads = [], []

    def get(self, path, **params):
        if path == '/session':
            return {'authenticated': True, 'user': {'uuid': 'user-1', 'username': 'pharmacist'}}
        if path == '/stockmanagement/session':
            return {'privileges': self.scopes}
        if path.startswith('/concept/'):
            uuid = path.split('/')[-1]
            self.concept_reads.append(uuid)
            return {'uuid': uuid, 'names': [{'name': n, 'locale': l} for l, n in self.concepts[uuid]]}
        raise AssertionError(path)

    def all(self, path, **params):
        if path == '/stockmanagement/party':
            return [{'uuid': 'party-rx', 'name': 'Pharmacie (Rx)', 'locationUuid': self.LOCATION}]
        if path == '/stockmanagement/stockbatch':
            return []
        if path == '/stockmanagement/stockitem':
            return self.items
        raise AssertionError(path)

    def call(self, method, path, body=None):
        if method == 'POST':
            self.posts.append((path, body))
            return self.created if path == '/stockmanagement/stockoperation' else {}
        return {'status': 'AUTHORIZED', 'operationNumber': 'IST-1'}


def scope(privilege, location=FakeServer.LOCATION, operation_type=os_.OPENING_STOCK_TYPE):
    return {'privilege': privilege, 'operationTypeUuid': operation_type, 'locationUuid': location}


FULL_SCOPE = [scope(os_.MUTATE), scope(os_.APPROVE)]
AMPOULE = 'concept-ampoule'
CONCEPTS = {AMPOULE: [('en', 'Ampule(s)'), ('fr', 'Ampoule(s)')], 'concept-ml': [('en', 'Millilitre'), ('fr', 'Millilitre')]}


def item(uuid, shown, concept):
    return {'uuid': uuid, 'voided': False, 'dispensingUnitUuid': concept, 'dispensingUnitName': shown,
            'dispensingUnitPackagingUoMUuid': 'pu-' + uuid, 'dispensingUnitPackagingUoMName': shown,
            'packagingUnits': [{'uuid': 'pu-' + uuid, 'packagingUomUuid': concept, 'factor': 1}]}


def entry(uuid, unit, lot='L1'):
    return {'entered': True, 'lot': lot, 'qty': 5, 'expiry': datetime.date(2028, 5, 31), 'note': '', 'date_note': '',
            'line': {'row': 1, 'produit': 'DIPYRONE 500 mg inj'},
            'match': {'stock_item_uuid': uuid, 'stock_item_unit': unit}}


def run(server, entries, commit, no_approval=False):
    args = argparse.Namespace(user='pharmacist', location='Pharmacie (Rx)', commit=commit, no_approval=no_approval,
                              operation_date='2026-11-18', remarks='test')
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        os_.apply(args, entries, datetime.date(2026, 11, 18), om=server)
    return out.getvalue()


class Units(unittest.TestCase):
    """#773: the unit is compared by concept, not by the name shown in the account's locale."""

    def test_same_concept_in_another_locale(self):
        server = FakeServer([item('i1', 'Ampule(s)', AMPOULE), item('i2', 'Ampule(s)', AMPOULE)], FULL_SCOPE, CONCEPTS)
        run(server, [entry('i1', 'Ampoule(s)'), entry('i2', 'AMPOULE(S)')], commit=True)
        self.assertEqual(len(server.posts[0][1]['stockOperationItems']), 2)
        self.assertEqual(server.concept_reads, [AMPOULE])  # read once

    def test_accents_and_case_ignored(self):
        units = os_.Units(FakeServer([], [], {'c': [('fr', 'Pièce')]}))
        self.assertIsNone(units.mismatch(item('i', 'Piece', 'c'), 'pièce'))
        self.assertIsNone(units.mismatch(item('i', 'Pièce', 'c'), 'PIECE'))

    def test_different_unit_refused(self):
        server = FakeServer([item('i1', 'Millilitre', 'concept-ml')], FULL_SCOPE, CONCEPTS)
        with self.assertRaises(SystemExit) as e:
            run(server, [entry('i1', 'Flacon')], commit=True)
        self.assertIn("matching says 'Flacon'", str(e.exception))
        self.assertEqual(server.posts, [])

    def test_packaging_unit_concept_first(self):
        i = item('i1', 'Ampule(s)', 'concept-ml')
        i['packagingUnits'][0]['packagingUomUuid'] = AMPOULE
        self.assertEqual(os_.unit_concept(i), AMPOULE)
        del i['packagingUnits']
        self.assertEqual(os_.unit_concept(i), 'concept-ml')


class Scope(unittest.TestCase):
    """#773: no Opening Stock scope at the location stops a commit before anything is created."""

    def items(self):
        return [item('i1', 'Ampoule(s)', AMPOULE)]

    def test_no_scope_stops_commit(self):
        for scopes in ([], [scope(os_.MUTATE, location='elsewhere'), scope(os_.APPROVE, location='elsewhere')],
                       [scope(os_.MUTATE, operation_type='other-type')],
                       [scope('Get Concepts'), scope('App: stockmanagement.stockoperations')]):
            server = FakeServer(self.items(), scopes, CONCEPTS)
            with self.assertRaises(SystemExit) as e:
                run(server, [entry('i1', 'Ampoule(s)')], commit=True)
            self.assertTrue(str(e.exception).startswith('nothing created'), str(e.exception))
            self.assertEqual(server.posts, [])

    def test_approval_needs_approve(self):
        server = FakeServer(self.items(), [scope(os_.MUTATE)], CONCEPTS)
        with self.assertRaises(SystemExit) as e:
            run(server, [entry('i1', 'Ampoule(s)')], commit=True)
        self.assertIn(os_.APPROVE, str(e.exception))
        self.assertNotIn(os_.MUTATE, str(e.exception))
        run(server, [entry('i1', 'Ampoule(s)')], commit=True, no_approval=True)
        self.assertEqual([p for p, _ in server.posts][0], '/stockmanagement/stockoperation')

    def test_dry_run_warns(self):
        server = FakeServer(self.items(), [], CONCEPTS)
        out = run(server, [entry('i1', 'Ampoule(s)')], commit=False)
        self.assertIn('WARNING', out)
        self.assertIn('DRY RUN: 1 lines', out)
        self.assertEqual(server.posts, [])

    def test_with_scope(self):
        server = FakeServer(self.items(), FULL_SCOPE, CONCEPTS)
        out = run(server, [entry('i1', 'Ampoule(s)')], commit=True)
        self.assertNotIn('WARNING', out)
        self.assertEqual([b['name'] for p, b in server.posts[1:]], ['SUBMIT', 'APPROVE'])

    def test_response_without_uuid(self):
        server = FakeServer(self.items(), FULL_SCOPE, CONCEPTS, created={'results': []})
        with self.assertRaises(SystemExit) as e:
            run(server, [entry('i1', 'Ampoule(s)')], commit=True)
        self.assertIn('without a uuid', str(e.exception))
        self.assertIn('OUVERTURE-', str(e.exception))
        self.assertEqual(len(server.posts), 1)  # no SUBMIT on a missing uuid


if __name__ == '__main__':
    unittest.main(verbosity=2)
