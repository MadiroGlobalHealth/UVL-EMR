# @openmrs/esm-stock-management-app 3.3.1, patched for UVL

The pinned release 3.3.1 (tag `v3.3.1`, the npm `gitHead`; a build of it matches the npm package)
with fixes that are not released upstream yet. Only the built module is here; the source is
`jnsereko/openmrs-esm-stock-management-app`, branch `uvl/3.3.1`. UVL-EMR #447.

| Fix | Upstream |
|---|---|
| The expiry date of a received batch is saved on the day picked, not the day before, in browsers east of UTC: the item's `expiration` is sent as `YYYY-MM-DD` | not yet |
| The bin button on an operation line deletes the line (it opened the line's edit form) | `jnsereko/openmrs-esm-stock-management-app`, branch `fix/operation-item-delete` |
| The search inside an expanded operation is case-insensitive | not yet |
| No red « Demande de stock associée Requise » message when a Stock Issue is opened without a requisition | not yet |
| Names read « X » instead of « X (X) » when an item's common name is its drug name (home Délivrance and Réception cards, received-items step, printout) | not yet |
| The location picker the server checks permissions on (the source when it is a location, otherwise the destination) offers only the locations of the user's stock role scopes for that operation type. System Developers, and users without a scope for the operation type, see every location as before | not yet |
| « Start New », the Overview/Operations/Items side menu, the confirmation dialogs and the home modals' column headers are translatable | not yet |
| The Items page no longer overflows the window horizontally | not yet |
| The Responsible Person picker narrows the listed users as you type, searches after 300 ms instead of 1 s, and new config `responsiblePersonExcludedRoles` leaves out system accounts | not yet |

The list's refresh after Complete and other status changes is already in 3.3.1 (3.2.1 revalidated a
cache the app did not read); the branch only adds a test for it.

French for the new and mistranslated strings is in the site frontend config's `Translation
overrides` for `@openmrs/esm-stock-management-app`, like the other modules.

## Build and ship

As for `openmrs-esm-ward-app`: `distro/pom.xml` packs `package.json` and `dist/` into
`distro/target/uvl-frontend-modules/openmrs-esm-stock-management-app.tgz`, and
`spa-assemble-config.json` pins the module as `file:openmrs-esm-stock-management-app.tgz`.

To rebuild, on the fork branch, with Node 22 (the tests fail to start on Node 26):

```sh
yarn install --immutable
yarn test
rm -rf dist && yarn build
```

then copy `package.json` and `dist/` (without `*.map`) here. Bump the `-uvl.N` suffix of `version`
with each change: the assembled directory is named after it, which is what breaks browser caches.
The build shares Carbon, React and the framework exactly as the npm 3.3.1 package does
(`@carbon/react` singleton, `requiredVersion` `1.x`), so the app shell's pins are unaffected.

Once the fixes are released, pin the release in `spa-assemble-config.json` and delete this directory.
