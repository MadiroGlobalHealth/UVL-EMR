#!/usr/bin/env node
// Leaves « Modifier la langue par défaut » unticked when the change-language dialog opens (#681).
// Run by distro/pom.xml at compile, after "Rebuild OpenMRS Frontend if necessary" has
// assembled the frontend:
//   node scripts/patch-change-language-default.mjs <built frontend dir>
//
// The dialog is in @openmrs/esm-primary-navigation-app (frontend core 11.0.0, and still on
// openmrs-esm-core main). It opens with the checkbox ticked (`useState(true)`) and has no
// config key for it, so a user who switches language for a moment also rewrites their
// stored defaultLocale and signs in in that language next time. UVL staff work in French.
// `openmrs assemble` copies the module's prebuilt dist from npm, so this edits the one
// chunk that renders the checkbox: the state bound to `checked` starts false. Unticked,
// the dialog changes the session locale only; ticking the box still saves the default.
//
// Idempotent: a chunk already starting unticked is left alone. Fails when the chunk
// cannot be found or its code is not recognised, so a module bump cannot drop the fix
// silently. scripts/test/change-language-default/test.mjs runs the patched chunk.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const MODULE_DIR_PREFIX = 'openmrs-esm-primary-navigation-app-';
export const CHECKBOX = 'id:"change-default-locale"';

// Returns { text, changed } with the checkbox state initialised to false; throws when the
// code is not the shape this was written for.
export function untickDefaultLocale(text) {
  const at = text.indexOf(CHECKBOX);
  if (at < 0) {
    throw new Error(`no ${CHECKBOX} checkbox in the chunk`);
  }
  const checked = /checked:([\w$]+)[,}]/.exec(text.slice(at, at + 400));
  if (!checked) {
    throw new Error('the change-default-locale checkbox has no `checked:<state>` prop');
  }
  const state = checked[1].replace(/\$/g, '\\$');
  const init = new RegExp(`\\[${state},[\\w$]+\\]=\\(0,[\\w$]+\\.useState\\)\\(!([01])\\)`, 'g');
  const found = [...text.matchAll(init)];
  if (found.length !== 1) {
    throw new Error(`expected one useState(true|false) for \`${checked[1]}\`, found ${found.length}`);
  }
  const [match, bit] = found[0];
  if (bit === '1') {
    return { text, changed: false };
  }
  const start = found[0].index;
  const unticked = `${match.slice(0, -'(!0)'.length)}(!1)`;
  return { text: text.slice(0, start) + unticked + text.slice(start + match.length), changed: true };
}

// The .js chunks of the assembled primary-navigation app that render the checkbox.
export function findDialogChunks(frontendDir) {
  const modules = readdirSync(frontendDir).filter((name) => name.startsWith(MODULE_DIR_PREFIX));
  if (modules.length !== 1) {
    throw new Error(`expected one ${MODULE_DIR_PREFIX}<version> in ${frontendDir}, found ${modules.join(', ') || 'none'}`);
  }
  const moduleDir = join(frontendDir, modules[0]);
  const chunks = readdirSync(moduleDir)
    .filter((name) => name.endsWith('.js'))
    .map((name) => join(moduleDir, name))
    .filter((path) => readFileSync(path, 'utf8').includes(CHECKBOX));
  return { module: modules[0], chunks };
}

function main(frontendDir) {
  const { module, chunks } = findDialogChunks(frontendDir);
  if (chunks.length !== 1) {
    throw new Error(`expected one chunk in ${module} with ${CHECKBOX}, found ${chunks.length}`);
  }
  const { text, changed } = untickDefaultLocale(readFileSync(chunks[0], 'utf8'));
  if (changed) {
    writeFileSync(chunks[0], text);
  }
  console.log(`${changed ? 'Patched' : 'Already patched'} ${module}: the change-language dialog opens with ` +
    `"change default locale" unticked (#681), in ${chunks[0]}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) {
    console.error('usage: patch-change-language-default.mjs <built frontend dir>');
    process.exit(2);
  }
  try {
    main(process.argv[2]);
  } catch (error) {
    console.error(`#681 change-language patch failed: ${error.message}`);
    process.exit(1);
  }
}
