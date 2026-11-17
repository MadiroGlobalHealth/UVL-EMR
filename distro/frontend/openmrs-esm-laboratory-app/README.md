# @openmrs/esm-laboratory-app 1.6.0, patched for UVL

The pinned release 1.6.0 (tag `v1.6.0`, the npm `gitHead`) with one change that is not released
upstream yet. Only the built module is here; the source is `jnsereko/openmrs-esm-laboratory-app`,
branch `uvl/1.6.0-737`.

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #737 | The order status pill is translated (« En cours », « Terminé », « Reçu », « Refusé », « En attente », « En attente de validation »): it showed the raw status capitalised (« In progress »), which no translation could reach (keys `fulfillerStatus*`). The worklist's pagination is translated (« Éléments par page : », « 1–10 sur 25 éléments », « sur 3 pages »): `TranslatedPagination` gives Carbon's `Pagination` translated texts (Carbon has only English defaults). Carbon's screen-reader label « Page of N pages » has no prop and stays English | not opened yet |

The French strings are in the fork's `translations/fr.json`.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-laboratory-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-laboratory-app.tgz`.

To rebuild, on the fork branch (Node 26 needs `NODE_OPTIONS=--no-experimental-webstorage` for the
tests):

```sh
yarn install --immutable
yarn verify
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `-uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

Once the fix is released, pin the release in `spa-assemble-config.json` and delete this directory.
