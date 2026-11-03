#!/usr/bin/env groovy
/*
  Fails the build when the Odoo configuration would overwrite a sale price. Run from
  sites/mugamba/pom.xml at prepare-package, against the assembled Odoo initializer_config,
  so it sees every layer (Ozone, distro, site).

  Finance owns prices in Odoo (#439). The Odoo initializer re-imports a CSV whenever the
  file changes or its checksum is cleared, which we do after every database restore, and
  Odoo keeps no history of price changes. A loader that writes lst_price on existing
  products therefore puts every price back to the file's value without a word. That is
  what product_price/prices.csv did for 290 products.

  Three checks:

  1. No entry in initializer_config.json loads product.product or product.template unless
     its field_rules make lst_price and list_price NO_UPDATE. The built-in product_variant
     loader already does, so it applies a price only when it creates the product.

  2. No CSV outside product_variant/ has an lst_price or list_price column.

  3. In product_variant/, a file with an lst_price column fills it on every row. An empty
     price imports as 0, which makes the product free.
*/

import groovy.json.JsonSlurper

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/odoo/initializer_config")

if (!configDir.isDirectory()) {
    log.info("No Odoo initializer_config in the build output, nothing to check")
    return
}

List<String> PRICE_COLUMNS = ['lst_price', 'list_price']
List<String> PRODUCT_MODELS = ['product.product', 'product.template']
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

File configJson = new File(configDir, 'initializer_config.json')
if (configJson.isFile()) {
    def config = new JsonSlurper().parse(configJson)
    config.models.each { model ->
        if (model.model_name in PRODUCT_MODELS) {
            Map rules = model.field_rules ?: [:]
            List<String> open = PRICE_COLUMNS.findAll { rules[it] != 'NO_UPDATE' }
            if (open) {
                faults << ("initializer_config.json loads ${model.model_name} from ${model.folder}/ " +
                        "without NO_UPDATE on ${open.join(', ')}: it would overwrite the prices finance " +
                        "sets in Odoo (#439)")
            }
        }
    }
}

configDir.eachFileRecurse { File file ->
    if (!file.isFile() || !file.name.toLowerCase().endsWith('.csv')) {
        return
    }
    String path = configDir.toPath().relativize(file.toPath()).toString()
    List<List<String>> rows = readCsv(file)
    if (rows.isEmpty()) {
        return
    }
    List<String> header = rows[0]*.trim()
    List<Integer> priceIdx = header.findIndexValues { it in PRICE_COLUMNS }*.intValue()
    if (priceIdx.isEmpty()) {
        return
    }
    if (!path.startsWith('product_variant/')) {
        faults << ("${path} sets ${priceIdx.collect { header[it] }.join(', ')}. Only product_variant/ " +
                "may carry a price, and only for products it creates (#439)")
        return
    }
    rows.drop(1).eachWithIndex { List<String> row, int n ->
        priceIdx.each { int idx ->
            if (idx >= row.size() || !row[idx]?.trim()) {
                faults << ("${path} row ${n + 2} (${row[0]}): empty ${header[idx]} imports as 0, a free " +
                        "product. Fill it on every row, or leave the column out and let finance price it")
            }
        }
    }
    log.info("Odoo prices OK: ${path} (${rows.size() - 1} rows, ${header[priceIdx[0]]} on creation only)")
}

if (faults) {
    throw new IllegalStateException("The Odoo configuration would overwrite or blank prices:\n  - " +
            faults.join('\n  - '))
}
log.info("Odoo prices OK: no loader overwrites an existing product's price")
