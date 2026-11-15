#!/usr/bin/env groovy
/*
  Fails the build when a UVL encounter type, visit type, visit attribute type, order type or
  form lacks its French or its English name. Run from sites/mugamba/pom.xml at prepare-package, against the
  site's own initializer_config: the Ozone metadata it inherits is not UVL's to translate.

  The interface is French and English (#499). Each of these shows the wrong language without a
  word in any log:

  1. Encounter types, visit types and visit attribute types. The REST `display` of OpenMRS
     metadata, which O3 shows (visit type, encounter list, the start-visit form's "Origin",
     "Case Type", "Payer"...), is the message `ui.i18n.<Class>.name.<uuid>` in the session
     locale. Initializer writes that message from a `Display:<locale>` column on every CSV
     domain. Every row not retired needs both `Display:fr` and `Display:en`: when the session
     locale has no message, the Initializer message source falls back to the system default
     locale (French on UVL) before English, so with `Display:fr` alone an English session shows
     French (UAT, 5 Nov 2026).

  2. Any other `<header>:<locale>` column in those three domains. Initializer localises metadata
     only through `Display:<locale>`, and drops an unknown header without a warning. Until #499
     the visit attribute types carried their French names in a `Name:fr` column, so the visit
     form stayed in English.

  3. Forms. The forms list shows the form's REST `display`, which Initializer localises from
     `form_name_translation` in the form's `_translations_<locale>.json`, with the same
     fallback. Every form in ampathforms needs both files and that key in each. Until #499 only
     two of the seventeen forms had a French name, and none an English one.
*/

import groovy.json.JsonSlurper

// Order types: the test and procedure order panels are titled with the order type's `display`
// (« procedure », « test order » in a French session until #529).
List<String> metadataDomains = ['encountertypes', 'visittypes', 'attributetypes', 'ordertypes']
List<String> locales = ['fr', 'en']

File configDir = new File(project.basedir, 'configs/openmrs/initializer_config')
if (!configDir.isDirectory()) {
    log.info("No configs/openmrs/initializer_config in ${project.basedir}, nothing to check")
    return
}

// Splits one CSV line, honouring double-quoted fields and "" escapes.
List<String> splitCsvLine(String line) {
    List<String> fields = []
    StringBuilder field = new StringBuilder()
    boolean quoted = false
    for (int i = 0; i < line.length(); i++) {
        char c = line.charAt(i)
        if (quoted) {
            if (c == '"' as char) {
                if (i + 1 < line.length() && line.charAt(i + 1) == '"' as char) {
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
            fields << field.toString()
            field.setLength(0)
        } else {
            field.append(c)
        }
    }
    fields << field.toString()
    return fields
}

List<String> problems = []
int checkedRows = 0

metadataDomains.each { domain ->
    File dir = new File(configDir, domain)
    if (!dir.isDirectory()) {
        return
    }
    dir.eachFileRecurse(groovy.io.FileType.FILES) { f ->
        if (!f.name.toLowerCase().endsWith('.csv')) {
            return
        }
        String where = "${domain}/${f.name}"
        List<String> lines = f.readLines('UTF-8').findAll { it.trim() }
        if (lines.isEmpty()) {
            return
        }
        List<String> header = splitCsvLine(lines[0]).collect { it.trim().toLowerCase() }
        header.findAll { it.contains(':') && !it.startsWith('_') && !it.startsWith('display:') }.each {
            problems << "${where}: column '${it}' is ignored by Initializer; localised names go in 'Display:<locale>'"
        }
        int nameCol = header.indexOf('name')
        int retireCol = header.indexOf('void/retire')
        lines.drop(1).each { line ->
            List<String> row = splitCsvLine(line)
            if (retireCol >= 0 && row.size() > retireCol && row[retireCol].trim().equalsIgnoreCase('true')) {
                return
            }
            checkedRows++
            String name = nameCol >= 0 && row.size() > nameCol ? row[nameCol].trim() : row[0]
            locales.each { locale ->
                // A plain String: List.indexOf compares with equals, which a GString never matches.
                int displayCol = header.indexOf("display:${locale}".toString())
                if (displayCol < 0 || row.size() <= displayCol || !row[displayCol].trim()) {
                    problems << "${where}: '${name}' has no 'Display:${locale}', so a '${locale}' session " +
                            "shows another language"
                }
            }
        }
    }
}

File formsDir = new File(configDir, 'ampathforms')
File translationsDir = new File(configDir, 'ampathformstranslations')
int checkedForms = 0
if (formsDir.isDirectory()) {
    def slurper = new JsonSlurper()
    formsDir.listFiles().findAll { it.name.endsWith('.json') }.sort { it.name }.each { formFile ->
        checkedForms++
        String formName = slurper.parse(formFile, 'UTF-8').name
        locales.each { locale ->
            File translations = new File(translationsDir,
                    formFile.name.replaceAll(/\.json$/, "_translations_${locale}.json"))
            if (!translations.isFile()) {
                problems << "ampathforms/${formFile.name}: no ampathformstranslations/${translations.name}"
                return
            }
            def json = slurper.parse(translations, 'UTF-8')
            if (json.form != formName) {
                problems << "ampathformstranslations/${translations.name}: 'form' is '${json.form}' but the form " +
                        "is named '${formName}'; Initializer would not find it"
            }
            if (!(json.form_name_translation instanceof String) || !json.form_name_translation.trim()) {
                problems << "ampathformstranslations/${translations.name}: no 'form_name_translation', so a " +
                        "'${locale}' session lists '${formName}' in another language"
            }
        }
    }
}

log.info("Checked the French and English names of ${checkedRows} metadata rows and ${checkedForms} forms")
if (problems) {
    problems.each { log.error(it) }
    throw new IllegalStateException("${problems.size()} metadata name problem(s), see above (scripts/check-french-metadata.groovy)")
}
