# @openmrs/esm-patient-chart-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published) with a change that is not released upstream. Only the built module
is here; the source is `jnsereko/openmrs-esm-patient-chart`, branch
`uvl/222-visit-location-choice`.

| UVL-EMR | Change | Upstream PR |
|---|---|---|
| #222 | New config key `preselectVisitLocation` (default `true`, upstream behaviour). When `false`, the Start Visit form opens with an empty visit location and shows « Obligatoire » under it if the user tries to start the visit without choosing one, so the visit records the service point the user picked instead of the session location. Editing a visit keeps its location. | not opened yet |

UVL sets `preselectVisitLocation: false` in `sites/mugamba/configs/openmrs/frontend_config/uvl-mugamba-frontend-config.json`.
Setting it back to `true` (or removing it) restores the upstream behaviour without a rebuild.

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages, except the patched builds
next to this directory.

## Build and ship

As for `openmrs-esm-patient-vitals-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-chart-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-chart-app.tgz`.

To rebuild, on the fork branch:

```sh
yarn install --immutable
cd packages/esm-patient-chart-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the change, pin it in
`spa-assemble-config.json` and delete this directory.
