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

  5. The central pharmacist cannot dispense (#453). They feed the dispensing boxes and
     never dispense to patients, so Central Pharmacist must not hold, directly or through
     an inherited role, a privilege that saves a dispense: `Edit Medication Dispense`
     (core MedicationDispenseService.saveMedicationDispense), the dispensing app's
     `Task: dispensing.create.dispense` (it hides the Dispense action without it), or the
     stock module's `Task: stockmanagement.stockItems.dispense` (POST dispenserequest,
     which deducts the dispensed stock). Until #453 it inherited Pharmacist, and with it
     all three.

  6. Only administrators manage user accounts (#502). No Keycloak role but System Developer
     may hold, directly or through an inherited role, a privilege that creates, changes or
     removes an OpenMRS user or what it may do: `Add Users` (UserService.createUser),
     `Edit Users` (saveUser, so the roles of any account), `Edit User Passwords`,
     `Delete Users`, `Purge Users`, `Manage Roles`, `Manage Privileges` or
     `Assign System Developer Role`. Until #502 `Add Users` and `Edit Users` sat in
     "Register patients", which every clinical role inherits. Reading users (`Get Users`,
     `View Users`) stays allowed: provider and orderer names are read through it.

  7. Only administrators delete a saved consultation (#510). No Keycloak role but System
     Developer may hold, directly or through an inherited role, `Delete Encounters`,
     `Purge Encounters`, `Delete Visits` (VisitService.voidVisit, the chart's delete
     visit button), `Purge Visits`, `Delete Observations` or `Purge Observations`.
     Until #510 Doctor held `Delete Encounters`, `Delete Visits` and `Delete
     Observations`. Editing a consultation stays allowed. Note that core voids an
     encounter under `Edit Encounters`, and the patient chart shows its delete action
     to whoever may edit the encounter, so this check alone does not hide the action.

  8. A Keycloak role that may open a patient chart (`Get Patients`) can also read the
     patient's program enrolments (`Get Patient Programs`). The chart's Programs widget
     loads GET programenrollment?patient=..., which core guards with Get Patient Programs
     (ProgramWorkflowService.getPatientPrograms), so without it every chart load returns a
     403 for that role (#517, Midwife on UAT 2026-11-05). Until #517 only Doctor and the
     lab, pharmacy and imaging roles held it; Register patients, Help Nurse, Nurse, Midwife
     and every role built on Nurse did not.

  9. Each role below holds, directly or through an inherited role, the read privileges its
     screens call. Without them the call returns a 403, and some screens retry it for ever.
     - Help Nurse, Nurse, Midwife and Doctor read drug orders (`Get Orders`, and `Get Care
       Settings`, because the medications widget filters GET order?patient=... by care
       setting and core resolves it through OrderService.getCareSettingByUuid) and patient
       lists (`View Cohorts In Cohort Module`, which the cohort module's services require
       for GET cohortm/cohort and cohortm/cohortmember, and `Get Patient Cohorts`, the
       display condition the site frontend config puts on the two patient-list apps, so
       without it the Patient Lists link and the chart widget stay hidden). Until #508 Help
       Nurse had neither, its patient summary looped on the drug orders call, and no
       clinical role could read a patient list (UAT 2026-11-04).
     - Pharmacist and Central Pharmacist open Stock -> Reports (#438): `App:
       stockmanagement.reports`, `Task: stockmanagement.reports.mutate` to request a report,
       and `Manage Scheduler`, because the stock module queues the report with
       SchedulerService.scheduleIfNotRunning in the requesting user's session. The three come
       with the stock module's own `Inventory Reporting` role.
     - Pharmacist and Doctor read the order basket's price and stock lookups, FHIR
       ChargeItemDefinition and InventoryItem (`Get ChargeItemDefinition`, `Get
       InventoryItem`). Until #351 the Pharmacist did not.

 10. Only administrators see System Administration. The site frontend config shows
     `@openmrs/esm-system-admin-app` (the « Administration du système » app menu entry) only
     to users with `View Administration Functions`; the app itself ties the entry to no
     privilege, so until this condition every signed-in user, the pharmacists included, saw
     it (UAT 2026-11-06). No Keycloak role but System Developer may hold it, directly or
     through an inherited role, or the entry comes back for that role.
*/

import groovy.json.JsonSlurper

// Defined by openmrs-core itself, not by any Initializer CSV.
Set<String> coreRoles = ['System Developer', 'Provider', 'Anonymous', 'Authenticated'] as Set
int maxRoleNameLength = 50
String createOperations = 'Task: stockmanagement.stockoperations.mutate'
String readScopes = 'App: stockmanagement.userRoleScopes'
List<String> nonDispensingRoles = ['Central Pharmacist']
List<String> dispensingPrivileges = ['Edit Medication Dispense', 'Task: dispensing.create.dispense',
        'Task: stockmanagement.stockItems.dispense']
List<String> userAdminPrivileges = ['Add Users', 'Edit Users', 'Edit User Passwords', 'Delete Users',
        'Purge Users', 'Manage Roles', 'Manage Privileges', 'Assign System Developer Role']
List<String> deletePrivileges = ['Delete Encounters', 'Purge Encounters', 'Delete Visits', 'Purge Visits',
        'Delete Observations', 'Purge Observations']
String viewAdmin = 'View Administration Functions'
String openChart = 'Get Patients'
String readEnrolments = 'Get Patient Programs'
List<String> readDrugOrders = ['Get Orders', 'Get Care Settings']
List<String> readPatientLists = ['View Cohorts In Cohort Module', 'Get Patient Cohorts']
List<String> stockReports = ['App: stockmanagement.reports', 'Task: stockmanagement.reports.mutate', 'Manage Scheduler']
List<String> basketLookups = ['Get ChargeItemDefinition', 'Get InventoryItem']
Map<String, List<String>> requiredOf = [
        'Help Nurse'        : readDrugOrders + readPatientLists,
        'Nurse'             : readDrugOrders + readPatientLists,
        'Midwife'           : readDrugOrders + readPatientLists,
        'Doctor'            : readDrugOrders + readPatientLists + basketLookups,
        'Pharmacist'        : stockReports + basketLookups,
        'Central Pharmacist': stockReports,
]

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

nonDispensingRoles.each { name ->
    if (!definedIn.containsKey(name)) {
        problems << "role '${name}' is not defined in any roles CSV; cannot check that it does not dispense"
        return
    }
    Set<String> privileges = effectivePrivileges(name, privilegesOf, inheritances)
    List<String> held = dispensingPrivileges.findAll { privileges.contains(it) }
    if (held) {
        problems << "${definedIn[name]}: role '${name}' must not dispense, but holds ${held.collect { "'${it}'" }.join(', ')}" +
                " (directly or through an inherited role)"
    }
}

requiredOf.each { name, required ->
    if (!definedIn.containsKey(name)) {
        problems << "role '${name}' is not defined in any roles CSV; cannot check the privileges its screens need"
        return
    }
    Set<String> privileges = effectivePrivileges(name, privilegesOf, inheritances)
    List<String> missing = required.findAll { !privileges.contains(it) }
    if (missing) {
        problems << "${definedIn[name]}: role '${name}' lacks ${missing.collect { "'${it}'" }.join(', ')}" +
                " (directly or through an inherited role); its screens would get a 403"
    }
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
            List<String> userAdmin = userAdminPrivileges.findAll { privileges.contains(it) }
            if (userAdmin) {
                problems << "${definedIn[r.name]}: role '${r.name}' can manage user accounts through " +
                        "${userAdmin.collect { "'${it}'" }.join(', ')} (directly or through an inherited role); " +
                        "only System Developer may"
            }
            List<String> deletes = deletePrivileges.findAll { privileges.contains(it) }
            if (deletes) {
                problems << "${definedIn[r.name]}: role '${r.name}' can delete consultations through " +
                        "${deletes.collect { "'${it}'" }.join(', ')} (directly or through an inherited role); " +
                        "only System Developer may"
            }
            if (privileges.contains(viewAdmin)) {
                problems << "${definedIn[r.name]}: role '${r.name}' holds '${viewAdmin}' (directly or through " +
                        "an inherited role), so the System Administration menu shows for it; only System Developer may"
            }
            if (privileges.contains(openChart) && !privileges.contains(readEnrolments)) {
                problems << "${definedIn[r.name]}: role '${r.name}' has '${openChart}' but not " +
                        "'${readEnrolments}'; the patient chart's program enrolments would return 403"
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
