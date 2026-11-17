# @openmrs/esm-form-engine-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published), with the form engine library it bundles,
`@openmrs/esm-form-engine-lib` 5.0.1-pre.2754 (source `88459d3`), patched with fixes that are
not released upstream yet. Only the built module is here; the sources are:

- library: `jnsereko/openmrs-esm-form-engine-lib`, branch `uvl/5.0.1-pre.2754-719` (on top of `uvl/5.0.1-pre.2754-691`,
  itself on top of `uvl/5.0.1-pre.2754-677`);
- app: `jnsereko/openmrs-esm-patient-chart`, branch `uvl/form-engine-13.0.2-pre.12863-719`
  (on top of `uvl/form-engine-13.0.2-pre.12863-691` and `-677`: the English keys, the version, and since
  #691 the config key `sessionLocationEncounterTypes` passed on to the library).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #499 | The field validation messages ("Field is mandatory", decimals, number range, text length, future dates) go through the translations of `@openmrs/esm-form-engine-app`, so a French session can show them in French (fr `Translation overrides` in the frontend config) | openmrs/openmrs-esm-form-engine-lib#856, openmrs/openmrs-esm-patient-chart#3860 |
| #500 | A number limit reads "Value must be at most {{max}}" / "at least {{min}}" (keys `valueMustBeAtMost`, `valueMustBeAtLeast`): the limit itself is allowed, which "lower than" / "greater than" contradicted | same |
| #571 | Switching a radio from one answer to another shows the new answer as selected. The click handler cancelled the click and the browser restored the old radio, while the field kept the new value | openmrs/openmrs-esm-form-engine-lib#859 |
| #577 | A save blocked by an invalid field shows an error snackbar (number of fields, first field's label; keys `formHasInvalidFields`, `invalidFieldsSummary`), scrolls to the first invalid field and focuses it | openmrs/openmrs-esm-form-engine-lib#860 |
| #602 | A date-time field's time input has its own id (`<field id>-time`) and shows only a time, never the date text ("does not conform to HH:mm"); beside a date picker it leaves the error and warning to the date picker, so no error icon covers the clock button. The invalid-fields snackbar closes after 8 s instead of piling up | none yet |
| #475 | In view mode, a radio, checkbox, select or content-switcher answer is translated as data entry translates it, `t(answer.label)`: the form's translations, else the concept's locale name the label falls back to. It showed the label as written in the form JSON. Also a test that a save flags every required field across sections and pages (#509) | none yet |
| #677 | Saving a new encounter first reads its visit's dates again. If the visit was ended while the form was open (another tab, another user, the task that closes the day's visits at midnight), the save stops with a warning (keys `visitHasEnded`, `visitEndedSaveToSaveInIt`) and the form stays filled; saving again files it in that ended visit, dated within it. It was rejected with `Encounter.datetimeShouldBeInVisitDatesRange` (`.uvl.6`) | none yet |
| #691 | A new encounter is filed at its visit's location (the service the visit was started for), not the user's sign-in location; without a visit, or a visit without a location, at the sign-in location. A form's own encounter location field still wins, and an edited encounter keeps its location. The new config key `sessionLocationEncounterTypes` (default empty) lists the encounter types that stay at the sign-in location. Nothing of it is in the shared `esm-patient-common-lib` (the app imports only a type from it): the logic is in the bundled library (`.uvl.7`) | none yet |
| #719 | A number field is a text input (`inputMode` decimal) that takes a dot or a comma as the decimal point: "36.4" and "36,4" both save 36.4, and a leading minus is kept. It was `<input type="number">`, which on a French-locale Windows browser empties itself on a typed dot ("36.4" saved as 4) and elsewhere read "36,4" as 364. Letters and a second separator are ignored as typed. The range messages (#500) and the decimals message are unchanged: the validators see the same number. The field has no stepper buttons any more (`.uvl.8`) | none yet |

UVL lists Admission, Transfer, Transfer Request (the « Ward Admission » form) and Discharge in
`sessionLocationEncounterTypes`: these are recorded at the ward the user works in. Every other UVL
form counts under the visit's service. The vitals app (#678), the order basket and visit notes
(#691) follow the same rule; immunizations are not patched (UVL records none).

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-form-engine-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-form-engine-app.tgz`.

`package.json` is the one npm published for 13.0.2-pre.12863, with `version` changed.

To rebuild, with Node 22:

```sh
# library
cd openmrs-esm-form-engine-lib          # branch uvl/5.0.1-pre.2754-719
yarn install --immutable && yarn test && yarn build

# app, bundling that library build
cd openmrs-esm-patient-chart            # branch uvl/form-engine-13.0.2-pre.12863-719
yarn install --immutable
rsync -a --delete ../openmrs-esm-form-engine-lib/dist/ node_modules/@openmrs/esm-form-engine-lib/dist/
cd packages/esm-form-engine-app
yarn test
rm -rf dist && yarn build
```

then copy `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version` with each change:
the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build whose form engine library contains the fix, pin it in
`spa-assemble-config.json`, remove the tarball step from `distro/pom.xml` and delete this
directory.
