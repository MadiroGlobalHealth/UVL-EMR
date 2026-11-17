# @openmrs/esm-patient-medications-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/727-medications-decimal-separator` (on top of
`uvl/medications-13.0.2-pre.12863-patched`).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #679 | A new drug order starts with « Renouvellements » at 0 instead of empty, so it no longer has to be typed in on every order (a cleared field is still required while `drugOrder.requireOutpatientQuantity` is on). After a save is refused, the missing fields are listed in a notification next to the save button, which clears as they are filled; on a tablet the refills field also shows its own error. | not yet |
| #727 | Dose, duration, quantity to dispense and refills are text fields (`inputMode="decimal"`) instead of `<input type="number">`, which a French-locale Windows browser empties at a typed dot (a dose of « 2.5 » was saved as 5). « 2.5 » and « 2,5 » both save 2.5; whole numbers stay whole; letters, a minus sign and a second separator are ignored. The form's checks are unchanged; a dose of 0 now reaches them on save, so it is also listed by the save button. The field is the app's own `src/components/decimal-text-input.component.tsx`, not common-lib (`.uvl.2`) | not yet |

The upstream config has no key for a refills default: the only switch is the global property
`drugOrder.requireOutpatientQuantity`, which would also make the quantity to dispense optional.
« Indication » stays required (`requireIndication`, default `true`); set it to `false` in the
site's frontend config to make it optional.

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages, apart from their own
patched builds in `distro/frontend`.

## Build and ship

As for `openmrs-esm-patient-vitals-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-medications-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-medications-app.tgz`.

To rebuild, on the fork branch:

```sh
yarn install --immutable
cd packages/esm-patient-medications-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the fix, pin it in
`spa-assemble-config.json` and delete this directory.
