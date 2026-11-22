# @openmrs/esm-patient-orders-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/872-orders-server-error-message` (on top of `uvl/869-orders-field-errors`, `uvl/838-orders-lab-result-missing-member`, `uvl/765-orders-first-paint`, `uvl/760-orders-date-utc`,
`uvl/752-orders-decimal-display`, `uvl/727-orders-decimal-separator`, `uvl/orders-13.0.2-pre.12863-691` and
`uvl/orders-13.0.2-pre.12863-patched`).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #677 | « Signer et fermer » first reads the visit's dates again. If the visit was ended while the order basket was open (another tab, another user, the task that closes the day's visits at midnight), nothing is posted: a warning says when the visit ended and that the basket is kept, and signing again saves the orders in that ended visit. It was rejected with `Encounter.datetimeShouldBeInVisitDatesRange` and only « Invalid Submission » on screen (`.uvl.1`) | none yet |
| #683 | The encounter the order basket creates has the orderer as its provider, in the encounter role of the new config key `ordererEncounterRole` (default the Clinician role `240b26f9-dd88-4172-823d-4a8bfeb7841f`, as vitals and visit notes use; empty keeps the old behaviour). It had no provider, so the chart showed « Aucun professionnel de santé » (`.uvl.2`). The basket posts this encounter with its own copy of common-lib's `postOrdersOnNewEncounter` (`src/order-basket/post-order-encounter.ts`): common-lib is a shared singleton across the patient-chart apps, so a change made in it ran as another app's stock copy and the provider was dropped (`.uvl.3`) | none yet |
| #691 | The order encounter is filed at the visit's location (the service the visit was started for), not the user's sign-in location: the location chosen in the order location picker if `orderLocationTagName` shows it, else the visit's location, else the sign-in location. Decided in the order basket and passed to its own `post-order-encounter.ts`, not through common-lib (`.uvl.4`) | none yet |
| #727 | Numeric lab results are a text field (`inputMode="decimal"`) instead of `<input type="number">`, which a French-locale Windows browser empties at a typed dot (« 4.5 » was saved as 5). « 4.5 » and « 4,5 » both save 4.5; a leading minus is still accepted; letters and a second separator are ignored. The whole-number and range messages are unchanged. The field is the app's own `src/components/decimal-text-input.component.tsx`, not common-lib (`.uvl.5`) | none yet |
| #752 | A numeric lab result is written with the session language's decimal mark, « 95,4 mg/dl », « 4,5 % » in French: the results table of a test order (the Laboratory « Terminé » tab, the Orders tab) and its printout. Its interpretation (high, low) still comes from the number. A drug order's dose, duration and quantity in the Orders tab too. The helper is the app's own `src/utils/format-decimal.ts`, not common-lib (`.uvl.6`). The Orders tab's row of a drug order is written from its fields, « Paracetamol Sirop 120mg/5ml — 2,5 millilitre — orale — deux fois par jour — pour 3 jours », instead of the server's « (NEW) …: 2.5 Millilitre Orale … »; a revised, renewed or discontinued order is named « (Modifier) », « (Renouveler) », « (Interrompre) ». The fields come from the request the expanded row already makes; the server's text shows until they arrive and is what the search matches (`.uvl.7`; `.uvl.6` reached UAT and is not to be reused) | none yet |
| #760 | The Orders tab's period is sent as the first and last instants of the local days with their UTC offset (« 2026-11-18T00:00:00.000+0200 »), not as date-only strings, which OpenMRS read as days of the server's time zone (UTC): orders placed between 00:00 and 02:00 Burundi time did not show under « today ». OpenMRS rounds these bounds out to whole server days, so the tab keeps only the orders activated within the period. Fetched with the app's own `src/hooks/usePatientOrdersInPeriod.ts`, not common-lib (`.uvl.8`) | none yet |
| #765 | The Orders tab's row of a drug order never shows the server's « (NEW) …: 2.5 Millilitre Orale … » first: the orders list is read without the drug fields, so the row shows a one-line placeholder (`SkeletonText`) until `useDrugOrderByUuid` answers, then the French line of #752. An order that already carries its fields is written at once, without that request; if they cannot be read, the line is written from what the order has (drug or concept, action). The search still matches the server's text (`.uvl.9`) | none yet |
| #838 | A lab result added after the first save is no longer lost. The form saved the typed values of a test that already has results by updating each one's observation; a set member left empty at the first save has none, so the form sent `POST /obs/undefined` (404), the value was lost and « Could not save results for … » showed. A typed value without an observation is now added to the saved result group of its set with `POST /obs/<group>` carrying only the new members in `groupMembers` (person, concept, obsDatetime, order, value, status FINAL): the server appends them to the group and keeps the existing members, and it refuses `obsGroup` on `POST /obs` (400, `uvl.10`). That request goes after the updates of the same save have settled; a set with no saved group at all is created with its members (`POST /obs`), a test outside a set with `POST /obs`. Members left empty send nothing, and a value that has an observation is updated as before. The first save and the error message are unchanged. Same code when the order is not completed but has results saved by an earlier attempt. In the app's own `src/lab-results/lab-results.resource.ts` (`createResultSaveRequests`, `addObservation`) (`.uvl.11`) | none yet |
| #869 | When the server refuses « Signer et fermer », the basket's error notice gives the reason instead of only « Invalid Submission »: the field errors and global errors of the answer, in French when the code is known (a duration without its unit, a quantity without its unit: `DrugOrder.error.durationUnitsRequiredWithDuration`, `…quantityUnitsRequiredWithQuantity`) and as the server worded them otherwise, under the title « Les prescriptions n'ont pas été enregistrées ». An answer with no field errors shows what it showed before. In the app's own `src/order-basket/order-refusal.ts`; the translation keys are listed in a comment of `order-basket.component.tsx`, which is what the extractor reads (`.uvl.12`) | none yet |
| #872 | When the server refuses the orders with an error that is not a field error (an HTTP 500, for example), the basket shows a readable sentence under « Les prescriptions n'ont pas été enregistrées », not the raw message key (`[Order.cannot.have.more.than.one]`). The key `Order.cannot.have.more.than.one` (a second active prescription of the same medicine) reads « Ce patient a déjà une prescription active pour ce médicament. Arrêtez ou modifiez la prescription existante. »; another message key shows the server's own readable sentence (`translatedMessage`) when it sent one, otherwise « Le serveur a refusé la prescription. » followed by the key in brackets for support; a message that is already a sentence is shown as it is. Field errors are shown as before (#869). In the app's own `src/order-basket/order-refusal.ts`; the two new translation keys are listed in the comment of `order-basket.component.tsx` (`.uvl.13`) | none yet |

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages, except the patched builds
next to this directory.

## Build and ship

As for `openmrs-esm-patient-vitals-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-orders-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-orders-app.tgz`.

`package.json` is the one npm published for 13.0.2-pre.12863, with `version` changed.

To rebuild, on the fork branch:

```sh
yarn install --immutable
cd packages/esm-patient-orders-app
yarn test
rm -rf dist && yarn build
```

then copy `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version` with each change:
the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the fix, pin it in
`spa-assemble-config.json`, remove the tarball step from `distro/pom.xml` and delete this
directory.
