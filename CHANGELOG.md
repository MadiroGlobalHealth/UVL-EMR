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

Merged to UVL-EMR `main` and verified on UAT. **Not in production.**

### Staff will notice
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
  The form's own read view (the expanded encounter row) still shows the form's English answer
  labels: see Known issues. (#475)
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

### Known issues
- **Clinical roles still see "Supprimer une consultation".** The patient chart shows the delete
  action to whoever may edit the encounter, and core voids an encounter under `Edit Encounters`;
  neither checks `Delete Encounters`. Removing the action needs a chart or server change. (#510)
- On the stock app's new user role scope form, `Inventory Administrator` gets a 403 from
  `GET /ws/rest/v1/role`, which needs `Manage Roles`. The form doesn't use the answer: its Role list
  shows the chosen user's own roles, so `Manage Roles` isn't granted. (#438)
- A Keycloak role change reaches OpenMRS only at the user's second sign-in. Until then the stock
  scope form lists no role for that user. (#438)
- The dispensing block is in the interface only; the server doesn't refuse an over-dispense. (#374)
- **A saved form's read view shows coded answers in English in a French session.** With the
  `enable-embedded-form-view` flag on, the expanded encounter row renders the form, and
  form-engine-lib (5.0.1-pre.2754, in esm-form-engine-app 13.0.2-pre.12863, and upstream `main`)
  prints the answer's raw English `label` without translating it, while the question label is
  translated. The concept names don't reach this view. It needs a form-engine fix. (#475)
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
- When several orders are signed together, OpenMRS's own billing module can log "Duplicate entry …
  for key cashier_bill_receipt_number_idx". Odoo billing is unaffected.
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
- **Stock app, the receiver's "Complete dispatch" may not show** for a dispatched Stock Issue. The
  operations list takes each operation's buttons from a permission cache in stockmanagement 2.1.2
  that is kept per server thread, keyed by the operation only, and never cleared. A thread that saw
  the issue before it was dispatched, or for another user, keeps those buttons. Opening the issue
  on its own gets fresh values. The approved requisition's "Issue stock" action is hidden the same
  way, so Rx issues without a requisition (above). No role or scope changes it; it needs a module
  fix. (#437)
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
