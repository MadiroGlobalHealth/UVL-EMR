#!/usr/bin/env python3
"""
Tests scripts/mfp-ceiling.py (#184) on a small made-up workbook shaped like MFP's: an act's
price is its coefficient times its key letter's value, a yellow cell is never loaded, and
the lab section's repeated N° do not matter because lines are referenced by row.

  python3 scripts/test/mfp-ceiling/test.py
"""
import importlib.util
import os
import tempfile
import unittest
import zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
spec = importlib.util.spec_from_file_location('mfp_ceiling', os.path.join(ROOT, 'scripts', 'mfp-ceiling.py'))
mfp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mfp)

M = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
YELLOW = 'Y'  # marks a yellow cell in the rows below


def xlsx(path, sheets):
    """sheets: [(name, rows)]; a cell is a value, or (value, 'Y') for a yellow one."""
    strings = []
    z = zipfile.ZipFile(path, 'w')
    z.writestr('xl/styles.xml',
               '<styleSheet xmlns="%s"><fills count="3"><fill><patternFill patternType="none"/></fill>'
               '<fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid">'
               '<fgColor rgb="FFFFFF00"/></patternFill></fill></fills><cellXfs count="2">'
               '<xf fillId="0"/><xf fillId="2"/></cellXfs></styleSheet>' % M)
    rels, entries = [], []
    for n, (name, rows) in enumerate(sheets, 1):
        xml = []
        for i, row in enumerate(rows, 1):
            cells = []
            for j, v in enumerate(row):
                yellow = isinstance(v, tuple)
                v = v[0] if yellow else v
                if v is None:
                    continue
                strings.append(str(v))
                cells.append('<c r="%s%d" t="s"%s><v>%d</v></c>'
                             % ('ABCDEFG'[j], i, ' s="1"' if yellow else '', len(strings) - 1))
            xml.append('<row r="%d">%s</row>' % (i, ''.join(cells)))
        z.writestr('xl/worksheets/sheet%d.xml' % n,
                   '<worksheet xmlns="%s"><sheetData>%s</sheetData></worksheet>' % (M, ''.join(xml)))
        rels.append('<Relationship Id="r%d" Target="worksheets/sheet%d.xml"/>' % (n, n))
        entries.append('<sheet name="%s" r:id="r%d"/>' % (name, n))
    z.writestr('xl/sharedStrings.xml', '<sst xmlns="%s">%s</sst>'
               % (M, ''.join('<si><t>%s</t></si>' % s for s in strings)))
    z.writestr('xl/_rels/workbook.xml.rels', '<Relationships>%s</Relationships>' % ''.join(rels))
    z.writestr('xl/workbook.xml', '<workbook xmlns="%s" xmlns:r="%s"><sheets>%s</sheets></workbook>'
               % (M, R, ''.join(entries)))
    z.close()


SOURCE = 'Tarifs.pdf, p. 5 (page imprimée 1)'
ACTS = [['N°', 'DENOMINATION', 'COEFFICIENT', 'Lettre', 'Coef', 'Type', 'Source'],
        ['1.12', 'Ponction lombaire', 'K 1', 'K', '1', 'Acte', SOURCE],
        ['7.1.10', 'Curetage apical', ('K 2,5', YELLOW), 'K', '2.5', 'Acte', SOURCE],
        ['1.9', 'Vitesse de sédimentation', 'B 5', 'B', '5', 'Acte', SOURCE]]
ORDINANCE = [['Article', 'Rubrique', 'Libellé', 'Montant (BIF)', 'Source'],
             ['Article 4', 'Valeur des lettres clés', 'K (tout autre acte médical technique)', '1000', 'p. 2'],
             ['Article 4', 'Valeur des lettres clés', 'B (acte médical de Biologie)', '300', 'p. 2'],
             ['Article 5', 'Dans les hôpitaux de District', 'Lit en salle commune / Jour', '2000', 'p. 2']]
DEVICES = [['N°', 'DESIGNATION', 'PRIX 2011', 'TAUX', 'Source'],
           ['2', 'ABAISSE LANGUE EN BOIS', '40', '0.7', 'p. 3 (page imprimée 1 de 17)'],
           ['27', 'ALCOOL DENATURE(1 ml)', ('7/ml', YELLOW), '0.8', 'p. 3'],
           ['70', ('BROCHE SR X S25MM', YELLOW), '1360', '0.7', 'p. 4']]


class MfpCeilingTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.mkdtemp()
        path = os.path.join(cls.tmp, 'mfp.xlsx')
        xlsx(path, [(mfp.ACTS, ACTS), (mfp.ORDINANCE, ORDINANCE), (mfp.DEVICES, DEVICES)])
        cls.book = mfp.read_workbook(path)
        cls.letters = mfp.letter_values(cls.book)

    def line(self, ref):
        return mfp.mfp_line(self.book, ref, self.letters)

    def test_letter_values_come_from_article_4(self):
        self.assertEqual(self.letters, {'K': 1000.0, 'B': 300.0})

    def test_act_price_is_coefficient_times_letter(self):
        line = self.line('A:2')
        self.assertEqual((line['mfp_printed'], line['mfp_price'], line['yellow']), ('K 1', '1000', ''))
        self.assertEqual(line['source'], 'p. 5')
        self.assertEqual(self.line('A:4')['mfp_price'], '1500')

    def test_ordinance_amount_is_the_price(self):
        line = self.line('C:4')
        self.assertEqual(line['mfp_price'], '2000')
        self.assertIn('Lit en salle commune', line['mfp_line'])

    def test_device_price_and_rate(self):
        line = self.line('D:2')
        self.assertEqual((line['mfp_price'], line['mfp_taux'], line['yellow']), ('40', '70', ''))

    def test_yellow_or_unclear_is_never_loaded(self):
        for ref, yellow in [('A:3', 'value'), ('D:3', 'value'), ('D:4', 'name')]:
            row = dict(mfp_ref=ref, confidence='exact', **self.line(ref))
            self.assertEqual(row['yellow'], yellow, ref)
            self.assertEqual(mfp.decide(row), 'yellow value', ref)
        self.assertEqual(self.line('D:3')['mfp_price'], '')  # « 7/ml » is not a price per item

    def test_only_sure_matches_are_loaded(self):
        sure = dict(mfp_ref='A:2', **self.line('A:2'))
        self.assertEqual(mfp.decide(dict(sure, confidence='exact')), 'load')
        self.assertEqual(mfp.decide(dict(sure, confidence='reviewed')), 'load')
        self.assertEqual(mfp.decide(dict(sure, confidence='medium')), 'uncertain match')
        self.assertEqual(mfp.decide({'mfp_ref': '', 'confidence': 'none'}), 'no MFP line')

    def test_committed_matching_names_site_products_once(self):
        rows = mfp.read_csv(mfp.MATCHING)
        known = mfp.products()
        ids = [r['product_id'] for r in rows]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual([i for i in ids if i not in known], [])
        for r in rows:
            if r['decision'] == 'load':
                self.assertIn(r['confidence'], mfp.LOADABLE, r['product'])
                self.assertEqual(r['yellow'], '', r['product'])


if __name__ == '__main__':
    unittest.main()
