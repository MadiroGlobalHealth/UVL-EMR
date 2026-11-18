#!/usr/bin/env python3
"""
Opening stock of a UVL pharmacy from the pharmacy's count file (#457).

The stock app (openmrs-esm-stock-management 3.3.1-uvl, stockmanagement 2.1.2-uvl) can import
stock ITEMS from a file but not the lines of a stock operation, so a count of several hundred
lines would have to be typed. This script reads the pharmacy's file as it sends it (.xlsx,
columns N°, PRODUIT, Forme, Dosage, N° de Lot, Date de peremption, Stock, Prix Unitaire) and
creates ONE « Opening Stock » operation at a stock location through the stockmanagement REST
API, signed in as the pharmacist who owns that location (its stock scope must include Opening
Stock there). The operation is then submitted and approved, which completes it: each line
becomes a batch with its lot number and expiry at that location. stockmanagement 2.1.2 shows an
approved operation as « Autorisé » (AUTHORIZED), with its completion date set; --no-approval
completes it in one step instead (COMPLETED), as the app's « Compléter » does.

Which stock item a line of the file is: sites/mugamba/requirements/opening-stock-matching.csv,
one row per product (column produit, as written in the file). Only rows with status `import`
or `new-item` are entered; `confirm`, `excluded` and `unmatched` rows are listed for the
product owner, with the reason. A line is also left out, and listed, when its stock is not a
positive whole number, when it has no lot number or no expiry, or when it expires on or before
the operation date (to be discarded, not counted). An impossible date such as 31/09/2029 is
read as the last day of that month (30/09/2029) and listed as corrected.

Quantities are entered in the stock item's dispensing unit, as the file counts them (tablets,
ampoules, bottles, pieces). The matching marks as `excluded` the items whose unit differs from
the file's (for example an item counted in millilitres when the file counts bottles). Before
anything is written, apply checks that each item's dispensing unit on the server is the unit the
matching names (column stock_item_unit): the same unit concept, so the matching's French name is
accepted whatever the locale of the signed-in account (« Ampule(s) » for an English account is
the concept of « Ampoule(s) »); any name of the concept in any locale, accents and case ignored.
A different unit (Millilitre where the matching says Flacon) stops the run.

apply also checks, through stockmanagement's own session endpoint, that the account's stock
scopes let it do an Opening Stock at the location: a scope on one of its roles, enabled and in
its dates, naming Opening Stock and that location (or a parent with its descendants), on a role
that lists the privilege the module requires (« Task: stockmanagement.stockoperations.mutate »,
and « ...approve » unless --no-approval). A scope on a role that lists no stock privilege, such as
a super-user role, grants nothing. The dry run reports a missing scope as a warning; --commit
stops on it before creating anything.

The file itself is operational data: it stays out of the repository.

Usage:
  # 1. Plan, offline: what would be entered, and the lists for the product owner.
  python3 scripts/opening-stock.py plan --file stock.xlsx --out plan.csv

  # 2. Dry run against a server: checks every stock item and its unit, the location and the
  #    lines already in stock there. Writes nothing.
  OPENMRS_PASSWORD=... python3 scripts/opening-stock.py apply --file stock.xlsx \
      --url https://uvl-emr-uat.madiro.org --user <central pharmacist> \
      --location "Pharmacie (Rx)"

  # 3. The same with --commit creates, submits and approves the operation.

A line whose stock item already has that lot number in stock at the location is skipped, so a
second run (for example after new stock items are deployed) only enters what is missing.
"""
import argparse
import calendar
import csv
import datetime
import getpass
import hashlib
import json
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MATCHING = os.path.join(HERE, '..', 'sites', 'mugamba', 'requirements', 'opening-stock-matching.csv')
OPENING_STOCK_TYPE = '99999999-9999-9999-9999-999999999999'  # stockmanagement's « Opening Stock » (initial)
ENTERED = ('import', 'new-item')
MUTATE = 'Task: stockmanagement.stockoperations.mutate'    # create, submit, complete
APPROVE = 'Task: stockmanagement.stockoperations.approve'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
REL = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
HEADERS = {'n°': 'n', 'produit': 'produit', 'forme': 'forme', 'dosage': 'dosage', 'n° de lot': 'lot',
           'date de peremption': 'expiry', 'date de péremption': 'expiry', 'stock': 'stock',
           'prix unitaire': 'price'}


# ------------------------------------------------------------------ the pharmacy's file
def read_xlsx(path):
    """Rows of the first worksheet as (row number, {column letter: value}); stdlib only."""
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
                shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
        book = ET.fromstring(z.read('xl/workbook.xml'))
        rid = book.find('m:sheets/m:sheet', NS).get(REL)
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        target = next(r.get('Target') for r in rels if r.get('Id') == rid)
        sheet = ET.fromstring(z.read('xl/' + target.lstrip('/').replace('xl/', '', 1)))
    rows = []
    for r in sheet.iter('{%s}row' % NS['m']):
        cells = {}
        for c in r.findall('m:c', NS):
            col = re.match(r'[A-Z]+', c.get('r')).group(0)
            t, v = c.get('t'), c.find('m:v', NS)
            if t == 'inlineStr':
                cells[col] = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
            elif v is None:
                continue
            elif t == 's':
                cells[col] = shared[int(v.text)]
            elif t in ('str', 'e', 'b'):
                cells[col] = v.text or ''
            else:
                cells[col] = float(v.text)
        rows.append((int(r.get('r')), cells))
    return rows


def cell_text(value):
    """A cell as text; a number typed in a text column (a lot number such as 251068) loses its '.0'."""
    if isinstance(value, float) and value == int(value):
        return str(int(value))
    return str(value if value is not None else '').strip()


def norm(text):
    return re.sub(r'\s+', ' ', str(text or '')).strip().casefold()


def fold(text):
    """norm() without accents: « Ampoule(s) », « ampoule(s) » and « AMPOULE(S) » are one name."""
    return ''.join(c for c in unicodedata.normalize('NFD', norm(text)) if unicodedata.category(c) != 'Mn')


def file_lines(rows):
    """Product lines of the file, with their section (Médicaments, Consommables, Laboratoire)."""
    header_row, cols = None, {}
    for num, cells in rows:
        found = {HEADERS[norm(v)]: col for col, v in cells.items() if norm(v) in HEADERS}
        if 'produit' in found and 'stock' in found:
            header_row, cols = num, found
            break
    if header_row is None:
        raise SystemExit('no header row with PRODUIT and Stock in the first worksheet')
    lines, section = [], ''
    for num, cells in rows:
        if num <= header_row:
            continue
        values = {k: cells.get(col, '') for k, col in cols.items()}
        texts = [v for v in cells.values() if str(v).strip()]
        if len(texts) == 1 and not str(values.get('produit', '')).strip():
            section = str(texts[0]).strip()
            continue
        if str(values.get('produit', '')).strip():
            values.update(row=num, section=section)
            lines.append(values)
    return lines


def parse_expiry(value):
    """(date, note). Excel date serials, ISO dates and dd/mm/yyyy with / . or - separators.
    A day past the end of its month becomes the month's last day, with a note."""
    if value in ('', None):
        return None, 'no expiry'
    if isinstance(value, float):
        return datetime.date(1899, 12, 30) + datetime.timedelta(days=int(value)), ''
    text = str(value).strip()
    m = re.match(r'^(\d{4})-(\d{1,2})-(\d{1,2})', text)
    if m:
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
    else:
        m = re.match(r'^(\d{1,2})\s*[/.\-]\s*(\d{1,2})\s*[/.\-]\s*(\d{4})$', text)
        if not m:
            return None, 'unreadable expiry %r' % text
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if not 1 <= mo <= 12 or d < 1:
        return None, 'unreadable expiry %r' % text
    last = calendar.monthrange(y, mo)[1]
    note = ''
    if d > last or not re.match(r'^\d{1,2}/\d{1,2}/\d{4}$|^\d{4}-', text):
        note = 'expiry %r read as %02d/%02d/%d' % (text, min(d, last), mo, y)
    return datetime.date(y, mo, min(d, last)), note


def quantity(value):
    try:
        q = float(str(value).replace(',', '.').strip() or 0)
    except ValueError:
        return None
    return int(q) if q == int(q) else None


# ------------------------------------------------------------------ plan
def load_matching(path):
    with open(path, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    matching = {}
    for r in rows:
        key = norm(r['produit'])
        if key in matching and matching[key]['stock_item_uuid'] != r['stock_item_uuid']:
            raise SystemExit('matching: %r is matched twice, to different stock items' % r['produit'])
        matching[key] = r
    return matching


def plan(lines, matching, op_date):
    """Every line with stock, as an entry: entered (bool), the line, its match and a note."""
    out = []
    for line in lines:
        qty = quantity(line.get('stock'))
        if qty is not None and qty <= 0:
            continue
        m = matching.get(norm(line['produit']))
        entry = {'line': line, 'match': m, 'qty': qty, 'lot': cell_text(line.get('lot')),
                 'entered': False, 'note': '', 'date_note': ''}
        expiry, entry['date_note'] = parse_expiry(line.get('expiry'))
        entry['expiry'] = expiry
        if qty is None:
            entry['note'] = 'stock %r is not a whole number' % line.get('stock')
        elif m is None:
            entry['note'] = 'unmatched: not in the matching file'
        elif m['status'] not in ENTERED:
            entry['note'] = '%s: %s' % (m['status'], m['reason'])
        elif not entry['lot']:
            entry['note'] = 'no lot number'
        elif expiry is None:
            entry['note'] = entry['date_note']
        elif expiry <= op_date:
            entry['note'] = 'expired %s: to discard' % expiry.strftime('%d/%m/%Y')
        else:
            entry['entered'] = True
        out.append(entry)
    return out


def report(entries, out=sys.stdout):
    def p(*a):
        print(*a, file=out)
    entered = [e for e in entries if e['entered']]
    p('Lines with stock: %d; to enter: %d; left out: %d' % (len(entries), len(entered), len(entries) - len(entered)))
    by = {}
    for e in entries:
        if not e['entered']:
            by.setdefault(e['note'].split(':')[0].split(' ')[0], []).append(e)
    for kind, es in sorted(by.items()):
        p('\n%s (%d):' % (kind, len(es)))
        for e in es:
            p('  row %-4s %-45s %6s  %s' % (e['line']['row'], e['line']['produit'].strip()[:45], e['qty'], e['note']))
    fixed = [e for e in entries if e['date_note'] and e['expiry']]
    if fixed:
        p('\nExpiry dates corrected (%d):' % len(fixed))
        for e in fixed:
            p('  row %-4s %-45s %s' % (e['line']['row'], e['line']['produit'].strip()[:45], e['date_note']))
    unpriced = [e for e in entries if str(e['line'].get('price', '')).strip() in ('', '0', '0.0')]
    if unpriced:
        p('\nNo unit price in the file (prices are entered in Odoo) (%d):' % len(unpriced))
        for e in unpriced:
            p('  row %-4s %s' % (e['line']['row'], e['line']['produit'].strip()))


def write_plan(entries, path):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['row', 'section', 'produit', 'forme', 'dosage', 'lot', 'expiry', 'quantity', 'entered',
                    'stock_item_uuid', 'stock_item', 'unit', 'confidence', 'note', 'expiry_note'])
        for e in entries:
            line, m = e['line'], e['match'] or {}
            w.writerow([line['row'], line['section'], line['produit'].strip(), line.get('forme', ''), line.get('dosage', ''),
                        e['lot'], e['expiry'].isoformat() if e['expiry'] else '', e['qty'], 'yes' if e['entered'] else 'no',
                        m.get('stock_item_uuid', ''), m.get('stock_item', ''), m.get('stock_item_unit', ''),
                        m.get('confidence', ''), e['note'], e['date_note']])


# ------------------------------------------------------------------ server
class OpenMRS:
    def __init__(self, url, auth_url, user, password):
        self.url = url.rstrip('/') + '/openmrs/ws/rest/v1'
        self.token_url = auth_url.rstrip('/') + '/realms/ozone/protocol/openid-connect/token'
        self.credentials = urllib.parse.urlencode({'client_id': 'admin-cli', 'grant_type': 'password',
                                                   'username': user, 'password': password}).encode()
        self.sign_in()

    def sign_in(self):
        with urllib.request.urlopen(urllib.request.Request(self.token_url, self.credentials)) as r:
            self.token = json.load(r)['access_token']

    def call(self, method, path, body=None, retry=True):
        req = urllib.request.Request(self.url + path, method=method,
                                     data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': 'Bearer ' + self.token,
                                              'Content-Type': 'application/json', 'Accept': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                text = r.read().decode()
        except urllib.error.HTTPError as e:
            if e.code == 401 and retry:
                self.sign_in()
                return self.call(method, path, body, False)
            raise SystemExit('%s %s -> %s %s' % (method, path.split('?')[0], e.code, e.read().decode()[:2000]))
        try:
            return json.loads(text) if text else {}
        except ValueError:
            # An expired token gets the sign-in page instead of JSON: sign in again, once.
            if retry and method == 'GET':
                self.sign_in()
                return self.call(method, path, body, False)
            raise SystemExit('%s %s -> not JSON: %s' % (method, path.split('?')[0], text[:300]))

    def get(self, path, **params):
        return self.call('GET', path + '?' + urllib.parse.urlencode(params))

    def all(self, path, **params):
        # stockmanagement pages by page number: startIndex 0, 1, 2... of `limit` results each.
        out, page_no = [], 0
        while True:
            page = self.get(path, startIndex=page_no, limit=100, **params)
            out += page['results']
            if not page['results'] or not any(link.get('rel') == 'next' for link in page.get('links', [])):
                return out
            page_no += 1


def unit_concept(item):
    """The concept of the unit quantities are entered in: the dispensing packaging unit's, else the
    item's dispensing unit (the same concept in every UVL seed)."""
    for pu in item.get('packagingUnits') or []:
        if pu.get('uuid') == item.get('dispensingUnitPackagingUoMUuid') and pu.get('packagingUomUuid'):
            return pu['packagingUomUuid']
    return item.get('dispensingUnitUuid')


class Units:
    """Names of unit concepts in every locale, read once per concept."""

    def __init__(self, om):
        self.om, self.names = om, {}

    def of(self, concept_uuid):
        if concept_uuid not in self.names:
            concept = self.om.get('/concept/%s' % concept_uuid, v='custom:(uuid,names:(name,locale))')
            self.names[concept_uuid] = [n.get('name') for n in concept.get('names') or [] if n.get('name')]
        return self.names[concept_uuid]

    def mismatch(self, item, expected):
        """None when the item's unit is `expected`, else what the server has. The displayed name is in
        the account's locale, so a different name is checked against every name of the concept."""
        shown = item.get('dispensingUnitPackagingUoMName') or item.get('dispensingUnitName') or ''
        if not expected or fold(shown) == fold(expected):
            return None
        concept = unit_concept(item)
        names = self.of(concept) if concept else []
        if fold(expected) in {fold(n) for n in names}:
            return None
        return '%r (concept %s: %s)' % (shown, concept, ', '.join(sorted(set(names))) or 'no names')


def scope_problem(om, party, approval):
    """Why the signed-in account cannot do an Opening Stock at the party's location, or None.

    stockmanagement's GET /stockmanagement/session lists the account's effective privilege scopes,
    computed as the module computes them when it checks an operation: role scopes of the user that
    are enabled, not voided, permanent or active today, expanded to descendant locations, crossed
    with the privileges the scope's role lists (its own and its parents'). A scope on a role that
    lists no stock privilege therefore yields nothing here, as it grants nothing there."""
    needed = [MUTATE] + ([APPROVE] if approval else [])
    scopes = om.get('/stockmanagement/session', v='default').get('privileges') or []
    held = {s.get('privilege') for s in scopes
            if s.get('operationTypeUuid') == OPENING_STOCK_TYPE and s.get('locationUuid') == party['locationUuid']}
    missing = [p for p in needed if p not in held]
    if not missing:
        return None
    return ('the account has no stock scope giving %s for Opening Stock at %s. Give one of its roles a '
            'stock user role scope (Opening Stock, this location, enabled, in its dates) on a role that lists '
            'these privileges; a scope on a role without stock privileges, such as a super-user role, grants '
            'nothing' % (' and '.join('« %s »' % p for p in missing), party['name']))


def iso(dt):
    return dt.strftime('%Y-%m-%dT%H:%M:%S.000+0000')


def apply(args, entries, op_date, om=None):
    if om is None:
        password = os.environ.get('OPENMRS_PASSWORD') or getpass.getpass('Password for %s: ' % args.user)
        om = OpenMRS(args.url, args.auth_url or args.url.replace('://', '://auth.', 1), args.user, password)
    session = om.get('/session', v='custom:(authenticated,user:(uuid,username))')
    if not session.get('authenticated'):
        raise SystemExit('sign-in failed for %s' % args.user)
    parties = [p for p in om.all('/stockmanagement/party', v='default')
               if p.get('locationUuid') and args.location in (p.get('name'), p.get('locationUuid'))]
    if len(parties) != 1:
        raise SystemExit('stock location %r: %d matches' % (args.location, len(parties)))
    party = parties[0]
    problem = scope_problem(om, party, not args.no_approval)
    if problem and args.commit:
        raise SystemExit('nothing created: %s' % problem)
    if problem:
        print('WARNING: %s; --commit would stop here.\n' % problem)
    in_stock = {(b.get('stockItemUuid'), (b.get('batchNo') or '').strip())
                for b in om.all('/stockmanagement/stockbatch', v='default', locationUuid=party['locationUuid'],
                                excludeEmptyStock='true')}
    items = {i['uuid']: i for i in om.all('/stockmanagement/stockitem', v='full')}
    lines, skipped = [], []
    for e in [e for e in entries if e['entered']]:
        uuid = e['match']['stock_item_uuid']
        item = items.get(uuid)
        if not item or item.get('voided') or not item.get('dispensingUnitPackagingUoMUuid'):
            skipped.append((e, 'stock item %s not on this server yet (or without a dispensing unit)' % uuid))
        elif (uuid, e['lot']) in in_stock:
            skipped.append((e, 'lot %s already in stock at %s' % (e['lot'], party['name'])))
        else:
            lines.append((e, item))
    for e, why in skipped:
        print('skip row %s %s: %s' % (e['line']['row'], e['line']['produit'].strip(), why))
    total = sum(e['qty'] for e, _ in lines)
    print('\n%s: %d lines, %d stock items, %d units in total, at %s, as %s'
          % ('COMMIT' if args.commit else 'DRY RUN', len(lines), len({i['uuid'] for _, i in lines}), total,
             party['name'], args.user))
    units = Units(om)
    for e, item in lines:
        other = units.mismatch(item, e['match'].get('stock_item_unit'))
        if other:
            raise SystemExit('row %s: the stock item\'s unit is %s on the server, the matching says %r'
                             % (e['line']['row'], other, e['match']['stock_item_unit']))
    if not args.commit or not lines:
        return
    digest = hashlib.sha1(json.dumps([[i['uuid'], e['lot'], e['qty']] for e, i in lines]).encode()).hexdigest()[:8]
    operation = om.call('POST', '/stockmanagement/stockoperation', {
        'operationTypeUuid': OPENING_STOCK_TYPE,
        'sourceUuid': party['uuid'],
        'operationDate': iso(op_date_time(args)),
        'responsiblePersonUuid': session['user']['uuid'],  # a user, not a person, in stockmanagement
        'approvalRequired': not args.no_approval,
        'externalReference': 'OUVERTURE-%s' % digest,
        'remarks': args.remarks,
        'stockOperationItems': [{
            'stockItemUuid': item['uuid'],
            'stockItemPackagingUOMUuid': item['dispensingUnitPackagingUoMUuid'],
            'batchNo': e['lot'],
            'expiration': e['expiry'].strftime('%Y-%m-%dT12:00:00.000+0000'),
            'quantity': e['qty'],
        } for e, item in lines]})
    uuid = operation.get('uuid')
    if not uuid:
        # stockmanagement 2.1.2-uvl lets a stock administrator (« Task: stockmanagement.userRoleScopes.mutate »,
        # so any super user) create an operation without a scope; on production the response then came
        # back without a uuid, after the draft was created. scope_problem stops this case up front.
        raise SystemExit('the server created the operation but returned it without a uuid: the account most '
                         'likely has no effective stock scope for Opening Stock at %s. A draft may exist with '
                         'reference %s: once the scope is given, cancel it in the stock app before running again.'
                         % (party['name'], 'OUVERTURE-%s' % digest))
    print('created %s (%s)' % (operation.get('operationNumber'), uuid))
    for action in (('COMPLETE',) if args.no_approval else ('SUBMIT', 'APPROVE')):
        om.call('POST', '/stockmanagement/stockoperationaction', {'name': action, 'uuid': uuid})
        print(action.lower(), 'done')
    done = om.call('GET', '/stockmanagement/stockoperation/%s?v=default' % uuid)
    print('status: %s, operation %s' % (done.get('status'), done.get('operationNumber')))


def op_date_time(args):
    if args.operation_date:
        return datetime.datetime.strptime(args.operation_date, '%Y-%m-%d').replace(hour=12)
    return datetime.datetime.utcnow() - datetime.timedelta(minutes=5)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('command', choices=['plan', 'apply'])
    ap.add_argument('--file', required=True, help="the pharmacy's count file (.xlsx)")
    ap.add_argument('--matching', default=DEFAULT_MATCHING)
    ap.add_argument('--operation-date', help='YYYY-MM-DD, the day of the count (default: now)')
    ap.add_argument('--out', help='plan: write every line with its decision to this CSV')
    ap.add_argument('--url', help='apply: the EMR, e.g. https://uvl-emr-uat.madiro.org')
    ap.add_argument('--auth-url', help='apply: Keycloak (default: the EMR host prefixed with auth.)')
    ap.add_argument('--user', help='apply: the pharmacist who enters the stock')
    ap.add_argument('--location', default='Pharmacie (Rx)', help='apply: stock location name or uuid')
    ap.add_argument('--remarks', default="Stock d'ouverture (comptage de la pharmacie)")
    ap.add_argument('--commit', action='store_true', help='apply: create, submit and approve the operation')
    ap.add_argument('--no-approval', action='store_true',
                    help="apply: complete the operation in one step (the app's « Compléter ») instead of submit + approve")
    args = ap.parse_args(argv)
    op_date = op_date_time(args).date()
    entries = plan(file_lines(read_xlsx(args.file)), load_matching(args.matching), op_date)
    report(entries)
    if args.out:
        write_plan(entries, args.out)
    if args.command == 'apply':
        if not args.url or not args.user:
            raise SystemExit('apply needs --url and --user')
        apply(args, entries, op_date)


if __name__ == '__main__':
    main()
