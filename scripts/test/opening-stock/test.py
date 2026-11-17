#!/usr/bin/env python3
"""
Tests scripts/opening-stock.py (#457) on a small made-up count file, and checks that the
product matching (sites/mugamba/requirements/opening-stock-matching.csv) only names stock items
the Liquibase seeds create, so the same matching holds on every server.

  python3 scripts/test/opening-stock/test.py
"""
import csv
import datetime
import glob
import importlib.util
import os
import tempfile
import unittest
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


if __name__ == '__main__':
    unittest.main(verbosity=2)
