# @madiro/esm-uvl-partograph-app

UVL's partograph chart on the patient summary dashboard
(`patient-chart-summary-dashboard-slot`), drawn from the saved **Partograph Reading** encounters
(form `UVL-Partograph-Reading-Form`, #382). UVL-EMR
[#498](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/498), resolving the configure-or-build
spike [#264](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/264) as "build".

## Why it exists

The generic `obs-by-encounter-widget` cannot draw a partograph: every point reads "Aujourd'hui"
(no time axis), the lines on one graph have no legend, there are no WHO alert and action lines,
part of its text stays in English, and coded answers show concept names instead of partograph
codes. The `obs-table-horizontal-widget#partograph-table` that sat beside it is removed as well:
it showed an empty "Partogramme : …" table, even for a male patient, and the chart now shows
everything it did (liquor, moulding, contraction duration, medications).

## What it draws

The layout is the Ministry's **MSPLS partogram**: the "Accouchement (modèle MSPLS)" partogram
the clinic uses on paper and in OpenClinic. It differs from the generic WHO sheet in its scales
and reference lines. One card, **Partogramme**, shows the current labour. Its panels are stacked
in the sheet's order and share one time axis; each has its own legend and axis labels.

| # | Panel | Scale | Drawn |
|---|---|---|---|
| 1 | Fréquence cardiaque fœtale | 80–200 /min | FHR line; reference lines at **100 and 180** /min |
| 2 | Liquide amniotique et modelage | rows | the partograph codes at each reading time |
| 3 | Médicaments administrés | row | a number per medication entry (1, 2…) at its reading time; the numbered list under the chart has the time and full text |
| 4 | Dilatation du col et engagement | 0–10 | dilatation (cm, ×), descent (fifths, ○), alert line, action line |
| 5 | Contractions par 10 minutes | 0–5 | one bar per reading, shaded by duration (< 20 s, 20–40 s, > 40 s), duration written above |
| 6 | Oxytocine | rows | U/L and drops/min at each reading time |
| 7 | Pouls | 40–180 /min | pulse line |
| 8 | Tension artérielle | 40–200 mmHg | a bar from diastolic to systolic |
| 9 | Température | 35–43 °C | temperature line |

A value outside a scale (the form accepts, for example, an FHR of 40–250) widens that panel's
scale rather than being cut off.

### Time axis and hour 00

- **Hour 00 is where the alert line is at 4 cm**, as on the sheet. It is the time of the first
  reading with a cervical dilatation of **4 cm or more**. When that reading is above 4 cm, hour 00
  is moved back 1 hour per centimetre above 4. A first active reading at 6 cm is therefore at hour
  02, **on** the alert line: the WHO rule for a woman admitted in the active phase.
- Without any reading of 4 cm or more, hour 00 is the first reading, and no line is drawn.
- Readings before hour 00 (latent phase) are drawn at negative hours (-01, -02…); the axis
  widens to the left for them. A reading up to 5 minutes before a whole hour opens the axis at
  that hour: one at -1 h 00 min 10 s sits just left of -01, without an empty -02 column.
- The axis is marked **00 to 12** (`minimumHours`). It runs one hour past the last reading when
  labour goes beyond hour 12.
- Each reading is placed at its real time, in fractional hours.
- Each tick shows the hour (00, 01…), the clock time (HH:mm, browser time zone) and, on the first
  tick and wherever it changes, the date (DD/MM). A tick is labelled every hour up to 16 hours,
  then every 2, 3, 4… hours.
- **Current labour:** only the readings after the last gap longer than `labourGapHours` (24 h)
  are charted, so a previous delivery does not stretch the axis over months. The card says how
  many earlier readings it leaves out.

### Alert and action lines

- **Alert line:** from **4 cm at hour 00 to 10 cm at hour 06**, rising 1 cm per hour.
- **Action line:** from **4 cm at hour 04 to 10 cm at hour 10**, the alert line 4 hours to the
  right.
- In general terms: the alert line passes through the first reading of 4 cm or more at 1 cm per
  hour, and starts at 4 cm. With hour 00 as defined above, that is always 00 → 06.

The rules are in `partographOrigin` and `alertAndActionLines` (`src/partograph/partograph-math.ts`),
with their tests.

### Code rows: half-hour cells

Liquor, moulding, medications and oxytocin are written in rows of **half-hour cells**, as on the
paper sheet (dotted lines mark the half hours).
- Each value is centred in the cell its reading time falls in: 14:00–14:30 is one cell.
- Two or more readings in the same cell are **stacked**, one line each, oldest on top. The row
  grows to fit them. Readings 25 min apart (14:00 and 14:25) therefore read `++` above `+++`,
  never `+++++`.
- On a long axis, where a half-hour cell would be narrower than 24 SVG units (room for `+++`),
  the cells widen to 1, 2, 4… hours (`cellHours`).
- Free-text medications don't fit in a cell: the row shows the entry's number, and the list under
  the chart gives each number's time and full text.
- Each code's tooltip gives the reading time.

The rules are in `cellHours` and `toCells` (`src/partograph/partograph-math.ts`), with tests.

### Liquor and moulding codes

The codes come from the configuration, which maps each answer concept of the form to its code:

- **Liquor:** `I` intact membranes, `C` clear, `M` meconium-stained, `B` blood-stained.
- **Moulding:** `0`, `+`, `++`, `+++`.

An answer missing from the mapping is shown with its concept name.

## Configuration

The module ships no UUID. The site config (`sites/mugamba/.../uvl-mugamba-frontend-config.json`)
gives, under the key **`@madiro/uvl-partograph`**:

- `encounterTypeUuid`;
- `concepts`, one per form question;
- `liquorCodes` and `mouldingCodes`.

Without `encounterTypeUuid` the card renders nothing.

| Key | Default | Meaning |
|---|---|---|
| `labourGapHours` | 24 | A longer gap between readings starts a new labour |
| `minimumHours` | 12 | The axis runs at least from 00 to this hour (MSPLS sheet: 12) |
| `showWhenEmpty` | false | `false`: no card for a patient without readings. `true`: a card saying "Aucune lecture du partogramme pour cette patiente" |

**Why `@madiro/uvl-partograph` and not the module name.** In core 11 an extension's configuration
is computed as soon as its slot renders it, but the module, and so `startupApp()` and its
`defineConfigSchema`, is only loaded once the component is fetched. Keys under the module name
were first checked against the bare implicit schema, which knows only "Display conditions" and
"Translation overrides". Each then logged `Unknown config key '@madiro/esm-uvl-partograph-app.…'
provided. Ignoring.` before the real schema arrived and the values applied (UAT, 4 Nov 2026).
`startupApp()` defines the schema under `@madiro/uvl-partograph` instead, and the component reads it
with `useConfig({ externalModuleName })`. No extension belongs to that name, so its values are
checked only against the real schema. "Display conditions" stay on the extension, in the slot's
`configure`.

**Who sees it:** the extension `uvl-partograph-chart-widget` has no default slot. The site config
adds it to `patient-chart-summary-dashboard-slot` with the display condition
`privileges: ["View Partograph Reading"]`. The REST request is also bound by that privilege, since
it is the encounter type's view privilege.

**Data:** `GET /ws/rest/v1/encounter?patient=…&encounterType=…&v=custom:(uuid,encounterDatetime,encounterType:(uuid),obs:(uuid,concept:(uuid),value))`.
It follows every page (`useOpenmrsFetchAll`). Encounters of another type are dropped on the client
too, because OpenMRS ignores a search filter it does not support.

## Build and ship

The same as `esm-uvl-imaging-app`.

`dist/` is committed, without source maps. `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/madiro-esm-uvl-partograph-app.tgz`.
`distro/configs/openmrs/frontend_assembly/spa-assemble-config.json` pins the module as
`file:madiro-esm-uvl-partograph-app.tgz`.

The chart is plain SVG, with no chart library. The module's own chunk is about 17 KB. The large
chunk in `dist/` is the bundled fallback copy of the shared `@openmrs/esm-framework`; the app
shell's copy is used at runtime.

After changing anything under `src/` or `translations/`, rebuild and commit `dist/`:

```sh
cd distro/frontend/esm-uvl-partograph-app
npm ci --legacy-peer-deps
npm test
npm run build
git add -A dist
```

Bump `version` in `package.json` with each change: the assembled module directory is named after
it, which is what breaks browser caches.

Strings are in `translations/en.json` and `translations/fr.json`; UVL's default locale is `fr`.
Counts use i18next plurals (`summary_one` / `summary_other`). Interpolated values are passed with
`interpolation: { escapeValue: false }`: i18next HTML-escapes them by default, so a date showed as
`04&#x2F;11`, and React escapes text already.
