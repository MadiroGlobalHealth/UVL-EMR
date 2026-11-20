#!/usr/bin/env python3
"""
Read-only check: do the QWeb views stored in an Odoo database match the Odoo code in the image? (#839)

A database migrated from Odoo 14 (OpenUpgrade) keeps the views it was given at that time. A module's
data files are only read again when the module is installed or updated, so when the image carries an
older Odoo than the one that wrote the views, a stored template can call a helper the code does not
pass to it. On production the stored Factur-X line template called `format_unit_price`, which the
image does not provide: every « Envoyer et imprimer » failed with "'NoneType' object is not callable".

Two checks, both against `ir_ui_view` only (nothing is written; Odoo 17 keeps `arch_db` as one value
per language, the check reads the source language, `en_US`):

  1. helpers. Every `format_*` name used in a stored view must appear in the image's Python or
     JavaScript source.
     A name that appears nowhere is a helper the code cannot pass: the view fails when rendered.
     Looks at every view of the database.
  2. modules (with --module). Every template and view a module declares in its data files is
     compared with the stored one (XML compared by tags, attributes and text, whitespace ignored).
     A difference means the module was not updated since the view was written, or the view was
     edited by hand. A view the module declares and the database lacks is reported too.

Exit status: 0 nothing found, 1 a difference or a missing helper, 2 the check could not run.

The image's source is read from a directory, so the check needs no Odoo process:

  mkdir /tmp/odoo-src && docker run --rm --entrypoint tar <odoo image> -C /opt/odoo -c addons odoo \\
      | tar -x -C /tmp/odoo-src

  python3 scripts/check-odoo-stored-views.py --source /tmp/odoo-src --module account_edi_ubl_cii \\
      --psql "docker exec -i <postgres container> psql -U <user> -d <database>"

`--psql` is the command that opens psql on the database (default `psql`, which reads the PG*
variables); the check only sends it SELECT statements, one `-c` each. The module directories are
looked up under `<source>/addons/` and `<source>/odoo/addons/`.
"""
import argparse
import ast
import json
import os
import re
import shlex
import subprocess
import sys
import xml.etree.ElementTree as ET

HELPER = re.compile(r'\bformat_[a-z_0-9]+\b')


def query(psql, sql):
    """One SELECT through psql; `sql` must return a single JSON value."""
    if not sql.lstrip().lower().startswith('select'):
        raise ValueError('only SELECT is allowed')
    try:
        out = subprocess.run(shlex.split(psql) + ['-At', '-v', 'ON_ERROR_STOP=1', '-c', sql],
                             capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError) as exc:
        detail = getattr(exc, 'stderr', '') or exc
        sys.exit('cannot query the database (exit 2): %s' % str(detail).strip())
    return json.loads(out) if out else None


def python_text(source):
    """All the Python and JavaScript source of the image, as one string."""
    parts = []
    for root, _dirs, files in os.walk(source):
        for name in files:
            if name.endswith(('.py', '.js')):
                with open(os.path.join(root, name), encoding='utf-8', errors='replace') as handle:
                    parts.append(handle.read())
    return '\n'.join(parts)


def canonical(element):
    """Tags, attributes and text of an XML tree, whitespace and `<data>` wrappers ignored."""
    def walk(node):
        if node.tag is ET.Comment:
            return None
        children = [c for c in (walk(child) for child in node) if c is not None]
        return (node.tag, tuple(sorted(node.attrib.items())), ' '.join((node.text or '').split()),
                tuple(children), ' '.join((node.tail or '').split()))
    return walk(element)


def strip_data(element):
    """`<data>` only groups children, and an inheriting template keeps its `inherit_id` and `primary`
    on it in the stored arch (the ir.ui.view fields carry them): compare what is inside."""
    if element.tag == 'data':
        for name in ('inherit_id', 'primary'):
            element.attrib.pop(name, None)
        if len(element) == 1 and not element.attrib:
            return strip_data(element[0])
    return element


def module_dir(source, module):
    for sub in ('addons', os.path.join('odoo', 'addons')):
        path = os.path.join(source, sub, module)
        if os.path.isfile(os.path.join(path, '__manifest__.py')):
            return path
    return None


def declared_views(path, module):
    """{xml id: expected arch element} for the templates and ir.ui.view records in the data files."""
    with open(os.path.join(path, '__manifest__.py'), encoding='utf-8') as handle:
        manifest = ast.literal_eval(handle.read())
    declared = {}
    for data_file in manifest.get('data', []):
        if not data_file.endswith('.xml'):
            continue
        for node in ET.parse(os.path.join(path, data_file)).getroot().iter():
            if node.tag == 'template' and node.get('id'):
                if node.get('inherit_id'):
                    arch = ET.Element('data')
                    arch.extend(list(node))
                    if node.get('primary'):
                        # Odoo gives a primary template its name with this extra element
                        xpath = ET.SubElement(arch, 'xpath', {'expr': '.', 'position': 'attributes'})
                        ET.SubElement(xpath, 'attribute', {'name': 't-name'}).text = \
                            '%s.%s' % (module, node.get('id'))
                else:
                    arch = ET.Element('t', {'t-name': '%s.%s' % (module, node.get('id'))})
                    arch.extend(list(node))
                declared['%s.%s' % (module, node.get('id'))] = arch
            elif node.tag == 'record' and node.get('model') == 'ir.ui.view' and node.get('id'):
                field = next((f for f in node.findall('field') if f.get('name') == 'arch'), None)
                if field is not None and len(field):
                    arch = ET.Element('data')
                    arch.extend(list(field))
                    declared['%s.%s' % (module, node.get('id'))] = arch
    return declared


def check_helpers(psql, source):
    code = python_text(source)
    views = query(psql, "select coalesce(json_agg(json_build_object('key', coalesce(key, id::text), "
                        "'arch', arch_db::text)), '[]') from ir_ui_view where arch_db::text like '%format\\_%'") or []
    found = []
    for view in views:
        for helper in sorted(set(HELPER.findall(view['arch'] or ''))):
            if helper not in code:
                found.append('view %s calls %s, which the image does not provide' % (view['key'], helper))
    return found


def check_module(psql, source, module):
    path = module_dir(source, module)
    if path is None:
        return ['module %s not found under %s' % (module, source)], True
    declared = declared_views(path, module)
    stored = {v['key']: v['arch'] for v in query(
        psql, "select coalesce(json_agg(json_build_object('key', d.module || '.' || d.name, "
              "'arch', v.arch_db->>'en_US')), '[]') from ir_ui_view v join ir_model_data d "
              "on d.model = 'ir.ui.view' and d.res_id = v.id where d.module = '%s'"
              % module.replace("'", '')) or []}
    found = []
    for key, expected in sorted(declared.items()):
        if key not in stored:
            found.append('view %s is in the image and not in the database' % key)
            continue
        try:
            actual = ET.fromstring(stored[key])
        except ET.ParseError:
            found.append('view %s: the stored arch is not valid XML' % key)
            continue
        if canonical(strip_data(actual)) != canonical(strip_data(expected)):
            found.append('view %s differs from the image (module %s was not updated since it was written)'
                         % (key, module))
    return found, False


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--source', required=True, help='directory holding the image\'s addons/ and odoo/')
    parser.add_argument('--psql', default='psql', help='command that opens psql on the database')
    parser.add_argument('--module', action='append', default=[], help='compare this module\'s views (repeatable)')
    args = parser.parse_args()

    findings = check_helpers(args.psql, args.source)
    for module in args.module:
        module_findings, _missing = check_module(args.psql, args.source, module)
        findings += module_findings
    for finding in findings:
        print(finding)
    print('%d finding(s)' % len(findings))
    return 1 if findings else 0


if __name__ == '__main__':
    sys.exit(main())
