#!/usr/bin/env groovy
/*
  Applies everything under distro/binaries in this repository over the same paths in
  the build output, run from distro/pom.xml at prepare-package.

  These are the parts of the distro that are UVL builds rather than inherited ones:

    eip-odoo-openmrs/                          the UVL Odoo EIP bridge
    eip-openmrs-orthanc/                       the UVL Orthanc EIP bridge
    openmrs/frontend/openmrs-esm-patient-attachments/   the patched attachments ESM
    openmrs/modules/                           OpenMRS modules with nowhere to resolve
                                               from (currently orthanctoken)

  Nothing here is hard-coded to a version. Each directory is applied if it has
  content and skipped if it does not, so adding or dropping an override is a matter
  of putting files in distro/binaries — no pom change.

  Why the target is emptied first rather than copied over:

  - Both EIP bridge directories are bind-mounted whole at /eip-client/routes (see
    EIP_*_ROUTES_PATH in run/docker/scripts/utils.sh) and eip-client puts EVERY jar
    it finds there on its classpath. Ozone's jar left sitting beside the UVL one
    makes it undefined which route configuration wins, so the UVL jar has to be the
    only one present, not merely present. The same applies to the omods: two builds
    of one module in distro/binaries/openmrs/modules is not a version conflict
    OpenMRS resolves, it is two modules.
  - Maven's copy-resources never deletes, so on a build without `mvn clean` whatever
    a previous build put there survives — including UVL jars under their old names.

  Why prepare-package: the parent's 'Rebuild OpenMRS Frontend if necessary' execution
  empties distro/binaries/openmrs/frontend, the inherited-Ozone copy overwrites
  distro/binaries, and 'Upgrade UVL OpenMRS to RefApp 3.4.0' deletes *.omod from the
  modules directory — all three at process-resources. Anything applied earlier is
  undone.

  Why these are committed binaries at all: none of them is published anywhere Maven
  could resolve it from. The Orthanc bridge in particular is the UVL fork
  (Virlein/eip-openmrs-orthanc), NOT com.ozonehis:eip-openmrs-orthanc, and the
  difference is load-bearing — upstream's OrthancConfig can only send HTTP Basic,
  which Orthanc's authorization plugin rejects with 403 on every call (19,778
  consecutive failures measured on UAT, i.e. the bridge had never once succeeded).
  The fork adds OrthancTokenProvider (Keycloak client_credentials, gated on
  ORTHANC_OAUTH_ENABLED), the RadiologyOrderWorklistProcessor / OrthancWorklistHandler
  pair that creates Orthanc worklist entries from OpenMRS radiology orders, an Odoo
  payment gate, SR -> Observation mapping against the ordered procedure's concept, and
  orphaned-study cleanup. As each of these lands upstream, delete its directory from
  distro/binaries and it stops being an override with no further change here.
*/

import java.nio.file.Files
import java.nio.file.StandardCopyOption

// A method rather than a closure so it can recurse.
void copyContents(File source, File target) {
    target.mkdirs()
    source.listFiles()?.each { child ->
        File destination = new File(target, child.name)
        if (child.isDirectory()) {
            copyContents(child, destination)
        } else {
            Files.copy(child.toPath(), destination.toPath(), StandardCopyOption.REPLACE_EXISTING)
        }
    }
}

/** The module id an omod filename belongs to: orthanctoken-1.0.0-SNAPSHOT.omod -> orthanctoken */
String moduleId(String omodName) {
    omodName.replaceFirst(/-\d.*\.omod$/, '')
}

File sourceBinaries = new File(project.basedir, 'binaries')
File targetBinaries = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/binaries")

/** Overriding files in a directory, ignoring dotfiles; empty list if there are none. */
def overridesIn = { File directory ->
    directory.isDirectory() ? (directory.listFiles() ?: new File[0]).findAll { !it.name.startsWith('.') } : []
}

def clearContents = { File directory ->
    (directory.listFiles() ?: new File[0]).each { it.isDirectory() ? it.deleteDir() : it.delete() }
}

/** Make target hold exactly what source holds, keeping target itself. */
def replaceContents = { String label, File source, File target ->
    log.info("Overriding ${label} with ${source} -> ${target}")
    target.mkdirs()
    clearContents(target)
    copyContents(source, target)
}

// The EIP bridges: whole directory, name for name.
['eip-odoo-openmrs', 'eip-openmrs-orthanc'].each { String bridge ->
    File source = new File(sourceBinaries, bridge)
    if (overridesIn(source)) {
        replaceContents(bridge, source, new File(targetBinaries, bridge))
    } else {
        log.info("No ${bridge} override in ${source}; keeping the inherited bridge")
    }
}

// The attachments ESM: into the directory `openmrs assemble` created, version suffix
// and all, because importmap.json and routes.registry.json already name it.
File attachments = new File(sourceBinaries, 'openmrs/frontend/openmrs-esm-patient-attachments')
if (overridesIn(attachments)) {
    File frontend = new File(targetBinaries, 'openmrs/frontend')
    def assembled = (frontend.listFiles() ?: new File[0]).findAll {
        it.isDirectory() && it.name.startsWith('openmrs-esm-patient-attachments-app')
    }
    if (!assembled) {
        throw new RuntimeException("${attachments} holds an override but the assembled frontend at " +
                "${frontend} has no openmrs-esm-patient-attachments-app* directory to apply it to")
    }
    assembled.each { replaceContents('the patient-attachments app', attachments, it) }
} else {
    log.info("No patient-attachments override in ${attachments}; keeping the assembled app")
}

// OpenMRS modules: per omod, so an override replaces its own module and leaves the
// rest of the inherited modules alone.
File modulesSource = new File(sourceBinaries, 'openmrs/modules')
File modulesTarget = new File(targetBinaries, 'openmrs/modules')
def omods = overridesIn(modulesSource).findAll { it.name.endsWith('.omod') }
if (omods) {
    modulesTarget.mkdirs()
    omods.each { File omod ->
        String id = moduleId(omod.name)
        (modulesTarget.listFiles() ?: new File[0])
                .findAll { it.name.endsWith('.omod') && it.name != omod.name && moduleId(it.name) == id }
                .each {
                    log.info("Dropping inherited ${it.name}")
                    it.delete()
                }
        log.info("Overriding module ${id} with ${omod.name}")
        Files.copy(omod.toPath(), new File(modulesTarget, omod.name).toPath(),
                StandardCopyOption.REPLACE_EXISTING)
    }
} else {
    log.info("No module overrides in ${modulesSource}")
}
