#!/usr/bin/env groovy
/*
  Fails the build when the site frontend config asks the patient banner to show a person
  attribute it cannot show. Run from sites/mugamba/pom.xml at prepare-package, against the
  site's own frontend config and personattributetypes.

  1. `@openmrs/esm-patient-banner-app.contactAttributeTypes` may only list attribute types that
     hold text. The banner's contact details print an attribute's raw `value`
     (esm-patient-banner-app 13.0.2-pre.12863), and the REST API returns the value of an
     `org.openmrs.Concept` attribute as an object ({uuid, display, links}), which React refuses
     to render: the contact details panel breaks. « État civil » and « Profession » are Concept
     attributes, so they are shown with the banner app's `person-attribute-tag` extension
     instead, which prints the concept's name (#753).

  2. Every attribute type the banner is given (contact details or a `person-attribute-tag`) must
     exist in the site's personattributetypes. An unknown uuid is not an error anywhere: the
     banner just shows nothing.

  The Telephone Number type is OpenMRS core metadata, but UVL lists it in its own CSV for its
  French name (#529), so the site CSV is the whole list.
*/

import groovy.json.JsonSlurper

String bannerModule = '@openmrs/esm-patient-banner-app'
String tagExtension = 'person-attribute-tag'

File frontendConfigDir = new File(project.basedir, 'configs/openmrs/frontend_config')
File attributeTypesDir = new File(project.basedir, 'configs/openmrs/initializer_config/personattributetypes')
if (!frontendConfigDir.isDirectory() || !attributeTypesDir.isDirectory()) {
    log.info("No frontend config or personattributetypes in ${project.basedir}, nothing to check")
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

// uuid -> [name, format] of every attribute type not retired.
Map<String, Map<String, String>> attributeTypes = [:]
attributeTypesDir.eachFileRecurse(groovy.io.FileType.FILES) { f ->
    if (!f.name.toLowerCase().endsWith('.csv')) {
        return
    }
    List<String> lines = f.readLines('UTF-8').findAll { it.trim() }
    if (lines.isEmpty()) {
        return
    }
    List<String> header = splitCsvLine(lines[0]).collect { it.trim().toLowerCase() }
    int uuidCol = header.indexOf('uuid')
    int nameCol = header.indexOf('name')
    int formatCol = header.indexOf('format')
    int retireCol = header.indexOf('void/retire')
    lines.drop(1).each { line ->
        List<String> row = splitCsvLine(line)
        if (retireCol >= 0 && row.size() > retireCol && row[retireCol].trim().equalsIgnoreCase('true')) {
            return
        }
        String uuid = uuidCol >= 0 && row.size() > uuidCol ? row[uuidCol].trim() : ''
        if (uuid) {
            attributeTypes[uuid] = [
                    name  : nameCol >= 0 && row.size() > nameCol ? row[nameCol].trim() : uuid,
                    format: formatCol >= 0 && row.size() > formatCol ? row[formatCol].trim() : '']
        }
    }
}

List<String> problems = []
int checked = 0
def slurper = new JsonSlurper()

frontendConfigDir.listFiles().findAll { it.name.endsWith('.json') }.sort { it.name }.each { configFile ->
    def banner = slurper.parse(configFile, 'UTF-8')[bannerModule]
    if (!(banner instanceof Map)) {
        return
    }
    (banner.contactAttributeTypes ?: []).each { String uuid ->
        checked++
        def type = attributeTypes[uuid]
        if (!type) {
            problems << "${configFile.name}: ${bannerModule}.contactAttributeTypes lists ${uuid}, which is not " +
                    "in personattributetypes"
        } else if (type.format == 'org.openmrs.Concept') {
            problems << "${configFile.name}: ${bannerModule}.contactAttributeTypes lists '${type.name}', a " +
                    "Concept attribute the contact details cannot render; add a '${tagExtension}' to " +
                    "patient-banner-tags-slot instead (#753)"
        }
    }
    // Any module may configure the slot; the banner app's section is where UVL does.
    slurper.parse(configFile, 'UTF-8').each { String module, moduleConfig ->
        def slot = moduleConfig instanceof Map ? moduleConfig.extensionSlots?.'patient-banner-tags-slot' : null
        if (!(slot instanceof Map)) {
            return
        }
        (slot.add ?: []).findAll { it == tagExtension || it.startsWith("${tagExtension}#") }.each { String id ->
            checked++
            String uuid = slot.configure?.get(id)?.attributeType
            if (!uuid) {
                problems << "${configFile.name}: ${module} adds '${id}' to patient-banner-tags-slot without an " +
                        "'attributeType', so it shows nothing"
            } else if (!attributeTypes[uuid]) {
                problems << "${configFile.name}: '${id}' shows attribute type ${uuid}, which is not in " +
                        "personattributetypes"
            }
        }
    }
}

log.info("Checked ${checked} person attribute(s) the patient banner shows")
if (problems) {
    problems.each { log.error(it) }
    throw new IllegalStateException("${problems.size()} patient banner problem(s), see above (scripts/check-patient-banner.groovy)")
}
