#!/usr/bin/env node
// Tests the #570 patch of @openmrs/esm-styleguide
// (distro/frontend/openmrs-cli/patches/esm-styleguide-<core>.patch, openmrs-esm-core#1981).
// Run by distro/pom.xml in every build; also runnable by hand after a build:
//   node scripts/test/esm-styleguide-svg-sprite/test.mjs \
//     distro/target/openmrs_cli/node_modules/@openmrs/esm-styleguide \
//     distro/target/ozone-uvl-distro-1.0.0-SNAPSHOT/distro/binaries/openmrs/frontend
//
// 1. The patched dist/svg-utils.js, run against a minimal document: the sprite container is
//    attached before the window `load` event, and only once however often the events fire.
//    Unpatched, it waits for `load`, which a chart opened by hard reload has not reached when
//    its left nav mounts (#570).
// 2. The app shell that `openmrs build` wrote: its chunks carry the patched code, not the
//    upstream 11.0.0 code, so the patch reached the shell that is served.
//
// Node only, no dependencies, so it runs the same on macOS and in CI.
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [styleguideDir, frontendDir] = process.argv.slice(2);
if (!styleguideDir || !frontendDir) {
  console.error('usage: test.mjs <esm-styleguide package dir> <built frontend dir>');
  process.exit(2);
}

let failures = 0;
const pass = (name) => console.log(`  ok    ${name}`);
const fail = (name) => {
  console.error(`  FAIL  ${name}`);
  failures += 1;
};
const check = (name, ok) => (ok ? pass(name) : fail(name));

// A document with just what svg-utils.js touches at load time.
//   page({ body }) -> { document, window, fire(target, type), containers() }
function page({ body }) {
  const listeners = { document: {}, window: {} };
  const children = [];
  const bodyElement = {
    appendChild(element) {
      const index = children.indexOf(element);
      if (index >= 0) {
        children.splice(index, 1);
      }
      children.push(element);
      element.isConnected = true;
      return element;
    },
  };
  const on = (target) => (type, listener) => (listeners[target][type] ??= []).push(listener);
  const document = {
    readyState: body ? 'interactive' : 'loading',
    body: body ? bodyElement : null,
    createElement: () => ({ id: '', style: {}, isConnected: false, appendChild() {} }),
    addEventListener: on('document'),
  };
  const window = { addEventListener: on('window') };
  return {
    document,
    window,
    attachBody() {
      document.body = bodyElement;
      document.readyState = 'interactive';
    },
    fire: (target, type) => (listeners[target][type] ?? []).forEach((listener) => listener()),
    containers: () => children.filter((element) => element.id === 'omrs-svgs-container').length,
  };
}

let instance = 0;
async function loadSvgUtils(fakePage) {
  globalThis.document = fakePage.document;
  globalThis.window = fakePage.window;
  const url = pathToFileURL(resolve(styleguideDir, 'dist/svg-utils.js'));
  url.search = `?instance=${++instance}`;
  await import(url.href);
}

console.log('svg-utils.js (patched dist)');
{
  const p = page({ body: true });
  await loadSvgUtils(p);
  check('attaches the container when the module loads with a body, before window load', p.containers() === 1);
  p.fire('document', 'DOMContentLoaded');
  p.fire('window', 'load');
  check('keeps a single container after DOMContentLoaded and load fire', p.containers() === 1);
}
{
  const p = page({ body: false });
  await loadSvgUtils(p);
  check('waits for the body when the module loads before it', p.containers() === 0);
  p.attachBody();
  p.fire('document', 'DOMContentLoaded');
  check('attaches the container on DOMContentLoaded, before window load', p.containers() === 1);
  p.fire('document', 'DOMContentLoaded');
  p.fire('window', 'load');
  check('keeps a single container when the events fire again', p.containers() === 1);
}

console.log('built app shell');
const chunks = readdirSync(frontendDir)
  .filter((name) => name.endsWith('.js'))
  .map((name) => ({ name, text: readFileSync(join(frontendDir, name), 'utf8') }));

const spriteChunks = chunks.filter(({ text }) => text.includes('.id="omrs-svgs-container"'));
check(`one shell chunk creates the sprite container (found ${spriteChunks.map((c) => c.name).join(', ') || 'none'})`,
  spriteChunks.length === 1);
for (const { name, text } of spriteChunks) {
  const at = text.indexOf('.id="omrs-svgs-container"');
  const setup = text.slice(at, at + 300);
  check(`${name} attaches the container on DOMContentLoaded`, setup.includes('"DOMContentLoaded"'));
  check(`${name} no longer waits for window load`, !/addEventListener\("load"/.test(setup));
}

// Upstream 11.0.0 MaybeIcon keeps the lookup in a ref: `a.current=e?document.getElementById(e):void 0`.
const staleMaybeIcon = /\.current=\w+\?document\.getElementById\(\w+\):void 0/;
const stale = chunks.filter(({ text }) => staleMaybeIcon.test(text)).map(({ name }) => name);
check(`no shell chunk keeps MaybeIcon's lookup in a ref (found in ${stale.join(', ') || 'none'})`, stale.length === 0);
check('a shell chunk watches the body for the sprite container (patched MaybeIcon)',
  chunks.some(({ text }) => /\.observe\(document\.body,\{childList:!0\}\)/.test(text)));

if (failures > 0) {
  console.error(`${failures} check(s) failed: the #570 icon sprite patch is not in effect.`);
  process.exit(1);
}
console.log('All #570 icon sprite checks passed.');
