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

## Current status — 2026-10-07

- Production last received an EMR update on **2026-09-30**: UVL-EMR `main` `393f5b5`, which is
  release candidate `a218cae` plus #357, #358 and #359 (section `[2026-09-30]` below). The
  product owner checked it on production the same day.
- `[Unreleased]` below is UVL-EMR `main` `a76d0a7`. It holds every requirement the product owner
  sent between 30 Sep and 6 Oct that was still open. It is planned for production on the night of
  **7 → 8 Oct 2026**. Each change passed the browser journey on UAT on 2026-10-07, run as the real
  staff roles, on a personal build of the same branches. The official `globalmadiro` images are
  re-checked on UAT before the production deploy.
- When it reaches production, give the section the deployment date, tag it `Production`, and
  record the running image digests.

---

## [Unreleased] — `UAT` · `main` `a76d0a7`

Merged to UVL-EMR `main` and verified on UAT. **Not in production.**

### Staff will notice
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

### Added
- Person attribute type "Chef de ménage" (`c108c6bc-5f23-4e4a-ad34-8c788b86f288`). (#389)
- Odoo `product_price` initializer loader. The product loader treats `lst_price` as `NO_UPDATE`,
  so it can't change the price of a product that already exists. (#391)
- OCL releases UVL-Burundi `uvl-registration` 20261007 and `uvl-labtests` 20261007-5. (#388)
- Concepts that existed only in Initializer CSVs now live in OCL (drugs, supplies, procedures,
  dispensing ValueSets, payer, insurance tiers, radiology), and each keeps its UUID. (#366)

### Changed
- Liquibase converts BP06 from Coded to LabSet and BP09 from Text to LabSet. It also removes the set
  members an earlier OCL release had shared between them, because the OCL import never removes
  members. Old results are kept. (#388)
- Dispensing: `restrictTotalQuantityDispensed: true` with `allowModifyingPrescription: false`. The
  Pharmacist gets `Task: dispensing.create.dispense.allowSubstitutions`. (#389)
- The basket failure title is O3's stock text again. The #359 override blamed an already-active
  drug for every failure, which was wrong. The "Déjà actif - utiliser Modifier" tag stays. (#364)
- The Pharmacist, X-Ray Technician and Lab Technician get `Get Queue Entries`. The Doctor,
  Ophtalmologist and Dentist get `Get ChargeItemDefinition` and `Get InventoryItem`. (#365)

### Fixed
- **Odoo: printing a customer invoice from "Send & Print" crashed** (#375). This is a database
  fix, not a code change: two views and two server actions left behind by the Odoo 17 migration.
  It was applied on UAT on 2026-10-07. **Production needs the same steps by hand; see the deploy
  notes.**
- Payer and dispensing answers were duplicated after the OCL import. Five X-ray procedures were
  never created because of a name clash. The X-ray billable services had no concept. (#366)

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

### Known issues
- **Stool results recorded before the change** (about 23, July–August) no longer show on the
  Results page now that BP06 is a set. They are intact in the database and the API. Whether to
  convert them is a product owner decision.
- **Prescriptions fully dispensed before this change** still show Dispense. Backfilling them is a
  separate data decision. The block is in the interface only; the server doesn't refuse an
  over-dispense. (#374)
- **357 products are still at 1.00:** 283 have no tariff price (the pharmacy is priced at purchase
  price plus margin), and 73 matches await the product owner. Some existing prices disagree with
  the tariff. (#270)
- Suspected over-billing of syrups per mL (#385). Discontinued lab and imaging orders are still
  billed (#386, #254). The PACS viewer returns 403 for the X-Ray Technician (#387).
- **H. pylori and albuminuria** wait for the product owner's choice of test method. (#371)
- Vitals from the chart box are saved without a visit when the user's location differs from the
  visit's. This matters more now that the chart box is the only route for vitals. (#347)
- The order basket's price and stock lookups fail on fhirproxy's unfilled
  `${EXTERNAL_FHIR_API_URL}`. (#363)

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
