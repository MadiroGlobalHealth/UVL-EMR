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

## Pre-flight checks

Static, no browser, run before the journeys and before a deploy is allowed to proceed.

| id | check | catches |
|---|---|---|
| P1 | every question and answer concept in every form resolves, and is not retired | incident 1 |
| P2 | each question's `rendering` matches its concept datatype — `radio`/`select`/`multiCheckbox` need `Coded`, `textarea`/`text` need `Text`, `numeric` needs `Numeric`, `group` needs a concept set | the same error signature as incident 1, without the concept being absent |
| P3 | each clinical role holds the privileges its journey needs, resolved **through `role_role` inheritance** | incident 2 |
| P4 | the Keycloak `openmrs` client still has every expected role, and every test user still maps to one | incident 2 |
| P5 | every concept reference in the frontend config resolves | a misconfigured vitals or allergies panel |

P4 is the one that matters most and is easiest to forget: nothing in OpenMRS notices that a Keycloak
role has disappeared. The users simply arrive with no privileges.

## Journeys

Legend — `LIVE`: staff do this today at Mugamba. `PLANNED`: coming with M3 inpatient, M4 maternity,
M5 theatre. Steps are numbered so journeys B–F can reference A rather than repeat it.

> The step tables below are **not yet filled in**. Didier was asked on 2026-09-13 to describe each
> step as: who (role + username), where (screen and button), what is typed (each field marked
> `[always]`/`[often]`/`[rare]`), how you know it worked, and what commonly goes wrong. Fill these
> from his answer before implementing.

### A. Outpatient consultation, paying patient — arrival to departure

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| A1 | | | | | |
| A2 | | | | | |
| A3 | | | | | |
| A4 | | | | | |
| A5 | | | | | |
| A6 | | | | | |
| A7 | | | | | |
| A8 | | | | | |

### B. Outpatient consultation, insured patient (MFP / CAM)

Only the steps that differ from A. Related tickets: #184 insurance per product, #189 100% payer,
#219 explicit insurance coverage.

| replaces | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| | | | | | |

### C. Consultation with a lab test

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| C1 | | | | | |
| C2 | | | | | |
| C3 | | | | | |

### D. Consultation with an X-ray or ultrasound

Must cover the payment gate explicitly. A past defect let one paid invoice authorise every imaging
order for every patient, because OpenMRS silently ignores unsupported search filters — so assert that
an **unpaid** order is refused, not only that a paid one succeeds.

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| D1 | | | | | |
| D2 | | | | | |
| D3 | | | | | |

### E. Consultation with medicines dispensed

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| E1 | | | | | |
| E2 | | | | | |
| E3 | | | | | |

### F. Admission to a ward

Uses *Ward Admission* and *UVL Inpatient Consultation Form*. Confirm with Didier whether staff do
this today; if not the whole journey is `PLANNED`.

| # | actor role | screen / form | data entered | assertion | status |
|---|---|---|---|---|---|
| F1 | | | | | |
| F2 | | | | | |
| F3 | | | | | |

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

- **UAT** `uvl-emr-uat.madiro.org` — full suite, including anything that writes to billing.
- **Production** `uvl-emr.madiro.org` — pre-flight checks P1–P5 only, plus read-only smoke. Nothing
  that creates a real bill, a real insurance claim or a real prescription. Article 6 of the FBP
  contract pays on monthly-verified volume, so synthetic encounters on production are not harmless.

Pending Didier's confirmation: whether a permanent, obviously-fake test patient may exist on
production at all, or only in UAT.

## Still needed from Didier

1. The step tables above, journeys A–F.
2. Which fields staff fill `[always]` / `[often]` / `[rare]` — this decides which failures stop a
   deploy and which only warn. The suite fills everything regardless.
3. A username per role for testing.
4. Whether a permanent test patient on production is acceptable.
5. Which steps must never run automatically against production.
