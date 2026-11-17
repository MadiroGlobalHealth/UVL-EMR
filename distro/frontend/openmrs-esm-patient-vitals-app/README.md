# @openmrs/esm-patient-vitals-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/vitals-13.0.2-pre.12863-patched`.
The #564 changes are on branch `uvl/564-vitals-normal-ranges`, #678 on top of them on
`uvl/678-vitals-visit-location`, #680 on top of that on `uvl/680-vitals-whole-numbers`, #719 on top
of that on `uvl/719-decimal-separator`, #726 on top of that on `uvl/726-vitals-french-pulse-unit`,
#723 on top of that on `uvl/723-vitals-decimal-display`, #752 on top of that on `uvl/752-vitals-celsius`, and
#761 on top of that on `uvl/761-vitals-header-latest`.
#723 on top of that on `uvl/723-vitals-decimal-display`, and #752 on top of that on `uvl/752-vitals-celsius`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #347 | A new vitals encounter is saved with the visit in context, an `encounterDatetime` inside that visit when the visit is closed, and the logged-in provider (`vitals.clinicianEncounterRole`, default the Clinician role) | openmrs/openmrs-esm-patient-chart#3859 |
| #564 | The vitals form shows each vital's normal range under its input ("Normal: 60–100"; blood pressure as systolic / diastolic), from the concept's reference range for the patient. Values outside it are still flagged and still saved; only the absolute limits block saving. The range is inserted unescaped, so the slash shows as "/" and not "&#x2F;" (`.uvl.3`) | openmrs/openmrs-esm-patient-chart#3873 |
| #678 | A new vitals encounter is filed at its visit's location (the service chosen when the visit started), not the user's session location; a visit without a location falls back to the session location, and an edit leaves the location alone (`.uvl.4`) | none yet |
| #680 | A field whose concept takes whole numbers only (`allowDecimal` false, read with the vital signs set's members) refuses a decimal: the input says so at once, and Save names the fields instead of sending a value OpenMRS would reject with `Obs.error.precision` (`.uvl.5`) | none yet |
| #719 | A number field is a text input (`inputMode` decimal) that takes a dot or a comma as the decimal point: "36.4" and "36,4" both save 36.4. It was `<input type="number">`, which on a French-locale Windows browser empties itself on a typed dot ("36.4" saved as 4) and elsewhere read "36,4" as 364. Letters and a second separator are ignored as typed; the whole-number rule (#680), the normal-range flags and the absolute limits are unchanged (`.uvl.6`) | none yet |
| #726 | Concept units that are words are written in the session's language: the pulse's « beats/min » reads « batt/min » in French (and a « breaths/min » unit « resp/min »), in the form, the header tiles, the normal ranges, the history table and the charts. Symbols (mmHg, kg, %, C) are shown as stored. New keys `unitBeatsPerMinute`, `unitBreathsPerMinute` (`.uvl.7`) | none yet |
| #723 | Decimals are shown with the session language's decimal mark, « 36,4 » in French: the header tiles, the vitals and biometrics history tables, the weight tile, the normal ranges (under each input and in « Valeurs normales »), the computed BMI, a value loaded to edit an encounter, and the limits of the « between … and … » message. Only the mark changes, never the digits; sorting and flags still use the stored numbers, and the fields still take a dot or a comma (#719). The charts are drawn by Carbon Charts and keep their own number format (`.uvl.9`; `.uvl.8` reached UAT with the French translations of the main build and is not to be reused) | none yet |
| #752 | A temperature unit stored as the bare letter « C » (UVL's temperature concept), or CIEL's « DEG C », is written « °C »: the header tile read « Temp 37,2 C ». Same place as #726, `translateUnit`, so the form, history and charts follow (`.uvl.10`) | none yet |
| #761 | The vitals header shows the latest value of each vital, whichever encounter recorded it: a form that records only a temperature (a surveillance form) no longer turns the blood pressure, pulse, weight and BMI taken earlier in another encounter into « -- ». Each value keeps its own encounter's flag; systolic and diastolic come from the same encounter; BMI is that of the latest weighing, or is calculated from the latest weight and height. The header date is the most recent encounter's. The history tables still list one row per encounter (`.uvl.11`) | none yet |

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-vitals-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-vitals-app.tgz`.

To rebuild, on the fork branch, with Node 22:

```sh
yarn install --immutable
cd packages/esm-patient-vitals-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the fix, pin it in
`spa-assemble-config.json` and delete this directory.
