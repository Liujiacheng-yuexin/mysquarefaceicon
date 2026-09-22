#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { originalPixelSource, originalPixelSidebarMarkup } from "./check-pixel-external-page.mjs";
import { beforeRelatedRemainingHomeMarkup } from "./related-remaining-compat.mjs";
import { beforeGamesIndexNavigation } from "./games-index-compat.mjs";
import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript"), React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sha = value => createHash("sha256").update(value).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const read = file => beforeRecentlyPlayedSource(file, readFileSync(resolve(root, file), "utf8"));
const count = (value, needle) => value.split(needle).length - 1;
// Captured from the accepted pre-migration code before any baseline update.
// No mutable board, generated evidence, or current record is used as a golden oracle.
const expectedPlayer = {
  "gameName": "Square Face Generator",
  "swfSources": [
    "/games/square-face.swf"
  ],
  "coverImageUrl": "/games/square-face-cover.png",
  "backgroundColor": "#FFAF03",
  "aspectRatio": "690 / 600",
  "coverImageWidth": 970,
  "coverImageHeight": 844,
  "ariaLabel": "Square face Flash generator",
  "coverLabel": "Start Square Face Generator game",
  "loadingMessage": "Loading Square Face Generator...",
  "errorMessage": "The game could not be loaded. Please refresh the page or try a desktop browser.",
  "slowLoadingHint": "Still loading? This classic Flash game may take a few seconds to start.",
  "deviceNotice": "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better experience.",
  "maxWidth": "980px",
  "reportHref": "/contact",
  "startLabel": "Play Game",
  "reloadLabel": "Reload Game",
  "helpLabel": "Report Issue",
  "showStartControl": false
};
const expectedSsr = {
  "en": "01d8076564b760220e5dd65f0de09031d557e99870326dfd2932b08d7051ead0",
  "es": "894d941e9f4d81e58a058ab3e292779916a002f189db7ff043d1b5b4aa14ab34",
  "vi": "a1a6075bf96fd812bc5af2d1f39f325368676bae5940359bd3e784a6b19312c1",
  "ja": "dfd2f28f4c36416c57056a7aaad15cf19be907161b933ca527352ce046ca65a3",
  "th": "de7b463fcb2d48cd74f0a6e0d51d3d4d6d6f13073f6b320a3236a995bfe6bf51",
  "ar": "7b27d9405e3147711df2fd2301843ee377e0eba8848c8ab22ea5ca9d2136c0ca",
  "ru": "db8a8e5f46c7149b8dc14742af8dda74fd4095fb40b69b04349dd6255bbd5218",
  "id": "388e55ea69d8d0a012c3b6f4ab1f1b2700b4518d5f86c38b11652310b6f0073c"
};
const frozenSources = {
  "components/FlashGenerator.tsx": "c443323031b15428a502ff4fcad3653ffc424ef75db9335b76883576f45ac794",
  "components/home/CoreGamePreview.tsx": "9a05388d53d969ef1ea1f4ea9a6273a0ebd1cd8ec6d1df43a1afd8da1c4c44a1",
  "components/game-player/GamePlayer.tsx": "142cf22ac3a485c78285d920bbe84114f3931a38f0e9aec067bbf8ca2e562d5c",
  "components/game-player/adapters/RuffleAdapter.tsx": "5fcff6669f4ca75147728e8a73434cdef8abb2823325110d585ad46a1cfe8ada",
  "lib/games/game-player-model.ts": "42672e8d0917e9d7d6a1b28137e505ecd4d7b09ba40e3c971751b6d7f3fbe84c",
  "app/globals.css": "5b5e8d7253be79edbd479a01a53bf3f760d52482ced5f4c6edcd387975669867",
  "lib/locales.ts": "a96fefe1140236963e49b59ed632641794f1b39b5f5c3bd5df79adac876df8db",
  "app/page.tsx": "d10f79e2522ca3c3e21195e09df0f090b119af6452c265e48eb125639b2c46c1",
  "app/sitemap.ts": "183aafaeb14f529f8c341c70aa9c3278082f670aeaa4f487271d6ff110e0db18",
  "data/games/oval-face.ts": "ee2ded5bf3d11fb4572b4861f5c39164a37d5e7a3d91f404130510c453331f74",
  "data/games/pixel-art-avatar.ts": "118d1b40325cb26d8ff19141f5af2ff1b451a3b89de0e6131836a37a0510fabb"
};
const oldHowTo = [
  {
    "title": "Start the game",
    "text": "Wait for the Flash game to load in the player, then press the START button inside the game."
  },
  {
    "title": "Customize your square face",
    "text": "Use the in-game buttons to change the face, eyes, mouth, hair, colors, accessories, and other details."
  },
  {
    "title": "Create your favorite look",
    "text": "Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, take a screenshot of your creation."
  }
];
const compiledCache = new Map();

function modules(options = {}) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    if (file === "data/games/square-face.ts" && options.record) {
      mod.exports = { __esModule: true, default: options.record };
      return mod.exports;
    }
    if (file === "components/game-player/GamePlayer.tsx" && options.models) {
      mod.exports = { __esModule: true, default: React.forwardRef(function CapturePlayer({ model }, _ref) {
        options.models.push(plain(model));
        return React.createElement("div", { "data-captured-player": model.id });
      }) };
      return mod.exports;
    }
    if (file.endsWith(".json")) {
      mod.exports = JSON.parse(read(file));
      return mod.exports;
    }
    if (!compiledCache.has(file)) {
      const source = read(file);
      const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      assert.equal(parsed.parseDiagnostics.length, 0, file + " parse");
      const compiled = ts.transpileModule(source, {
        fileName: file, reportDiagnostics: true,
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
      });
      assert.equal((compiled.diagnostics ?? []).filter(item => item.category === ts.DiagnosticCategory.Error).length, 0, file + " transpile");
      compiledCache.set(file, compiled.outputText);
    }
    function scopedRequire(id) {
      if (!id.startsWith("@/") && !id.startsWith(".")) {
        assert.ok(["react", "react/jsx-runtime", "lucide-react", "next/image", "next/link", "next/dynamic"].includes(id), "Unexpected import: " + id);
        return require(id);
      }
      const stem = id.startsWith("@/") ? id.slice(2) : join(dirname(file), id);
      const target = [stem, stem + ".ts", stem + ".tsx", stem + ".json", join(stem, "index.ts")]
        .find(candidate => existsSync(resolve(root, candidate)) && statSync(resolve(root, candidate)).isFile());
      assert.ok(target, id + " from " + file);
      return load(target);
    }
    vm.runInNewContext(compiledCache.get(file), { module: mod, exports: mod.exports, require: scopedRequire, URL, Date, console }, { timeout: 10_000, filename: file });
    return mod.exports;
  }
  return { load };
}
function setAt(record, path, value) {
  let cursor = record;
  for (const key of path.slice(0, -1)) cursor = cursor[key];
  cursor[path.at(-1)] = value;
}
function getAt(record, path) {
  return path.reduce((value, key) => value[key], record);
}
function renderPage(loader, locale) {
  return renderToStaticMarkup(React.createElement(loader.load("components/HomePage.tsx").default, { locale }));
}
function playerPropsFromModel(model) {
  return {
    gameName: model.name, swfSources: model.player.swfSources, coverImageUrl: model.cover.src,
    backgroundColor: model.frame.backgroundColor, aspectRatio: model.frame.aspectRatio,
    coverImageWidth: model.cover.width, coverImageHeight: model.cover.height,
    ariaLabel: model.ariaLabel, coverLabel: model.labels.cover, loadingMessage: model.labels.loading,
    errorMessage: model.labels.error, slowLoadingHint: model.labels.slowLoadingHint,
    deviceNotice: model.deviceNotice, maxWidth: model.frame.maxWidth, reportHref: model.reportHref,
    startLabel: model.labels.start, reloadLabel: model.labels.reload, helpLabel: model.labels.help,
    showStartControl: model.showStartControl
  };
}

// MIG-OVAL-001 adds one optional presentation block and corrects two COVER
// dimensions. Reconstruct the original source before checking its unchanged hash.
function originalOvalSource(source) {
  const ast = ts.createSourceFile("oval-face.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(ast.parseDiagnostics.length, 0);
  const properties = [];
  function visit(node) {
    if (ts.isPropertyAssignment(node)) properties.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const name = node => node.name.getText(ast).replace(/^["']|["']$/g, "");
  const legacy = properties.filter(node => name(node) === "legacyPage");
  assert.equal(legacy.length, 1, "Only one new legacyPage block is permitted");
  assert.ok(ts.isObjectLiteralExpression(legacy[0].initializer));
  assert.equal(source[legacy[0].end], ",");
  const covers = properties.filter(node => name(node) === "role" && node.initializer.getText(ast) === '"COVER"');
  assert.equal(covers.length, 1);
  const edits = [{ start: legacy[0].pos, end: legacy[0].end + 1, value: "" }];
  for (const [field, current, previous] of [["width", 974, 972], ["height", 775, 774]]) {
    const fields = covers[0].parent.properties.filter(node => ts.isPropertyAssignment(node) && name(node) === field);
    assert.equal(fields.length, 1);
    assert.equal(fields[0].initializer.getText(ast), String(current), "Only the verified cover dimension may change");
    edits.push({ start: fields[0].initializer.getStart(ast), end: fields[0].initializer.end, value: String(previous) });
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.value + source.slice(edit.end);
  return source;
}

try {
  assert.equal(process.argv.length, 2, "usage: npm run square-home:check");
  for (const [file, hash] of Object.entries(frozenSources)) {
    const source = read(file).replace(/\r\n/g, "\n");
    const original = file === "data/games/oval-face.ts" ? originalOvalSource(source)
      : file === "data/games/pixel-art-avatar.ts" ? originalPixelSource(file, source) : source;
    assert.equal(sha(original), hash, file + " changed outside its confirmed migration boundary");
  }
  const loader = modules();
  const square = loader.load("data/games/square-face.ts").default;
  const { resolveSquareHomepage } = loader.load("lib/games/square-homepage.ts");
  const { validateGameRecord } = loader.load("lib/games/game-schema.ts");
  const { createGamePlayerModel } = loader.load("lib/games/game-player-model.ts");
  const homepage = resolveSquareHomepage(square);
  assert.equal(Object.keys(homepage.player).length, 19);
  assert.deepEqual(plain(homepage.player), expectedPlayer, "Every player prop must be explicit and preserve accepted values");
  assert.equal(sha(JSON.stringify(square.content.homepage)), "1c2664cd3bdd279584ef00ea175a226cb4308df4b69cc7b3a49ab79361a60af5");
  const untouched = plain(square);
  delete untouched.content.homepage;
  untouched.howToPlay[0].text = oldHowTo[0].text;
  untouched.howToPlay[2].text = oldHowTo[2].text;
  assert.equal(sha(JSON.stringify(untouched)), "fa23e69b2ff49cfd29fa5addded5e1454139200deb3e7216dddef0f2c31e6bbf", "Only homepage presentation and two confirmed how-to text alignments may change");
  assert.equal(square.features.length, 6);
  assert.equal(square.howToPlay.length, 3);
  assert.equal(square.faq.length, 6);
  assert.equal(square.tips.length, 5);

  const homeSource = read("components/HomePage.tsx");
  assert.match(homeSource, /features: gameFeatures, howToPlay: howToSteps, tips, faq/);
  assert.match(homeSource, /tips\.slice\(0, 4\)/);
  assert.match(homeSource, /<FlashGenerator \{\.\.\.squareHomepage\.player\} \/>/);
  assert.doesNotMatch(homeSource, /const (?:gameFeatures|howToSteps|tips|faq)\s*=\s*\[/);
  assert.doesNotMatch(homeSource + read("components/home/HomeHero.tsx"), /coverImageWidth=.*\?\?|coverImageHeight=.*\?\?|game\.content\.description/);
  assert.doesNotMatch(read("lib/games/square-homepage.ts"), /import .*(?:data\/games|FlashGenerator|GamePlayer)|createGamePlayerModel\(/);

  const warnings = [], originalError = console.error;
  console.error = (...args) => warnings.push(args.map(String).join(" "));
  let contentBindings = 0, playerBindings = 0;
  try {
    for (const [locale, hash] of Object.entries(expectedSsr)) {
      const html = renderPage(loader, locale);
      assert.equal(sha(beforeGamesIndexNavigation(beforeRelatedRemainingHomeMarkup(originalPixelSidebarMarkup(html, locale === "en" ? 0 : 1)))), hash,
        locale + " full real-component SSR must preserve the old output except the confirmed Pixel label");
      assert.equal(count(html, 'data-player-type="RUFFLE_SWF"'), 1);
      assert.equal(count(html, 'type="application/ld+json"'), 3);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      assert.equal((html.match(/class="faq-item"/g) ?? []).length, 6);
      assert.equal((html.match(/class="info-card feature-card"/g) ?? []).length, 6);
      assert.doesNotMatch(html, /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i);
      const tips = html.match(/<ul class="tips-list">([\s\S]*?)<\/ul>/)?.[1] ?? "";
      assert.equal((tips.match(/<li\b/g) ?? []).length, 4);
    }

    const contentPaths = [
      ["seo", "h1"], ["features", 0, "title"], ["features", 0, "text"],
      ["howToPlay", 0, "title"], ["howToPlay", 0, "text"], ["tips", 0],
      ["faq", 0, "question"], ["faq", 0, "answer"]
    ];
    function collectCopy(value, path) {
      if (typeof value === "string") contentPaths.push(path);
      else for (const [key, child] of Object.entries(value)) collectCopy(child, [...path, key]);
    }
    for (const [key, value] of Object.entries(square.content.homepage)) {
      if (key !== "playerPresentation") collectCopy(value, ["content", "homepage", key]);
    }
    for (const [index, path] of contentPaths.entries()) {
      const record = plain(square), marker = "MIGSquareSentinel" + index;
      setAt(record, path, getAt(record, path) + " " + marker);
      const changedLoader = modules({ record });
      for (const locale of ["en", "es"]) {
        assert.ok(renderPage(changedLoader, locale).includes(marker), path.join(".") + " did not reach " + locale);
        contentBindings++;
      }
    }

    const coverIndex = square.images.findIndex(image => image.role === "COVER");
    const playerPaths = {
      gameName: ["name"], swfSources: ["player", "swfSources"], coverImageUrl: ["images", coverIndex, "src"],
      backgroundColor: ["player", "backgroundColor"], aspectRatio: ["player", "aspectRatio"],
      coverImageWidth: ["images", coverIndex, "width"], coverImageHeight: ["images", coverIndex, "height"]
    };
    const values = {
      gameName: "Square Face Generator test", swfSources: ["/games/mig-test.swf"], coverImageUrl: "/games/mig-test.png",
      backgroundColor: "#123456", aspectRatio: "1 / 1", coverImageWidth: 777, coverImageHeight: 778,
      maxWidth: "777px", reportHref: "/mig-test-report", showStartControl: true
    };
    for (const key of Object.keys(expectedPlayer)) {
      const record = plain(square);
      const value = key in values ? values[key] : expectedPlayer[key] + " test";
      const path = playerPaths[key] ?? ["content", "homepage", "playerPresentation", key];
      setAt(record, path, value);
      assert.deepEqual(plain(resolveSquareHomepage(record).player[key]), value, key + " resolver binding");
      for (const locale of ["en", "es"]) {
        const models = [];
        renderPage(modules({ record, models }), locale);
        assert.equal(models.length, 1, locale + " must forward to exactly one compatibility player");
        assert.deepEqual(playerPropsFromModel(models[0]), { ...expectedPlayer, [key]: value }, key + " lost before GamePlayer in " + locale);
        assert.equal(models[0].player.clickToLoad, true);
        playerBindings++;
      }
    }
  } finally {
    console.error = originalError;
  }
  assert.ok(warnings.every(warning => warning.includes("fetchPriority")), "Unexpected SSR warning: " + warnings.join(" | "));

  let rejected = 0;
  function rejects(label, mutate) {
    const record = plain(square);
    mutate(record);
    assert.throws(() => resolveSquareHomepage(record), undefined, label + " was accepted");
    rejected++;
  }
  for (const value of [null, [], "invalid"]) rejects("invalid homepage", record => { record.content.homepage = value; });
  rejects("missing homepage", record => { delete record.content.homepage; });
  for (const group of ["hero", "about", "headings", "finalCta", "playerPresentation"]) {
    rejects("missing " + group, record => { delete record.content.homepage[group]; });
    rejects("null " + group, record => { record.content.homepage[group] = null; });
  }
  const requiredPaths = [];
  function collectRequired(value, path) {
    if (typeof value === "string") requiredPaths.push(path);
    else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) collectRequired(child, [...path, key]);
  }
  collectRequired(square.content.homepage, ["content", "homepage"]);
  for (const path of requiredPaths) {
    for (const value of [undefined, "", 1]) rejects(path.join(".") + " invalid type/text", record => setAt(record, path, value));
  }
  for (const value of [[], ["one"], ["one", "two", "three"]]) rejects("invalid browser notes", record => { record.content.homepage.about.notes = value; });
  for (const value of [undefined, "false", 0]) rejects("invalid start flag", record => { record.content.homepage.playerPresentation.showStartControl = value; });
  for (const path of ["https://example.invalid/a", "//example.invalid/a", "/\\example.invalid/a", "/\n/example.invalid/a", "relative"]) {
    rejects("non-local SWF", record => { record.player.swfSources = [path]; });
    rejects("non-local cover", record => { record.images.find(image => image.role === "COVER").src = path; });
    rejects("non-local artwork", record => { record.images.find(image => image.role === "THUMBNAIL").src = path; });
    rejects("non-local report link", record => { record.content.homepage.playerPresentation.reportHref = path; });
  }
  rejects("empty SWF", record => { record.player.swfSources = []; });
  for (const role of ["COVER", "THUMBNAIL"]) rejects("missing " + role, record => { record.images = record.images.filter(image => image.role !== role); });
  for (const field of ["width", "height"]) for (const value of [null, 0, -1, NaN, Infinity]) {
    rejects("invalid cover " + field, record => { record.images.find(image => image.role === "COVER")[field] = value; });
  }
  rejects("wrong game id", record => { record.id = "another-game"; });
  rejects("wrong route", record => { record.route.path = "/another-game"; record.route.canonical = "https://mysquarefaceicon.com/another-game"; });
  rejects("new route", record => { record.route.existingPublishedRoute = false; });
  rejects("wrong player type", record => { record.player.type = "HTML5"; });

  for (const record of [
    untouched, loader.load("data/games/oval-face.ts").default, loader.load("data/games/pixel-art-avatar.ts").default
  ]) assert.equal(validateGameRecord(record).length, 0, "homepage presentation must stay optional for other Game Data consumers");

  assert.equal(square.license.status, "UNKNOWN");
  assert.equal(square.license.newPublicationAllowed, false);
  assert.deepEqual(plain(square.license.allowedDeliveryTypes), []);
  assert.throws(() => createGamePlayerModel(square), /RUFFLE_SWF is not allowed by the game release policy/);
  for (const [file, hash] of Object.entries({
    "public/games/square-face.swf": "b1d074c95f15b7dcecdbc2405abf820ead985669bb12cd47247fc8ea7537bc1e",
    "public/games/oval-face.swf": "80e974d8ef4ad5e849e93464eaea1833620c269bac30601d960f5438c285e09b"
  })) assert.equal(sha(readFileSync(resolve(root, file))), hash, "SWF bytes must not change");
  console.log("MIG-SQUARE-001 passed: 19 explicit player props; 8 original full real-component SSR contracts with only the verified MIG-PIXEL sidebar label reversed; " + contentBindings + " content-binding and " + playerBindings + " end-to-end prop-forwarding cases.");
  console.log("Fail-closed malformed-record fixtures: " + rejected + " rejected; optional schema, 11 frozen source files, two SWF hashes, and unchanged UNKNOWN generic-model rejection verified.");
  console.log("SSR allows only the pre-existing React 18 fetchPriority warning; interaction, fresh CWV, actual licensing, and deployment require separate evidence.");
} catch (error) {
  console.error("MIG-SQUARE-001 check failed: " + error.message);
  process.exitCode = 1;
}
