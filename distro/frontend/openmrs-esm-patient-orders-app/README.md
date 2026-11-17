# @openmrs/esm-patient-orders-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/752-orders-decimal-display` (on top of
`uvl/727-orders-decimal-separator`, `uvl/orders-13.0.2-pre.12863-691` and
`uvl/orders-13.0.2-pre.12863-patched`).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #677 | « Signer et fermer » first reads the visit's dates again. If the visit was ended while the order basket was open (another tab, another user, the task that closes the day's visits at midnight), nothing is posted: a warning says when the visit ended and that the basket is kept, and signing again saves the orders in that ended visit. It was rejected with `Encounter.datetimeShouldBeInVisitDatesRange` and only « Invalid Submission » on screen (`.uvl.1`) | none yet |
| #683 | The encounter the order basket creates has the orderer as its provider, in the encounter role of the new config key `ordererEncounterRole` (default the Clinician role `240b26f9-dd88-4172-823d-4a8bfeb7841f`, as vitals and visit notes use; empty keeps the old behaviour). It had no provider, so the chart showed « Aucun professionnel de santé » (`.uvl.2`). The basket posts this encounter with its own copy of common-lib's `postOrdersOnNewEncounter` (`src/order-basket/post-order-encounter.ts`): common-lib is a shared singleton across the patient-chart apps, so a change made in it ran as another app's stock copy and the provider was dropped (`.uvl.3`) | none yet |
| #691 | The order encounter is filed at the visit's location (the service the visit was started for), not the user's sign-in location: the location chosen in the order location picker if `orderLocationTagName` shows it, else the visit's location, else the sign-in location. Decided in the order basket and passed to its own `post-order-encounter.ts`, not through common-lib (`.uvl.4`) | none yet |
| #727 | Numeric lab results are a text field (`inputMode="decimal"`) instead of `<input type="number">`, which a French-locale Windows browser empties at a typed dot (« 4.5 » was saved as 5). « 4.5 » and « 4,5 » both save 4.5; a leading minus is still accepted; letters and a second separator are ignored. The whole-number and range messages are unchanged. The field is the app's own `src/components/decimal-text-input.component.tsx`, not common-lib (`.uvl.5`) | none yet |
| #752 | A numeric lab result is written with the session language's decimal mark, « 95,4 mg/dl », « 4,5 % » in French: the results table of a test order (the Laboratory « Terminé » tab, the Orders tab) and its printout. Its interpretation (high, low) still comes from the number. A drug order's dose, duration and quantity in the Orders tab too. The helper is the app's own `src/utils/format-decimal.ts`, not common-lib (`.uvl.6`) | none yet |

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
