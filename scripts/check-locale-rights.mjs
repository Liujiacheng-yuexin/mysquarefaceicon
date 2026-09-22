#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { originalPixelDiscoveryRecord, originalPixelSidebarMarkup } from "./check-pixel-external-page.mjs";
import { beforeGamesIndexNavigation, beforeGamesIndexSource } from "./games-index-compat.mjs";
import { beforeRelatedRemainingHomeMarkup } from "./related-remaining-compat.mjs";
import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
// Approved LOCALE-001 copy and frozen contracts are explicit; mutable board/evidence is not a test oracle.
const edits = [
  {
    "id": "locale-runtime-wording",
    "file": "lib/locales.ts",
    "old": "The main tool keeps the familiar Flash avatar maker interaction by running the authorized SWF through Ruffle.",
    "new": "The main tool runs a project-provided SWF through Ruffle. Source and usage permissions require separate verification."
  },
  {
    "id": "draft-gallery-sidebar",
    "file": "components/HomePage.tsx",
    "old": "Explore square face icons created by players.",
    "new": "Style examples; approved posts when available."
  },
  {
    "id": "legacy-pixel-related-card",
    "file": "components/HomePage.tsx",
    "old": "Use an embedded external chibi pixel avatar maker with source credit.",
    "new": "Open the Pixel tool details page for a link to the external provider."
  },
  {
    "id": "legacy-gallery-related-card",
    "file": "components/HomePage.tsx",
    "old": "Browse original square face icon ideas for colors, expressions, and profile crops.",
    "new": "Browse simple square face style illustrations and approved submissions when available."
  }
];
const frozenHashes = {
  "lib/locales.ts": "4eb3d68efa8e6d3354fed0d8abda5b7d2aa0ac0205d3f933466bb35958263f26",
  "components/HomePage.tsx": "982ac61dd2a4a82aca6b91330913a2557e28f259907c1e2e2baf1b5c607703fe"
};
const expectedDocuments = {
  "en": {
    "mainHash": "0f4bb9ffbec441d42ef096f857437e5994d5cb8521411551bda11831d7ecc569",
    "title": "Square Face Generator - Classic Flash Avatar &amp; Icon Maker",
    "metasHash": "d8febb0a680bc78cec769c4b6c08669a0040124fa1e4c6b17c487b3a364d095b",
    "linksHash": "0e2df199fe5064becf4c2b74d6d5f74dc9066658a6010f1b30adbd1acae13aae",
    "schemasHash": "2cbfb60881858600e57ce9f2e72ae7c133eb906f33eaa722be0075fcb5550562",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 9,
      "h3": 11
    },
    "metadataObjectHash": "7041869289dea04b1e893b6544519f23cd231312a44ab7193e6d116f206f7b0f",
    "isolatedHash": "a08f6cb530c2dd54e6528542fb90ffa04038732e310cbb74db0c99faff1d953f"
  },
  "es": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "bfabd9998072b9c23967d80b2980c47b9352aeb74bcea0a2d0987440d313ecc4",
    "linksHash": "814a65edec515ef664834267a4da246505054a0a726d07b2c76f206cddb3023d",
    "schemasHash": "68cd979192b9dd83f9ab48e77a71199791c1e589cd76e3b0bc8fb7df258396b5",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "04ce44e38bd77ec7bc876b75d900c2eb842b5a7f61eb2c6302d723879080c1e6",
    "isolatedHash": "22c941357a8d0b40baf8a504becab6002b5a1fa3edce45fe94044e14d45a95b9"
  },
  "vi": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "a3c03afcd5f8a816ff78e49b2b55dc21b46224bd4e4985f6591f7f67aa65de5b",
    "linksHash": "dc4a0928a6d15378ec98b32e153178b3259e21a8a23301fb75e00fcbbd476640",
    "schemasHash": "29caea1519bcc6b29a6fd7554bcd9bcf47572593411f56bd37b7c1ba87aa5554",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "850fe01546bcdf377e50f051f7481ec16368a7e51475d02ed148860f540b3939",
    "isolatedHash": "62ec39caf77e0329df26f4072c6c41ee2c083b73d07a7b1f576c37d458d60acb"
  },
  "ja": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "1cd0131530dd9242fed5b0322eaf7b4e513647a5a7b5c06354549736b050311e",
    "linksHash": "40b648096c2fa9b30857ab3b6312171e9fcf261f41c7d188a9c75e35db4a1da3",
    "schemasHash": "6da0d210d0a4e9b2be3817c4e2f5e3b0d888226c681877a928903734637d36ab",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "9d69e6c5c4d01fd6021f5a83c2d2c71effa6ff5a9a4c8035a83b0db1ff5991c8",
    "isolatedHash": "26b81de24f8978bca6994f92cd12c9ecf55faaa5a299ab3bcd3f35830efeacf0"
  },
  "th": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "635099eb87de771eac4a9ab572c54653479c2d3e9ea2be2f0e02cbad1565f565",
    "linksHash": "e7e511dd3578cbfa3ad08de839bf21eeba66012341630dd562466cb14325e35d",
    "schemasHash": "28634ba1719593893be6682262427ac56a2b9099bdee847a87222e87f5841df2",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "187d41b5fa221016bbe31f846be51575c4bd8f1825e83cb16e3f14de18708c98",
    "isolatedHash": "08a54f460542f721616af963f88463fcb221f20499472631dc46f7e55e06ac20"
  },
  "ar": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "d38449b9e287c717afce3c78243f688f15aec629eb2f832c4ccd798328b07394",
    "linksHash": "c7595006280da57f13d45924293cd8683c2e60f457ff83f269db26eda2edf893",
    "schemasHash": "493649120a614e3d542c13b755b4a526eb3e7fd8a62d6f17bd148e0aebe25293",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "5e64ccccb45efd1531c87582ba4764d0dc002307b5f241e1391c6e23f0961188",
    "isolatedHash": "b1d38257fd8057932268ef2e5bfa11de10df31cec82b4b7bcbbbff6c34890898"
  },
  "ru": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "ac67e211d25d92f29380d9574c78af60fc4d2ec31627da9cb683604b75527c5c",
    "linksHash": "06ccfd38dbceccc02359bfb3c11858f4d0462fcd124548977af85c42ef9e7ec0",
    "schemasHash": "fbf5b6afc37c28a856f10789d83859275ccfb34699293c17b5519ca8f53a92e7",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "68906de294ab01916b913a70ec2e7d4e1c798ddde09f81f17a0da1d4b248093c",
    "isolatedHash": "7dcaac49af4a515c9063d6270c85492475de34e3fbec46b297cc75d79a3ecf4c"
  },
  "id": {
    "mainHash": "d4109b0fc63a6b1bfb6a6d5e56bf05f5e5a0c420be0ab6763273d31ec8309d27",
    "title": "My Square Face Icon - Square Face Generator",
    "metasHash": "654604a400a2b1567f8a55b35650b9589a83c41147fa782993448962ab46497b",
    "linksHash": "cdf5de6eb0751866a6084c4adc13c653f0c09ed55db85a5c0dabf885e8f7303c",
    "schemasHash": "d767597c005c2f02eb85a43a172ae77c70c4d2fc8d77d8bebd72160fe626c41d",
    "headerHash": "ecef44c604eadaec33b79966716c08627ece2b90fecd52a599d58346e118ec64",
    "footerHash": "de642e83d34ddbee1c190a669bd4aa175ed8446cfaf1024042ab1afa41882c45",
    "headingCounts": {
      "h1": 1,
      "h2": 8,
      "h3": 9
    },
    "metadataObjectHash": "af74c084e8ebaaa094be17eb2adf5b17e5bbb00687ed508b4ff0c57ef00b7abb",
    "isolatedHash": "5d95df0f5cdf1a119d531680b9474ee0c71d44710230449b586a6cb44b733436"
  }
};
const localeCodes = ["en", "es", "vi", "ja", "th", "ar", "ru", "id"];
const stubFiles = [
  "components/FlashGenerator.tsx", "components/CuratedGalleryPreview.tsx",
  "components/home/HomeDiscoveryRegion.tsx", "components/home/HomeHero.tsx",
  "components/home/HomeResourceLinks.tsx", "components/InstallPrompt.tsx"
];
const sha = (input) => createHash("sha256").update(input).digest("hex");
const normalized = (value) => value.replace(/\r\n/g, "\n");
const plain = (value) => JSON.parse(JSON.stringify(value));
const count = (value, needle) => value.split(needle).length - 1;
const read = (file) => beforeRecentlyPlayedSource(file, readFileSync(resolve(projectRoot, file), "utf8"));
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), match[2]]));


// MIG-SQUARE-001 changed props, not rendered content. Verify every explicit prop
// before serializing the old stub interface; the eight accepted SSR hashes stay frozen.
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
const expectedHeroCopy = {
  "eyebrow": "Classic Flash avatar maker",
  "intro": "Play the classic Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more.",
  "cardLabel": "Play Square Face Generator Online"
};
function normalizedDiscoveryProps(props) {
  const value = plain(props);
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.id === "square-face" && node.content?.homepage) {
      assert.equal(sha(JSON.stringify(node.content.homepage)), "1c2664cd3bdd279584ef00ea175a226cb4308df4b69cc7b3a49ab79361a60af5", "Square presentation in discovery props changed");
      assert.equal(node.howToPlay[0].text, "Wait for the Flash game to load in the player above, then press the START button inside the game.");
      assert.equal(node.howToPlay[2].text, "Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, you can take a screenshot of your creation.");
      delete node.content.homepage;
      node.howToPlay[0].text = "Wait for the Flash game to load in the player, then press the START button inside the game.";
      node.howToPlay[2].text = "Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, take a screenshot of your creation.";
    }
    // MIG-OVAL-001 changes record-only presentation, not the Square discovery UI.
    // Verify the exact new block and dimensions before restoring the old stub payload.
    if (node.id === "oval-face") {
      assert.equal(sha(JSON.stringify(node.content?.legacyPage)), "2319477a2ebf04eefdecee49b06bf5ecdeb5fc473c6ead7eed02e704e38916c4", "Oval legacy presentation changed outside its confirmed binding");
      const covers = node.images.filter(image => image.role === "COVER");
      assert.equal(covers.length, 1);
      assert.equal(covers[0].width, 974); assert.equal(covers[0].height, 775);
      delete node.content.legacyPage;
      covers[0].width = 972; covers[0].height = 774;
      assert.equal(sha(JSON.stringify(node)), "5bec65ed9a63409bca553111bff92f6007520fab71de92105f97236090e4d479", "Original Oval discovery data must remain frozen");
    }
    // MIG-PIXEL changes only six explicit data values; verify/reverse them and
    // the full original record hash before preserving the old discovery stub.
    if (node.id === "pixel-art-avatar") Object.assign(node, originalPixelDiscoveryRecord(node));
    for (const child of Object.values(node)) visit(child);
  }
  visit(value);
  return value;
}

function normalizedStubProps(file, props) {
  if (file === "components/home/HomeDiscoveryRegion.tsx") return normalizedDiscoveryProps(props);
  if (file === "components/home/HomeHero.tsx") {
    assert.deepEqual(plain(props.copy), expectedHeroCopy, "Square Hero copy must match its approved record");
    assert.deepEqual(plain(props.player), expectedPlayer, "Square Hero must explicitly receive all 19 player props");
    return {
      h1: props.h1,
      ...Object.fromEntries(["gameName", "swfSources", "coverImageUrl", "backgroundColor", "aspectRatio", "coverImageWidth", "coverImageHeight"].map(key => [key, props.player[key]]))
    };
  }
  if (file === "components/FlashGenerator.tsx") {
    assert.deepEqual(plain(props), expectedPlayer, "Draft player must explicitly receive all 19 player props");
    return Object.fromEntries(["gameName", "swfSources", "coverImageUrl", "backgroundColor", "aspectRatio", "coverImageWidth", "coverImageHeight", "reportHref", "startLabel", "reloadLabel", "helpLabel", "showStartControl"].map(key => [key, props[key]]));
  }
  return props;
}

function checkBoundedSources(sources) {
  for (const [file, frozenHash] of Object.entries(frozenHashes)) {
    let mask = normalized(beforeGamesIndexSource(file, sources[file]));
    for (const edit of edits.filter((entry) => entry.file === file)) {
      assert.equal(count(mask, edit.new), 1, edit.id + " exact confirmed text");
      assert.equal(count(mask, edit.old), 0, edit.id + " legacy assertion remains");
      mask = mask.replace(edit.new, "__LOCALE_001_" + edit.id + "__");
    }
    assert.equal(sha(mask), frozenHash, file + " changed outside approved LOCALE copy and MIG-SQUARE data binding");
  }
}

function isolatedModules(overrides) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    if (stubFiles.includes(file)) {
      mod.exports = {
        __esModule: true,
        default: (props) => React.createElement("div", {
          "data-isolated-stub": file, "data-props": JSON.stringify(normalizedStubProps(file, props))
        }, props.h1 ? React.createElement("h1", null, props.h1) : null)
      };
      return mod.exports;
    }
    if (file.endsWith(".json")) {
      mod.exports = JSON.parse(read(file));
      return mod.exports;
    }
    const source = overrides[file] ?? read(file);
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    assert.equal(parsed.parseDiagnostics.length, 0, file + " parse");
    const compiled = ts.transpileModule(source, {
      fileName: file, reportDiagnostics: true,
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
    });
    assert.equal((compiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error).length, 0, file + " transpile");
    function scopedRequire(id) {
      if (["react", "react/jsx-runtime", "lucide-react", "next/image"].includes(id)) return require(id);
      assert.ok(id.startsWith("@/") || id.startsWith("."), "Unexpected isolated import: " + id);
      const stem = id.startsWith("@/") ? id.slice(2) : join(dirname(file), id);
      const resolved = [stem, stem + ".ts", stem + ".tsx", stem + ".json", join(stem, "index.ts")]
        .find((candidate) => existsSync(resolve(projectRoot, candidate)) && statSync(resolve(projectRoot, candidate)).isFile());
      assert.ok(resolved, "Cannot resolve " + id + " from " + file);
      return load(resolved);
    }
    vm.runInNewContext(compiled.outputText, { module: mod, exports: mod.exports, require: scopedRequire, URL, Date }, { timeout: 10_000, filename: file });
    return mod.exports;
  }
  return { load };
}

function checkSource(sources) {
  checkBoundedSources(sources);
  const modules = isolatedModules(sources);
  const HomePage = modules.load("components/HomePage.tsx").default;
  const localeModule = modules.load("lib/locales.ts");
  const metadata = modules.load("lib/metadata.ts");
  assert.deepEqual(plain(localeModule.localeCodes), localeCodes);
  assert.deepEqual(plain(localeModule.reviewedLocaleCodes), ["en"], "draft locales must not become reviewed");
  const rows = [];
  for (const code of localeCodes) {
    const html = renderToStaticMarkup(React.createElement(HomePage, { locale: code }));
    const meta = plain(metadata.buildHomeMetadata(code));
    assert.equal(sha(beforeGamesIndexNavigation(originalPixelSidebarMarkup(html, code === "en" ? 0 : 1))), expectedDocuments[code].isolatedHash,
      code + " original isolated SSR contract with only the confirmed Pixel label reversed");
    assert.equal(sha(JSON.stringify(meta)), expectedDocuments[code].metadataObjectHash, code + " metadata object changed");
    assert.equal(localeModule.locales[code].features[2].text, edits[0].new);
    assert.equal(localeModule.locales[code].dir, code === "ar" ? "rtl" : "ltr");
    assert.equal(count(html, edits[1].new), code === "en" ? 0 : 1);
    for (const entry of edits.filter((edit) => edit.id !== "draft-gallery-sidebar")) assert.equal(count(html, entry.new), 0, entry.id + " dormant data unexpectedly rendered");
    if (code !== "en") {
      assert.deepEqual(meta.robots, { index: false, follow: true });
      assert.ok(!meta.alternates.languages);
    }
    rows.push(code);
  }
  return rows;
}

function rejectOvalDiscoveryNegatives() {
  const oval = isolatedModules({}).load("data/games/oval-face.ts").default;
  const mutations = [
    record => { record.content.legacyPage.hero.intro += " unapproved"; },
    record => { delete record.content.legacyPage; },
    record => { record.images.find(image => image.role === "COVER").width = 972; },
    record => { record.images.find(image => image.role === "COVER").height = 774; },
    record => { record.license.allowedDeliveryTypes = ["RUFFLE_SWF"]; },
    record => { record.features[0].text += " unapproved"; },
    record => { record.relatedGameIds = []; }
  ];
  for (const mutate of mutations) {
    const record = plain(oval); mutate(record);
    assert.throws(() => normalizedDiscoveryProps({ game: record }), undefined, "Oval stub normalization must not hide unapproved drift");
  }
  return mutations.length;
}

function rejectSourceNegatives(sources) {
  const fixtures = [];
  for (const edit of edits) {
    fixtures.push([edit.file, edit.new, edit.old]);
    fixtures.push([edit.file, edit.new, ""]);
    fixtures.push([edit.file, edit.new, edit.new + " All assets are officially authorized."]);
  }
  fixtures.push(
    ["components/HomePage.tsx", edits[1].new, "Browse style examples and approved submissions when available."],
    ["lib/locales.ts", 'reviewedLocaleCodes = ["en"]', 'reviewedLocaleCodes = ["en", "es"]'],
    ["lib/locales.ts", 'title: "Original Game Feel"', 'title: "Official Game"'],
    ["components/HomePage.tsx", 'href: "/gallery"', 'href: "/unapproved-gallery"'],
    ["components/HomePage.tsx", "<FlashGenerator {...squareHomepage.player} />", "<FlashGenerator {...squareHomepage.player} showStartControl={true} />"],
    ["components/HomePage.tsx", 'locale === "en"', 'locale === "es"'],
    ["components/HomePage.tsx", "gameFeatures.map", "content.features.map"]
  );
  for (const [file, original, changed] of fixtures) {
    assert.ok(sources[file].includes(original), "source fixture not applied: " + original);
    const candidate = { ...sources, [file]: sources[file].replace(original, changed) };
    assert.throws(() => checkBoundedSources(candidate), undefined, "source fixture was accepted: " + original);
  }
  return fixtures.length;
}

function rejectPixelDiscoveryNegatives() {
  const pixel = isolatedModules({}).load("data/games/pixel-art-avatar.ts").default;
  const mutations = [
    record => { record.features[4].text += " unapproved"; },
    record => { record.faq[2].question = "Why does the embedded generator not load?"; },
    record => { record.faq[0].answer += " unapproved"; },
    record => { record.license.allowedDeliveryTypes = ["EXTERNAL_LINK", "OFFICIAL_IFRAME"]; },
    record => { record.license.newPublicationAllowed = false; },
    record => { record.source.originalUrl = "https://example.invalid/tool"; },
    record => { record.player.rel = ["noopener"]; },
    record => { record.seo.schemaTypes = ["WebPage", "WebApplication", "FAQPage", "BreadcrumbList"]; }
  ];
  for (const mutate of mutations) {
    const record = plain(pixel); mutate(record);
    assert.throws(() => normalizedDiscoveryProps({ game: record }), undefined,
      "Pixel stub normalization must not hide extra copy, URL, schema, or permission changes");
  }
  return mutations.length;
}

function checkDocument(html, code) {
  html = beforeGamesIndexNavigation(html);
  const expected = expectedDocuments[code];
  const mains = [...html.matchAll(/<main\b[^>]*>[\s\S]*?<\/main>/gi)];
  assert.equal(mains.length, 1, code + " main count");
  const head = html.match(/<head>[\s\S]*?<\/head>/i)?.[0];
  assert.ok(head, code + " head missing");
  const main = mains[0][0];
  assert.equal(sha(beforeRelatedRemainingHomeMarkup(originalPixelSidebarMarkup(main, code === "en" ? 0 : 1))), expected.mainHash,
    code + " full main HTML changed beyond the approved sidebar copy and exact Pixel label");
  assert.equal(html.match(/<title>([\s\S]*?)<\/title>/)?.[1], expected.title, code + " title");
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map((match) => attrs(match[0]));
  const relevantMetas = metas.filter((entry) => ["description", "robots"].includes(entry.name) || entry.property?.startsWith("og:") || entry.name?.startsWith("twitter:"));
  const links = [...head.matchAll(/<link\b[^>]*>/g)].map((match) => attrs(match[0])).filter((entry) => entry.rel === "canonical" || entry.hreflang);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.equal(sha(JSON.stringify(relevantMetas)), expected.metasHash, code + " metadata");
  assert.equal(sha(JSON.stringify(links)), expected.linksHash, code + " canonical or language alternates");
  assert.equal(sha(JSON.stringify(schemas)), expected.schemasHash, code + " JSON-LD");
  assert.equal(sha(html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] ?? ""), expected.headerHash, code + " header");
  assert.equal(sha(html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? ""), expected.footerHash, code + " footer");
  const wrapper = '<div lang="' + code + '" dir="' + (code === "ar" ? "rtl" : "ltr") + '">';
  assert.equal(count(html, wrapper), 1, code + " language and direction wrapper");
  assert.equal(count(main, edits[1].new), code === "en" ? 0 : 1);
  for (const entry of edits) assert.equal(count(html, entry.old), 0, code + " unapproved old copy remains");
  assert.deepEqual(Object.fromEntries(["h1", "h2", "h3"].map((tag) => [tag, (main.match(new RegExp("<" + tag + "\\b", "g")) ?? []).length])), expected.headingCounts);
  const canonicals = links.filter((entry) => entry.rel === "canonical");
  const canonical = "https://mysquarefaceicon.com" + (code === "en" ? "" : "/" + code);
  assert.deepEqual(canonicals.map((entry) => entry.href), [canonical]);
  if (code !== "en") {
    assert.equal(metas.find((entry) => entry.name === "robots")?.content, "noindex, follow");
    assert.equal(links.filter((entry) => entry.hreflang).length, 0);
  } else {
    for (const entry of metas.filter((item) => /^(robots|googlebot)$/.test(item.name ?? ""))) assert.doesNotMatch(entry.content ?? "", /noindex|none/i);
  }
}

function rejectDocumentNegatives(html, code) {
  const canonical = "https://mysquarefaceicon.com" + (code === "en" ? "" : "/" + code);
  const fixtures = [
    ["<title>" + expectedDocuments[code].title + "</title>", "<title>Unapproved title</title>"],
    ['rel="canonical" href="' + canonical + '"', 'rel="canonical" href="https://example.invalid/"'],
    ["<h1", '<h1 hidden data-unapproved="true"'],
    ["<main>", "<main hidden>"],
    ["</main>", "<p>Unauthorized new paragraph.</p></main>"],
    ['"@type":"VideoGame"', '"@type":"Product"'],
    ['class="site-nav"', 'class="site-nav" hidden'],
    ['class="home-footer"', 'class="home-footer" hidden'],
    ['lang="' + code + '" dir="' + (code === "ar" ? "rtl" : "ltr") + '"', 'lang="xx" dir="rtl"'],
    ["</head>", '<link rel="alternate" hreflang="es" href="https://mysquarefaceicon.com/es"/></head>']
  ];
  if (code === "en") {
    fixtures.push(["</head>", '<meta name="robots" content="noindex, follow"/></head>']);
  } else {
    fixtures.push(
      [edits[1].new, edits[1].old],
      [edits[1].new, "Browse style examples and approved submissions when available."],
      [edits[1].new, "All Gallery images are verified original creations."],
      ['content="noindex, follow"', 'content="index, follow"'],
      ['href="/gallery"><img', 'href="/missing-gallery"><img']
    );
  }
  for (const [original, changed] of fixtures) {
    assert.ok(html.includes(original), code + " HTML fixture not applied: " + original);
    assert.throws(() => checkDocument(html.replace(original, changed), code), undefined, code + " HTML fixture accepted: " + original);
  }
  return fixtures.length;
}

function checkSitemap(xml) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 20); assert.equal(new Set(urls).size, 20);
  assert.equal(count(xml, "<lastmod>"), 0, "do not fabricate lastmod");
  for (const code of localeCodes.slice(1)) assert.ok(!urls.includes("https://mysquarefaceicon.com/" + code));
  assert.ok(urls.includes("https://mysquarefaceicon.com"));
}
function rejectSitemapNegatives(xml) {
  const fixtures = [
    xml.replace("</urlset>", '<url><loc>https://mysquarefaceicon.com/es</loc></url></urlset>'),
    xml.replace("</urlset>", '<url><loc>https://mysquarefaceicon.com</loc></url></urlset>'),
    xml.replace("</url>", "<lastmod>2026-09-02</lastmod></url>"),
    xml.replace("<loc>https://mysquarefaceicon.com</loc>", "<loc>https://mysquarefaceicon.com/ar</loc>")
  ];
  for (const candidate of fixtures) { assert.notEqual(candidate, xml); assert.throws(() => checkSitemap(candidate)); }
  return fixtures.length;
}

try {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run locale:check [-- --built | -- --base http://127.0.0.1:3100]");
  const sources = Object.fromEntries(Object.keys(frozenHashes).map((file) => [file, read(file)]));
  const rows = checkSource(sources), negativeSource = rejectSourceNegatives(sources);
  console.log("MIG-OVAL-001 isolated discovery guard: " + rejectOvalDiscoveryNegatives() + " negative fixtures rejected; original eight SSR hashes and all existing fixtures retained.");
  console.log("MIG-PIXEL-001 isolated discovery guard: " + rejectPixelDiscoveryNegatives() + " negative fixtures rejected; only exact confirmed data/side-label differences reversed, no golden refresh.");
  console.log("LOCALE-001 source passed: four confirmed copy regions plus MIG-SQUARE data binding, other source frozen; " + rows.length + " unchanged isolated HomePage/GameSidebar SSR and metadata contracts.");
  console.log("Fail-closed source negative fixtures: " + negativeSource + " rejected. Player/Hero/discovery/gallery/resource/install components use explicit isolated stubs, not browser proof.");
  if (args.length) {
    let base;
    if (args[0] === "--base") {
      base = new URL(args[1]);
      assert.ok(["http:", "https:"].includes(base.protocol) && ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "only loopback origin is allowed");
      assert.ok(base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password);
    }
    async function get(path, file, type) {
      if (!base) return read(file);
      const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10_000) });
      assert.equal(response.status, 200, path + " HTTP status"); assert.match(response.headers.get("content-type") ?? "", type);
      if (path === "/") assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|none/i);
      return response.text();
    }
    let negativeHtml = 0;
    for (const code of localeCodes) {
      const path = code === "en" ? "/" : "/" + code;
      const html = await get(path, ".next/server/app/" + (code === "en" ? "index" : code) + ".html", /text\/html/i);
      checkDocument(html, code); negativeHtml += rejectDocumentNegatives(html, code);
    }
    const sitemap = await get("/sitemap.xml", ".next/server/app/sitemap.xml.body", /xml/i);
    checkSitemap(sitemap);
    console.log("LOCALE-001 " + (base ? "HTTP " + base.origin : "built HTML") + " passed: 8 routes, root content unchanged, 7 draft sidebar updates, metadata/schema/header/footer/links/index/direction preserved.");
    console.log("Fail-closed HTML negative fixtures: " + negativeHtml + " rejected; sitemap negatives: " + rejectSitemapNegatives(sitemap) + " rejected; sitemap has 20 unique URLs, no drafts and no fabricated lastmod.");
  }
  console.log("This check does not prove actual SWF/image permissions, browser hydration/mobile behavior, current CWV, or production deployment.");
} catch (error) {
  console.error("LOCALE-001 check failed: " + error.message);
  process.exitCode = 1;
}
