# @openmrs/esm-patient-tests-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with one fix that is not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/tests-13.0.2-pre.12863-patched`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #548 | A lab test, X-ray or procedure whose concept is already active for the patient in the same order type is tagged « Déjà actif » in the order basket search, and « Ajouter à l'ordonnance » / « Prescrire » stay disabled until « Cet examen est déjà actif. Le demander à nouveau » is ticked. The active orders are filtered in the browser by order type, concept, action and stopped date, because OpenMRS ignores search parameters it does not support. | [openmrs-esm-patient-chart 3863](https://github.com/openmrs/openmrs-esm-patient-chart/pull/3863) |

The server does not check this: OpenMRS core refuses a second active order of the same concept only
for drug orders. The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-tests-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-tests-app.tgz`.

To rebuild, on the fork branch, with Node 22:

```sh
yarn install --immutable
cd packages/esm-patient-tests-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the fix, pin it in
`spa-assemble-config.json` and delete this directory.
