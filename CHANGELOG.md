# Changelog

All notable changes to the UVL-EMR distribution.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Dates are ISO 8601 (`YYYY-MM-DD`).

**Every release states where it actually reached, because merged does not mean live:**

| Tag | Meaning |
|---|---|
| `Production` | Live for users at `uvl-emr.madiro.org` |
| `Analytics` | Live at `uvl-emr-analytics.madiro.org` (deploys independently of the EMR) |
| `UAT` | Merged and available at `uvl-emr-uat.madiro.org` only — **users cannot see it yet** |

Feature-by-feature verification status: `Documentation/uvl-mugamba/VERIFICATION.md` in
MSF-OCG/LIME-EMR-Tooling.

---

## Current status — 2026-10-15

- Production last received an EMR update on **2026-09-30**: UVL-EMR `main` `393f5b5`, which is
  release candidate `a218cae` plus #357, #358 and #359 (section `[2026-09-30]` below). The
  product owner checked it on production the same day.
- `[Unreleased]` below is UVL-EMR `main` `75a339a`. It holds the 7 Oct release (#388–#391), the
  product owner's answers of 8 Oct (#417–#421), radiology (#424, #427–#430), the billing bridge
  (#404, #435) and the local-run fixes (#432, #433). The 7 Oct release was not deployed on
  7 → 8 Oct; the whole section goes to production with the move to the new Scaleway host, planned for
  **Thursday 2026-10-15**, once the DNS points there.
- **UAT, 2026-10-15:** the official `globalmadiro` images of `dbc82ff` passed the full browser
  journey as the real staff roles, and every item of this release passed. One fault was found: a
  drug dispensed after the quote was confirmed was billed again. It was fixed by #435 (`75a339a`),
  which passed its own UAT test the same day. Two radiology checks need a separate account: an
  X-ray technician without the radiologist role, to see a report save refused; and a radiologist
  saving a report on a fresh study. Both passed on UAT on 2026-10-14.
- When it reaches production, give the section the deployment date, tag it `Production`, and
  record the running image digests.

---

## [Unreleased] — `UAT` · `main` `75a339a`

- **Reports: « nouveau cas » is the yes/no answer of the staff only (#961, product owner's answer of 23 Nov 2026).** On the dashboard « PBF et rapports Ministère (M6) », tab « Consultations : nouveaux et anciens cas », the case calculated from the patient's history is removed: the dataset « Consultations nouveaux et anciens cas » loses CAS_CALCULE and CAS_CALCULE_ANNEE, the charts « âge × sexe × cas calculé » and « origine des patients × cas calculé » leave the dashboard and the repo, and « cas déclaré contre cas calculé » becomes « nouveaux et anciens cas par service (déclaré) » (same chart uuid). The tab text no longer says the definition is still to be chosen. The consultation register and Fiche 15 already used the staff's answer; their numbers do not change (production, Oct: 153 new / 24 returning; Nov to the 27th: 507 / 19). `Analytics`.
- **Billing: a « Reçu (ticket) » print of a customer invoice for the cashier's 80 mm thermal receipt printer (#964, product owner's request of 24 Nov 2026).** In Odoo, an invoice's « Imprimer » menu gets « Reçu (ticket) »: an 80 mm wide PDF, 3 mm margins, no company header or footer, as long as the receipt (a roll printer feeds the whole page), in a monospace font, in French: hospital name, « REÇU », print date and time, invoice number and date, patient and patient number (UVL-NNNN), cashier (who registered the last payment, else whoever prints), the lines (text cut to one line, without « | Prescripteur : … »; quantity; amount), the total, and for an invoice split between payers each payer's share (« Assurance de base », « Assurance complémentaire », « Patient »; the invoice printed is marked), then « Payé », « Reste à payer » and « Merci ». The A4 invoice prints are unchanged. UVL-Odoo-Addons `insurance_coverage` 17.0.1.6.0, already in the Odoo `ADDONS`, so the boot's `-i insurance_coverage` loads it: it needs a rebuild of the Odoo image only, no compose change. The product owner validates the layout on the printer: paper width (80 mm, not 58 mm), the receipt's length and cut, and whether the invoice or the payment is the document to print (#964).
- **Laboratory: a new orderable test « BP11 - Bandelette urinaire » / « BP11 - Urine dipstick », with its own result form (#962, product owner's request of 25 Nov 2026).** The strip is a test of its own, apart from the direct urine examination (BP07, #950) and the urine culture (BP09). The paper form was not sent, so the result form is the standard 10-parameter strip, to be validated by the product owner: leucocytes, nitrites, urobilinogène, protéines, pH, sang / hématies, densité, corps cétoniques, bilirubine and glucose, then a comment. Leucocytes, protéines, sang, corps cétoniques, bilirubine and glucose take « Négatif », « Traces », « + », « ++ », « +++ »; nitrites « Négatif », « Positif »; urobilinogène « Normale », « + », « ++ », « +++ » (the existing shared answers of the lab results and the partograph, no new answer); pH is a number from 5 to 9 with decimals, densité a number from 1.000 to 1.030 with three decimals. `concepts/urine_dipstick_962.csv` creates the LabSet and its 11 members; `conceptsets/urine_dipstick_962.csv` adds it to « Orderable labtests » (the order basket and the Laboratory app) and « Labtests results set » (the results page). Odoo product « BP11 - Bandelette urinaire » in `product_variant/labtests.csv`, keyed on the concept, so the order reaches the quotation; no price, the hospital enters it in Odoo. No MFP row: the MFP laboratory list has no strip line. No OCL concept for a urine dipstick panel existed (the CIEL urine protein and glucose results are ANC form questions and are not reused, so ANC readings stay out of this test's results). Not verified: UAT.

- **Laboratory: an old direct urine examination result (BP07) also shows its « Globules rouges » value in « Résultat antérieur : … » (#959, found on UAT while testing #950).** Two old result groups held a numeric « Globules rouges » that was never one of the seven #209 components, so #950's comment left it out. Liquibase `urine_examination_old_results_other_members-20261127` appends to each « Résultat antérieur » comment « ; <name> : <value> » for every other non-voided member of the group with a value that is not a current BP07 member and is not yet in the comment (French name, decimal comma: « Globules rouges : 2,5 »). Only the comment's text changes; running it again appends nothing.
- **Billing: MFP pays « Vaccinostyl » at 70% of at most 100 BIF per unit (#960).** The blood lancet added by #953 had MFP at 70% of the clinic price with no ceiling; MFP's device list prices it as « VACCINOSTYLE » (N° 550, 100 BIF, 70%). It is now in the MFP matching (`N:550`, exact) and its single MFP row in `insurance_coverage/mfp-issue184.csv` is in `amount` mode at 100, so the patient (or PNB) pays the difference above MFP's price. Other payers are unchanged.
- **Laboratory: the stool examination (BP06) has parts 1 (macroscopic) and 3 (parasitological) of the paper result form (#371, form sent by the product owner on 25 Nov 2026).** The result form shows, in French and English, « Examen macroscopique » consistance (moulée, molle, liquide, dure), couleur (marron, jaune, noire, verdâtre, sanglante), aspect (normal, glaireux, graisseux), sang visible, mucus / glaires and vers visibles (absent, présent) with a text field naming the worms; then « Examen parasitologique » kystes d'amibes (*Entamoeba histolytica*), kystes de *Giardia*, oeufs d'*Ascaris*, d'ankylostome, de trichocéphale, de *Taenia*, de bilharzie and larves d'anguillule (absent, présent), « autres » as text, and the existing comment. Part 2 of the paper form was not sent and is not built. `concepts/stool_examination_371.csv` creates the 16 fields and 13 new answers (« Marron » is the existing CIEL concept; « Absent » and « Présent » are new and shared); `conceptsets/stool_examination_371.csv` makes them the members of BP06 in the form's order. The orderable BP06, its concept and its Odoo product are not touched, so billing is unchanged. The eleven components BP06 had since #388 leave the set (Liquibase `stool_examination_remove_old_components-20261127`); a result entered on them stays in its group and is shown as one line « Résultat antérieur : … » in the comment, with any comment typed before appended (`stool_examination_keep_old_results-20261127`). Results migrated by #415 are unchanged. No Superset dataset reads these concepts. Not verified: the Laboratory app on UAT.
- **Pharmacy: two consumables added, « Vaccinostyl » (blood lancet) and « Tube à glycémie » (blood glucose tube) (#953).** Odoo products and OpenMRS drugs on new concepts (`concepts/consumables_953.csv`), category « Drug orders », unit Unité, purchasable and sellable, tracked by lot, MFP coverage 70% with no ceiling (as the consumables without an MFP line), and a stock item each, counted per Unité. No price is set: the hospital enters them in Odoo. Restart OpenMRS once after the first deploy if the stock items are missing.
- **Laboratory: the direct urine examination (BP07) has the macroscopic and microscopic parts of the paper result form (#950, product owner's answer of 25 Nov 2026, after asking the lab technicians).** The result form shows, in French and English, « Examen macroscopique » colour (jaune clair, jaune foncé, ambré, rouge, trouble) and appearance (clair, trouble, limpide), then « Examen microscopique » leucocytes and hématies per field (numbers), épithéliales (rares, nombreuses), cylindres (absents, hyalins, granuleux), cristaux (absents, oxalate, urate, phosphate), levures (absentes, présentes), bactéries (absentes, rares, nombreuses), parasites (absents, *Schistosoma haematobium*, autre) and a comment. `concepts/direct_urine_examination_950.csv` creates the 10 fields, their 18 answers (« Autre » is the existing one) and the comment; `conceptsets/direct_urine_examination_950.csv` makes them the members of BP07 in the form's order. The orderable BP07, its concept and its Odoo product are not touched, so billing is unchanged. The strip test and the culture (BP09) are other result forms and stay as they are. The seven components BP07 had since #209 leave the set (Liquibase `urine_examination_remove_old_components-20261125`); a result entered on them stays in its group and is shown as one line « Résultat antérieur : … » in the comment (`urine_examination_keep_old_results-20261125`, which runs on the start after the one that creates the comment concept, like #415). No Superset dataset reads these concepts. Not verified: the Laboratory app on UAT.
- **Pharmacy: the printed cards of a stock item's Transactions tab fetch in pages of 100, follow the whole period, and the stock card is of the chosen item (#941, UAT build b939-944).** The bin card asked for `limit=1000` and the server answered HTTP 500 (`webservices.rest.maxResultsAbsolute` is 100), so the preview fell back to the 10 rows shown: it now collects pages of 100 up to 2000 movements and says so when the list is cut. The end date of the period was not always sent (a day typed in the box did not reach the filter): both dates are now read, also when the box is left. The stock card (patient dispenses) was fetched with no item, location or period and listed every item's dispenses; it now carries the same item, location and period. The two print entries had the same French label: « Imprimer la fiche de stock » (bin card) and « Imprimer la fiche de dispensation patient » (stock card). The Balance column is unchanged. Stock app `3.3.1-uvl.18` (fork PR `jnsereko/openmrs-esm-stock-management-app#5`); the module is unchanged.
- **Pharmacy: the bin card of a stock item's Transactions tab opens a print preview, and the Location filter shows the chosen location (#941, found on UAT 25 Nov 2026 while checking #921).** « Imprimer la fiche produit » opened an empty modal because the card header read the logo from another module's config (`@kenyaemr/esm-login-app`), which never loads in this distro, so the modal waited forever; it now reads the stock app's own `logo` setting (the stock card header too). The preview lists the movements of the whole filtered list (period and location of the tab, up to 1000), not only the page shown. The Location box went back to its placeholder after a choice because the list reloads and remounts it; the tab now keeps the choice, and « Tous les emplacements » shows after clearing. Stock app `3.3.1-uvl.17` (fork PR `jnsereko/openmrs-esm-stock-management-app#5`); the module is unchanged.
- **Pharmacy: the Location filter and the pager of a stock item's Transactions tab work (#921, found on UAT 24 Nov 2026 while checking #917).** The Transactions endpoint reads `partyUuid` and ignores `locationUuid`, which the tab sent: the filter now sends the location's stock party, and « All locations » removes it. « Items per page » now refetches with the new limit from page 1 (the page and size were kept in a component the tab remounts on every fetch, so the size never reached the request and the label went back to page 1), and the pager label follows the page and the total. At a narrow width the filters wrap inside the toolbar instead of covering the table header. The date filter of #917 works together with location and page size. Stock app `3.3.1-uvl.16` (fork PR `jnsereko/openmrs-esm-stock-management-app#4`); the module is unchanged.
- **Billing: every unit a prescriber can choose has an Odoo unit of measure (#930).** A prescription in « Rouleau » (Roll) failed in the OpenMRS → Odoo bridge with « No Uom found with id cb3566e8-… » and was retried forever, so the medicine never reached the quotation. The bridge finds the unit by the concept uuid as the external id (`init.<uuid>`); four units of the dosing and stock units sets had none: Rouleau, Paire (Pair), Ovule and Baxter (IV bag), the last three added with #454. Added to `units_of_measure/uvl-product.uom.csv`, in the same unit category as « Unité », ratio 1. Every other unit of the dosing set (47), the dispensing set (9) and the stock units set (21) already had one. After the deploy the Odoo initializer loads the four rows (check the stale `odoo-checksums` volume if they are skipped).
- **Maternity: a completed obstetric ultrasound can be printed for the patient (#933, product owner's request of 24 Nov 2026).** The « Imprimer cette consultation » action of the visit summary (patientdocuments) needs the privilege « App: Print encounter forms », which no role held. `roles_mugamba.csv` grants it to Midwife and Inpatient Consultant, the two roles that hold « Edit Gynaecology Ultrasound » (the privilege is not per form: they can print any completed form they can see). The module's feature flag `patientdocuments-module` is set by the frontend from the installed backend module, so it needs no setting. New `jsonkeyvalues/encounterPrintingConfig.json` turns on the PDF header (patient name, identifiers, form, location, encounter date) and puts the hospital name in the footer; the module leaves every header field off by default.
- **Printing: the encounter PDF in French (#940, found testing #933).** The module (patientdocuments 1.2.0) looks every form label up as a message code in the session language, prints its header labels in English from a fixed stylesheet, and names the form by its technical name. `messageproperties/uvl_printing_fr.properties` gives the French of every form label (from the form translation files; a label translated two ways in two forms is left out unless the ultrasound form uses it). `printing/encounterFormFopStylesheet.xsl`, selected by `report.encounterPrinting.stylesheetPath`, has French header labels, the form title from the form's French translation, a footer with the print time only (the module names the system user of the background job, not the person who printed), and leaves out unanswered questions and blocks. The person who printed cannot be shown without a module change (follow-up in the PR). The labels are French only when the printing user's session language is French.
- **Pharmacy: stock reports open correctly in Excel (#924, product owner's report of 24 Nov 2026).** The report files were comma-separated UTF-8 without a byte-order mark: accents broke (« ComprimÃ© ») and, on a French Excel, every row landed in column A. The Reports list now fetches the file and saves it as UTF-16LE with a byte-order mark and tab separators under the same `.csv` name, which Excel reads with accents and columns intact on French and English settings; the server file and its content are unchanged (values are copied as written, so Excel still decides how to show a batch number such as `0251999` or a date). Anything but a CSV, or a failed fetch, opens as before. Stock app `3.3.1-uvl.15`, replacing `.uvl.14`; source `jnsereko/openmrs-esm-stock-management-app` `uvl/924-report-download-excel` (PR 3); not proposed upstream yet.
- **Inpatient: blood transfusion request and outcome on the follow-up forms (#934, product owner's answer of 24 Nov 2026).** The doctor's form gets a section « Demande de transfusion »: transfusion requested (Oui/Non) and, only when Oui, blood product (sang total, culot globulaire, plasma, plaquettes), number of bags requested (whole number 1–20) and reason / indication. The nurse's form gets a section « Transfusion »: transfusion given (Oui/Non) and, only when Oui, product, number of bags transfused (1–20), volume (ml) (reuses the IPD monitoring form's « Transfusion : volume (ml) » concept), reaction or complication (Oui/Non) and, when Oui, its description. Oui and Non are the existing answers. The IPD monitoring form's « Transfusion : type » is a free-text concept, so it cannot hold a list: 12 new concepts (`concepts/transfusion_request_934.csv`), among them a coded « Produit sanguin » shared by both forms with its four answers. Existing fields untouched. No report change (Fiche 6 reading guide in the PR). Not verified: the forms on UAT.
- **Maternity: « Gynaecology Ultrasound » is shown as « Échographie obstétricale » / « Obstetric ultrasound », and the foetal state gets the answer « Vivant et actif » / « Alive & active » (#925, hospital's forms review sheet of 24 Nov 2026).** The name is changed the way #892 did it: `form_name_translation` of both translation files and the page label with its translation key; the form `name` (`UVL Gynaecology Ultrasound Form`), its uuid, file names and encounter type (« Échographie gynécologique ») are unchanged, so the forms list, the female-only restriction, privileges and past encounters keep working. The foetal-state question of each of the three foetus blocks (the form has three, the sheet shows two) offers a new answer concept « Fœtus vivant et actif » (`concepts/ultrasound_foetal_state_925.csv`, uuid `1b2eadd0-…`; no existing concept means that, only « Fœtus vivant » and « Fœtus actif »), after « Actif ». It is not registered on the question concept (as #896), so the form saves it and existing records open as before. Nothing else in the form changes.
- **Maternity: delivery registration offers three modes of delivery only (#922, product owner's answer of 24 Nov 2026).** Takes the answers « Forceps », « Vacuum extraction » and « Other » off « Mode of Delivery » again (added by #896, not yet deployed): the form offers eutocic, dystocic and caesarean, in that order (the order was eutocic, caesarean, dystocic). Forceps and vacuum extraction are written in « Dystocia (specify type) », shown for dystocic only, which now carries the hint « Specify: forceps, vacuum extraction, shoulder dystocia… » (fr « Préciser : forceps, ventouse, dystocie des épaules… »). The caesarean indication (nine answers, shown for caesarean only), « Description » and every show/hide rule are unchanged; no expression named a removed answer, and « Mode of Delivery » stays required. The two answer concepts (forceps, vacuum) stay in `delivery_registration_896.csv`, unused by any form (not retired: removing or retiring is not needed, and Initializer has loaded the file). Translations: the two English translations of the removed French labels are dropped; « Other » / « Autre » stays (used by other questions). Not verified: the browser on UAT.
- **Visits: the start-visit form offers « Consultation » and « Hospitalisation » only (#918, first part).** `visittypes.csv`: « Outpatient visit » is shown as « Consultation » (fr and en), « Inpatient visit » as « Hospitalisation » (fr) / « Hospitalization » (en), and « General » is retired so the form no longer offers it. Names and uuids are unchanged, so `visits.autoCloseVisitType` (matched by name; core and `imagingpaymentgate` read all visit types, retired included) still closes open General visits, and existing General visits stay readable. Not delivered: a rolling 24-hour close of consultations (the nightly task is unchanged), converting past General visits. The same label « Consultation externe » on the forms section and the location of that name are separate strings and are left alone.
- **Pharmacy: movement of one stock item over a chosen period (#917, product owner's document of 23 Nov 2026).** The « Transactions » tab of a stock item gets a start and an end date next to the Location filter (the Operations list's date pickers, French « Date de Début » / « Date de Fin », and a « Effacer les dates » button). They are sent as the server's `dateMin` / `dateMax` (local midnight of the first day to the last millisecond of the end day, so 24/11 to 24/11 is that local day); a change of location or dates goes back to page 1; empty dates show every movement; the location filter works together with the dates; the balance column (the stock now) ignores the period. The bin card prints the displayed transactions, so it follows the period and the location (the current page of the list, as before); the stock card is unchanged. Stock app `3.3.1-uvl.14`, replacing `.uvl.13`; source `jnsereko/openmrs-esm-stock-management-app` `uvl/917-transactions-date-filter` (PR 2); not proposed upstream yet.
- **Inpatient: the follow-up note is split into a doctor's form and a nurse's form (#926, the hospital's reviewed sheet of 24 Nov 2026).** New forms « Suivi d'hospitalisation (médecin) » (`UVL-IPD-Follow-up-Doctor-Form.json`: complaints, physical examination, diagnostic hypothesis as an unconfirmed encounter diagnosis, on-going treatment; lab tests to be done, treatment to administer, other recommendations; « Réalisé par » is the encounter-provider picker, as on the discharge summary) and « Suivi d'hospitalisation (infirmier) » (`UVL-IPD-Follow-up-Nurse-Form.json`: time point Matin / Midi / Soir, therapeutic, blood pressure left and right arm, respiratory rate with « Normale : 16–20 », SpO2 with « Normale : > 97 », temperature; the sheet's « Pouls » for the pressure is read as « Tension artérielle »). Both are listed in « Hospitalisation » in place of the old form and reuse the old form's concepts (complaints, examination, current treatment, tests requested, new treatment, recommendations, the two arm pressure groups, respiratory rate, SpO2, temperature) and its encounter type « Inpatient Follow-up », so the vitals history, `Usage_mensuel` and the old records are unchanged. Two new concepts (`concepts/ipd_followup_926.csv`): the time point (answers: the existing Matin, Midi, Soir) and the nurse's therapeutic text. The old form stays published and opens its records, shown as « Suivi d'hospitalisation (ancien) » (display name only). Both roles see both forms: the doctor role inherits Nurse and the forms share one encounter type, and the form list has no role setting. Not offered any more: heart rate, weight, height, BMI, weight for height, MUAC, waist, fetal heart rate, neurological signs, fluid balance and stools, Ikirezi information, suspected nosocomial infections (the « post-act infections » sheet reads the outpatient consultation and discharge summary encounters, not this form, so no report loses data), doctor called / arrived, the test and prescription launchers. Not verified: the forms on UAT.
- **Inpatient: discharge summary follows the hospital's reviewed sheet, keeping the fields the Ministry sheets read (#946, sheet of 24 Nov 2026).** « UVL Discharge Summary Form » is changed in place (same name, uuid and encounter type, so saved summaries still open and the « Hospitalisation » list is unchanged). Sheet order: date and time of entry, release date and time, reason for admission (reused complaint concept); diagnosis at discharge (the existing coded encounter diagnosis), patient progress (reused clinical-impression text), lab exams done, treatment received, exit terms, authorization type (cured / ambulatory, counter-referred, transfer; shown when the exit is neither an escape nor a death); completed tests, diagnoses as text, requested additional tests (reused), treatment / prescription medications; treatment (drugs) and prevention of complications (reused); payment method (the visit « Payer » concept and its answers, Cash, MFP, CAM, MSU 60 %, MSU 70 %, Santé Assuré, DGAC, private and other insurance, Mobile Money, free care); performed by (encounter provider). Kept although the sheet drops them, because the Ministry sheets and « Fiche 1 / 2 / 3 / 5 » read them, with their concepts unchanged: « Exit terms » is the existing outcome question with its ten answers (including death before and after 24 hours), date and time of death, death audit, pregnant woman, malaria classification and treatment, diarrhoea classification and treated, pneumonia classification and antibiotics, suspected nosocomial infections. Dropped from the form (no dataset reads them; saved values stay): reporting indicators, general observations, course of action / follow-up. Eleven new concepts in `concepts/discharge_summary_946.csv`. Not verified: the form on UAT.
- **Theatre: anaesthesia monitoring entered one reading at a time, with a chart that updates (#907, product owner's document of 23 Nov 2026).** The twelve-row form is filled in one sitting; the request is the partogram's approach. New form « Mesure d'anesthésie (une à la fois) » (`UVL-Anaesthesia-Reading-Form.json`, in « Bloc opératoire »): one reading per encounter, with its date and time (the encounter's, no future date, not before the visit start) and the same seven values and concepts as one row of the twelve-row form (systolic and diastolic pressure, pulse, stage, respiration, Sa O2, medication), in the same obs group and the same encounter type « Anaesthesia Monitoring », so nothing that reads those obs changes. The card « Surveillance pendant l'anesthésie » on the patient summary (`uvl-anaesthesia-chart-widget`, in the partograph app `esm-uvl-partograph-app` 1.4.0, same SVG panels) charts the latest operation (readings after a gap of more than 12 hours start a new one): pressure bars with the pulse line, Sa O2, respiration, and a list of stage and medication, in time order, hour 00 being the first reading. A side-panel button « Anesthésie » (privilege `Edit Anaesthesia Monitoring`) opens the form and the chart redraws on save. Records of the old form stay: the chart reads their groups with their own « Date de la mesure », the old form stays published (so « Modifier » on an old encounter still works) and is listed as « Surveillance pendant l'anesthésie (12 mesures, ancien) » (display name only, form name and uuid unchanged). Configuration under the `anaesthesia` key of `@madiro/uvl-partograph` in the site frontend config; the new form's uuid there is the one Initializer computes from its name (see #565). Not verified: the browser on UAT. Not done: editing a reading from the chart (use « Modifier » on the visit's encounter list), unit alerts.
- **Pharmacy: « External Requisition » is no longer offered in the stock app either (#914).** Follow-up of #904: the « Opération » filter still listed the separate type « External Requisition » (code `externalrequisition`). The code is added to `hiddenOperationTypes` in the site frontend config, now `["requisition", "externalrequisition"]`; config only, same stock app `3.3.1-uvl.13`. Existing operations of the type stay readable (none on UAT); receipts, stock issues, transfers, adjustments and stock take are unchanged.
- **Pharmacy: « Réquisition » is no longer offered in the stock app (#904, product owner's document of 23 Nov 2026).** « Nouvelle opération » and the « Opération » filter of the Opérations tab leave out the types listed in the new stock-app setting `hiddenOperationTypes`, set to `["requisition"]` in the site frontend config. Receipt, stock issue and its confirmation, transfers, adjustments and stock take are unchanged, and so are the users' stock scopes: the requisitions already made (6 approved, 5 completed on production) still open, list and can be issued (« Sortie de stock »). Stock app `3.3.1-uvl.13`, replacing `.uvl.12`; the build renames one chunk (`3527` → `4842`) and drops six stale pairs; source `jnsereko/openmrs-esm-stock-management-app` `uvl/904-hidden-operation-types` (PR 1); not proposed upstream yet.
- **Reports: new and returning cases by age, sex and origin, and the diagnosis notification (#854, product owner's request of 22 Nov 2026).** Two datasets and seven charts are added to the dashboard « PBF et rapports Ministère (M6) » in two new tabs. « Consultations : nouveaux et anciens cas » shows the outpatient consultations by age band × sex, by origin (« Situation » and province, spellings folded) and a declared-against-computed table, each per month and service; the case is shown twice, as declared by staff and as computed (first outpatient consultation on record), because the two disagree for about one consultation in five and the product owner has not chosen yet; the totals equal Fiche 15 (checked on production, Oct and Nov 2026). « Diagnostics » gives the ten main confirmed diagnoses with their ICD-10 code and a pivot by age band × sex, per month and service; the ICD-10 code is read so that it is found when it is the last mapping. The month and service filters of the dashboard apply to the new charts. Fiche 1 is unchanged (it stays empty until wards complete admissions). Datasets `Consultations_nouveaux_et_anciens_cas.yaml` and `Diagnostics_a_la_sortie.yaml`, charts 40 to 46, dashboard `PBF_et_rapports_Ministere_M6_5.yaml`. Imported on the live analytics Superset on 23 Nov 2026 with `superset import-directory -f -o` (the nightly command) and rendered with production data: both new tabs and the existing tabs render, totals equal Fiche 15 and the PBF register (Oct 177, Nov to date 163), the Mois and Service filters apply to the new charts. The import showed that the three datasets with `schema: null` (Fiche 15, PBF synthèse mensuelle, Usage hebdomadaire) fail after an import (« relation does not exist »: the importer turns a null schema into `main`); they now say `schema: public`. The dashboard file also carries the live filter scope of the quality-control charts and the new tabs in the Mois filter scope.
- **Medicines: five products take the names proposed by the pharmacy (#895, product owner's document of 23 Nov 2026).** Renames only, same uuids, so stock on hand, past prescriptions and Odoo prices are kept and no drug or product is created: « Amoxicilline Sirop 125mg/5ml » becomes « Amoxicilline Sirop 125mg/5ml 100ml » (`072054ee-b1d3-433b-9808-b4a29f482e63`), « Amoxicillin Suspension 250mg/5ml 100ml » becomes « Amoxicilline Sirop 250mg/5ml 100ml » (`5a45d516-4cf9-4393-9c41-d659084ca491`), « Bandage Velpeau 10cmx4m » becomes « Bande Velpeau 10cmx4m » (`08da2277-5bc8-497b-8b09-b5cf31f19153`, like its 15cmx4m sibling), « Sac à urines » becomes « Sac collecteur à urines » (`3830c927-c9c9-4cfe-b07f-f546d2f756c7`, English name « Urine Collection Bag ») and « Jeu de perfusion » becomes « Set de perfusion » (`4dd363d1-b503-4ce3-ad9b-d5dc0710236e`). The drug rows in `drugs/uvl-drugs.csv` and the Odoo products in `product_variant/uvl-drugs.csv` take the new names; changeset `stock_item_common_name_pharmacy_names-20261124` renames the stock items (only while the name is empty or still an old one). « Amoxicilline Gélule 500mg » and « Artésunate Suppositoire » already carry the requested names. Left out: the artesunate suppository strength (not given), and the 80 ml and 60 ml amoxicillin packs, which are different packs.
- **Medicines: « Kemoxyl+F Capsule 250/250mg » is renamed « Kemoxyl+F Gélule 250/250mg » (#887, product owner's decision, row H3 of the decisions sheet).** Same medicine, same uuid (`0b273e54-5dc0-4718-ac57-6c13dcbb961d`): the drug row in `drugs/uvl-drugs.csv` and the Odoo product `init.0b273e54-5dc0-4718-ac57-6c13dcbb961d` in `product_variant/uvl-drugs.csv` take the new name, and changeset `stock_item_common_name_kemoxyl_gelule-20261123` renames its stock item (only while the name is empty or still an old one, so a name typed in the stock app is kept). Stock on hand, past prescriptions and the Odoo price are untouched; no new drug or product is created. The drug concept is unchanged, so no OCL package changes.
- **`scripts/form-concept-references.py` also checks the frontend apps' built-in defaults (#841).** The 15 KB refusals of production saves (HTTP 400, a concept the server cannot find) came from bare `POST /encounter` requests sent by the order basket, vitals, visit-note and ward apps, whose concepts can be defaults of the app's config schema that the site config does not set, and neither the forms nor the site config show them. The script now reads the config schemas of the apps in `spa-assemble-config.json` (the patched apps from `distro/frontend/*/dist`, the others from their npm tarball with `--fetch`, or from a folder given with `--bundles`), lists the uuid defaults the site config does not override (`defaults`, with the apps that save marked) and adds a query to `sql` that returns the ones a database does not have, with the app and the key path. Script only: no application, form or config change.
- **The application address without « home » reaches the application (#873, seen on UAT on 22 Nov 2026).** `/openmrs/spa/` answered `301` to `http://<site>/home`: the frontend nginx rule `location = / { return 301 /home; }` is made absolute by nginx behind a proxy that strips the `/openmrs/spa` prefix, so the base path and https were lost and a bookmark without `home` ended on « 404 page not found ». The rule now answers with a relative redirect to home under the public prefix (the proxy's `X-Forwarded-Prefix`, or `/openmrs/spa`), which also covers the address without the final slash (serving the application there gave a blank page).
- **Prescriptions: a refusal that is not a field error shows a sentence, not the raw message key (#872, seen on UAT on 22 Nov 2026).** Signing a second active prescription of the same medicine is refused by the server with an HTTP 500 and the key `Order.cannot.have.more.than.one`; the order basket showed that key in brackets. It now reads « Ce patient a déjà une prescription active pour ce médicament. Arrêtez ou modifiez la prescription existante. » under « Les prescriptions n'ont pas été enregistrées ». Any other refusal whose message is a bare key shows the server's own readable sentence when it sent one, otherwise « Le serveur a refusé la prescription. » followed by the key in brackets for support; a message that is already a sentence is shown as it is, and field errors (#869) are unchanged (`esm-patient-orders-app` `13.0.2-pre.12863.uvl.13`, replacing `.uvl.12`, branch `uvl/872-orders-server-error-message`; not proposed upstream yet). No file of the build is added or removed.
- **Speed: the frontend serves its precompressed files, and requests are timed (#806, product owner's report of 19 Nov 2026).** The assembly writes a brotli and a gzip copy next to every chunk, and the frontend nginx served neither: Traefik compressed each file again on the fly, and to gzip even for a browser that accepts brotli (a chunk of 9.8 KB gzip is 9.1 KB brotli; the larger chunks save about 20 %). The frontend image now carries `scripts/bundled-docker/frontend/nginx.conf`: brotli to browsers that send `br`, the `.gz` copy to the others, never for `index.html` and `service-worker.js` (the container rewrites both at start, so a baked-in copy is stale), and `immutable` on the fingerprinted chunks, styles and fonts so a reload does not revalidate them (`importmap.json`, `routes.registry.json` and `index.html` stay revalidated). `esm-devtools-app` and `esm-user-onboarding-app` are no longer assembled (11 files, about 215 KB raw on a cold first opening). The Tomcat access log ends with the duration in ms (`%D`) and the frontend and proxy nginx logs carry `rt=` (and `urt=`). Not a fix for the patient summary's repeated calls (analysed separately); the Traefik access log (`LIME-EMR-Tooling`) is a separate change.
- **Billing: the first orders signed together after an OpenMRS start keep their OpenMRS bill (#846, 2 orders of 260 on UAT, 20 Nov 2026).** Billing 2.4.0 creates and loads its receipt number generator on the first bill, with no lock, and assigns it before it is loaded, so a burst that is the first billing since the start can hand one order a generator that is not ready: « Cannot invoke …getGroupingType() because "this.model" is null », the order saved and its OpenMRS bill skipped (Odoo billing unaffected). `imagingpaymentgate-1.0.0-SNAPSHOT.omod` (`distro/binaries/openmrs/modules`, same file name, source jnsereko/openmrs-module-imagingpaymentgate `fix/846-warm-receipt-number-generator`) now calls billing's `ReceiptNumberGeneratorFactory.getGenerator()` once from its `contextRefreshed()`, in the context refresh that ends the start, before the first order can be billed, so the generator is created and loaded by one thread; the OpenMRS log shows, at WARN (UAT logs `org.openmrs` at WARN; the line is informational), « (information) Receipt number generator warmed at start-up: …SequentialReceiptNumberGenerator loaded (UVL-EMR#846) ». Billing is reached by reflection: no `require_modules` (only `aware_of_modules` for start order), and without billing or without `billing.systemReceiptNumberGenerator` the warm-up logs and does nothing. Compared with the previous build entry by entry, only `ImagingPaymentGateActivator`, the new `ReceiptNumberGeneratorWarmUp` and `config.xml` (the `aware_of_modules` block) differ; no Liquibase. It narrows the window, it does not remove the bug from billing (not fixed upstream in 2.5.0 or `main`); a billing restart from the module page is re-warmed by the next refresh. A post-deploy order is no longer needed to load it.
- **Prescriptions: a duration without its unit (or a quantity without its unit) is no longer sent to the server, and a refused order says why (#869, production report of 21 Nov 2026).** Twelve saves were refused with « Invalid Submission » because a medicine had a duration and no « Unité de durée » (OpenMRS: `DrugOrder.error.durationUnitsRequiredWithDuration`; a quantity with no unit is refused the same way). The prescription form now asks for the unit (« Choisissez l'unité de durée »), offers days as soon as a duration is typed, and asks for the quantity unit too (`esm-patient-medications-app` `13.0.2-pre.12863.uvl.5`, jnsereko/openmrs-esm-patient-chart `uvl/869-medications-duration-unit`). Any other refusal of « Signer et fermer » shows its reason in the order basket instead of only « Invalid Submission » (`esm-patient-orders-app` `13.0.2-pre.12863.uvl.12`, branch `uvl/869-orders-field-errors`); not proposed upstream yet.
- **Laboratory: each completed test of a patient can be edited from the « Terminé » tab (#847, UAT runs of 20 and 22 Nov 2026).** « Modifier les résultats » on the patient's row passes all the patient's completed tests to a modal that preselects the first one (a « Select test to edit » list shows when there are several), so confirming straight away always opened the first, the malaria smear in the report. Each completed test in the expanded row now has its own « Modifier les résultats » button that opens that test's results form; the row action is unchanged. A patient with one completed test is unchanged, as is the « En cours » tab. Patched `esm-laboratory-app` 1.6.0-uvl.2 (was uvl.1); no file of the build is added or removed.
- **Anaesthesia monitoring: an intervention time before the visit start is refused with a sentence, not replaced (#880).** Found on UAT on 23 Nov 2026 in the « Surveillance pendant l'anesthésie » form: an intervention time typed before the start of the visit (02:41 on a visit started at 03:01) was saved as the visit's start, without a word, because the server refuses an encounter dated before its visit and the engine (`uvl.16`, #841) files it at the visit's start instead. The form's `encounterDatetime` question (`operationDatetime`) now has a `js_expression` validator, « L'heure de l'intervention ne peut pas précéder le début de la visite », so the field is flagged and the save blocked until the time is corrected. A form's validator expressions could not see the visit (`visit` was always empty in them), so `@openmrs/esm-form-engine-app` `13.0.2-pre.12863.uvl.18` hands the visit to the validators and adds the expression helper `isBeforeVisitStart(date)` (to the minute; false with no visit); no other form uses it, and the other forms are unchanged. The reading's date field read « Heure de la mesure » next to a time field read « Heure »: it now reads « Date de la mesure » (form and both translation files, twelve rows). Not done: prefilling each reading's date with the intervention date. A prefilled date would be saved for the twelve rows, empty ones included. Library branch `uvl/5.0.1-pre.2754-880`, app branch `uvl/form-engine-13.0.2-pre.12863-880`.
- **Forms: a section marked `isExpanded: "false"` opens collapsed (#863).** Found on UAT on 22 Nov 2026 while checking #852: the form engine read a section's `isExpanded` when parsing the form but opened every section from the form-level flag alone (`CollapsibleSectionContainer`, `useState(isFormExpanded)`), so no section could open collapsed by itself. In `@openmrs/esm-form-engine-app` `13.0.2-pre.12863.uvl.17` a section whose `isExpanded` is `false` or `"false"` starts collapsed and opens on a click on its title; every other section opens as before, and the form's « collapse all / expand all » toggle still closes and opens every section, this one included. A save blocked by an invalid field in a collapsed section opens that section before scrolling to the field. The only form with such a section is `UVL-Inpatient-Follow-up-Form.json` (« Appel du médecin », #852); no other form sets `isExpanded` to false, so none changes. Library branch `uvl/5.0.1-pre.2754-863`, app branch `uvl/form-engine-13.0.2-pre.12863-863` (README of the module).
- **Stock: a pharmacist sees the reports they requested and can download them (#862).** In Stock Management → « Rapports » the list stayed empty (« No Stock reports to display ») although the report was generated: stockmanagement 2.1.2 lists a batch job only if its location is in the user's reports scope, and a Report job has no location, so none was ever listed or readable (`GET batchjob` returned no result, `GET batchjob/<uuid>` a 404). `stockmanagement-2.1.2-uvl6.omod` (replacing `-uvl5`; same Liquibase, libraries and configuration apart from its version) lists a job without a location for any user whose scopes carry `App: stockmanagement.reports`; a job at a location outside the user's scope stays hidden and a user with no reports scope sees nothing. Every report in the user's scope is visible to anyone holding it (no owner filter). The report names, the « Report name » label and the CSV headers are still in English (jnsereko/openmrs-module-stockmanagement `uvl/2.1.2-report-jobs`).
- **Forms: « Appel du médecin » and « Arrivée du médecin » move to their own section at the end of « Suivi d'hospitalisation » (#852, product owner's request of 19 Nov 2026).** The two optional date-and-time questions « Doctor Called At » and « Doctor Arrived At » (ids `doctorCalledAt` and `doctorArrivedAt`, concepts `e828f49d-…` and `16f8d29e-…`) sat first in the section « Medical Alert, Complaints & Danger Signs » of `UVL-Inpatient-Follow-up-Form.json`; they now form their own last section « Doctor call » (« Appel du médecin »), so the form's first sections are shorter. Same questions, ids, concepts, labels and optional status, so saved encounters keep showing their values; the section title is added to both translation files. **The section opens collapsed since #863** (it did not on UAT b58: the form engine opened every section from the form-level flag alone, so `isExpanded: "false"` had no effect). The ward admission form itself (`IPD-Admission-form.json`) holds neither question; the same pair also exists in the Delivery Registration and Childbirth Record forms, not changed here.
- **Maternity: one ward « Gynéco-Obstétrique » in place of « Soins maternels (accouchement normal) » and « Salle de césarienne » (#848, product owner's decision of 21 Nov 2026).** The maternity ward keeps its UUID, its 22 beds and everything recorded at it, and is renamed « Gynéco-Obstétrique » (`locations.csv`); reports and screens read the name from the location, so no dataset or frontend key changes. « Salle de césarienne » had no bed and is retired: Liquibase `maternity_one_ward-20261122` (runs on every start, idempotent, nothing to do where the room does not exist) moves its visits, encounters, observations, appointments and queue entries to « Gynéco-Obstétrique », retires its queue « Consultation de césarienne » (the maternity queue « Consultation d'accouchement » stays), removes its tags and points a user's default location at the merged ward. Theatre records are at « Bloc opératoire (OR) » and are untouched. A midwife whose sign-in or default location was « Salle de césarienne » must choose « Gynéco-Obstétrique ». Location names have no English translation in OpenMRS: the name is the same in both languages.
- **Odoo: « Envoyer et imprimer » works again on production (#839).** On every invoice it ended in « Erreur Odoo » since 18 Nov 2026: the send wizard always builds the Factur-X XML, and the stored template `account_edi_ubl_cii.account_invoice_line_facturx_export_22` (written by the 14 → 17 migration, 9 Sep 2026) calls `format_unit_price`, a helper the Odoo code in the image does not pass (only `format_date` and `format_monetary`); UAT's view and code agree, so UAT never showed it. Odoo reads a module's views and templates from its files only when the module is installed or updated, so a database migrated with newer views than the image keeps them. Fix, in LIME-EMR-Tooling `Scripts/Bundled-Docker/docker-compose-odoo-sso-uvl.yml` (not in this repository): `account_edi_ubl_cii` is added to the UVL `ADDONS` list, which the Odoo entrypoint turns into `-i` at every start; on an installed module that reloads its data files and those of its installed dependents (`account_edi_ubl_cii_tax_extension`, `account_peppol`, if installed), not `account`. It reads the views from the image at the next start of Odoo, with the normal deploy (`deploy-lime.sh update`), no manual edit; measured on a throwaway database with the UVL image: the module's data loads in 0.5 s and the broken template is replaced by the image's. New `scripts/check-odoo-stored-views.py` (read-only, `--psql` command, `--source` the image's `addons/` and `odoo/`): lists every stored view that calls a `format_*` helper the image's code lacks, and with `--module` every view of that module that differs from the image's XML; on a fresh database it reports nothing, on the production fault it reports the template twice. Not verified: the update on a migrated database (UAT, then production) and « Envoyer et imprimer » itself on an invoice after it. Other stored views of the migration may differ from the image too: run the script on UAT and production before relying on this one module.
- **Lab results: a value added after the first save is no longer lost (#838, production report of 20 Nov 2026).** For a test that is a set (BI03 Protéine C-réactive, with a coded and a numeric member, and the other sets with two or more members), a result saved with one value could not be completed later: reopening it and typing the missing value sent `POST /ws/rest/v1/obs/undefined` (404), the value was lost and « Could not save results for … » showed, because the form updated the observation of every typed value and a member left empty at the first save has none. `@openmrs/esm-patient-orders-app` `13.0.2-pre.12863.uvl.11` adds the value to the saved result group of its set (`POST /obs/<group>` with only the new member in `groupMembers`; the server appends it and keeps the existing members, and refuses `obsGroup` on `POST /obs`, which is what build `uvl.10` sent), after the updates of the same save have settled; a set with no saved group is created with its members; the values that already have an observation are updated as before, empty members send nothing, and the first save and the error message are unchanged. Patch in `jnsereko/openmrs-esm-patient-chart`, branch `uvl/838-orders-lab-result-missing-member`; not proposed upstream yet.
- **Forms: a save refused because the date is outside the visit now files within the visit, or says what to do (#841).** On 19 and 20 Nov 2026 production refused 12 saves with HTTP 400 (289 bytes): `Encounter.datetimeShouldBeInVisitDatesRange`, the encounter dated before its visit started or after it stopped (the bounds are accepted; checked on UAT through REST). The form engine dated the encounter with the browser's session date and, for a form with its own date question (Inpatient Follow-up, IPD Monitoring, Partograph Reading, Anaesthesia Monitoring), with what the picker gave: 00:00 of the day, before the visit started that morning. A date on the visit's first day before its start is now filed at the visit start, a date after the stop on the day the visit stopped at the visit stop; a form saved from a stale tab into a visit ended meanwhile (warning of #677, then a second save) was filed at the visit **start** and is now filed at its **stop**. A date on another day is kept, and the server's refusal reads in French « La date du formulaire est en dehors de sa visite… Choisissez une date comprise dans la visite, ou démarrez une nouvelle visite » instead of the English sentence (`encounterDatetimeOutsideVisit`, French in the frontend config). `openmrs-esm-form-engine-app` `13.0.2-pre.12863.uvl.16` (library branch `uvl/5.0.1-pre.2754-841`). Not covered: the order basket, which posts its own encounter (it clamps only when it already knows the visit has stopped; see the issue). The other refusal on 19 Nov (about 15 KB, a conversion error) is not explained: `scripts/form-concept-references.py` lists every concept the forms and the frontend config name and prints the SQL that finds one the database does not have; UAT has none unresolved. Tests: library `src/utils/common-utils.test.ts`, `error-utils.test.ts`, `encounter-form-processor.test.ts`; `scripts/test/form-concept-references/test.py`.
- **Billing: orders signed together each get an OpenMRS bill (#840, seen in the production log of 19–20 Nov 2026).** Billing 2.3.0 read and increased the receipt number with no lock, and each order is billed by its own event, so orders signed at the same moment drew the same number: the second bill hit `cashier_bill_receipt_number_idx` (« Duplicate entry '0050-5' ») and that order had no OpenMRS bill (the order itself and Odoo were fine). The distro takes billing 2.4.0 (upstream O3-5835), which reserves numbers under a row lock; it is 2.3.0 plus that fix, with the same required modules and an identical `liquibase.xml` (no database change). `billing.sequenceBlockSize` is set to 1 (module default 100) so that a restart skips no receipt numbers; a bill that fails and rolls back still skips one. `scripts/billing/orders-without-bill.sql` lists, read only, the orders from the affected days that have no bill, by day and order type, for the product owner to decide on. Not verified on UAT yet.
- **Theatre: a fourth form, « Surveillance pendant l'anesthésie », for the readings taken during the operation (#833, product owner's screenshots of 20 Nov 2026).** The anaesthesia report has times, team, technique, incidents and medications but no readings. The new form (`UVL-Anaesthesia-Monitoring-Form.json`, in « Bloc opératoire » after « Rapport d'anesthésie ») is one encounter per operation with the date of the operation (today and now by default, no future date) and twelve numbered rows « Mesure 1 » to « Mesure 12 » on two pages, as on the paper sheet: time (date and time), systolic and diastolic blood pressure (TA Sys, TA Dias), pulse, stage (Induction, Entretien, Réveil: a proposal, the choices on the old form were not visible, to confirm with the product owner), respiration, Sa O2, medication (free text). The anaesthetist reopens the encounter with « Modifier » and fills the next row. A time earlier than that of a row above is refused, so the rows always read in time order, and the read view lists them by number. First attempt (UAT b52, #834) used one repeating group; reopening the encounter showed only its first row. Cause, reproduced on the form engine's test harness (`uvl/5.0.1-pre.2754-768`): the engine gives each stored row after the first to a copy of the group only if the row's obs id is not already claimed, and the list of claimed ids is a module variable that is emptied only when a form unmounts; a form that hydrated the same encounter before (the read view of the visit, still mounted when « Modifier » opens) leaves the rows claimed, so no copy is made and only the first row, found by its own path, loads. Numbered rows are found by their own path, which a claim does not hide (tested with the same stale claim: three of four rows reopen). Its own encounter type and privilege pair « Anaesthesia Monitoring » (View/Edit), held by Anesthesist and Inpatient Consultant (so Doctor), the roles that hold the Anaesthesia Report pair; `scripts/check-openmrs-roles.groovy` check 9 now expects it on both. The readings use eight new concepts, not the vital-signs ones: the vitals header takes the latest value of each vital by concept from any encounter (#761), so the vital-signs concepts would have shown an intra-operative pressure and pulse there and in the history. Not changed: the header and the vitals history. OCL (uvl-custom 7959342 to 7959353, mappings 3693 to 3703, both released as `20261120-833`, new collection `uvl-anaesthesia-monitoring` `20261120-833`), shipped as `UVL_anaesthesia_monitoring_833_20261120.zip` (unchanged by the second attempt); the twelve French names are in `form-concept-names-fr.tsv`. Verified: `./scripts/mvnw clean package` (all form and role checks pass; the form and the export are in the assembled configuration), export read back: 12 concepts, 11 mappings, none retired; on the engine's test harness, three saved rows of four reopen with a stale claim and the time-order expression refuses an earlier time and accepts an equal or later one, or an empty row. Not verified: loading on a server and use in the browser (UAT). Not done: more than twelve readings in one entry (a second entry of the form starts a new one).
- **Partograph: the « Urine » row of the paper sheet (#832, product owner's photos of 20 Nov 2026).** The reading form (`UVL-Partograph-Reading-Form.json`) has an optional « Urine » section after the temperature: « Prot. » and « Acét. » as dipstick results (Négatif, Traces, +, ++, +++) and « Vol. » in ml, and the chart (`@madiro/esm-uvl-partograph-app` 1.3.0) draws a « Urine » row below the temperature with the three values at each reading's time; the row is hidden when none of the three concepts is configured, and a reading saved before the change still draws. The volume reuses « Sortie : urine (ml) » (CIEL 14783719); protein and acetone are two new UVL questions (uvl-custom 7959380, 7959381) and the new answer « Traces » (7959382, SAME-AS CIEL 1874), all three on the shared answers « Négatif », « + », « ++ » and « +++ » of the lab results, whose names are unchanged. OCL (UVL-Burundi): uvl-custom released as `20261120-832`, collection `uvl-partograph-urine` `20261120-832`, shipped as `UVL_partograph_urine_832_20261120.zip`. Checked locally: module tests and build, forms check; not yet seen on UAT.
- **PBF consultation register: « MALADIE_CHRONIQUE » shows Oui / Non (#830).** Product owner's decision of 18 Nov 2026: the column listed the names from the patient's Conditions list, and « Non renseigné » when there was none. It now shows « Oui » when the patient has at least one condition that the query already counted (not voided, started on or before the consultation date, active or not ended before it) and « Non » otherwise, never « Non renseigné ». Which conditions count is unchanged; the other columns and the rows are unchanged (the monthly summary and the chart only list the column, nothing counts it). Dataset `PBF_Registre_Consultations.yaml`; the dataset on the analytics server is updated by hand with the same SQL (the repository copy there is refreshed with the next release).
- **Imaging: obstetrical, pelvic, renal, cervical and soft-tissue ultrasound can be ordered from « Actes » and are billed (#823).** Only EC01 and EC02 could be ordered; the other ultrasound concepts of the distro's radiology file (class « Radiology/Imaging Procedure », datatype N/A, English names for the most part) are in no order list, and could not be offered even if they were added to one, because the Procedure order type takes concept class « Procedure » only. Five new procedures named like EC01 and EC02, OCL `uvl-custom` 7959337 to 7959341: « EC03 - Échographie obstétricale », « EC04 - Échographie pelvienne », « EC05 - Échographie rénale », « EC06 - Échographie cervicale » and « EC07 - Échographie des tissus mous » (class Procedure, datatype Text, French and English names), members of « All procedures » by CONCEPT-SET mappings 3688 to 3692, so the « Actes » search finds them from « écho ». The order basket filters the members of the set in the browser with a plain, accent-sensitive substring match on every name of the concept, so « echo » found nothing: each of EC01 to EC07 (EC01 and EC02 too) gets an unaccented French synonym (« EC03 - Echographie obstetricale »); the names the list shows are unchanged. OCL `uvl-custom` and `uvl-procedures` `20261120-823-2`; `UVL_procedures_20261120-823-2.zip` (compared with `UVL_procedures_20261119-184.zip`: five concepts and five mappings added, a synonym added to EC01 and EC02, nothing else changed). Odoo: five service products in `product_variant/procedures-issue823.csv` (`init.<concept uuid>`, no price column), created at the placeholder price of 1 BIF until Finance enters the prices in Odoo. The duplicate « Abdominal Ultrasound » concept stays unused. They are not yet in the « Actes d'imagerie » set: the payment gate would then wait for a payment Task that the Odoo bridge only creates for the concepts of its own list, so an order could never be completed. Payment gating and the radiology worklist for the five need the bridge's concept list (follow-up).
- **Medicines: six items made in the Odoo screen in Sept 2025 are now real, prescribable medicines (#795, delivery lead's decision of 20 Nov 2026).** « Ababacter 300ml », « Ataktan Comprimé 50mg », « Contam Gélule 500mg », « Faux Papillon Lunettes +0,50 », « Lunettes de lecture +0,50 » and « Lunettes de lecture -0,50 » existed only as hand-made Odoo products with no medicine in the EMR, so the bridge skipped them at every start and they could not be prescribed. Each is a drug row in `drugs/uvl-drugs-issue795.csv` copied from its sibling (Ababacter 125ml, Ataktan 100mg, Contam Suspension, the ±0,25 glasses) on the sibling's concept, with the Odoo product `init.<drug uuid>` in `product_variant/uvl-drugs.csv`; the Contam capsule takes the Gélule form and unit, as Astaph. Drug uuids are uuid5 (URL namespace) of `https://github.com/MadiroGlobalHealth/UVL-EMR/issues/795/drug/<French name>`. No OCL change, no price in the files (Finance sets it in Odoo). Stock items (changeset `add_stock_items_795-20261120b`, own SQL; the first version, `-20261120`, had no INSERT into `stockmgmt_stock_item` and created nothing on UAT, so it was removed and the corrected one has a new id; the SQL is idempotent, and its test runs it on a throwaway MariaDB) only for Ataktan 50mg (Comprimé) and Contam Gélule (Gélule), whose siblings have one; no batch. The five duplicates (Cotrimoxazole 960mg, Dermobacter Solution 125 ml, Reading Lunettes +0.25, -0.25, Plano) add nothing here. Archiving the 11 hand-made products is an Odoo data action, run after the deploy on each server (UAT, then production), not part of this change.
- **Partograph: staff can correct a saved reading, nurses can record and correct readings (#825).** The product owner reported on 19 Nov 2026 that a saved reading could not be corrected. It was never refused to a midwife or a doctor (both hold `Edit Partograph Reading`, and `Edit Encounters` through « Register patients »): the visit's encounter list has offered « Modifier » on a reading since the start, but only there, in the visit's « Encounters » tab, and the chart showed the old value until the summary was opened again; nothing on the Partogramme card or button said a reading could be changed. A nurse was refused: the Nurse role held neither partograph privilege (#805), so no button, no card, no readings and no « Modifier ». Now the Partogramme card lists every reading of the current labour, newest first, each with « Modifier », for holders of `Edit Partograph Reading`: it opens the Partograph Reading form on that encounter, the form saves over it (the encounter keeps its id; the encounter's changed-by and date-changed record who and when, as for every form) and the chart redraws at once (`esm-uvl-partograph-app` `1.2.0`, README updated, dist rebuilt). Roles: Nurse (so Midwife keeps it, and Doctor through Inpatient Consultant) now holds `View Partograph Reading` and `Edit Partograph Reading`, so nurses get the « Partogramme » button (female patients), the chart card and « Modifier »; `scripts/check-openmrs-roles.groovy` check 9 requires the pair on Nurse, Midwife and Doctor. Not changed: deleting a reading (no role of these three holds `Delete Encounters`, #510), the 24-hour surveillance forms.
- **Reception and help desk order the consultation (#851).** The patient pays the consultation, a Procedure order (« Consultation généraliste »), before seeing the doctor, so the Help Nurse, the only reception and help-desk role, must place it; the account signed in and saved vitals but core refused the order. The Help Nurse role now holds `Add Orders` and `Get Order Types`, nothing else (it already had the encounter, visit, patient, care setting and order reads); Nurse inherits Help Nurse, so Nurse, Midwife, Anesthesist and Doctor lose and gain nothing. The order reaches the visit's Odoo quotation as a doctor's does. **OpenMRS authorises orders as a whole, not per act:** the Help Nurse can now order whatever the basket offers, that is medicines, lab tests and every act of « All procedures » (X-rays and theatre acts included), not the consultation only, as nurses and midwives since #798. Neither the role file nor the frontend configuration can narrow it (one extension for the acts and lab panels, no order screen checks a privilege), and a medicine ordered this way is still dispensed only by a pharmacist. The build role check (`scripts/check-openmrs-roles.groovy`, check 9) now fails if Help Nurse loses a privilege that placing an order needs.
- **Nurses and midwives can order the delivery act (#798).** Only a doctor could place orders, so at night, with no doctor present, the delivery act (« Accouchement avec épisiotomie », « Accouchement avec forceps », « Accouchement assisté par un médecin » and the other delivery acts under « Actes ») was not ordered and so not billed. The product owner's answer (19 Nov) is that nurses and midwives record it. The Nurse role now holds `Add Orders` (Midwife inherits Nurse), nothing else; the order reaches the visit's Odoo quotation as a doctor's does. **OpenMRS authorises orders as a whole, not per act:** with `Add Orders` the order basket saves everything it offers to these roles, that is medicines, lab tests and every act of « All procedures » (consultations, X-rays and theatre acts included), not delivery acts only, and the same goes for the Anesthesist role, which inherits Nurse. Neither the role file nor the frontend configuration can narrow it: the acts panel and the lab panel are one extension reading one list, and no order screen checks a privilege. Limiting these roles to delivery acts needs a change in the order basket itself. Help Nurse is unchanged. The build role check (`scripts/check-openmrs-roles.groovy`, check 9) fails if Nurse or Midwife loses a privilege that placing an order needs.
- **Visits already recorded: a script corrects their service point (#222).** New visits record the service chosen at their start since #222, #678 and #691; older ones keep the location of whoever opened them (reception for most), and some consultations were filed at reception because their clinician was signed in there, so the PBF registers and the visits report count them under « Accueil-Triage ». `scripts/visit-service-point/visit_service_point.py` corrects the OpenMRS rows once: a consultation filed where no patient is seen (reception, cashier, laboratory, pharmacy, X-ray) moves to the service where the same clinician filed the other consultations of the same day, else to the clinician's usual service in the 30 days around it (at least 90 % and 5 consultations), with its observations; a visit opened at such a location then takes the location of its consultation (outpatient first, most recent), as the visits report does. A visit with no consultation, or a consultation with no such evidence, is left and counted. `plan` is the dry run (counts by month, from → to location and basis, never a row); `apply` writes in one transaction after copying every changed row to the table `uvl_service_point_correction`, and stops if a row changed meanwhile; `restore --run-id` puts a run back. Nothing runs by itself: the correction is run by hand on UAT, then in a production window, following `scripts/visit-service-point/README.md`. No report query changes.
- **Inpatient: « Soins intensifs » has its two beds (#799, product owner's answer of 19 Nov 2026).** The ward had no bed, so a patient admitted there had no bed to be given and the night was billed at the shared room rate. A new changeset, `stay_beds_soins_intensifs-20261119` in the site `liquibase.xml`, creates L1 and L2 (the ward bed codes of #246) with the bed type « Soins intensifs », which the stay bridge bills as « Lit de soins intensifs (par nuit) » at the rate set in Odoo; a bed on a ventilator is set per bed in the bed management app. Fixed uuids, and a ward that already has a bed is left alone, so nothing is doubled: 59 beds become 61. « Salle de césarienne » gets no bed: it is only the place of the operation, and after a caesarean section the patient goes to gynaecology-obstetrics. It keeps its « Admission Location » and « Transfer Location » tags, not changed here. No bridge, bed type or product change.
- **Forms: « Surveillance des 24 heures » moves to the « Maternité » section, for female patients only (#824, product owner's request of 19 Nov 2026).** It is a post-partum form (mother and newborn) but was listed under « Hospitalisation », so it was offered for male patients. It is now listed under « Maternité » and added to `formSexRestrictions` (#794); its own guard against saving for a male patient was already there (#504). Same forms, roles (nurses included, #788), summary card and saved encounters: configuration only, no dist change.
- **Forms: the « Maternité » section is offered for female patients only (#794).** A male patient was offered the five maternity forms in the Forms list (they refused to save since #504, so no wrong data could be recorded). The forms app had no setting for the patient's sex, upstream neither: the patched `openmrs-esm-patient-forms-app` moves to `13.0.2-pre.12863.uvl.3` and gains `formSexRestrictions` (a form, by name or UUID, and the sexes it is offered for), read from the patient the list already has, with no extra request. `uvl-mugamba-frontend-config.json` lists « UVL ANC Consultation Form », « UVL Maternity Consultation Form », « UVL Gynaecology Ultrasound Form », « UVL Delivery Registration Form » and « UVL Childbirth Record Form » as female-only; with none of its forms left, the section is not shown. Female patients keep all five. A patient whose sex is other, unknown or not recorded is offered every form. Not changed: the inpatient and theatre sections (no sex restriction, and still on every visit type, #518), the visit-type restriction of the outpatient consultation, the partograph (it opens its form itself, not from the list), and the forms' own refusal of a male patient (#504).
- **Billing, MFP price ceiling: « Ruban adhésif » (product owner's answer G11, 23 Nov 2026, #184).** The adhesive tape is MFP's « BANDE ADHESIVE 8CM »: MFP pays 80% of at most 2,740 BIF, the patient the rest (it was 80% of the clinic price, without a ceiling, while the width was open). 289 products have a ceiling (288 before). The 23 Nov re-reading of every answer in the product owner's two sheets (F1–F123, G1–G117) found nothing else new: the other answers were already loaded by the parts above. Still open, nothing loaded: the anaesthesia (25% of the surgical act, F3, not expressible as a fixed price per product), haemoglobin (G90 against G13 and G89), « Naloxone Injection » (rate), and the per-millilitre or per-metre items. No price changed.
- **Billing, MFP price ceiling: the product owner's answers of 19 Nov 2026 on devices and laboratory tests (#184).** 29 more products get MFP's price as a ceiling, 288 in all (259 before). **Laboratory:** MFP's price for a laboratory test is now the nomenclature's coefficient B × 300 BIF (« Actes médicaux », 2021), not the 2011 laboratory list (« non, le coefficient »; « consider the prices for 2021 »). The 23 tests the two sources priced differently, none of which had a ceiling, are loaded at the coefficient's price, at 80%: stool examination 1,500, malaria smear 2,250, urine examination 3,000, pregnancy test 7,500, Widal 4,500, CD4 count 7,500, « Prélèvement » 1,500... (14 are above the list's price, 8 below). Not loaded: « BI07 - Hémoglobine » (its own answer, « LISTE DES EXAMENS », contradicts the rule, and that reading is uncertain) and « NFS », bilirubin, the ionogram and « Test d'hémostase » (the nomenclature has no line for them). The 22 tests only the laboratory list prices (biochemistry, rapid malaria test, anti-HCV antibody, PSA) keep the ceiling loaded on 18 Nov: no ceiling is removed, and it is one point to confirm. **Devices:** « Cathéter Pédiatrique » 2,230, the Pogal sutures N° 1 and N° 2 3,500 (as the 2/0 and 3/0), « Tampon d'ouate » 5 per swab, all at 70%; « Pansement Ombilical » 1,360 at MFP's own 80% (70% before); « Propofol Injection » 11,030 at the device list's **70%** (80% before: it gets a row in `mfp-issue184.csv`). **MFP pays 0%** of « Rouleau de gaze 90 cm x 91 m », « Gel Echographique », « Sachets pour le conditionnement des MEG » and « Seringue bilatérale » (70% before): MFP does not reimburse them, the MFP patient pays the clinic price (PNB for a police officer), as for the gloves. « Compresses Abdominales » are not capped as « COMPRESSE SIMPLE » and keep 70% without a ceiling. Answers that settle nothing are kept with their product and asked again, nothing loaded or changed: « Coton hydrophile 500g », « Solution de Povidone 100ml », « Dettol Solution 1L », « Tulle Gras », « Suture Non-Absorbable », « Fils de Suture Chirurgicaux »; « Ruban adhésif » and « Naloxone Injection » were not answered. `scripts/mfp-ceiling.py` knows two more values of `confirmed` (`yes, nomenclature`, `yes, per unit`) and the build check fails if a product the matching says MFP does not cover is not at 0. Before a deploy, check that no MFP coverage line for « Propofol Injection » was entered by hand in Odoo: Odoo would reject the whole file. Odoo loads the changed files at the next start, no module upgrade.
- **Pharmacy stock: « Aerius Sirop 2.5mg/5ml 60ml », « Aerius Comprimé » and « Desloratadine Comprimé 5mg » have a stock item (#796).** The three medicines #787 made load again had no stock item, so with stock dispensing on they could be prescribed but not dispensed, and since #605 not billed. Changeset `add_stock_items_aerius_desloratadine-20261119` (`sql/stock_items_aerius_desloratadine.sql`, rollback included, waits for the drugs and the units) creates one each: the syrup counted per Flacon, the two tablets per Comprimé, the units of « Deslova Sirop 2.5mg/5ml 60ml » and « Deslova Comprimé 5mg », the same medicine. Expiry is tracked; one packaging unit at factor 1. Items only: no batch, no quantity and no line in `opening-stock-matching.csv`; the opening quantity, lot and expiry of these three are still to come from the pharmacy, and until a batch is entered « Délivrer » stays disabled for them. Where the changeset is skipped on the first start after the deploy (« Continuing past » in the OpenMRS log, the drugs load after Liquibase), restart OpenMRS once. No change to the drugs, the Odoo products or OCL. Test: `scripts/test/opening-stock/test_stock_items_796.py`.
- **Opening stock: the Carbamazepine and Dicytam lines can be entered (#797, product owner's answers of 19 Nov 2026 from the boxes).** The carbamazepine the pharmacy counted is a 200 mg tablet (the count file said 500 mg, the EMR had 400 mg only): new medicine « Carbamazepine Comprimé 200mg », named as the 400 mg one and on the same Carbamazepine concept (no OCL change; the concept is in `ocl/UVL_drugs_776_20261118.zip`), drug in `drugs/uvl-drugs-issue797.csv`, Odoo product `init.a4e0ea16-0744-5fb7-871a-e3674ab87895` in `product_variant/uvl-drugs.csv` (no price in the file: Finance enters it in Odoo), stock item counted per Comprimé by changeset `add_stock_item_carbamazepine_200mg-20261119` (waits for the drug, rollback included; on the first start after the deploy it may log « Continuing past », in which case restart OpenMRS once). « DICYTAM gel » is the existing « Dicytam Comprimé 500mg » (the box reads tablets; the file's « gel » was wrong): no new item. Matching rows 52 and 108 are `import`, with the lot and expiry of the count file (no expiry override): the plan enters 252 lines instead of 250, and no line is left to confirm. The stock itself is entered with `scripts/opening-stock.py apply`, which skips the lots already in stock.
- **Odoo: a new customer created by the OpenMRS sync is in French (#809).** A customer (`res.partner`) created by the eip-odoo-openmrs bridge still got the language « en_US », so a document printed for them could come out in English. The bridge sends no language; Odoo takes it from a stored default (`ir.default` on `res.partner.lang`) before the language of the request, and the database carried « en_US » there since it was created (Odoo writes it when `load_language` is not set). `sites/mugamba/configs/odoo/initializer_config/defaults/partner-lang-issue809.csv`, loaded by a new `ir.default` entry of `initializer_config.json`, adds « fr_FR » as the default of the hospital's company, which Odoo reads before the one for all companies: it applies to a new database and to an existing one at the next start of Odoo, no module upgrade and no manual setting. Customers created in the Odoo screens get French too. Customers that already exist keep « en_US »; correcting them is a separate, one-off decision. No bridge or addon change.
- **Diagnosis search: « Simple » is now « Paludisme simple » (#811).** Searching « palud » in « Diagnostic confirmé » offered an option labelled only « Simple ». It is "Uncomplicated malaria" (`8edea3c3-…`, uvl-ciel 14404615, CIEL 159950), an answer of the discharge summary (« Simple ») and of the childbirth record (« Accès simple »). Its class is Diagnosis, so the diagnosis search offers it, and since #513 its French preferred name was the form label, with « Paludisme non compliqué » as a synonym: the search matched the synonym and showed the preferred name. Its French name is now « Paludisme simple », fully specified and preferred (the same name `13bd1150-…`, edited, not duplicated); « Paludisme non compliqué » stays as a synonym. English name and concept UUID unchanged; the forms are unchanged, each answer keeps its own label. `requirements/form-concept-names-fr.tsv` records it as a qualified name (sheet label « Simple »), so build check 5 accepts it. OCL: uvl-ciel `20261119-811-2`, collection uvl-translations-fr `20261119-811-2` (`UVL_translations_fr_811_20261119.zip`, 3 concepts with the two of #739, no mappings, named to load after `UVL_anc_592_20261112.zip`, `UVL_forms_20261111-2.zip` and `UVL_translations_fr_739_20261117.zip`, which still hold the old version); the name carries the UUID OpenMRS already has for it, so the import changes it in place. Nine other Diagnosis-class form answers keep a one-word French name by the same rule of #513 (« Rompue », « Rétréci », « Siège », « Transverse », « Tabac », « OMI », « Infection », « Césarienne », « Ictériques ») and still show that way in the diagnosis search: not changed here.

- **Partograph: clear amniotic fluid is saved as « C : clair », not « Normale » (#807).** The « Liquide amniotique » question offered « C : clair » on the shared concept « Normale » (CIEL 1115, also the « normal » result of lab tests), as CIEL's own answer list does, while I, M and B have concepts named after the paper partograph (« I : membranes intactes », « M : méconial », « B : teinté de sang »): a report reading the stored answers got « Normale » for clear liquor. 1115 cannot be renamed (the lab results use it), so clear liquor is now its own concept, « Clear amniotic fluid » / « C : clair » (uuid `10c9dcdc-2d9d-43e1-ad19-a9222fa23121`), an answer of the question next to the four it had. `UVL-Partograph-Reading-Form.json` and the same question of `UVL-Maternity-Consultation-Form.json` (« Clair ») save it. Readings already saved keep « Normale » and are not rewritten: `@madiro/uvl-partograph` `liquorCodes` maps both concepts to `C`, so the card draws them as before, and a report on clear liquor must count both until the old readings are migrated. OCL: uvl-custom concept 7959336 and uvl-ciel mapping 3945 (Q-AND-A), both sources released as `20261119-807`, new collection `uvl-partograph-liquor` `20261119-807`, shipped as `UVL_partograph_liquor_807_20261119.zip`. No change to the partograph module. Not changed: head moulding still saves the shared answers « Aucun », « + », « Deux plus », « Trois plus » under the labels 0 to +++.
- **UAT without real patient data, before any volunteer gets an account (#263).** `scripts/uat-dataset/`: `uat_phi.py audit` counts the patients that are not synthetic in OpenMRS (voided rows too), Odoo and Orthanc, counts only; `uat_phi.py purge` removes them (dry run unless `--apply`): OpenMRS rows found from the live foreign keys, deleted in one transaction, stock ledger kept, binary logs purged; Odoo patient partners pseudonymised (`PURGED-<id>`), their chatter and attachments deleted. It refuses while the bridges read the binary log, when real patients were registered in the last 14 days, or when it would reach a staff account. `synthetic_dataset.py` (from LIME-EMR-Tooling `e2e/`, vitals concepts corrected to UVL's) loads `SYNTH-nnnn` patients through the REST API. The README gives the procedure and who may have UAT access. Nothing is run on UAT by this change.
- **Outpatient consultation: an added diagnosis row left empty no longer blocks the save (#789).** Since #777 « Diagnostic confirmé » (`confirmedDiagnosis`) was `required: true`. It is a repeating question, and the form engine copies the question, `required` included, for each row added with « Ajouter »: a second row left empty refused the save with « Champ obligatoire » although the first row held a diagnosis. In `UVL-Outpatient-Consultation-Form.json` the question is now required only while its first row is empty (`conditionalRequired` on its own id: the copies read the first row's value, not their own), with a `js_expression` validator, `isEmpty(confirmedDiagnosis) && isEmpty(myValue)`, that refuses the save in the one state the condition cannot name (the first row just cleared with its « × », before the field is left). A first diagnosis is still required, an empty extra row is ignored, a filled one is saved as before; encounters already saved are unaffected. What reads differently: the red asterisk shows until a first diagnosis is picked, then goes; with no diagnosis at all, every empty row is marked, not only the first; and after clearing a picked first diagnosis the message is the validator's « Champ obligatoire / Field is mandatory » (the engine does not translate validator messages, check 10). `scripts/check-ampath-forms.groovy` check 16 now fails the build on a repeating question, or a member of a repeating group, that is `required: true`; no other form has one. No form engine change.
- **24-hour surveillance: nurses are offered the form and can save it (#788).** Signed in with the Nurse role on an admitted patient, « Surveillance des 24 heures » was missing from the Forms list: its encounter type is protected by `View 24-Hour Surveillance` and `Edit 24-Hour Surveillance`, which only the Midwife and Inpatient Consultant roles held (the form was introduced for midwives and doctors only). The Nurse role in `roles_mugamba.csv` now holds both, next to the same pair for « Protocole de surveillance globale ». Midwife and Inpatient Consultant keep theirs. The roles that inherit Nurse (Doctor, Midwife, Ophtalmologist, Dentist, Anesthesist) get the pair through it. With the view privilege, nurses also see the « Surveillance des 24 heures » card on the chart summary. No change to the form, its encounter type or the frontend config.
- **Medicines: « Aerius Sirop 2.5mg/5ml 60ml », « Aerius Comprimé » and « Desloratadine Comprimé 5mg » are created again (#787).** Their rows in `drugs/uvl-drugs.csv` pointed at a concept uuid (`6b99197e-…`) that no OCL export has ever carried, so on a database loaded from the configuration alone Initializer refused them (« No drug concept found », 3 of 277 not saved) and they could not be prescribed. They now use Desloratadine as the `uvl-drugs` export has it (`uvl-ciel` 7898360, uuid `99462340-4660-4965-8eda-0121f135ba61`), the concept « Deslova » already uses; nothing changes in OCL and no new export is needed. The drug uuids are unchanged, so the Odoo products and the stock matching still apply. A new build check, `scripts/check-drug-concepts.groovy`, fails the build on a medicine whose « Concept Drug » or « Concept Dosage Form » uuid is in no OCL export and no concepts CSV.
- **Order basket: a lab test with nothing to fill in is no longer marked « Incomplet » (#779).** Every lab test added to the basket was marked « Incomplet » and blocked « Signer et fermer » until its form was opened, although the form only repeats a priority the order already has. A test is now complete as soon as it is added; it is marked « Incomplet » only when the site config `@openmrs/esm-patient-tests-app` `labTestsWithOrderReasons` requires an order reason for it (`required: true`), which the form still asks for. No site config requires one today. The tests app has no config switch for this (the flag was set unconditionally when adding a test), so the patched `openmrs-esm-patient-tests-app` is `13.0.2-pre.12863.uvl.4`. Medications, procedures and imaging orders are unchanged.
- **24-hour surveillance: the blood pressure warning starts at 140 / 90 (#778, product owner's answer of 18 Nov 2026).** « Surveillance des 24 heures » warned from 120 mmHg systolic and 80 mmHg diastolic; the warning on `systolic` and `diastolic` in `UVL-24-Hour-Surveillance-Form.json` is now `>= 140` and `>= 90`, the vitals screen's limits (the high end of the concepts' normal ranges, systolic 100–140 and diastolic 60–90, #564). The concepts' ranges are untouched, as the vitals screen and other forms read them; only this form's two `warnsWhenExpression` and their messages change. It stays a warning: the save is not blocked, and `min`/`max` (0–300, 0–200) are unchanged. Not done: the message carries the French and English text in one string (the form engine does not translate validator messages, `scripts/check-ampath-forms.groovy` check 10); one language at a time needs a new patched form-engine build.

- **Outpatient consultation: seven questions must be filled before saving (#777, product owner's answer of 18 Nov 2026).** In « Consultation externe » (`UVL-Outpatient-Consultation-Form.json`), « Médecin traitant » (`attendingPhysician`), « Consultation menée par » (`consultationConductedBy`), « Raison de la consultation » (`reasonConsultation`), « Diagnostic confirmé » (`confirmedDiagnosis`), « Consommation d'alcool » (`alcoholConsumption`) and « Usage du tabac » (`tobaccoUse`: « alcohol and tobacco consumption » is two questions, both required) and « Résultat » (`outcome`) are `required`. Saving with one empty is refused with « Champ obligatoire » under the field (the French message is in the frontend config since #499) and the invalid-fields snackbar (#577). None of the seven is hidden by a condition, so no patient is blocked by a field they cannot see; the provider field (`encProvider`) is not in the list and is unchanged, so the #759/#768 provider behaviour is untouched. An encounter saved before opens as before; editing one with an empty required question asks for it on save. No form engine change.

- **Billing, MFP price ceiling: the complete device list (product owner's scan of 19 Nov 2026, #184).** MFP's « Tarifs des dispositifs médicaux remboursables par la mutuelle » is now known whole, N° 1 to 668 with the price and MFP's rate of each line, and is transcribed in `sites/mugamba/requirements/mfp-device-list-20261119.csv` (the earlier scan lacked N° 73 to 150 and everything after 520). Seven more consumables get MFP's price as a ceiling, at 70%: « Cathéter G18 », « G22 » and « G24 » (2,230 BIF each), « Tube à EDTA » and « Tube sec » (500), « Tube d'intubation » (10,150) and « Jeu de perfusion » (500); 259 products have an MFP ceiling (252 before). Every line known before reads the same on the new scan, price and rate: nothing loaded earlier changes, and the bandages and compresses stay at MFP's own 80%. Not loaded, and asked to the product owner: a product that could be several lines (« Ruban adhésif », « Cathéter Pédiatrique », the Pogal sutures N° 1 and 2, « Pansement Ombilical », « Compresses Abdominales », « Coton hydrophile 500g », « Tampon d'ouate », the two unnamed suture products). « Tulle Gras », « Gel Echographique », « Seringue bilatérale », the 90 cm gauze roll and the packaging sachets have no line in the complete list and keep 70% of the clinic price. `scripts/mfp-ceiling.py` reads the list (a line is « N:95 » in the matching) and no longer loads a workbook line that the new scan reads differently. Odoo loads the changed file at the next start, no module upgrade.
- **Billing, MFP: dressings as MFP's two acts, the ophthalmology consultation not covered, « Cathéter urinaire » retired (product owner's answers of 18 Nov 2026, #184).** Three points the third part left open. (1) Two new acts can be ordered and billed, « Pansement simple » and « Pansement complexe ou multiple »: MFP's own acts (nomenclature 1.7, K 2 = 2,000 BIF, and 1.8, K 3 = 3,000 BIF), which replace « Soins locaux » for MFP. They are Procedure concepts with a French and an English name (« Simple dressing », « Complex or multiple dressing »), members of « All procedures », so the « Actes » order search offers them; each has an Odoo product `init.<concept uuid>` in `product_variant/procedures-issue184.csv` (no price column: Finance enters the prices in Odoo) and its MFP row, 80% of at most 2,000 and 3,000 BIF (`mfp-acts-ceiling-issue184.csv`, written by `scripts/mfp-ceiling.py` from the two new rows of the matching). OCL: uvl-custom `20261119-184` (concepts 7959334 and 7959335), collection `uvl-procedures` `20261119-184`, shipped as `UVL_procedures_20261119-184.zip`: the earlier procedures export plus the two acts, with the set's French name of #739. « Soins locaux » is unchanged, orderable and at the plan's 80% without a ceiling: it is to be retired once the two acts have their prices. (2) « Ophthalmologist consultation (Consultation ophtalmologique) » is not covered by MFP: it is done by an ophthalmic technician, whom MFP does not cover at present. A row at 0% for the MFP plan in `mfp-issue184.csv`, like the gloves and the vital signs check: the MFP patient pays the clinic price, 3,000 BIF, unchanged (PNB pays it for a police officer). The other plans are untouched. (3) « Cathéter urinaire » is retired: the clinic has no such product, its urinary catheters are the three Foley « Sonde urinaire » N° 14, 16 and 18. As for the duplicates of #478, the drug is retired (`drugs/uvl-drugs-issue184-retired.csv`) and its Odoo product archived (`product/uvl-drugs-issue184-archived.csv`), not deleted. On UAT it had no order, stock item, batch, quotation line or invoice line (read-only check, 19 Nov 2026). `scripts/mfp-ceiling.py --open-questions` no longer asks the two questions these answers close; 252 products have an MFP ceiling (250 before), 5 are not covered (4 before).
- **Billing, MFP price ceiling: the product owner's confirmations and MFP's laboratory list (18 Nov 2026):** 163 more products get MFP's price as a ceiling, 250 in all with the 87 above. The product owner confirmed the uncertain matches and the doubtful readings of the first round: 89 acts, 25 radiology exams, 4 bed-days, the ward visit and 18 consumables are loaded as confirmed. Bandages, compresses and the umbilical band now follow MFP's own rate, 80% instead of 70% (« Compresses Simples », the sterile compresses 10×10, the two Velpeau bands, the three plaster bands, the umbilical band, and « Ruban adhésif », which has the rate but no ceiling until its width is known). MFP's « Examens de laboratoire remboursables par la mutuelle » (PRIX 2011, 80%, six photographed pages) is transcribed in `sites/mugamba/requirements/mfp-lab-list-20261118.csv` and gives the ceiling of 22 laboratory tests it alone prices (all of biochemistry, e.g. glycémie 3,250, urée and créatinine 2,250, transaminases 2,500); 4 more come from the nomenclature. Where that list and the nomenclature give different prices for the same test (24 products, e.g. stool examination 1,750 against 1,500, pregnancy test 3,000 against 7,500) neither is loaded until the product owner says which applies. Not loaded either: the anaesthesia rule (25% of the surgical act is not a price per product), « Soins locaux » (to be replaced by two dressing acts that are not in the catalogue yet), prices per ml or metre, and what the product owner refused (venous access, incubator, the ophthalmic technician's consultation, two abscess incisions, « Cathéter urinaire », which the clinic does not sell). `scripts/mfp-ceiling.py` now reads the answers and the laboratory list, and writes what is still open with `--open-questions`. Odoo loads the changed files at the next start, no module upgrade (#184).
- **Billing, MFP price ceiling on acts and consumables (product owner's file of 18 Nov 2026):** as for medicines, MFP pays its percentage of at most its own price and the patient pays the difference above it (PNB for a police officer). Acts use the 2021 national nomenclature, priced as coefficient × the value of its key letter (K 1,000, R 1,000, N 800, B 300 BIF); consultations, bed-days and certificates use the ordinance's own amounts; consumables use MFP's 2011 device list, still at the agreed 70%. Loaded for 87 products matched with certainty and read clearly on the scans: 71 acts (e.g. césarienne K 40 = 40,000, appendicectomie 30,000, consultation généraliste 3,500, shared ward bed 2,000 a night, private room 10,000) and 16 consumables (e.g. sonde nasogastrique 2,290, compresse simple 185). The others keep their percentage of the clinic price until the product owner confirms the match or the value: most radiology and laboratory coefficients were read doubtfully, and the device list is missing its pages 3–4 and 15–17 (catheters, gloves, tubes). The matching, with each product's MFP line, page and confidence, is `sites/mugamba/requirements/mfp-acts-devices-matching-issue184.csv`; `scripts/mfp-ceiling.py` rebuilds the coverage rows from it, and the build now fails on an insurance coverage file Odoo would reject whole (unknown product or plan, a second row for one plan and product). Odoo loads the new and changed files at the next start, no module upgrade (#184).
- Restore the `file:` pins for the patched laboratory (1.6.0-uvl.1) and service queues (12.1.1-uvl.1) apps in spa-assemble-config.json, lost when #749 was merged, so the #737 French status pills and pagination are actually served (#737).

- **Opening stock: the two new medicines, A-Cerumen and Midazolam, can be entered (#776).** « A-Cerumen Gouttes Auriculaires » is counted per Flacon and « Midazolam Injection 5mg/ml » per Ampoule: drugs in `drugs/uvl-drugs-issue776.csv`, Odoo products in `product_variant/uvl-drugs-issue776.csv`, stock items by changeset `add_stock_items_opening_stock_answered-20261118` (waits for the drugs, rollback included). Their concepts are in the new OCL export `ocl/UVL_drugs_776_20261118.zip` (collection `uvl-drugs` 20261118-776): Midazolam is CIEL 79853 added to `uvl-ciel` with its external id and a SAME-AS mapping, as Vecuronium was; A-Cerumen is a brand concept in `uvl-custom`, like Febrilex Junior. The export is the full collection (the earlier drugs exports carry the same concepts, so loading them first is harmless). Matching rows 50 (A-CERUMEN) and 190 (MIDAZOLAM inj) are `import`: the plan enters 250 lines (the five of the previous entry plus these two).
- **Opening stock: five lines the product owner answered on 18 Nov 2026 can be entered (#776).** « Anamol Sirop » is now counted per Flacon and « Cimetidine Injection 200mg/2ml » per Ampoule instead of per millilitre (changeset `stock_item_units_opening_stock-20261118`, same statements as the sheet-3 units of #455, rollback included; names unchanged; it runs only while neither item has a batch or a transaction, so a count made in millilitres is never re-read in bottles). The matching enters ANAMOL sp and CIMETIDINE 200 mg inj on them, VIT K inj on « Injection de Vitamine K 10mg » (the ampoule is 10 mg), Gants non stériles on « Gants Non Stériles » (pieces) and CETIRIZINE sirop with its expiry corrected to 30/04/2028. A new optional `expiry` column of `opening-stock-matching.csv` (ISO date) replaces the count file's expiry on the line of its `row`, so the file stays as the pharmacy sent it; the plan lists it as « expiry corrected by the product owner ». The plan now enters 248 lines instead of 243. A-Cerumen and Midazolam (new medicines, waiting for their concepts in OCL), Carbamazepine and Dicytam stay out.
- **Opening stock: the four lines answered on 18 Nov 2026 are in the matching, and the script no longer depends on the account's locale (#773).** `sites/mugamba/requirements/opening-stock-matching.csv` enters AMOXICILLINE sirop 250 mg (Amoxicillin Suspension 250mg/5ml 100ml), DIPYRONE 500 mg inj (Dipyrone Injection 1g/2ml), IBUPROFEN sirop 100 mg (Ibuprofen Suspension 100mg/5ml 100ml) and LIGNOCAÏNE 4% (Lidocaïne Injectable 2%, the 4% being a typing error), as the product owner answered and as production holds them. `scripts/opening-stock.py` accepts a stock item's unit when the matching's name is any name of the unit's concept in any locale (accents and case ignored), so an English-locale account no longer fails on « Ampule(s) » vs « Ampoule(s) »; a really different unit still stops the run. It now checks the account's effective stock scopes (`GET /stockmanagement/session`) for Opening Stock at the location before anything is written: a dry run warns, `--commit` stops without creating a draft; a create response without a uuid now ends with a clear message instead of `KeyError: 'uuid'`.
- **Appointments: every staff member can be chosen as the provider; admin and service accounts are not offered (#766).** The appointment form's provider list was read once with no limit, so OpenMRS returned its default 50 of the 54 providers: some doctors and nurses could not be chosen, while « admin - Super User », « service-account-eip » and « service-account-orthanc-service » could. The list is now read page by page, and the providers whose identifier the site frontend config lists in `excludedProviderIdentifiers` (`admin`, `service-account-*`, as for the forms in #759) are left out, except the one the form already holds. Patched `@openmrs/esm-appointments-app` `12.1.1-uvl.1` (jnsereko/openmrs-esm-patient-management `uvl/appointments-12.1.1-766`), see `distro/frontend/openmrs-esm-appointments-app/README.md`.
- **French: the remaining dots and English of the 17 Nov QA (#752).** Decimals read with a comma in a French session: the « Surveillance des 24 heures » card (« 36,8 », `esm-uvl-partograph-app` `1.1.1`), the order basket and the drug order form (« DOSE 2,5 ») and the medications table (`esm-patient-medications-app` `13.0.2-pre.12863.uvl.3`, jnsereko/openmrs-esm-patient-chart `uvl/752-medications-french`), and the lab results of the Laboratory « Terminé » tab and the Orders tab (« 95,4 mg/dl », « 4,5 % »); in the Orders tab a drug order's row reads « Paracetamol Sirop 120mg/5ml — 2,5 millilitre — orale — … » instead of the server's « (NEW) …: 2.5 Millilitre Orale … », as does its expanded row (`esm-patient-orders-app` `13.0.2-pre.12863.uvl.7`, branch `uvl/752-orders-decimal-display`). The drug order form's header says « Femme » instead of « Female » (same medications build). The temperature unit reads « °C » instead of « C » in the vitals (`esm-patient-vitals-app` `13.0.2-pre.12863.uvl.10`, branch `uvl/752-vitals-celsius`). Frontend config: the Appointments page is in French (« Rendez-vous du … », « Changer le statut », « Filtrer les rendez-vous par statut », « Heure du rendez-vous », « Heure de début de la visite » and the other 41 keys `esm-appointments-app` 12.1.1 has no French for); « Patients arrivés » and its empty message in « Ajouter un patient à la file d'attente » (the service queues draw that list inside the patient search workspace, so it reads the patient search app's translations). Forms: the encounter view of the outpatient and inpatient consultations reads « Prestataire : » instead of « Prestataire :: » (the label carried its own colon; `scripts/check-ampath-forms.groovy` check 15 now refuses a label ending with one). Not changed: the 24-hour form's bilingual warnings (the form engine does not translate validator messages, see check 10), the floating « ? » help button over « Page suivante » (`esm-help-menu-app`), and Carbon's screen-reader labels (« Filter table », « Expand current row », « Character limit 500 », « Page of N pages »).
- **Orders tab: today's orders include those placed just after midnight (#760).** The Orders tab's default period « today » was sent to OpenMRS as a date, which the server reads as a UTC day: an order placed between 00:00 and 02:00 Burundi time did not show until the period was widened. The period is now sent as the start and end of the local days, and the tab keeps only the orders activated within them (`esm-patient-orders-app` `13.0.2-pre.12863.uvl.8`, jnsereko/openmrs-esm-patient-chart `uvl/760-orders-date-utc`, on top of `.uvl.7` of #752).
- **Orders tab: a drug order's row never shows the server's English text first (#765).** Right after « Signer et fermer » and on each reload, a drug order's row read « (NEW) Paracetamol Sirop 120mg/5ml: 2.5 Millilitre Orale … » for a few seconds before the French line of #752. The orders list is read without the drug fields, so the row now shows a one-line placeholder until they arrive, then the French line; if they cannot be read, the drug's name. The search still matches the server's text (`esm-patient-orders-app` `13.0.2-pre.12863.uvl.9`, jnsereko/openmrs-esm-patient-chart `uvl/765-orders-first-paint`, on top of `.uvl.8` of #760).
- **French: remaining English in Orders, Visits and Appointments (#767).** Orders tab: the order type « Drug order » reads « Médicament » (core order type `131168f4-…` given a `Display:fr` in `ordertypes.csv`, name and class unchanged) and the priority « Routine » reads « De routine » (frontend config). Visits tab: the tables' footers read « Éléments par page », « 1–1 sur 1 élément », « sur 1 page », and a visit's Médicaments sub-tab writes « 3,75 », « 2,5 » (`esm-patient-chart-app` `13.0.2-pre.12863.uvl.4`, jnsereko/openmrs-esm-patient-chart `uvl/767-chart-french`); its « Produit abandonné » tag reads « Arrêté », as the Médicaments page (frontend config). Modifying a drug order pre-fills « 2,5 » instead of « 2.5 » (`esm-patient-medications-app` `13.0.2-pre.12863.uvl.4`, branch `uvl/767-medications-dose-prefill`). Appointments: « Genre : Femme » instead of « Female » in an appointment's details (frontend config); the appointment services are named in French, « Cadiology » corrected to « Cardiologie », « Internal medicine » to « Médecine interne » (`appointmentservicedefinitions`; the two service types now point to their service by uuid and are named « Radiologie — suivi court », « Maternité — suivi court »). The service queues are named in French: « Consultation d'accouchement » instead of « Delivery Consultation », and « Consultation externe », « Consultation d'urgence », « Consultation de césarienne », « Consultation prénatale (CPN) » (`queues_mugamba.csv`, same uuids). Vitals: the pulse is « Pouls » everywhere, so the whole-number error names the field as it is labelled (frontend config `heartRate`). The Lab Technician role reads order frequencies (`Get Order Frequencies`), so a drug order's line keeps « trois fois par jour » in their view. Not changed here: the patient chart's appointments table writes the status and type as the server sends them (« Scheduled ») and its date in the « wide » format (« 19 — nov. — 2026, 09:00 »), and the Appointments page's footer ranges are Carbon's English: those need code in `esm-appointments-app`; the home page's active visits footer needs code in `esm-active-visits-app`; a lab test added straight from the search is « Incomplet » until its form is opened (upstream behaviour).
- **Vitals header: the latest value of each vital, whichever encounter recorded it (#761).** After a form that records only a temperature (a surveillance form), the header in the patient chart showed that temperature and « -- » for the blood pressure, pulse, weight and BMI taken minutes earlier in a vitals encounter: it read every value from the most recent encounter. It now takes each value, with its own flag, from the latest encounter that recorded it; systolic and diastolic come from the same encounter, and BMI is that of the latest weighing or is calculated from the latest weight and height. The date shown is the most recent encounter's. The vitals and biometrics history tables are unchanged (one row per encounter). `esm-patient-vitals-app` `13.0.2-pre.12863.uvl.11`, jnsereko/openmrs-esm-patient-chart `uvl/761-vitals-header-latest`.
- **Patient banner: « État civil » and « Profession » shown as tags (#753).** Both are Concept-valued person attributes, and the banner's contact details (`@openmrs/esm-patient-banner-app` `13.0.2-pre.12863`, and still `13.0.2-pre.13005`) print an attribute's raw `value`, which the REST API returns as an object for a Concept attribute: listing them in `contactAttributeTypes` would break the contact details panel. The banner app's own `person-attribute-tag` extension shows a Concept attribute's name, so the site frontend config adds it twice to `patient-banner-tags-slot`, configured with the Marital Status and Occupation attribute types: the banner shows the patient's marital status and occupation as two tags next to the visit tag, and clicking a tag shows « État civil: … » or « Profession: … ». A patient without the attribute shows no tag. `contactAttributeTypes` is a valid key in this version; its « Unknown config key » warning is the core 11.0.0 false positive of #724.
- **Odoo: quotes created by the billing bridge say « Bon de commande créé » (#740).** The eip-odoo-openmrs bridge signs in to Odoo as `admin`, which was in English, so every quote it created said « Sales Order created ». A new Odoo initializer file, `sites/mugamba/configs/odoo/initializer_config/users/bridge-user-lang-issue740.csv` (loaded by a new `users` entry in `initializer_config.json`), sets that user to French, and the bridge now sends that user's language with each call to Odoo (read once with `context_get`), so Odoo reads the document name in French too. Customers the bridge creates get French as their language, and a patient's country is matched on its French name (« Burundi » is unchanged). Messages already written stay in English. Signing in to Odoo as `admin` now shows French. Bridge jar from jnsereko/eip-odoo-openmrs `fix/740-odoo-context-lang` 8a942b2 (on #529's 91358e9).
- **French: the Laboratory status pill and the Laboratory and queue table pagination (#737).** The status pill of a lab order reads « En cours », « Terminé », « Reçu », « Refusé », « En attente » or « En attente de validation » instead of the raw status (« In progress »); the Laboratory worklist and the service queue tables read « Éléments par page : », « 1–10 sur 25 éléments », « sur 3 pages » instead of Carbon's English. Patched builds, new: `esm-laboratory-app` `1.6.0-uvl.1` (jnsereko/openmrs-esm-laboratory-app `uvl/1.6.0-737`) and `esm-service-queues-app` `12.1.1-uvl.1` (jnsereko/openmrs-esm-patient-management `uvl/queues-12.1.1-737`). Still English: Carbon's screen-reader-only « Page of N pages » label.
- **Forms: numbers are shown with a comma in French, as they are typed (#723).** Since #719 a form's number field takes « 36,4 », but a value it showed was still written « 36.4 »: an encounter opened for editing, a calculated value such as BMI, the read view of a saved form, the previous value, and the limit in « La valeur doit être de 37,7 au maximum ». They now use the decimal mark of the session's language: « 36,4 » in French, "36.4" in English. Nothing is rounded; what is saved is unchanged. Form engine app `.uvl.9` (library branch `uvl/5.0.1-pre.2754-723`). The vitals app is a separate change.
- **Forms: text typed in a diagnosis search is no longer dropped silently (#725).** In « Diagnostic confirmé » of « Consultation externe » (and every search list of a form: diagnoses, problems, drugs, locations, providers), only an entry picked from the list is saved. Text typed without picking one was emptied when leaving the field and the form saved without it, with no message. Now leaving the field with such text shows « « … » n'est pas enregistré : choisissez une entrée de la liste, ou videz le champ » and the form cannot be saved until an entry is picked or the field is cleared. Diagnoses stay coded (ICD-10), as the PBF register needs. Form engine app `.uvl.10` (library branch `uvl/5.0.1-pre.2754-725`, on top of #723).
- **Forms: a number above its question's accepted limit is flagged on the field, before saving (#751).** In « Protocole de surveillance globale », a temperature of 47,5 (the concept accepts at most 47; the form sets no maximum) showed no message, and « Enregistrer » failed with the raw key « error.value.outOfRange.high ». Every number field of a form now also respects the limits OpenMRS enforces for its concept: the field shows « La valeur doit être de 47 au maximum » (or « au minimum ») and the form cannot be saved until the value is corrected. If the server still refuses a value (a limit that depends on the patient), the message reads « Une valeur dépasse le maximum accepté pour sa question : vérifiez les nombres saisis dans le formulaire », never a key. Form engine app `.uvl.11` (library branch `uvl/5.0.1-pre.2754-751`, on top of #725).
- **Forms: typing another provider's name over the picked one picks that provider, never silently keeps the old one (#768).** In « Prestataire », « Infirmier(e) de surveillance » and the other provider fields, a provider is listed as « identifiant - Nom ». With one provider picked, typing another's name in full (« Nephtalie CIMANA ») without clicking it in the list, then leaving the field or clicking « Enregistrer », put the first provider back and saved them, with no message. Now the provider the typed name or identifier designates (capitals and extra spaces ignored) is picked and shown; a name shared by two providers shows « … n'est pas enregistré » and blocks the save until one is picked; text that names nobody (« zzqx ») puts the picked provider back without an error, as since #759. If the field is left before the search has answered, the save is blocked until it has, then the same rule applies. Leaving the field with Tab now shows the provider that will be saved (it left the typed text on screen). The same applies to every search list of a form (diagnoses, drugs, locations): a label typed in full is picked. Form engine app `.uvl.15` (library branch `uvl/5.0.1-pre.2754-768`, on top of #759).
- **Forms: every staff member can be chosen in a provider field, by typing their name (#759).** « Prestataire », « Infirmier(e) de surveillance » and the other fields that record who did the encounter, in 17 forms, listed the first 50 providers only (OpenMRS returns 50 by default and the form asked once), and typing did not search: with 54 providers, four doctors and nurses could not be picked, while the service accounts and the admin user could. These fields now search as you type (« Recherche… »): « Sebastien » or « Pacifique » finds the provider on the server, by name or identifier, whatever the number of staff; the signed-in user is still filled in by default. The service accounts (`service-account-*`) and `admin` are never offered: new config key `excludedProviderIdentifiers` of `@openmrs/esm-form-engine-app` in the site's frontend config. Retired providers are not offered. A field that is not searchable now reads every provider, page by page, instead of the first 50. Typing always searches: a doctor signed in as one « Pacifique » is offered both; a search with no match (« zzqx », « admin ») shows an empty list, not the previous names. Editing a form without changing its provider keeps the encounter's provider (it added the user editing it as a second one); changing it replaces the provider (it added the new one next to the old). Leaving the field after typing a name that is not picked puts the chosen provider back without the « n'est pas enregistré » error. Form engine app `.uvl.14` (library branch `uvl/5.0.1-pre.2754-759`, on top of #751); forms: `"isSearchable": "true"` on each `encounterProvider` field.
- **Consultation externe: HIV status « Inconnu », no « Nouvelle prescription » button (#731).** « Statut VIH+ » gets a third answer « Inconnu » (CIEL 1067 « Unknown », the concept and label the ANC and maternity forms already use). The « Prescrire » button that opened the order basket from the « Diagnostic confirmé » section is removed: doctors prescribe from the order basket in the right panel. « Traitement / Médicaments » stays (the PBF register's treatment column reads it). « Résultat » (Outcome) is kept for now: the PBF consultation register (#586) and the Ministry Fiche 15 (#242) read it for their « ÉVOLUTION » and transfer columns.
- **French: « Tous les actes » and « Évaluation initiale » (#739).** The procedures set (`46c8be89-…`, whose members the procedure order panel offers and whose name heads the procedures section of the Results page) had no French name, so it read « All procedures » in a French session; it is now « Tous les actes ». The « Type de consultation » answer `494bb3cb-…` was « Evaluation initiale », without the accent and not the preferred French name, so a French session could show « Initial assessment »; it is now « Évaluation initiale », preferred (the same name `ec5d46e5-…`, edited, not duplicated). English names unchanged. OCL: uvl-custom 20261117-739, new collection uvl-translations-fr 20261117-739 (`UVL_translations_fr_739_20261117.zip`, 2 concepts, no mappings, named to load after `UVL_anc_592_20261112.zip`, `UVL_forms_20261111-2.zip`, `UVL_maternity_acts_593_20261112.zip`, `UVL_procedures_20261111-2.zip` and `UVL_theatre_acts_596_20261112.zip`, which still hold the old versions); uvl-forms, uvl-procedures, uvl-maternity-acts and uvl-theatre-acts HEAD now point at the new versions (follow-up to #529).
- **Forms: numbers are shown with a comma in French, as they are typed (#723).** Since #719 a form's number field takes « 36,4 », but a value it showed was still written « 36.4 »: an encounter opened for editing, a calculated value such as BMI, the read view of a saved form, the previous value, and the limit in « La valeur doit être de 37,7 au maximum ». They now use the decimal mark of the session's language: « 36,4 » in French, "36.4" in English. Nothing is rounded; what is saved is unchanged. Form engine app `.uvl.9` (library branch `uvl/5.0.1-pre.2754-723`). The vitals app is a separate change.
- **Forms: text typed in a diagnosis search is no longer dropped silently (#725).** In « Diagnostic confirmé » of « Consultation externe » (and every search list of a form: diagnoses, problems, drugs, locations, providers), only an entry picked from the list is saved. Text typed without picking one was emptied when leaving the field and the form saved without it, with no message. Now leaving the field with such text shows « « … » n'est pas enregistré : choisissez une entrée de la liste, ou videz le champ » and the form cannot be saved until an entry is picked or the field is cleared. Diagnoses stay coded (ICD-10), as the PBF register needs. Form engine app `.uvl.10` (library branch `uvl/5.0.1-pre.2754-725`, on top of #723).
- **Lab results and drug doses: a decimal can be typed with a dot or a comma, on any browser language (#727).** Follow-up to #719. On Windows in French, typing « 4.5 » in a numeric lab result or « 2.5 » in a drug order's dose emptied the field at the dot, so 5 was saved. Numeric lab results (order basket app `13.0.2-pre.12863.uvl.5`, fork branch `uvl/727-orders-decimal-separator`) and the drug order form's dose, duration, quantity to dispense and refills (medications app `.uvl.2`, fork branch `uvl/727-medications-decimal-separator`) are now text fields that take « 4.5 » and « 4,5 » alike and save 4.5, with the decimal keypad on tablets; whole numbers stay whole, letters and a second separator are ignored, and a lab result still takes a leading minus. Unchanged: the lab whole-number and range messages and the drug order form's checks; a dose of 0 is now also listed next to « Enregistrer cette prescription ». Not changed, as UVL does not reach them: procedures (app not in the assembly), the generic obs table widget (not configured), numeric visit attributes (UVL's are all coded), and the immunization dose number (a whole number, which the number field takes in every language).
- **French: the strings left on the laboratory, queue, order and chart screens, and the patient banner (#529).** Translation overrides for 171 keys whose French translation upstream is missing or still English, in the apps the issue names: the Laboratory app (« Instructions : », the status filter « Reçu », « En cours », « Terminé », « En attente », « Refusé » instead of « EN_COURS », « COMPLÉTÉ »…, « De routine », the visit-required messages), the results viewer (« Date du résultat », « Date de prescription », « Numéro de prescription »…), the order basket and medication order form (error toasts, drug categories, « Modifier la prescription »), the service queues (appointments, queue and room management, « Aucun rendez-vous prévu aujourd'hui »…), the chart, registration, banner and core (« Copié ! », « Le serveur démarre »…). The patient banner's contact details are labelled with the person attribute type's name, so « Telephone Number » showed in French sessions: the person attribute types get `Display:fr`/`Display:en` (« Numéro de téléphone », « État civil », « Profession », « Niveau de couverture d'assurance »; « Telephone Number » is Ozone's and gets a site row with the same uuid), and `scripts/check-french-metadata.groovy` now checks `personattributetypes` too. Still English, not configuration: Carbon's « Items per page: » / « 1–10 of N items » / « of 1 page » in the Laboratory and queue tables (the apps pass no text to the pagination), the Laboratory app's status pill « In progress » (the raw status, capitalised), `visit.display` and `encounter.display` (the REST module builds them from the visit and encounter type's English name), and the OCL names « All procedures » (no French name) and « Evaluation initiale » (missing accent).
- Docs: the console warning « Unknown config key '@openmrs/esm-form-engine-app.sessionLocationEncounterTypes' » is a false alarm (#724). The key is in the form engine's schema since `.uvl.7` and is applied: Admission, Transfer, Transfer Request and Discharge stay at the ward the user is signed in at, every other form goes to its visit's service (#691). Frontend core 11.0.0 checks the form widget's config before the module has defined its schema (openmrs-esm-core#1946, not released). `distro/frontend/openmrs-esm-form-engine-app/README.md` says so. Nothing changes on screen.
- **The central pharmacy's opening stock can be entered from its count file (#457).** `scripts/opening-stock.py` reads the pharmacy's .xlsx, matches each line to a stock item through `sites/mugamba/requirements/opening-stock-matching.csv`, and creates one « Opening Stock » operation at « Pharmacie (Rx) » as the central pharmacist (dry run first, then `--commit`: created, submitted and approved, one batch per lot with its expiry). Expired lines, unmatched products and lines to confirm are listed, not entered. Seven products counted by the pharmacy that had a drug but no stock item get one (Dynamogen, Halothane, four blood-collection needles, Tissu Jersey).
- **Ophthalmologists and dentists can record the outpatient consultation (#703).** The Ophtalmologist and Dentist roles now inherit Outpatient Consultant (`Edit Outpatient Consultation`, so the forms panel offers « UVL Outpatient Consultation Form ») and hold `Edit Diagnoses`, which saving the form's diagnoses needs; nothing else is added. Their consultations now reach the PBF consultations register and Fiche 15 under their service. The build role check (`scripts/check-openmrs-roles.groovy`) fails if Doctor, Ophtalmologist or Dentist lose a privilege the consultation needs.
- **Vitals: decimals are shown with a comma in French, as they are typed (#723).** After #719 the vitals fields took « 36,4 », but the header tiles, the vitals and biometrics history, the normal ranges (« Normale : 35–37,7 »), the computed BMI and a value loaded for editing still showed « 36.4 ». They now follow the session language: a comma in French, a dot in English. Only the decimal mark changes; sorting, flags and what is saved are unchanged. The charts keep their own number format. Vitals app `13.0.2-pre.12863.uvl.8` (fork branch `uvl/723-vitals-decimal-display`). The form-engine part of #723 is separate.
- **French: the pulse unit reads « batt/min », not « beats/min » (#726).** The unit comes from the pulse concept, stored in English; the vitals app now translates units that are words, in the vitals form, the header tiles, the « Valeurs normales » panel, the history table and the charts. Symbols (mmHg, kg, %, C) are unchanged. Vitals app `13.0.2-pre.12863.uvl.7` (fork branch `uvl/726-vitals-french-pulse-unit`).
- **Vitals and forms: a decimal can be typed with a dot or a comma, on any browser language (#719).** On the triage PCs (Windows in French), typing « 36.4 » in a vitals field emptied it at the dot, so the value saved was 4; on other setups « 36,4 » saved as 364. The number fields of the vitals form and of every form-engine form are now text fields that take « 36.4 » and « 36,4 » alike and save 36.4, with the decimal keypad on tablets. Letters and a second separator are ignored. Unchanged: the normal-range flags, the absolute limits, the whole-number rule of pulse, blood pressure, respiration rate and SpO2 (#680), and the form range and decimal messages (#500). Form-engine number fields lose their +/− buttons. Vitals app `13.0.2-pre.12863.uvl.6` (fork branch `uvl/719-decimal-separator`), form engine app `.uvl.8` (library branch `uvl/5.0.1-pre.2754-719`). Lab results and drug order doses keep the old number field (follow-up).
- **Forms, prescriptions and visit notes are filed at the visit's service, not the user's sign-in location (#691).** A new encounter now takes the location the visit was started for (falling back to the sign-in location when the visit has none), so consultations, maternity forms, partograph readings, orders and notes count under that service in the reports, as vitals do since #678. Admission, transfer, transfer request (« Ward Admission ») and discharge stay at the ward the user is signed in at (`sessionLocationEncounterTypes`); a form with its own location field keeps it; editing keeps an encounter's location. Form engine `.uvl.7` (library branch `uvl/5.0.1-pre.2754-691`), order basket `.uvl.4`, visit notes `esm-patient-notes-app` `.uvl.1` (patched, new). Encounters saved before keep their location.
- **A prescription (order basket) encounter now records the prescriber as its provider, and « Aucun professionnel de santé » is spelled correctly (#683).** The patched order basket (`esm-patient-orders-app` `.uvl.3`) adds the orderer to the encounter it creates, in the Clinician encounter role (new setting `ordererEncounterRole`); before, the encounter had no provider. The chart's French text for an encounter without a provider is corrected by a translation override. Encounters saved before this keep no provider.
- **A visit closed while the chart is open (e.g. by the midnight closing) is shown as ended, and open work is saved instead of lost (#677).** The chart fetches the visit in context again every minute, so the header shows the visit's dates instead of « Visite active en cours » (patient chart `.uvl.2`). « Signer et fermer » in the order basket (patched `esm-patient-orders-app` `.uvl.1`, new) and « Enregistrer » in a form (form engine `.uvl.6`) first check the visit: if it has ended, nothing is posted, a warning says when it ended and keeps the basket or form filled, and a second click saves the work in that ended visit. Before, the server refused it (`Encounter.datetimeShouldBeInVisitDatesRange`, « Invalid Submission ») and a reload lost the work. The closing time is unchanged.
- **A prescription (order basket) encounter now records the prescriber as its provider, and « Aucun professionnel de santé » is spelled correctly (#683).** The patched order basket (`esm-patient-orders-app` `.uvl.3`) adds the orderer to the encounter it creates, in the Clinician encounter role (new setting `ordererEncounterRole`); before, the encounter had no provider. The chart's French text for an encounter without a provider is corrected by a translation override. Encounters saved before this keep no provider.
- **A visit closed while the chart is open (e.g. by the midnight closing) is shown as ended, and open work is saved instead of lost (#677).** The chart fetches the visit in context again every minute, so the header shows the visit's dates instead of « Visite active en cours » (patient chart `.uvl.2`). « Signer et fermer » in the order basket (patched `esm-patient-orders-app` `.uvl.1`, new) and « Enregistrer » in a form (form engine `.uvl.6`) first check the visit: if it has ended, nothing is posted, a warning says when it ended and keeps the basket or form filled, and a second click saves the work in that ended visit. Before, the server refused it (`Encounter.datetimeShouldBeInVisitDatesRange`, « Invalid Submission ») and a reload lost the work. The closing time is unchanged.
- **French: the English that config couldn't reach (#529).** Dispensing: the batch list names the unit in French (« (Gélule) », was « (Capsule) »): `stockmanagement-2.1.2-uvl5.omod` (replacing `-uvl4`) names units, categories and reasons in the session's language, where 2.1.2 took the first fully specified name of any language (jnsereko/openmrs-module-stockmanagement `uvl/2.1.2-unit-name-locale`). The prescription, diagnosis and condition lists of the dispensing app (1.11.2-uvl.2) read « Éléments par page : », « 1–10 sur 25 éléments », « sur 3 pages », « Page suivante » / « Page précédente » (jnsereko/openmrs-esm-dispensing-app `uvl/1.11.2-529`). The lab order form (tests app .uvl.3; `.uvl.2` crashed on UAT because it imported the helper from the shared common-lib) offers « De routine », « Urgent », « À la date prévue », translated when the form renders instead of when the module loads (jnsereko/openmrs-esm-patient-chart `uvl/tests-13.0.2-pre.12863-529`). Odoo quotation lines end in « | Prescripteur : … » instead of « | Orderer: … »: eip-odoo-openmrs reads `ODOO_ORDERER_LABEL` (empty keeps « Orderer: »), set in `scripts/docker/docker-compose-override.yml` and LIME-EMR-Tooling's `docker-compose-odoo-sso-uvl.yml`; existing lines keep their text (jnsereko/eip-odoo-openmrs `fix/529-orderer-french`). Not done here: Carbon's screen-reader-only « Page of N pages » label; the chart and vitals apps' pagination (other changes).
- **Help Nurse can save vitals at triage (#700).** The vitals app sends the signed-in provider with an encounter role, and Help Nurse could not read encounter roles, so every save was refused (400, « Certaines des valeurs saisies ne sont pas valides »). Help Nurse now holds `Get Encounter Roles`, nothing else. The build-time role check (`scripts/check-openmrs-roles.groovy`) now fails if Help Nurse, Nurse, Midwife or Doctor lacks a privilege the vitals save needs.
- **A visit closed while the chart is open (e.g. by the midnight closing) is shown as ended, and open work is saved instead of lost (#677).** The chart fetches the visit in context again every minute, so the header shows the visit's dates instead of « Visite active en cours » (patient chart `.uvl.2`). « Signer et fermer » in the order basket (patched `esm-patient-orders-app` `.uvl.1`, new) and « Enregistrer » in a form (form engine `.uvl.6`) first check the visit: if it has ended, nothing is posted, a warning says when it ended and keeps the basket or form filled, and a second click saves the work in that ended visit. Before, the server refused it (`Encounter.datetimeShouldBeInVisitDatesRange`, « Invalid Submission ») and a reload lost the work. The closing time is unchanged.
- Docs: `RESTORE-DRILL.md`, the restore drill from the restic backups: what a snapshot holds (checked on UAT: every 5 minutes, newest of each day kept, repository on the same server's disk), restoring a chosen snapshot onto a scratch machine with LIME-EMR-Tooling's new `restore-from-restic.sh`, matching the counts against the source, signing in to each app, opening an X-ray, with times and a pass/fail list. `RUNBOOK.md` section 4 points to it. In LIME-EMR-Tooling the backup now also takes the Odoo filestore and the X-ray images, which snapshots did not hold before; this reaches each server with its next deploy (#261).
- **Vitals: a decimal in a whole-number field is refused on the form, naming the field (#680).** Pulse, blood pressure, respiration rate and SpO2 take whole numbers (their concepts do not allow decimals), so « 72.5 » used to pass the form and be refused by OpenMRS with only « Certaines des valeurs saisies ne sont pas valides ». The vitals form now reads `allowDecimal` from each vital's concept: the field shows « Saisir un nombre entier, sans décimales » as soon as a decimal is typed, and Save shows « Nombres entiers uniquement, sans décimales : Fréquence cardiaque » without sending anything. Temperature, weight, height and MUAC still take decimals. Vitals app patched build `13.0.2-pre.12863.uvl.5`, fork branch `uvl/680-vitals-whole-numbers` (on top of #678).
- **Vitals are filed at the visit's service, not the user's sign-in location (#678).** A new vitals encounter takes its visit's location (the service chosen at the start of the visit since #222), so an outpatient visit's vitals count under « Consultation externe (OPD) » even when the nurse signed in at « Soins maternels ». A visit without a location falls back to the sign-in location; editing vitals keeps the encounter's location. Vitals app patched build `13.0.2-pre.12863.uvl.4`, fork branch `uvl/678-vitals-visit-location`. Forms filled through the form engine, the order basket and visit notes still take the sign-in location.
- **Vitals are filed at the visit's service, not the user's sign-in location (#678).** A new vitals encounter takes its visit's location (the service chosen at the start of the visit since #222), so an outpatient visit's vitals count under « Consultation externe (OPD) » even when the nurse signed in at « Soins maternels ». A visit without a location falls back to the sign-in location; editing vitals keeps the encounter's location. Vitals app patched build `13.0.2-pre.12863.uvl.4`, fork branch `uvl/678-vitals-visit-location`. Forms filled through the form engine, the order basket and visit notes still take the sign-in location.
- **Prescriptions: « Renouvellements » starts at 0, and a refused save says why** (#679). A new drug order had the refills field empty and required, so every prescription needed a 0 typed in. Medications app `13.0.2-pre.12863.uvl.1` starts new orders at 0 (still required if cleared), and after a refused save lists the missing fields next to « Enregistrer cette prescription » (« La prescription n'a pas été enregistrée. Complétez les champs obligatoires : … »). « Indication » stays required. Fork branch `uvl/medications-13.0.2-pre.12863-patched`.
- **OpenMRS: no more « commonreports » module that « does not start » (#684).** The module is not in the distribution (UVL prints with patientdocuments); its global properties, and those of metadatasharing, were left in the database when the omods were dropped, so `commonreports.started=false` (and `metadatasharing.started=true`) counted as a 34th module. A Liquibase changeset deletes the `commonreports.*` and `metadatasharing.*` global properties.
- **Changing the interface language no longer changes the user's default language unless they ask** (#681). In the « Modifier la langue » dialog, « Modifier la langue par défaut » now opens unticked, so switching to English for a moment changes this session only and the next sign-in is in the stored language again (French for UVL staff); ticking it still saves the new default. Frontend core 11.0.0 opens it ticked and has no setting for it, so the build edits that one value in the assembled `esm-primary-navigation-app` (`scripts/patch-change-language-default.mjs`, tested by `scripts/test/change-language-default/test.mjs`); the build fails if a module bump changes that code.
- **Outpatient consultation: « Statut de la femme » is hidden for male patients**, and so are « Femmes enceintes » and « Âge gestationnel » that depend on it, so nothing is saved for them; existing consultations still open (#682).
- **Gynaecology ultrasound: « Poids fœtal estimé (g) » accepts decimals** (e.g. 2450.5), for each foetus. The form no longer forbids them, and its concept (`2cc1d9a4-…`, units g, 0–7000) now allows decimals, so OpenMRS saves the value instead of refusing it. « Semaines d'aménorrhée » and « Nombre de fœtus » stay whole numbers. OCL: uvl-custom 20261116-552, new collection uvl-fetal-weight 20261116-552 (`UVL_forms_fetal_weight_552_20261116.zip`, 1 concept, named to load after `UVL_forms_20261111-2.zip`, which still holds the old version); uvl-forms HEAD now points at the same version (#552).
- **Forms: a saved form's read view shows each answer as data entry does** (#475). In the expanded encounter row (and any form opened read-only), the answer of a radio, checkbox, list or switch question showed the answer label as written in the form JSON, without the form's translations, while data entry translates it: an English label read in English in a French session, and since #528 a French label read in French in an English session. Form engine app `13.0.2-pre.12863.uvl.5` translates the answer the way data entry does (the form's translations for the session language, else the concept's name in that language when the form gives no label), so « Dorsale », « Masque », « Oui » in French and "Dorsal (supine)", "Mask", "Yes" in English. Question labels were already translated. Form engine library branch `uvl/5.0.1-pre.2754-475`.
- **Medications: « pour 1 semaine », not « pour 1 semaines » (#542).** The chart's medication list joined the duration to the unit's French concept name, which is plural. A `@openmrs/esm-patient-medications-app` French translation override now picks the singular for 1 (seconde, minute, heure, jour, semaine, année); 2 and more keep the concept name. The `$` of the nesting is written `\u0024`: the frontend image runs `envsubst` over every config JSON at start, which turned `$t(` into `(`.
- **Forms: a click anywhere on a row of the forms list opens the form (#662).** Before, only the form name did, although the whole row highlights on hover. The forms app patched build moves to `.uvl.2`.
- **Forms: the outpatient consultation form is no longer offered on an inpatient visit (#518).** The forms app (13.0.2-pre.12863 patched as `.uvl.1`, `distro/frontend/openmrs-esm-patient-forms-app`) gains `formVisitTypeRestrictions`; « UVL Outpatient Consultation Form » is offered only on « Outpatient visit » and « General » visits. Every other form stays on every visit type: a patient admitted on an outpatient visit keeps that visit type and still needs the inpatient forms.
- **Forms: the outpatient consultation form is no longer offered on an inpatient visit (#518).** The forms app (13.0.2-pre.12863 patched as `.uvl.1`, `distro/frontend/openmrs-esm-patient-forms-app`) gains `formVisitTypeRestrictions`; « UVL Outpatient Consultation Form » is offered only on « Outpatient visit » and « General » visits. Every other form stays on every visit type: a patient admitted on an outpatient visit keeps that visit type and still needs the inpatient forms.
- **Discard dialog: « Synthèse de sortie d'hospitalisation », not « d&#39;hospitalisation » (#663).** The French override of the workspace close prompt interpolated the form name escaped, and the dialog renders it as text, so an apostrophe showed as `&#39;` (also « l'accouchement »). The name is now interpolated unescaped (`{{- workspaceTitle}}`); React still escapes it.
- **French: the English left on UAT on 15 Nov (#529).** Pharmacy toasts « Délivrance du médicament suspendue / clôturée »; « Aucun résultat correspondant » under the registration address fields; the Ozone encounter types in use (« Signes vitaux », « Prescription », « Admission », « Sortie », « Transfert », « Demande de transfert », « Note de visite », « Consultation ») get `Display:fr`/`Display:en`; in Odoo, the units of measure take their OpenMRS French concept names (« Comprimé », « Gélule »…), « Consultation généraliste » (with and without MFP), and the patient fields « Identifiant du patient », « Date de naissance (du patient) », « Poids du patient ». Product prices are not touched.
- **Visits: the start-visit form makes staff choose the service (#222).** The visit location (« Service de la visite ») no longer defaults to the user's sign-in location: a new visit opens with it empty and cannot start until a service is chosen, so a visit opened at reception or by a nurse signed in elsewhere records the service where the patient is seen. Editing a visit keeps its location. This is a new `preselectVisitLocation` setting in a patched `esm-patient-chart-app` 13.0.2-pre.12863 (`distro/frontend/openmrs-esm-patient-chart-app`); setting it to `true` gives the old behaviour back. FBP reports should keep reading the consultation encounter's location and provider.
- Docs: `RUNBOOK.md`, the support runbook for the clinic's local support after the handover: what runs where, daily checks, deploying a release (UAT first, Tuesday-night window), backups and restore, common incidents and their fixes, users and roles in Keycloak, prices in Odoo, asking for a change, escalation. No addresses or secrets; it links the existing docs (#260).
- Docs: contributor onboarding. README build step asks for a classic GitHub token with `read:packages` under the pom's server id (a fine-grained token or a password gets `401`), one Maven section instead of two, and the 2024 challenge sign-up, Jira board and check-in replaced by where work happens now; CONTRIBUTING gains « Building a form » and starter-issue guidance; issue templates Bug, Form request and Requirement; the PR template links the GitHub issue (#259).
- **Pre-operative record: « Type d'anesthésie prévu » offers the same 7 types as the operation protocol and the anaesthesia report** (générale, rachianesthésie, péridurale, bloc nerveux périphérique, loco-régionale, locale, sédation). « Loco-régionale » stays, so records saved with it still open and read. No new concept: the four added answers are the ones `UVL_form_fields_652_20261115.zip` already gives the question (#661).
- **Security: no Superset Admin or SENAITE Manager from a realm import** (#348). The local demo user `jdoe` in `sites/mugamba/configs/keycloak/realms/ozone-realm.json` no longer carries `superset: Admin` and `senaite: Manager`, and the build (`scripts/check-openmrs-roles.groovy`, check 15) fails if any user in the realm file holds a `superset` or `senaite` client role. Superset sets a user's roles from these at every sign-in; SENAITE is not used at UVL. The roles already granted in each Keycloak are taken away with LIME-EMR-Tooling `keycloak-revoke-client-roles.sh` (dry run first).
- **Inpatient beds: L1…Ln in every ward, and VIP1–VIP4 shared by every department.** Each ward's beds are now coded « L1 » to « Ln » (product owner, 13 Nov 2026) instead of the ward prefixes of #619 (« MI-01 », « GO-22 »…): Salle néonatale L1–L9, Pédiatrie L1–L5, Chirurgie L1–L2, Médecine interne L1–L11, Soins maternels (accouchement normal) L1–L22, Salle de réveil L1–L2, Salle d'urgence (ER) L1–L4. OpenMRS does not require a bed number to be unique (no index, and the Ward app lists one ward's beds), so every ward has its own « L1 ». The beds are renamed in place, never deleted: their type (a bed made « Semi-privé » in the bed management app stays so), grid place and patient assignments are kept; a bed named otherwise, or whose « L<n> » is already taken in its ward, keeps its name. The four private rooms VIP1–VIP4 (« Privé (VIP) », billed « Lit VIP (par nuit) ») are the beds of a new ward « Chambres VIP » under « Hospitalisation (IPD) », an Admission and Transfer Location, so any ward can request an admission or a transfer there and the nurse picks the room in the Ward app; it also carries « Chambre privée », so a night there without a bed is billed « Lit VIP » as well. Nothing changes in the bridge: the bed type mapping of #246 already bills « Privé (VIP) » as « Lit VIP ». A night in a VIP room is counted under « Chambres VIP », not the patient's department. `liquibase.xml` `stay_beds_codes_l-20261115` (runAlways: on production it renames the beds `stay_beds_*-20261112` creates in the same start) and `stay_beds_vip-20261115` (waits for the Initializer to create « Chambres VIP », so the VIP rooms appear after the second start, as « Salle de réveil »'s beds did). **Transfers no longer strip a bed of its class:** bedmanagement 6.2.0-SNAPSHOT's unassign (every transfer or bed change in the Ward app) saved the bed the patient left as a new object holding only its number, so that bed got a new uuid, a new creator and date, and no bed type, and its later nights were billed at the ward's class (a semi-private bed lost its rate). `distro/binaries/openmrs/modules/bedmanagement-6.2.0-uvl1.omod` is the same snapshot with upstream's fix (openmrs/openmrs-module-bedmanagement a96fa35, #115, not yet released), and `stay_beds_repair_type-20261115` puts « Partagé » back on a ward bed left with no type (« Privé (VIP) » in « Chambres VIP », whose rooms also get their seeded uuid back); a bed that was « Semi-privé » before it was rewritten comes back « Partagé » and is set again in the bed management app (#246).
- **Maternity and theatre forms: the fields missing against the UVL team's lists of 13 Nov 2026.** Maternity consultation, « Col utérin » section: « Autres observations (col) » (free text) is back, on the concept it used before Release 1.1 (#496), so answers saved then show again. Pre-operative record: « Chirurgie antérieure » and « Transfusion antérieure » (oui / non) and « Groupe sanguin et rhésus » (the concept and answers the maternity forms use) under the patient's history; « Traitements en cours à risque » (corticoïdes, anticoagulants, sédatifs, insuline / ADO, antibiotiques; several can be ticked) after the current treatment; « TP / INR » (a number, decimals allowed, 0 to 20) after the other coagulation tests. Operation protocol and anaesthesia report, « Types d'anesthésie »: adds rachianesthésie, péridurale, bloc nerveux périphérique and sédation; « Loco-régionale » stays, so past answers still read. Hypnose is not added: the issue's list leaves it out. Not added, as the issue decides: the detailed allergy and history lists, height and weight (Vitals), lab values and dates (Laboratory app). OCL: uvl-custom 20261115-652 adds 13 concepts with French names; new collection uvl-form-fields 20261115-652-2 (`UVL_form_fields_652_20261115.zip`, 19 concepts, 16 answer mappings) (#652).
- **Billing, MFP price ceiling on medicines (product owner, 13 Nov 2026):** MFP pays 80% of at most its own reference price per unit, from MFP's 2026–2027 list of reimbursable medicines (price per pack divided by the units in the pack). When the clinic price is higher, the patient pays the difference on top of the 20%; PNB pays it for a police officer. Example: Depakine 200 mg, clinic 2,100 BIF a tablet, MFP 23,000 BIF for 40 tablets (575 a tablet): MFP pays 460 per tablet, the patient 1,640. Loaded for the 137 drug products matched with certainty (`insurance_coverage/mfp-medicines-ceiling-issue184.csv`); the others keep 80% of the clinic price until they are matched. Procedures and consumables have no ceiling: MFP's lists for them are paper only. Odoo loads the file at the next start, no module upgrade (#184).
- **Pharmacy billing: the drug line on the quote follows the quantity dispensed, not the quantity prescribed** (decision of 13 Nov 2026). A prescription of 30 with 20 given bills 20; when the other 10 are dispensed later the line goes to 30 (on a new quote if the first one was already confirmed; a confirmed quote is never changed). A prescription not dispensed yet, or paused or closed with nothing given, bills nothing, so a visit whose only order is a drug gets its quote at the first dispense. A dispense edited down or deleted lowers or removes the line. A syrup or cream (per-container unit) still bills one container once anything is dispensed, and a second bottle the cashier added by hand is kept. The dispensing app changes the prescription only when it is dispensed in full, paused or closed, so a partial dispense sent nothing to billing: eip-odoo-openmrs now reads the dispenses created, edited or voided every 30 s from the OpenMRS database (`EIP_MEDICATION_DISPENSE_ENABLED`, default on; `..._DELAY` 30000 ms; on start it re-reads the last 24 h, which changes nothing already right). Quotes still in draft from before this release that bill an undispensed prescription keep that line until the prescription is dispensed, paused or closed. Bridge jar from jnsereko/eip-odoo-openmrs `fix/605-bill-dispensed-quantity` `437c1e7` (#605).
- **Billing, private and supplementary insurers (product owner's answers of 13 Nov 2026):** new supplementary insurer « CMU », for MSU members: it is a new answer of the visit's « Assurance complémentaire » question, beside PNB, and its Odoo plan pays the whole patient share MSU leaves (30% in category B, 40% in category C), so the patient pays nothing. DGAC (100%) and Santé Assuré (80%) were already Payer answers with their plans. The generic « Assurance privée » and old « Assurance complémentaire » answers, which had no plan and billed the patient, are removed from the Payer list: each private insurer is its own answer, and a supplementary insurer is chosen in « Assurance complémentaire ». The concepts stay active, so visits already recorded with them still show them. OCL `UVL_registration_20261115-581.zip` (uvl-custom and uvl-registration `20261115-581`) supersedes `UVL_registration_20261112-582.zip` and `UVL_registration_20261008.zip`; Odoo loads the CMU plan at the next start, no module upgrade (#581).
- **C-sections: one identifier across maternity and theatre** (#610). A caesarean section is identified by the **visit** both records belong to: the Delivery Registration (« Mode d'accouchement » = césarienne) and the Operation Protocol (« Cas de césarienne » = programmée / non programmée) of the same visit are the same C-section, and reports count distinct visits, never maternity plus theatre. OpenMRS sets an encounter's visit when the form is saved and no form field rewrites it, so the link needs no typing. « Cas de césarienne » is now required on the Operation Protocol of a female patient (« Non » for any other operation), so a protocol without the answer cannot hide a C-section. Both forms show, once the C-section is chosen, that the two records go in this same visit.
- **Forms: date-time fields, stillbirth resuscitation, save error message** (#602). In a date-and-time field (death date of « Résumé de sortie », birth and intubation times of « Enregistrement de l'accouchement », …) « Heure » no longer takes the date text (« does not conform to HH:mm ») and shows no error icon over its clock button: form engine app `13.0.2-pre.12863.uvl.4` gives the time input its own id, shows only a time in it, and leaves the field's error to the date. Delivery Registration: « Réanimation », « Type de réanimation », « Intubation » and « Dose d'adrénaline » show for a live birth and for a **fresh** stillbirth (resuscitation may be attempted), and stay hidden for a macerated stillbirth or while the stillbirth type is not chosen. The error message of a blocked save reads « 2 champs à compléter ou à corriger ; premier : … » (« 1 champ à compléter ou à corriger : … ») and closes after 8 seconds instead of piling up.
- **Patient chart: no more `GET /obs?concept=165095AAAA…` every 2 seconds.** The request repeated on the patient summary was not the Partogramme card's: the card asks for its readings once (`GET /encounter?…&encounterType=…`) and again only after a reading is saved, which its tests check. It was the notes app's « Pense-bête » (sticky note) button in the patient banner (`sticky-notes-button`, `patient-info-slot`), whose concept `stickyNoteConceptUuid` (default `165095AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`) does not exist in UVL's dictionary, so the button could not save a note. UAT network timings (4–5 Nov 2026) show it sent about every 2.2 s for as long as the chart stayed open (20 requests in 43 s), the pattern of a component remounted continuously with SWR's 2 s deduplication; nothing else repeats. The site config removes the button from `patient-info-slot`. To bring the sticky note back: add concept 165095 (or another text concept, in `stickyNoteConceptUuid`) through OCL and drop the `remove` (#572).
- **Stock app 3.3.1-uvl.12: last wording details after #641.** The cancel dialog reads « Opération : Annuler l'opération » and « Confirmez-vous l'action « Annuler l'opération » sur cette opération ? »: the apostrophe showed as `l&#39;opération`, because i18next HTML-escaped the translated action and React escaped it again. Pressing « Suivant » without an item shows « Erreur de validation » / « Vous devez ajouter au moins un article » (it was « Validation error / You must add atleast one item », in English and never closing) and closes by itself after a few seconds. The operation types « Requisition » and « Stock Issue » read « Réquisition » and « Sortie de stock » in the Opérations list, the filters, « Nouvelle opération », the form titles, « Opérations liées » and an item's transactions; the names stay server data, the app now maps the types stockmanagement seeds to translation keys (a type the site adds or renames keeps its own name). On a Stock Issue line, « Disponible » before a lot is chosen is the sum of the lots that « N° de Lot » offers, from the same request; on UAT it already matched (391 = 21 + 7 + 5 + 225 + 133; 33 was the first three lots of the list), but a lot with a negative balance or a voided lot could make them differ. Not done: the requisition's « Complété » time, see #644 (stockmanagement 2.1.2 keeps the approval in the only completion fields). Source: `jnsereko/openmrs-esm-stock-management-app` `fix/644-stock-wording` (on `uvl/3.3.1`) (#644).
- **Patient chart: the left menu keeps its icons after a hard reload or a direct link.** Frontend core 11.0.0 (`@openmrs/esm-styleguide`) attached the icon sprite (`#omrs-svgs-container`) only on the window `load` event, and `MaybeIcon` checked once, at mount, whether its icon existed. A chart opened by reload or link mounts its left menu before `load`, so its 11 links stayed without icons; reached from search or registration, they had them. The build now applies the upstream fix (openmrs/openmrs-esm-core#1981, not yet released) to the styleguide that `openmrs build` compiles into the app shell: the sprite is attached once, as soon as the page has a body, and an icon that appears later is drawn. The patch is `distro/frontend/openmrs-cli/patches/esm-styleguide-11.0.0.patch`. A core bump stops the build until the patch is removed (core has the fix) or regenerated. `scripts/test/esm-styleguide-svg-sprite/test.mjs` checks the patched code and the built shell in every build (#570).
- **Stock: the central pharmacy issues straight from an approved requisition.** stockmanagement 2.1.2 approves a requisition to `AUTHORIZED` but offered « Émettre du Stock » only on a `COMPLETED` one, so the central pharmacist made a separate Stock Issue that was not linked: « Demandé » stayed empty and the requisition stayed « Autorisé » (#447, #641). `stockmanagement-2.1.2-uvl4.omod` (replacing `-uvl3`, shipped on its own branch) offers the button on an approved requisition with no Stock Issue still going from it, to a user who may make Stock Issues at the store it asks from, and completes the requisition when its Stock Issue completes (the approval date and approver stay on its status line). Stock app 3.3.1-uvl.11: the Stock Issue made from the requisition keeps each line's requested quantity, shown as « Demandé » in « Articles reçus », and is dated the day it is made; saved as a draft and reopened, it keeps its own lines and lot (the requisition's lines replaced them, and « Expédier » then failed with « Item … not found »); the requisition's status line reads « Approuvé » for the approval (it read « Complété »); one space in « KWIZERA Alika Flory »; the calendars name the months and weekdays in French (« novembre », « lun ») instead of English; « Articles reçus » no longer hyphenates item names; « Unité de mesure de l'emballage de distribution », « Niveau de Réapprovisionnement » and « Prix d'achat de l'unité d'emballage » lose their double colon; the page picker reads « Numéro de page (1 page au total) » instead of « Page sur 1 page »; the notification icon reads « Notification » instead of « Snackbar notification »; cancelling an operation offers « Retour » and « Annuler l'opération » instead of two « Annuler »; « Opérations liées : » lists each linked operation on its own line with a French status (« [Annulé] », « [Approuvé] »); the AUTHORIZED status reads « Approuvé » everywhere (was « Autorisé »); the reason counter reads « 6 / 500 caractères » instead of « Character limit 500 »; on a Stock Issue line with a chosen batch, « Disponible » is that batch's quantity at the source (16), not the whole location's (411). Not done: operation type names (« Requisition », « Stock Issue ») are server data; whether a receipt can be partial (#641 item 3) waits for the product owner. Source: `jnsereko/openmrs-esm-stock-management-app` `fix/641-requisition-issue` (on `uvl/3.3.1`), `jnsereko/openmrs-module-stockmanagement` `uvl/2.1.2-requisition-issue` (#641).
- **Stock: « Quantité reçue » shows what the operation received.** `GET stockoperation/{uuid}?v=full` replaced each item's `quantityReceived` with everything the stock item had received in the 30 days to the operation date: 1144 for SIS-0058 (6 sent and received), 1251 for SIS-0062 (7). The database and the operations list held 6 and 7. stockmanagement 2.1.2's `StockOperationResource.getStockOperationItems` filled the item from the stock summary used for its balance columns; `stockmanagement-2.1.2-uvl3.omod` (replacing `-uvl2`) leaves the operation item's own value, as upstream `master` does, and keeps the other summary fields. Every other file of the omod is the published 2.1.2 plus the uvl1 and uvl2 fixes (jnsereko fork branch `uvl/2.1.2-received-qty` `3a9d090`, build directory `uvl/2.1.2-uvl3`). Stock app 3.3.1-uvl.9, from the same UAT check: French for the modal ✕ (« Fermer »), « Fermer la notification », table toolbars and searches (« Filtrer le tableau »), the date pickers' « Mois précédent »/« Mois suivant », the item workspace (« Modifier … (Médicament) », « Veuillez préciser », « Oui »/« Non », « Règles », and « Éléments par page », « 1–1 sur 1 élément » under each tab), and the Transactions tab (« Emplacement », « ENTRÉE », « SORTIE », « Numéro de lot », « Référence », « Statut », « 7 Comprimé de 1 », « Complété », « Imprimer »); « 1–1 sur 1 élément » is singular everywhere. The edit and delete icons of an operation's item rows are named « Modifier » and « Supprimer » for screen readers. In Opérations, « Requisition » and « Comprimé » no longer break with a hyphen (only item names may break inside a word), dates read « 12 nov. 2026 » like expiry dates, and the row button of an operation that can no longer be changed is « Voir » with an eye, not the « Modifier » pencil. Status lines read « …, 00:22 Par KWIZERA » with spaces. An operation item's link opened `/openmrs/spa/stock-items/<uuid>`, a page the app does not have; it opens « Articles » on that item. The categories of non-drug items (#638 item 4) wait for the product owner. Source: `jnsereko/openmrs-esm-stock-management-app` `uvl/3.3.1` `4477bee` (#638).
- Stock app 3.3.1-uvl.8, follow-ups to #634 from the UAT check of 12 Nov 2026: the Opérations search box searches on the server, 0.3 s after typing stops, and goes back to page 1: « SIS-0058 » finds that operation whatever page it is on, and the start of a location name (« Pharmacie ») finds its operations; the server (stockmanagement 2.1.2) does not search item names, so « Paracetamol » finds nothing and the box now reads « Rechercher par numéro d'opération ou emplacement ». Changing a filter or the search from page 6 no longer asks the server for page 6 first. In Articles, « Médicament » no longer breaks mid-word (only the name columns do), and scrolled to the bottom the last row's pencil and the page controls sit above the « ? » help button. In an operation's « N° de Lot », typing narrows the list of batches. « Voir … » shows the operation's details read-only: no ✕ or ▾ on the pickers, Remarks cannot be typed in. Expiry dates read the same everywhere (« 30 déc. 2027 »; received items showed month/day/year). The confirmation after « Soumettre » and the other actions is one line, « Action « Soumettre » effectuée ». French: « Effacer la recherche », « Ouvrir le menu »/« Fermer le menu » on every filter and picker, « Modifier ». Source: `jnsereko/openmrs-esm-stock-management-app` `uvl/3.3.1` `3007b01` (#636).
- Stock app 3.3.1-uvl.7, from the UAT check of 12 Nov 2026: on a Stock Issue (or any operation that takes from a location), « N° de Lot » lists every batch that has stock at the operation's source location, with the quantity there, soonest expiry first; it listed the item's batches with the quantity of whichever location came first, so a batch could show another location's quantity or be offered with no stock at the source. Opérations asks the server for one page at a time (« Page suivante » reaches the oldest operations; page 6 no longer repeats page 5); a filter or page-size change goes back to page 1. In Articles, a long name without spaces (« Paidoterin Sirop 1mg/1mg/0.15mg/5mg/1mg/333mg 100ml ») wraps inside its cell, so the table fits 1280, 1366 and 1440 px. The page controls of Articles and Opérations leave room for the « ? » help button. An operation that is no longer new or returned (submitted, approved, dispatched, completed…) opens as « Voir … » without the item search, edit or delete buttons. French: the table menu button (« Paramètres »), « Nouvelle opération » (was « Options » for screen readers), the clear and open/close buttons of the operation form's pickers, « Filtrer... ». Source: `jnsereko/openmrs-esm-stock-management-app` `uvl/3.3.1` `e49cb8e` (#634).
- Stock app 3.3.1-uvl.6, follow-ups to #447 from the UAT check of 12 Nov 2026: at 1280 px the Opérations and Articles tables and the operation form's item list fit the screen (« Suivant » visible) without sideways scrolling; operation numbers break only after a « - », never inside the date; choosing a « Statut » filter (« Autorisé ») with an operation open no longer shows « An error has occurred », the open row closes instead; « Disponible : N » in an operation's items is the stock at the operation's own location (the source, or the destination of a receipt), not the total of every location; « Rejeter » shows a cross and « Retourner » the loop arrows; the page picker, « Afficher le détail de la ligne », the sort descriptions and the batch picker's « Filtrer... » are in French, and « Niveau de Réapprovisionnement » wraps over two lines. Source: `jnsereko/openmrs-esm-stock-management-app` `uvl/3.3.1` `5c53691` (#632).
- Theatre: the surgeon and the anaesthetist are picked from the staff list (any OpenMRS provider, searched by name), or, when the person is not in the list, their first and last name is typed in the field below, which shows only while nobody is picked. On the anaesthesia report the anaesthetist is required (picked or typed) and the surgeon optional; on the operation protocol the surgeon is required and the anaesthetist optional. Each person validates their own part: the anaesthetist signs the anaesthesia report and the operating surgeon the operation protocol (encounter provider). The operation protocol also asks « Anesthésie réalisée par un anesthésiste ? » (Oui/Non, required) for the Ministry theatre report. The pick is stored as the provider's uuid in a text observation (« Chirurgien (membre du personnel) », « Anesthésiste (membre du personnel) »); the form shows the name. OCL: uvl-custom 20261112-597 adds the 3 concepts; uvl-theatre 20261112-597 (`UVL_theatre_597_20261112.zip`) (#597).
- Theatre: new « Protocole opératoire » form (UVL Operation Protocol Form, encounter type « Protocole opératoire »), built from the paper protocol of 11 Nov 2026 and listed under « Bloc opératoire » after the anaesthesia report. The operating surgeon fills it, validates it and signs it (« Médecin opérateur (nom et signature) », the encounter provider). It records the service, the operating team (operator, anaesthetist, assistant, theatre nurse), the indications, the types of anaesthesia, the start and end of the operation, the operative report and, for a woman, the caesarean case: planned or unplanned, time the newborn was delivered, newborn status, the indication (same question and answers as the delivery registration's « Motif de la césarienne », #591) and complications (haemorrhage, death, other). Doctors (Inpatient Consultant) view and edit it; the anaesthetist views it. OCL: uvl-custom 20261112-595 adds 9 concepts with French names; they ship in the new uvl-theatre collection (`UVL_theatre_595_20261112.zip`, 22 concepts, 15 answer mappings) (#595).
- Theatre: new « Protocole opératoire » form (UVL Operation Protocol Form, encounter type « Protocole opératoire »), built from the paper protocol of 11 Nov 2026 and listed under « Bloc opératoire » after the anaesthesia report. The operating surgeon fills it, validates it and signs it (« Médecin opérateur (nom et signature) », the encounter provider). It records the service, the operating team (operator, anaesthetist, assistant, theatre nurse), the indications, the types of anaesthesia, the start and end of the operation, the operative report and, for a woman, the caesarean case: planned or unplanned, time the newborn was delivered, newborn status, the indication (same question and answers as the delivery registration's « Motif de la césarienne », #591) and complications (haemorrhage, death, other). Doctors (Inpatient Consultant) view and edit it; the anaesthetist views it. OCL: uvl-custom 20261112-595 adds 9 concepts with French names; they ship in the new uvl-theatre collection (`UVL_theatre_595_20261112.zip`, 22 concepts, 15 answer mappings) (#595).
- Maternity: the Delivery Registration form (F14) records what the Ministry delivery report and the PBF delivery register need, as the product owner listed on 11 Nov 2026. Delivery: « Mode d'accouchement » (eutocique, dystocique, césarienne; required; it replaces the eutocic and dystocic boxes of « Actes »), « Motif de la césarienne » (9 reasons, « Autre » with free text) and « Rétention placentaire » among the complications. A new « GATPA » section: performed oui / non / non documenté, then each component on its own (utérotonique, with its drug, dose, route and time; traction contrôlée du cordon; massage utérin). A new « Mère » section: estimated blood loss, transfusion, family-planning method at discharge (with the insertion date for an IUD or implant) and the mother's status at discharge. Each newborn: gestational age, neonatal death (before 24 h, 24 h to 7 days, 7 to 28 days) with its date and time, resuscitation and its type (intubation time and adrenaline dose now show under it), visible anomalies, immediate care (drying, skin-to-skin, cord care, eye prophylaxis, vitamin K) and breastfeeding in the first hour with the time of the first attempt. Stillbirths stay fresh or macerated, so stillbirth, perinatal, early and late neonatal deaths are counted apart. 57 new concepts in `UVL_delivery_registration_591_20261112.zip` (OCL collection `uvl-delivery-registration` 20261112-591). One patient record per newborn linked to the mother is not built: a follow-up (#591).
- Maternity, ANC consultation (F16): the form follows the product owner's 11 Nov answers and counts what the Ministry's Fiche 14 counts. New: partner present (oui / non / non précisé); medical history known before the pregnancy (diabète, HTA, hépatite C, and, pending the medical supervisor's validation, hépatite B, statut VIH, drépanocytose) kept apart from diabète / HTA / hépatite C found during the pregnancy; obstetric history adds previous césarienne, pré-éclampsie and hémorragie du post-partum; haemoglobin (g/dL) with its sample date, with non-blocking alerts below 11 g/dL in the 1st and 3rd trimesters, below 10,5 g/dL in the 2nd, and a critical alert below 7 g/dL; exam adds blood pressure (alert at 140/90 or above), weight, height, oedema and proteinuria, and MUAC alerts below 21 cm; prevention adds TDF at 28 SA and the counselling given (PF, nutrition, birth preparedness, danger signs, breastfeeding); follow-up adds referred (with reason) and the next appointment. The contact number goes to CPN 1 … CPN 8 et plus (« CPN 6 et plus » is no longer offered; past answers keep it) and the tetanus doses read Td 1–5. Sections are regrouped (history, found during pregnancy, haemoglobin, exam, prevention, follow-up); every existing question keeps its concept. OCL: 20 uvl-custom concepts, export `UVL_anc_592_20261112.zip` (#592).
- Billing, payer rules (product owner's answers of 11 Nov 2026): MFP pays 70% of medical supplies and consumables (patient 30%) and 80% of everything else; non-sterile, sterile and gynaecological gloves and « Vital Signs Check » are not covered, so the patient pays the clinic price. CAM pays 80% (State), no longer a 0% placeholder. The two MSU plans are named « MSU catégorie B (70 %) » and « MSU catégorie C (60 %) »; the category is still chosen per visit with the Payer answer « MSU 70% » / « MSU 60% ». PNB, the police officers' supplementary insurer, now pays everything MFP leaves (the co-payment and what MFP does not cover) instead of a flat 20% of the line, so a police officer pays nothing. The MFP rows are `insurance_coverage/mfp-issue184.csv`: the 42 stock-catalogue consumables of #437/#455 and 19 other supply products at 70%, the gloves and vital signs at 0%. Not yet: MFP's price ceiling, which waits for MFP's price list and needs only an `amount` covered base on those rows (see `insurance_coverage/README.md`). Odoo loads both files at the next start, no module upgrade (#184).
- Inpatient stay: each night is billed at the room class of the **bed** the patient occupied at midnight, not only of the ward. Every ward now has its beds (product owner, 11 Nov 2026): « Salle néonatale » 9, « Pédiatrie » 5, « Chirurgie » 2, « Médecine interne » 11, « Soins maternels (accouchement normal) » 22 (the gyneco-obstetrics ward), new « Salle de réveil » under « Bloc opératoire (OR) » 2, « Salle d'urgence (ER) » 4; « Soins intensifs » none. They are coded L1…Ln in each ward and VIP1–VIP4 are a shared ward of their own (see the entry above). A ward that already has a bed is left alone. Seven bed types, one per room class: « Partagé » (« Lit simple (par nuit) »), « Semi-privé » (new « Lit semi-privé (par nuit) »), « Privé (VIP) » (« Lit VIP (par nuit) »), « Soins intensifs », « Couveuse », « Soins intensifs sous respirateur », « Soins intensifs VIP sous respirateur » (new products of those names). The new products have no price: the UVL team enters the prices in Odoo. Every ward bed is « Partagé »; a semi-private one is set per bed. A bed's class is changed in the bed management app (its type), with no release. eip-odoo-openmrs reads `EIP_INPATIENT_STAY_BED_TYPE_PRODUCTS` (bed type uuid=product), set in `scripts/docker/docker-compose-override.yml` and, for the bundled deploy, LIME-EMR-Tooling's `docker-compose-odoo-sso-uvl.yml`; a night with no bed, or in a bed of an unmapped type, keeps the ward's class (« Chambre privée » tag) as before. Bed seeds: `liquibase.xml` `stay_bed_types-20261112` and `stay_beds_*-20261112` (#246).
- French: the visit note form (« Ajouter une note de visite », « Diagnostic », « Rechercher un diagnostic à ajouter », « Principal », « Au moins un diagnostic doit être marqué comme principal », provisional/confirmed) and the Ward app's discharge form (« Note de sortie (facultative) », « Saisissez vos notes ici », « Confirmer la sortie ») get French translation overrides. The test and procedure order panels are titled with the order type's name, so the order types get `Display:fr`/`Display:en` (« examen de laboratoire », « acte », « radiologie », « imagerie »), and `scripts/check-french-metadata.groovy` now checks `ordertypes` too. Still English, not translation keys: the order priorities « Stat » / « On scheduled date » (esm-patient-common-lib translates them once at import, before the French strings load), the gender in the drug order form's patient line (`capitalize(patient.gender)`), and « beats/min » (the pulse concept's units) (#529).
- Maternity: « Soins maternels (accouchement normal) » and « Salle de césarienne » are visit locations again (`Visit Location` tag), like every other location that has a queue. Since they became wards under « Hospitalisation (IPD) » (#246), the start-visit form, which with `restrictByVisitLocationTag` takes the nearest `Visit Location` at or above the session location, defaulted a midwife's visit to « Hospitalisation (IPD) » and did not offer maternity. They stay children of IPD, so admission, transfer, the Ward app and the stay billing are unchanged. « Salle néonatale » stays a ward only (#576).
- Frontend config: two keys the modules never read are fixed. The immunizations concept set moves from `immunizationsConfig.immunizationConceptSet` to `immunizationConceptSet`, the key esm-patient-immunizations-app reads (same concept as the default `CIEL:984`, so nothing changes on screen), and the patient chart's `Display conditions.roles` is removed (core 11 only has `privileges` and `expression`; it never restricted anything). The other « Unknown config key » warnings at sign-in are for keys every module does read: core 11.0.0 checks an extension's config against the bare implicit schema before its module's `startupApp()` has defined the real one (fixed upstream in openmrs-esm-core#1946, O3-6135, not in a release yet). `esm-login-app.provider.logoutUrl` comes from Ozone's `ozone-frontend-config-sso.json`; sign-out goes through the `link#oauth2-logout` menu link, so it is harmless (#579).
- Dispensing: stock deduction at dispensing is switched on (`enableStockDispense: true`); dispensing takes the quantity off the chosen batch. Reaches production with the M5 release, after opening stock and pharmacist stock roles are in place (#457, supersedes PR #482).
- Dispensing: French texts for the translated prescription duration (« pendant 5 jours ») and partial dispense (« Délivré partiellement 2/5 ») (#541, #394).
- Diagnoses: the 1,198 uvl-dx diagnoses get their ICD-10 code back as a SAME-AS map to ICD-10-WHO, the code read from their name (« A00 Cholera » → A00), so the diagnosis search finds them by code (B88.1 finds Tungiasis) and reports read the code from `concept_reference_map`. Liquibase `diagnosis_icd10_maps-20261111` adds 1,192 maps, generated by `scripts/diagnosis-icd10-maps.py`; the same mappings, with the same UUIDs, are in OCL uvl-custom, so the later uvl-dx re-export (after #533) updates them instead of duplicating them. Six names carry a code WHO ICD-10 no longer has (I84 Hemorrhoids, N18.0, U80, U81, U88, U89) and get no map until their code is decided (#584).
- Diagnoses: the six diagnoses #584 left without an ICD-10 code, because WHO retired the code in their name, are mapped to the current WHO code of the same meaning: I84 Hemorrhoids → K64.9, N18.0 End-stage renal failure → N18.5, U80 (penicillin) → U82.0, U81 (vancomycin) → U83.0, U88 (multiple antibiotics) → U83.7, U89 (other and unspecified antibiotics) → U83.9. Liquibase `diagnosis_icd10_maps_replaced-20261112`, generated by `scripts/diagnosis-icd10-maps.py sql --replaced`; the same mappings, with the same UUIDs, are in OCL uvl-custom. Build check 12 now requires an ICD-10 code on every diagnosis, with no exceptions (#585).
- Diagnoses: the six diagnoses mapped to a current ICD-10 code in #585 are now named with it, so the visit note's diagnosis search, which matches names and not maps, finds them by that code: « K64.9 Hémorroïdes » / "K64.9 Hemorrhoids", « N18.5 Insuffisance rénale terminale (stade 5) », « U82.0 Résistance à la pénicilline », « U83.0 Résistance à la vancomycine », « U83.7 Résistance à plusieurs antibiotiques », « U83.9 Résistance à un antibiotique non précisé » (fully specified and preferred, French and English). The old names (« I84 Hemorroides », « U88 … ») stay as synonyms, so the old code still finds them; concept UUIDs are unchanged. OCL: uvl-custom 20261112-585-names (`scripts/diagnosis-icd10-maps.py names`), new collection `uvl-dx-current-codes` 20261112-585, `UVL_dx_v4_585_20261112.zip`, which sorts and loads after `UVL_dx_v4.zip`; each name carries the UUID OpenMRS already has for it, so the import turns the old names into synonyms in place. Build check 14 fails a diagnosis whose English or French preferred name does not start with its ICD-10 code (#585).
- App menu: « Dispensation » and « Stock Management » show only to the pharmacists. Neither app ties its menu entry to a privilege, so every signed-in user, the doctors included, saw both. The site frontend config gives `dispensing-link` the dispensing app's `Task: dispensing.create.dispense` (Pharmacist) and `stock-management-app-menu-item` `Task: stockmanagement.stockoperations.mutate` (Pharmacist, Central Pharmacist), in the primary navigation's `app-menu-slot`. `scripts/check-openmrs-roles.groovy` (check 11) fails the build when an entry loses its condition, when a pharmacist role lacks the privilege, or when a clinical role holds it (#603).
- French: the test and procedure order workspaces read « Ajouter : examen de laboratoire » / « Ajouter : acte » (« Modifier : … » when revising) instead of a bare lowercase « examen de laboratoire » / « acte ». The tests app lowercases the order type's name in that title (`toLocaleLowerCase`), so capitalising `Display:fr` cannot fix it; the French `addOrderableForOrderType` was just `{{orderTypeDisplay}}`. The visit note's diagnosis results list is « Résultats de la recherche de diagnostic » (was « Diagnosis search results »), with « Actions pour … » and « Retirer … » on each diagnosis (#603).
- French: 23 procedures get a French preferred name from the 2024 UVL procedures list (`concepts/procedures.csv`, removed in #174): « Incision d'abcès », « Consultation généraliste », « Suture simple » and « Suture complexe » (also ORT304, URG301, GO304, ORT207, GO206), « Circoncision » (also DIG201), « GO101 - Césarienne », … Two spellings of that list are corrected (« Atelle » → « Attelle plâtrée », « Césarine » → « Césarienne »). 121 procedures, the coded ANE/DEN/DIG/END/GO/KIN/MED/OPH/ORL/ORT/URG acts among them, have no French source yet and stay English until the product owner gives their French names. OCL: uvl-custom 20261111-4; `UVL_procedures_20261111-2` replaces `UVL_procedures_20261106` (#603).
- Inpatient: discharging a patient from the ward ends the visit. The Ward app's « Confirmer la sortie » saves a Discharge encounter and left the visit open; the Inpatient visit type is not in `visits.autoCloseVisitType` (adding it would close admitted patients' visits every night, #246), so the discharged patient kept an active visit and the next order, at the outpatient department too, went on the old inpatient visit and its quotation. `imagingpaymentgate` 1.0.0-SNAPSHOT (`distro/binaries/openmrs/modules`, source jnsereko/openmrs-module-imagingpaymentgate `feat/608-end-visit-at-discharge` `d4b924e`) adds an after-returning advice on `EncounterService.saveEncounter`: a non-voided Discharge (emrapi `emr.exitFromInpatientEncounterType`) saved on an open visit, with no later Admission, sets the visit's stop time to the discharge time (or to the visit's latest encounter, if later), in the same transaction. Any visit type. The « Synthèse de sortie d'hospitalisation » form (#583) is not an ADT discharge and ends nothing. The stay billing (#246) counts nights up to the Discharge encounter and still recounts visits ended in the last 7 days, so the nights billed do not change. `imagingpaymentgate.endVisitAtDischarge=false` leaves the visit open (#608).
- Imaging: the Imagerie card dates a study « 03 nov. 2026 » (core `formatDate` standard mode) instead of « 03 — nov. — 2026 »; `@madiro/esm-uvl-imaging-app` 1.0.1. The Attachments card beside it still reads « 03 — nov. — 2026 »: that is the stock `@openmrs/esm-patient-attachments-app`, which formats with `mode: 'wide'` and has no setting for it (#603).
- Stock app: UVL ships `@openmrs/esm-stock-management-app` 3.3.1-uvl.1, release 3.3.1 with fixes not released upstream yet (`distro/frontend/openmrs-esm-stock-management-app`, source `jnsereko/openmrs-esm-stock-management-app` branch `uvl/3.3.1`). A batch's expiry date is saved on the day picked, not the day before (Burundi is UTC+2). The bin button on an operation line deletes the line. The search inside an expanded operation ignores case. Opening a Stock Issue without a requisition no longer shows a red « Demande de stock associée Requise ». An item whose common name is its drug name reads « X », not « X (X) ». The picker for the location an operation is made at (« De » for a Requisition or Stock Issue, « À » for a Receipt) offers only the locations of the user's stock role scope for that operation type (a Box 1 pharmacist no longer sees Boxes 2 and 3); the other picker, such as the store a requisition asks from, is unchanged, as are System Developers. The Items page fits the window. The Responsible Person list narrows as you type, searches after 300 ms instead of 1 s, and leaves out System Developer accounts (`responsiblePersonExcludedRoles`). French: « Nouvelle opération », « Suivant », « Soumettre pour approbation », « Confirmer la réception », the confirmation dialogs (« Confirmez-vous l'action « Terminer » sur cette opération ? »), « Vue d'ensemble » / « Opérations » / « Articles », « Approuver » instead of « Expédier » on the approve button, and « Quantité » instead of « Seuil de Quantité ». The list's refresh after Complete was already fixed by 3.3.1 (#447).
- Stock app 3.3.1-uvl.2, after the b14 browser QA. The Articles and Opérations tables and toolbars fit the window at 1366 and 1440 px in French: the toolbars no longer cover the table header, « Importer » shows, and « Nouvelle opération » is no longer cut to « uvelle opération ». The Responsible Person list also leaves out the « eip app » account: the excluded roles now match whatever their case (it holds « System developer »). A dispensing pharmacist no longer sees « Sources », « Portées des rôles » and « Paramètres » in the side menu: they need `Task: stockmanagement.stockSources.mutate`, `Task: stockmanagement.userRoleScopes.mutate` and `Manage Global Properties`. When issuing, the batch that expires soonest is offered first. The home « Réception » card lists completed receipts, newest first, instead of every receipt not completed (a cancelled one showed). « Stock Expirant / Dans 6 mois » counts the batches that expire in the next six months; it read 0 because batches whose stock item was not on the first page of items were dropped. French: the confirm button carries the action's own verb (« Terminer », « Approuver ») instead of « Soumettre »; « Type » (was « Taper »), the side menu (« Rapports », « Paramètres », « Portées des rôles »), « Tout afficher », « Détails : <type d'opération> », « Soumettre/Terminer », « Détails de l'article », « Précédent », « N° de lot », « Date d'expiration », « Prix d'achat », « Personne responsable requise », « Autre », the batch picker's labels, the Operations filters and columns (« Numéro », « Emplacement », « Opération »), and « Aucune opération de stock à afficher » (was « Aucune Portée d'Utilisateur de Stock à afficher »). Operation type names (« Requisition », « Stock Issue », …) are server data and stay as configured (#447).
- Stock app 3.3.1-uvl.3, after the b15 browser QA. On Articles and Opérations the toolbar's second row (filters, « Importer », « Ajouter Article de Stock », dates, « Nouvelle opération ») is no longer drawn over the table header at 1366 and 1440 px. uvl.2's height fix never applied: Carbon's toolbar ignores the class it was given, and Carbon's fixed 48 px toolbar height, loaded after the stock app's stylesheet on UVL, won. French: operation statuses in the list and the Statut filter (« Nouveau », « Soumis », « Complété », …), the pagination (« Éléments par page : », « sur N pages »), the selection bar's « Annuler », « Destination », « Saisir des remarques... », « Unité de mesure », « Pharmaceutiques / Non pharmaceutiques » and « Source requise » (#447).
- Stock app 3.3.1-uvl.4, after the b16 browser QA. The Articles and Opérations toolbars no longer draw their second row over the table header, and the Opérations table no longer scrolls sideways at 1366 px. On UVL's Carbon both the toolbar and its content have a fixed 48 px height and the content is stretched to the toolbar's; uvl.3 freed only the content. Checked in a browser with UAT's own Carbon stylesheet loaded last: the last toolbar control ends where the table header starts, at 1280, 1366 and 1440 px. French: the « AUTHORIZED » status (« Autorisé », now also in the Statut filter), statuses on the home cards, « Disponible : N », « En rupture de stock », « Destination requise », « Source requise » on a Stock Issue (was « Emplacement requis »), « sur 1 page », « (n de plus) », « Abandonner » (was « Mettre à l'écart »). The inventory alerts show each batch's quantity (« Lot X, quantité : N ») (#447).
- Stock app 3.3.1-uvl.5, after the b18 browser QA. The Opérations table no longer scrolls sideways: a long operation number (« SIS-0054-20261112135338 ») wraps after its « - » instead of holding its column at 230 px. The search box of an expanded operation reads « Rechercher » (#447).
- Roles: only pharmacists dispense. Doctor loses `Edit Medication Dispense` and `Delete Medication Dispense`, so a doctor can no longer change or delete a pharmacist's dispense (the Dispensation app was already hidden from doctors by #603). `scripts/check-openmrs-roles.groovy` now fails the build if any clinical role holds a dispensing privilege, if the Pharmacist or a clinical role holds `Task: stockmanagement.stockItems.mutate` (« Ajouter Article de Stock » and « Importer » on Stock Items; only the central store's Inventory Manager / Inventory Administrator hold it), or if X-Ray Technician loses `Add Orders`, `Edit Orders` or `Edit Encounters`. The X-ray technician cannot be kept from revising or cancelling an order by privileges: entering a result saves a DISCONTINUE order and sets the order's fulfiller status, which need exactly those privileges. Whether a dispensing box may create Opening Stock is its stock scope, set outside this repo (#607).
- French: the vitals workspace is titled « Signes vitaux et biométrie » (« Modifier les signes vitaux » when editing) instead of « Enregistrer les signes vitaux et la biométrie », which wrapped and was clipped in the workspace header. Both keys are only used as that title (`recordVitalsAndBiometrics`, `editVitalsAndBiometrics`, esm-patient-vitals-app translation overrides) (#608).
- French, Odoo: the invoice split screens are in French for French-speaking users: « Générer les factures par payeur », « Calculer la répartition assurance », « Assurance de base » / « Assurance complémentaire », « Ticket modérateur », the contact's « Assurance » tab and the split error messages. UVL-Odoo-Addons `insurance_coverage` `i18n/fr.po` now covers all 80 terms of the module (it had 5); the Odoo boot's `-i insurance_coverage` loads it, no module upgrade needed. Only users whose Odoo language is French see it: on UAT 13 of the 20 internal users are still `en_US` (#608).
- Theatre billing: an anaesthesia act is billed at 50% of the surgical act on the same quotation, as the hospital price list says (« Actes d'anesthésie : 50% de l'acte de chirurgie »). A C-section at 750,000 BIF with ANE401 on the same visit gives an anaesthesia line of 375,000 BIF, which the payer split then divides like any other line. With several surgical acts, the highest-priced one is used; when the surgical act leaves the quotation, the anaesthesia line goes back to its catalogue price; an invoiced line keeps its price. New UVL-Odoo-Addons addon `uvl_anaesthesia_pricing` (needs `uvl_anaesthesia_pricing` in the Odoo `ADDONS`, LIME-EMR-Tooling `docker-compose-odoo-sso-uvl.yml`). Which products count is configuration: the new Odoo initializer folder `product_tags/` tags ANE401–ANE406 « Acte d'anesthésie » and the 87 coded major, intermediate and minor surgeries of `procedures.csv` « Acte chirurgical »; finance can retag a product on its form. The percentage is the Odoo system parameter `uvl_anaesthesia_pricing.surgical_act_percentage`. The #596 surgical acts get their tag once #596 is merged (#627).
- French, Keycloak: the sign-in and sign-out pages are in French whatever the browser language. The `ozone` realm supported `en` and `fr` with no default, so once the session had ended an English browser got « Do you want to log out? ». LIME-EMR-Tooling realm seed: `supportedLocales` `fr`, `defaultLocale` `fr`; existing realms need both set once in the admin console or API, the seed is only read on a first install (#608).
- Discharge summary: « Évolution à la sortie » offers the official list (product owner, 11 Nov 2026), in its order and words: Guéris, Améliorés, Contre-référence, Référence niveau équivalent, Référence niveau supérieur, Référence intra-hospitalière, Sortie contre avis médical (décharge), Évadés, Décès avant 24 h, Décès après 24 h. « Décédé » becomes the two death answers, new concepts (uvl-custom, NARROWER-THAN CIEL 160034 Died); the date and time of death and « Audit du décès réalisé ? » show and are required for either. The eight other answers keep their #583 concepts, relabelled in the form, so the hospitalisation register (#587) and Ministry ward activity (#590) count them by the same concept. Décédé stays a concept (the outpatient outcome offers it, and a discharge already saved with it keeps its value); its answer on the question is retired in OCL (uvl-ciel 20261112-609) and removed by Liquibase `discharge_outcome_without_deceased_answer-20261112`. OCL: new collection `uvl-discharge-outcome` 20261112-609, `UVL_discharge_outcome_609_20261112.zip`. Build check 13 fails a question whose answers differ from its official list in `requirements/form-answer-lists-fr.tsv` (#609).
- Registration and visits: the insurance card number is recorded once, at registration, in « Numéro de carte d'assurance » (Informations supplémentaires; person attribute `a8122ab5-de1f-4f0a-b882-7c5b375f4faa`), and the patient banner shows it with the telephone and the chef de ménage. Starting a visit now asks « Carte d'assurance vérifiée » (required visit attribute `deb7a704-0406-4f57-8705-a674f7ae0759`): « Carte d'assurance valide », « Carte d'assurance non valide ou non présentée » or « Sans objet (patient non assuré) »; the attribute's creator and date are who checked it and when. A new card is typed over the old number in the registration; Liquibase `insurance_card_history_table-20261112` and `insurance_card_history_triggers-20261112` keep every number, with the user and time, in `uvl_insurance_card_history`, which the PBF registers can read for the number in force on a date. The triggers need `log_bin_trust_function_creators=1`, like the #189 ones (UAT has it). OCL: uvl-custom 20261112-582; `UVL_registration_20261112-582` replaces `UVL_registration_20261008` (#582).

Merged to UVL-EMR `main` and verified on UAT. **Not in production.**

### Staff will notice
- **The visit's Payer now decides who pays the bill, and a 100% payer pays 100%.** Before, Odoo
  was never told the payer, so a scheme was patched onto the patient as a discount pricelist by
  hand, and a 100% payer came out at 50%. Now each insured Payer answer is an Odoo insurance plan,
  and the visit's quotation names it. On the invoice, « Generate Payer Invoices » raises one
  invoice per payer: Gratuité and DGAC 100%, MFP and Santé Assuré 80%, MSU 70% and MSU 60% (one
  answer per category), CAM 0% for now (its plan is marked **PLACEHOLDER**: no rate was given, so
  the patient pays until finance sets it). Cash, Mobile Money and Autre assurance are self-paid:
  no plan, the patient pays everything. (#189, #219, #184)
- **A new « Assurance complémentaire » field when starting a visit**, after Payeur. Its one
  answer, PNB, pays a flat 20% of each line on top of the payer: MFP + PNB leaves the patient
  nothing; MSU 60% + PNB leaves the patient 20%. (#189)
- **The vitals form shows each vital's normal range under its input** (« Normale : 60–100 »;
  blood pressure as systolic / diastolic), taken from the concept's reference range for the
  patient. A value outside it is flagged on the field and still saves; only an impossible value
  (outside the absolute limits) blocks saving. The ranges are the ones already on the concepts
  (`UVL_vital_signs_20261105.zip`): temperature 35–37.7 °C, pulse 60–100, respiratory rate
  12–18, systolic 100–140, diastolic 60–90 mmHg, SpO2 ≥ 95 %. Weight, height and MUAC have no
  normal range on their concepts, so none is shown. (#564)
- **A payer with no plan bills the patient, and the quotation says so.** « Assurance privée » and
  the old « Assurance complémentaire » answer of the Payer list have no plan. A visit started with
  them still gets its quotation, with no insurance plan (the patient pays, as with Cash), and one
  note in the quotation's chatter: « Le payeur de la visite (…) n'a pas de plan d'assurance dans
  Odoo : le devis est au nom du patient. Corrigez l'assurance du devis si nécessaire. » The note is
  written once, not on every order. The same happens if two plans claim the same field or the
  visit's payer cannot be read. The order is never held back for it. (#219)
- **Changing the Payer after the first order is noted on the quotation**, in its chatter: the
  quotation keeps the plan it was created with, and the note says which plan the visit now names,
  so the cashier can correct it. Invoices already made never change. (#219)
- **An insured quotation drops the patient's discount pricelist** (Insurance 50%..90%) and is
  priced in full; the plan pays its share of the full price. The removal is noted in the
  quotation's chatter. A self-paid quotation keeps the pricelist. (#184)
- **An admitted patient's visit stays open overnight, and each night is billed.** The nightly
  auto-close used to close General and Outpatient visits whatever happened in them, so a patient
  admitted on one lost the visit the same night, with no discharge. A visit whose latest
  Admission or Discharge is an Admission is now left open until the patient is discharged; other
  visits still close at midnight. Every hour, each night of a stay (a midnight in Bujumbura) is
  put on the visit's quotation: « Lit simple / Standard Bed », or « Lit VIP » for a night spent in
  a ward tagged « Chambre privée ». A stay shorter than one midnight counts one night. A
  transfer changes the class from the next midnight; the discharge stops the count. Prices are
  the ones set in Odoo. (#246)
- **Open visits now close at midnight Burundi time, not at 02:00.** The nightly auto-close ran
  at 23:59:59 UTC, which is 01:59:59 in Burundi: a visit started after midnight could be closed
  minutes later, the chart kept showing it active, and the next save failed with
  `Encounter.datetimeShouldBeInVisitDatesRange`. It now runs at 23:59:59 Burundi time
  (21:59:59 UTC). (#350)
- **"No" answers read « Non » in French, not « Faux ».** This includes answers already saved,
  because an answer stores the concept, not its wording. (#528)
- **Se déconnecter now really signs you out.** The user menu's logout entry is « Se déconnecter »
  and goes to `/openmrs/oauth2logout`, which ends the OpenMRS session and the Keycloak session in
  one request, then shows the Keycloak sign-in form. Before, Logout ended only the OpenMRS session,
  so on a shared ward workstation the next person was signed back in as the previous user.
  `@openmrs/esm-login-app` 11.0.0 ignores `provider.logoutUrl` in `oauth2` mode; the stock Logout
  button is replaced by primary navigation's generic link. The label is French in both languages
  (the generic link is not translated). (#323, replaces draft PR #411)
- **The clinical forms list is grouped by service:** « Consultation externe », « Hospitalisation »,
  « Maternité », « Bloc opératoire » and « Autres » (English: Outpatient, Inpatient, Maternity,
  Theatre, Other). Every form is still listed, so the outpatient consultation form still appears on
  an inpatient visit, under its own heading. Filtering forms by visit type needs a change in the
  forms app; this grouping is the interim. Each section has its own search box. (#518)
- **More of the interface is in French:** registration (« Informations supplémentaires », « Pays »,
  « Détail de l'adresse », « Numéro de téléphone », « État civil », « Profession »), the queues
  « Changer » button, the order basket (« Retirer de l'ordonnance » everywhere, « Retour à
  l'ordonnance », « Traitements à venir »), order status tags (« En cours », « Terminé »…), the
  laboratory (« Ajouter une demande d'examen », « Urgence », « Motif de la demande : »), dispensing
  (« Dosage libre », « Voie d'administration ») and vitals (« Voir les valeurs normales »). The
  three registration field labels are written in French in the config, because the registration
  app does not translate field labels; English sessions see them in French too. Still in English,
  because they don't go through translation: the list pagination (« Items per page », « of 1
  page ») and the encounter and visit names built by the server (e.g. « Inpatient visit @ … »).
  (#529)
- **An X-ray or ultrasound result can't be saved until the exam is paid.** "Entrer des résultats"
  from the chart's Orders, the Laboratory app and the API all refuse it with « Résultats refusés :
  le paiement de la commande d'imagerie ORD-… n'est pas confirmé. Faites régler la facture à la
  caisse, puis réessayez. » (English: "Results refused: payment for imaging order ORD-… is not
  confirmed. Have the invoice paid at the cashier, then try again."). The order can't be marked
  Completed either. Once the cashier takes payment, the bridge accepts the order's payment Task
  within about a minute and the same result saves. Other results (lab, procedures) are unchanged.
  An administrator can still save in an emergency; that is logged. (#322)
- **A saved form shows its answers in French.** Opening an encounter under Visits showed the
  answers in English ("No", "Yes", "Male", "Cephalic"...) though the form had been filled in
  French. It now shows the words the form showed, « Non », « Oui », « Céphalique », on every
  form, old encounters included. (#528)
- **The Change language dialog says how to change language for the session.** Its checkbox is
  ticked every time the dialog opens; ticked, it saves the language as the account's default,
  which only the administrator may do (`Edit Users`, removed from clinical roles in #502), so
  clinical staff got a 403 and the language did not change. The checkbox now reads « Enregistrer
  comme langue par défaut (administrateur uniquement) », with « Décochez cette case pour changer
  la langue de cette session. » under it (English: "Save as my default language (administrator
  only)" / "Untick this box to change the language for this session."). Unticked, the dialog
  only changes the session language, which needs no privilege. This is a translation override
  of `@openmrs/esm-primary-navigation-app` 11.0.0 in the frontend config; the dialog itself is
  unchanged. Corrected training note, replacing the one given with #502: « Pour changer de
  langue : ouvrez Changer de langue, choisissez la langue, décochez « Enregistrer comme langue
  par défaut », puis cliquez Modifier. La case est cochée à chaque ouverture. Seul
  l'administrateur change la langue par défaut. » (#524)
- **The childbirth record is easier to work through.** Sections are numbered 1–12 with no gap.
  The diagnosis is split into a primary diagnosis and secondary diagnoses. Gestational age is
  calculated from the last menstrual period, and the fundal-height field in weeks is now labelled
  as gestational age by fundal height (fundal height itself stays in cm). When a saved record is
  reopened, the gestational age keeps its saved value instead of being recalculated. The
  childbirth record and partograph reading show only a "not applicable" note for male patients.
  (#247)
- **Registration has a "Chef de ménage (Head of household)" field,** under Additional
  information. It is free text and optional, and the patient banner shows it next to the
  telephone. It feeds the PBF report's head-of-household column; the dashboard column itself is
  separate Superset work. (#239, #389)
- **A prescription can't be dispensed twice.** Once its full quantity is dispensed it is
  completed, and Dispense, Pause and Close disappear. The Pharmacist can now change the quantity
  dispensed, which allows partial dispensing; drug, dose, route and frequency stay locked.
  (#374, #389)
- **Starting a visit lists every payer scheme:** three answers are added: Free healthcare /
  Gratuité (soins gratuits), Private insurance / Assurance privée, and Supplementary insurance /
  Assurance complémentaire. The five existing answers stay, so past visits are unchanged.
  (#370, #388)
- **Stool examination (BP06) and urine culture (BP09) take structured results.**
  - Stool: consistency, colour, appearance, one graded field per parasite (Ascaris,
    Ancylostoma, E. histolytica, S. mansoni, Taenia sp., H. nana), E. histolytica form, occult
    blood, and a comment.
  - Urine culture: culture result, organism identified (14 options), colony count (UFC/mL, whole
    number), antibiogram (text), and a comment. (#371, #388)
- **The consultation forms no longer show "Capture Vitals".** Vitals are recorded in the chart's
  Vitals box. (#211, #390)
- **85 products now carry their tariff price** from the UVL tariff sheet of 4 Oct (25 lab
  tests, 59 procedures, and Cefixime 400mg at 1,400 FBu). Products still at 1.00 go from 442 to
  357. (#270, #391)
- **Lab results accept decimals on all 54 numeric lab tests,** and Arthritest records
  Négatif/Positif. (#354, #208, #209, #366)
- **The urine examination (BP07) has 7 structured fields,** and its red-cell value no longer
  appears in the blood count. (#366)
- **Queues load for the Pharmacist, X-Ray Technician and Lab Technician** without a 403 on the home
  page. (#351, #365)
- **205 more products carry the product owner's price** (8 Oct sheet): 165 pharmacy, 38 procedures
  and 2 lab tests. 67 of them are priced per bottle, tube or ampoule and bill correctly only with
  the per-container rule below. Pénicilline V Flacon 1MUI (written `3OOO`) is loaded as 3,000 and
  Vital Signs Check as 10,000; both await the product owner's confirmation. (#270, #417)
- **Stool results recorded before the structured BP06 show again.** The 23 old single-answer results
  (July–August) become a BP06 result with the old answer as its comment ("Résultat antérieur
  (liste unique) : …"). The old row is voided, not deleted. (#415, #418)
- **Prescriptions dispensed in full before the dispensing change no longer offer Dispense.** They are
  marked Completed, with the comment `#416 backfill: dispensed in full before #374`. Paused, closed
  and partly dispensed prescriptions are untouched. (#416, #419)
- **H. pylori (HS26) and Albuminurie (BP10) can be billed,** at 1.00 until they are priced. Their
  OCL concepts are in `uvl-labtests` 20261008. (#371, #420)
- **The order basket no longer shows "Prix: 0,00 BIF" and "En rupture de stock"** on every line.
  Both rows are hidden until fhir-odoo reads the sale price and stock exists. (#363, #421)
- **The radiologist's report reaches the X-ray order.** A report saved in the PACS viewer (OHIF)
  shows under the order's result on one line, with the findings and measurements written on the
  image (French accents intact), not only the report name, at the time it was saved. The X-ray
  order is then marked Completed. (#427)
- **Only a radiologist can save a report in the PACS viewer, under their own login, and the chart
  says who reported** ("Reported by: <name>"). An X-ray technician can still view images and
  worklists; a save they try is refused with a clear message in French and English. (#429)
- **The pharmacy has a Stock Management app, in the app menu.** Pharmacie (Rx) is the central
  store (receipts, counts, issues) and Pharmacie - Dispensation (Rx-DISP) the dispensing point.
  204 catalogue drugs are stock items there (166 medicines, 38 consumables), with no batches and
  no quantities yet, so the pharmacy can count and move stock. A Receipt goes into Pharmacie (Rx),
  and the stock module's own demo locations, "Main Store" and "Main Pharmacy", are no longer
  offered. **Dispensing does not deduct stock yet** and works as before. (#437)
- **"Complete dispatch" now shows for the receiving pharmacist** as soon as a Stock Issue is
  dispatched, and the approved requisition's "Issue stock" action as soon as it is approved, without
  an OpenMRS restart. A stock role or scope changed by an administrator applies at the next refresh
  of the operations list. A pharmacist can no longer create or change a stock operation outside
  their stock scope (a location or operation type their scope doesn't give), even through the API:
  the server answers 403. (#447)
- **Each dispensing pharmacist has their own stock box.** Pharmacie - Dispensation Box 1, 2 and 3
  (Rx-DISP-1 to -3) sit under Pharmacie - Dispensation. A pharmacist signs in at their box; once
  deduction is on, a dispense takes from that box. The central pharmacy issues to the boxes, and a
  pharmacist can send stock from their box to another box that has run out. Each pharmacist enters
  their own box's opening stock and month-end count (stock take); the central pharmacist can too.
  (#453)
- **The Central Pharmacist no longer dispenses.** They receive, count, correct and issue stock;
  in the dispensing app they can see prescriptions but get no Dispense action. (#453)
- **A price finance changes in Odoo stays changed.** A deploy or a database restore no longer
  resets 290 product prices to the configuration's values. (#439)
- **Stock operations show which product each line is for.** Expanding a requisition, stock
  issue or stock count showed an empty **Article** column, and Items an empty **Nom Commun**:
  no stock item had a common name. Each stock item without one now takes its drug's name, on
  every start, so items a later seed adds get it too. A name typed in the app is kept.
  Liquibase `stock_item_common_name_from_drug-20261027`. (#463)
- **Consumables ask for a batch number and an expiry date on receipt,** like medicines: the
  product owner asked for both on medical consumables too. Two adjustment reasons are added,
  **Détérioré** (Deteriorated) and **Cassé** (Broken), before "Autre raison". The stock app's
  packaging and dispensing unit lists, empty until now, offer in French and in alphabetical order
  every pack unit of the stock catalogue (Flacon, Comprimé, Pièce, Ampoule(s), Tube, Rouleau,
  Gélule, Ovule, Paire, Baxter) and every unit an existing stock item already uses. Bouteille is
  now called **Flacon** and Unité **Pièce**, everywhere the unit is shown, prescriptions
  included. (#454)
- **Prescriptions and the stock use the catalogue's names and lists.** 33 drugs take the name the
  product owner gave them on 22 Oct 2026 (for example Amoxicilline Gélule 500mg, was Capsule;
  Céfotaxime Injectable 1g; Fluditec Sirop 2% and 5%). Seven drugs are new: Febrilex Junior Sirop,
  Ibuprofène Comprimé 200mg, Neuroba Comprimé 300mg, Nystatine Comprimé 500 000UI, Pénicilline G
  Injectable 1MUI, Phénobarbital Injectable 40mg/2ml and Presept Comprimé. So are the 15 catalogue
  items the product owner named that OpenMRS lacked: 11 medicines (Alcool dénaturé 98%, Artésunate
  Suppositoire, Auropent, Aurozole and Predimax Collyre, Cefixime Sirop 100mg, Clavox Injectable,
  Cloxacilline Injectable 500mg, Cotrimoxazole Comprimé 160/800mg, Salbutamol Injectable 0,5mg,
  Vecuronium Injectable) and 4 consumables (Gel Echographique, Robinet à 3 voies, Rouleau de gaze
  90 cm x 91 m, Sachets pour le conditionnement des MEG). All 22 new drugs can be billed: each has an
  Odoo product at 1.00, for finance to price. 142 drugs get a stock item, so every drug prescribed
  on UAT in the last 90 days now is one. 79 stock items change to
  the pack unit of sheet 3 (Flacon for a syrup or eye drops, Ampoule for an injection, Rouleau for a
  bandage, Paire for gloves). Past prescriptions are unchanged: only the names change. (#455)
- **One name per medicine.** 32 drugs that duplicated another under a brand or a second spelling
  (for example Ibuprofen Denk for Ibuprofène Comprimé 400mg, Dafrazol for Omeprazole Gélule 20mg,
  Micozal and Crème de Miconazole 20g for the miconazole cream, Predimax for Auropred, Chlorure de
  sodium for Soluté NaCl 0.9% 500ml) can no longer be prescribed; the catalogue's name stays, as
  confirmed by the product owner on 29 Oct 2026. Past prescriptions keep their drug and still
  display. Their stock items are voided when they hold no stock, and their Odoo products are
  archived, not deleted, so past invoices are unchanged. Brufen, Neurontin, Halothane, Cromulline
  and Cromsol stay as their own products. Efferalgan Comprimé 500mg stays and is renamed
  **Paracétamol Effervescent**, and Miconazole Crème 0.02% 15g is renamed **Miconazole crème 2%
  15gr** (strength 2%), in OpenMRS, Odoo and the stock item. Aceclofenac Comprimé 100mg replaces
  Acefen and gets its own stock item. The aceclofenac drugs now use the Aceclofenac concept and
  the six diclofenac drugs the Diclofenac concept. `sql/one_name_per_medicine.csv` lists each
  drug kept and retired. (#478)
- **The chart's Forms list has "UVL Contact Form" (Fiche d'enregistrement d'un contact),** for
  nurses, midwives and doctors. It records the patient's origin, the clinical service, the
  responsible provider, who accompanies the patient (name and telephone), the internal transfer
  destination, the case type (Nouveau / Ancien), its category, the clinical situation, and the
  diagnostic hypothesis. The clinical service, the responsible provider and the diagnostic
  hypothesis are required: a form saved without a provider failed with "Cannot read properties of
  null (reading 'uuid')" for a user who has no provider account. Identity, contact type, dates and payer come from the
  patient banner and the visit, so they are not asked again. It saves a "Contact" encounter.
  (#376)
- **The chart's Forms list has "UVL Discharge Summary Form" (Synthèse de sortie d'hospitalisation),**
  for doctors and midwives. It records the reporting indicators (maternal death, perinatal death,
  transfusion or anaemia, positive RDT, post-procedure infection), suspected nosocomial
  infections, pregnancy, malaria, diarrhoea and pneumonia classifications and their treatment,
  the discharge diagnoses, clinical summary, discharge treatment, prevention of complications,
  follow-up and general observations, and the discharging clinician, who is required. Identity,
  commune, discharge date and payer come from the patient banner, the encounter and the visit,
  so they are not asked again. It saves a "Discharge Summary" encounter, which does **not**
  discharge the patient: the patient stays admitted until discharged from the ward. (#380)
- **The chart's Forms list has "UVL Admission Note Form" (Fiche d'admission en hospitalisation),**
  for doctors. It records vital signs (blood pressure on both arms) and anthropometry (BMI is
  calculated from weight and height), the reason for admission, history of the illness, family,
  medical, surgical and gynaeco-obstetric history, lifestyle, the physical examination
  (general condition, symptoms, percussion, auscultation, summary), tests already done, the
  admission hypotheses and diagnoses, tests requested and treatment (with the order basket),
  suspected nosocomial infections, integrated observations, and the clinician, who is required.
  Identity, age, sex, commune and admission date come from the patient banner, the encounter and
  the ward admission, so they are not asked again. It saves an "Inpatient Consultation"
  encounter and does **not** admit the patient: admission stays in the ward app. (#377)
- **The chart's Forms list has "UVL Inpatient Follow-up Form" (Fiche de suivi d'hospitalisation),**
  for nurses, midwives and doctors, filled as often as needed during a stay. It records the time
  the doctor was called and arrived, neurological danger signs, complaints, vital signs (blood
  pressure on each arm, BMI calculated from weight and height, fetal heart rate for women), the
  fluid balance (inputs, outputs and a calculated total), stools, the examination, treatment and
  progress, tests and new treatment (with buttons to order them), recommendations, Ikirezi clinical
  information and suspected nosocomial infections, and the clinician or nurse on duty, who is
  required. Identity and ward come from the patient banner and the session location. Each note
  saves one "Inpatient Follow-up" encounter. (#378)
- **The chart's Forms list has "UVL IPD Monitoring Form" (Protocole de surveillance globale),**
  for nurses, midwives and doctors. Each round of checks is saved as its own "IPD Monitoring"
  encounter, at the date and time the round was done, so the values chart over the stay. It
  records vital and respiratory signs (with SpO2 on room air and on oxygen, oxygen flow and
  mode), the Glasgow score (total calculated), pain score, weight, height and BMI, fluid intake
  and output with their totals and the balance, meals and feeds, MUAC, weight-for-height for
  children under 5, and the nurse's observations. The monitoring nurse is required. Vital signs
  use the same concepts as the Vitals box, so they appear there too. (#379)
- **The chart's Forms list has "UVL Childbirth Record Form" (Dossier d'accouchement, MSPLS),**
  for midwives and doctors only. Three pages follow the paper's sections 1 to 13: admission and
  history (obstetric history, recent labs, current complications, ANC, PMTCT), labour and
  delivery (vital signs, labour progress, admission examination, delivery, complications,
  placenta), and postpartum and newborn (a monitoring row per time point, a block per newborn).
  The person who performed the delivery is required. Identity, commune, marital status and the
  head of family come from registration, so they are not asked again. It saves a "Childbirth
  Record" encounter that only midwives and doctors can view, because it holds HIV and PMTCT
  data. Its concepts come with the uvl-forms 20261027 OCL export (#376). (#381)
- **The chart's Forms list has "UVL Partograph Reading Form" (Lecture du partogramme),** for
  midwives and doctors. Each reading is one "Partograph Reading" encounter, stored at the date and
  time the reading was taken, so a reading typed in late still plots at the right time. A reading
  records any of: fetal heart rate, amniotic fluid, head moulding, medications given, cervical
  dilatation, descent, contractions per 10 minutes and their duration, oxytocin (U/L and
  drops/min), pulse, blood pressure and temperature; none is required except the clinician. The
  patient summary shows a "Partograph" graph (fetal heart rate, dilatation and descent,
  contractions, oxytocin, pulse and blood pressure, temperature) and a table of the coded rows,
  to midwives and doctors only. The graph has no alert or action lines. Type of delivery and
  uterine revision are recorded in the childbirth record (#381), not here. (#382)
- **The chart's Forms list has "UVL Pre-operative Record Form" (Dossier préopératoire),** for
  doctors and anaesthetists. It records the planned procedure and whether it is an emergency or
  elective, the patient's history (tobacco, asthma, diabetes, hepatitis, allergy, heart disease,
  hypertension, other, previous anaesthesia, neurological problem), the clinical examination
  with blood pressure on each arm, the paraclinical results (chest X-ray, ECG, fundoscopy and the
  pre-operative lab values), current treatment, intubation difficulty and Mallampati, ASA class,
  anaesthesia protocol, fasting time, premedication and the planned anaesthesia type, and the
  doctor or anaesthetist, who is required. It saves a "Pre-operative Record" encounter. (#383)
- **The chart's Forms list has "UVL Anaesthesia Report Form" (Rapport d'anesthésie),** for
  anaesthetists and doctors. It records the referring service, the start and end of anaesthesia
  and of the procedure as date and time, with both durations in minutes calculated, the pre- and
  post-operative diagnoses, the procedure performed, the theatre team, the anaesthesia type,
  patient position, airway and breathing mode, the anaesthesia machine and any technical problem,
  medications given, known allergies, incidents, side effects, the contact diagnoses (CISP-2 /
  CIM-10) and the anaesthetist-intensivist, who is required. Identity comes from the patient
  banner. It saves an "Anaesthesia Report" encounter. Its concepts come with the uvl-forms
  20261027 OCL export (#376). (#384)
- **A Doctor sees every label on the Ward Admission form and can open the ward page.** Coded
  answers referenced as `CIEL:` showed blank radio and location labels, and the ward page at
  Hospitalisation (IPD) crashed with "Cannot read properties of undefined (reading 'patient')".
  `Register patients` gains the two read-only privileges `Get Concept Reference Terms` and
  `View Metadata Via Mapping`, so every role inheriting it has them: Help Nurse, Nurse, Doctor,
  Midwife, Ophtalmologist, Dentist and Anesthesist. Pharmacist, Lab Technician and X-Ray
  Technician are unchanged. (#480)
- **The chart's Forms list has four maternity forms from the forms metadata sheet, Release 1,**
  for midwives and doctors only. Each saves its own encounter, which only midwives and doctors
  can view. For a male patient each form shows only "This form is for female patients only."
  - "UVL Maternity Consultation Form" (Consultation de maternité), filled on arrival so it can
    be saved before delivery: gestational age, contact person, gynaecological and obstetric
    history (gravidity and parity required; the caesarean indication and date appear only when
    a previous caesarean is ticked), medical and surgical history, blood group, ANC,
    pregnancy particularities, current symptoms, examination and cervix.
  - "UVL Delivery Registration Form" (Enregistrement de l'accouchement): who performed the
    delivery (required), doctor called and arrived, procedures (now also eutocic or dystocic
    delivery), problems detected, placenta, and a block per newborn.
  - "UVL Gynaecology Ultrasound Form" (Échographie gynécologique): gestational age, pregnancy
    type, a block per fetus (status, sex, estimated weight), presentation, amniotic fluid,
    placenta and notes.
  - "UVL ANC Consultation Form" (Consultation prénatale): gestational age, visit type (CPN 1 to
    CPN 6 and more), pregnancy period, smoking and alcohol, HIV and syphilis counselling and
    testing, obstetric counts, examination, treatments given, PMTCT, high-risk pregnancy and
    gender-based violence screening (the type of violence appears only when screening is Yes).
  - In the three forms that ask for the last menstrual period, the expected delivery date and
    the weeks of amenorrhoea are calculated from it and can be corrected by hand.
  - Questions already in the Childbirth Record use the same concepts, so their data stays
    comparable. The Childbirth Record form is unchanged. The new concepts come with the
    uvl-forms 20261102 OCL export, which replaces 20261027. (#485)
- **The maternity forms follow the forms metadata sheet, Release 1.1, and a fifth one is added.**
  - "UVL 24-Hour Surveillance Form" (Surveillance des 24 heures) is new, for midwives and doctors
    only, with its own encounter. One form is filled at each time point (30 min, 1 h, 2 h, 6 h,
    12 h, 24 h), and the time point is required. It has a block per newborn, up to 3, shown by
    the number of newborns (status, term and
    weight, sex, weight, size, APGAR at birth, resuscitation, breathing, pulse, temperature,
    malformation, urine, stool, breastfeeding, umbilical cord, skin colour) and the mother's
    monitoring: complications, blood loss in mL, contracted uterus, breathing, pulse, blood
    pressure as systolic and diastolic (mmHg), temperature, urine in mL and treatment.
  - Delivery Registration: the profession of the person who delivered, the number of newborns
    (required, 1 to 3), and, in each newborn's block (one block per newborn, up to 3), the type of stillbirth (shown for a stillbirth only), the
    intubation time, the adrenaline dose in mg, where the newborn goes, and the APGAR at 1, 5
    and 10 minutes. Each APGAR item scores 0, 1 or 2 and the total is calculated. The 10-minute
    APGAR appears only when the 5 items at 5 minutes are filled and total less than 7. The APGAR
    is hidden for a stillbirth.
  - Maternity Consultation: labour start and the mother-child health record; the contact
    person's nationality and relationship; myomectomy and caesarean section, medical history,
    pregnancy particularities and current symptoms as one Yes/No question each instead of tick
    lists (the caesarean date and indication appear only when Caesarean section is Yes); the IPTp
    dose, VAT and PMTCT as asked; the pelvis, fetal heart sounds and cervix length, position and
    consistency as choices.
  - ANC Consultation: smoking, alcohol, bed net, iron and folic acid, albendazole, PMTCT,
    pregnancy problem and GBV screening are required; gravidity and parity are required; the VAT
    dose and the IPTp dose are choices.
  - Gynaecology Ultrasound: up to 3 fetus blocks. The second shows for a multiple pregnancy; the
    third when the number of fetuses (asked for a multiple pregnancy) is 3.
  - The newborn and fetus blocks are fixed blocks, not "add another" groups: in edit mode the
    form engine reopened only the first block of a repeating group (UAT, #496). A block hidden
    by a lower count is not saved, and its saved values are voided.
  - Data saved with Release 1 keeps its concepts; questions that changed type (for example the
    adrenaline dose, now a number) use new concepts. The new concepts come with the uvl-forms
    20261104 OCL export, which replaces 20261102. (#496)
- **The partograph is drawn like the Ministry's MSPLS partogram.** On the patient summary,
  "Partogramme" replaces the generic graph. It is shown to roles with "View Partograph Reading"
  only, and only for a patient who has partograph readings. Its layout is the MSPLS partogram,
  the "Accouchement (modèle MSPLS)" model the clinic uses on paper and in OpenClinic. The alert
  and action lines are the WHO rule.
  - **Time axis:** marked 00 to 12, with the clock time under each hour and the date where it
    changes. Hour 00 is the first reading of 4 cm or more, where the alert line starts. Each
    reading sits at its real time, and earlier (latent-phase) readings sit before 00.
  - **Panels, top to bottom, each with its legend:**
    - fetal heart rate, 80–200, with reference lines at 100 and 180 /min;
    - liquor and moulding, as codes (I, C, M, B; 0, +, ++, +++);
    - medications, numbered, with the full text listed under the chart;
    - cervical dilatation (×, 0–10 cm) and descent (○), with the **alert line** (4 cm at 00 to
      10 cm at 06) and the **action line** (4 cm at 04 to 10 cm at 10);
    - contractions per 10 minutes, 0–5, shaded by duration;
    - oxytocin, U/L and drops/min;
    - pulse, 40–180;
    - blood pressure, 40–200;
    - temperature, 35–43 °C.
  - When the first reading of 4 cm or more is above 4 cm, it is placed on the alert line (WHO
    rule). A first reading at 6 cm, for example, is at hour 02.
  - The codes, medications and oxytocin are written in half-hour cells, as on the paper sheet.
    Readings in the same half hour (14:00 and 14:25) are stacked one per line, so `++` and `+++`
    stay apart.
  - Every label is in French.
  - Only the current labour is drawn: a gap of more than 24 hours between readings starts a new
    one.
  - The generic partograph table ("Partogramme : liquide amniotique, modelage, contractions,
    médicaments") is removed. It showed even for patients without readings, and the chart now
    shows what it did. (#498, #264)
- **The partograph opens from the side panel, and the 24-hour surveillance has its own table.**
  (#565)
  - A **Partogramme** button in the patient chart's right-hand panel, under the Visit Note and
    the clinical forms, opens the Partograph Reading form (F09). It shows only for a female
    patient and for staff who may record a reading ("Edit Partograph Reading"). As with the
    clinical forms, it asks to start a visit when the patient has none.
  - The form is no longer in the "Maternité" list of the clinical forms. Earlier readings are
    still opened from the patient's encounters.
  - The partograph on the patient summary redraws as soon as a reading is saved from that
    button.
  - **Surveillance des 24 heures** (F17) on the patient summary: one column per saved form,
    headed by its time point (30 min, 1 h, 2 h, 6 h, 12 h, 24 h) and its time. The rows show
    the mother's values first (blood loss, uterus, breathing, pulse, blood pressure,
    temperature, urine, complications, treatment), then each newborn's under « Nouveau-né 1 »,
    « Nouveau-né 2 »… Each value stays in its own row. The table shows only the current
    delivery, and only for staff with "View 24-Hour Surveillance". It is not shown for a
    patient without such a form.
- **A newborn's pulse, breathing and temperature in the 24-hour surveillance no longer show as
  the mother's vital signs.** The form saved them under the mother's concepts, so her « Signes
  vitaux » and the chart header read her newborn's values (pulse 140, respiratory rate 45) and
  flagged them abnormal. The newborn now has its own « Pouls du nouveau-né », « Fréquence
  respiratoire du nouveau-né » and « Température du nouveau-né », with newborn normal ranges
  (120–160 /min, 30–60 /min, 36.5–37.5 °C). Forms saved before keep their values as they were.
  (#562)
- **Antenatal care (CPN) has its own place, "Consultations prénatales (CPN)".** Pregnancy
  follow-up is outpatient care, so it is a service of its own, not under Hospitalisation (IPD).
  Staff can choose it at sign-in and as the visit location, book appointments there and queue
  patients to it ("CPN Consultation"). An ANC Consultation (F16) filled there is recorded at
  CPN, so reports by encounter location count it on its own line instead of under the delivery
  room, IPD or OPD. The ANC questions of the Maternity Consultation (F13), asked when a woman
  comes to give birth, stay with the delivery room. (#501)
- **Visit types, consultation types and form names are in French in a French session.** The
  visit types read "Consultation externe (OPD)", "Hospitalisation (IPD)" and "Visite générale";
  the fifteen UVL encounter types (e.g. "Consultation de maternité", "Lecture du partogramme")
  appear in French in the visit's encounter list; the start-visit form asks for "Origine",
  "Type de cas", "Payeur" and the three other visit fields in French; and every UVL form has a
  French name in the forms list (e.g. "Échographie gynécologique", "Consultation externe"). The
  French form names come from the requirements sheet (Release 1.1) and the forms' own French
  page titles. An English session shows the English names: they are set explicitly too, since
  without them OpenMRS falls back to the system language, French. The names stored in the
  database are unchanged, so reports and the Odoo bridge are not affected. (#499)

### Added
- Inpatient ward locations for the services in the product owner's 3 Sep 2026 service list:
  « Médecine interne », « Pédiatrie » (including severe acute malnutrition), « Chirurgie » and
  « Soins intensifs », children of « Hospitalisation (IPD) » like the maternity and neonatal
  wards, tagged `Login Location`, `Admission Location` and `Transfer Location`. Emergency is the
  existing « Salle d'urgence (ER) », which now also carries `Admission Location` and
  `Transfer Location` rather than a second emergency location. The new wards appear in the admit
  and transfer pickers and can be opened as a ward in the Ward app. No beds: the bed count per
  ward is not known yet, Initializer 2.12.0 and bedmanagement 6.2.0 have no bed domain, and
  `bedmanagement.mandatory` is false, so patients are admitted without a bed (the Ward app shows
  « Aucun lit configuré »). Room-class rates and inpatient billing wait on the fee schedule.
  (#246)
- **Inpatient stay billing** (#246). eip-odoo-openmrs gains an hourly route
  (`InpatientStayRouting`) that recounts every visit with a non-voided Admission, open or ended in
  the last 7 days, from its Admission, Transfer and Discharge encounters (SQL on the OpenMRS
  database; the types are emrapi's `emr.admissionEncounterType`,
  `emr.transferWithinHospitalEncounterType` and `emr.exitFromInpatientEncounterType` mappings). A
  night is a midnight in `Africa/Bujumbura` between the admission and the discharge (else the end
  of the visit, else now), billed to the class of the ward occupied at that midnight; minimum one
  night, at the admitting ward's class. Each class product's line on the visit's draft quotation
  is set to its nights less what the visit's other sale orders already bill; a confirmed sale
  order is never changed (WARN when it bills more). A stay with no quotation gets one. Settings:
  `EIP_INPATIENT_STAY_*` on the `eip-odoo-openmrs` service (`scripts/docker/docker-compose-override.yml`
  here, `Scripts/Bundled-Docker/docker-compose-odoo-sso-uvl.yml` in LIME-EMR-Tooling for the
  bundled deploy). Class: new location tag « Chambre privée » (`locationtags/locationtags.csv`,
  uuid `3775fe54-7794-4fcb-99b2-d6bf8592d685`); no ward carries it yet, so every night is
  « Lit simple » until a private room is tagged. Semi-private rooms are billed as « Lit simple »
  for now.
- **Admitted patients' visits survive the nightly auto-close** (#246). `imagingpaymentgate`
  1.0.0-SNAPSHOT (`distro/binaries/openmrs/modules`, source jnsereko/openmrs-module-imagingpaymentgate
  `592973e`) adds an around-advice on `VisitService.stopVisits(Date)`, the call behind core's
  Auto Close Visits Task: the same loop as core's (`VisitDAO.getNextVisit`/`saveVisit`, one stop
  time per run) that skips a visit whose latest non-voided Admission or Discharge encounter is an
  Admission. The task, its class and its 21:59:59 UTC start (#350) are untouched; visits without
  an admission close exactly as before. emrapi 3.4.0's `CloseStaleVisitsTask` was not used: it
  stamps the last encounter's time as the stop time, closes every visit type and only visits at a
  `Visit Location`. `imagingpaymentgate.keepAdmittedVisitsOpen=false` gives core's behaviour back.
- **OpenMRS module `imagingpaymentgate` 1.0.0-SNAPSHOT** (`distro/binaries/openmrs/modules`,
  source `openmrs-module-imagingpaymentgate`), the server-side imaging payment gate. A new or
  changed obs that references a gated order, and marking that order COMPLETED, are refused with
  HTTP 402 unless the order's payment Task (eip-odoo-openmrs) is `accepted`. Payment is looked up
  in SQL by the order's own uuid, not through a FHIR search, so an ignored search filter can't let
  one paid invoice authorise other orders. Hooks: before-advice on `ObsService`,
  `EncounterService` and `OrderService`, plus a Hibernate interceptor on Obs inserts for writes
  that bypass them (FHIR Observation). Gated orders are the members of the "Imaging procedures"
  concept set (`imagingpaymentgate.conceptSetUuids`, new site file
  `globalproperties/imaging-payment-gate.xml`); `imagingpaymentgate.enabled=false` turns it off.
  New privilege `Bypass Imaging Payment Gate`, held by no role (superusers have it implicitly);
  every bypass is logged at WARN. A failed payment lookup refuses. (#322)
- UVL frontend module `@madiro/esm-uvl-partograph-app` 1.0.1 (`distro/frontend/esm-uvl-partograph-app`,
  `dist/` committed), packed by `distro/pom.xml` and pinned in `spa-assemble-config.json` as
  `file:madiro-esm-uvl-partograph-app.tgz`, like the imaging module. Extension
  `uvl-partograph-chart-widget`, added to `patient-chart-summary-dashboard-slot` by the site config
  with the display condition "View Partograph Reading". It replaces
  `obs-by-encounter-widget#partograph-graph` and `obs-table-horizontal-widget#partograph-table`,
  whose configuration and `@openmrs/esm-generic-patient-widgets-app` French overrides are removed.
  The encounter type, concepts and liquor/moulding code mapping are in the site config under
  `@madiro/uvl-partograph`, a namespace of their own rather than the module name, so core 11 does
  not log "Unknown config key" before the module has loaded; the module ships no UUID. The chart is plain SVG.
  The layout follows the MSPLS partogram (OpenClinic "Accouchement (modèle MSPLS)"); the
  hour-00 and alert/action-line rules are in the module README. (#498)
- French and English display names (`Display:fr`, `Display:en`) for the UVL encounter types,
  visit types and visit attribute types, and a French and an English `form_name_translation` for
  every UVL form (French was set for two, English for none). The visit attribute types carried
  their French names in a `Name:fr` column, which Initializer ignores without a warning; it is now
  `Display:fr`. Initializer turns `Display:<locale>` into the `ui.i18n.<Class>.name.<uuid>`
  message that the REST `display` returns in that session language. English is explicit because
  a missing message falls back to the system default locale (French on UVL) before English: with
  French alone, an English session showed French names (UAT, 2026-11-05). The build now fails on
  a UVL encounter type, visit type, visit attribute type or form without both names, or on a
  localised column Initializer ignores in those domains (`scripts/check-french-metadata.groovy`).
  (#499)
- OpenMRS role and Keycloak `openmrs` client role **Central Pharmacist** (inherits `Pharmacist`
  and `Inventory Manager`), and the Keycloak `openmrs` client role **Inventory Administrator** for
  whoever manages stock user role scopes. The build now fails on a Keycloak `openmrs` client role
  or an inherited role that OpenMRS does not define (`scripts/check-openmrs-roles.groovy`). (#438)
- Locations **Pharmacie - Dispensation Box 1 (Rx-DISP-1)**, **Box 2 (Rx-DISP-2)** and **Box 3
  (Rx-DISP-3)**, children of Pharmacie - Dispensation (Rx-DISP), tagged Login Location, Dispensary
  and Sub Store, and made stock locations by Liquibase `pharmacy_dispensing_boxes_party-20261023`.
  Liquibase `pharmacy_dispensing_boxes_locations-20261023` creates the three boxes first, with
  their `locations.csv` uuids, because the Initializer runs Liquibase before its locations domain:
  without it the stock parties came only on a second start. `locations.csv` then sets their name,
  parent and tags in the same start.
  Sub Store is what lets a box be the source of a Stock Issue (box to box): stockmanagement 2.1.2
  allows only Main Store and Sub Store as a Stock Issue source, and checks it on the server. They
  are not visit locations; a visit started at a box belongs to Rx-DISP. Rx-DISP stays a stock
  location as it was. (#453)
- Person attribute type "Chef de ménage" (`c108c6bc-5f23-4e4a-ad34-8c788b86f288`). (#389)
- Odoo `product_price` initializer loader. The product loader treats `lst_price` as `NO_UPDATE`,
  so it can't change the price of a product that already exists. (#391)
- OCL releases UVL-Burundi `uvl-registration` 20261007 and `uvl-labtests` 20261007-5. (#388)
- OCL release `uvl-labtests` 20261008 (sources `uvl-ciel` and `uvl-custom` 20261008). (#420)
- Liquibase changesets `migrate_single_answer_stool_results-20261008` (#418) and
  `complete_fully_dispensed_drug_orders-20261008` (#419).
- Concepts that existed only in Initializer CSVs now live in OCL (drugs, supplies, procedures,
  dispensing ValueSets, payer, insurance tiers, radiology), and each keeps its UUID. (#366)
- `@openmrs/esm-stock-management-app` 3.2.1, its menu entry added to `app-menu-slot` (the app
  registers it in `app-menu-item-slot`, which this navigation does not render). Liquibase
  changesets for the stock items and the Rx/Rx-DISP stock parties; `stockmanagement.xml` global
  properties; OCL coded concepts, with their values as answers, for stock source types and
  adjustment reasons (`uvl-drug-entry` 20261021-1). A Stock Issue can be saved without a
  requisition (`stockmanagement.allowStockIssueWithoutRequisition`). Liquibase
  `retire_stockmanagement_demo_locations-20261020` removes the stock tags from the module's demo
  locations "Main Store" and "Main Pharmacy" and retires each one where nothing was recorded (no
  encounter, visit, obs or stock movement), so Pharmacie (Rx) is the only Main Store and the
  Receipt form's destination. (#437)
- OCL release `uvl-drug-entry` 20261023-1 (sources `uvl-ciel` and `uvl-custom` 20261023 and
  20261023-3), which replaces 20261021-1. New `uvl-custom` concepts: the adjustment reasons Détérioré
  (`e25e1ab4-56c7-51c1-a35c-e0c2eece30ba`) and Cassé (`5f5f6f87-06e8-5af9-b6d0-a8d23443720d`),
  and the units Rouleau (`cb3566e8-0ba7-51a7-b468-719953d7bffa`), Ovule
  (`ad460f3a-0eec-54db-95a1-d358b8fa3a51`), Paire (`40af7514-27d1-59f7-8acf-e2a1b5f35065`) and
  Baxter, "Poche" as a synonym (`7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc`), members of the dosing
  units set. CIEL has no unit concept for a roll, a pair or an IV bag (only a generic Bag), so
  none is a CIEL clone. (#454)
- `uvl-custom` coded concept **Unités de stock / Stock units**
  (`d8ec6bbb-d988-5ce5-879a-6e3068aca253`), whose 21 answers are the stock units, and the stock
  app's `packingUnitsUUID` and `dispensingUnitsUUID` point at it. The stock app 3.2.1 lists a
  concept's answers, and the dosing units set they pointed at has set members only; it stays a set
  because order entry reads its members. The answers are the product owner's ten pack units plus
  every unit a stock item used on UAT on 2026-10-23: Aérosol, Application, Boîte, Conteneur,
  Goutte (gtt), Gramme, Milligramme, Millilitre, Sachets, Seringue and Suppositoire. A unit added
  to the catalogue later must be added to both. The `stockmanagement.*UnitsConceptId` global
  properties are unchanged: stockmanagement 2.1.2 declares them but never reads them. (#454)
- Liquibase `consumables_track_expiry-20261023` turns on `has_expiration` for the 38 consumable
  stock items of #437. (#454)
- OCL release `uvl-drugs` 20261023-1 (sources `uvl-ciel` and `uvl-custom` 20261023-2), which
  replaces 20261001 and adds twelve concepts; nothing else in the collection changes:
  - CIEL clones in `uvl-ciel` under CIEL's UUID, each with a SAME-AS mapping to CIEL in the
    source: Penicillin G / Pénicilline G (`81725AAAA…`, no mapping yet), Vecuronium / Vécuronium
    (`86144AAAA…`) and Denatured ethanol / Éthanol dénaturé (`74436AAAA…`, synonym Alcool dénaturé).
  - `uvl-custom` drugs: Febrilex Junior (`dc9b1284-9af3-5bf6-b649-d4d3336d8ffc`), Presept
    (`2528e3b8-5033-53c7-b903-6faae749cb87`), Auropent (`0959df36-5b51-5702-9069-dab6d6b8aa79`),
    Aurozole (`e3fa2473-5e92-5440-b61e-317ee0e963ea`), Predimax
    (`c038a409-1466-529b-8954-6ee295122733`).
  - `uvl-custom` medical supplies: Gel échographique (`e92664ff-a497-559d-bac6-03d8b24113c8`),
    Robinet à 3 voies (`98638538-715a-59bb-b392-4ef9cc8bf9ba`), Rouleau de gaze
    (`53e24daf-43a9-5b00-9605-68513cf9d2f3`), Sachets pour le conditionnement des MEG
    (`1a4719d4-f393-53f4-a095-926afd893f88`).
  Artésunate, Cefixime, Amoxicillin / clavulanate (Clavox), Cloxacillin, Cotrimoxazole and
  Salbutamol reuse their existing concepts. (#455)
- `drugs/uvl-drugs-issue455.csv`: 21 new drugs. Neuroba Comprimé 300mg was already in
  `uvl-drugs.csv` but never loaded, because its concept is in no OCL release; it now uses
  Gabapentin (`d315de65`), of which Neuroba is a synonym. (#455)
- Liquibase `add_stock_items_catalogue_alignment-20261023` (120 drugs) and
  `add_stock_items_new_drugs-20261023` (the 7 new ones): stock items, batch and expiry tracked, in
  the pack unit, built like those of #437. Each waits until its drugs and units exist.
  `add_stock_items_catalogue_new_items-20261023` does the same for the 15 created catalogue items.
  `sql/catalogue_alignment.csv` maps every catalogue line of sheet 1 and every prescribed drug of
  sheet 2 to its drug, final name and unit, and lists what was left out. (#455)
- Odoo `product_variant/uvl-drugs-issue455.csv`: a product for each of the 21 new drugs (Neuroba
  already had one), keyed `init.<drug uuid>` as the bridge looks them up, category
  `categ_products_drug_orders`, UoM the drug's dosage form, tracked by lot with expiry. No
  `lst_price` column, so each arrives at 1.00 for finance to price (#439). (#455)
- Liquibase `stock_item_units_sheet3-20261023`: the unit of 79 stock items of #437, from sheet 3.
  A packaging unit already used by a stock movement is not rewritten: the item gets a second one
  in the new unit. (#455)
- **Maternity and neonatology acts from the hospital price list can be ordered and billed.** 22
  acts of « TARIFICATION UVL » sections C « Actes de la maternité » and D « Actes de la
  néonatologie » (« Accouchement avec forceps », « Cerclage du col utérin », « Soins du
  nouveau-né », the newborn resuscitations, ...) are new Procedure concepts with a French and an
  English name, members of « All procedures », so the « Actes » order search offers them. 10
  tariff lines are 13 acts that already existed (GO401 delivery, GO101 caesarean, GO202 curettage,
  GO106 hysterectomy, the IUD acts, ...) and were not duplicated. Each new act has an Odoo
  product `init.<concept uuid>` in `product_variant/procedures-issue593.csv`, so an order reaches
  the quotation; no `lst_price` column, the UVL team enters the tariff prices in Odoo. Maternity
  drugs and lab tests are the pharmacy and laboratory catalogue items (product owner, 11 Nov
  2026). OCL: uvl-custom `20261112-acts-596-593`, collection `uvl-maternity-acts` `20261112`,
  shipped as `UVL_maternity_acts_593_20261112.zip`. (#593)
- **Theatre acts from the hospital price list can be ordered and billed.** 83 surgical and ENT acts
  of « TARIFICATION UVL » (section A.2 « Actes de chirurgie »: urology, digestive, orthopaedics,
  general, plastic and thyroid surgery; section B « Actes d'ORL ») are new Procedure concepts with
  a French and an English name, members of « All procedures », so the « Actes » order search offers
  them. 20 tariff lines are 19 acts that already existed (DIG101 appendectomy, ORT101 hip
  prosthesis, the circumcisions, ...) and were not duplicated. Each new act has an Odoo product
  `init.<concept uuid>` in `product_variant/procedures-issue596.csv`, so an order reaches the
  quotation; no `lst_price` column, the UVL team enters the tariff prices in Odoo. OCL: uvl-custom
  `20261112-acts-596-593`, collection `uvl-theatre-acts` `20261112`, shipped as
  `UVL_theatre_acts_596_20261112.zip`. The build now fails when an act the order search offers has
  no Odoo product (`scripts/check-procedure-billing.groovy`). Anaesthesia at 50% of the act, major
  or minor, and national codes are not part of this change. (#596)

### Changed
- **Doctor no longer holds `Delete Encounters`, `Delete Visits` or `Delete Observations`.** The
  product owner's decision: only administrators delete a saved consultation; clinical roles view and
  edit it. Initializer replaces a role's privileges from the CSV, so existing databases lose them at
  the next start. The build now fails if a Keycloak role other than System Developer holds an
  encounter, visit or observation delete or purge privilege. See Known issues: this alone doesn't
  hide the chart's delete action. (#510)
- **Gynaecology Ultrasound: presentation, amniotic fluid and placenta are asked per fetus.** For
  twins or triplets each baby can have its own presentation, sac and placenta, so the three
  questions are now in each fetus block (Fetus 1, 2, 3) and shown with it; a single pregnancy
  records them in Fetus 1. They keep their concepts and answers, and no OCL export changes. An
  ultrasound saved before this change keeps its per-pregnancy values: they show, locked and
  labelled "earlier record, whole pregnancy", only on a record that has them. The build now also
  fails on a member of a hidden-by-rule group whose own hide rule does not repeat the group's,
  which would show and save it while the block is hidden (`scripts/check-ampath-forms.groovy`).
  (#512)
- **The Pharmacist can request stock from the central store and receive it** at the dispensation:
  inherits `Inventory Dispensing` and `Stock Management Base Role`, and gets
  `Task: stockmanagement.stockoperations.mutate`, `...receiveitems` and
  `App: stockmanagement.userRoleScopes`. The last one lets the stock app read the pharmacist's own
  scope; without it the Operations page got a 403 and offered nothing to create. It is read-only:
  editing scopes stays with `Inventory Administrator`. Every existing privilege is kept, so
  dispensing (#374, #394) is unchanged. What each pharmacist may do, and where, is set by stock user
  role scopes (deploy note 14). The build now also fails on a Keycloak role that may create stock
  operations but cannot read its scopes. (#438)
- **Central Pharmacist no longer inherits Pharmacist**, so it can't dispense. It inherits
  `Inventory Manager` and holds directly the stock app privileges it used (stock items,
  `stockoperations.mutate`, `...approve`, `...receiveitems`, `App: stockmanagement.userRoleScopes`)
  and the read privileges it had through Pharmacist. It loses `Edit Medication Dispense`, the
  `Task: dispensing.*` privileges, `Task: stockmanagement.stockItems.dispense` and `...dispense.qty`,
  `Pharmacy`, `Dispensing Features`, `Edit Orders`, `Edit Encounters` and `Add Observations`. The
  build fails if Central Pharmacist gains a dispensing privilege again
  (`scripts/check-openmrs-roles.groovy`). The Pharmacist role is unchanged. (#453)
- Liquibase converts BP06 from Coded to LabSet and BP09 from Text to LabSet. It also removes the set
  members an earlier OCL release had shared between them, because the OCL import never removes
  members. Old results are kept. (#388)
- Dispensing: `restrictTotalQuantityDispensed: true` with `allowModifyingPrescription: false`. The
  Pharmacist gets `Task: dispensing.create.dispense.allowSubstitutions`. (#389)
- The basket failure title is O3's stock text again. The #359 override blamed an already-active
  drug for every failure, which was wrong. The "Déjà actif - utiliser Modifier" tag stays. (#364)
- The Pharmacist, X-Ray Technician and Lab Technician get `Get Queue Entries`. The Doctor,
  Ophtalmologist and Dentist get `Get ChargeItemDefinition` and `Get InventoryItem`. (#365)
- **Orthanc accepts DICOM only from the X-ray PC.** The PC is registered as `XMARUM` (its real AE
  title; the old entry said `XMARU` with a placeholder address) at its WireGuard tunnel address
  `10.66.0.2`. `DicomAlwaysAllowStore` and `DicomAlwaysAllowFind` are off, so storing and worklist
  queries need that AE title. The `FINDSCU` test entry is gone. The port itself is published only
  on the tunnel (LIME-EMR-Tooling `ede296b27`). (#372)
- French unit names: Bouteille becomes **Flacon** and Unité **Pièce** (the old names stay as
  synonyms), Gélule replaces the misspelt Gellule as the preferred name, and Tube gets its French
  name, and so does Application. Only the names change: the concepts keep their UUIDs, so drugs, stock items, orders and
  the Odoo units, which are matched by UUID, are unaffected. (#454)
- Drug names follow the catalogue for the 33 drugs the product owner named. A drug's name in
  OpenMRS is the **Odoo product name**: the Initializer writes the drugs CSV's `Name` column (not
  `Name:fr`) on load, and minutes later the `eip-odoo-openmrs` product synchronizer writes the
  Odoo product's name over it. So the new name is set in the Odoo `product_variant` CSVs (the
  product loader updates `name` on reload; only `lst_price` is `NO_UPDATE`, so no price changes)
  and in `Name` and `Name:fr` of the drugs CSVs, so both writers agree. The 21 new drugs get their
  French name in `Name` too. The drug UUIDs do not change, so orders, dispenses, stock items and
  the Odoo products keep pointing at the same drug. Fluditec's strengths read 5% and 2% (were
  0.05% and 0.02%), and Glibenclamide gets 5mg. (#455)

### Removed
- **The Odoo `product_price` loader and `prices.csv` (290 products).** Finance owns prices in Odoo;
  the file put them back to its own values whenever it changed or the Odoo checksums were cleared,
  as after every database restore. Every row already matched production and UAT, so no price
  changes on deploy. Products are still created from `product_variant/`, which sets `lst_price`
  only on creation; a new product without a price arrives at 1.00 and finance prices it. The rule
  is in `CONTRIBUTING.md`, and `scripts/check-odoo-prices.groovy` fails the build on a loader
  that would overwrite prices or a product row with an empty price. (#439)

### Fixed
- **A full OCL import is clean.** When OpenMRS imports every OCL export again (a fresh install, a
  restored volume, checksums cleared after a migration), the last five faults are gone: the drugs
  export's retired Chlorpheniramine gets the concept id the servers hold, the coded thick smear gets
  its own name ids (they were copies of « BP01 - Frottis paludéen »'s, so a new server failed on it
  and its 12 mappings), and three mappings are dropped (two diagnosis maps with no target, an
  immunization answer that CIEL has retired and no export carries, a repeated demo-queue set member
  with no id). Nothing changes on a running server. OCL: uvl-ciel 20261116-533.
  `UVL_labtests_533`, `UVL_dx_533`, `UVL_immunizations_533` and `UVL_demo_queue_533` (all
  `_20261116`) replace `UVL_labtests_20261105-5`, `UVL_dx_v4`, `UVL_immunizations_v2` and
  `OCL Demo Queue Concepts v4 Aug 8 2025`, each changed only in those items. `UVL_drugs_20261023-1`
  is removed with no replacement: `UVL_drugs_776_20261118` (#776) is the newer release of the same
  collection and already carries Chlorpheniramine with its id. `UVL_dx_533` also carries the six
  diagnoses renamed in #585 at the version of `UVL_dx_v4_585_20261112`: a running server imports a
  new export file once, and the May 2025 version of those six would have failed on their name ids
  or brought back the names with the retired codes. The build now fails on any of these faults
  (check 17). (#533)
- **Doctors can open the PACS (« Orthanc PACS » in the app menu) to view images.** Orthanc's
  authorization service grants PACS permissions only to the realm roles in
  `distro/configs/orthanc/permissions.json`, and doctors held only the `openmrs` client role
  `Doctor`, so Orthanc Explorer 2 refused them with a 403. `permissions.json` gains a `clinician`
  role with `view` only, and in Keycloak the `Doctor` role includes `clinician` (LIME-EMR-Tooling
  realm file and `keycloak-pacs-clinician-role.sh`; deploy note 23). Doctors can look at studies;
  they cannot download, modify, upload or reach the worklists. The chart's Imagerie card was not
  affected. (#563)
- **The Orthanc bridge no longer piles up failed patient events.** Its database watcher sends
  every change to `patient`, `person_name`, `person_address` and `patient_identifier` to
  `direct:orthanc-event-listener`, which had no consumer, so each patient edit failed with "No
  consumers available" and stayed in `openmrs_eip_mgt_orthanc.sender_retry_queue`, retried every
  30 minutes for ever (305 rows on UAT on 2026-11-06, 576 on the old production host on
  2026-10-23). The radiology flow polls OpenMRS and Orthanc on its own schedule and needs none of
  these events, so the bridge now acknowledges them and logs them at DEBUG only. Bridge jar from
  eip-openmrs-orthanc `63cfc1c` (jnsereko fork, on `11a85b6`); only the new route class differs
  from the previous jar. Existing rows: see deploy note 17. (#460)
- **The Auto Close Visits Task starts at 21:59:59 UTC.** Core's task starts at 23:59:59 and the
  database and containers run on UTC, so visits closed at 01:59:59 CAT. Liquibase changeset
  `auto_close_visits_task_cat_midnight-20261106` moves the time of day of `scheduler_task_config`
  "Auto Close Visits Task" (`AutoCloseVisitsTask`) to 21:59:59, only while it is still core's
  23:59:59. The scheduler reads it at OpenMRS start, after the Initializer, so the start that
  runs the changeset applies it. The containers' TZ is left on UTC on purpose. (#350)
- **Concept No (`d45102a2-d9b7-40dc-a30c-8e88494e1725`) has OCL's French names.** OpenMRS had
  « Faux » as the preferred French name and « Non » as an index term, with no French fully
  specified name; OCL (`uvl-ciel` 8918106) has « Non » fully specified and preferred, but the
  OCL import skips a concept already loaded at the same version. Changeset
  `concept_no_french_name_non-20261106` makes « Faux » a plain synonym and « Non » the fully
  specified, preferred name, by concept uuid and name text; it runs on every start and changes
  nothing once the names match. "Other non-coded" (`b5c4b807-…`) also has no French fully
  specified name, but OCL has none either and its preferred French name is already « Autre »,
  so it is unchanged. (#528, last item of #475)
- **Form validation messages follow the session language, and a number limit says "at most".**
  The form engine wrote "Field is mandatory", "Decimal values are not allowed for this field",
  "Value must be lower than 3" and the text-length and future-date messages in English whatever
  the language, and configuration could not reach them. They now go through the translations of
  `@openmrs/esm-form-engine-app`, so the French texts come from the frontend config's
  `Translation overrides`. A number limit is allowed, so the range messages now read "Value must
  be at most {{max}}" / "at least {{min}}" (« La valeur doit être au plus 3 »), for every number
  field with a `min` or `max`, not only the newborn count. `@openmrs/esm-form-engine-app` is now a
  patched build of 13.0.2-pre.12863 (`13.0.2-pre.12863.uvl.1`, in
  `distro/frontend/openmrs-esm-form-engine-app`), until openmrs/openmrs-esm-form-engine-lib#856
  and openmrs/openmrs-esm-patient-chart#3860 are released. (#499, #500)
- **The saved-encounter view shows answers in French.** The form engine's embedded view (Visits,
  expanded encounter) shows an answer's `label` from the form JSON untranslated, while the entry
  form translates it, so French entries read back as "No", "Yes" and so on. In the 15 forms that
  had them, the 705 answer labels the French translations turned into other words are changed:
  321 are removed where the concept's preferred names already read as the form did, in both
  French and English, so the engine shows the concept's own name in the session's language; the
  other 384 become the French text, and each form's English translations map that text back to
  the English one, so an English session still enters in English. The 103 labels that have no
  French translation are unchanged. `scripts/check-ampath-forms.groovy` gains check 8: an answer
  label the form's French translations turn into other words fails the build. The Initializer
  reloads the changed forms and English translations on their new checksums. (#528)
- **A patient chart opened by direct link no longer stays blank for several seconds.** The page
  asked for `importmap.json` and `routes.registry.json` under the chart's own address
  (`/openmrs/spa/patient/<uuid>/chart/importmap.json`), got a 404 and paused 4–9 s before
  recovering. The frontend build now writes both as `$SPA_PATH/...`, as the OpenMRS reference
  application does, and the frontend container resolves that to `/openmrs/spa/...` at start-up.
  The distro build fails if an Ozone update changes the build command and the rewrite stops
  applying. The slow opening of the childbirth record (~14 s) is a separate cause and stays open.
  (#519)
- **Midwives and nurses can open a patient chart without a 403 on program enrolments.** The
  chart's Programs widget reads `programenrollment`, which needs `Get Patient Programs`; only
  Doctor and the lab, pharmacy and imaging roles held it. It is now in "Register patients", which
  Help Nurse, Nurse, Midwife, Ophtalmologist, Dentist, Anesthesist and Doctor inherit. It is read
  only: enrolling, editing and removing stay with Doctor. The build now fails if a Keycloak role
  that can read patients cannot read their program enrolments. (#517)
- **Pharmacists can open Stock → Reports.** The page answered 403 for Pharmacist and Central
  Pharmacist. Both now inherit the stock module's `Inventory Reporting` role, which brings
  `App: stockmanagement.reports`, `Task: stockmanagement.reports.mutate` and `Manage
  Scheduler`; the last is needed because the stock module queues each report through the
  OpenMRS scheduler in the requesting user's session. The item, source, role-scope and settings
  pages of the stock app (3.3.1) are not tied to any privilege in the app, so a dispensing
  pharmacist still sees them; saving there stays refused, as Pharmacist has no
  `Task: stockmanagement.stockItems.mutate`. Hiding them would be a frontend display condition,
  not a role change. (#438)
- **The Help Nurse's patient summary no longer loops on drug orders, and clinical staff can read
  patient lists.** Help Nurse now has `Get Orders` and `Get Care Settings`: the medications
  widget filters orders by care setting, and without either it retried the 403 more than 100
  times a minute. Help Nurse also has `View Cohorts In Cohort Module`, which the Patient Lists
  page and the chart's patient-lists widget need to read `cohortm/cohort` and
  `cohortm/cohortmember`, and `Get Patient Cohorts`, the display condition the frontend config
  puts on the Patient Lists link and the chart's patient-lists widget. Nurse, Midwife, Doctor and
  the clinical roles built on Nurse inherit all of them through Help Nurse. Creating or changing a list still needs `Edit Cohorts In Cohort
  Module`, which no clinical role has. (#508)
- **The Pharmacist's order basket price and stock lookups no longer fail.** Pharmacist now has
  `Get ChargeItemDefinition` and `Get InventoryItem`, as Doctor already had. (#351, pharmacist
  part; the queue 403 was fixed earlier.)
- **« Administration du système » is no longer in the app menu of pharmacists and clinical
  staff.** `@openmrs/esm-system-admin-app` 4.6.1 ties its menu entry to no privilege, so every
  signed-in user saw it. The frontend config now shows it only with `View Administration
  Functions`, which only the administrator (System Developer) has; stock management keeps its own
  app-menu entry. The build fails if a Keycloak role other than System Developer is given that
  privilege.
- The build now fails if Help Nurse, Nurse, Midwife or Doctor cannot read drug orders and patient
  lists, if Pharmacist or Central Pharmacist cannot open stock reports, or if Pharmacist or
  Doctor cannot read the order basket lookups (`scripts/check-openmrs-roles.groovy`, check 9).
  Signed-in users get the new privileges at their next sign-in. (#438, #508, #351)
- **Cervical dilatation is a whole number from 1 to 10 cm** in the partograph reading, the
  maternity consultation and the childbirth record, as the product owner confirmed on 4 Nov 2026.
  4.5 is refused ("Decimal values are not allowed"), as are 0 and 11. This replaces the
  half-centimetre change of #488, which never reached production. The concept keeps allow-decimal
  in OCL (uvl-ciel 20261104; the uvl-forms 20261104-2 export replaces 20261104), so a value saved
  as a decimal on UAT still opens; saving that form again asks for a whole number. The partograph
  chart is unchanged. The other partograph readings (fetal heart rate, contractions, duration,
  oxytocin drops, pulse, blood pressure, descent in fifths) stay whole numbers. (#488, #511)
- **Form concepts have French names.** The 59 question and answer concepts of the UVL forms that
  had no French locale-preferred name now have one, so a French session shows them in French
  wherever OpenMRS shows the concept name (the encounter's observation list, results, visit
  summaries). Eleven of them were English or half English: "Post-procédure (External)" is now
  "Post-procédure (interne/externe)" and likewise for post-operative; "General exam" is "État
  général"; "GO302 - Episiotomy" and "GO108 - Myomectomy" are "GO302 - Épisiotomie" and "GO108 -
  Myomectomie"; "General patient note" is "Observations générales"; "Internal facility
  transfer/referral" is "Transfert interne"; artesunate and dihydroartemisinin-piperaquine are
  spelled in French. English names are unchanged. The names come from the requirements sheet
  (Release 1.1). OCL: uvl-ciel and uvl-custom 20261104-2; the uvl-forms 20261104-3 and
  uvl-vital-signs 20261104 exports replace uvl-forms 20261104-2 and uvl-vital-signs 20261001.
  The form's own read view (the expanded encounter row) showed the form's English answer labels
  until form engine app `13.0.2-pre.12863.uvl.5`. (#475)
- **Concept names read as the form does.** The forms requirements sheet (Release 1.1) is the
  source of truth for concept names. 305 question and answer concepts of the UVL forms take the
  sheet's label as their French name, so a French session shows the word staff chose in the form
  wherever OpenMRS shows the concept (results, the encounter's observation list, summaries):
  "Céphalique" instead of "présentation vertex", "Transverse" instead of the Haitian Creole
  fallback, "Siège", "Masque", "Urgences", "Pâles" instead of "Conjoctives pales", "AB-" instead
  of "AB negatif", "Hauteur utérine (cm)" instead of "Mesure ombilique (Symphsis pubien)". A
  concept labelled differently in several forms takes the label used most often; each form keeps
  its own label on screen. Where the sheet word is already another concept's French name, the
  name is qualified ("Anémie (antécédents)") and the sheet word is kept as a synonym; the old
  name is kept as a synonym too, so a search by it still finds the concept. Spelling faults of
  the sheet are fixed, not copied. English names are unchanged. Lab catalogue tests keep their
  catalogue names, and seven concepts that other exports also carry (procedures, drugs,
  allergens, immunizations, IPD) wait for those exports. The build now fails when a French
  name in the OCL exports differs from the sheet (`sites/mugamba/requirements/form-concept-names-fr.tsv`,
  `scripts/check-ampath-forms.groovy`). OCL: uvl-ciel and uvl-custom 20261105; the uvl-forms,
  uvl-vital-signs and uvl-labtests 20261105 exports replace uvl-forms 20261104-3,
  uvl-vital-signs 20261104 and uvl-labtests 20261008. The new uvl-labtests export also carries
  the "+", "++" and "+++" result answers at the version the forms export already ships, so the two
  exports no longer disagree on them. (#513)
- **Lab-test code mappings import again.** 68 mappings of the lab-test concepts to external codes
  (SNOMED CT, AMPATH, PIH, SNOMED-MVP, IMO) had lost their code system in a May 2025 OCL import.
  The OCL loader dropped each one ("ConceptSource.name" is null), so the lab tests had no
  SNOMED CT or other external codes in OpenMRS. Each mapping gets back the code system CIEL gives
  for the same code. Three codes CIEL no longer maps are retired. The "Unknown" answer of
  "Bacteria in urine test" pointed to an MSF concept that no export carries, so it never
  imported; it now uses the uvl-ciel "Unknown" concept. Lab results and orders are unchanged.
  OCL: uvl-ciel 20261105-1; the uvl-labtests 20261105-2 export replaces 20261105. The build now
  fails when an OCL export has a mapping with no target (`scripts/check-ampath-forms.groovy`).
  The drug entry and diagnosis exports still carry 128 such mappings from the same import,
  allowed by count until they are re-exported. (#520)
- **Lab tests and results read in French.** 19 lab-test concepts showed in English to a French
  session: the malaria rapid test answers ("Positif à Plasmodium falciparum", "… vivax", "… falciparum
  et vivax", "Examen non réalisé", "Examen non réalisé (manque de réactifs)"), the urine question
  "Cristaux de phosphates amorphes", "Arthritest", and the sets "Résultats de laboratoire" (the
  heading on the doctor's results page) and "Analyses de laboratoire". Ten more (stool microscopy,
  stool consistency, pus and mucus in stool, renal epithelial cells in urine) had a French name
  that was not marked preferred. English names are unchanged. The build now fails when a lab-test
  concept has no French preferred name (`scripts/check-ampath-forms.groovy`). (#531)
- **Searching "paludisme" or "goutte épaisse" finds the malaria smear.** The order basket matches
  every name of a test, and none of "BP01 - Frottis paludéen"'s names contained "paludisme". BP01
  gets the French synonyms "Paludisme - frottis" and "Goutte épaisse"; its displayed name and the
  Odoo catalogue name are unchanged. OCL: uvl-ciel 20261105-2, uvl-custom 20261105-1; the
  uvl-labtests 20261105-5 export replaces 20261105-2. (#532)
- **A full OCL import is cleaner.** When OpenMRS imports every OCL export again (a fresh install, or
  configuration checksums cleared after a migration), the drug entry and IPD exports logged 133
  failures (127 drug-entry mappings, 5 IPD mappings and 1 IPD concept). The 126 drug-entry mappings from the May 2025 import get back their code system
  (SNOMED CT, UCUM, FDA and HL7 routes, NCI, AMPATH, PIH), and 4 codes CIEL no longer maps are
  retired. "Medication frequency" lists an answer, "One time STAT", that is a CIEL concept no export
  carries, so that mapping is retired: order frequencies come from their own configuration and are
  unchanged. The IPD "Inpatient patient disposition" question had its own copy of "Internal
  facility transfer/referral", whose English name clashed with the concept the consultation forms
  use. It now offers that same concept ("Transfert interne"). OCL: uvl-ciel 20261105-3, uvl-custom
  20261105-2; `UVL_drug_entry_20261105` and `UVL_ipd_20261105-1` replace `UVL_drug_entry_20261023-1`
  and `UVL_ipd_v1_renamed`. Still failing on a full import, because their OCL collections no longer
  match what we ship: the procedures export (GO302 and GO108, older than the forms export), the
  drugs export (a retired Chlorpheniramine whose name id another concept has), one immunization
  answer, two diagnosis mappings and one mapping in the OCL demo queue export. (#533)
- **A drug order opens with "Jours" and works out the quantity.** The duration unit opened as "Days",
  which matched no option of the French list, so the doctor had to clear it. The quantity was never
  calculated, because the calculation only knew CIEL's unit uuids. The frontend config now gives the
  default unit as "Jours" and maps UVL's day, week, month and year units, so the quantity fills in
  from dose × frequency × duration; the doctor can still change it. (#536)
- **Drug order lists read in French.** Duration units (Secondes, Heures, Semaines, Nombre de fois,
  Années), dispensing units (Sac, Carton, Cartouche, Plaquette, Unité, Inhalateur, Kit), dose units
  (Gaufrette, Gallon, Compresse, Patch, and "Goutte métrique" and "Cuillère-mesure" instead of
  "Baisse métrique" and "Scoop") and the routes "Orale" and "Dans l'œil gauche" had English or odd
  names. OCL: uvl-ciel 20261105-4; `UVL_drug_entry_20261105-2` replaces `UVL_drug_entry_20261105`,
  names only. (#537)
- **The pharmacist sees why "Délivrer une prescription" is greyed out.** With stock dispensing on, the
  button stays disabled until a batch is chosen, and the screen didn't say so. The batch field now
  reads "Lot à délivrer (obligatoire)" with "Choisir un lot pour pouvoir délivrer" until one is
  picked. Dispensing 1.11.2 has no setting to pre-select a batch. (#538)
- **Drug lines on the Odoo quotation give the duration in French** ("5 jours", not "5 day"). The
  bridge took the unit from FHIR's fixed English display; the eip-odoo-openmrs jar now reads
  `ODOO_DURATION_UNIT_LABELS` (set for UVL in LIME-EMR-Tooling's `docker-compose-odoo-sso-uvl.yml`
  and in `scripts/docker/docker-compose-override.yml`). Lines already on a quotation keep their
  text. Bridge: jnsereko/eip-odoo-openmrs `fix/539-duration-labels` e420457, on 06151ac. (#539)
- **A second prescription of the same drug on one visit is billed.** Paracetamol prescribed and 10
  dispensed, then discontinued and prescribed again with 10 more dispensed, left one line of 10 on the
  quotation: the bridge kept one line per drug and skipped the repeat, and the discontinue removed the
  line even though the tablets had been given. The drug's line now bills every prescription of that
  drug in the visit: an active one its quantity to dispense (as before), a discontinued or revised one
  what was dispensed against it, nothing if nothing was. A prescription closed or paused with nothing
  dispensed is still not billed (#393), a syrup or cream is still one container per prescription
  (#385), and what a confirmed quotation of the visit already bills is not billed again (#434). A
  quantity the cashier raised by hand is not lowered by the next dispense. Bridge:
  jnsereko/eip-odoo-openmrs `fix/544-repeat-drug-billing` 8664102, on e420457. (#544)
- **The pharmacy shows the duration in French** ("pendant 5 jours", not "for 5 d"), on the
  prescription and the printout. (#541)
- **A second dispense suggests what is left, and a partial dispense says so.** Prescribed 5,
  dispensed 2: the next Dispense form pre-fills 3, not 5, and the prescription reads
  "Délivré partiellement 2/5" instead of "Délivré". (#394)
- **Vitals land in the visit they were recorded in, with their provider.** Vitals entered while
  logged in at another department than the visit's, or against a past visit chosen in the chart,
  were saved in no visit, and no vitals had a provider. They now carry the visit, a time inside it
  for a past visit, and the logged-in provider (Clinician role). Vitals saved before are not
  changed. (#347)
- These three come from patched builds of two upstream apps, kept in `distro/frontend` until
  OpenMRS releases the fixes: `@openmrs/esm-dispensing-app` 1.11.2-uvl.1 (1.11.2 plus
  openmrs/openmrs-esm-dispensing-app#954 and #955) and `@openmrs/esm-patient-vitals-app`
  13.0.2-pre.12863.uvl.1 (13.0.2-pre.12863 plus openmrs/openmrs-esm-patient-chart#3859).
- **Every X-ray takes a result.** The 22 body-part X-rays (« Radiographie du/de la … », #212) had
  datatype N/A, so they could be ordered and paid but the lab app refused their result with
  « Configuration d'analyse invalide ». Only RX01–RX07 and EC01–EC02 took one. The 22 now have
  datatype Text, like RX01, and the result is free text. Liquibase `xray_procedures_text_datatype-20261106`
  makes the same change, because the OCL import skips a datatype change on a concept that already
  has observations. OCL: uvl-custom 20261106; `UVL_procedures_20261106` replaces
  `UVL_procedures_20261001`. That export also brings the French names of GO302 « Épisiotomie » and
  GO108 « Myomectomie » (#475), which the full import reported as failing (#533). The "Imaging
  procedures" set stays in `concepts/imaging_procedures.csv`, and the d0b5d4a0 ultrasound, CT and
  echo concepts stay active, as in 20261001. The build now fails when a member of that set has
  datatype N/A in the OCL exports (`scripts/check-ampath-forms.groovy`). (#546)
- **The « Admission en service » form reads in French.** Its question names came from the concepts,
  which had English names only. New French names: « Décision d'hospitalisation » (Inpatient
  disposition construct), « Orientation du patient » (Inpatient patient disposition), « Admettre à
  l'hôpital », « Sortie de l'hôpital », « Admis au service », « Service de transfert interne » and
  « Décision d'admission » (the ward app's admission decision). English names are unchanged. OCL:
  uvl-ciel 20261106; `UVL_ipd_20261106` replaces `UVL_ipd_20261105-1`. The build's French-name check
  now also covers form questions given as `CIEL:nnn`, through the export concept mapped SAME-AS to
  that code. (#546)
- **A maternity form can no longer be saved for a male patient.** The seven maternity forms show
  only a "not applicable" note to a male patient, but Save still created an empty encounter that
  counted in encounter-based reports. The page now says "Ce formulaire concerne uniquement les
  patientes : ne pas enregistrer", and Save is refused with the same sentence under the field.
  Female patients are not affected. The build
  checks both faults on every form (`scripts/check-ampath-forms.groovy`). (#489)
- **On a fresh database, eight roles were never created:** Print Patient Label Sticker, Help Nurse,
  Nurse, Doctor, Midwife, Ophtalmologist, Dentist and Anesthesist. `roles_mugamba.csv` gives two of them
  `App: Can View Patient Identifier Sticker Report`, a privilege nothing in the distribution defined,
  and the rest inherit from those two. It is now in `mugamba-privileges.csv`. Existing databases (UAT,
  production) already have it and match it by name, so nothing is duplicated. (#433)
- **Local run only (`start.sh`): OpenMRS core 2.7.7 → 2.8.9.** The local compose pinned 2.7.7 while
  the distribution's modules need 2.8, so emrapi, attachments, openconceptlab and stockmanagement
  failed to start for volunteers and the O3 app didn't work. UAT and production are unaffected: they
  run the bundled image, built on `openmrs.version` 2.8.9. The local MariaDB also gets
  `--log-bin-trust-function-creators=1`, without which stockmanagement could not create its triggers
  and took Billing down with it. (#369, #423, #432)
- **Odoo: printing a customer invoice from "Send & Print" crashed** (#375). This is a database
  fix, not a code change: two views and two server actions left behind by the Odoo 17 migration.
  It was applied on UAT on 2026-10-07. **Production needs the same steps by hand; see the deploy
  notes.**
- Payer and dispensing answers were duplicated after the OCL import. Five X-ray procedures were
  never created because of a name clash. The X-ray billable services had no concept. (#366)
- **A paid X-ray reached the Orthanc worklist hours late, and the X-ray unit couldn't see it.**
  The Orthanc bridge read only the first 100 orders of its seven-day window, oldest first, so a new
  X-ray waited for older orders to age out: two paid on UAT reached the worklist 12 and 16 hours
  later. It now follows every page. Entries named the station `ORTHANC`; it is now
  `ORTHANC_WORKLIST_STATION_AET` (default `ORTHANC`), which the unit, `XMARUM`, filters on. X-rays
  were `XR`; they are now `DX`, as the unit encodes them (`ORTHANC_WORKLIST_XRAY_MODALITY`).
  Ultrasound and CT are unchanged. Bridge jar from eip-openmrs-orthanc `77ab760`. (#424)
- **A radiology report reached the chart as its title only, at midnight, on no order.** The bridge
  read only the SR's series description. It now reads the report's content (each annotation's label
  and measurements), files the result against the order matched by accession and that order's
  encounter, and sets the order's fulfiller status to `COMPLETED`. A report is also never filed
  twice: on UAT a 401 on a save that had succeeded left the report unmarked, and the next bridge
  start filed it again. The text is one line, because O3's Results tab drops line breaks, and is
  posted as UTF-8 (an em dash had been stored as `?`). It ends with "Reported by: <name>", read
  from the PACS audit log and Keycloak (needs #430 and deploy note 9). Bridge jar from
  eip-openmrs-orthanc `530c314` (jnsereko fork). (#427, #428, #429)
- **Anyone on the internet could upload into the PACS without signing in.** The
  orthancteam/orthanc-auth-service image's default anonymous profile grants `upload`, so a request
  with no token could `POST /instances` or STOW (reads and deletes were always refused). Ours now
  grants nothing. OHIF's report save had only worked through that hole: it sent the PACS UI's
  viewer instant link, which carries no user. OHIF's `app-config.js` now sends the signed-in
  user's own Keycloak token (kept by Orthanc Explorer 2 in localStorage) on every PACS request and
  refreshes it, so the user's PACS role decides. `upload` moves from `xray_technician` (images
  arrive over DICOM, which it doesn't cover) to `radiologist`. (#429, #430)
- **Billing bridge, #404 (eip-odoo-openmrs jar from jnsereko fork `0001068`, which contains #401's
  `28d1594`):**
  - A syrup or cream prescribed in mL, g, drops, applications or sprays is billed as one container,
    not once per millilitre. It needs `ODOO_PER_CONTAINER_UOMS` (LIME-EMR-Tooling `cfcd75cd7`). (#385)
  - A discontinued or undispensed order is removed from the draft quote instead of being invoiced.
    (#386, #401)
  - A repeat of an active lab test or procedure on the same visit raises the line quantity instead
    of being lost. (#360)
  - The radiology payment poll reads each order's visit once and logs what it is waiting for, instead
    of reprocessing the same orders every 32 seconds. (#316)
  - The X-Ray Technician's PACS 403 was fixed by the `xray_technician` role (#396). (#387)
  - **Dispensing after the visit's quote was confirmed billed the drugs a second time.** When the
    cashier took the X-ray payment first, every later dispense or pause found no draft quote and
    opened a new one holding the drugs again. A drug already on a confirmed sale order of the visit
    now gets no new line; a new prescription of the same drug is still billed. Jar from jnsereko
    fork `5ec0e3b`, on top of `0001068`. (#434, #435)
- **A role changed in Keycloak applies at the next sign-in, not the one after.** oauth2login 1.5.0
  saved the token's roles in a background thread and opened the session with the user it had
  loaded before that, so the first sign-in after a role change kept the old role's privileges.
  The distro now ships `oauth2login-1.5.0-uvl1.omod` from `distro/binaries/openmrs/modules`
  (1.5.0 plus the fix, jnsereko fork branch `uvl/1.5.0-roles-sync` `69191eb`). It replaces the
  stock 1.5.0 omod at build time. Upstream PR: openmrs/openmrs-module-oauth2login#36. Once a
  release carries the fix, delete the omod and raise `oauth2loginVersion`. (#476)
- **OpenMRS now empties `/openmrs/data/modules` before it copies the image's modules in.** The
  OpenMRS 2.8.x entrypoint meant to, but its `rm -fR "${OMRS_MODULES_DIR:?}/*"` quotes the glob
  and deletes nothing, the same defect #305 fixed for `configuration/`. So an omod renamed in the
  image stayed in the data volume beside the new one: on UAT the stock `oauth2login-1.5.0.omod`
  from the previous release was loaded instead of `oauth2login-1.5.0-uvl1.omod`.
  `scripts/bundled-docker/openmrs/patch-startup-init.sh` now patches the modules line too, at image
  build. Modules added to a volume by hand, not through this repo, are removed at the next start.
  (#476)
- **Staff can save their own language, default location and favourite orders again.** All three
  save the signed-in user's own user properties with `POST /ws/rest/v1/user/<uuid>`, which the REST
  module 3.5.0 saves as a whole user under `Edit Users`, and that privilege was taken off the
  clinical roles on purpose (#502), so each one ended in a 403. The distro now ships
  `webservices.rest-3.5.0-uvl1.omod` from `distro/binaries/openmrs/modules` (3.5.0 plus the fix,
  jnsereko fork branch `uvl/3.5.0-own-user-properties` `d0c230c`). A user without `Edit Users`
  who posts only `userProperties` to their own user has them saved through core's
  `UserService.saveUserProperties`; any other field, or another user, still needs `Edit Users`.
  Administrators are unaffected and the frontend is unchanged. It replaces the stock 3.5.0 omod at
  build time. Upstream PR: openmrs/openmrs-module-webservices.rest#778. Once a release carries the
  fix, delete the omod and raise `webservices.rest.version`. (#545, #524)
- **Stock operation buttons are computed on every request.** stockmanagement 2.1.2 kept each
  operation's permission flags (`canEdit`, `canApprove`, `canReceiveItems`,
  `isRequisitionAndCanIssueStock`, ...) in a per-thread map keyed by the operation uuid that was never
  cleared. A server thread that had seen an operation once answered every later request for it the
  same way, for any user and whatever its status had become, so the receiver of a dispatched Stock
  Issue lost "Complete dispatch" until OpenMRS restarted. The distro now ships
  `stockmanagement-2.1.2-uvl2.omod` from `distro/binaries/openmrs/modules`: the published 2.1.2 omod
  with `StockOperationResource` rebuilt without the cache, and `config.xml` at `2.1.2-uvl2`. Upstream
  `master` has the same cache, removed by O3-6248 (openmrs/openmrs-module-stockmanagement#57). (#447)
- **Creating or updating a stock operation is checked against the user's stock role scopes.**
  2.1.2 checks every action (submit, approve, reject, return, dispatch, complete, cancel) against
  the scopes, but create and update only against the global mutate privilege, so a Pharmacist scoped
  to one box created an Opening Stock at Pharmacie (Rx) through the API. The same omod's
  `StockOperationResource.save` now makes the actions' check: the scopes must give
  `Task: stockmanagement.stockoperations.mutate` for the operation's type at its location (the
  destination of a Receipt, otherwise the source; on update the stored location as well). A refusal
  is a 403 with the module's "You do not have permission..." message, and an action the scopes
  refuse is now a 403 too, where it was a 500. Holders of `Task: stockmanagement.userRoleScopes.mutate`
  (Inventory Administrator, System Developer) skip the create and update check. The module has no
  rule against approving an operation one created, and none is added: who may approve is who holds
  the approve privilege in scope. Every other file of the omod is the published 2.1.2 (jnsereko
  fork branch `uvl/2.1.2-scope-enforcement` `b23907a`, on top of `uvl/2.1.2-permission-cache`; the
  2.1.x source isn't public, so `StockOperationResource` and `StockOperationActionResource` were
  decompiled and only these fixes applied, see the branch's `uvl/2.1.2-uvl2/README.md`). It replaces
  the stock 2.1.2 omod at build time. Once UVL takes a stockmanagement release with both fixes,
  delete the omod. (#447)

### Deploy notes for production
1. Record the running image digests and take a database backup first.
2. Before deploying, check production's Liquibase changelog for module checksums that differ from
   the images. On 2026-09-30 billing-2.3.0 would not start until one was cleared.
3. Deploy with `--domain=uvl-emr.madiro.org` and `--image-prefix=globalmadiro/ozone-uvl-mugamba`.
4. **#375:** back up the Odoo database. Then in Odoo, `reset_arch(mode='hard')` views 1637 and
   653 and unbind `account.action_move_export_zip` and
   `account_edi_ubl_cii.action_group_ungroup_lines_by_tax`. Stop `eip-odoo-openmrs` and
   `fhir-odoo` during the change, then restart Odoo. Check that Send & Print opens.
5. In Odoo, archive the duplicate **Cefixime Comprimé 400mg, product 535**. Orders land on 609.
6. Once it's live, check that the three Liquibase changesets of #388 are `EXECUTED`, Payer has 8
   answers, and BP06 and BP09 show their structured fields.
7. **#424:** check the `eip-openmrs-orthanc` container has `ORTHANC_WORKLIST_STATION_AET=XMARUM`
   and `ORTHANC_WORKLIST_XRAY_MODALITY=DX` (LIME-EMR-Tooling `ede296b27` defaults both). Unset,
   entries are labelled `ORTHANC` and the X-ray unit sees none of them.
8. **#372, radiology tunnel:** before this release, set up WireGuard on the production host
   (`wg0` = `10.66.0.11`, UDP 51820 open in Azure's network rules too) so the env generator binds
   Orthanc's DICOM port to it. The X-ray PC keeps `10.66.0.2` in both tunnels, which is the address
   `orthanc.json` names, so the file is the same on UAT and production. Without `wg0`, DICOM binds
   loopback and the X-ray PC can't reach it, but nothing else is affected.
9. **#429, report author:** in Keycloak, give the `service-account-orthanc-service` user the
   `realm-management` client role **`view-users`** (Users → service-account-orthanc-service → Role
   mapping). The realm file has it, but `keycloak-apply-realm.sh` skips users that already exist.
   Without it reports are still filed, just without "Reported by". Audit logs are switched on in
   `orthanc.json` and need nothing else.
10. **#418 and #419:** run each PR's dry-run query on production first (UAT: 23 stool results, 6
    prescriptions); production's counts will differ. After the deploy, check both changesets are
    `EXECUTED` in `liquibasechangelog`.
11. **#417 needs #404's `ODOO_PER_CONTAINER_UOMS` live** in the `eip-odoo-openmrs` container, or a
    syrup prescribed as 10 mL bills 10 bottles at the new per-bottle price.
12. **New Scaleway host (78.232.45.125):** it is a fresh install, so after the data copy re-check
    notes 8 and 9 there (`wg0` 10.66.0.11 is already up) and give the radiology users their Keycloak
    roles: `radiologist` for whoever writes reports, `xray_technician` for the technician.
13. **#437, turning on stock deduction** (opening-count day, not at deploy): in
    `uvl-mugamba-frontend-config.json` set `@openmrs/esm-dispensing-app` →
    `"enableStockDispense": true`. Then the Pharmacist must pick a batch for every dispense, from
    stock at the session location. Do it only when both are true:
    - every drug that is prescribed is a stock item. Since #455 all 141 drugs prescribed on UAT in
      the 90 days to 21 Oct 2026 are. A drug without one has Dispense disabled, with no message.
    - the opening stock is counted at **each pharmacist's box** (Rx-DISP-1 to -3, #453), and each
      pharmacist dispenses logged in at their own box. A drug with no stock in that box cannot be
      dispensed there. Stock left at Rx-DISP itself can't be dispensed from a box, and Rx-DISP
      can't issue it (a Dispensary is not a Stock Issue source): count it into the boxes.
    Check the dispensing app's batch filter (`validateBatch`) on UAT before switching; see Known
    issues.
14. **#438, pharmacy stock roles:** run `keycloak-apply-realm.sh` so the `openmrs` client gets
    `Central Pharmacist` and `Inventory Administrator`. Give the central pharmacist
    `Central Pharmacist`, and the product owner `Inventory Administrator` alongside
    `System Developer`. After each pharmacist's first sign-in, the product owner creates their stock
    user role scopes, as listed in `sites/mugamba/configs/keycloak/users/staff-roster.example.csv`:
    one scope per person, because the Operations page reads only the first. Without a scope a
    pharmacist can still dispense but records no stock operation. Needs the stock locations of #437.
15. **#453, dispensing boxes:** the boxes and their stock parties are created in the first start;
    no second restart is needed. Check `pharmacy_dispensing_boxes_locations-20261023` and
    `pharmacy_dispensing_boxes_party-20261023` are both `EXECUTED`. Then, at
    run time, the product owner (`Inventory Administrator`):
    - edits the Central Pharmacist's stock scope to add the three boxes to its locations;
    - gives each dispensing pharmacist ONE scope, at their own box only, with Requisition,
      Stock Issue, Stock Take and Opening Stock, replacing any scope at Rx-DISP. Which box is whose is decided there, not in
      the configuration. See `staff-roster.example.csv`.
    Pharmacists then sign in at their box, not at Rx-DISP. No Keycloak change: the roles keep
    their names.
16. **#455, catalogue alignment:** the stock items and units need the drugs and the #454 units,
    which the Initializer loads after Liquibase. Restart OpenMRS once after the first start, then
    check that `add_stock_items_catalogue_alignment-20261023`, `add_stock_items_new_drugs-20261023`
    `stock_item_units_sheet3-20261023` and `add_stock_items_catalogue_new_items-20261023` are
    `EXECUTED`. Finance prices the 21 new Odoo products (they arrive at 1.00; the list is
    `product_variant/uvl-drugs-issue455.csv`). Stock items now count in pack units
    (Flacon, Ampoule...) while many prescriptions are written in millilitres or milligrams: before
    stock deduction goes on (note 13), the pharmacists must know to dispense in the pack unit.
17. **#460, Orthanc bridge retry rows:** the bridge's retry pass (2 minutes after start, then
    every 30 minutes) now delivers the old rows and removes them itself. To clear them at once, or
    if any are left an hour after the deploy, back up the table and delete only the rows of this
    fault, in the `mysql` container:
    ```sql
    -- backup first, from the host:
    -- docker exec <mysql> sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" openmrs_eip_mgt_orthanc sender_retry_queue' > sender_retry_queue-orthanc-$(date +%F).sql
    SELECT COUNT(*) FROM openmrs_eip_mgt_orthanc.sender_retry_queue
     WHERE destination = 'direct:orthanc-event-listener'
       AND exception_type = 'org.apache.camel.component.direct.DirectConsumerNotAvailableException';
    DELETE FROM openmrs_eip_mgt_orthanc.sender_retry_queue
     WHERE destination = 'direct:orthanc-event-listener'
       AND exception_type = 'org.apache.camel.component.direct.DirectConsumerNotAvailableException';
    ```
    Then check that no new `No consumers available on endpoint: direct://orthanc-event-listener`
    appears in the `eip-openmrs-orthanc` log after a patient is edited.
18. **#350, #528:** once it's live, check that `auto_close_visits_task_cat_midnight-20261106` is
    `EXECUTED` and the Auto Close Visits Task's `start_time` ends in `21:59:59`, and that concept
    No's French preferred, fully specified name is « Non ». Production stores the same core
    default and, being built from the same history, very likely the same concept drift.
19. **#476, oauth2login:** after the first start, check that the patched module replaced the stock
    one in the data volume:
    `docker exec <openmrs container> sh -c 'ls /openmrs/data/modules | grep oauth2login'` must show
    only `oauth2login-1.5.0-uvl1.omod`. If `oauth2login-1.5.0.omod` is also listed, the image was
    built without the startup patch: move that file out of the volume and restart OpenMRS.
20. **#545, REST module:** after the first start, the same check for `webservices.rest`:
    `docker exec <openmrs container> sh -c 'ls /openmrs/data/modules | grep webservices.rest'` must
    show only `webservices.rest-3.5.0-uvl1.omod`, and the OpenMRS log must show it started as
    version `3.5.0-uvl1.0`.
21. **#189, #219, #184, insurance plans.** In this order:
    1. The image must carry `insurance_coverage` **17.0.1.2.0** (UVL-Odoo-Addons, with the plan
       propagation and the flat supplement). An older addon has no `insurance_payer_code`: the
       bridge then bills every new quotation to the patient, with a note on each one.
    2. LIME-EMR-Tooling with `insurance_coverage` in the UVL `ADDONS` and the bridge's
       `ODOO_INSURANCE_*` settings. After the deploy, upgrade the module once if Odoo did not
       (`insurance_complementary_basis` must exist on `res.partner`).
    3. Check in Odoo, Contacts, that the 8 plans exist with their payer code, default coverage and
       basis (PNB: « Of the full line »). If `partner/insurance_plans.csv` loaded before the addon
       was installed, its checksum was recorded anyway: delete its checksum and restart Odoo.
    4. The bridge jar in this release is jnsereko/eip-odoo-openmrs `integration/m5-20261107`
       f297cfa: `feat/219-visit-payer-plans` 140e767 merged with `feat/246-inpatient-stay` 4d8855a,
       both on `fix/544-repeat-drug-billing` 8664102. Before 140e767, a payer with no plan made the
       bridge retry the order about once a second, forever (found on UAT 7 Nov 2026).
    5. After the deploy, start a visit with Payer « Assurance privée » and order one item: the
       quotation is created with no insurance plan and one French note; the eip-odoo-openmrs log
       has one WARN for that order and no repeating ERROR; `sender_retry_queue` stays empty and the
       patient's Odoo contact is not rewritten every second.
    6. OCL `UVL_registration_20261008.zip` replaces `20261007`: 5 new Payer/PNB answers and the
       « Payeur complémentaire » question. Check that Payer lists 12 answers.
    7. Patients whose Odoo record still has a discount pricelist keep it for self-paid visits;
       insured visits drop it automatically.
22. **#246, stay billing:** the `eip-odoo-openmrs` container must have
    `EIP_INPATIENT_STAY_ENABLED=true`, `EIP_INPATIENT_STAY_TIMEZONE=Africa/Bujumbura`,
    `EIP_INPATIENT_STAY_DEFAULT_PRODUCT` and `EIP_INPATIENT_STAY_LOCATION_TAG_PRODUCTS` (LIME-EMR-Tooling
    bundled overlay), and its log must show "Inpatient stays: N visit(s) checked" within the hour.
    The first run bills every admitted visit open or ended in the last 7 days, including stays
    admitted before this release: check those quotations before they are invoiced. The OpenMRS log
    must show "Auto close visits: N closed, M left open for admitted patients" after 23:59:59 CAT.
23. **#563, doctors' PACS access:** the realm file is only read on a first install, so on
    production run LIME-EMR-Tooling `Scripts/Bundled-Docker/scripts/keycloak-pacs-clinician-role.sh`
    (`PROJECT_NAME` set as for the other Keycloak scripts; `--dry-run` first). It creates the realm
    role `clinician` and makes the `openmrs` client role `Doctor` include it; it changes nothing on
    a second run. The role grants something only with this release's `orthanc-auth-service` image.
    Then a doctor's `/pacs/auth/user/profile` must list `"permissions": ["view"]`.
24. **#447, stock module:** after the first start, the same check for `stockmanagement`:
    `docker exec <openmrs container> sh -c 'ls /openmrs/data/modules | grep stockmanagement'` must
    show only `stockmanagement-2.1.2-uvl2.omod`, and the OpenMRS log must show it started as version
    `2.1.2-uvl2`. Billing must still start (it needs stockmanagement >= 1.4.0).
25. **#608, discharged patients' open visits:** after the deploy, run LIME-EMR-Tooling
    `e2e/prod-608-end-discharged-visits.sql` (local file, not in git) against the OpenMRS database,
    `@apply = 0` first. It ends the open visits whose latest Admission/Discharge is a Discharge, at
    the discharge. Visits with only a « Synthèse de sortie » are reported and ended only with
    `@include_summary = 1`. UAT, 12 Nov 2026 (read-only): 1 discharged visit open, 5 with a summary
    only, 4 still admitted, 148 Inpatient visits with no admission at all (not touched).
26. **#638, stock module:** after the first start, `docker exec <openmrs container> sh -c 'ls /openmrs/data/modules | grep stockmanagement'` must show only `stockmanagement-2.1.2-uvl3.omod`, and the OpenMRS log must show it started as version `2.1.2-uvl3`. If `stockmanagement-2.1.2-uvl2.omod` is still listed, move it out of the volume and restart OpenMRS: two stockmanagement omods are two modules. Then `GET /openmrs/ws/rest/v1/stockmanagement/stockoperation/<uuid>?v=full` of a completed Stock Issue gives each item's `quantityReceived` as in the operations list.
27. **#184, dressings and « Cathéter urinaire »:** before the deploy, check that production has nothing on « Cathéter urinaire » (drug `dd3959bc-7671-4e15-a2b5-ed12ecbc154b`, Odoo product `init.dd3959bc-…`): no active drug order, no stock item holding stock (OpenMRS `stockmgmt_stock_item` of that drug), no stock in Odoo, no line on an open quotation. UAT had none on 19 Nov 2026. If there is stock, move it to the right « Sonde urinaire » first; a stock item holding nothing is voided by hand in the stock app. Check also that no MFP coverage line for « Ophthalmologist consultation » or for the two new acts was entered by hand in Odoo: Odoo would reject the whole file. After the deploy, Finance enters the prices of « Pansement simple » and « Pansement complexe ou multiple » in Odoo (a new product is created at the placeholder price of 1 BIF); « Soins locaux » is retired only after that, in a later change.

### Known issues
- **The location picker greets the user by username (« Bienvenue Pacifique.Gahungu »).** The
  login app 11.0.0 writes `t('welcome')` followed by the session user's REST `display`, which
  webservices.rest builds from the username only; the name is outside the translated string, so no
  translation override or setting can change it. Showing the person's name needs a login-app
  change (`user.person.display`). (#603)
- **The Attachments card dates files « 03 — nov. — 2026 ».** The stock patient-attachments app
  formats with core `formatDate(..., { mode: 'wide' })`, which joins the parts with « — », and has
  no setting for it. The Imagerie card beside it is fixed. (#603)
- **CAM's coverage rate is a placeholder (0%).** No rate was given; finance sets it on the CAM
  plan in Odoo and in `partner/insurance_plans.csv` (a changed CSV reloads and would put back the
  value it holds). Per-product coverage (Didier's 70/30 product list) is still owed, so every plan
  pays its default rate on every product. (#184, #189)
- **« Assurance privée » and the old « Assurance complémentaire » are still on the Payer list**
  but have no plan, so their visits are billed to the patient with a note on the quotation.
  Retiring them needs an OCL release once the product owner confirms. (#189)
- **Clinical roles still see "Supprimer une consultation".** The patient chart shows the delete
  action to whoever may edit the encounter, and core voids an encounter under `Edit Encounters`;
  neither checks `Delete Encounters`. Removing the action needs a chart or server change. (#510)
- **Changing location shows a red "Privileges required: Edit Users" error for clinical staff
  whose account has a default location.** The location picker pre-ticks « Remember my location
  for future logins » for them. Unticking it removes the default and ticking it with another
  location saves a new one; both go through `POST /ws/rest/v1/user/<uuid>`, which saves the
  whole user and needs `Edit Users`, kept for the administrator since #502. Core has a
  no-privilege call for the user's own properties (`UserService.saveUserProperties`), but
  webservices.rest 3.5.0 doesn't expose it, so no smaller privilege helps. The session location
  still changes; only the remembered default fails. Fixing it needs either no administrator-set
  default location on clinical accounts, or a login-app or REST change.
- On the stock app's new user role scope form, `Inventory Administrator` gets a 403 from
  `GET /ws/rest/v1/role`, which needs `Manage Roles`. The form doesn't use the answer: its Role list
  shows the chosen user's own roles, so `Manage Roles` isn't granted. (#438)
- A Keycloak role change reaches OpenMRS only at the user's second sign-in. Until then the stock
  scope form lists no role for that user. (#438)
- The dispensing block is in the interface only; the server doesn't refuse an over-dispense. (#374)
- **The forms list offers every form on every visit type,** so a doctor on an inpatient visit
  is offered the UVL Outpatient Consultation Form. The forms app (esm-patient-forms-app
  13.0.2-pre.12863, and upstream `main`) has no visit-type setting: it hides a form only when it
  is unpublished, its name contains "component", or the user lacks its encounter type's edit
  privilege, and no backend module in the distro serves a list filtered by visit. (#518)
- **The Ozone encounter types stay in English** in a French session ("Vitals", "Visit Note",
  "Order", "Transfer Request"...). They are inherited, not UVL's; and the chart recognises a
  visit note by the English display "Visit Note", so translating that one would open its edit
  in the generic form workspace instead of the visit note. (#499)
- **About 150 products are still at 1.00:** #417 priced 205 of the 357, and the product
  owner left 82 rows of his sheet blank. HS26 and BP10 (#420) also start at 1.00. Some existing
  prices disagree with the tariff. (#270)
- Some orders arrive in Odoo cancelled and empty (#254).
- **Vitals are sometimes saved without a visit or provider** (1 of 1 on UAT on 2026-10-15, 2 of 3 on
  2026-10-08; seen since 2026-09-28). (#347)
- ~~When several orders are signed together, OpenMRS's own billing module can log "Duplicate entry …
  for key cashier_bill_receipt_number_idx".~~ Fixed by billing 2.4.0 (#840). Orders already left without a bill stay
  without one: `scripts/billing/orders-without-bill.sql` lists them. Odoo billing was unaffected.
- ~~**The first orders signed together after an OpenMRS start can miss their OpenMRS bill**~~ (« Cannot invoke
  …getGroupingType() because "this.model" is null » in the log). The billing module sets up its receipt
  number generator on first use with no lock (billing 2.3.0 to 2.5.0). Mitigated by `imagingpaymentgate`, which loads
  it at start-up (#846); the bug itself stays in billing until upstream releases a fix. Check after a start for the log line
  « (information) Receipt number generator warmed at start-up » (logged at WARN); if it is missing or says « not warmed », one single billable order placed
  after the start still loads the generator. Orders already left without a bill: `scripts/billing/orders-without-bill.sql`.
  Odoo billing is unaffected.
- **H. pylori and albuminuria** can be billed but not yet ordered or resulted: H. pylori's test method
  (serology or stool antigen) and the albuminuria result fields wait for the product owner. (#371)
- Vitals from the chart box are saved without a visit when the user's location differs from the
  visit's. This matters more now that the chart box is the only route for vitals. (#347)
- The order basket's price and stock rows are hidden, not fixed: fhir-odoo prices from Odoo's cost
  (0 on every product) and there is no stock yet. (#363)
- **Stock deduction is off** (`enableStockDispense: false`). With it on, on UAT on 2026-10-20 a drug
  with a stock item but no stock at Rx-DISP offered an empty "quantity 0" batch; choosing it saved
  the dispense, then the stock request failed with a 500. The dispense is saved before the stock
  request, so a failure leaves a dispense without a deduction. In dispensing app 1.11.1,
  `validateBatch` (default `true`) is the only filter: it hides zero-quantity batches, but also
  every batch when the prescription has no duration, or the item no expiry date (the 38
  consumables until #454 turned expiry on for them). (#437)
- **The server doesn't enforce stock scopes or self-approval**: on UAT on 2026-10-20 a pharmacist
  created an Opening Stock at Rx, outside her scope. Upstream. (#437)
- **Expiry dates are saved one day early** in browsers east of UTC (31/12 becomes 30/12): upstream
  stock app. Pharmacists should check the saved expiry. (#437)
- **Typing an expiry date blocks the save.** Use the date picker. (#437)
- **Stock app, saving a Receipt creates its batch at once.** Saving again, or a second draft with
  the same lot number and expiry, fails with a duplicate-batch error (500). Edit the draft you
  already saved, or delete it before starting a new one. Upstream stock app 3.2.1. (#437)
- **Stock app, opening a Stock Issue shows a red "Demande de stock associée Requise" message.**
  It is wrong: the issue saves without a requisition. Upstream stock app 3.2.1. (#437)
- **Stock app, some dialogs and messages are in English** in the French interface: upstream stock
  app 3.2.1 has no translation for them. (#437)
- **Stock app, a stock item's unit may show its English name** ("Unit" rather than "Pièce") in the
  item lists. stockmanagement 2.1.2 names units by any fully specified name, whatever the locale,
  so the English and the French name compete. The unit pickers are in French. Upstream. (#454)

---

## [2026-09-30] — `Production` · `main` `393f5b5` (release candidate `a218cae` + #357, #358, #359)

Merged to UVL-EMR `main`, UVL-Odoo-Addons `main` and LIME-EMR-Tooling `dev`, verified on UAT, and
checked on production by the product owner on 2026-09-30.

### Also in this deploy
- **Lab results accept decimals,** for example glucose 4.2. A guarded Liquibase change on 21 lab
  tests. (#354, #357)
- **The Pharmacist can dispense, pause and close.** This added the status mappings, the dispensing
  ValueSets, and the `Get Order Frequencies` and `Edit Orders` privileges. (#355, #358)
- Re-prescribing an already-active drug: the search tags it and disables Add. (#356, #359)

### Staff will notice
- **Starting a visit shows a Payer field** (Cash, Mobile Money, MFP, CAM, Other insurance). It is
  optional until the default payer is agreed (#327). Billing does not read it yet (#184, #189).
- **Billing staff can confirm a quotation, invoice it and take payment.** Before this they could
  only invoice orders an administrator had confirmed. (#331)
- **Nurses can save forms again.** Every form that records a provider failed for the Nurse role. (#335)
- **The imaging-gate screen is gone,** and lab results entry has its button back. Imaging results
  are entered from the patient chart → Orders. (#322, #337)

### Added
- **Down-payment fix for Odoo 17, UVL addon `uvl_sale_down_payment`.** The first down payment used
  to create a "Down payment" product tied to the company and on the Buy route, and after that Odoo
  failed to start on every boot. The addon creates the product with no company and no routes, and
  repairs one created earlier. (#346, UVL-Odoo-Addons #2; `ADDONS`: LIME-EMR-Tooling `a4ea10725`)
- **Odoo sign-in refuses a Keycloak user with no Odoo role,** instead of leaving them with no
  groups and a 500 on every page. New UVL addon `uvl_sso_user_roles`; it also archives any existing
  user left in that state. (#330, UVL-Odoo-Addons `8dbce13`)
- **Odoo health check that renders the login page** (`/web/login?oauth_error=2`), so a broken
  login no longer reports healthy. (#330, LIME-EMR-Tooling `a37aab385`)
- **Insurance set-up data now loads.** The site Liquibase changelog was named `uvl-liquibase.xml`,
  which the Initializer never reads, so none of it ever ran. Renamed to `liquibase.xml`, with guards
  so it is safe on a live database. It seeds the payment modes, 364 item prices and the Insurance
  Coverage Tier concepts, plus triggers that re-sync a patient to Odoo when their tier changes.
  (#189, #233, #231, #234; thanks to Isaac Maya)
- **Unpaid-imaging audit** in the Odoo bridge, hourly: `UNPAID IMAGING PERFORMED` and
  `ACCEPTED WITHOUT PAYMENT`. Report-only; it changes nothing. (#322)
- **One radiology concept list for both EIP bridges** (`RADIOLOGY_CONCEPT_UUIDS`; unset means the
  built-in 17). Ultrasound (EC01, EC02) is included, and the worklist modality comes from the
  concept: CT, US, otherwise XR. (#253, #304, #339)
- **Retrospective entry into a closed visit** (`rde` flag). It works from form-engine forms such as
  the UVL Outpatient Consultation Form; the encounter is dated at the visit's start. (#302)
- Odoo client roles declared in the Keycloak realm and assigned from the staff roster. The roster
  script now takes several Odoo roles per person, separated by `;`. (#331, LIME-EMR-Tooling
  `13f76aabd`, `ad323482e`)
- The build fails on a Liquibase changelog the Initializer would never run or Liquibase would
  reject. (#336)

### Fixed
- **Odoo `/web/login` returned 500** for SSO users with no Odoo role. (#330)
- **Ultrasound, CT and echo orders now reach billing and the worklist.** (#304)
- **The bridges' Task search now filters,** using `Task?based-on=ServiceRequest/<uuid>`. The old
  form was silently ignored and fetched every Task on every poll, which slowed production after
  the migration. (#301)
- **A paid down payment no longer releases an unpaid imaging order to the worklist.** Payment is
  read from the invoice that carries the order's own line. (#322)
- **OpenMRS config deleted from the repo is now removed from the volume at start.** Before this,
  a deleted file stayed live for good. (#305, #341)
- Billing could not confirm an order with a storable product (`stock.warehouse.orderpoint`) or open
  Create Invoice: billing staff now also hold `Sales / User: All Documents`. (#331, #349)
- The Pharmacist can read stock items (`App: stockmanagement.stockItems`). (#345, part of #283)
- Patient registration crashed for users flagged to change their password. (#319)
- Lab Technician could not sign in; the support roles got a read baseline; the remaining privileges
  were found by probing. (#325, #328, #329)
- BMI in vitals: the config key is `bodyMassIndexUuid`. (#326)
- The Odoo bridge no longer loses its Debezium offset on redeploy. (#303)
- Keycloak no longer wipes and re-imports its realm on every restart. (#272)
- UVL no longer requests a translations frontend config it doesn't ship; that was a 404 on every
  page. (#343, LIME-EMR-Tooling `c29a0d194`)

### Deploy notes for production
1. **Before deploying, run the #346 detector query on production and delete any rows it returns.**
   The addon can't rescue a database that already fails to boot.
2. Record the running image digests first. The `:dev` tag is overwritten on pull, so rollback
   needs them.
3. Deploy with `--branch=dev --image-prefix=globalmadiro/ozone-uvl-mugamba`.
4. **Re-run `keycloak-apply-users.sh`** with billing rows set to
   `Invoicing / Billing;Sales / User: All Documents`. No deploy step applies the roster.
5. Deleted OpenMRS config now disappears from the volume at start (#341). Anything added to
   production by hand, rather than through the repo, will be removed.

### Known issues
- **Imaging results can be entered for an unpaid order** from the chart, and the PACS viewer
  returns 403 for the X-Ray Technician. The worklist itself does wait for payment. (#322, M2)
- **A discontinued lab or imaging order stays on the quote,** so it is billed. Drug discontinues
  are removed correctly. (#254)
- **Vitals recorded at a department other than the visit's are not linked to the visit,** and the
  Vitals form can't enter into a closed visit. (#347) The Visit Note also ignores its date field
  when entering into a closed visit. (#302)
- **Visits auto-close at 02:00 CAT, not midnight** (the task runs at 23:59:59 UTC). (#350)
- The X-Ray Technician sees a queue error on their home page; the order basket makes failing price
  and stock lookups. (#351)
- Dispensing crashes on missing ValueSets. (M3, #283)
- Imaging tariffs are placeholders (1 BIF) until the fee schedule arrives.
- 31 staff hold Superset Admin and SENAITE Manager from the old realm file. (#348)
- The `insurance_coverage` Odoo addon is in the image but not installed, so #184 is still untested.

---

## [2026-09-09] — `Production`

Odoo 14 → 17 cut-over, 03:51–04:42 CAT, with everything held in UAT since July. All 452 tables
counted before and after; no data lost. Evidence and rollback runbook:
LIME-EMR-Tooling `restore-backups/prod-migration-2026-09-09/`. (#235, #236, #237, #265)

### Added
- **Radiology / PACS.** Full Orthanc and DICOM RIS integration. An OpenMRS radiology order now
  reaches the modality worklist; the OHIF viewer is served from `PACS_PUBLIC_URL`; Orthanc is
  behind Keycloak SSO. (#221, #223, #224, #226, #227, #228)
- **Inpatient (IPD).** Admission workflow, wards, bed management and discharge. Visit location
  tags added to all locations. (#203, #220)
- **New medications, products and medical procedures** added to the catalogue. (#212 via #213)
- **UVL `insurance_coverage` Odoo addon** shipped in the distro. (#184 via #217)

### Changed
- Outpatient consultation form optimised; questions moved to visit attribute types. (#211 via #215)
- Laboratory test concepts now come from **OCL release v2.5**, replacing a hand-patched zip.
- Ozone `alpha.15` config drift corrected — product catalogue, SSO provider claim, module versions.

### Fixed
- Numeric lab result concepts accept **decimal values** (Neutrophils, Lymphocytes). (#208 via #216)
- IPD admission form given a real UUID. (#220)
- Odoo unit-of-measure mappings for Mugamba (Bottle) and category XML-ID module prefix.
- Orthanc: EIP bridge jar that could not start; injected bearer header failing Orthanc
  authorization; worklist entries labelled with the modality AE title; `orthanc.json`
  placeholders resolved at container start.
- Build: OpenMRS parent POMs resolved from the OpenMRS repository. (#225)

### Notes on what "live" means here
- **Radiology / PACS** is deployed; its clinical go-live is milestone **M2, 29 Sep 2026**.
- The **`insurance_coverage`** addon is shipped in the image but not installed (see Known issues).
- Production has not been updated since; later fixes are in `[Unreleased]`.

---

## [2026-07-28] — `Analytics`

### Added
- Salesperson dimension on sale order lines, toward provider-level reporting. (#210)

### Changed
- Superset assets synchronised with the live instance export. (#210)

> Confirmed by the UVL team on 2026-08-05.

---

## [2026-07-14] — `Analytics`

### Added
- **Laboratory dashboard** with advanced date and period filters. (#210 via #214)
- Date filter on UVL Report V1.

---

## [2026-07-03] — `Analytics`

### Added
- Additional columns on the main dashboard. (#205)

### Changed
- Dashboard columns and labels **translated to French**. (#207)

### Fixed
- **Duplicate values in the patient ID column.** (#206)

> Confirmed working by the UVL team the same day: the ID bug is fixed and the French version is
> available.

---

## [2026-06-23] — `Production` · `Analytics`

### Added
- **Analytics stack** (Superset) added to UVL-EMR. (#181)
- Remaining external reference links in the Mugamba navigation menu. (#202)

---

## [2026-06-01] — `Production`

Production update applied and confirmed working by the UVL team.

### Fixed
- **Intermittent sync failures between OpenMRS and Odoo**, by upgrading `epi-odoo-openmrs`
  to 2.2.0. (#191 via #201)
- SSO redirection — Odoo auth provider reset to upstream; `post_logout_redirect_uri` added to
  the end-session endpoint.
- `Build all configurations and deploy` workflow; GitHub Actions moved to Node 24-compatible
  versions.

### Added
- **Bundled Docker** deployment approach. (#196 via #198)
- Nginx proxy; ability to push UVL Odoo and Keycloak images.

---

## Earlier — before 2026-05

Summarised rather than itemised; see the commit history for detail.

### Added
- OpenMRS upgraded to Reference Application **3.4.0** then **3.5.0**, adding **service queues**.
  (#173, #176)
- CIEL concepts cloned to the UVL CIEL source; OCL ZIPs updated. (#174)
- Main monthly and annual reports configured for UVL. (#169)

### Changed
- Default Reference Application roles removed and replaced with UVL roles; laboratory
  technician roles and privileges corrected. (#177, #179)
- OPD form questions moved to visit attribute types. (#178)

### Fixed
- Patient address no longer shown on the patient sticker. (#175)
- Duplicate visits. (#162)
- Insurance column. (#180)
- Miscellaneous French metadata translations. (#143)

---

## Maintaining this file

Add an entry in `## [Unreleased]` in the same pull request that makes the change. Use the
Keep a Changelog groups — `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security` —
and reference the issue or PR number.

When a deployment happens, rename `## [Unreleased]` to the deployment date and tag it with the
environment it reached. Start a fresh `## [Unreleased]` above it. Keeping the environment tag
honest is the point of this file: it is the difference between work being finished and work
being useful.
