#!/usr/bin/env groovy
/*
  Fails the build when Odoo would refuse a per-product insurance coverage file. Run from
  sites/mugamba/pom.xml at prepare-package, against the assembled Odoo initializer_config, so
  it sees every layer (Ozone, distro, site).

  Odoo's importer loads each insurance_coverage/*.csv as a whole: one row it cannot take (a
  product or plan it does not know, a second row for the same plan and product) rejects the
  whole file, and the initializer still records its checksum, so nothing says so (#184). For
  MFP a rejected file means every product in it is paid at the plan default on the full clinic
  price: no 70% on consumables, no MFP price ceiling.

  Checks, over every CSV of insurance_coverage/:

  1. The columns are id, insurance_id/id, product_id/id, coverage_percentage,
     covered_base_mode, covered_base_amount.
  2. Each id, and each (plan, product) pair, appears once across all the files.
  3. The plan is an insurance partner of partner/*.csv; the product is in product_variant/.
  4. The percentage is 0 to 100; the mode is full (no amount) or amount (a whole number of
     francs above 0).
  5. Every product the MFP matching (sites/mugamba/requirements/
     mfp-acts-devices-matching-issue184.csv) marks « load » has its MFP row at the matched
     price and percentage, and every MFP ceiling on a product of that matching is one it
     loads. A product the matching gives a percentage without loading it (MFP's own 80% on a
     bandage whose ceiling is still open) has its MFP row at that percentage.
     scripts/mfp-ceiling.py writes both, so they only drift on a hand edit.
*/

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/odoo/initializer_config")
File coverageDir = new File(configDir, 'insurance_coverage')
File matchingFile = new File(project.basedir, 'requirements/mfp-acts-devices-matching-issue184.csv')

if (!coverageDir.isDirectory()) {
    log.info("No Odoo insurance_coverage in the build output, nothing to check")
    return
}

List<String> COLUMNS = ['id', 'insurance_id/id', 'product_id/id', 'coverage_percentage',
                        'covered_base_mode', 'covered_base_amount']
String MFP_PLAN = 'init.insurance_plan_mfp'
List<String> faults = []

// Minimal RFC 4180 reader: quoted fields may hold commas, doubled quotes and newlines.
List<List<String>> readCsv(File file) {
    String text = file.getText('UTF-8')
    if (text.startsWith('﻿')) {
        text = text.substring(1)
    }
    List<List<String>> rows = []
    List<String> row = []
    StringBuilder field = new StringBuilder()
    boolean quoted = false
    int i = 0
    while (i < text.length()) {
        char c = text.charAt(i)
        if (quoted) {
            if (c == '"' as char) {
                if (i + 1 < text.length() && text.charAt(i + 1) == '"' as char) {
                    field.append('"')
                    i++
                } else {
                    quoted = false
                }
            } else {
                field.append(c)
            }
        } else if (c == '"' as char) {
            quoted = true
        } else if (c == ',' as char) {
            row << field.toString()
            field.setLength(0)
        } else if (c == '\n' as char || c == '\r' as char) {
            if (c == '\r' as char && i + 1 < text.length() && text.charAt(i + 1) == '\n' as char) {
                i++
            }
            row << field.toString()
            field.setLength(0)
            if (row.size() > 1 || row[0]) {
                rows << row
            }
            row = []
        } else {
            field.append(c)
        }
        i++
    }
    if (field.length() > 0 || !row.isEmpty()) {
        row << field.toString()
        rows << row
    }
    return rows
}


List<Map<String, String>> records(File file) {
    List<List<String>> rows = readCsv(file)
    if (rows.isEmpty()) {
        return []
    }
    List<String> header = rows[0]*.trim()
    return rows.drop(1).collect { List<String> row ->
        Map<String, String> m = [:]
        header.eachWithIndex { String h, int i -> m[h] = i < row.size() ? row[i].trim() : '' }
        m
    }
}

Set<String> plans = [] as Set
new File(configDir, 'partner').listFiles()?.findAll { it.name.endsWith('.csv') }?.each { File f ->
    records(f).findAll { it['is_insurance']?.toLowerCase() == 'true' }.each { plans << it['id'] }
}
Set<String> products = [] as Set
new File(configDir, 'product_variant').listFiles()?.findAll { it.name.endsWith('.csv') }?.each { File f ->
    records(f).each { products << it['id'] }
}

Map<String, String> idSeen = [:]
Map<String, String> pairSeen = [:]
Map<String, Map<String, String>> mfpRows = [:]
coverageDir.listFiles().findAll { it.isFile() && it.name.toLowerCase().endsWith('.csv') }.sort { it.name }.each { File file ->
    String name = "insurance_coverage/${file.name}"
    List<List<String>> raw = readCsv(file)
    if (raw.isEmpty()) {
        return
    }
    if (raw[0]*.trim() != COLUMNS) {
        faults << "${name}: columns ${raw[0]} instead of ${COLUMNS}"
        return
    }
    List<Map<String, String>> rows = records(file)
    rows.eachWithIndex { Map<String, String> r, int n ->
        String at = "${name} row ${n + 2}"
        if (idSeen.containsKey(r['id'])) {
            faults << "${at}: id ${r['id']} is also in ${idSeen[r['id']]}"
        }
        idSeen[r['id']] = at
        String pair = "${r['insurance_id/id']} ${r['product_id/id']}"
        if (pairSeen.containsKey(pair)) {
            faults << "${at}: ${r['product_id/id']} already has a row for ${r['insurance_id/id']} in " +
                    "${pairSeen[pair]}; Odoo rejects the whole file"
        }
        pairSeen[pair] = at
        if (!(r['insurance_id/id'] in plans)) {
            faults << "${at}: ${r['insurance_id/id']} is not an insurance plan of partner/"
        }
        if (!(r['product_id/id'] in products)) {
            faults << "${at}: no product ${r['product_id/id']} in product_variant/; Odoo rejects the whole file"
        }
        BigDecimal pct = r['coverage_percentage']?.isBigDecimal() ? r['coverage_percentage'].toBigDecimal() : null
        if (pct == null || pct < 0 || pct > 100) {
            faults << "${at}: coverage_percentage '${r['coverage_percentage']}' is not 0 to 100"
        }
        String amount = r['covered_base_amount']
        if (r['covered_base_mode'] == 'full') {
            if (amount) {
                faults << "${at}: mode full with an amount (${amount}); use mode amount for a ceiling"
            }
        } else if (r['covered_base_mode'] == 'amount') {
            if (!(amount ==~ /[1-9][0-9]*/)) {
                faults << "${at}: mode amount needs a whole number of francs above 0, not '${amount}'"
            }
        } else {
            faults << "${at}: covered_base_mode '${r['covered_base_mode']}' is not full or amount"
        }
        if (r['insurance_id/id'] == MFP_PLAN) {
            mfpRows[r['product_id/id']] = r + [at: at]
        }
    }
    log.info("Insurance coverage OK so far: ${name} (${rows.size()} rows)")
}

if (matchingFile.isFile()) {
    int loads = 0
    records(matchingFile).each { Map<String, String> m ->
        Map<String, String> r = mfpRows[m['product_id']]
        if (m['decision'] == 'load') {
            loads++
            if (r == null || r['covered_base_mode'] != 'amount' || r['covered_base_amount'] != m['mfp_price'] ||
                    r['coverage_percentage'] != m['coverage_percentage']) {
                faults << ("${m['product']} (${m['product_id']}): the MFP matching loads ${m['coverage_percentage']}% " +
                        "of at most ${m['mfp_price']} BIF, but insurance_coverage has " +
                        (r == null ? 'no MFP row' : "${r['coverage_percentage']}%, ${r['covered_base_mode']} " +
                                "${r['covered_base_amount']} (${r['at']})") + ". Run scripts/mfp-ceiling.py")
            }
        } else if (r != null && r['covered_base_mode'] == 'amount') {
            faults << ("${m['product']} (${m['product_id']}): ${r['at']} sets an MFP ceiling the matching does " +
                    "not load (${m['decision']}). Run scripts/mfp-ceiling.py")
        } else if (m['coverage_percentage'] && (r == null || r['coverage_percentage'] != m['coverage_percentage'])) {
            // MFP's own rate on a product whose ceiling is not known yet (a bandage of unknown width)
            faults << ("${m['product']} (${m['product_id']}): the MFP matching sets ${m['coverage_percentage']}% " +
                    "without a ceiling, but insurance_coverage has " +
                    (r == null ? 'no MFP row' : "${r['coverage_percentage']}% (${r['at']})") +
                    ". Run scripts/mfp-ceiling.py")
        }
    }
    log.info("Insurance coverage OK so far: ${loads} MFP ceilings of the acts and consumables matching")
}

if (faults) {
    throw new IllegalStateException("Odoo would reject or misread an insurance coverage file:\n  - " +
            faults.join('\n  - '))
}
log.info("Insurance coverage OK: ${pairSeen.size()} rows, one per plan and product, all known to Odoo")
