# End-to-end patient-journey suite — flow specification

Status: **draft.** The design rules, the pre-flight checks and the platform facts below are verified
against Mugamba production on 2026-09-13. The journey steps are skeletons — they are waiting on
Didier's description of how the work actually happens, requested 2026-09-13.

## Why this exists

Two failures took Mugamba's outpatient consultation down, and neither was visible in any log until a
clinician reported it. No consultation saved between 2026-09-09 and 2026-09-13 — ten saved on 09-08,
zero on 09-10, 09-11 and 09-12, zero on 09-13 until the fix.

**Incident 1 — a missing concept.** Saving the consultation failed with:

```
Erreur lors de l'enregistrement de la consultation
[obs on class org.openmrs.Encounter => value on class org.openmrs.Obs]
```

The question `Antecedents` (id `antecedents`, rendering `textarea`) on *UVL Outpatient Consultation
Form* referenced concept `e55584c3-ac3d-4a43-a3e2-98602602159f`, which did not exist in the
dictionary — 1 of the form's 1,285 concept references. The field is **optional**: left empty the form
saved fine, filled in it failed.

**Incident 2 — a vanished role.** Starting a visit failed with:

```
Error starting visit
[attributes on class org.openmrs.Visit => Privileges required: Get Concept Attribute Types]
```

The Keycloak `openmrs` client had lost its `Nurse` role, so nurses authenticated with **no OpenMRS
roles at all**.

Both would have passed a suite that logged in as an administrator and filled only the required
fields. That is what shapes the rules below.

## How this runs

Two halves, deliberately different in kind.

**The pre-flight checks are a script.** `e2e/preflight.py` runs on the Docker host straight after a
deploy to UAT. Read-only, no browser, a few seconds. It is deterministic and it gates: non-zero exit
means the journeys do not run and the build does not go further.

**The journeys are driven by Claude in Cowork**, against the real UI, signed in as a real clinical
user. `e2e/cowork-task.md` is the task: save it in Cowork, give it a `DOMAIN`, run it after a
deploy. The steps are written as instructions to follow and check, not as selectors — the point is
to exercise what a nurse actually does and to notice anything wrong on the way past, which is
precisely what a suite pinned to selectors does not do. It ends with a single `VERDICT PASS|FAIL`.

That split is intentional. The mechanical invariants — does every concept resolve, does every role
hold its privileges — are cheap, exact, and belong in code. The judgement — did the chart look right,
did the bill show the correct amount, was the error message comprehensible — is the part worth a
reader.

```
deploy to UAT
   └─ ./e2e/preflight.py --domain <domain>    gate: non-zero stops everything
        └─ Cowork task, journeys A-F          Claude in the browser, as a nurse
             └─ VERDICT PASS | FAIL           plus anything that looked wrong
```

Production gets Step 0 only — the pre-flight, as a post-deploy smoke test. No journeys.

### Reaching a site by domain

The checks read the databases through `docker exec`, so a domain has to be resolved to the host
carrying its stack. That mapping lives in `e2e/sites.json`, which is **untracked on purpose** —
copy `sites.example.json` and fill it in, or pass `--ssh` and `--project` and keep no file at all.
Host addresses and login names do not belong in this repository.

## Design rules

1. **Log in as each real role.** Never as `System Developer` or `admin`. Every failure above was
   role-specific and a privileged session hides all of them.
2. **Fill every field, including optional ones.** Incident 1 only appeared when an optional field was
   filled. A happy path that skips optional fields is not a test of the form.
3. **Assert downstream, not just the toast.** A green message means the request returned 200. Check
   the encounter exists, the order reached the queue, the bill reached Odoo.
4. **Run the pre-flight checks first.** They are static, need no browser, take seconds, and would
   have caught incident 1 on 09-09 rather than 09-13.
5. **LIVE journeys gate the deploy. PLANNED journeys run warn-only** until the feature ships, so new
   work never silently breaks what the ward already depends on.

## Platform facts the suite must respect

Verified on production, 2026-09-13.

### Authentication

- SSO through Keycloak realm `ozone`, client `openmrs`.
- OpenMRS takes a user's roles from the `roles` claim and **overwrites them at every login**
  (`oauth2.properties`: `openmrs.mapping.user.roles=roles`). Keycloak is the source of truth; the
  `user_role` table is a cache that only refreshes when the user signs in.
- **HTTP Basic auth does not work.** OpenMRS user 1 has an empty `username` (its `system_id` is
  `admin`), so `-u admin:…` authenticates as nobody and returns `{"authenticated":false}`.
- Machine checks authenticate with `client_credentials` against Keycloak client `eip`, which resolves
  to OpenMRS user `service-account-eip` (holds `System developer`). Use this for the pre-flight
  checks — never for the browser journeys, since it would mask every role problem.

### Keycloak `openmrs` client roles

```
Anonymous              Inpatient Consultant   Outpatient Consultant   Register patients
Doctor                 Lab Technician         Print Patient Label Sticker
Help Nurse             Nurse                  System Developer
```

These names must match OpenMRS role names exactly — the mapping is by name.

### Role reality

`Nurse` effectively resolves to `Nurse + Help Nurse + Print Patient Label Sticker + Register patients`
through `role_role` inheritance, which is where it picks up `Get Concept Attribute Types`,
`Get Concepts`, `Add Encounters`, `Add Visits` and `Edit Observations`.

Two gaps are open at the time of writing, and the suite should assert them as **known failures**
until they are fixed, so that fixing them is what turns the test green:

- `Nurse` does not hold `Add Orders` — a nurse cannot create an order.
- `App: stockmanagement.stockItems` is held only by `Inventory Provider Access` and
  `Stock Management Base Role` — **not by `Doctor` either**. `GenerateBillFromOrderAdvice` demands it
  while intercepting order creation, so order-creating consultations fail regardless of who is signed in.

### Forms

| form | questions | concept refs |
|---|---|---|
| UVL Outpatient Consultation Form | 35 | 1,285 |
| UVL Inpatient Consultation Form | 10 | 1,208 |
| Ward Admission | 3 | 4, via `CIEL:` mappings not UUIDs |

Ward Admission references concepts as `CIEL:168619` / `169402` / `169403` / `169405`. Any checker
must resolve those through `concept_reference_term`, not `concept.uuid`, or it will report false
positives.

## Pre-flight checks — `e2e/preflight.py`

Static, no browser, run on the Docker host after a deploy and before the journeys.

| id | check | catches |
|---|---|---|
| P1 | every question and answer concept in every deployed form resolves, and is not retired | incident 1 |
| P2 | each question's `rendering` matches its concept datatype — `radio`/`select`/`multiCheckbox` need `Coded`, `textarea`/`text` need `Text`, `numeric` needs `Numeric`, `group` needs a concept set | the same error signature as incident 1, without the concept being absent |
| P3 | each clinical role holds the privileges its journey needs, resolved **through `role_role` inheritance and the implicit `Authenticated` role** | incident 2 |
| P4 | the Keycloak `openmrs` client still has every expected role, and every enabled human user maps to one | incident 2 |
| P5 | every concept reference in the frontend config resolves | a misconfigured vitals or allergies panel |

P4 is the one that matters most and is easiest to forget: nothing in OpenMRS notices that a Keycloak
role has disappeared. The users simply arrive with no privileges.

```
./e2e/preflight.py --domain uvl-emr-uat.madiro.org     # resolved via e2e/sites.json
./e2e/preflight.py --domain ... --json                 # machine-readable verdict
./e2e/preflight.py --ssh ubuntu@host --ssh-port 2222   # explicit, no sites.json
./e2e/preflight.py --only P1,P4
./e2e/preflight.py --strict                            # known gaps fail too
```

Exit `0` all good, `1` a check failed, `2` could not run. `--json` emits
`{domain, verdict, failed_checks, known_gaps, checks[]}` so a task can read the verdict without
parsing the report.

Two subtleties worth knowing before editing it, because both produced false results on the first run:

- OpenMRS grants **`Authenticated`** to every signed-in user on top of their own roles. A closure
  over `role_role` alone reports `Get Concept Datatypes` and `Get Locations` as missing when in fact
  every user holds them.
- Ward Admission references its concepts as **`CIEL:169402`-style mappings, not UUIDs**. Resolution
  has to go through `concept_reference_term`, or every one of them reads as absent.

Gaps in `KNOWN_GAPS` are reported loudly but do not fail the build, so that the suite is green on a
healthy system and fixing a gap is what removes the line. Delete the entry when you fix it.

### First run, 2026-09-13

Against **production**: all five pass, exit 0 — which is the calibration that matters. A gate that
fails on a healthy system gets ignored.

Against **UAT**: exit 1, and it reproduced both of the day's incidents unprompted.

```
FAIL P1  UVL Outpatient Consultation Form: question 'Antecedents'
         -> e55584c3-... DOES NOT EXIST
FAIL P3  Nurse is missing 'Get Concept Attribute Types'
```

Both are real. UAT has drifted from production: the `Antecedents` concept was created on production
on 09-13 but not on UAT, and UAT's `Nurse` role does not inherit `Get Concept Attribute Types` the
way production's does. **UAT currently does not predict production** — worth fixing before the
journeys are trusted there.

## Journeys

Steps are numbered so journeys B–F can reference A rather than repeat it.

Filled in from the test-case document `OpenMRS_Odoo_Test_Cases_AF.docx`, received 2026-09-17. The
`status` column is that document's own assessment, carried over unchanged:

| status | meaning |
|---|---|
| `Existing` | the step works today and the suite should hold it there |
| `To build` | the behaviour asserted does not exist yet — the test is the specification |
| `Critical — must test both paths` | a known past defect; both the positive and the negative case must be asserted |
| `.PLANNED` | not in use at Mugamba yet; comes with M3 inpatient, M4 maternity, M5 theatre |

Roughly half of these steps assert behaviour that has not been built. That is deliberate: written
this way the table doubles as the acceptance criteria for #184, #189, #219 and the pharmacy and
imaging work, and a run that goes green means the feature is genuinely finished.

One role in journey B does not exist yet in Keycloak or OpenMRS — the **insurance/mutuelle counter
clerk**, who verifies eligibility before a visit proceeds. It is not among the five roles added in
#244, so it needs deciding before B can run.

Each row is an instruction Claude follows in the browser and then checks. Write the assertion as
something observable, not as a selector — "the consultation appears in the patient history with
today's date", not `[data-testid=...]`. If a step cannot be checked by looking, it belongs in the
pre-flight script instead.

### A. Outpatient consultation, paying patient — arrival to departure

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| A1 | Receptionist / Help Nurse | Register patient | Patient demographics (name, DOB, sex, address, phone) | Patient record is created with a unique patient ID; no visit or payer is attached yet | Existing |
| A2 | Receptionist / Help Nurse | Add visit | Visit type = Outpatient; Payer = Cash (100%) | Visit is created and attached to the patient; payer attribute = 100% cash payer, so every downstream order is priced at full tariff | Existing |
| A3 | Nurse | Vitals signs | Weight, height, blood pressure, temperature, pulse | Vitals are saved to the visit and are visible on the doctor's home screen before the consultation starts | Existing |
| A4 | Doctor | Home screen → Consult vitals → Patient info → Visit info → Clinical form (outpatient form) | History, exam findings, diagnosis | The outpatient encounter form saves correctly and is linked to the visit; vitals, patient info and visit info are all readable from this screen | Existing |
| A5 | Doctor | Order basket | Prescriptions, lab tests, procedures | Each order line is priced at 100% of tariff (no discount, no coverage split) because the visit payer is Cash | Existing |
| A6 | Lab technician | Laboratory form | Receives requested tests, enters results | Order status moves to Completed once results are entered; results are visible to the doctor on the same encounter | Existing |
| A7 | Pharmacist | Pharmacy dispenser | Consults ordered prescriptions, dispenses medicines | Dispensed items are decremented from stock and appear as full-price invoice lines | To build |
| A8 | Cashier (Odoo) | Odoo — consult commands from OpenMRS / create invoice | Pulls all billable lines (consultation, labs, procedures, medicines) for the visit | Invoice total = 100% of the sum of every line; visit is marked Paid and closed only once the full amount is collected — this is the patient's departure point | To build |

### B. Outpatient consultation, insured patient (MFP / CAM)

Only the steps that differ from A. Related tickets: #184 insurance per product, #189 100% payer,
#219 explicit insurance coverage.

| replaces | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| replaces A2 | Receptionist | Add visit | Payer = MFP or CAM; insurance/member number; plan or beneficiary category | Visit is created with payer = the selected insurance scheme, not Cash; the coverage that applies is shown explicitly on screen, not just computed silently in the background (#219 — explicit insurance coverage) | To build |
| new — inserted after A2 | Insurance/Mutuelle counter clerk (new role) | Verify insurance eligibility (new screen) | Card/member number, validity date, remaining ceiling | Card is validated before the visit proceeds; an invalid or expired card blocks progression to vitals/consultation rather than silently defaulting to full coverage or 100% cash | To build |
| replaces A5 | Doctor | Order basket | Prescriptions, lab tests, procedures | Each order line is priced using the coverage rate defined for that specific product/category (consultation, medicine, lab test, procedure), not a single blanket rate for the whole visit (#184 — insurance per product) | To build |
| replaces A8 | Cashier (Odoo) | Odoo — consult commands from OpenMRS / create invoice | Pulls all billable lines for the visit | Invoice splits each line into patient co-pay and insurer share per the per-product rate; the system distinguishes this invoice from a 100%-payer invoice so a cash patient can never be billed as insured or vice-versa (#189 — 100% payer); the co-pay percentage actually applied is shown on the receipt, not just an aggregate total (#219) | To build |

### C. Consultation with a lab test

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| C1 | Doctor | Order basket → order lab tests | Test type(s), priority/urgency | Order is created with status = Requested and appears in the lab technician's queue | Existing |
| C2 | Lab technician | Laboratory form | Receives the order, enters results | Result is saved and linked to the originating order/encounter; order status changes to Completed | Existing |
| C3 | Doctor | Consult results → edit form / edit order | Reviews result, updates diagnosis/prescription if needed | Completed result is visible to the doctor on the same visit; the doctor can finalize the encounter based on it | Existing |

### D. Consultation with an X-ray or ultrasound

Must cover the payment gate explicitly. A past defect let one paid invoice authorise every imaging
order for every patient, because OpenMRS silently ignores unsupported search filters — so assert that
an **unpaid** order is refused, not only that a paid one succeeds.

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| D1 | Doctor | Order basket → order imaging (X-ray / ultrasound) | Exam type, body part, priority | Order is created with status = Pending payment; the exam cannot be performed until this order is explicitly marked paid | To build |
| D2 | Cashier (Odoo) | Odoo — imaging invoice | Creates and collects payment for this specific imaging order | Payment is recorded against this exact patient ID + order/service ID, not just "a paid invoice exists"; the payment-status query filters on both patient and order explicitly | To build |
| D3 | X-Ray / Imaging technician | Radiology / imaging form | Attempts to open and perform the requested exam | POSITIVE: with a valid payment on this order, the exam opens normally. NEGATIVE (regression for the past defect): if this order is unpaid, the technician is explicitly refused — the system must not fall back to "any paid invoice found" when a search filter it doesn't support is silently ignored. Also assert a paid invoice for one patient/order does NOT authorise imaging for a different patient or a different order of the same patient. | Critical — must test both paths |

### E. Consultation with medicines dispensed

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| E1 | Doctor | Order basket → order prescriptions | Medicine, dosage, quantity, duration | Prescription order is created, linked to the encounter, and carries the visit's payer type | To build |
| E2 | Pharmacist | Pharmacy dispenser | Consults ordered prescriptions | Pharmacist sees each medicine priced according to the visit's payer (100% cash or the applicable insurance co-pay) | To build |
| E3 | Pharmacist / Cashier | Pharmacy dispenser → dispense; Odoo invoice line | Dispenses the medicine; invoice line generated or updated | Stock is decremented on dispensing; the invoice line reflects the correct patient/insurer split for that medicine | To build |

### F. Admission to a ward

Uses *Ward Admission* and *UVL Inpatient Consultation Form*. Confirm with Didier whether staff do
this today; if not the whole journey is `PLANNED`.

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| F1 | Doctor | Ward Admission | Admission order, ward/bed assignment | Patient status changes to Inpatient; an admission encounter is created and linked to the outpatient visit | .PLANNED |
| F2 | Ward nurse | UVL Inpatient Consultation Form | Inpatient vitals, care plan, daily notes | Inpatient encounter is recorded and linked to the admission | .PLANNED |
| F3 | Doctor / Ward nurse | Ward round / discharge form | Discharge summary, discharge date | Patient is discharged; a hospitalisation invoice is triggered in Odoo covering the full stay | .PLANNED |

## Regression cases

Derived from real incidents. These must never go green for the wrong reason.

| id | case | expected |
|---|---|---|
| R1 | save the outpatient consultation with **every** field filled, including `Antecedents`, as a user holding only `Nurse` | saves; encounter of type `Outpatient Consultation` exists |
| R2 | start a visit as a user holding only `Nurse` | visit starts, no `Privileges required` error |
| R3 | remove the `Nurse` role from the Keycloak `openmrs` client in UAT, sign in, attempt R2 | P4 fails **before** the browser suite runs |
| R4 | add a form question pointing at a non-existent concept in UAT | P1 fails |
| R5 | create an order from a consultation as each clinical role | currently fails — see the two open role gaps above |

## Environments

- **UAT** `uvl-emr-uat.madiro.org` — where this runs. Pre-flight after every deploy, then the full
  set of journeys, including anything that writes to billing.
- **Production** `uvl-emr.madiro.org` — pre-flight checks P1–P5 only, as a post-deploy smoke test.
  No journeys. Nothing that creates a real bill, a real insurance claim or a real prescription:
  the FBP contract pays on monthly-verified volume, so synthetic encounters on production are not
  harmless.

The two environments have already drifted — see the first-run results above. Until UAT matches
production, a green run on UAT is weaker evidence than it looks, and the production pre-flight is
what actually protects the ward.

Pending Didier's confirmation: whether a permanent, obviously-fake test patient may exist on
production at all, or only in UAT.

## Still needed from Didier

1. ~~The step tables above, journeys A–F.~~ Received 2026-09-17.
2. Confirmation that journey F (ward admission) is not performed at Mugamba today — the test-case
   document marks it `.PLANNED` but asks for this to be confirmed.
3. Whether the insurance/mutuelle counter clerk in journey B is a role that should exist, and who
   holds it.
4. Which fields staff fill `[always]` / `[often]` / `[rare]` — this decides which failures stop a
   deploy and which only warn. The suite fills everything regardless.
5. A username per role for testing.
6. Whether a permanent test patient on production is acceptable.
7. Which steps must never run automatically against production.
