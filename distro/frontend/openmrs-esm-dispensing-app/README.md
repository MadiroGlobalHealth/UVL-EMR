# @openmrs/esm-dispensing-app 1.11.2, patched for UVL

The pinned release 1.11.2 with two fixes that are not released upstream yet. Only the built
module is here; the source is `jnsereko/openmrs-esm-dispensing-app`, branch `uvl/1.11.2-patched`
(tag `v1.11.2` plus the commits below).

| UVL-EMR | Fix | Upstream PR |
|---|---|---|
| #541 | The duration reads "pendant 5 jours", not "for 5 d" (translated and pluralised keys `forDuration*`) | openmrs/openmrs-esm-dispensing-app#954 |
| #394 | With `restrictTotalQuantityDispensed`, a new dispense pre-fills the quantity remaining, and a partial dispense is tagged "Partially dispensed 2/5" (`partiallyDispensed`) instead of "Dispensed" | openmrs/openmrs-esm-dispensing-app#955 |

French strings for the new keys come from the site frontend config.

## Build and ship

As for `esm-uvl-imaging-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-dispensing-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-dispensing-app.tgz`.

To rebuild, on the fork branch, with Node 22:

```sh
yarn install --immutable
yarn verify
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `-uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.

Once both PRs are released, pin the release in `spa-assemble-config.json` and delete this directory.
