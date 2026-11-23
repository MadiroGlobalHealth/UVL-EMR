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

Since 18 Nov 2026 there are two more inputs:

  - MFP's « Examens de laboratoire remboursables par la mutuelle » (PRIX 2011, 80%), six
    photographed pages transcribed by hand into sites/mugamba/requirements/
    mfp-lab-list-20261118.csv. A line is referenced as « L:6.16 » (its code); a « low » reading is
    treated like a yellow cell. A product may name a second line in other_ref: when the two
    sources give different prices, neither is loaded.
  - The product owner's answers to the questions of --confirm (--answers, with the two question
    files that were sent). The answer is written next to its product (answer_ref, answer) and a
    plain « oui » or « non » fills the confirmed column; any other answer is printed and left
    for the confirmed column to be set by hand. A confirmed match and reading is loaded.

Since 19 Nov 2026 the device list is complete: the product owner sent a legible scan of all of
it (« Tarifs des dispositifs médicaux remboursables par la mutuelle, à partir du 1er juin 2011 »,
N° 1 to 668, kept off the repository), transcribed by hand into sites/mugamba/requirements/
mfp-device-list-20261119.csv (no, name, price, rate, page, reading, note). A line is referenced
as « N:95 » (its N°); a « low » reading is treated like a yellow cell. The workbook's lines
(« D:… », N° 1 to 72 and 151 to 520) were read again on this scan: when the two readings of a
line give different prices or rates, neither is loaded.

Since the answers of 19 Nov 2026 (tab G, G72 to G117), read by hand into the matching file:

  - Laboratory tests follow the nomenclature (answer G89, « non, le coefficient », and « consider
    the prices for 2021 »): where the nomenclature and the laboratory list give different prices,
    a row confirmed « yes, nomenclature » is loaded at the coefficient's price (mfp_ref). A test
    only the laboratory list prices keeps that price until the product owner says otherwise.
  - A product sold as the very unit MFP prices (« 5/Tampon ») is confirmed « yes, per unit »: the
    ceiling is the printed price of one unit.
  - A product MFP does not reimburse has its row at 0% in mfp-issue184.csv, set by hand: it is
    never given a ceiling here.

  python3 scripts/mfp-ceiling.py '/path/TARIFS DES ACTES ET CONSOMMABLES MFP.xlsx' \
      [--answers answers.json --questions to-confirm.csv tab-g-questions.csv] \
      [--confirm /path/to-confirm.csv] [--open-questions /path/to-confirm-part3.csv]
"""
import argparse
import csv
import glob
import io
import json
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
LAB_LIST = os.path.join(SITE, 'requirements', 'mfp-lab-list-20261118.csv')
DEVICE_LIST = os.path.join(SITE, 'requirements', 'mfp-device-list-20261119.csv')
ACTS_OUT = os.path.join(ODOO, 'insurance_coverage', 'mfp-acts-ceiling-issue184.csv')
MFP_RATES = os.path.join(ODOO, 'insurance_coverage', 'mfp-issue184.csv')
# The site's products only: sites/mugamba/pom.xml leaves the distro's product_variant out.
PRODUCT_DIRS = [os.path.join(ODOO, 'product_variant')]

MFP_PLAN = 'init.insurance_plan_mfp'
DEFAULT_PERCENTAGE = '80'  # MFP's plan default (partner/insurance_plans.csv)
YELLOW = 'FFFFFF00'
ACTS, ORDINANCE, DEVICES = 'Actes médicaux', 'TARIFS DES CONSULTATIONS', 'Dispositifs médicaux MFP'
LAB = 'Examens de laboratoire MFP'
SHEETS = {'A': ACTS, 'C': ORDINANCE, 'D': DEVICES, 'L': LAB}
LAB_FIRST_ROW = 1545  # « LABORATOIRE DE BIOLOGIE »: its numbering restarts at 1
LOADABLE = ('exact', 'reviewed')
MFP_OWN_RATE = '80'  # bandages and compresses in MFP's device list (answer F2, 18 Nov 2026)
# « confirmed », beyond « yes », « no » and « yes, value open » (answers of 19 Nov 2026)
NOMENCLATURE = 'yes, nomenclature'  # two sources: the nomenclature's coefficient is the price (G89)
PER_UNIT = 'yes, per unit'  # sold as the unit MFP prices: « 5/Tampon » is 5 BIF
READING_CONFIRMED = ('yes', NOMENCLATURE, PER_UNIT)

HAND = ['product_id', 'product', 'kind', 'mfp_ref', 'other_ref', 'confidence', 'reason', 'billed',
        'question', 'suggested_answer', 'answer_ref', 'answer', 'confirmed']
FILLED = ['mfp_sheet', 'mfp_no', 'mfp_line', 'mfp_printed', 'mfp_price', 'mfp_taux', 'yellow',
          'source', 'other_line', 'other_price', 'other_source', 'decision', 'coverage_percentage']
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


def read_lab_list(path=LAB_LIST):
    """{code: row} of the transcribed laboratory list; headings and lines without a code are skipped."""
    lines = {}
    for r in read_csv(path):
        if not r['code'] or r['note'] == 'heading':
            continue
        if r['code'] in lines:
            sys.exit('%s: code %s appears twice' % (path, r['code']))
        lines[r['code']] = r
    return lines


def lab_line(lab, codes):
    """A laboratory-list line, or several joined by « + » (a group MFP marked by hand: never summed)."""
    try:
        rows = [lab[c] for c in codes.split('+')]
    except KeyError as e:
        sys.exit('%s: no line %s in the laboratory list' % (MATCHING, e))
    single = len(rows) == 1
    price = rows[0]['price'] if single and rows[0]['price'].isdigit() else ''
    rates = {r['rate'] for r in rows}
    return {'mfp_sheet': LAB, 'mfp_no': codes, 'mfp_line': ' + '.join(r['name'] for r in rows),
            'mfp_printed': ' + '.join(r['price'] for r in rows), 'mfp_price': price,
            'mfp_taux': rates.pop() if len(rates) == 1 else '',
            'yellow': '' if all(r['reading'] == 'high' for r in rows) else 'value',
            'source': 'p. ' + ', '.join(sorted({r['page'] for r in rows}))}


def read_device_list(path=DEVICE_LIST):
    """{N°: row} of the device list as transcribed from the complete scan of 19 Nov 2026."""
    lines = {}
    for r in read_csv(path):
        if r['no'] in lines:
            sys.exit('%s: N° %s appears twice' % (path, r['no']))
        lines[r['no']] = r
    return lines


def device_line(devices, no):
    """A line of the complete device list; « 3,4/cm » or « 5/Tampon » is printed, but is not a price."""
    try:
        r = devices[no]
    except KeyError:
        sys.exit('%s: no line %s in the device list' % (MATCHING, no))
    return {'mfp_sheet': DEVICES, 'mfp_no': no, 'mfp_line': r['name'], 'mfp_printed': r['price'],
            'mfp_price': r['price'] if r['price'].isdigit() else '', 'mfp_taux': r['rate'],
            'yellow': '' if r['reading'] == 'high' else 'value',
            'source': 'p. %s (scan of 19 Nov 2026)' % r['page']}


def reread(devices, line):
    """The same N° on the scan of 19 Nov 2026, when it gives another price or rate than the workbook."""
    again = (devices or {}).get(line['mfp_no'])
    if line['mfp_sheet'] != DEVICES or not again or not again['price'].isdigit():
        return None  # no such line, or nothing there to compare with (an empty cell, « 7/ml »)
    again = device_line(devices, line['mfp_no'])
    if (again['mfp_price'], again['mfp_taux']) == (line['mfp_price'], line['mfp_taux']):
        return None
    return again


def mfp_line(book, ref, letters, lab=None, devices=None):
    """The MFP line a reference such as 'A:14', 'L:6.16' or 'N:95' points at, with its BIF price."""
    key, row = ref.split(':')
    if key == 'L':
        return lab_line(lab or {}, row)
    if key == 'N':
        return device_line(devices or {}, row)
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


def per_unit(printed):
    """'5/Tampon' -> '5': the price of one unit; '' for « 3,4/cm » or « 0,5/ml », which are not whole francs."""
    m = re.match(r'(\d+)/\D', printed)
    return m.group(1) if m else ''


def sure(row):
    """The match is ours (« exact », « reviewed ») or the product owner's (« yes… »)."""
    return row['confidence'] in LOADABLE or row.get('confirmed', '').startswith('yes')


def decide(row, agreed_rate=DEFAULT_PERCENTAGE):
    """load, or the reason it is not loaded (the group of the question)."""
    confirmed = row.get('confirmed', '')
    if not row['mfp_ref']:
        return 'no MFP line'
    if confirmed == 'no':
        return 'not this line (product owner)'
    if not sure(row):
        return 'uncertain match'
    if confirmed == 'yes, value open':
        return 'value to confirm'
    if row.get('other_ref') and row.get('other_price') != row['mfp_price'] and confirmed != NOMENCLATURE:
        return 'two sources disagree'
    if not row['mfp_price'] or row['mfp_price'] == '0':
        # « 7/ml », « 1000/m »: a confirmed reading that is still not a price per item sold
        return 'no unit price' if confirmed in READING_CONFIRMED else 'yellow value'
    if row['yellow'] and confirmed not in READING_CONFIRMED:
        return 'yellow value'
    if row['mfp_taux'] and row['mfp_taux'] not in (MFP_OWN_RATE, agreed_rate):
        return 'rate to confirm'
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


def refresh(book, matching, lab=None, devices=None):
    letters = letter_values(book)
    known = products()
    rates = {r['product_id/id']: r['coverage_percentage'] for r in read_csv(MFP_RATES)}
    for row in matching:
        if row['product_id'] not in known:
            sys.exit('%s: no Odoo product %s' % (MATCHING, row['product_id']))
        row['product'] = known[row['product_id']]
        for col in HAND:
            row.setdefault(col, '')
        for col in FILLED:
            row[col] = ''
        if row['mfp_ref']:
            row.update(mfp_line(book, row['mfp_ref'], letters, lab, devices))
            if row['confirmed'] == PER_UNIT and not row['mfp_price']:
                row['mfp_price'] = per_unit(row['mfp_printed'])
        again = reread(devices, row) if row['mfp_ref'].startswith('D:') and not row['other_ref'] else None
        if again:
            row['other_line'] = '%s · %s · %s' % (again['mfp_sheet'], again['mfp_no'], again['mfp_line'])
            row['other_price'] = again['mfp_price']
            row['other_source'] = '%s, %s%%' % (again['source'], again['mfp_taux'])
        if row['other_ref']:
            other = mfp_line(book, row['other_ref'], letters, lab, devices)
            row['other_line'] = '%s · %s · %s' % (other['mfp_sheet'], other['mfp_no'], other['mfp_line'])
            row['other_price'] = other['mfp_price']
            row['other_source'] = other['source'] + (', uncertain reading' if other['yellow'] else '')
            if not other['mfp_price']:
                row['other_source'] += ', printed « %s »' % other['mfp_printed']
        agreed = rates.get(row['product_id'], DEFAULT_PERCENTAGE)
        if agreed == '0':
            # Gloves, vital signs, the ophthalmology consultation, the consumables MFP does not
            # reimburse (19 Nov 2026): MFP pays nothing, so there is no ceiling to apply.
            row['decision'] = 'not covered by MFP (0%)'
            continue
        row['decision'] = decide(row, agreed)
        if again and row['decision'] == 'load':
            row['decision'] = 'two sources disagree'
        # MFP's device list gives its own rate for bandages and compresses (80%); the product
        # owner's answer of 18 Nov 2026 is to follow the list, with or without a ceiling.
        own_rate = row['mfp_taux'] == MFP_OWN_RATE and sure(row) and row['mfp_sheet'] == DEVICES
        if row['decision'] == 'load':
            row['coverage_percentage'] = MFP_OWN_RATE if own_rate else agreed
        elif own_rate and row['decision'] != 'not this line (product owner)' and row['product_id'] in rates:
            row['coverage_percentage'] = MFP_OWN_RATE
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
    rate_only = {r['product_id']: r['coverage_percentage'] for r in matching
                 if r['decision'] != 'load' and r['coverage_percentage']}
    matched = {r['product_id'] for r in matching}
    for r in rates:
        if r['product_id/id'] in loaded:
            r.update(coverage_row(loaded[r['product_id/id']]))
        elif r['product_id/id'] in rate_only:
            r.update({'coverage_percentage': rate_only[r['product_id/id']], 'covered_base_mode': 'full',
                      'covered_base_amount': ''})
        elif r['covered_base_mode'] == 'amount' and r['product_id/id'] in matched:
            # a ceiling the matching no longer loads
            r.update({'covered_base_mode': 'full', 'covered_base_amount': ''})
    write_csv(MFP_RATES, COVERAGE, rates)
    acts = [coverage_row(r) for r in matching if r['decision'] == 'load' and r['product_id'] not in in_rates]
    write_csv(ACTS_OUT, COVERAGE, sorted(acts, key=lambda r: r['id']))
    return len(loaded), len(acts)


GROUPS = ['uncertain match', 'yellow value', 'two sources disagree', 'value to confirm', 'no unit price',
          'rate to confirm', 'no MFP line', 'missing page', 'general rule', 'open point']
ANSWERED = ('load', 'not covered by MFP (0%)', 'not this line (product owner)')
# what the hand-written questions were written for; since 19 Nov 2026 also the follow-up to an
# answer that did not settle a conflict or a price per ml (the earlier question of such a row is
# replaced by the follow-up, or emptied)
HAND_QUESTION = ('uncertain match', 'yellow value', 'value to confirm', 'no MFP line', 'two sources disagree',
                 'no unit price')
BILLED = {'high': 0, 'medium': 1, 'low': 2, '': 3}


def default_question(row):
    p, line = row['product'], row['mfp_line']
    price = row['mfp_price'] or row['mfp_printed']
    if row['decision'] == 'uncertain match':
        return '« %s » est-il la ligne MFP « %s » (%s BIF) ?' % (p, line, price), 'oui'
    if row['decision'] == 'yellow value':
        return ('Sur le papier, le tarif MFP de « %s » (N° %s) est-il bien « %s » (%s BIF) ?'
                % (line, row['mfp_no'], row['mfp_printed'], price), 'oui')
    if row['decision'] == 'two sources disagree':
        other = row['other_line'].split(' · ')
        if row['other_price']:
            b = '%s BIF' % row['other_price']
        else:  # several lines MFP grouped by hand: shown, never added up here
            b = 'la somme %s (lignes %s)' % (row['other_source'].split('« ')[-1].rstrip(' »'), other[1])
        doubt = ' La lecture de la photo est à vérifier sur le papier.' if 'uncertain' in row['other_source'] else ''
        return ('« %s » : le plafond MFP est-il (a) %s BIF (%s, %s) ou (b) %s (%s) ?%s'
                % (p, price, row['mfp_sheet'], row['mfp_printed'], b, other[0], doubt),
                '(b)' if row['other_price'] and not doubt else '')
    if row['decision'] == 'value to confirm':
        return 'Quelle ligne MFP exactement pour « %s » (« %s », %s BIF) ?' % (p, line, price), ''
    if row['decision'] == 'no unit price':
        return ('MFP donne « %s » pour « %s » : quel plafond pour un « %s » vendu à l’unité ?'
                % (row['mfp_printed'], line, p), '')
    if row['decision'] == 'rate to confirm':
        return ('La liste MFP donne %s %% pour « %s » ; nous appliquons un autre taux à « %s ». Quel taux ?'
                % (row['mfp_taux'], line, p), '')
    if row['kind'] == 'consumable':
        return ('La liste MFP des dispositifs (N° 1 à 668) n’a pas de ligne pour « %s » : MFP le rembourse-t-il, '
                'et à quel prix ?' % p), ''
    return 'MFP rembourse-t-il « %s » et à quel prix (aucune ligne dans la nomenclature) ?' % p, ''


def confirm_rows(matching):
    out = []
    for row in matching:
        if row['decision'] in ANSWERED:
            continue
        group = row['decision']
        question, answer = default_question(row)
        if row['question'] and row['decision'] in HAND_QUESTION:
            question, answer = row['question'], row['suggested_answer']
        out.append({'group': group, 'billed': row['billed'], 'product': row['product'],
                    'mfp_sheet': row['mfp_sheet'], 'mfp_no': row['mfp_no'], 'mfp_line': row['mfp_line'],
                    'mfp_printed': row['mfp_printed'], 'mfp_price': row['mfp_price'], 'source': row['source'],
                    'question': question, 'suggested_answer': answer, 'reason': row['reason']})
    out += [g for g in GENERAL if not g.get('answer')] + lab_list_only(matching)
    out.sort(key=lambda r: (GROUPS.index(r['group']), BILLED.get(r['billed'], 3), r['product']))
    return out


def lab_list_only(matching):
    """One question for the tests still capped by the laboratory list: the rule of 19 Nov 2026 (G89)
    is the nomenclature's coefficient, and the nomenclature has no line for them."""
    rows = [r for r in matching if r['decision'] == 'load' and r['mfp_sheet'] == LAB]
    if not rows:
        return []
    names = ', '.join('%s %s' % (r['product'], r['mfp_price']) for r in rows)
    return [{'group': 'open point', 'billed': 'high', 'product': '(%d examens de laboratoire)' % len(rows),
             'mfp_sheet': LAB, 'mfp_no': ', '.join(r['mfp_no'] for r in rows), 'mfp_line': names,
             'mfp_printed': 'PRIX 2011', 'mfp_price': '', 'source': 'p. 2 à 6',
             'question': 'Vous avez répondu (G89) que le prix MFP d’un examen de laboratoire est le coefficient B '
                         'de la nomenclature de 2021. Ces %d examens n’ont pas de ligne dans la nomenclature '
                         '(elle n’a pas de biochimie, ni de test rapide du paludisme, ni d’anticorps HVC) : leur '
                         'plafond vient de la liste des examens (PRIX 2011). (a) on garde ce plafond · (b) on le '
                         'retire : MFP paie 80 %% du prix UVL, sans plafond' % len(rows),
             'suggested_answer': '(a)',
             'reason': 'loaded on 18 Nov 2026 from the laboratory list, the only source that prices them; '
                       'left loaded, to confirm under the rule of 19 Nov 2026'}]


# The general questions, in the order they were put to the product owner (F1 to F4 after the
# first, which became G3). « answer » is the answer of 18 Nov 2026: an answered question is not
# asked again, but stays here because the numbering of the answers is rebuilt from it.
GENERAL = [
    {'group': 'missing page', 'billed': 'high', 'product': '(liste des dispositifs)', 'mfp_sheet': DEVICES,
     'mfp_no': '73–150 ; après 520', 'source': 'pages imprimées 3–4 et 15–17',
     'question': 'Pouvez-vous envoyer les pages 3–4 (N° 73 à 150) et 15–17 (après le N° 520) de la liste MFP des '
                 'dispositifs ? Cathéters, gants, sparadrap, tubes et tulle gras y sont.',
     'suggested_answer': 'oui', 'answer': 'received on 19 Nov 2026: the whole list, N° 1 to 668 (DEVICE_LIST)'},
    {'group': 'general rule', 'billed': 'high', 'product': '(liste des dispositifs)', 'mfp_sheet': DEVICES,
     'source': 'p. 1', 'question': 'Les prix « PRIX 2011 » de la liste des dispositifs sont-ils toujours ceux que '
                                   'MFP applique en 2026 ?', 'suggested_answer': 'oui',
     'answer': 'yes'},
    {'group': 'general rule', 'billed': 'high', 'product': '(bandes, compresses, bande ombilicale)',
     'mfp_sheet': DEVICES, 'mfp_printed': 'TAUX 0,8',
     'question': 'MFP indique 80 % pour les bandes et compresses ; nous appliquons 70 % aux consommables. '
                 'Garde-t-on 70 % ?', 'suggested_answer': 'oui, 70 %',
     'answer': 'no: 80% as MFP’s list shows (MFP_OWN_RATE)'},
    {'group': 'general rule', 'billed': 'medium', 'product': '(anesthésie : ANE401 à ANE499)', 'mfp_sheet': ACTS,
     'mfp_no': '2.2', 'source': 'p. 6',
     'question': 'MFP paie l’anesthésie à 25 % de l’acte chirurgical ; la clinique la facture à 50 %. '
                 'Le plafond MFP de l’anesthésie est-il 25 % de l’acte ?', 'suggested_answer': 'oui, 25 %',
     'answer': 'yes, 25%: not a price per product, so nothing is loaded for it (see the README)'},
    {'group': 'general rule', 'billed': 'medium', 'product': '(lits d’hospitalisation)', 'mfp_sheet': ORDINANCE,
     'mfp_no': 'Article 5', 'source': 'p. 2',
     'question': 'Pour les lits, MFP applique-t-il les tarifs « hôpitaux de District » (identiques à ceux des '
                 'hôpitaux nationaux) ?', 'suggested_answer': 'oui', 'answer': 'yes'},
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


# ---- the product owner's answers ------------------------------------------------------------

SENT_GROUP, SENT_PRODUCT, SENT_BILLED = 'group', 'UVL product', 'how often billed (estimate)'
SENT_QUESTION, SENT_PRICE = 'question for the product owner', 'computed MFP price (BIF)'
FOLLOW_UP = re.compile(r'\(suite de (F\d+)\)')


def numbered_questions(sent, follow_ups):
    """{'F1': row, ...} and {'G12': row, ...}: the numbering of the sheet the product owner filled in.

    Tab F is the four general rules in the order of GENERAL, then the uncertain matches, most
    billed first; tab G is its own file, G12 onwards being the yellow values in the same order.
    A tab G line that names another product than the rebuilt order stops everything.
    """
    def most_billed_first(group):
        rows = [r for r in sent if r[SENT_GROUP] == group]
        return sorted(rows, key=lambda r: BILLED[r[SENT_BILLED]])  # stable: the file's order within a level

    asked = [g['question'] for g in GENERAL if g['group'] == 'general rule']
    general = sorted((r for r in sent if r[SENT_GROUP] == 'general rule'),
                     key=lambda r: asked.index(r[SENT_QUESTION]))
    f = {'F%d' % n: r for n, r in enumerate(general + most_billed_first('uncertain match'), 1)}
    g = {r['No.']: r for r in follow_ups}
    yellow = most_billed_first('yellow value')
    first = len(g) - len(yellow) + 1
    for n, row in enumerate(yellow, first):
        if g.get('G%d' % n, {}).get('Produit UVL') != row[SENT_PRODUCT]:
            sys.exit('G%d is « %s » in the questions file but « %s » in the rebuilt order: stopping'
                     % (n, g.get('G%d' % n, {}).get('Produit UVL'), row[SENT_PRODUCT]))
    return f, g, first


def find_product(matching, sent_name):
    """The matching row of a product as the questions named it: « Local care (Soins locaux) »."""
    found = [r for r in matching if sent_name == r['product'] or sent_name.startswith(r['product'] + ' (')]
    if not found:
        sys.exit('%s: no product for the question about « %s »' % (MATCHING, sent_name))
    return max(found, key=lambda r: len(r['product']))


def plain(answer, price):
    """'yes', 'no', or '' when the answer needs reading: only « oui », « non » and « oui, <the price shown> »."""
    text = answer.strip().lower()
    if text == 'non':
        return 'no'
    m = re.match(r'oui(?:,\s*([\d ]+))?$', text)
    if not m:
        return ''
    if m.group(1) and m.group(1).replace(' ', '') != price:
        sys.exit('answer « %s » repeats another value than the %s BIF of its question' % (answer, price))
    return 'yes'


def apply_answers(matching, answers, sent, follow_ups, out=sys.stdout):
    """Write each answer next to its product; a plain « oui » or « non » also fills « confirmed »."""
    f, g, first_yellow = numbered_questions(sent, follow_ups)
    extra = {}
    for no, row in g.items():
        m = FOLLOW_UP.search(row['Produit UVL'])
        if m:
            extra.setdefault(m.group(1), []).append(no)
    lines = [(no, f[no][SENT_PRODUCT], f[no][SENT_PRICE]) for no in sorted(f, key=lambda k: int(k[1:]))]
    lines += [(no, g[no]['Produit UVL'], g[no]['Plafond MFP calculé (BIF)'])
              for no in sorted(g, key=lambda k: int(k[1:]))]
    for no, product, price in lines:
        answer = answers[no[0]].get(no, '')
        in_f_group = no[0] == 'F' and f[no][SENT_GROUP] != 'general rule'
        if not (in_f_group or (no[0] == 'G' and int(no[1:]) >= first_yellow)):
            out.write('%-4s %s <- %s\n' % (no, product, answer or '(no answer)'))
            continue  # a general rule, or a follow-up printed with its F line
        row = find_product(matching, product)
        refs, texts = [no], [answer]
        for more in extra.get(no, []):
            refs.append(more)
            texts.append('%s: %s' % (more, answers['G'].get(more) or '(no answer)'))
        row['answer_ref'] = ', '.join(refs)
        row['answer'] = ' · '.join(texts)
        verdict = plain(answer, price) if len(refs) == 1 else ''
        if verdict:
            row['confirmed'] = verdict
        out.write('%-4s %s <- %s  [%s]\n' % (no, product, row['answer'], 'confirmed: ' + (
            verdict or '%s, read by hand' % (row.get('confirmed') or 'NOT SET'))))


# ---- what is still open after the answers ---------------------------------------------------

OPEN_HEADER = ['group', 'UVL product', 'source A line + value', 'source B line + value', 'question',
               'suggested answer']
# One question per decision that the price lists and the answers leave open; « answer » as in GENERAL.
OPEN_FIRST = [
    {'group': 'laboratory: general rule', 'UVL product': '(tous les examens de laboratoire)',
     'source A line + value': 'Actes médicaux (ordonnance 2021) : coefficient B x 300 BIF',
     'source B line + value': 'Examens de laboratoire remboursables par la mutuelle : PRIX 2011, 80 %',
     'question': 'Pour les examens de laboratoire, la liste MFP des examens (PRIX 2011) remplace-t-elle le prix '
                 'calculé avec le coefficient B de la nomenclature ? (a) oui, la liste des examens · (b) non, '
                 'le coefficient · (c) le plus bas des deux',
     'suggested answer': '(a)',
     'answer': '(b) the coefficient (G89, 19 Nov 2026; « consider the prices for 2021 »): NOMENCLATURE'},
]
OPEN_LAST = [
    {'group': 'open point', 'UVL product': '(anesthésie : ANE401 à ANE499)',
     'source A line + value': 'Actes médicaux · 2.2 · l’acte d’anesthésie est coté 25 % de l’acte chirurgical',
     'source B line + value': 'Votre réponse F3 : oui, 25 %',
     'question': 'Le plafond de l’anesthésie dépend de l’acte opéré, et nos produits d’anesthésie sont génériques : '
                 'le système ne sait plafonner qu’un prix fixe par produit. En attendant : (a) pas de plafond sur '
                 'l’anesthésie (MFP paie 80 % du prix UVL) · (b) vous donnez un plafond fixe par produit '
                 'd’anesthésie', 'suggested answer': '(a)'},
    {'group': 'open point', 'UVL product': 'Circoncision avec anesthésie (locale, générale)',
     'source A line + value': 'Actes médicaux · 3.7.45 · Circoncision : K 10 = 10 000 BIF',
     'source B line + value': 'Votre réponse F21/F22 : oui, 10 000 + 25 %',
     'question': 'Nous avons chargé 10 000 BIF (l’acte seul). Le plafond de ces deux produits doit-il être '
                 '12 500 BIF (10 000 + 25 % d’anesthésie) ? (a) oui, 12 500 · (b) non, 10 000',
     'suggested answer': '(a)'},
    {'group': 'open point', 'UVL product': 'Compresses stériles 10cm x 10cm',
     'source A line + value': 'Dispositifs médicaux MFP · 189 · COMPRESSE SIMPLE : 185 BIF, 80 %',
     'source B line + value': 'Vos réponses F11 « non » et G7 « considérer compresse simple dans UVL aussi »',
     'question': 'Nous avons compris : les compresses stériles 10x10 sont plafonnées comme « COMPRESSE SIMPLE » '
                 '(185 BIF, MFP 80 %). Est-ce bien cela ?', 'suggested answer': 'oui'},
    {'group': 'open point', 'UVL product': 'IR injection',
     'source A line + value': 'Actes médicaux · 1.24 · Injection intramusculaire ID, S/C, IV : K 1 = 1 000 BIF',
     'source B line + value': 'Votre réponse F27 : non, considérer IM, IV, ID, S/C',
     'question': 'Nous avons compris : l’injection, quelle que soit la voie (IM, IV, ID, S/C), est plafonnée à '
                 '1 000 BIF. Est-ce bien cela ?', 'suggested answer': 'oui'},
    {'group': 'open point', 'UVL product': 'Alcool dénaturé 98%, Solution de Povidone 100ml, Dettol Solution 1L, '
                                           'Tissu Jersey 1m',
     'source A line + value': 'Dispositifs médicaux MFP · 27, 272, 197, 273 : 7/ml, 15/ml, 0,5/ml, 1000/m',
     'source B line + value': '',
     'question': 'MFP donne un prix au ml ou au mètre. Le plafond est-il ce prix multiplié par le contenu vendu '
                 '(ex. Povidone 100 ml = 1 500 BIF, Dettol 1 L = 500 BIF, Jersey 1 m = 1 000 BIF) ? Et quel volume '
                 'pour l’alcool dénaturé ?', 'suggested answer': 'oui'},
    {'group': 'open point', 'UVL product': 'Naloxone Injection',
     'source A line + value': 'Dispositifs médicaux MFP · 295 NARCAN 0,4mg : 7 300 BIF, 70 %',
     'source B line + value': 'Règle actuelle : médicaments à 80 % ; votre réponse G81 pour le Propofol : 70 %',
     'question': 'Ce médicament est dans la liste des dispositifs à 70 %. Quel taux MFP ? (a) 70 % comme la '
                 'liste et comme le Propofol · (b) 80 % comme les médicaments', 'suggested answer': '(a)'},
]


def open_rows(matching):
    def value(sheet, no, line, printed, price, source):
        text = '%s · %s · %s : %s' % (sheet, no, line, printed)
        if price and price != printed:
            text += ' = %s BIF' % price
        return text + ' (%s)' % source

    conflicts, uncertain = [], []
    for row in matching:
        a = value(row['mfp_sheet'], row['mfp_no'], row['mfp_line'], row['mfp_printed'], row['mfp_price'],
                  row['source'] + (', uncertain reading' if row['yellow'] and row['mfp_sheet'] == LAB else ''))
        question, answer = default_question(row)
        if row['question'] and row['decision'] in HAND_QUESTION:
            question, answer = row['question'], row['suggested_answer']
        if row['decision'] == 'two sources disagree':
            b = '%s : %s (%s)' % (row['other_line'], ('%s BIF' % row['other_price']) if row['other_price']
                                  else 'plusieurs lignes', row['other_source'])
            conflicts.append({'group': 'laboratory: two sources', 'UVL product': row['product'],
                              'source A line + value': a, 'source B line + value': b,
                              'question': question, 'suggested answer': answer, 'billed': row['billed']})
        elif row['decision'] == 'uncertain match' and row['mfp_sheet'] == LAB:
            uncertain.append({'group': 'laboratory: uncertain match', 'UVL product': row['product'],
                              'source A line + value': a, 'source B line + value': '',
                              'question': question, 'suggested answer': answer, 'billed': row['billed']})
    order = lambda r: (BILLED.get(r['billed'], 3), r['UVL product'])
    first = [{k: v for k, v in q.items() if k != 'answer'} for q in OPEN_FIRST if not q.get('answer')]
    return first + sorted(conflicts, key=order) + sorted(uncertain, key=order) + OPEN_LAST


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('workbook')
    ap.add_argument('--answers', help='the product owner’s answers, {"F": {"F1": ...}, "G": {"G1": ...}}')
    ap.add_argument('--questions', nargs=2, metavar=('TAB_F', 'TAB_G'),
                    help='the two question files the answers refer to: the --confirm CSV that was sent, '
                         'and the follow-up tab (No., Produit UVL, ...)')
    ap.add_argument('--confirm', help='write the questions for the product owner to this CSV')
    ap.add_argument('--open-questions', help='write the short list of what is still open to this CSV')
    args = ap.parse_args(argv)
    if bool(args.answers) != bool(args.questions):
        ap.error('--answers and --questions go together')
    book = read_workbook(args.workbook)
    matching = read_csv(MATCHING)
    if args.answers:
        with io.open(args.answers, encoding='utf-8') as f:
            answers = json.load(f)
        apply_answers(matching, answers, read_csv(args.questions[0]), read_csv(args.questions[1]))
    matching = refresh(book, matching, read_lab_list(), read_device_list())
    write_csv(MATCHING, HAND + FILLED, matching)
    loaded, acts = write_coverage(matching)
    print('%d products loaded (%d in %s, %d in %s)' % (loaded, acts, os.path.basename(ACTS_OUT), loaded - acts,
                                                    os.path.basename(MFP_RATES)))
    for decision in sorted({r['decision'] for r in matching}):
        print('  %s: %d' % (decision, sum(1 for r in matching if r['decision'] == decision)))
    if args.confirm:
        rows = confirm_rows(matching)
        write_confirm(args.confirm, rows)
        for g in GROUPS:
            print('  to confirm, %s: %d' % (g, sum(1 for r in rows if r['group'] == g)))
    if args.open_questions:
        rows = open_rows(matching)
        write_csv(args.open_questions, OPEN_HEADER, rows)
        print('%d open questions in %s' % (len(rows), args.open_questions))


if __name__ == '__main__':
    main()
