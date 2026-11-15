#!/usr/bin/env groovy
/*
  Fails the build when an act a clinician can order has no Odoo product to bill it. Run from
  sites/mugamba/pom.xml at prepare-package, against the assembled build output, so it sees every
  layer (Ozone, distro, site) of both the OpenMRS and the Odoo configuration.

  The procedure order search (« Actes ») offers the members of the concept sets listed under
  `orderableConceptSets` in the site's frontend config: today « All procedures »
  (46c8be89-db86-4476-9609-58d184f452c3), whose members are CONCEPT-SET mappings in the OCL
  exports. eip-odoo-openmrs puts an order on the visit's quotation only when Odoo has a product
  whose external id is the concept uuid (`init.<uuid>` in odoo/initializer_config/product_variant).
  Without it the order is saved, the act is done and nothing reaches the cashier, without a word
  in OpenMRS (#190, #596).

  Two checks, for every member of every orderable set (an import only ever adds members, so the
  members are the union over all OCL exports):

  1. The member concept is in an OCL export, so OpenMRS has it.
  2. Odoo has a product with external id init.<member uuid>.
*/

import groovy.io.FileType
import groovy.json.JsonSlurper
import java.util.zip.ZipFile

File distroDir = new File(project.build.directory, "${project.artifactId}-${project.version}/distro/configs")
File frontendDir = new File(distroDir, 'openmrs/frontend_config')
File oclDir = new File(distroDir, 'openmrs/initializer_config/ocl')
File productDir = new File(distroDir, 'odoo/initializer_config/product_variant')

if (!frontendDir.isDirectory() || !oclDir.isDirectory()) {
    log.info("No OpenMRS frontend_config or OCL exports in the build output, nothing to check")
    return
}

def slurper = new JsonSlurper()

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

// Every orderableConceptSets entry anywhere in the frontend config files.
Set<String> orderableSets = [] as Set
def collectSets
collectSets = { def node ->
    if (node instanceof Map) {
        node.each { k, v ->
            if (k == 'orderableConceptSets' && v instanceof List) {
                orderableSets.addAll(v*.toString())
            } else {
                collectSets(v)
            }
        }
    } else if (node instanceof List) {
        node.each { collectSets(it) }
    }
}
filesIn(frontendDir, '.json').each { collectSets(slurper.parse(it, 'UTF-8')) }
if (orderableSets.isEmpty()) {
    log.info("No orderableConceptSets in the frontend config, nothing to check")
    return
}

// concept url -> external_id and display name, over every export; set url -> member urls.
Map<String, String> uuidOf = [:]
Map<String, String> nameOf = [:]
Map<String, Set<String>> membersOf = [:].withDefault { [] as Set }
Map<String, String> whereSet = [:]
filesIn(oclDir, '.zip').each { File zip ->
    new ZipFile(zip).withCloseable { ZipFile zf ->
        zf.entries().findAll { it.name.endsWith('.json') }.each { entry ->
            def export = slurper.parse(zf.getInputStream(entry), 'UTF-8')
            export.concepts?.findAll { !isTrue(it.retired) }?.each { concept ->
                uuidOf[concept.url.toString()] = concept.external_id?.toString()
                nameOf[concept.url.toString()] = concept.display_name?.toString()
            }
            export.mappings?.findAll { !isTrue(it.retired) && it.map_type == 'CONCEPT-SET' }?.each { mapping ->
                membersOf[mapping.from_concept_url.toString()] << mapping.to_concept_url.toString()
                whereSet[mapping.to_concept_url.toString()] = zip.name
            }
        }
    }
}

Set<String> productIds = [] as Set
filesIn(productDir, '.csv').each { File csv ->
    csv.getText('UTF-8').eachLine { String line ->
        def m = line =~ /^"?(init\.[0-9A-Za-z-]+)"?,/
        if (m.find()) {
            productIds << m.group(1)
        }
    }
}

List<String> faults = []
int checked = 0
orderableSets.each { String setUuid ->
    String setUrl = uuidOf.find { it.value == setUuid }?.key
    if (setUrl == null) {
        faults << ("orderable concept set ${setUuid} is in the frontend config but in no OCL export")
        return
    }
    membersOf[setUrl].sort().each { String memberUrl ->
        checked++
        String uuid = uuidOf[memberUrl]
        if (uuid == null) {
            faults << ("${whereSet[memberUrl]}: ${memberUrl}, a member of the orderable set ${setUuid}, is in " +
                    "no OCL export, so OpenMRS does not have it. Add it to the export")
        } else if (!(('init.' + uuid) in productIds)) {
            faults << ("'${nameOf[memberUrl]}' (${uuid}) can be ordered (set ${setUuid}) but Odoo has no product " +
                    "init.${uuid}, so the order never reaches the quotation. Add a row to " +
                    "odoo/initializer_config/product_variant/ (#596)")
        }
    }
}

if (faults) {
    throw new IllegalStateException("Orderable acts that cannot be billed:\n  - " + faults.join('\n  - '))
}
log.info("Procedure billing OK: ${checked} orderable acts in ${orderableSets.size()} set(s), each with an Odoo product")
