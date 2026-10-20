#!/usr/bin/env groovy
/*
  Fails the build when a role the realm or the roles CSVs name does not exist in OpenMRS.
  Run from sites/mugamba/pom.xml at prepare-package, against the assembled
  initializer_config, so it sees every layer (RefApp, distro, country, site).

  Each of these goes wrong without a word in any log:

  1. Every `openmrs` client role in the Keycloak realm is an OpenMRS role. oauth2login
     maps the token's roles onto OpenMRS roles by exact name and drops the names it
     does not know, so a misspelt Keycloak role signs its holder in with nothing.
     Until #438 no client role mapped to the stock roles, so nobody could be given them.

  2. Every inherited role a roles CSV names is defined. A pharmacy role that inherits a
     misspelt stock role loses every privilege it was meant to bring.

  3. Role names fit in 50 characters, the width of the stock module's role scope column.

  4. A Keycloak role that may create stock operations can also read stock user role
     scopes. The stock app's Operations page offers only the operation types in the
     user's own scope, and reads it with GET stockmanagement/userrolescope, which the
     module guards with `App: stockmanagement.userRoleScopes`. Without it the page
     gets a 403 and offers nothing to create, though the scope exists (#438, UAT
     2026-10-20). Only Keycloak roles are checked: the stock module's own roles are
     never given to anyone directly here.
*/

import groovy.json.JsonSlurper

// Defined by openmrs-core itself, not by any Initializer CSV.
Set<String> coreRoles = ['System Developer', 'Provider', 'Anonymous', 'Authenticated'] as Set
int maxRoleNameLength = 50
String createOperations = 'Task: stockmanagement.stockoperations.mutate'
String readScopes = 'App: stockmanagement.userRoleScopes'

File distroConfigs = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs")
File rolesDir = new File(distroConfigs, 'openmrs/initializer_config/roles')
File realmFile = new File(distroConfigs, 'keycloak/realms/ozone-realm.json')

if (!rolesDir.isDirectory()) {
    log.info("No initializer_config/roles in the build output, nothing to check")
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

Map<String, String> definedIn = [:]
Map<String, Set<String>> privilegesOf = [:]
List<Map> inheritances = []
rolesDir.eachFileRecurse(groovy.io.FileType.FILES) { f ->
    if (!f.name.toLowerCase().endsWith('.csv')) {
        return
    }
    List<String> lines = f.readLines('UTF-8').findAll { it.trim() }
    if (lines.isEmpty()) {
        return
    }
    List<String> header = splitCsvLine(lines[0]).collect { it.trim().toLowerCase() }
    int nameCol = header.indexOf('role name')
    int inheritedCol = header.indexOf('inherited roles')
    int privilegesCol = header.indexOf('privileges')
    if (nameCol < 0) {
        return
    }
    lines.drop(1).each { line ->
        List<String> row = splitCsvLine(line)
        String name = row.size() > nameCol ? row[nameCol].trim() : ''
        if (!name) {
            return
        }
        definedIn[name] = f.name
        if (privilegesCol >= 0 && row.size() > privilegesCol) {
            // The RefApp CSVs separate privileges with "; ", Initializer trims them.
            privilegesOf[name] = row[privilegesCol].split(';').collect { it.trim() }.findAll { it } as Set
        }
        if (inheritedCol >= 0 && row.size() > inheritedCol) {
            row[inheritedCol].split(';').collect { it.trim() }.findAll { it }.each { parent ->
                inheritances << [role: name, parent: parent, file: f.name]
            }
        }
    }
}

Set<String> known = coreRoles + definedIn.keySet()
List<String> problems = []

inheritances.each { inh ->
    if (!known.contains(inh.parent)) {
        problems << "${inh.file}: role '${inh.role}' inherits '${inh.parent}', which no roles CSV defines"
    }
}

definedIn.each { name, file ->
    if (name.length() > maxRoleNameLength) {
        problems << "${file}: role '${name}' is ${name.length()} characters, more than ${maxRoleNameLength}"
    }
}

// A role's privileges with those of every role it inherits, as OpenMRS resolves them.
Set<String> effectivePrivileges(String role, Map<String, Set<String>> privilegesOf,
        List<Map> inheritances, Set<String> seen = [] as Set) {
    if (!seen.add(role)) {
        return [] as Set
    }
    Set<String> all = new HashSet<>(privilegesOf[role] ?: [])
    inheritances.findAll { it.role == role }.each { all.addAll(effectivePrivileges(it.parent, privilegesOf, inheritances, seen)) }
    return all
}

if (realmFile.isFile()) {
    def realm = new JsonSlurper().parse(realmFile, 'UTF-8')
    List clientRoles = realm?.roles?.client?.openmrs ?: []
    clientRoles.each { r ->
        if (!known.contains(r.name)) {
            problems << "ozone-realm.json: openmrs client role '${r.name}' is not an OpenMRS role; " +
                    "oauth2login would drop it at sign-in"
        } else if (definedIn.containsKey(r.name)) {
            Set<String> privileges = effectivePrivileges(r.name, privilegesOf, inheritances)
            if (privileges.contains(createOperations) && !privileges.contains(readScopes)) {
                problems << "${definedIn[r.name]}: role '${r.name}' has '${createOperations}' but not " +
                        "'${readScopes}'; the stock app could not read its scopes, so it could create no operation"
            }
        }
    }
    log.info("Checked ${clientRoles.size()} Keycloak openmrs client roles against ${definedIn.size()} OpenMRS roles")
} else {
    log.info("No keycloak/realms/ozone-realm.json in the build output, Keycloak roles not checked")
}

if (problems) {
    problems.each { log.error(it) }
    throw new IllegalStateException("${problems.size()} role problem(s), see above (scripts/check-openmrs-roles.groovy)")
}
