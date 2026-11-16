# @openmrs/esm-patient-orders-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/orders-13.0.2-pre.12863-patched`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #677 | « Signer et fermer » first reads the visit's dates again. If the visit was ended while the order basket was open (another tab, another user, the task that closes the day's visits at midnight), nothing is posted: a warning says when the visit ended and that the basket is kept, and signing again saves the orders in that ended visit. It was rejected with `Encounter.datetimeShouldBeInVisitDatesRange` and only « Invalid Submission » on screen (`.uvl.1`) | none yet |
| #683 | The encounter the order basket creates has the orderer as its provider, in the encounter role of the new config key `ordererEncounterRole` (default the Clinician role `240b26f9-dd88-4172-823d-4a8bfeb7841f`, as vitals and visit notes use; empty keeps the old behaviour). It had no provider, so the chart showed « Aucun professionnel de santé » (`.uvl.2`) | none yet |

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
