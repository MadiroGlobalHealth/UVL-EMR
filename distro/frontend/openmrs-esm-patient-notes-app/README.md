# @openmrs/esm-patient-notes-app 13.0.2-pre.12863, patched for UVL

The pinned pre-release 13.0.2-pre.12863 (built from openmrs-esm-patient-chart `2eeffea`, the
commit CI run 12863 published; its source is identical to the npm package) with fixes that are not
released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-chart`, branch `uvl/notes-13.0.2-pre.12863-691`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #691 | A new visit note is filed at its visit's location (the service the visit was started for), not the user's sign-in location; without a visit location, at the sign-in location. Editing a note keeps its location: it was moved to the editor's sign-in location (`.uvl.1`) | none yet |

The change is in the notes app only. The shared `esm-patient-common-lib` (a singleton across the
patient-chart apps, so possibly another app's copy at runtime) is unchanged and only supplies the visit,
as it already did.

The other patient-chart apps stay on the npm 13.0.2-pre.12863 packages, except the patched builds
next to this directory.

## Build and ship

As for `openmrs-esm-patient-orders-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-patient-notes-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-patient-notes-app.tgz`.

`package.json` is the one npm published for 13.0.2-pre.12863, with `version` changed.

To rebuild, on the fork branch:

```sh
yarn install --immutable
cd packages/esm-patient-notes-app
yarn test
rm -rf dist && yarn build
```

then copy `dist/` (without `*.map`) here. Bump the `.uvl.N` suffix of `version` with each change:
the assembled directory is named after it, which is what breaks browser caches.

When the patient-chart apps move to a build that contains the fix, pin it in
`spa-assemble-config.json`, remove the tarball step from `distro/pom.xml` and delete this
directory.
