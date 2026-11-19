#!/usr/bin/env groovy
/*
  Fails the build when a medicine in openmrs/initializer_config/drugs/ points at a concept that
  no OCL export and no concepts CSV brings. Run from sites/mugamba/pom.xml at prepare-package,
  against the assembled build output, so it sees every layer (Ozone, distro, site).

  Initializer loads the OCL exports before the drugs. A row whose « Concept Drug » is not there
  fails with « No drug concept found for '<uuid>' », the medicine is not created and the only
  trace is a line in initializer.log: three medicines were missing that way from May 2025 until
  #787. A concept keeps the uuid OCL exports as `external_id`; a concept cloned or re-created in
  OCL gets a new one, so a uuid copied from elsewhere may never have been in an export.

  For every row that is not retired, « Concept Drug » and « Concept Dosage Form », when given as
  a uuid, must be the `external_id` of a concept in an OCL export or the Uuid of a row in
  concepts/. A value given as a name or a « SOURCE:code » mapping is not checked.
*/

import groovy.io.FileType
import groovy.json.JsonSlurper
import java.util.zip.ZipFile

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/openmrs/initializer_config")
File drugsDir = new File(configDir, 'drugs')
File oclDir = new File(configDir, 'ocl')
File conceptsDir = new File(configDir, 'concepts')

if (!drugsDir.isDirectory()) {
    log.info("No OpenMRS drugs in the build output, nothing to check")
    return
}

List<File> filesIn(File dir, String suffix) {
    List<File> files = []
    if (dir.isDirectory()) {
        dir.eachFileRecurse(FileType.FILES) { if (it.name.endsWith(suffix)) files << it }
    }
    return files.sort { it.path }
}

boolean isTrue(def value) {
    return value != null && value.toString().trim().equalsIgnoreCase('true')
}

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

def UUID = ~/(?i)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
List<String> CONCEPT_COLUMNS = ['Concept Drug', 'Concept Dosage Form']

// Every concept the configuration brings, by uuid (lower case).
Set<String> concepts = [] as Set
def slurper = new JsonSlurper()
filesIn(oclDir, '.zip').each { File zip ->
    new ZipFile(zip).withCloseable { ZipFile zf ->
        zf.entries().findAll { it.name.endsWith('.json') }.each { entry ->
            def export = slurper.parse(zf.getInputStream(entry), 'UTF-8')
            export.concepts?.each { concept ->
                if (concept.external_id) {
                    concepts << concept.external_id.toString().trim().toLowerCase()
                }
            }
        }
    }
}
filesIn(conceptsDir, '.csv').each { File csv ->
    List<List<String>> rows = readCsv(csv)
    if (rows.isEmpty()) {
        return
    }
    int uuidAt = rows[0].findIndexOf { it.trim().equalsIgnoreCase('Uuid') }
    if (uuidAt < 0) {
        return
    }
    rows.drop(1).each { List<String> row ->
        if (uuidAt < row.size() && row[uuidAt].trim()) {
            concepts << row[uuidAt].trim().toLowerCase()
        }
    }
}

List<String> faults = []
int checked = 0
filesIn(drugsDir, '.csv').each { File csv ->
    List<List<String>> rows = readCsv(csv)
    if (rows.isEmpty()) {
        return
    }
    List<String> header = rows[0]*.trim()
    int retireAt = header.findIndexOf { it.equalsIgnoreCase('Void/Retire') }
    int nameAt = header.findIndexOf { it.equalsIgnoreCase('Name') }
    rows.drop(1).eachWithIndex { List<String> row, int n ->
        if (row[0].trim().startsWith('#') || (retireAt >= 0 && retireAt < row.size() && isTrue(row[retireAt]))) {
            return
        }
        CONCEPT_COLUMNS.each { String column ->
            int at = header.findIndexOf { it.equalsIgnoreCase(column) }
            String value = (at >= 0 && at < row.size()) ? row[at].trim() : ''
            if (!(value ==~ UUID)) {
                return
            }
            checked++
            if (!(value.toLowerCase() in concepts)) {
                String name = (nameAt >= 0 && nameAt < row.size()) ? row[nameAt] : row[0]
                faults << ("${csv.name} line ${n + 2}: '${name}' has ${column} ${value}, which is in no OCL " +
                        "export and no concepts CSV, so Initializer does not create the medicine. Use the " +
                        "external_id the concept has in the OCL export, or add the concept to the export first")
            }
        }
    }
}

if (faults) {
    throw new IllegalStateException("Medicines whose concept is not loaded (#787):\n  - " + faults.join('\n  - '))
}
log.info("Drug concepts OK: ${checked} concept references in drugs/, each in an OCL export or a concepts CSV")
