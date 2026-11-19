#!/usr/bin/env python3
"""
Tests scripts/mfp-ceiling.py (#184) on a small made-up workbook shaped like MFP's: an act's
price is its coefficient times its key letter's value, a yellow cell is never loaded, and
the lab section's repeated N° do not matter because lines are referenced by row. Since the
answers of 18 Nov 2026: the laboratory list as a second source, the product owner's answers
found again from the files that were sent, MFP's own rate on bandages, and a product MFP does
not cover (a row at 0%), which never gets a ceiling. Since 19 Nov 2026: the complete device
list as a source of its own (« N:95 ») and as a second reading of the workbook's lines.

  python3 scripts/test/mfp-ceiling/test.py
"""
import importlib.util
import io
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
                self.assertTrue(mfp.sure(r), r['product'])
                if r['yellow']:  # a doubtful reading is loaded only on the product owner's « oui »
                    self.assertEqual(r['confirmed'], 'yes', r['product'])
                if r['other_ref']:
                    self.assertEqual(r['other_price'], r['mfp_price'], r['product'])
                self.assertTrue(r['mfp_price'].isdigit() and int(r['mfp_price']) > 0, r['product'])
            if r['confirmed']:
                self.assertTrue(r['answer_ref'], r['product'])

    # ---- the laboratory list (18 Nov 2026)

    def lab(self):
        path = os.path.join(self.tmp, 'lab.csv')
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write('code,section,name,price,rate,page,reading,note\n'
                    '6,6 BIOCHIMIE,BIOCHIMIE,,,5,,heading\n'
                    '6.16,6 BIOCHIMIE,Transaminases GOT,2500,80,5,high,\n'
                    '6.25,6 BIOCHIMIE,Chlorures,4250,80,5,high,\n'
                    '6.26,6 BIOCHIMIE,Sodium,4250,80,5,high,\n'
                    '1.8,1 HEMATOLOGIE,Hémoglobine,660,80,1,low,alignment\n'
                    '1.12,1 HEMATOLOGIE,Résistance globulaire,-,80,1,high,\n'
                    ',5 BACTERIOLOGIE,Spermogramme,1750,80,5,high,code hidden\n')
        return mfp.read_lab_list(path)

    def test_lab_line_price_rate_and_reading(self):
        lab = self.lab()
        self.assertEqual(sorted(lab), ['1.12', '1.8', '6.16', '6.25', '6.26'])  # no heading, no line without a code
        line = mfp.mfp_line(self.book, 'L:6.16', self.letters, lab)
        self.assertEqual((line['mfp_sheet'], line['mfp_price'], line['mfp_taux'], line['yellow'], line['source']),
                         (mfp.LAB, '2500', '80', '', 'p. 5'))
        self.assertEqual(mfp.decide(dict(line, mfp_ref='L:6.16', confidence='exact')), 'load')
        low = mfp.mfp_line(self.book, 'L:1.8', self.letters, lab)
        self.assertEqual(mfp.decide(dict(low, mfp_ref='L:1.8', confidence='exact')), 'yellow value')
        self.assertEqual(mfp.mfp_line(self.book, 'L:1.12', self.letters, lab)['mfp_price'], '')  # « - »

    def test_lines_grouped_by_hand_are_never_added_up(self):
        group = mfp.mfp_line(self.book, 'L:6.25+6.26', self.letters, self.lab())
        self.assertEqual((group['mfp_printed'], group['mfp_price']), ('4250 + 4250', ''))
        self.assertEqual(mfp.decide(dict(group, mfp_ref='L:6.25+6.26', confidence='exact')), 'yellow value')

    def test_two_sources_that_disagree_load_neither(self):
        act = dict(mfp_ref='A:4', confidence='exact', confirmed='yes', **self.line('A:4'))  # B 5 = 1500
        self.assertEqual(mfp.decide(dict(act, other_ref='L:1.8', other_price='660')), 'two sources disagree')
        self.assertEqual(mfp.decide(dict(act, other_ref='L:6.25+6.26', other_price='')), 'two sources disagree')
        self.assertEqual(mfp.decide(dict(act, other_ref='L:x', other_price='1500')), 'load')

    # ---- the product owner's answers

    def test_a_confirmed_match_and_reading_is_loaded(self):
        doubtful = dict(mfp_ref='A:3', confidence='medium', **self.line('A:3'))  # yellow K 2,5
        self.assertEqual(mfp.decide(doubtful), 'uncertain match')
        self.assertEqual(mfp.decide(dict(doubtful, confirmed='yes')), 'load')
        self.assertEqual(mfp.decide(dict(doubtful, confirmed='no')), 'not this line (product owner)')
        self.assertEqual(mfp.decide(dict(doubtful, confirmed='yes, value open')), 'value to confirm')
        per_ml = dict(mfp_ref='D:3', confidence='reviewed', **self.line('D:3'))  # « 7/ml »
        self.assertEqual(mfp.decide(per_ml), 'yellow value')
        self.assertEqual(mfp.decide(dict(per_ml, confirmed='yes'), '80'), 'no unit price')

    def test_rate_of_the_device_list(self):
        device = dict(mfp_ref='D:2', confidence='exact', **self.line('D:2'))  # TAUX 0.7
        self.assertEqual(mfp.decide(device, '70'), 'load')
        self.assertEqual(mfp.decide(device, '80'), 'rate to confirm')  # a medicine paid at 80%, listed at 70%
        self.assertEqual(mfp.decide(dict(device, mfp_taux='80'), '70'), 'load')  # MFP's own 80% wins

    def sent(self):
        def row(group, product, billed, question='', price=''):
            return {'group': group, 'UVL product': product, 'how often billed (estimate)': billed,
                    'question for the product owner': question, 'computed MFP price (BIF)': price}
        general = [g for g in mfp.GENERAL if g['group'] == 'general rule']
        return ([row('uncertain match', 'Alpha', 'low', price='1000'),
                 row('uncertain match', 'Beta (Bêta)', 'high', price='2000'),
                 row('uncertain match', 'Gamma', 'low', price='3000'),
                 row('yellow value', 'Delta', 'medium', price='400'),
                 row('yellow value', 'Epsilon', 'high', price='500')] +
                # the file sorts the general rules by name: not the order they were asked in
                [row('general rule', g['product'], g['billed'], g['question']) for g in reversed(general)])

    FOLLOW_UPS = [{'No.': 'G1', 'Produit UVL': '(règle)', 'Plafond MFP calculé (BIF)': ''},
                  {'No.': 'G2', 'Produit UVL': 'Beta (suite de F5)', 'Plafond MFP calculé (BIF)': ''},
                  {'No.': 'G3', 'Produit UVL': 'Epsilon', 'Plafond MFP calculé (BIF)': '500'},
                  {'No.': 'G4', 'Produit UVL': 'Delta', 'Plafond MFP calculé (BIF)': '400'}]

    def test_answer_numbers_are_rebuilt_from_the_files_sent(self):
        f, g, first_yellow = mfp.numbered_questions(self.sent(), self.FOLLOW_UPS)
        general = [x['product'] for x in mfp.GENERAL if x['group'] == 'general rule']
        self.assertEqual([f['F%d' % n]['UVL product'] for n in range(1, 8)],
                         general + ['Beta (Bêta)', 'Alpha', 'Gamma'])  # most billed first, then the file's order
        self.assertEqual(first_yellow, 3)
        swapped = [self.FOLLOW_UPS[0], self.FOLLOW_UPS[1], self.FOLLOW_UPS[3], self.FOLLOW_UPS[2]]
        swapped = [dict(x, **{'No.': 'G%d' % n}) for n, x in enumerate(swapped, 1)]
        with self.assertRaises(SystemExit):
            mfp.numbered_questions(self.sent(), swapped)

    def test_only_a_plain_answer_is_interpreted(self):
        self.assertEqual(mfp.plain('oui', '4000'), 'yes')
        self.assertEqual(mfp.plain('Non', '4000'), 'no')
        self.assertEqual(mfp.plain('oui, 4 000', '4000'), 'yes')
        for needs_reading in ('oui, Foley', 'oui, 10 000 + 25 %', 'non, considérer pansement simple', 'b', ''):
            self.assertEqual(mfp.plain(needs_reading, '10000'), '', needs_reading)
        with self.assertRaises(SystemExit):
            mfp.plain('oui, 500', '4000')

    def test_answers_are_written_next_to_their_product(self):
        answers = {'F': {'F5': 'non', 'F6': 'oui, 1 000', 'F7': 'oui, Foley'},
                   'G': {'G2': 'une autre ligne', 'G3': 'oui', 'G4': 'non'}}
        matching = [{'product': name, 'confirmed': ''} for name in ('Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon')]
        matching[2]['confirmed'] = 'yes'  # read by hand earlier
        for _ in range(2):  # twice: nothing changes
            mfp.apply_answers(matching, answers, self.sent(), self.FOLLOW_UPS, out=io.StringIO())
            got = {r['product']: (r.get('answer_ref', ''), r.get('answer', ''), r['confirmed']) for r in matching}
            self.assertEqual(got['Alpha'], ('F6', 'oui, 1 000', 'yes'))
            self.assertEqual(got['Beta'], ('F5, G2', 'non · G2: une autre ligne', ''))  # a follow-up: by hand
            self.assertEqual(got['Gamma'], ('F7', 'oui, Foley', 'yes'))  # the hand reading is kept
            self.assertEqual(got['Epsilon'], ('G3', 'oui', 'yes'))
            self.assertEqual(got['Delta'], ('G4', 'non', 'no'))

    def test_committed_laboratory_list(self):
        rows = mfp.read_csv(mfp.LAB_LIST)
        self.assertEqual(sorted({r['page'] for r in rows}), list('123456'))
        for r in rows:
            if r['price']:  # a price or a dash; an empty cell under a sub-heading has no reading
                self.assertIn(r['reading'], ('high', 'low'), r['code'] + ' ' + r['name'])
            self.assertTrue(r['price'] in ('', '-') or r['price'].isdigit(), r['code'])
        lab = mfp.read_lab_list()
        # The lines that are clearly legible on the photographs.
        for code, price in [('6.1', '2250'), ('6.2', '3250'), ('6.4', '2250'), ('6.6', '2800'), ('6.16', '2500'),
                            ('6.17', '2500'), ('2.1.1', '1750'), ('2.3.1', '1200'), ('2.3.2', '1750'),
                            ('4.1.1', '4100'), ('4.2.12', '3000'), ('5.2.4', '4800'), ('6.42', '1500')]:
            self.assertEqual((lab[code]['price'], lab[code]['rate'], lab[code]['reading']), (price, '80', 'high'), code)

    # ---- the complete device list (scan of 19 Nov 2026)

    def devices(self):
        path = os.path.join(self.tmp, 'devices.csv')
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write('no,name,price,rate,page,reading,note\n'
                    '2,ABAISSE LANGUE EN BOIS,40,70,2,high,\n'
                    '95,CATHETER G18,2230,70,4,high,\n'
                    '85,CATGUT CHROME SERTI O (PIECE),2940,70,4,low,doubt on the first digit\n'
                    '532,SPARADRAP,"3,4/cm",70,16,high,\n'
                    '543,TUBE A TRACHEOTOMIE,,70,16,,price cell empty on the page\n')
        return mfp.read_device_list(path)

    def test_device_list_line_price_rate_and_reading(self):
        devices = self.devices()
        line = mfp.mfp_line(self.book, 'N:95', self.letters, devices=devices)
        self.assertEqual((line['mfp_sheet'], line['mfp_no'], line['mfp_price'], line['mfp_taux'], line['yellow']),
                         (mfp.DEVICES, '95', '2230', '70', ''))
        self.assertEqual(line['source'], 'p. 4 (scan of 19 Nov 2026)')
        self.assertEqual(mfp.decide(dict(line, mfp_ref='N:95', confidence='exact'), '70'), 'load')
        self.assertEqual(mfp.decide(dict(line, mfp_ref='N:95', confidence='low'), '70'), 'uncertain match')
        for ref in ('N:85', 'N:532', 'N:543'):  # a doubtful digit, a price per cm, an empty cell
            unclear = mfp.mfp_line(self.book, ref, self.letters, devices=devices)
            self.assertEqual(mfp.decide(dict(unclear, mfp_ref=ref, confidence='exact'), '70'), 'yellow value', ref)
        self.assertEqual(mfp.mfp_line(self.book, 'N:532', self.letters, devices=devices)['mfp_price'], '')

    def test_a_workbook_line_the_new_scan_reads_differently_is_not_loaded(self):
        devices = self.devices()
        line = self.line('D:2')  # N° 2: 40 at 70% in the workbook and on the scan
        self.assertIsNone(mfp.reread(devices, line))
        self.assertIsNone(mfp.reread(devices, self.line('D:4')))  # N° 70 is not in this small list
        self.assertIsNone(mfp.reread(devices, self.line('A:2')))  # an act: its N° is not a device's
        for price, rate in (('45', '70'), ('40', '80')):
            devices['2'].update(price=price, rate=rate)
            again = mfp.reread(devices, line)
            self.assertEqual((again['mfp_price'], again['mfp_taux']), (price, rate))
        devices['2'].update(price='', rate='80')  # nothing to compare a price with
        self.assertIsNone(mfp.reread(devices, line))

    def test_committed_device_list(self):
        rows = mfp.read_csv(mfp.DEVICE_LIST)
        numbers = [int(r['no']) for r in rows]
        # N° 1 to 668 in order; the page itself jumps from 103 to 108
        self.assertEqual(numbers, [n for n in range(1, 669) if not 104 <= n <= 107])
        self.assertEqual(sorted({int(r['page']) for r in rows}), list(range(2, 20)))
        for r in rows:
            self.assertIn(r['rate'], ('70', '80'), r['no'])
            self.assertEqual(r['reading'] in ('high', 'low'), bool(r['price']), r['no'])
        devices = mfp.read_device_list()
        for no, price, rate in [('95', '2230', '70'), ('97', '2230', '70'), ('98', '2230', '70'),
                                ('37', '2030', '80'), ('38', '2740', '80'), ('189', '185', '80'),
                                ('541', '500', '70'), ('548', '500', '70'), ('521', '10150', '70')]:
            self.assertEqual((devices[no]['price'], devices[no]['rate'], devices[no]['reading']),
                             (price, rate, 'high'), no)
        # the workbook's readings that are loaded are the scan's: nothing loaded was contradicted
        matching = mfp.read_csv(mfp.MATCHING)
        for r in matching:
            if r['decision'] == 'load' and r['mfp_sheet'] == mfp.DEVICES:
                again = devices[r['mfp_no']]
                self.assertEqual((again['price'], again['rate']), (r['mfp_price'], r['mfp_taux']), r['product'])
        loaded = {r['product']: r for r in matching if r['decision'] == 'load'}
        for product, price in [('Cathéter G18', '2230'), ('Cathéter G22', '2230'), ('Cathéter G24', '2230'),
                               ('Tube à EDTA', '500'), ('Tube sec', '500'), ("Tube d'intubation", '10150'),
                               ('Jeu de perfusion', '500')]:
            self.assertEqual((loaded[product]['mfp_price'], loaded[product]['coverage_percentage']),
                             (price, '70'), product)
        # a product that could be several lines is asked, never loaded
        for product in ('Ruban adhésif', 'Cathéter Pédiatrique', 'Pogal N° 1', 'Pansement Ombilical'):
            self.assertNotIn(product, loaded)

    # ---- a product MFP does not cover, and the two dressing acts (answers F12, G8, F30, G10)

    def test_a_product_mfp_does_not_cover_never_gets_a_ceiling(self):
        products = os.path.join(self.tmp, 'product_variant')
        os.makedirs(products, exist_ok=True)
        with io.open(os.path.join(products, 'p.csv'), 'w', encoding='utf-8') as f:
            f.write('id,name\ninit.tech,Technician consultation\ninit.act,Lumbar puncture\n')
        rates = os.path.join(self.tmp, 'rates.csv')
        acts = os.path.join(self.tmp, 'acts.csv')
        zero = 'init.coverage_mfp_tech,init.insurance_plan_mfp,init.tech,0,full,\n'
        with io.open(rates, 'w', encoding='utf-8') as f:
            f.write(','.join(mfp.COVERAGE) + '\n' + zero)
        saved = mfp.PRODUCT_DIRS, mfp.MFP_RATES, mfp.ACTS_OUT
        mfp.PRODUCT_DIRS, mfp.MFP_RATES, mfp.ACTS_OUT = [products], rates, acts
        try:
            # the technician's consultation names the bed-day line and is even confirmed: 0% still wins
            matching = mfp.refresh(self.book, [
                {'product_id': 'init.tech', 'mfp_ref': 'C:4', 'other_ref': '', 'confidence': 'exact',
                 'confirmed': 'yes', 'answer_ref': 'F1'},
                {'product_id': 'init.act', 'mfp_ref': 'A:2', 'other_ref': '', 'confidence': 'exact'}])
            tech, act = matching
            self.assertEqual((tech['decision'], tech['coverage_percentage']), ('not covered by MFP (0%)', ''))
            self.assertEqual((act['decision'], act['coverage_percentage'], act['mfp_price']), ('load', '80', '1000'))
            self.assertEqual(mfp.write_coverage(matching), (1, 1))
            with io.open(rates, encoding='utf-8') as f:
                self.assertEqual(f.read().splitlines()[1:], [zero.strip()])  # still 0%, full, no amount
            self.assertEqual([(r['product_id/id'], r['coverage_percentage'], r['covered_base_mode'],
                               r['covered_base_amount']) for r in mfp.read_csv(acts)],
                             [('init.act', '80', 'amount', '1000')])
        finally:
            mfp.PRODUCT_DIRS, mfp.MFP_RATES, mfp.ACTS_OUT = saved

    def test_committed_dressing_acts_and_ophthalmology_consultation(self):
        rows = {r['product']: r for r in mfp.read_csv(mfp.MATCHING)}
        rates = {r['product_id/id']: r for r in mfp.read_csv(mfp.MFP_RATES)}
        acts = {r['product_id/id']: r for r in mfp.read_csv(mfp.ACTS_OUT)}
        # MFP's two dressing acts (nomenclature 1.7 and 1.8) replace « Soins locaux » for MFP
        for name, no, price in [('Pansement simple', '1.7', '2000'), ('Pansement complexe ou multiple', '1.8', '3000')]:
            r = rows[name]
            self.assertEqual((r['mfp_no'], r['mfp_line'], r['mfp_price'], r['decision'], r['coverage_percentage']),
                             (no, name, price, 'load', '80'))
            row = acts[r['product_id']]
            self.assertEqual((row['coverage_percentage'], row['covered_base_mode'], row['covered_base_amount']),
                             ('80', 'amount', price))
        # « Soins locaux » stays as it was: the plan's 80% of the clinic price, no row, no ceiling
        local = rows['Local care']
        self.assertEqual(local['decision'], 'not this line (product owner)')
        self.assertNotIn(local['product_id'], rates)
        self.assertNotIn(local['product_id'], acts)
        # the ophthalmic technician's consultation: MFP pays nothing
        oph = rows['Ophthalmologist consultation']
        self.assertEqual(oph['decision'], 'not covered by MFP (0%)')
        row = rates[oph['product_id']]
        self.assertEqual((row['coverage_percentage'], row['covered_base_mode'], row['covered_base_amount']),
                         ('0', 'full', ''))
        self.assertNotIn(oph['product_id'], acts)
        # both were open points of the third part: they are not asked again
        asked = ' '.join(r['UVL product'] for r in mfp.open_rows(list(rows.values())))
        self.assertNotIn('Soins locaux', asked)
        self.assertNotIn('Consultation ophtalmologique', asked)

    def test_open_questions_start_with_the_laboratory_rule(self):
        rows = mfp.open_rows(mfp.read_csv(mfp.MATCHING))
        self.assertEqual(rows[0]['group'], 'laboratory: general rule')
        disagree = [r for r in rows if r['group'] == 'laboratory: two sources']
        self.assertTrue(disagree)
        for r in disagree:
            self.assertTrue(r['source A line + value'] and r['source B line + value'], r['UVL product'])


if __name__ == '__main__':
    unittest.main()
