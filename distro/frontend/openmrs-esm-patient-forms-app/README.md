# @openmrs/esm-patient-forms-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with changes that are
not released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/forms-13.0.2-pre.12863-patched`.

| UVL-EMR | Change | Upstream PR |
|---|---|---|
| #518 | New config `formVisitTypeRestrictions`: each entry names a form (name or UUID) and the visit types (UUIDs) it is offered on. While the patient has an active visit, a listed form is only offered if the visit's type is one of them; unlisted forms, and every form when there is no active visit, are offered as before. | not opened yet |
| #662 | A click anywhere on a row of the forms list opens the form (the name, the « Dernière modification » cell, the padding), not only the form-name link. (`.uvl.2`) | not opened yet |

The site configuration (`uvl-mugamba-frontend-config.json`) restricts only « UVL Outpatient
Consultation Form », to the « Outpatient visit » and « General » visit types. The inpatient,
maternity and theatre forms stay on every visit type, because a patient can be admitted on an
outpatient visit (the visit type does not change on admission) and still needs them.

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-forms-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-forms-app.tgz`.

To rebuild, on the fork branch, with Node 22 (on Node 25 or later, run the tests with
`NODE_OPTIONS=--no-experimental-webstorage`):

```sh
yarn install --immutable
cd packages/esm-patient-forms-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the changes, pin it in
`spa-assemble-config.json` and delete this directory.
