# @openmrs/esm-form-engine-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published), with the form engine library it bundles,
`@openmrs/esm-form-engine-lib` 5.0.1-pre.2754 (source `88459d3`), patched with fixes that are
not released upstream yet. Only the built module is here; the sources are:

- library: `jnsereko/openmrs-esm-form-engine-lib`, branch `uvl/5.0.1-pre.2754-841` (on top of `-768`, `uvl/5.0.1-pre.2754-759`, `-751`,
  `-725`, `-723`, `-719`, `-691` and `-677`);
- app: `jnsereko/openmrs-esm-patient-chart`, branch `uvl/form-engine-13.0.2-pre.12863-841`
  (on top of `-768`, `-759`, `-751`, `-725`, `-723`, `-719`, `-691` and `-677`: the English keys, the version, since
  #691 the config key `sessionLocationEncounterTypes` passed on to the library, and since #759 the
  config key `excludedProviderIdentifiers` the library reads).

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
| #723 | A number the form shows is written with the session's decimal mark, as the field takes it since #719: « 36,4 » in French, "36.4" in English. That is the field's text for a value it was not typed (an encounter being edited, a calculated field such as BMI), the read view, the previous value, and the limit in the range messages (« La valeur doit être de 37,7 au maximum »). The mark comes from `Intl` for the i18next language; the digits are those of `String(value)`, nothing is rounded or grouped. What is typed stays as typed (`.uvl.9`) | none yet |
| #725 | A search list (diagnoses, problems, drugs, locations, providers: `ui-select-extended`) keeps only an entry picked from it. Text typed without picking one was emptied on leaving the field and the form saved without it, silently. Leaving the field with such text now shows an error naming it (key `textNotPickedFromList`) and blocks the save, with the invalid-fields snackbar (#577); picking an entry or clearing the field removes it. A label typed in full is not picked for the user either (`.uvl.10`) | none yet |
| #751 | A number field is bounded by its concept's absolute limits as well as the form's `min`/`max`, the stricter of each winning: the server refuses an obs outside `hiAbsolute`/`lowAbsolute` (ObsValidator, HTTP 400 on save), so « Température » at 47,5 against a limit of 47 now reads « La valeur doit être de 47 au maximum » on the field and the save is blocked by the invalid-fields snackbar (#577). The limits come with the concepts the form already loads (`hiAbsolute,lowAbsolute` added to the `conceptreferences` representation; a concept that is not numeric has none). A server range error the server leaves untranslated (`error.value.outOfRange.high`/`.low`, `error.outOfRange.high`/`.low`; the REST error names neither field nor limit) shows `valueAboveAcceptedMaximum` / `valueBelowAcceptedMinimum` instead of the key (`.uvl.11`) | none yet |
| #759 | A provider field (`encounterProvider`, `provider_datasource`) reads every active provider, page by page (`limit=100`): it asked once with the REST default, which returns 50, so at 54 providers four staff were missing from the list. Typed text is searched on the server (`provider?q=`, encoded) when the form marks the field `isSearchable`, as UVL's forms now do. Providers whose identifier is in the new config key `excludedProviderIdentifiers` (default empty; an entry ending with `*` is a prefix) are never offered, nor those in the field's datasource config `excludedIdentifiers`; UVL lists `admin` and `service-account-*` (the Keycloak service accounts). A provider already set on the encounter still shows (`.uvl.12`). A searchable list (`ui-select-extended`, `isSearchable`) searches the server for every typed term: it skipped the search when a loaded entry contained the text, so a doctor signed in as one « Pacifique » was offered only himself. A search with no match empties the list (it kept the previous results, which could be picked by mistake); the selected entry is remembered apart from the list, so the field keeps its value. Editing an encounter without touching its provider field keeps the encounter's providers: the save fell back to the signed-in user and added them as a second provider (`.uvl.13`). Leaving a search list with typed text that is no entry's label, while an entry is picked, no longer flags the text (#725): Carbon writes the picked entry back, but the error stayed and blocked the save until the field was left again. Changing the provider field of an edited encounter replaces the encounter's provider in that role: the REST `encounterProviders` setter only adds, so the old one is sent as `{uuid, voided: true}` in the same save; providers of other roles stay (`.uvl.14`) | none yet |
| #768 | Text left in a search list (`ui-select-extended`) without picking an entry is settled against the entries found for it, not only against exact labels. A provider is listed as « identifier - name », so typing another provider's name in full (« Nephtalie CIMANA ») over the picked one and leaving the field or saving put the picked provider back and saved it, silently. Now the one entry the text names is picked: by its label, its display, or, for an entry with an identifier, the name after « identifier - » or the identifier, ignoring case and repeated spaces. Text naming several entries keeps the « n'est pas enregistré » error (#725) and blocks the save; text naming none puts the picked entry back with no error (#759), or is flagged when none is picked (#725). Text left before its search has answered blocks the save until the answer, then is settled the same way. The picked entry is put back through the combobox, so the input shows it on Tab too: Tab left the typed text on screen while the save used the pick. A label typed in full with no entry picked is now picked rather than flagged (`.uvl.15`) | none yet |
| #841 | A new encounter dated by the form's own date question (Inpatient Follow-up, IPD Monitoring, Partograph Reading, Anaesthesia Monitoring) is filed at the visit's start when it falls before it on the visit's first day (a date-only picker gives 00:00), and at the visit's stop when it falls after it on the day the visit stopped; the server refuses an encounter outside its visit's window (`Encounter.datetimeShouldBeInVisitDatesRange`, HTTP 400; the bounds themselves are accepted). A date on another day is kept. A form saved into a visit ended meanwhile (#677) was filed at the visit's start and is now filed at its stop. The server's refusal reads « La date du formulaire est en dehors de sa visite … » (key `encounterDatetimeOutsideVisit`, French in the frontend config) instead of its English sentence (`.uvl.16`) | none yet |

UVL lists Admission, Transfer, Transfer Request (the « Ward Admission » form) and Discharge in
`sessionLocationEncounterTypes`: these are recorded at the ward the user works in. Every other UVL
form counts under the visit's service. The vitals app (#678), the order basket and visit notes
(#691) follow the same rule; immunizations are not patched (UVL records none).

The browser console logs `Unknown config key '@openmrs/esm-form-engine-app.sessionLocationEncounterTypes'
provided. Ignoring.` when a form opens. That is not true (#724): the key is in this build's schema
(`src/config-schema.ts` of the app branch) and its value is used. Frontend core 11.0.0 checks the
form widget's config against the bare implicit schema when the widget mounts, before the module's
`startupApp()` has defined the real one, and despite « Ignoring » it keeps the value. Checked on UAT
(build b31, 16–17 Nov 2026): Transfer Request encounters were filed at the user's ward when the
visit was elsewhere, while every other form encounter sat at its visit's location. Fixed upstream in
openmrs/openmrs-esm-core#1946 (O3-6135), not in a release yet; the warning goes when `coreVersion`
moves to a core that contains it. A key the module really does not know would be logged too, so
check a new key against `config-schema.ts` rather than the console.

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-form-engine-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-form-engine-app.tgz`.

`package.json` is the one npm published for 13.0.2-pre.12863, with `version` changed.

To rebuild, with Node 22:

```sh
# library
cd openmrs-esm-form-engine-lib          # branch uvl/5.0.1-pre.2754-841
yarn install --immutable && yarn test && yarn build

# app, bundling that library build
cd openmrs-esm-patient-chart            # branch uvl/form-engine-13.0.2-pre.12863-841
yarn install --immutable
rsync -a --delete ../openmrs-esm-form-engine-lib/dist/ node_modules/@openmrs/esm-form-engine-lib/dist/
# the library's types are its src/ (package.json "types"): without it the app build fails on the new props
rsync -a --delete ../openmrs-esm-form-engine-lib/src/ node_modules/@openmrs/esm-form-engine-lib/src/
cd packages/esm-form-engine-app
yarn test
rm -rf dist && yarn build
```

then copy `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version` with each change:
the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build whose form engine library contains the fix, pin it in
`spa-assemble-config.json`, remove the tarball step from `distro/pom.xml` and delete this
directory.
