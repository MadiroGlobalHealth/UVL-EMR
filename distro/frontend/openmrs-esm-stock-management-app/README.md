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
| The Responsible Person picker narrows the listed users as you type, searches after 300 ms instead of 1 s, and new config `responsiblePersonExcludedRoles` leaves out system accounts (role names match whatever their case) | not yet |
| uvl.2: the Items and Operations tables and toolbars fit 1366 px in French (wrapping names and headers, growing toolbars, Start New sized to its label) | not yet |
| uvl.2: the Sources, User role scopes and Settings side-menu links need `Task: stockmanagement.stockSources.mutate`, `Task: stockmanagement.userRoleScopes.mutate` and `Manage Global Properties` | not yet |
| uvl.2: the issue batch picker lists the batch that expires soonest first | not yet |
| uvl.2: the home Receiving card lists completed receipts, newest first | not yet |
| uvl.2: « Expiring stock / In 6 months » counts batches from their own expiry date | not yet |
| uvl.2: the confirm button, side menu, step names, details heading, validation messages, batch label and Operations filters are translatable | not yet |
| uvl.3: the wrapped toolbars of Items and Operations grow instead of covering the table header, whatever order Carbon's stylesheet loads in | not yet |
| uvl.3: operation statuses, pagination, the batch actions bar and « Source Required » are translatable | not yet |
| uvl.4: the toolbar section itself grows too (on Carbon 1.119 both it and its content are fixed at 3rem), Operations cells wrap | not yet |
| uvl.4: AUTHORIZED status, home card statuses, availability, Stock Issue source message, plurals, inventory alert quantities | not yet |
| uvl.5: long operation numbers wrap after each « - » (the Numéro button may shrink), expanded-row search placeholder translatable | not yet |
| uvl.6: Operations, Items and the operation items step (« Suivant ») fit 1280 px with Carbon's stylesheet loaded last (narrower header and cell padding that outranks Carbon's, no empty « details » column, headers wrap between words only, the item name button and the stepper shrink); operation numbers break only after « - » | not yet |
| uvl.6: filtering Operations with a row open no longer crashes (`reading 'operationTypeUuid'`): open rows close when a filter changes and the opened row finds its operation by uuid | not yet |
| uvl.6: « Available » is the quantity at the operation's own location (its source, or a receipt's destination), all batches, not the total of every location | not yet |
| uvl.6: Reject and Return icons the right way round; page picker, expand/collapse row and sort labels translatable | not yet |
| uvl.7: the batch picker lists the batches with stock at the operation's location (source, or a receipt's destination), with the quantity there, from that location's inventory; it matched `stockbatch` rows to the first inventory row of any location | not yet |
| uvl.7: Operations pages on the server (`startIndex` is a page number, `limit`, `totalCount`); it paged the server's first 50 in the browser | not yet |
| uvl.7: Items name cells break long words anywhere, so the table fits 1280 px; Items and Operations pagination clear the help button | not yet |
| uvl.7: an operation that is not new or returned opens as « View », without item search, edit or delete; toolbar menu, Start New menu and the operation form's ComboBox buttons translatable | not yet |

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
