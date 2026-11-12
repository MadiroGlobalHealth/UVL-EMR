#!/usr/bin/env groovy
/*
  Fails the build on an O3 form that would accept what the server or the ward must refuse.
  Run from sites/mugamba/pom.xml at prepare-package, against the assembled
  initializer_config, so it sees every layer (distro, country, site).

  Thirteen checks, each for a fault that passes every review of the form JSON and shows only
  when someone saves or reads the form:

  1. A number question that accepts decimals asks a concept that allows them. The form
     engine accepts 4.5 when the question has no disallowDecimals, but openmrs-core then
     rejects the whole encounter: "Assigning decimal value to numeric concept with 'Allowed
     decimal' property set to false is not allowed". The concept's allow_decimal comes from
     the OCL export in ocl/; a concept that no export defines is not checked. That is how
     cervical dilatation (4.5 cm) failed on the partograph (#488). The engine renders `numeric`
     as `number`, so both are checked; until #566 the 12 `numeric` questions were not.

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
     ocl/. A CIEL:nnn reference is checked through the export concept that maps SAME-AS to
     that CIEL code: the ward admission form asks its questions that way, and was entirely
     in English (#546). A concept that no export defines is not checked.
  5. That French name is the one the requirements sheet gives. The forms requirements sheet is
     the source of truth for concept names: staff should read in Results the word they picked in
     the form (Céphalique, not présentation vertex). requirements/form-concept-names-fr.tsv in the
     site holds, for every question and answer concept the sheet labels, the French preferred name
     OCL must carry; a name edited in OCL, or an export that brings back an old version, fails
     here. The file lists the exceptions too (a qualified name where the sheet word is already
     another concept's name, a lab catalogue name kept), each with its note (#513).
  6. Every mapping in the OCL exports says where it points: a target concept, or a target source.
     A mapping with neither makes the OCL loader log "not-null property references a null or
     transient value : org.openmrs.ConceptSource.name" and drop it, and nothing else fails; 68
     lab-test mappings were dropped that way since May 2025 (#520). Exports that still carry
     such mappings and have not been re-exported since are listed in knownMappingFaults, with
     their count, so a new fault in them still fails.
  7. Every concept of the lab-tests export (UVL_labtests_*.zip) has a French locale-preferred
     name, as check 4 asks of the form concepts. The lab technician picks the results and the
     doctor reads them, so a lab answer with no French name shows in English ("Positive for
     Plasmodium falciparum", #531).
  8. No answer label is one the form's French translations turn into other words. The entry form
     translates answer labels, but the saved-encounter view (Visits, expanded encounter, the form
     engine's embedded view) shows an answer's label as it is in the form JSON: a "No" answer
     labelled "No" and translated to "Non" was entered as « Non » and read back as "No" (#528).
     An answer either has no label, and the engine shows the concept's own name in the session's
     language, or a French label; the English session gets English from the form's English
     translations, keyed by the French label.
  9. Every member of the "Imaging procedures" set (concepts/imaging_procedures.csv) has a datatype
     that can hold a result in the OCL exports. 22 body-part X-rays were N/A, so they could be
     ordered and paid but the lab app refused their result: "Configuration d'analyse invalide"
     (#546).
 10. Every js_expression validator has a failsWhenExpression or a warnsWhenExpression, and a message.
     The engine reads only those two keys and ignores any other, so a misspelled one (warnWhenExpression,
     warningExpression) never fires and nothing tells anyone. A warnsWhenExpression shows its message
     under the field and does not stop the save: the 24-hour surveillance vital signs use it for values
     out of the normal range (#562). Without a message the engine shows its English "Invalid value" or
     "Field has warnings"; the engine does not translate validator messages, so they carry the French
     and the English text, like the male-patient save block.
 11. No question inside a newborn's obs group asks a concept of the vital-signs export
     (UVL_vital_signs_*.zip). The patient chart's vital signs and header read those concepts whatever
     obs group they sit in, so a newborn's value saved under one shows as the mother's: the 24-hour
     surveillance saved each newborn's pulse, breathing and temperature under the mother's concepts,
     and her vital signs read pulse 140 and respiratory rate 45, flagged abnormal (#562). A group is a
     newborn's when its id, label or concept name says newborn, nouveau-né, baby or bébé; the newborn
     gets its own concepts (Newborn pulse, ...).
 12. Every diagnosis concept of the diagnoses export (UVL_dx_*.zip) has an ICD-10 code: a SAME-AS
     mapping to ICD-10-WHO in the export, or a row of liquibase/sql/diagnosis_icd10_maps.sql (generated
     by scripts/diagnosis-icd10-maps.py). uvl-dx carried its codes only in the concept names, so no
     diagnosis had a code in OpenMRS: the diagnosis search could not find one by code and reports had
     no code to read (#584). The codes WHO ICD-10 no longer has are listed in diagnosisWithoutIcd10.
 13. A question whose answers are an official list offers exactly that list, in that order, under the
     words the list uses. requirements/form-answer-lists-fr.tsv in the site holds, per form and question
     id, each answer as staff must read it: the answer's label, or the French name of its concept when
     it has none. The discharge outcome shipped with nine answers (one « Décédé », one « Transfert
     intra-hospitalier ») while the product owner's list, which the hospitalisation register and the
     Ministry ward activity count by, has ten (#609).
*/

import groovy.io.FileType
import groovy.json.JsonSlurper
import java.util.zip.ZipFile

File configDir = new File(project.build.directory,
        "${project.artifactId}-${project.version}/distro/configs/openmrs/initializer_config")
File formsDir = new File(configDir, 'ampathforms')
File oclDir = new File(configDir, 'ocl')
File sheetNamesFile = new File(project.basedir, 'requirements/form-concept-names-fr.tsv')
File answerListsFile = new File(project.basedir, 'requirements/form-answer-lists-fr.tsv')
File translationsDir = new File(configDir, 'ampathformstranslations')
File imagingSetFile = new File(configDir, 'concepts')

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
Map<String, String> frenchName = [:]
Map<String, String> datatypeOf = [:]       // external_id -> datatype of the newest version
Map<String, String> cielConcept = [:]      // 'CIEL:<code>' -> external_id of the concept mapped SAME-AS to it
Map<String, String> vitalSign = [:]        // external_id -> name of every concept of the vital-signs export
Map<String, String> englishName = [:]      // external_id -> display name, to tell a newborn's obs group
// Exports re-exported after #520 must have none. uvl-dx carries 2 from the May 2025 import
// (retired in OCL); its collection can't be re-exported as is, it would drop 154 concepts (#533).
Map<String, Integer> knownMappingFaults = ['UVL_dx_v4.zip': 2]
List<String> mappingFaults = []
// #584: the uvl-dx concepts whose name carries a code WHO ICD-10 no longer has (I84, N18.0, U80,
// U81, U88, U89), by external_id; scripts/diagnosis-icd10-maps.py NOT_IN_ICD10_WHO.
Set<String> diagnosisWithoutIcd10 = [
        'd0cf970b-6101-4143-a153-58e055c3275e',   // I84 Hemorrhoids
        '211fdd7f-9afa-47d4-9160-14900e2668e1',   // N18.0 End-stage renal failure
        '78313547-45e1-4242-bb82-d4eded3591d0',   // U80 Agents resistant to penicillin and related
        '1c45a7a1-dbc6-4143-97e0-01698584a1af',   // 2017-U81 Agents resistant to vancomycin and related
        '70b7da6c-50e1-4f99-ae24-6ccf036cc1de',   // U88 Agents resistant to multiple antibiotics
        '3843ff81-ebfd-48a7-840a-4ffd75e6ff1d',   // U89 Agents resistant to other and unspecified antibiotics
] as Set
Set<String> diagnosisIcd10Seeded = filesIn(new File(configDir, 'liquibase'), 'diagnosis_icd10_maps.sql').findAll { it.name == 'diagnosis_icd10_maps.sql' }.collectMany { File sql ->
    (sql.text =~ /(?m)^\s*\('([0-9a-f-]{36})', '[^']+', '[0-9a-f-]{36}', '[0-9a-f-]{36}'\)/).collect { it[1] }
} as Set
int diagnosesChecked = 0
int mappingsChecked = 0
int labConceptsChecked = 0
filesIn(oclDir, '.zip').each { File zip ->
    new ZipFile(zip).withCloseable { ZipFile zf ->
        zf.entries().findAll { it.name.endsWith('.json') }.each { entry ->
            def export = slurper.parse(zf.getInputStream(entry), 'UTF-8')
            List noTarget = (export.mappings ?: []).findAll { mapping ->
                !isTrue(mapping.retired) && !mapping.to_concept_url && !mapping.to_source_url && !mapping.to_source_name
            }
            mappingsChecked += (export.mappings ?: []).size()
            if (zip.name.startsWith('UVL_labtests_')) {
                export.concepts?.findAll { !isTrue(it.retired) }?.each { concept ->
                    labConceptsChecked++
                    if (!concept.names?.any { isFrenchPreferred(it) }) {
                        mappingFaults << ("${zip.name}: lab concept ${concept.url} '${concept.display_name}' has no " +
                                "French locale-preferred name, so a French session shows it in English. Add one in " +
                                "OCL and re-export (#531)")
                    }
                }
            }
            if (zip.name.startsWith('UVL_dx_')) {
                Set<String> icd10Mapped = (export.mappings ?: []).findAll { !isTrue(it.retired) &&
                        it.to_source_name == 'ICD-10-WHO' && it.to_concept_code &&
                        it.map_type?.toString()?.toUpperCase()?.replaceAll('[\\s_-]', '') == 'SAMEAS' }
                        .collect { it.from_concept_url?.toString() } as Set
                export.concepts?.findAll { !isTrue(it.retired) && it.concept_class == 'Diagnosis' }?.each { concept ->
                    if (concept.url?.toString() in icd10Mapped || concept.external_id in diagnosisIcd10Seeded) {
                        diagnosesChecked++
                    } else if (!(concept.external_id in diagnosisWithoutIcd10)) {
                        mappingFaults << ("${zip.name}: diagnosis ${concept.url} '${concept.display_name}' has no ICD-10 " +
                                "code: no SAME-AS mapping to ICD-10-WHO and no row in liquibase/sql/diagnosis_icd10_maps.sql, " +
                                "so the diagnosis search cannot find it by code and reports have none. Map it in OCL " +
                                "(scripts/diagnosis-icd10-maps.py) and re-export (#584)")
                    }
                }
            }
            if (zip.name.startsWith('UVL_vital_signs_')) {
                export.concepts?.findAll { it.external_id }?.each { vitalSign[it.external_id] = it.display_name?.toString() }
            }
            export.concepts?.each { if (it.external_id) englishName.putIfAbsent(it.external_id, it.display_name?.toString() ?: '') }
            if (noTarget.size() != knownMappingFaults.getOrDefault(zip.name, 0)) {
                mappingFaults << ("${zip.name}: ${noTarget.size()} mapping(s) with no target concept and no target " +
                        "source (e.g. ${noTarget.take(3).collect { it.url }}), which the OCL loader drops. Give each " +
                        "its target source in OCL (SNOMED-CT, AMPATH, ...) or retire it, and re-export (#520)" +
                        (knownMappingFaults.containsKey(zip.name) ? "; then update knownMappingFaults" : ""))
            }
            Map<String, String> idByUrl = [:]
            export.concepts?.each { if (it.external_id) idByUrl[it.url?.toString()] = it.external_id }
            (export.mappings ?: []).findAll { !isTrue(it.retired) && it.to_source_name == 'CIEL' && it.to_concept_code &&
                    it.map_type?.toString()?.toUpperCase()?.replaceAll('[\\s_-]', '') == 'SAMEAS' }.each { mapping ->
                String id = idByUrl[mapping.from_concept_url?.toString()]
                if (id) cielConcept.putIfAbsent("CIEL:${mapping.to_concept_code}".toString(), id)
            }
            export.concepts?.each { concept ->
                if (concept.datatype == 'Numeric' && concept.external_id) {
                    allowDecimal[concept.external_id] = isTrue(concept.extras?.allow_decimal)
                }
                if (concept.external_id && versionOf(concept) >= frenchNameVersion.getOrDefault(concept.external_id, -1L)) {
                    frenchNameVersion[concept.external_id] = versionOf(concept)
                    hasFrenchName[concept.external_id] = concept.names?.any { isFrenchPreferred(it) } ?: false
                    frenchName[concept.external_id] = concept.names?.find { isFrenchPreferred(it) }?.name
                    datatypeOf[concept.external_id] = concept.datatype?.toString()
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
int answerLabelsChecked = 0
int expressionValidators = 0
int newbornMembersChecked = 0
// '<form file> <question id>' -> what each answer shows in French: its label, else its concept's French name.
Map<String, List<String>> answersShown = [:]
// A newborn's obs group, by its id (newbornMonitoring, nb...), label or concept name.
boolean isNewbornGroup(Map group, Map<String, String> names) {
    String text = [group.id, group.label, names[group.questionOptions?.concept]].findAll().join(' ')
    return text =~ /(?i)newborn|nouveau-n|\bbaby\b|\bb[ée]b[ée]\b/
}
List<File> formFiles = filesIn(formsDir, '.json')
if (!formFiles) {
    throw new IllegalStateException("No form under ${formsDir}: the check would pass without checking anything")
}
Map<String, File> frenchTranslationFiles = filesIn(translationsDir, '_translations_fr.json').collectEntries { [(it.name): it] }
formFiles.each { File file ->
    def form = slurper.parse(file, 'UTF-8')
    File frenchFile = frenchTranslationFiles[file.name.replaceAll(/\.json$/, '_translations_fr.json')]
    Map french = frenchFile ? (slurper.parse(frenchFile, 'UTF-8').translations ?: [:]) : [:]
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

        questions.findAll { it.questions && isNewbornGroup(it, englishName) }.each { group ->
            questionsOf(group.questions).findAll { it.questionOptions?.concept }.each { member ->
                newbornMembersChecked++
                String concept = member.questionOptions.concept
                if (vitalSign.containsKey(concept)) {
                    faults << ("${file.name}: ${member.id} in newborn group ${group.id} asks ${concept} " +
                            "'${vitalSign[concept]}', a vital-signs concept, so the newborn's value shows as the " +
                            "mother's vital sign in her chart. Give the newborn its own concept in OCL (#562)")
                }
            }
        }

        questions.each { q ->
            def options = q.questionOptions ?: [:]
            if (options.rendering in ['number', 'numeric'] && !isTrue(options.disallowDecimals)
                    && allowDecimal.containsKey(options.concept)) {
                decimalQuestions++
                if (!allowDecimal[options.concept]) {
                    faults << ("${file.name}: ${q.id} accepts decimals but concept ${options.concept} has " +
                            "allow_decimal false in the OCL export, so the server rejects the save. Set " +
                            "disallowDecimals, or allow decimals on the concept in OCL (#488)")
                }
            }

            if (q.id && options.answers) {
                answersShown["${file.name} ${q.id}".toString()] = options.answers.collect { answer ->
                    (answer.label ?: frenchName[cielConcept.getOrDefault(answer.concept, answer.concept)])?.toString()
                }
            }

            (options.answers ?: []).findAll { it.label }.each { answer ->
                answerLabelsChecked++
                String translated = french[answer.label]
                if (translated && translated != answer.label) {
                    faults << ("${file.name}: ${q.id} has an answer labelled '${answer.label}', which the French " +
                            "translations turn into '${translated}', but the saved-encounter view shows the label " +
                            "untranslated. Remove the label so the concept's name shows, or label it " +
                            "'${translated}' and translate that in the English file (#528)")
                }
            }

            (q.validators ?: []).findAll { it.type == 'js_expression' }.each { v ->
                expressionValidators++
                if (!squash(v.failsWhenExpression) && !squash(v.warnsWhenExpression)) {
                    faults << ("${file.name}: ${q.id} has a js_expression validator with neither failsWhenExpression " +
                            "nor warnsWhenExpression (keys ${v.keySet()}), so it never fires (#562)")
                }
                if (!v.message?.toString()?.trim()) {
                    faults << ("${file.name}: ${q.id} has a js_expression validator with no message, so the engine " +
                            "shows its English default. Give it a 'French / English' message (#562)")
                }
            }

            ([options.concept] + (options.answers ?: []).collect { it.concept }).each { String ref ->
                String concept = cielConcept.getOrDefault(ref, ref)
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

// uuid <TAB> French name OCL must carry <TAB> sheet label <TAB> note; first line is the header.
if (!sheetNamesFile.isFile()) {
    throw new IllegalStateException("No ${sheetNamesFile}: the concept names would not be checked against the sheet")
}
Map<String, String> sheetName = [:]
sheetNamesFile.readLines('UTF-8').drop(1).findAll { it.trim() }.each { String line ->
    List<String> cols = line.split('\t', -1) as List
    sheetName[cols[0].trim()] = cols[1]
}
sheetName.each { String concept, String want ->
    if (!frenchName.containsKey(concept)) {
        faults << ("${sheetNamesFile.name}: concept ${concept} is in no OCL export in ocl/, so its French name " +
                "'${want}' is not checked. Export it, or remove the line if the forms no longer use it (#513)")
    } else if (frenchName[concept] != want) {
        faults << ("concept ${concept} is called '${frenchName[concept]}' in French in the OCL export, but the " +
                "forms requirements sheet says '${want}' (${sheetNamesFile.name}). Fix the name in OCL and " +
                "re-export, or update the file if the sheet changed (#513)")
    }
}

// form file <TAB> question id <TAB> position <TAB> answer as the official list words it <TAB> source.
if (!answerListsFile.isFile()) {
    throw new IllegalStateException("No ${answerListsFile}: the official answer lists would not be checked")
}
Map<String, List<List>> officialList = [:]
answerListsFile.readLines('UTF-8').drop(1).findAll { it.trim() }.each { String line ->
    List<String> cols = line.split('\t', -1) as List
    officialList.computeIfAbsent("${cols[0].trim()} ${cols[1].trim()}".toString()) { [] } << [cols[2].trim().toInteger(), cols[3]]
}
int answerListsChecked = 0
officialList.each { String question, List<List> rows ->
    List<String> want = rows.sort { it[0] }.collect { it[1] }
    List<String> shown = answersShown[question]
    if (shown == null) {
        faults << ("${answerListsFile.name}: no form question '${question}' with answers, so its official list " +
                "is not offered. Fix the form or the file (#609)")
    } else if (shown != want) {
        faults << ("${question} offers ${shown} but the official list is ${want} (${answerListsFile.name}). " +
                "Give the form those answers, in that order, labelled as the list words them (#609)")
    } else {
        answerListsChecked++
    }
}

// Members of the "Imaging procedures" set: Members column of concepts/imaging_procedures.csv.
int imagingChecked = 0
filesIn(imagingSetFile, 'imaging_procedures.csv').each { File csv ->
    List<String> lines = csv.readLines('UTF-8')
    List<String> header = lines[0].split(',') as List
    int membersCol = header.indexOf('Members')
    lines.drop(1).findAll { it.trim() }.each { String line ->
        // the Description column is quoted and may hold commas; Members is uuids joined by ';'
        String members = (line =~ /(?:[0-9a-f-]{36};)+[0-9a-f-]{36}/).with { it.find() ? it.group() : '' }
        if (membersCol < 0 || !members) return
        members.split(';').each { String member ->
            if (!datatypeOf.containsKey(member)) return
            imagingChecked++
            if (datatypeOf[member] in ['N/A', 'None', null]) {
                faults << ("${csv.name}: imaging procedure ${member} has datatype ${datatypeOf[member]} in the OCL " +
                        "export, so it can be ordered but its result is refused (\"Configuration d'analyse invalide\"). " +
                        "Give it datatype Text in OCL, like RX01, and re-export (#546)")
            }
        }
    }
}

faults.addAll(mappingFaults)

if (faults) {
    throw new IllegalStateException("O3 forms check failed:\n  - " + faults.join('\n  - '))
}
log.info("Forms OK: ${decimalQuestions} decimal number questions on concepts that allow decimals, " +
        "${maleOnlyPages} male-only pages that refuse to save, ${groupMembersChecked} members of hidden-by-rule " +
        "groups that repeat the group's rule, ${namedConcepts.size()} question and answer concepts with a French name, " +
        "${sheetName.size()} French names as the requirements sheet gives them, " +
        "${answerListsChecked} questions offering their official answer list, " +
        "${mappingsChecked} OCL mappings with a target, ${labConceptsChecked} lab concepts with a French name, " +
        "${diagnosesChecked} diagnoses with an ICD-10 code, " +
        "${answerLabelsChecked} answer labels the saved-encounter view shows as the entry form does, " +
        "${imagingChecked} imaging procedures that take a result, " +
        "${expressionValidators} js_expression validators with a condition and a message, " +
        "${newbornMembersChecked} newborn group members on concepts of their own, not the vital signs'")
