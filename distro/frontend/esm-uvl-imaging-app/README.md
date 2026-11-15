# @madiro/esm-uvl-imaging-app

UVL's "Imagerie" card on the patient chart's Attachments dashboard
(`patient-chart-attachments-dashboard-slot`): one row per radiology study, each with an
**Ouvrir dans le visualiseur** button that opens the study in the Orthanc Stone viewer.
UVL-EMR [#494](https://github.com/MadiroGlobalHealth/UVL-EMR/issues/494).

## Why it exists

The Orthanc bridge (`eip-openmrs-orthanc`) saves one preview attachment per study
(`radiology-image.png`) and puts the viewer link in its caption:

```
<orthanc public url>/stone-webviewer/index.html?study=<StudyInstanceUID>&orthancId=<Orthanc study id>
```

That link carries no credentials, so opening it gets 403 from Orthanc. Until frontend core 11
(#490) UVL shipped a patched patient-attachments app that traded the Orthanc study id for a token
first. Core 11 ships the stock attachments app, so the token step now lives here, in a module of
its own, instead of in a fork of an upstream app.

## How it works

1. `useAttachments(patientUuid, true)`: the same request, and SWR cache entry, as the
   Attachments card.
2. Keep the captions that are a viewer link (`stone-webviewer` or `orthancId=`), one per Orthanc
   study id, newest first.
3. On click, `GET <openmrsBase>/ws/rest/v1/orthanc/token?studyId=<plain Orthanc study id>`
   (orthanctoken module, `distro/binaries/openmrs/modules`), `credentials: include`. It returns
   `{ url }`, the finished viewer URL with a study-scoped token, which is opened in a new tab.
   A 401 sends the user through `/openmrs/oauth2login` and back.

The caption comes back from OpenMRS HTML-escaped, on UAT twice (`&amp;amp;orthancId=`). It is
unescaped until it stops changing: a single pass leaves `&amp;orthancId=`, the Orthanc id is then
not found, and the DICOM UID would be sent instead, which the token endpoint cannot resolve.

There is no privilege check of its own: the card sits on the Attachments dashboard, and the
token endpoint requires an authenticated OpenMRS session.

The logic is carried over from `jnsereko/openmrs-esm-patient-chart`, branch
`uvl-orthanc-attachment-token` (11897a0).

## Build and ship

`dist/` is committed, without source maps. The Maven build does not run npm: `distro/pom.xml`
packs `package.json` and `dist/` into `distro/target/uvl-frontend-modules/madiro-esm-uvl-imaging-app.tgz`,
and `distro/configs/openmrs/frontend_assembly/spa-assemble-config.json` pins the module as
`file:madiro-esm-uvl-imaging-app.tgz`. `openmrs assemble` then adds it to `importmap.json` and
`routes.registry.json` like any other ESM.

After changing anything under `src/` or `translations/`, rebuild and commit `dist/`:

```sh
cd distro/frontend/esm-uvl-imaging-app
npm ci --legacy-peer-deps
npm test
npm run build
git add -A dist
```

Bump `version` in `package.json` with each change: the assembled module directory is named after
it (`madiro-esm-uvl-imaging-app-<version>`), which is what breaks browser caches.

Strings are in `translations/en.json` and `translations/fr.json`; UVL's default locale is `fr`.
