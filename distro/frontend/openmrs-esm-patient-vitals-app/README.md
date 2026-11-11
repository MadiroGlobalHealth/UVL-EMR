# @openmrs/esm-patient-vitals-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/vitals-13.0.2-pre.12863-patched`.
The #564 changes are on branch `uvl/564-vitals-normal-ranges`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #347 | A new vitals encounter is saved with the visit in context, an `encounterDatetime` inside that visit when the visit is closed, and the logged-in provider (`vitals.clinicianEncounterRole`, default the Clinician role) | openmrs/openmrs-esm-patient-chart#3859 |
| #564 | The vitals form shows each vital's normal range under its input ("Normal: 60–100"; blood pressure as systolic / diastolic), from the concept's reference range for the patient. Values outside it are still flagged and still saved; only the absolute limits block saving. The range is inserted unescaped, so the slash shows as "/" and not "&#x2F;" (`.uvl.3`) | openmrs/openmrs-esm-patient-chart#3873 |

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
