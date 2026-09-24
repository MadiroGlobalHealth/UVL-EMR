#!/usr/bin/env groovy
/*
  Fails the build when the Initializer's Liquibase changelogs would not do what the
  repository says they do. Run from sites/mugamba/pom.xml at prepare-package, against the
  assembled initializer_config, so it sees every layer (distro, country, site).

  Two checks, one for each way this has already gone wrong silently (#305):

  1. Every .xml under initializer_config/liquibase is reachable. The Initializer's
     LiquibaseLoader only executes files named exactly `liquibase.xml`; any other file
     runs only if a liquibase.xml includes it. uvl-liquibase.xml sat beside
     liquibase.xml for fifteen months, un-included, and none of its changesets ever ran
     - with nothing in the log to say so. (Its changesets have been in liquibase.xml
     since #233; this check stops the next such file.)

  2. Every reachable changelog parses, with Liquibase's schema validation, using the
     Liquibase version OpenMRS runs. A changeset whose elements are in the wrong order
     (preConditions after comment) is rejected at parse time, and the failure takes the
     whole changelog down with it, including changesets that were fine.

  Reachability follows <include file> and <includeAll path>, honouring
  relativeToChangelogFile. .sql files referenced by <sqlFile> are not changelogs and are
  not checked.
*/

import groovy.xml.XmlSlurper
import liquibase.changelog.ChangeLogParameters
import liquibase.parser.ChangeLogParserFactory
import liquibase.resource.DirectoryResourceAccessor

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/openmrs/initializer_config")
File liquibaseDir = new File(configDir, 'liquibase')

if (!liquibaseDir.isDirectory()) {
    log.info("No initializer_config/liquibase in the build output, nothing to check")
    return
}

List<File> allChangelogs = []
liquibaseDir.eachFileRecurse(groovy.io.FileType.FILES) { f ->
    if (f.name.toLowerCase().endsWith('.xml')) {
        allChangelogs << f.canonicalFile
    }
}

// What the Initializer itself loads.
List<File> entryPoints = allChangelogs.findAll { it.name.equalsIgnoreCase('liquibase.xml') }

Set<File> reachable = [] as Set
List<File> queue = new ArrayList<>(entryPoints)
while (!queue.isEmpty()) {
    File changelog = queue.remove(0)
    if (!reachable.add(changelog)) {
        continue
    }
    def root = new XmlSlurper(false, false).parse(changelog)
    root.'**'.findAll { it.name() == 'include' || it.name() == 'includeAll' }.each { node ->
        boolean relative = node.@relativeToChangelogFile.text() == 'true'
        String target = node.name() == 'include' ? node.@file.text() : node.@path.text()
        File resolved = (relative ? new File(changelog.parentFile, target) : new File(configDir.parentFile, target)).canonicalFile
        if (node.name() == 'include') {
            if (!resolved.isFile()) {
                throw new IllegalStateException("${changelog} includes ${target}, which does not exist (${resolved})")
            }
            queue << resolved
        } else {
            resolved.eachFileRecurse(groovy.io.FileType.FILES) { f ->
                if (f.name.toLowerCase().endsWith('.xml')) {
                    queue << f.canonicalFile
                }
            }
        }
    }
}

List<File> orphans = allChangelogs.findAll { !reachable.contains(it) }
if (!orphans.isEmpty()) {
    String list = orphans.collect { '  ' + liquibaseDir.toPath().relativize(it.toPath()) }.join('\n')
    throw new IllegalStateException("""\
These Liquibase changelogs will never run. The Initializer only executes files named
liquibase.xml, and nothing includes these:
${list}
Include each one from its liquibase.xml (<include file="..." relativeToChangelogFile="true"/>),
or delete it.""")
}

// Parse each entry point the way OpenMRS will; includes are parsed with it.
File dataDir = configDir.parentFile
def accessor = new DirectoryResourceAccessor(dataDir)
entryPoints.each { entry ->
    String path = dataDir.toPath().relativize(entry.toPath()).toString()
    def parser = ChangeLogParserFactory.getInstance().getParser(path, accessor)
    def changelog = parser.parse(path, new ChangeLogParameters(), accessor)
    log.info("Liquibase changelog OK: ${path} (${changelog.changeSets.size()} changesets)")
}
