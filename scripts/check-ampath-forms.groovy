#!/usr/bin/env groovy
/*
  Fails the build on an O3 form that would accept what the server or the ward must refuse.
  Run from sites/mugamba/pom.xml at prepare-package, against the assembled
  initializer_config, so it sees every layer (distro, country, site).

  Three checks, each for a fault that passes every review of the form JSON and shows only
  when someone saves or reads the form:

  1. A number question that accepts decimals asks a concept that allows them. The form
     engine accepts 4.5 when the question has no disallowDecimals, but openmrs-core then
     rejects the whole encounter: "Assigning decimal value to numeric concept with 'Allowed
     decimal' property set to false is not allowed". The concept's allow_decimal comes from
     the OCL export in ocl/; a concept that no export defines is not checked. That is how
     cervical dilatation (4.5 cm) failed on the partograph (#488).

  2. A page shown only to male patients (hide: sex !== 'M') refuses to save. The maternity
     forms show such a page instead of their content, and without a block its Save
     button created an empty encounter of the form's encounter type, which counts in
     encounter-based reports (#489). The block is a question on that page with a
     js_expression validator that fails when sex === 'M' and carries a message. It must
     not be markdown (the markdown control never shows a validation message), must not
     be disabled (the engine skips disabled fields when it validates) and must not be
     read-only (Carbon's TextInput drops `invalid` on a read-only input, so the save is
     refused with no message: UAT, 4 Nov 2026).

  3. A member of an obsGroup that has a hide rule repeats that rule in its own. The engine
     flattens the members into copies and evaluates each one's own rule, so a member without
     it is shown and saved while its group is hidden: a foetus 3 answer on a twin pregnancy.
     The fixed foetus and newborn slots carry the slot rule on the group and every member
     (#496, #512).
  4. Every question and answer concept has a French locale-preferred name. The form's
     labels are translated, but wherever OpenMRS shows the concept itself (the encounter's
     observation list, results, summaries) a French session falls back to the English name
     when the concept has no French one (#475). The names come from the OCL exports in
     ocl/; a concept that no export defines (e.g. a CIEL:nnn reference) is not checked.
*/

import groovy.io.FileType
import groovy.json.JsonSlurper
import java.util.zip.ZipFile

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/openmrs/initializer_config")
File formsDir = new File(configDir, 'ampathforms')
File oclDir = new File(configDir, 'ocl')

if (!formsDir.isDirectory()) {
    log.info("No initializer_config/ampathforms in the build output, nothing to check")
    return
}

List<String> faults = []
def slurper = new JsonSlurper()

// Each layer sits in its own subfolder (ampathforms/ozone-uvl-mugamba/...), so walk them all.
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

String squash(def expression) {
    return expression == null ? '' : expression.toString().replaceAll('\\s+', '').replace('"', "'")
}

// A name OpenMRS can show as the French display name: preferred, and not a short name or index term.
boolean isFrenchPreferred(def name) {
    String type = (name.name_type ?: '').toString().toUpperCase().replaceAll('[\\s_-]', '')
    return name.locale == 'fr' && isTrue(name.locale_preferred) && !(type in ['SHORT', 'INDEXTERM'])
}

// The concept version id is the last segment of version_url (.../concepts/<id>/<version>/);
// the export's own `version` field sometimes repeats the concept id instead.
long versionOf(def concept) {
    List<String> parts = (concept.version_url ?: '').toString().tokenize('/')
    String v = parts ? parts[-1] : ''
    return v.isLong() ? v.toLong() : 0L
}

// external_id -> allow_decimal of every Numeric concept in the OCL exports, and
// external_id -> whether the concept has a French locale-preferred name. A concept can sit in
// two exports at different versions; the French name is judged on the newest one.
Map<String, Boolean> allowDecimal = [:]
Map<String, Boolean> hasFrenchName = [:]
Map<String, Long> frenchNameVersion = [:]
filesIn(oclDir, '.zip').each { File zip ->
    new ZipFile(zip).withCloseable { ZipFile zf ->
        zf.entries().findAll { it.name.endsWith('.json') }.each { entry ->
            def export = slurper.parse(zf.getInputStream(entry), 'UTF-8')
            export.concepts?.each { concept ->
                if (concept.datatype == 'Numeric' && concept.external_id) {
                    allowDecimal[concept.external_id] = isTrue(concept.extras?.allow_decimal)
                }
                if (concept.external_id && versionOf(concept) >= frenchNameVersion.getOrDefault(concept.external_id, -1L)) {
                    frenchNameVersion[concept.external_id] = versionOf(concept)
                    hasFrenchName[concept.external_id] = concept.names?.any { isFrenchPreferred(it) } ?: false
                }
            }
        }
    }
}

// Every question, nested ones included.
List<Map> questionsOf(List questions) {
    List<Map> all = []
    questions?.each { q ->
        all << q
        all.addAll(questionsOf(q.questions))
    }
    return all
}

int maleOnlyPages = 0
int decimalQuestions = 0
int groupMembersChecked = 0
Map<String, String> noFrenchName = [:]   // concept -> first form and question that uses it
Set<String> namedConcepts = [] as Set
List<File> formFiles = filesIn(formsDir, '.json')
if (!formFiles) {
    throw new IllegalStateException("No form under ${formsDir}: the check would pass without checking anything")
}
formFiles.each { File file ->
    def form = slurper.parse(file, 'UTF-8')
    form.pages?.each { page ->
        List<Map> questions = questionsOf(page.sections?.collectMany { it.questions ?: [] })

        questions.findAll { it.questions && squash(it.hide?.hideWhenExpression) }.each { group ->
            String groupRule = squash(group.hide.hideWhenExpression)
            group.questions.findAll { !squash(it.hide?.hideWhenExpression).contains(groupRule) }.each { member ->
                faults << ("${file.name}: ${member.id} is in ${group.id}, hidden when " +
                        "${group.hide.hideWhenExpression}, but its own hide rule does not repeat that, so it " +
                        "shows and saves while the group is hidden (#512)")
            }
            groupMembersChecked += group.questions.size()
        }

        questions.each { q ->
            def options = q.questionOptions ?: [:]
            if (options.rendering == 'number' && !isTrue(options.disallowDecimals)
                    && allowDecimal.containsKey(options.concept)) {
                decimalQuestions++
                if (!allowDecimal[options.concept]) {
                    faults << ("${file.name}: ${q.id} accepts decimals but concept ${options.concept} has " +
                            "allow_decimal false in the OCL export, so the server rejects the save. Set " +
                            "disallowDecimals, or allow decimals on the concept in OCL (#488)")
                }
            }

            ([options.concept] + (options.answers ?: []).collect { it.concept }).each { String concept ->
                if (concept && hasFrenchName.containsKey(concept)) {
                    namedConcepts << concept
                    if (!hasFrenchName[concept]) noFrenchName.putIfAbsent(concept, "${file.name}: ${q.id}")
                }
            }
        }

        if (squash(page.hide?.hideWhenExpression) in ["sex!=='M'", "sex!='M'"]) {
            maleOnlyPages++
            boolean blocked = questions.any { q ->
                q.questionOptions?.rendering != 'markdown' && !isTrue(q.disabled) && !isTrue(q.readonly) &&
                        q.validators?.any { v ->
                            v.type == 'js_expression' && v.message &&
                                    squash(v.failsWhenExpression) in ["sex==='M'", "sex=='M'"]
                        }
            }
            if (!blocked) {
                faults << ("${file.name}: page '${page.label}' is shown only to male patients but can be " +
                        "saved, or refuses without showing why. Add a question there, not markdown, disabled " +
                        "or read-only, with a js_expression validator failing when sex === 'M', with a " +
                        "message (#489)")
            }
        }
    }
}

noFrenchName.each { String concept, String where ->
    faults << ("${where}: concept ${concept} has no French locale-preferred name in the OCL export, so a " +
            "French session shows it in English. Add a French name marked locale preferred in OCL (#475)")
}

if (faults) {
    throw new IllegalStateException("O3 forms check failed:\n  - " + faults.join('\n  - '))
}
log.info("Forms OK: ${decimalQuestions} decimal number questions on concepts that allow decimals, " +
        "${maleOnlyPages} male-only pages that refuse to save, ${groupMembersChecked} members of hidden-by-rule " +
        "groups that repeat the group's rule, ${namedConcepts.size()} question and answer concepts with a French name")
