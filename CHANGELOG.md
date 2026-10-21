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
- **A price finance changes in Odoo stays changed.** A deploy or a database restore no longer
  resets 290 product prices to the configuration's values. (#439)
- **The chart's Forms list has "UVL Contact Form" (Fiche d'enregistrement d'un contact),** for
  nurses, midwives and doctors. It records the patient's origin, the clinical service, the
  responsible provider, who accompanies the patient (name and telephone), the internal transfer
  destination, the case type (Nouveau / Ancien), its category, the clinical situation, and the
  diagnostic hypothesis, which is required. Identity, contact type, dates and payer come from the
  patient banner and the visit, so they are not asked again. It saves a "Contact" encounter.
  (#376)

### Added
- OpenMRS role and Keycloak `openmrs` client role **Central Pharmacist** (inherits `Pharmacist`
  and `Inventory Manager`), and the Keycloak `openmrs` client role **Inventory Administrator** for
  whoever manages stock user role scopes. The build now fails on a Keycloak `openmrs` client role
  or an inherited role that OpenMRS does not define (`scripts/check-openmrs-roles.groovy`). (#438)
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

### Changed
- **The Pharmacist can request stock from the central store and receive it** at the dispensation:
  inherits `Inventory Dispensing` and `Stock Management Base Role`, and gets
  `Task: stockmanagement.stockoperations.mutate`, `...receiveitems` and
  `App: stockmanagement.userRoleScopes`. The last one lets the stock app read the pharmacist's own
  scope; without it the Operations page got a 403 and offered nothing to create. It is read-only:
  editing scopes stays with `Inventory Administrator`. Every existing privilege is kept, so
  dispensing (#374, #394) is unchanged. What each pharmacist may do, and where, is set by stock user
  role scopes (deploy note 14). The build now also fails on a Keycloak role that may create stock
  operations but cannot read its scopes. (#438)
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

### Removed
- **The Odoo `product_price` loader and `prices.csv` (290 products).** Finance owns prices in Odoo;
  the file put them back to its own values whenever it changed or the Odoo checksums were cleared,
  as after every database restore. Every row already matched production and UAT, so no price
  changes on deploy. Products are still created from `product_variant/`, which sets `lst_price`
  only on creation; a new product without a price arrives at 1.00 and finance prices it. The rule
  is in `CONTRIBUTING.md`, and `scripts/check-odoo-prices.groovy` fails the build on a loader
  that would overwrite prices or a product row with an empty price. (#439)

### Fixed
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
    - every drug that is prescribed is a stock item. On UAT 224 of 428 drugs are not, and Dispense
      is disabled for them, with no message. The product owner's sheet adds them.
    - the opening stock is counted at **Pharmacie - Dispensation (Rx-DISP)**, and pharmacists
      dispense logged in there. A drug with no stock there cannot be dispensed.
    Check the dispensing app's batch filter (`validateBatch`) on UAT before switching; see Known
    issues.
14. **#438, pharmacy stock roles:** run `keycloak-apply-realm.sh` so the `openmrs` client gets
    `Central Pharmacist` and `Inventory Administrator`. Give the central pharmacist
    `Central Pharmacist`, and the product owner `Inventory Administrator` alongside
    `System Developer`. After each pharmacist's first sign-in, the product owner creates their stock
    user role scopes, as listed in `sites/mugamba/configs/keycloak/users/staff-roster.example.csv`:
    one scope per person, because the Operations page reads only the first. Without a scope a
    pharmacist can still dispense but records no stock operation. Needs the stock locations of #437.

### Known issues
- On the stock app's new user role scope form, `Inventory Administrator` gets a 403 from
  `GET /ws/rest/v1/role`, which needs `Manage Roles`. The form doesn't use the answer: its Role list
  shows the chosen user's own roles, so `Manage Roles` isn't granted. (#438)
- A Keycloak role change reaches OpenMRS only at the user's second sign-in. Until then the stock
  scope form lists no role for that user. (#438)
- The dispensing block is in the interface only; the server doesn't refuse an over-dispense. (#374)
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
  consumables). (#437)
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
