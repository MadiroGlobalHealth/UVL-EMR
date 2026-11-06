# @openmrs/esm-ward-app 12.1.1, patched for UVL

The pinned release 12.1.1 (tag `v12.1.1`, the npm `gitHead`; a build of it matches the npm
package) with two changes that are not released upstream yet. Only the built module is here; the
source is `jnsereko/openmrs-esm-patient-management`, branch `uvl/ward-12.1.1-patched`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #246 | New config option `restrictTransferLocationsToVisitLocation` (default `true`, upstream behaviour since O3-4328). Set to `false`, the transfer and "Admit elsewhere" location list offers every location tagged as a transfer location, not only those below the patient's visit location | openmrs/openmrs-esm-patient-management#2853 |
| #529 | The patient card's "Admitted: …" is in the session language (« Admis : il y a 2 heures »), not dayjs English ("a few seconds ago") | openmrs/openmrs-esm-patient-management#2854 |

Mugamba needs it because each service is its own visit location and the wards sit under
« Hospitalisation (IPD) »; the option is set to `false` in the site frontend config.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-ward-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-ward-app.tgz`.

To rebuild, on the fork branch, with Node 22:

```sh
yarn install --immutable
cd packages/esm-ward-app
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `-uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

Once both PRs are released, pin the release in `spa-assemble-config.json` and delete this directory.
