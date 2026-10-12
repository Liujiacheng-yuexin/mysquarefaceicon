#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { originalPixelSource, originalPixelSidebarMarkup } from "./check-pixel-external-page.mjs";
import { beforeGamesIndexNavigation, beforeGamesIndexSource } from "./games-index-compat.mjs";
import { beforeRelatedGamesMarkup, beforeRelatedGamesSource } from "./related-games-compat.mjs";
import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript"), React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sha = value => createHash("sha256").update(value).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const read = file => beforeRecentlyPlayedSource(file, readFileSync(resolve(root, file), "utf8").replace(/\r\n/g, "\n"));
const count = (value, needle) => value.split(needle).length - 1;
// Fixed from the pre-implementation v1.64 source and production-build artifacts.
// The allowed exceptions are the verified COVER dimensions and, after MIG-PIXEL,
// the exact External tool badge/type on the existing Pixel sidebar link.
// Mutable board/evidence files and the current record are never golden oracles.
const golden = {
  "record": "5bec65ed9a63409bca553111bff92f6007520fab71de92105f97236090e4d479",
  "metadata": "4a49a91f16e638d4a808fa740bd91196b6526206d6a3f1641d7ec18b47dec95d",
  "ssr": "596caccb2532fe501d36b0a7b5bb9f159bb4b34c279e7f056ef8204ee829ae53",
  "builtMain": "38901a7d205984dd27fb2b8e4059631c1489efc4b804057fae4afb61f54051e7",
  "schemas": "e3fd2950b8059029832927053ac4fa9d01b3ec7716eebeb98bac313f2a52cf2c",
  "head": {
    "title": "Oval Face Icon Generator - Play the Classic Flash Avatar Game Online",
    "metas": [
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>",
      "<meta name=\"theme-color\" content=\"#20b8aa\"/>",
      "<meta name=\"description\" content=\"Play Oval Face Icon Generator online, a classic Flash avatar maker game for creating cute oval face icons in your browser. No Flash Player required.\"/>",
      "<meta name=\"application-name\" content=\"My Square Face Icon\"/>",
      "<meta name=\"author\" content=\"My Square Face Icon\"/>",
      "<meta property=\"og:title\" content=\"Oval Face Icon Generator - Play the Classic Flash Avatar Game Online\"/>",
      "<meta property=\"og:description\" content=\"Play Oval Face Icon Generator online, a classic Flash avatar maker game for creating cute oval face icons in your browser. No Flash Player required.\"/>",
      "<meta property=\"og:url\" content=\"https://mysquarefaceicon.com/oval-face-icon-generator\"/>",
      "<meta property=\"og:site_name\" content=\"My Square Face Icon\"/>",
      "<meta property=\"og:image\" content=\"https://mysquarefaceicon.com/og-image.svg\"/>",
      "<meta property=\"og:image:width\" content=\"1200\"/>",
      "<meta property=\"og:image:height\" content=\"630\"/>",
      "<meta property=\"og:image:alt\" content=\"Oval Face Icon Generator classic Flash avatar maker\"/>",
      "<meta property=\"og:type\" content=\"website\"/>",
      "<meta name=\"twitter:card\" content=\"summary_large_image\"/>",
      "<meta name=\"twitter:title\" content=\"Oval Face Icon Generator - Play the Classic Flash Avatar Game Online\"/>",
      "<meta name=\"twitter:description\" content=\"Play Oval Face Icon Generator online, a classic Flash avatar maker game for creating cute oval face icons in your browser. No Flash Player required.\"/>",
      "<meta name=\"twitter:image\" content=\"https://mysquarefaceicon.com/og-image.svg\"/>"
    ],
    "links": [
      "<link rel=\"canonical\" href=\"https://mysquarefaceicon.com/oval-face-icon-generator\"/>"
    ]
  },
  "frozenSources": {
    "components/FlashGenerator.tsx": "c443323031b15428a502ff4fcad3653ffc424ef75db9335b76883576f45ac794",
    "components/game-player/GamePlayer.tsx": "142cf22ac3a485c78285d920bbe84114f3931a38f0e9aec067bbf8ca2e562d5c",
    "components/game-player/adapters/RuffleAdapter.tsx": "5fcff6669f4ca75147728e8a73434cdef8abb2823325110d585ad46a1cfe8ada",
    "components/game/GameDetailTemplate.tsx": "c643d800efd8bdbc6d439047b53c3aad6fae403ad59ed55b7c8349218c1ca43c",
    "components/game/GameControls.tsx": "2a738d34297ad718e59a678ea9572d8c6cc981180e083e8fca7cb03e21c1b4da",
    "lib/games/game-player-model.ts": "42672e8d0917e9d7d6a1b28137e505ecd4d7b09ba40e3c971751b6d7f3fbe84c",
    "lib/games/routes.ts": "058434c725a09ae921c2c5f184396377873ad67603130f985fcfe39bcd97c5a6",
    "lib/games/catalog.ts": "6cc0df85e3acf146b3cc18b63cc4785982607fc0e59142ce89f59d2d6ef0ac0d",
    "lib/seo/game-metadata.ts": "87e7f42b085e2714cd22bce3634ccf1272fa822fb70b77292c5831d0f38fe660",
    "app/globals.css": "5b5e8d7253be79edbd479a01a53bf3f760d52482ced5f4c6edcd387975669867",
    "app/sitemap.ts": "183aafaeb14f529f8c341c70aa9c3278082f670aeaa4f487271d6ff110e0db18",
    "app/robots.ts": "dd47d2bd1355fb44791c0f5e481b06c98142639383a902cd6e976cb4f7583aa8",
    "app/page.tsx": "d10f79e2522ca3c3e21195e09df0f090b119af6452c265e48eb125639b2c46c1",
    "components/HomePage.tsx": "5ef46b20b057f491dbcd16051db5dac33a5b1dd1b24f184d0391e3ba43b4fe2f",
    "components/home/HomeHero.tsx": "d7c0c2c35b98735c002d4a9066b68615e73df77326cc42468eaee6607b442fd3",
    "lib/games/square-homepage.ts": "ce7d111d8a4df65194394ed31468a43fac96c83da1f53c8761090f159efe3aa4",
    "data/games/square-face.ts": "5f70eb18ae8e87db1db4d2603c080e5a4b01d44ae2b57f7abcf9afbf26550d0e",
    "data/games/pixel-art-avatar.ts": "118d1b40325cb26d8ff19141f5af2ff1b451a3b89de0e6131836a37a0510fabb",
    "app/pixel-art-avatar-icon-generator/page.tsx": "514139869fbd206326dc6d2e426d86c2b49f27c557b86868471de200fe94c50d",
    "data/curated-icon-ideas.ts": "b51d0f7b57249b1e3cfe0e16bede29688154814168a2c6271a7388ad10933dce",
    "data/game-license-registry.json": "fb0b94f56ffa3c7feca89ee136c73795a95d993de0ebe16d81ca8041da4a8924",
    "public/sw.js": "05b14d5b9f3e447b180a12fb025c6937675bc7009b6e68082eebb4a8d83f322d"
  },
  "binaryHashes": {
    "public/games/square-face.swf": "b1d074c95f15b7dcecdbc2405abf820ead985669bb12cd47247fc8ea7537bc1e",
    "public/games/oval-face.swf": "80e974d8ef4ad5e849e93464eaea1833620c269bac30601d960f5438c285e09b",
    "public/games/oval-face-cover.png": "0e914b27b602683442d57dfa232c88be1fdea5a2ed45bdabe0da72e3ff464073"
  }
};
const expectedPlayer = {
  "gameName": "Oval Face Icon Generator",
  "swfSources": [
    "/games/oval-face.swf"
  ],
  "coverImageUrl": "/games/oval-face-cover.png",
  "backgroundColor": "#FFAF03",
  "aspectRatio": "972 / 774",
  "coverImageWidth": 974,
  "coverImageHeight": 775,
  "ariaLabel": "Oval face Flash generator",
  "coverLabel": "Start Oval Face Icon Generator game",
  "loadingMessage": "Loading Oval Face Icon Generator...",
  "errorMessage": "The oval face game could not be loaded. Please refresh the page or try a desktop browser.",
  "slowLoadingHint": "Still loading? This classic oval face game may take a few seconds to start.",
  "deviceNotice": "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better oval face editing experience.",
  "maxWidth": "972px",
  "reportHref": "/contact",
  "startLabel": "Start Game",
  "reloadLabel": "Reload",
  "helpLabel": "Game Help",
  "showStartControl": true
};
const expectedLegacy = {
  "hero": {
    "eyebrow": "Classic Flash oval avatar maker",
    "intro": "Play the classic Oval Face Icon Generator Flash game online. Create cute rounded face icons directly in your browser with a softer avatar style.",
    "playLabel": "Play Now",
    "howToPlayLabel": "How to Play"
  },
  "card": {
    "label": "Oval Face Icon Generator",
    "title": "Play Oval Face Icon Generator Online",
    "description": "Click Play Now to load the classic oval face Flash game in Ruffle. It keeps the original rounded avatar maker intact while the page around it stays mobile friendly.",
    "badge": "Classic Flash Game"
  },
  "about": {
    "eyebrow": "About the game",
    "title": "What Is Oval Face Icon Generator?",
    "text": "Oval Face Icon Generator is a classic Flash avatar maker game for designing rounded face icons. It is useful when you want a softer character look than a square icon while keeping the same quick browser-game workflow."
  },
  "headings": {
    "howToPlayEyebrow": "Three simple steps",
    "howToPlay": "How to Play Oval Face Icon Generator",
    "featuresEyebrow": "Game features",
    "features": "Oval Face Icon Generator Features",
    "tipsEyebrow": "Best experience",
    "tips": "Tips for the Best Oval Face Experience",
    "troubleshootingEyebrow": "Help",
    "troubleshooting": "Troubleshooting Oval Face Icon Generator",
    "faqEyebrow": "FAQ",
    "faq": "Frequently Asked Questions",
    "relatedEyebrow": "More avatar makers",
    "related": "Related Avatar Games and Tools"
  },
  "troubleshooting": [
    {
      "title": "Oval Face Icon Generator is not loading",
      "text": "Wait a few seconds first. If it still does not start, use Reload Game or refresh the page."
    },
    {
      "title": "The game freezes after loading",
      "text": "Click Reload Game to remount the Ruffle player without leaving the page."
    },
    {
      "title": "Mobile buttons are hard to use",
      "text": "This is a classic Flash game built for desktop-style input. Rotate your phone or use a desktop browser."
    },
    {
      "title": "Do I need Adobe Flash Player?",
      "text": "No. This page uses a modern Flash emulator, so you do not need to install Adobe Flash Player."
    }
  ],
  "relatedGames": [
    {
      "gameId": "square-face",
      "title": "Square Face Generator",
      "text": "Play the original square-shaped classic Flash avatar maker.",
      "imageSrc": "/square-face-icon.png",
      "imageAlt": "Square Face Generator preview",
      "relatedCard": {
        "title": "Square Face Generator",
        "text": "Play the square-shaped version of the classic face icon maker."
      }
    },
    {
      "gameId": "pixel-art-avatar",
      "title": "Pixel Art Avatar Icon Generator",
      "text": "Open a chibi pixel avatar maker with source credit.",
      "imageSrc": "/game-face-samples/gamer.webp",
      "imageAlt": "Pixel art avatar icon generator preview"
    }
  ],
  "videoGameDescription": "Play the classic Oval Face Icon Generator Flash avatar maker game online.",
  "playerPresentation": {
    "ariaLabel": "Oval face Flash generator",
    "coverLabel": "Start Oval Face Icon Generator game",
    "loadingMessage": "Loading Oval Face Icon Generator...",
    "errorMessage": "The oval face game could not be loaded. Please refresh the page or try a desktop browser.",
    "slowLoadingHint": "Still loading? This classic oval face game may take a few seconds to start.",
    "deviceNotice": "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better oval face editing experience.",
    "maxWidth": "972px",
    "reportHref": "/contact",
    "startLabel": "Start Game",
    "reloadLabel": "Reload",
    "helpLabel": "Game Help",
    "showStartControl": true
  }
};
const pageFile = "app/oval-face-icon-generator/page.tsx";

const compiledCache = new Map();

function modules(options = {}) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    if (file === "lib/games/catalog.ts" && options.records) {
      const records = options.records;
      mod.exports = {
        gameCatalog: records,
        getGameById: id => records.find(game => game.id === id),
        getGameBySlug: slug => records.find(game => game.slug === slug),
        getGameByPath: path => records.find(game => game.route.path === path)
      };
      return mod.exports;
    }
    if (file === "data/games/oval-face.ts" && options.record) {
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
function renderPage(loader) {
  return renderToStaticMarkup(React.createElement(loader.load("app/oval-face-icon-generator/page.tsx").default));
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


function restoreOriginalCoverDimensions(html) {
  const covers = [...html.matchAll(/<img\b[^>]*class="flash-cover-image"[^>]*>/g)];
  assert.equal(covers.length, 1, "Exactly one existing cover must render");
  const tag = covers[0][0];
  assert.match(tag, /\bwidth="974"/, "Use the PNG's verified width");
  assert.match(tag, /\bheight="775"/, "Use the PNG's verified height");
  return html.replace(tag, tag.replace(/\bwidth="974"/, 'width="972"').replace(/\bheight="775"/, 'height="774"'));
}
function schemas(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
}
function headContract(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  return {
    title: head.match(/<title>([\s\S]*?)<\/title>/)?.[1],
    metas: [...head.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]).filter(tag => /\b(?:name|property)=/.test(tag)),
    links: [...head.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => /rel="(?:canonical|alternate)"/.test(tag))
  };
}
function checkHtml(html) {
  assert.deepEqual(headContract(html), golden.head, "All metadata, canonical and index values must remain unchanged");
  const currentMain = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  const main = currentMain ? beforeRelatedGamesMarkup(currentMain) : currentMain;
  assert.ok(main, "Nonempty server-rendered main is required");
  assert.equal(sha(restoreOriginalCoverDimensions(originalPixelSidebarMarkup(main, 1))), golden.builtMain,
    "Only the verified cover dimensions and confirmed Pixel sidebar label may change in built main");
  assert.equal(sha(JSON.stringify(schemas(html))), golden.schemas, "All three original schemas must remain identical");
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((main.match(/<details\b/g) ?? []).length, 9);
  assert.doesNotMatch(main, /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i);
}
function checkHtmlNegatives(html) {
  const mutations = [
    ['width="974"', 'width="972"'], ['height="775"', 'height="774"'],
    ["Try different combinations until the oval face feels right", "Changed unapproved Oval instructions"],
    ['class="side-game-card" href="/pixel-art-avatar-icon-generator"', 'class="side-game-card" href="/unapproved-game"'],
    ['class="side-game-card" href="/"', 'class="side-game-card" href="/unapproved-home"'],
    ["Use landscape mode if you are testing on a phone", "Removed fifth tip"],
    ["Frequently Asked Questions", "FAQ unapproved change"],
    ['"@type":"FAQPage"', '"@type":"WebPage"'],
    ['<h1>Oval Face Icon Generator</h1>', '<h1>Unapproved H1</h1>'],
    ['rel="canonical" href="https://mysquarefaceicon.com/oval-face-icon-generator"', 'rel="canonical" href="https://example.invalid/oval-face-icon-generator"'],
    ['<title>Oval Face Icon Generator', '<title>Unapproved Oval Face Icon Generator'],
    ["Play Oval Face Icon Generator online, a classic Flash avatar maker game", "Unapproved metadata copy"],
    ["<head>", '<head><meta name="robots" content="noindex"/>'],
    ['data-player-state="idle"', 'data-player-state="ready"']
  ];
  for (const [before, after] of mutations) {
    assert.ok(html.includes(before), "HTML negative fixture not applied: " + before);
    assert.throws(() => checkHtml(html.replace(before, after)), undefined, "HTML drift accepted: " + before);
  }
  return mutations.length;
}

try {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run oval-page:check [-- --built | -- --base http://127.0.0.1:3100]");
  for (const [file, hash] of Object.entries(golden.frozenSources)) {
    const source = beforeGamesIndexSource(file, read(file));
    const original = ["data/games/pixel-art-avatar.ts", "app/pixel-art-avatar-icon-generator/page.tsx"].includes(file)
      ? originalPixelSource(file, source) : source;
    // The legacy baseline is LF. The reviewed banner inverse can restore a CRLF
    // tail; normalize it after the complete inverse chain, without changing golden.
    assert.equal(sha(original.toString().replace(/\r\n/g, "\n")), hash, file + " changed outside its confirmed migration boundary");
  }
  for (const [file, hash] of Object.entries(golden.binaryHashes)) assert.equal(sha(readFileSync(resolve(root, file))), hash, file + " bytes must not change");
  const png = readFileSync(resolve(root, "public/games/oval-face-cover.png"));
  assert.equal(png.readUInt32BE(16), 974); assert.equal(png.readUInt32BE(20), 775);

  const loader = modules(), page = loader.load(pageFile);
  const oval = loader.load("data/games/oval-face.ts").default;
  const { gameCatalog } = loader.load("lib/games/catalog.ts");
  const { resolveOvalLegacyPage } = loader.load("lib/games/oval-legacy-page.ts");
  const { validateGameRecord } = loader.load("lib/games/game-schema.ts");
  const { createGamePlayerModel } = loader.load("lib/games/game-player-model.ts");
  const resolved = resolveOvalLegacyPage(oval);
  assert.equal(Object.keys(resolved.player).length, 19);
  assert.deepEqual(plain(resolved.player), expectedPlayer);
  assert.deepEqual(plain(oval.content.legacyPage), expectedLegacy);
  assert.equal(sha(JSON.stringify(page.metadata)), golden.metadata);
  const originalRecord = plain(oval);
  delete originalRecord.content.legacyPage;
  originalRecord.images.find(image => image.role === "COVER").width = 972;
  originalRecord.images.find(image => image.role === "COVER").height = 774;
  assert.equal(sha(JSON.stringify(originalRecord)), golden.record, "No old Oval fields may change except the two COVER dimensions");
  assert.deepEqual([oval.howToPlay.length, oval.features.length, oval.tips.length, oval.faq.length], [3, 6, 5, 5]);

  const pageSource = beforeRelatedGamesSource(pageFile, read(pageFile));
  assert.match(pageSource, /const ovalPage = resolveOvalLegacyPage\(ovalFaceGame\)/);
  assert.match(pageSource, /howToPlay: howToSteps, features, tips, faq/);
  assert.match(pageSource, /<FlashGenerator \{\.\.\.ovalPage\.player\} \/>/);
  assert.match(pageSource, /\.\.\.ovalPage\.sidebarGames/);
  assert.match(pageSource, /ovalPage\.relatedCards\.map/);
  assert.doesNotMatch(pageSource, /const (?:howToSteps|features|tips|faq|troubleshooting)\s*=\s*\[/);
  assert.doesNotMatch(pageSource, /tips\.slice|coverImageWidth=.*\?\?|coverImageHeight=.*\?\?/);
  assert.doesNotMatch(read("lib/games/oval-legacy-page.ts"), /createGamePlayerModel\(|import .*FlashGenerator|import .*GamePlayer/);

  const warnings = [], originalError = console.error;
  let contentBindings = 0, imageBindings = 0, playerBindings = 0, relatedBindings = 0;
  console.error = (...items) => warnings.push(items.map(String).join(" "));
  try {
    const html = renderPage(loader);
    assert.equal(sha(beforeGamesIndexNavigation(restoreOriginalCoverDimensions(originalPixelSidebarMarkup(beforeRelatedGamesMarkup(html), 1)))), golden.ssr,
      "Full real-component SSR must preserve the old output except the confirmed cover dimensions and Pixel label");
    assert.equal(sha(JSON.stringify(schemas(html))), golden.schemas);
    assert.equal(count(html, 'data-player-type="RUFFLE_SWF"'), 1);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
    assert.equal((main.match(/<details\b/g) ?? []).length, 9);
    assert.equal((main.match(/<li\b/g) ?? []).length, 5);
    assert.doesNotMatch(html, /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i);

    const contentPaths = [["seo", "h1"], ["name"]];
    function collectText(value, path, exclude = new Set()) {
      if (typeof value === "string") contentPaths.push(path);
      else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
        if (!exclude.has(key)) collectText(child, [...path, key], exclude);
      }
    }
    for (const key of ["howToPlay", "features", "tips", "faq"]) collectText(oval[key], [key]);
    collectText(oval.content.legacyPage, ["content", "legacyPage"], new Set(["playerPresentation", "gameId", "imageSrc"]));
    for (const [index, path] of contentPaths.entries()) {
      const record = plain(oval), marker = "MIGOvalCopySentinel" + index;
      setAt(record, path, getAt(record, path) + " " + marker);
      assert.ok(renderPage(modules({ record })).includes(marker), path.join(".") + " must reach real SSR");
      contentBindings++;
    }
    for (const index of [0, 1]) {
      const record = plain(oval), src = "/games/oval-sidebar-sentinel-" + index + ".png";
      record.content.legacyPage.relatedGames[index].imageSrc = src;
      const html = renderPage(modules({ record }));
      assert.ok(html.includes(src) || html.includes(encodeURIComponent(src)), "Sidebar artwork must come from the record");
      imageBindings++;
    }
    const coverIndex = oval.images.findIndex(image => image.role === "COVER");
    const playerPaths = {
      gameName: ["name"], swfSources: ["player", "swfSources"], coverImageUrl: ["images", coverIndex, "src"],
      backgroundColor: ["player", "backgroundColor"], aspectRatio: ["player", "aspectRatio"],
      coverImageWidth: ["images", coverIndex, "width"], coverImageHeight: ["images", coverIndex, "height"]
    };
    const values = {
      gameName: "Oval Face Icon Generator test", swfSources: ["/games/oval-sentinel.swf"], coverImageUrl: "/games/oval-sentinel.png",
      backgroundColor: "#123456", aspectRatio: "1 / 1", coverImageWidth: 777, coverImageHeight: 778,
      maxWidth: "777px", reportHref: "/oval-sentinel-report", showStartControl: false
    };
    for (const key of Object.keys(expectedPlayer)) {
      const record = plain(oval), value = key in values ? values[key] : expectedPlayer[key] + " test";
      setAt(record, playerPaths[key] ?? ["content", "legacyPage", "playerPresentation", key], value);
      assert.deepEqual(plain(resolveOvalLegacyPage(record).player[key]), value, key + " resolver binding");
      const models = [];
      renderPage(modules({ record, models }));
      assert.equal(models.length, 1);
      assert.deepEqual(playerPropsFromModel(models[0]), { ...expectedPlayer, [key]: value }, key + " must reach the real FlashGenerator model boundary");
      assert.equal(models[0].player.clickToLoad, true);
      playerBindings++;
    }

    for (const [id, expectedLinks] of [["square-face", 2], ["pixel-art-avatar", 1]]) {
      const records = plain(gameCatalog), target = records.find(game => game.id === id);
      target.route.path = "/oval-related-binding-" + id;
      target.route.canonical = target.seo.canonical = "https://mysquarefaceicon.com" + target.route.path;
      const html = beforeRelatedGamesMarkup(renderPage(modules({ records })));
      assert.equal(count(html, 'href="' + target.route.path + '"'), expectedLinks, "Every scoped related link must resolve the public record");
      relatedBindings += expectedLinks;
    }
  } finally { console.error = originalError; }
  assert.ok(warnings.every(item => item.includes("fetchPriority")), "Unexpected real-SSR warning: " + warnings.join(" | "));

  let rejected = 0;
  function rejects(label, mutate) {
    const record = plain(oval); mutate(record);
    assert.throws(() => resolveOvalLegacyPage(record), undefined, label + " was accepted"); rejected++;
  }
  for (const value of [undefined, null, [], "bad"]) rejects("missing/invalid legacyPage", record => { record.content.legacyPage = value; });
  for (const key of ["hero", "card", "about", "headings", "playerPresentation"]) {
    for (const value of [undefined, null, []]) rejects("invalid " + key, record => { record.content.legacyPage[key] = value; });
  }
  const requiredPaths = [];
  function required(value, path) {
    if (typeof value === "string") requiredPaths.push(path);
    else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) required(child, [...path, key]);
  }
  required(oval.content.legacyPage, ["content", "legacyPage"]);
  for (const path of requiredPaths) for (const value of [undefined, "", 1]) rejects(path.join("."), record => setAt(record, path, value));
  for (const key of ["troubleshooting", "relatedGames"]) {
    for (const value of [undefined, null, "bad", [null]]) rejects("invalid " + key, record => { record.content.legacyPage[key] = value; });
  }
  rejects("empty troubleshooting", record => { record.content.legacyPage.troubleshooting = []; });
  for (const value of [undefined, "false", 0]) rejects("start control flag", record => { record.content.legacyPage.playerPresentation.showStartControl = value; });
  for (const path of ["https://example.invalid/a", "//example.invalid/a", "/\\example.invalid/a", "/\n/example.invalid/a", "relative"]) {
    rejects("non-local SWF", record => { record.player.swfSources = [path]; });
    rejects("non-local cover", record => { record.images.find(image => image.role === "COVER").src = path; });
    rejects("non-local report", record => { record.content.legacyPage.playerPresentation.reportHref = path; });
    rejects("non-local sidebar image", record => { record.content.legacyPage.relatedGames[0].imageSrc = path; });
  }
  for (const field of ["width", "height"]) for (const value of [null, 0, -1, 0.5, NaN, Infinity]) rejects("invalid cover " + field, record => {
    record.images.find(image => image.role === "COVER")[field] = value;
  });
  for (const value of ["0px", "-1px", "100%", "Infinitypx", "auto", "9".repeat(400) + "px"]) rejects("maxWidth", record => { record.content.legacyPage.playerPresentation.maxWidth = value; });
  for (const value of ["", "1 / 0", "-1 / 2", "1 / Infinity", "1", "1 / 2 / 3"]) rejects("aspect ratio", record => { record.player.aspectRatio = value; });
  rejects("missing cover", record => { record.images = record.images.filter(image => image.role !== "COVER"); });
  rejects("empty SWF", record => { record.player.swfSources = []; });
  rejects("click-to-load disabled", record => { record.player.clickToLoad = false; });
  rejects("wrong id", record => { record.id = "another-game"; });
  rejects("wrong route", record => { record.route.path = "/another-game"; record.route.canonical = "https://mysquarefaceicon.com/another-game"; });
  rejects("nonlegacy route", record => { record.route.existingPublishedRoute = false; });
  rejects("unpublished route", record => { record.status = "DRAFT"; });
  rejects("wrong delivery type", record => { record.player.type = "HTML5"; });
  rejects("duplicate presentation ID", record => { record.content.legacyPage.relatedGames.push(record.content.legacyPage.relatedGames[0]); });
  rejects("invalid presentation ID", record => { record.content.legacyPage.relatedGames[0].gameId = "Not A Slug"; });

  let relatedExclusions = 0;
  const withIds = plain(oval);
  withIds.relatedGameIds = ["oval-face", "square-face", "square-face", "missing-record", "pixel-art-avatar"];
  assert.deepEqual(plain(resolveOvalLegacyPage(withIds).sidebarGames).map(item => item.href), ["/", "/pixel-art-avatar-icon-generator"]);
  relatedExclusions += 3; // self, duplicate and unknown
  for (const id of ["square-face", "pixel-art-avatar"]) {
    for (const status of ["DRAFT", "REVIEW", "BROKEN", "ARCHIVED"]) {
      const records = plain(gameCatalog); records.find(game => game.id === id).status = status;
      const found = resolveOvalLegacyPage(oval, records);
      assert.equal(found.sidebarGames.length, 1);
      if (id === "square-face") assert.equal(found.relatedCards.length, 0);
      relatedExclusions++;
    }
    for (const href of ["https://example.invalid/a", "//example.invalid/a", "/\\example.invalid/a", "/\n/example.invalid/a", "relative"]) {
      const records = plain(gameCatalog); records.find(game => game.id === id).route.path = href;
      assert.equal(resolveOvalLegacyPage(oval, records).sidebarGames.length, 1);
      relatedExclusions++;
    }
    const records = plain(gameCatalog), target = records.find(game => game.id === id);
    target.route.existingPublishedRoute = false; target.route.path = "/games/" + target.slug;
    target.license.newPublicationAllowed = false;
    assert.equal(resolveOvalLegacyPage(oval, records).sidebarGames.length, 1);
    relatedExclusions++;
  }
  const noRelated = plain(oval); noRelated.relatedGameIds = [];
  assert.equal(resolveOvalLegacyPage(noRelated).sidebarGames.length, 0);
  assert.equal(resolveOvalLegacyPage(noRelated).relatedCards.length, 0);
  const missingCopy = plain(oval); missingCopy.content.legacyPage.relatedGames = [];
  assert.equal(resolveOvalLegacyPage(missingCopy).sidebarGames.length, 0);
  assert.equal(resolveOvalLegacyPage(oval, []).sidebarGames.length, 0);
  relatedExclusions += 3;

  for (const record of [originalRecord, ...gameCatalog]) assert.deepEqual(plain(validateGameRecord(record)), [], "legacyPage must remain optional");
  assert.equal(oval.license.status, "UNKNOWN"); assert.equal(oval.license.newPublicationAllowed, false);
  assert.deepEqual(plain(oval.license.allowedDeliveryTypes), []);
  assert.throws(() => createGamePlayerModel(oval), /RUFFLE_SWF is not allowed by the game release policy/);
  assert.deepEqual(plain(loader.load("lib/games/routes.ts").getNewGameStaticParams()), []);
  console.log("MIG-OVAL-001 source passed: 19 explicit player inputs and end-to-end forwarding cases; " + contentBindings + " text bindings, " + imageBindings + " sidebar image bindings, " + relatedBindings + " resolved related href bindings.");
  console.log("Full real-component SSR/metadata/three schemas preserved except the two verified cover dimensions and exact MIG-PIXEL sidebar label; " + rejected + " malformed records rejected, " + relatedExclusions + " related exclusions verified.");
  console.log(Object.keys(golden.frozenSources).length + " frozen sources and three binary hashes unchanged; optional schema and UNKNOWN generic-model rejection preserved.");
  if (args.length) {
    let html;
    if (args[0] === "--built") html = read(".next/server/app/oval-face-icon-generator.html");
    else {
      const base = new URL(args[1]);
      assert.ok(["http:", "https:"].includes(base.protocol) && ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Only loopback previews may be checked");
      assert.ok(base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password);
      const response = await fetch(new URL("/oval-face-icon-generator", base), { redirect: "manual", signal: AbortSignal.timeout(10_000) });
      assert.equal(response.status, 200); assert.match(response.headers.get("content-type") ?? "", /text\/html/i);
      assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|none/i);
      html = await response.text();
    }
    checkHtml(html);
    console.log("Oval " + (args[0] === "--built" ? "built HTML" : "loopback HTTP") + " passed; " + checkHtmlNegatives(html) + " raw-HTML negative fixtures rejected.");
  }
  console.log("Existing React 18 fetchPriority SSR warning only. This local binding phase is not full template migration, rights approval, browser/CWV verification or deployment.");
} catch (error) {
  console.error("MIG-OVAL-001 check failed: " + error.message);
  process.exitCode = 1;
}
