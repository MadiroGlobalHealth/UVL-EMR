# Partograph: configuration or build?

Spike for #264, de-risking #247 (Maternity: delivery record and partograph) and the form issue #382.
Written 7 October 2026. Status: **proposed**, waiting on one answer from the product owner (below).

## Answer

**Configuration, with one open question that could turn it into a build.**

The partograph can be delivered with what UVL-EMR already ships: an O3 form for each reading, plus
the generic obs graph and table widgets that are already in our frontend assembly
(`@openmrs/esm-generic-patient-widgets-app` 12.3.4). No new frontend module, no new repository.

What configuration **cannot** give is the WHO-style chart itself: the **alert and action lines** on
the cervical-dilatation graph, and an x-axis in hours since admission. If the midwives need those on
screen to make decisions, the partograph is a build, and #247 roughly doubles as the issue predicted.

| | configuration (recommended) | build |
|---|---|---|
| what | reading form + obs graph/table widgets | custom O3 frontend module (ESM) with a partograph chart |
| alert / action lines | no | yes |
| per-labour view | approximate (latest readings, filtered by encounter type) | exact |
| partograph effort (Joshua) | ~18 h | ~44-50 h |
| #247 total | **32 h, unchanged** | **~64 h** |
| new repo, release pipeline, O3 upgrade risk | none | yes; needs a home outside "no new Madiro repos" |

## What the paper form is

From Didier's `Partogramme.docx` and `Partogram_EN.docx` (MSPLS model; the two are the same form in
French and English; both are blank templates).

A header block, then nine **time-series rows**. Each row has an entry line (date, time, value) and a
grid of 13 columns, hours 00 to 12, with a value scale:

| row | value | scale on the paper | datatype it implies |
|---|---|---|---|
| Fetal heart rate | beats/min | 80-200 | numeric |
| Amniotic fluid | code, e.g. "I: membranes intact" | — | coded |
| Head moulding | code | 0-2 | coded |
| Medications | code, e.g. "Ab: antibiotic" (two lines) | — | coded or text |
| Cervical dilatation | cm | 0-10 | numeric |
| Descent / engagement | fifths ("Mobile = 5/5") | (shares the 0-10 grid) | coded or numeric |
| Contractions | per 10 min, plus duration | 0-5 | numeric + numeric/coded |
| Oxytocin | U/L and drops/min | — | numeric x2 |
| Pulse | /min | 40-180 | numeric |
| Blood pressure | mmHg | 40-200 | numeric x2 |
| Temperature | °C | 35-43 | numeric |

Header, filled once per labour: **type of delivery** (normal / complicated), **uterine exploration**,
**other**, **prescribed medications**. These overlap the childbirth record (#381); see below.

Nothing on the paper form is a calculation. The value of the paper version is that it is **plotted**,
and on the WHO model a dilatation curve crossing the alert line is the trigger to act. The MSPLS
template as extracted shows the hour grid but no alert/action line labels; whether staff draw them by
hand is the question for Didier.

## What O3 can do today, by configuration

**Data entry: the O3 form engine is enough.** One encounter per reading, of a new encounter type
*Partograph*. The form engine supports an `encounterDatetime` field, so a reading taken at 10:40 and
typed in at 11:15 is stored at 10:40, which is what makes the plot right. Every row above maps to a
`number`, `radio`/`select` or `text` question, with the paper's ranges as numeric limits. This is what
#382 already proposes ("one encounter per reading").

**Display: the generic widgets cover most of it.** `@openmrs/esm-generic-patient-widgets-app`
(in `spa-assemble-config.json` at 12.3.4) provides two configurable patient-chart widgets:

- `obs-by-encounter-widget`: a table that switches to a **line graph**. Configured with a list of
  concepts, colours and `graphGroup`s (several lines on one graph), `graphOldestFirst`, and an
  `encounterTypes` filter. Numeric concepts only.
- `obs-table-horizontal-widget`: readings as columns over time, any datatype. This is the right
  shape for the coded rows (amniotic fluid, moulding, medications).

Grouped as, for example: *Fetal heart rate*; *Dilatation and descent*; *Contractions*; *Pulse and blood
pressure*; *Temperature*; plus one horizontal table for liquor, moulding, oxytocin and medications.
Both are placed with frontend configuration only, in the patient summary (or wherever the maternity
dashboard ends up), shown only to the roles that need it.

The `encounterTypes` filter becomes a FHIR search `encounter.type=...`. Given the payment-gate incident
(OpenMRS silently ignoring an unsupported filter), this was checked: FHIR2's Observation search
whitelists the `encounter` chain with `type` (`ObservationFhirResourceProvider`), and UVL ships FHIR2
4.2.0. Confirm it on the prototype anyway: if it were ignored, fetal heart rates from antenatal visits
would appear on the labour graph.

### What configuration does not give

1. **Alert and action lines.** The widget draws data lines only. It has no reference lines and no
   configuration for them.
2. **Hours on the x-axis.** The widget's time axis labels ticks with the date only
   (`formatDate(value, { year: true, time: false })` in 12.3.4). Points are placed at the right time,
   but a 10-hour labour shows one date under every tick; times are in the table view. Not hours since
   admission either.
3. **One labour at a time.** The widget shows the patient's most recent 100 observations of the
   configured concepts. A woman's earlier labour would appear beside the current one, separated in time.
   Acceptable at first; a real per-episode view needs code.
4. **A dedicated "Partograph" page in the chart.** Patient-chart 12.3.4 has no configurable generic
   dashboard, so the widgets go into an existing page (patient summary, or a maternity page if one is
   added later).

## Existing partograph implementations in the OpenMRS community

| implementation | where | state | usable for UVL? |
|---|---|---|---|
| KenyaEMR 3.x, `esm-patient-clinical-view-app/.../partography` | copied into [AMPATH/ampath-esm-3.x](https://github.com/AMPATH/ampath-esm-3.x/tree/main/packages/esm-patient-clinical-view-app/src/maternal-and-child-health/partography) in July 2024; the upstream KenyaEMR repository is no longer public | partial: fetal heart rate, dilatation, descent only; contractions are `TODO`; data entry is an O3 form with an obs group; no alert/action lines; untouched since August 2024; no licence declared | no: incomplete, unmaintained, licence unclear |
| SIH Salus (Peru), `esm-salud-materna-app/.../partography` | [sihsalus/sihsalus-frontend](https://github.com/sihsalus/sihsalus-frontend/tree/main/packages/apps/esm-salud-materna-app/src/ui/partography) | active (commits Sept 2026), tested, MPL-2.0; Carbon line chart, one metric at a time, concepts configurable; data from an O3 form per reading | not as-is: part of a large maternal-health app tied to Peru's forms and pregnancy-episode model, not published to npm, and no alert/action lines either. Its chart component is the best starting point if we build |
| OpenMRS reference application / O3 core | — | no partograph | — |
| Standalone digital partographs (e.g. offline WHO Labour Care Guide apps) | GitHub | several, none integrated with OpenMRS | no |

Both OpenMRS implementations make the same split as the configuration route: **an ordinary form per
reading, and a chart that reads the observations back**. That is the pattern to keep whichever way the
open question goes, because the form and concepts carry over unchanged into a build.

OpenMRS Talk could not be searched from this environment (Cloudflare challenge); worth a manual search
for "partograph" before any build starts.

## Recommendation

1. **Build the configuration route for M4.** #382 becomes "Partograph reading" form (one encounter per
   reading, `encounterDatetime` question, the nine rows). The header items move to the childbirth
   record (#381), which already has type of delivery, procedures and medications; one place to record
   them, not two.
2. **Ask Didier one question now, before the M4 date is committed:**
   *Do midwives use the alert and action lines on the paper partograph to decide when to act, and must
   the screen show them for go-live? Or is the trend graph enough, with the paper partograph kept at
   the bedside for the alert/action decision?*
3. If the answer is **"the screen must show them"**: build a small UVL partograph ESM, starting from
   the SIH Salus chart component (MPL-2.0 permits it, with attribution), reading the same form's
   observations. It needs a repository: that is a decision for Michaël and James, because the current
   rule is no new Madiro repositories.

Clinically, an on-screen trend without alert/action lines is a **record**, not a decision aid. Say
so in training, so nobody reads a missing line as "no alert".

## Revised estimate for #247

| item | configuration | build |
|---|---|---|
| concept mapping and OCL (about 15 concepts; vitals reuse CIEL) | 4 h | 4 h |
| reading form, FR/EN (#382; volunteer-built, Joshua reviews) | 3 h | 3 h |
| encounter type, privileges, role display | 1 h | 1 h |
| widgets in frontend config, verified as a midwife | 4 h | — |
| custom chart: alert/action lines, hours axis, per-labour scoping, tests | — | 24 h |
| ESM packaging, CI, release into `spa-assemble-config.json` | — | 8 h |
| translations, UAT walkthrough with Didier, fixes | 6 h | 8 h |
| **partograph** | **18 h** | **48 h** |
| childbirth record (#381) | 14 h | 14 h |
| **#247** | **32 h** | **62 h** |

On the configuration route the 32 h contingency held against this risk can be **released, keeping 6 h**
for the two things only a prototype will settle: the `encounter.type` filter, and whether the
date-only axis is acceptable to the midwives.

## Next steps

- [ ] Didier answers the alert/action-line question (above).
- [ ] Update #382 with the reading-form scope, and move the header items to #381.
- [ ] Concept mapping table on #382 (volunteer), concepts in OCL (Joshua).
- [ ] Prototype on a local stack: three readings at different times, check the graph, the
      `encounter.type` filter and the axis labels. One hour; do it before building the form fully.
