#!/usr/bin/env python3
"""
MFP price ceiling for acts and consumables (#184): from MFP's price lists to Odoo coverage rows.

The product owner sent MFP's tariffs on 18 Nov 2026 as one workbook, transcribed by hand from
scans (« TARIFS DES ACTES ET CONSOMMABLES MFP.xlsx », kept off the repository):

  - « Actes médicaux »: the 2021 national nomenclature. A coefficient such as « K 3 » is not a
    price: the price is the coefficient times the value of its key letter.
  - « TARIFS DES CONSULTATIONS »: the ordinance's own amounts (consultations, the value of each
    key letter, hospital bed-days, certificates).
  - « Dispositifs médicaux MFP »: MFP's 2011 device list, price per item and MFP's rate (TAUX).

Yellow cells are readings the transcriber could not confirm. A yellow price, coefficient or
name is never loaded.

Which MFP line a UVL product is, and how sure we are, is decided by hand in
sites/mugamba/requirements/mfp-acts-devices-matching-issue184.csv (columns product_id to
suggested_answer). This script fills in the rest of that file from the workbook, so the values
are always the workbook's, and writes:

  - the acts' coverage rows, insurance_coverage/mfp-acts-ceiling-issue184.csv (80%, amount);
  - the consumables' ceiling on their existing rows of insurance_coverage/mfp-issue184.csv,
    keeping each row's agreed percentage (70%);
  - with --confirm, the questions for the product owner (uncertain matches, yellow values,
    products with no MFP line, the pages missing from the scan).

A product is loaded only when its match is « exact » or « reviewed » and its MFP name and
value are clear. Running it twice changes nothing.

  python3 scripts/mfp-ceiling.py '/path/TARIFS DES ACTES ET CONSOMMABLES MFP.xlsx' \
      [--confirm /path/to-confirm.csv]
"""
import argparse
import csv
import glob
import io
import os
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
SITE = os.path.join(ROOT, 'sites', 'mugamba')
ODOO = os.path.join(SITE, 'configs', 'odoo', 'initializer_config')
MATCHING = os.path.join(SITE, 'requirements', 'mfp-acts-devices-matching-issue184.csv')
ACTS_OUT = os.path.join(ODOO, 'insurance_coverage', 'mfp-acts-ceiling-issue184.csv')
MFP_RATES = os.path.join(ODOO, 'insurance_coverage', 'mfp-issue184.csv')
# The site's products only: sites/mugamba/pom.xml leaves the distro's product_variant out.
PRODUCT_DIRS = [os.path.join(ODOO, 'product_variant')]

MFP_PLAN = 'init.insurance_plan_mfp'
DEFAULT_PERCENTAGE = '80'  # MFP's plan default (partner/insurance_plans.csv)
YELLOW = 'FFFFFF00'
ACTS, ORDINANCE, DEVICES = 'Actes médicaux', 'TARIFS DES CONSULTATIONS', 'Dispositifs médicaux MFP'
SHEETS = {'A': ACTS, 'C': ORDINANCE, 'D': DEVICES}
LAB_FIRST_ROW = 1545  # « LABORATOIRE DE BIOLOGIE »: its numbering restarts at 1
LOADABLE = ('exact', 'reviewed')

HAND = ['product_id', 'product', 'kind', 'mfp_ref', 'confidence', 'reason', 'billed',
        'question', 'suggested_answer']
FILLED = ['mfp_sheet', 'mfp_no', 'mfp_line', 'mfp_printed', 'mfp_price', 'mfp_taux', 'yellow',
          'source', 'decision', 'coverage_percentage']
COVERAGE = ['id', 'insurance_id/id', 'product_id/id', 'coverage_percentage', 'covered_base_mode',
            'covered_base_amount']

M = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'


def read_workbook(path):
    """{sheet name: {row number: {column: (text, yellow)}}}, stdlib only."""
    z = zipfile.ZipFile(path)
    names = z.namelist()
    strings = []
    if 'xl/sharedStrings.xml' in names:
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(M + 'si'):
            strings.append(''.join(t.text or '' for t in si.iter(M + 't')))
    styles = ET.fromstring(z.read('xl/styles.xml'))
    fills = []
    for f in styles.find(M + 'fills').findall(M + 'fill'):
        p = f.find(M + 'patternFill')
        fg = None if p is None else p.find(M + 'fgColor')
        fills.append(fg.get('rgb') if fg is not None and p.get('patternType') == 'solid' else None)
    xf_fill = [int(x.get('fillId', 0)) for x in styles.find(M + 'cellXfs').findall(M + 'xf')]
    rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    book = {}
    for s in ET.fromstring(z.read('xl/workbook.xml')).find(M + 'sheets'):
        target = rels[s.get(R + 'id')].lstrip('/')
        sheet = ET.fromstring(z.read(target if target.startswith('xl/') else 'xl/' + target))
        rows = {}
        for r in sheet.find(M + 'sheetData').findall(M + 'row'):
            cells = {}
            for c in r.findall(M + 'c'):
                col = re.match(r'[A-Z]+', c.get('r')).group(0)
                v = c.find(M + 'v')
                if c.get('t') == 's' and v is not None:
                    text = strings[int(v.text)]
                elif c.get('t') == 'inlineStr':
                    text = ''.join(t.text or '' for t in c.iter(M + 't'))
                else:
                    text = '' if v is None else v.text
                style = c.get('s')
                yellow = style is not None and fills[xf_fill[int(style)]] == YELLOW
                cells[col] = (text.strip(), yellow)
            rows[int(r.get('r'))] = cells
        book[s.get('name')] = rows
    return book


def number(text):
    """'7,5' -> 7.5; None for text such as '7/ml' or ''."""
    try:
        return float(text.replace(',', '.').replace(' ', ''))
    except (AttributeError, ValueError):
        return None


def francs(value):
    return str(int(round(value)))


def letter_values(book):
    """Article 4 of the ordinance: {'K': 1000, 'B': 300, 'R': 1000, 'N': 800}."""
    values = {}
    for cells in book[ORDINANCE].values():
        rubric = cells.get('B', ('', False))[0]
        label = cells.get('C', ('', False))[0]
        if 'lettres' in rubric.lower() and label:
            values[label.split()[0]] = number(cells.get('D', ('', False))[0])
    return values


def page(source):
    m = re.search(r'p\. (\d+)', source)
    return 'p. %s' % m.group(1) if m else source


def mfp_line(book, ref, letters):
    """The MFP line a reference such as 'A:14' points at, with its BIF price."""
    key, row = ref.split(':')
    sheet = SHEETS[key]
    cells = book[sheet][int(row)]
    get = lambda col: cells.get(col, ('', False))
    line = {'mfp_sheet': sheet, 'mfp_no': get('A')[0], 'mfp_line': get('B')[0],
            'mfp_taux': '', 'mfp_price': ''}
    if key == 'A':
        printed, value_yellow = get('C')
        coefficient, letter = number(get('E')[0]), get('D')[0]
        if coefficient is not None and letters.get(letter):
            line['mfp_price'] = francs(coefficient * letters[letter])
        name_yellow, source = get('B')[1], get('G')[0]
    elif key == 'C':
        line['mfp_no'] = get('A')[0]
        line['mfp_line'] = '%s : %s' % (get('B')[0], get('C')[0])
        printed, value_yellow = get('D')
        value = number(printed)
        line['mfp_price'] = francs(value) if value is not None else ''
        name_yellow, source = get('C')[1], get('E')[0]
    else:
        printed, value_yellow = get('C')
        value = number(printed)
        line['mfp_price'] = francs(value) if value is not None else ''
        line['mfp_taux'] = francs(number(get('D')[0]) * 100) if number(get('D')[0]) else ''
        name_yellow, source = get('B')[1], get('E')[0]
    line['mfp_printed'] = printed
    line['yellow'] = 'name and value' if name_yellow and value_yellow else \
        'value' if value_yellow else 'name' if name_yellow else ''
    line['source'] = page(source)
    return line


def decide(row):
    """load, or the reason it is not loaded (the group of the question)."""
    if not row['mfp_ref']:
        return 'no MFP line'
    if row['confidence'] not in LOADABLE:
        return 'uncertain match'
    if row['yellow'] or not row['mfp_price'] or row['mfp_price'] == '0':
        return 'yellow value'
    return 'load'


def read_csv(path):
    with io.open(path, encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))


def write_csv(path, header, rows, quote_all=False):
    with io.open(path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, header, lineterminator='\n', extrasaction='ignore',
                           quoting=csv.QUOTE_ALL if quote_all else csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)


def products():
    found = {}
    for d in PRODUCT_DIRS:
        for path in sorted(glob.glob(os.path.join(d, '*.csv'))):
            for r in read_csv(path):
                found[r['id']] = r['name']
    return found


def refresh(book, matching):
    letters = letter_values(book)
    known = products()
    rates = {r['product_id/id']: r['coverage_percentage'] for r in read_csv(MFP_RATES)}
    for row in matching:
        if row['product_id'] not in known:
            sys.exit('%s: no Odoo product %s' % (MATCHING, row['product_id']))
        row['product'] = known[row['product_id']]
        for col in FILLED:
            row[col] = ''
        if row['mfp_ref']:
            row.update(mfp_line(book, row['mfp_ref'], letters))
        if rates.get(row['product_id']) == '0':
            # Gloves and vital signs: MFP pays nothing, so there is no ceiling to apply.
            row['decision'] = 'not covered by MFP (0%)'
            continue
        row['decision'] = decide(row)
        if row['decision'] == 'load':
            row['coverage_percentage'] = rates.get(row['product_id'], DEFAULT_PERCENTAGE)
    return matching


def coverage_row(row):
    return {'id': 'init.coverage_mfp_%s' % row['product_id'][len('init.'):],
            'insurance_id/id': MFP_PLAN, 'product_id/id': row['product_id'],
            'coverage_percentage': row['coverage_percentage'], 'covered_base_mode': 'amount',
            'covered_base_amount': row['mfp_price']}


def write_coverage(matching):
    loaded = {r['product_id']: r for r in matching if r['decision'] == 'load'}
    rates = read_csv(MFP_RATES)
    in_rates = {r['product_id/id'] for r in rates}
    for r in rates:
        if r['product_id/id'] in loaded:
            r.update(coverage_row(loaded[r['product_id/id']]))
    write_csv(MFP_RATES, COVERAGE, rates)
    acts = [coverage_row(r) for r in matching if r['decision'] == 'load' and r['product_id'] not in in_rates]
    write_csv(ACTS_OUT, COVERAGE, sorted(acts, key=lambda r: r['id']))
    return len(loaded), len(acts)


GROUPS = ['uncertain match', 'yellow value', 'no MFP line', 'missing page', 'general rule']
BILLED = {'high': 0, 'medium': 1, 'low': 2, '': 3}


def default_question(row):
    p, line = row['product'], row['mfp_line']
    if row['decision'] == 'uncertain match':
        return ('« %s » est-il la ligne MFP « %s » (%s BIF) ?' % (p, line, row['mfp_price'] or row['mfp_printed']),
                'oui')
    if row['decision'] == 'yellow value':
        return ('Sur le papier, le tarif MFP de « %s » (N° %s) est-il bien « %s » (%s BIF) ?'
                % (line, row['mfp_no'], row['mfp_printed'], row['mfp_price'] or row['mfp_printed']), 'oui')
    if row['kind'] == 'consumable':
        return ('Quel est le prix MFP de « %s » (absent des pages scannées) ?' % p, '')
    return ('MFP rembourse-t-il « %s » et à quel prix (aucune ligne dans la nomenclature) ?' % p, '')


def confirm_rows(matching):
    out = []
    for row in matching:
        if row['decision'] in ('load', 'not covered by MFP (0%)'):
            continue
        group = row['decision']
        if group == 'no MFP line' and row['kind'] == 'consumable':
            group = 'missing page'
        question, answer = default_question(row)
        out.append({'group': group, 'billed': row['billed'], 'product': row['product'],
                    'mfp_sheet': row['mfp_sheet'], 'mfp_no': row['mfp_no'], 'mfp_line': row['mfp_line'],
                    'mfp_printed': row['mfp_printed'], 'mfp_price': row['mfp_price'], 'source': row['source'],
                    'question': row['question'] or question,
                    'suggested_answer': row['suggested_answer'] or answer, 'reason': row['reason']})
    out += GENERAL
    out.sort(key=lambda r: (GROUPS.index(r['group']), BILLED.get(r['billed'], 3), r['product']))
    return out


GENERAL = [
    {'group': 'missing page', 'billed': 'high', 'product': '(liste des dispositifs)', 'mfp_sheet': DEVICES,
     'mfp_no': '73–150 ; après 520', 'source': 'pages imprimées 3–4 et 15–17',
     'question': 'Pouvez-vous envoyer les pages 3–4 (N° 73 à 150) et 15–17 (après le N° 520) de la liste MFP des '
                 'dispositifs ? Cathéters, gants, sparadrap, tubes et tulle gras y sont.',
     'suggested_answer': 'oui'},
    {'group': 'general rule', 'billed': 'high', 'product': '(liste des dispositifs)', 'mfp_sheet': DEVICES,
     'source': 'p. 1', 'question': 'Les prix « PRIX 2011 » de la liste des dispositifs sont-ils toujours ceux que '
                                   'MFP applique en 2026 ?', 'suggested_answer': 'oui'},
    {'group': 'general rule', 'billed': 'high', 'product': '(bandes, compresses, bande ombilicale)',
     'mfp_sheet': DEVICES, 'mfp_printed': 'TAUX 0,8',
     'question': 'MFP indique 80 % pour les bandes et compresses ; nous appliquons 70 % aux consommables. '
                 'Garde-t-on 70 % ?', 'suggested_answer': 'oui, 70 %'},
    {'group': 'general rule', 'billed': 'medium', 'product': '(anesthésie : ANE401 à ANE499)', 'mfp_sheet': ACTS,
     'mfp_no': '2.2', 'source': 'p. 6',
     'question': 'MFP paie l’anesthésie à 25 % de l’acte chirurgical ; la clinique la facture à 50 %. '
                 'Le plafond MFP de l’anesthésie est-il 25 % de l’acte ?', 'suggested_answer': 'oui, 25 %'},
    {'group': 'general rule', 'billed': 'medium', 'product': '(lits d’hospitalisation)', 'mfp_sheet': ORDINANCE,
     'mfp_no': 'Article 5', 'source': 'p. 2',
     'question': 'Pour les lits, MFP applique-t-il les tarifs « hôpitaux de District » (identiques à ceux des '
                 'hôpitaux nationaux) ?', 'suggested_answer': 'oui'},
]
for g in GENERAL:
    for k in ('mfp_no', 'mfp_line', 'mfp_printed', 'mfp_price', 'source', 'reason'):
        g.setdefault(k, '')

CONFIRM_HEADER = ['group', 'UVL product', 'UVL price', 'MFP sheet', 'MFP N°', 'MFP designation',
                  'MFP coefficient/price', 'computed MFP price (BIF)', 'source page',
                  'question for the product owner', 'suggested answer', 'how often billed (estimate)',
                  'why']


def write_confirm(path, rows):
    out = [{'group': r['group'], 'UVL product': r['product'], 'UVL price': '',
            'MFP sheet': r['mfp_sheet'], 'MFP N°': r['mfp_no'], 'MFP designation': r['mfp_line'],
            'MFP coefficient/price': r['mfp_printed'], 'computed MFP price (BIF)': r['mfp_price'],
            'source page': r['source'], 'question for the product owner': r['question'],
            'suggested answer': r['suggested_answer'], 'how often billed (estimate)': r['billed'],
            'why': r['reason']} for r in rows]
    write_csv(path, CONFIRM_HEADER, out)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('workbook')
    ap.add_argument('--confirm', help='write the questions for the product owner to this CSV')
    args = ap.parse_args(argv)
    book = read_workbook(args.workbook)
    matching = refresh(book, read_csv(MATCHING))
    write_csv(MATCHING, HAND + FILLED, matching)
    loaded, acts = write_coverage(matching)
    print('%d products loaded (%d acts, %d consumables)' % (loaded, acts, loaded - acts))
    if args.confirm:
        rows = confirm_rows(matching)
        write_confirm(args.confirm, rows)
        for g in GROUPS:
            print('  %s: %d' % (g, sum(1 for r in rows if r['group'] == g)))


if __name__ == '__main__':
    main()
