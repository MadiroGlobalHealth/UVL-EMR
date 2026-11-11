#!/usr/bin/env groovy
/*
  Fails the build when the built app shell shares a library at a version other than the
  one distro/frontend/openmrs-cli/package.json pins in "overrides".
  Run from distro/pom.xml at compile, after "Rebuild OpenMRS Frontend if necessary"
  (process-resources) has written the frontend.

  The app shell hands React, Carbon, i18next and the rest to every ESM as module
  federation singletons, and its openmrs.<hash>.js lists them in
  scopeToSharingDataMapping as {name:"<package>",version:"<version>",...}. Built from an
  unpinned npx install on 2026-11-11, it shared @carbon/react 1.120.0 instead of the
  1.119.0 UAT was built with, and production lost its Carbon styling (location picker,
  patient-chart left nav) without a single error. This reads the versions the shell
  actually shares, so it also catches a pin that the install did not honour.
*/
import groovy.json.JsonSlurper

def basedir = project.basedir
def pinned = new JsonSlurper().parse(new File(basedir, "frontend/openmrs-cli/package.json")).overrides
if (!pinned) {
    fail("distro/frontend/openmrs-cli/package.json has no \"overrides\"; nothing pins the libraries the app shell shares.")
}

def frontendDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/binaries/openmrs/frontend")
def shells = (frontendDir.listFiles() ?: []).findAll {
    it.name ==~ /openmrs\.[0-9a-f]+\.js/ && it.text.contains("scopeToSharingDataMapping")
}
if (shells.size() != 1) {
    fail("Expected one app shell (openmrs.<hash>.js with scopeToSharingDataMapping) in ${frontendDir}, found ${shells*.name}.")
}
def shell = shells[0]

def shared = [:]
(shell.text =~ /\{name:"([^"]+)",version:"([^"]+)"/).each { m -> shared.get(m[1], [] as Set) << m[2] }

def problems = []
pinned.each { name, version ->
    def found = shared[name]
    if (!found) {
        problems << "${name}: pinned to ${version} but not shared by the app shell"
    } else if (found != [version] as Set) {
        problems << "${name}: shared as ${found.join(', ')}, pinned to ${version}"
    }
}
if (problems) {
    fail("The app shell ${shell.name} does not share the pinned versions:\n  " + problems.join("\n  ") +
            "\nThe frontend was not built from the lockfile in distro/frontend/openmrs-cli; see 'Pin the OpenMRS frontend build' in distro/pom.xml.")
}
log.info("Verified: ${shell.name} shares " + pinned.collect { name, version -> "${name} ${version}" }.join(", "))

def fail(String message) {
    throw new IllegalStateException(message)
}
