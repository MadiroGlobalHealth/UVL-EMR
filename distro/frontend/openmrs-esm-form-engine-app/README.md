# @openmrs/esm-form-engine-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published), with the form engine library it bundles,
`@openmrs/esm-form-engine-lib` 5.0.1-pre.2754 (source `88459d3`), patched with fixes that are
not released upstream yet. Only the built module is here; the sources are:

- library: `jnsereko/openmrs-esm-form-engine-lib`, branch `uvl/5.0.1-pre.2754-i18n`;
- app: `jnsereko/openmrs-esm-patient-chart`, branch `uvl/form-engine-13.0.2-pre.12863-i18n`
  (only the English keys and the version; the app source is unchanged).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #499 | The field validation messages ("Field is mandatory", decimals, number range, text length, future dates) go through the translations of `@openmrs/esm-form-engine-app`, so a French session can show them in French (fr `Translation overrides` in the frontend config) | openmrs/openmrs-esm-form-engine-lib#856, openmrs/openmrs-esm-patient-chart#3860 |
| #500 | A number limit reads "Value must be at most {{max}}" / "at least {{min}}" (keys `valueMustBeAtMost`, `valueMustBeAtLeast`): the limit itself is allowed, which "lower than" / "greater than" contradicted | same |
| #571 | Switching a radio from one answer to another shows the new answer as selected. The click handler cancelled the click and the browser restored the old radio, while the field kept the new value | openmrs/openmrs-esm-form-engine-lib#859 |
| #577 | A save blocked by an invalid field shows an error snackbar (number of fields, first field's label; keys `formHasInvalidFields`, `invalidFieldsSummary`), scrolls to the first invalid field and focuses it | openmrs/openmrs-esm-form-engine-lib#860 |

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-form-engine-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-form-engine-app.tgz`.

`package.json` is the one npm published for 13.0.2-pre.12863, with `version` changed.

To rebuild, with Node 22:

```sh
# library
cd openmrs-esm-form-engine-lib          # branch uvl/5.0.1-pre.2754-i18n
yarn install --immutable && yarn test && yarn build

# app, bundling that library build
cd openmrs-esm-patient-chart            # branch uvl/form-engine-13.0.2-pre.12863-i18n
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
