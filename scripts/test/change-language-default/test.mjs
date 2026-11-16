#!/usr/bin/env node
// Tests the #681 change-language patch (scripts/patch-change-language-default.mjs).
// Run by distro/pom.xml in every build; also runnable by hand after a build:
//   node scripts/test/change-language-default/test.mjs \
//     distro/target/ozone-uvl-distro-1.0.0-SNAPSHOT/distro/binaries/openmrs/frontend
//
// 1. The built primary-navigation chunk that renders the dialog, run with a minimal React
//    stand-in: the « Modifier la langue par défaut » box starts unticked, and changing
//    language that way sets the session locale without posting the user's defaultLocale.
//    Ticked, it still saves the default. Unpatched, the box starts ticked and the first
//    check fails.
// 2. The patch itself: it leaves a patched chunk alone and refuses code it does not know.
//
// Node only, no dependencies, so it runs the same on macOS and in CI.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { CHECKBOX, findDialogChunks, untickDefaultLocale } from '../../patch-change-language-default.mjs';

const [frontendDir] = process.argv.slice(2);
if (!frontendDir) {
  console.error('usage: test.mjs <built frontend dir>');
  process.exit(2);
}

let failures = 0;
const check = (name, ok) => {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    console.error(`  FAIL  ${name}`);
    failures += 1;
  }
};

// Loads the webpack chunk and returns its default export, the dialog component. Every
// module it requires resolves to one stand-in, so the test does not depend on the module
// ids of a given build; unknown members (Carbon components) are their own names.
function loadDialog(chunkText, calls) {
  const hooks = { states: [], next: 0 };
  const elements = [];
  const members = {
    createElement: (type, props, ...children) => {
      const element = { type, props: props ?? {}, children };
      elements.push(element);
      return element;
    },
    Fragment: 'Fragment',
    useState: (initial) => {
      const index = hooks.next++;
      if (!(index in hooks.states)) {
        hooks.states[index] = initial;
      }
      return [hooks.states[index], (value) => (hooks.states[index] = value)];
    },
    useCallback: (fn) => fn,
    useMemo: (fn) => fn(),
    useTranslation: () => ({ t: (_key, fallback) => fallback }),
    useSession: () => ({ locale: 'fr', allowedLocales: ['fr', 'en'], user: { uuid: 'user-uuid', userProperties: {} } }),
    useAbortController: () => ({ signal: null }),
    getLocaleDisplayName: (locale) => locale,
    restBaseUrl: '/ws/rest/v1',
    openmrsFetch: async (url, init) => calls.push({ fn: 'openmrsFetch', url, init }),
    setSessionLocale: async (locale) => calls.push({ fn: 'setSessionLocale', locale }),
    A: (value) => value,
  };
  const anyModule = new Proxy(function () {}, {
    get: (_target, prop) => (prop in members ? members[prop] : String(prop)),
    apply: (_target, _this, args) => args.join(' '),
  });
  const require = () => anyModule;
  require.n = (module) => () => module;
  require.r = () => {};
  require.d = (exports, definitions) => {
    for (const [name, get] of Object.entries(definitions)) {
      Object.defineProperty(exports, name, { get, enumerable: true });
    }
  };

  const sandbox = { window: { location: { reload: () => calls.push({ fn: 'reload' }) } } };
  runInNewContext(chunkText, sandbox);
  const pushed = Object.keys(sandbox).find((key) => key.startsWith('webpackChunk'));
  const factories = Object.values(sandbox[pushed][0][1]);
  if (factories.length !== 1) {
    throw new Error(`expected one module in the chunk, found ${factories.length}`);
  }
  const exports = {};
  factories[0]({ exports }, exports, require);
  const Dialog = exports.default;

  return {
    render() {
      hooks.next = 0;
      elements.length = 0;
      Dialog({ close: () => {} });
      const find = (predicate) => elements.find(({ props }) => predicate(props));
      return {
        checkbox: find((props) => props.id === 'change-default-locale'),
        languages: find((props) => props.name === 'Language options'),
        submit: find((props) => props.type === 'submit'),
      };
    },
  };
}

console.log('change-language dialog (built chunk)');
const { module, chunks } = findDialogChunks(frontendDir);
check(`one ${module} chunk renders the default-locale checkbox (found ${chunks.length})`, chunks.length === 1);
if (chunks.length === 1) {
  const chunkText = readFileSync(chunks[0], 'utf8');
  {
    const calls = [];
    const dialog = loadDialog(chunkText, calls);
    let view = dialog.render();
    check('the default-locale checkbox opens unticked', view.checkbox?.props.checked === false);
    view.languages.props.onChange('en');
    view = dialog.render();
    await view.submit.props.onClick();
    check('unticked, changing language sets the session locale',
      calls.some((call) => call.fn === 'setSessionLocale' && call.locale === 'en'));
    check('unticked, it does not post the user\'s defaultLocale', !calls.some((call) => call.fn === 'openmrsFetch'));
  }
  {
    const calls = [];
    const dialog = loadDialog(chunkText, calls);
    let view = dialog.render();
    view.languages.props.onChange('en');
    view.checkbox.props.onChange(null, { checked: true });
    view = dialog.render();
    check('ticking the box ticks it', view.checkbox.props.checked === true);
    await view.submit.props.onClick();
    const saved = calls.find((call) => call.fn === 'openmrsFetch');
    check('ticked, it saves defaultLocale on the user',
      saved?.url === '/ws/rest/v1/user/user-uuid' && saved.init.body.userProperties.defaultLocale === 'en');
  }

  console.log('patch-change-language-default.mjs');
  check('leaves an already patched chunk unchanged', untickDefaultLocale(chunkText).changed === false);
}
let refused = false;
try {
  untickDefaultLocale(`${CHECKBOX},checked:y}`);
} catch {
  refused = true;
}
check('refuses a chunk whose checkbox state it cannot find', refused);

if (failures > 0) {
  console.error(`${failures} check(s) failed: the #681 change-language patch is not in effect.`);
  process.exit(1);
}
console.log('All #681 change-language checks passed.');
