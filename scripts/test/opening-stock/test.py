#!/usr/bin/env python3
"""
Tests scripts/opening-stock.py (#457, #773) on a small made-up count file, and checks that the
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
