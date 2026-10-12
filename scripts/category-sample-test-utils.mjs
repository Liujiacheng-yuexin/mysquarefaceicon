import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
export const React = require("react");
export const render = element => require("react-dom/server").renderToStaticMarkup(element);
export const read = file => readFileSync(resolve(root, file), "utf8");
export const plain = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
const ts = require("typescript");

export function modules(overrides = {}, globals = {}, sources = {}) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (file in overrides) return overrides[file];
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} }; cache.set(file, mod);
    const source = sources[file] ?? read(file);
    if (file.endsWith(".json")) { mod.exports = JSON.parse(source); return mod.exports; }
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    assert.deepEqual(parsed.parseDiagnostics, [], file + " parse");
    const compiled = ts.transpileModule(source, { fileName: file, compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true
    } }).outputText;
    const localRequire = id => {
      if (id in overrides) return overrides[id];
      if (!id.startsWith(".") && !id.startsWith("@/")) return require(id);
      const stem = id.startsWith("@/") ? id.slice(2) : join(dirname(file), id);
      const target = [stem, stem + ".ts", stem + ".tsx", stem + ".json", join(stem, "index.ts")]
        .find(candidate => existsSync(resolve(root, candidate)) && statSync(resolve(root, candidate)).isFile());
      assert.ok(target, id + " from " + file); return load(target);
    };
    vm.runInNewContext(compiled, { module: mod, exports: mod.exports, require: localRequire, console, URL, ...globals },
      { filename: file, timeout: 5000 });
    return mod.exports;
  }
  return { load };
}

// Real loader effects, with isolated hook/DOM/time mocks; never executes remote scripts.
export function scriptHarness(initialPath, readyState = "complete", browserExtras = {}) {
  let currentPath = initialPath, ref, cursor = 0;
  const effects = [], slots = [], listeners = new Map(), timers = new Map(), scripts = [], replacements = [];
  const window = {
    location: { pathname: initialPath ?? "/", href: "http://127.0.0.1:3100" + (initialPath ?? "/"), replace: url => replacements.push(url) },
    addEventListener: (name, callback, options) => listeners.set(name, { callback, options }),
    removeEventListener: (name, callback) => { if (listeners.get(name)?.callback === callback) listeners.delete(name); },
    setTimeout: (callback, delay) => { assert.equal(delay, 12000); const id = timers.size + 1; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id)
  };
  const document = {
    readyState,
    querySelector: selector => scripts.find(script => selector === `script[src="${script.src}"]`),
    createElement: () => ({ setAttribute(name, value) { this[name] = value; } }),
    head: { appendChild: script => scripts.push(script) }
  };
  Object.assign(window, browserExtras);
  const hooks = {
    ...React,
    useRef: value => { ref ??= { current: value }; return ref; },
    useEffect: (callback, deps) => {
      const i = cursor++, old = slots[i];
      if (!old || deps.some((dep, index) => dep !== old.deps[index]))
        effects.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: callback() }; });
    }
  };
  const mod = modules({ react: hooks, "next/navigation": { usePathname: () => currentPath } }, { window, document });
  function rerender() {
    cursor = 0;
    mod.load("components/DeferredThirdPartyScripts.tsx").default({ googleAdsenseClient: "fixture", cloudflareAnalyticsToken: "fixture" });
    while (effects.length) effects.shift()();
  }
  rerender();
  return {
    scripts, timers, listeners, replacements,
    ads: () => scripts.filter(script => /adsbygoogle/.test(script.src)),
    event: name => listeners.get(name)?.callback(),
    wait: () => { for (const callback of [...timers.values()]) callback(); },
    pending: path => { window.location.pathname = path; window.location.href = "http://127.0.0.1:3100" + path; },
    move: path => { currentPath = path; window.location.pathname = path; window.location.href = "http://127.0.0.1:3100" + path; rerender(); },
    unmount: () => slots.forEach(slot => slot.cleanup?.())
  };
}
