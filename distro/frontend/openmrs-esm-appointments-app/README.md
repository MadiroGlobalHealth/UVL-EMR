# @openmrs/esm-appointments-app 12.1.1, patched for UVL

The pinned release 12.1.1 (tag `v12.1.1`, the npm `gitHead`) with one change that is not released
upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-patient-management`, branch `uvl/appointments-12.1.1-766`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #766 | The appointment form's provider list holds every active provider: it was read with no `limit`, so OpenMRS returned its default 50 and staff past the 50th could not be chosen. It is now read page by page (`useOpenmrsFetchAll`, 100 at a time). The new config key `excludedProviderIdentifiers` leaves providers out by identifier (an entry ending with `*` is a prefix); the provider the form preselects (the appointment's, or the signed-in user's) stays listed even when excluded, so the form shows the provider it saves | not opened yet |

The site frontend config sets `excludedProviderIdentifiers` to `["admin", "service-account-*"]`, as
for the form engine (#759). Retired providers are not listed: OpenMRS leaves them out of
`GET provider`.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-appointments-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-appointments-app.tgz`.

To rebuild, on the fork branch (Node 26 needs `NODE_OPTIONS=--no-experimental-webstorage` for the
tests):

```sh
yarn install --immutable
cd packages/esm-appointments-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `-uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

Once the fix is released, pin the release in `spa-assemble-config.json` and delete this directory.
