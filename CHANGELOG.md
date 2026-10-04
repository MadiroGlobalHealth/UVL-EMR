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

## Current status — 2026-09-30

- Production received an EMR update on **2026-09-30**: the official `globalmadiro` images from
  UVL-EMR `main` `393f5b5`, deployed from LIME-EMR-Tooling `dev`. They are the same images, by
  amd64 image-config digest, that passed the full browser journey and the product owner's
  screenshots on UAT the day before.
- Nothing is in `[Unreleased]` yet.
- Plan of record: the UVL-EMR Delivery Dashboard, status 28 Sep 2026 (milestones on GitHub).

---

## [Unreleased] — `UAT`

Nothing yet.

---

## [2026-09-30] — `Production`

UVL-EMR `main` `393f5b5`, UVL-Odoo-Addons `main` `76726c4`, LIME-EMR-Tooling `dev`. Verified on
UAT on 2026-09-29 by the full browser journey, run as the real staff roles, and by repeating
the product owner's own test screenshots.

### Staff will notice
- **Starting a visit shows a Payer field** (Cash, Mobile Money, MFP, CAM, Other insurance). It is
  optional until the default payer is agreed (#327). Billing does not read it yet (#184, #189).
- **Billing staff can confirm a quotation, invoice it and take payment.** Before this they could
  only invoice orders an administrator had confirmed. (#331)
- **Nurses can save forms again.** Every form that records a provider failed for the Nurse role. (#335)
- **The imaging-gate screen is gone,** and lab results entry has its button back. Imaging results
  are entered from the patient chart → Orders. (#322, #337)
- **Lab results accept decimals,** for example glucose 4.2, MCV 12.1 and lymphocytes 11.5. Vital
  signs such as pulse and blood pressure stay whole numbers. (#354)
- **The Pharmacist can dispense, pause and close prescriptions.** Before this, dispensing failed
  with a server error. Stock does not go down yet: no stock is loaded. (#355)
- **A drug the patient already has active** is marked "Déjà actif - utiliser Modifier" in the
  search. If the basket still fails, it now says that nothing was saved and what to do. (#356)

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
- **Lab results refused decimals,** in the form and on the server. #208's fix had only edited the
  OCL zip, which the OCL module ignores on an existing database because it updates a concept only
  when its OCL version changes. A guarded Liquibase changeset now allows decimals on 21 lab tests.
  (#354, #357)
- **Dispensing returned a 500.** Three causes: the `completed` dispense status had no mapped
  concept; the dispensing app's default ValueSets were missing; and the Pharmacist lacked
  `Get Order Frequencies` and `Edit Orders`. (#355, #358)
- **The basket error for an already-active drug** said only "Please try launching the workspace
  again". It now explains what happened and what to do, in French and English. (#356, #359)

### Deploy notes for production

What the 2026-09-30 deploy actually needed, beyond the steps below:
- **The billing module failed to start.** Production stored the older checksum
  (`8:838129…`) for `openhmis.cashier-001-v3.0.0-0334`, and `billing-2.3.0` ships a changed copy.
  The changeset had already run. Clearing that one stored checksum (`md5sum = NULL`, as it already
  was on UAT) and restarting OpenMRS fixed it. UAT's data could not have shown this.
- **The first deploy stopped partway** ("removal of container … is already in progress"),
  leaving both EIP bridges down. A second run completed.
- **The billing roster was re-applied,** 6 users reconciled.
- **The orthanc bridge had no database account.** `eip-openmrs-orthanc` crash-looped 226 times on
  `Access denied for user 'openmrs_eip_mgt_orthanc'`, so imaging orders did not reach the
  worklist. The MySQL image only creates that database and user on a fresh install, and
  production's database is older than the bridge. They were created from the container's own
  `EIP_DB_*_ORTHANC` settings.
- **Six `openmrs` client roles were missing in Keycloak:** Pharmacist, X-Ray Technician, Midwife,
  Ophtalmologist, Dentist and Anesthesist. The realm file is only read on a first install. They
  were added with `keycloak-apply-realm.sh`, which can now sign in with the `keycloak-admin-sa`
  service account (LIME-EMR-Tooling `cd5319ea0`). The pharmacist and X-ray technician accounts were
  then created from the staff roster.
- **Ten old module files were left in the OpenMRS volume,** beside their newer versions, including
  `billing-1.2.0-SNAPSHOT` and `stockmanagement-2.0.2-SNAPSHOT`. They were cleared with
  `openmrs-clear-stale-config.sh`. #362 stops future deploys leaving them behind.
- A read-only post-deploy check then passed all 18 checks.

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
- Dispensing: stock does not decrement, because no stock is loaded, and a fully dispensed
  prescription can be dispensed again. (#355)
- A repeat of an active lab test is accepted silently and never billed; a repeat consultation is
  billed twice. (#360, #356)
- Imaging tariffs are placeholders (1 BIF) until the fee schedule arrives.
- 31 staff hold Superset Admin and SENAITE Manager from the old realm file. (#348)
- The `insurance_coverage` Odoo addon is in the image but not installed, so #184 is still untested.

### Images running in production (amd64 image IDs, 2026-09-30)

| service | image id |
|---|---|
| openmrs-backend | `sha256:4a706da4540601008a1f82cb9476dc35da19f325e3adfd35620a6c4b5ec4ff03` |
| openmrs-frontend | `sha256:3ab2f8cbccee20329f2ced3e3fbf585bbbaaea1e970ddc4ff31b3cb57d89d6b0` |
| odoo | `sha256:b613a289c9268db3c9b10b980b6d13d69a5d08dbbb6fb98b8ea3cdde125aa8ff` |
| keycloak | `sha256:d98ce304ec889ba534630aff2df69060142df9c875f5b9f7776339773d355ad9` |
| mysql | `sha256:6443932843526edcd6b9fec8042e29fbd05ab2c8040eca31ee12a16e0a52b772` |
| postgresql | `sha256:ccc4e145c6e77fbb57661193d8002f8966fa11dbd5dfa64ebf68ef49c8a29848` |
| eip-odoo-openmrs | `sha256:4838e5ad73ba50486c2e057759f4ed15fbb771d39d06615900d13c337f42db1b` |
| eip-openmrs-orthanc (`mekomsolutions/eip-client:2.4.0-SNAPSHOT@sha256:fef2ffee…`) | `sha256:b5b195f7503ecc1b8a8a6fabc0833a778046a5cf3fbc12dded2474c0efb2d9c7` |
| orthanc | `sha256:ca6a96e975a4bd5c5d50f22347916e818305f57b4fcd33b7c6f210bac1d2f6b6` |
| orthanc-auth-service | `sha256:65eddbf0a3450653f8f33bf5f35c3e60ad2fafd47cdb73478bb21453526884e7` |

These are the rollback reference for the next deploy.

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
