#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = resolve(projectRoot, "app/gallery/page.tsx");
const canonical = "https://mysquarefaceicon.com/gallery";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
// Six explicitly confirmed text regions; never read mutable board/evidence as test expectations.
const edits = [
  {
    "id": "metadata.description",
    "old": "Browse the Square Face Icon Gallery for approved community creations, user screenshots, ratings, and original avatar style ideas.",
    "new": "Explore the Square Face Icon Gallery for simple avatar style examples and approved community submissions when available. Check source and reuse permissions."
  },
  {
    "id": "openGraph.description",
    "old": "Approved square face icon community creations, screenshots, ratings, and original avatar style ideas.",
    "new": "Simple square face icon style examples, plus approved community submissions when available. Source and reuse permissions require separate verification."
  },
  {
    "id": "twitter.description",
    "old": "Browse approved square face avatar creations and ideas before making your own icon.",
    "new": "Browse simple avatar style examples and approved community submissions when available. Check source and reuse permissions before using an image."
  },
  {
    "id": "collectionSchema.description",
    "old": "Approved community square face icon creations plus original style ideas for profile avatars and social media icons.",
    "new": "Simple square face icon style examples and approved community submissions when available; selection or moderation does not establish authorship or image-use rights."
  },
  {
    "id": "eyebrow",
    "old": "Original avatar ideas",
    "new": "Avatar style ideas"
  },
  {
    "id": "lead",
    "old": "This gallery collects approved community submissions from My Square Face Icon along with original style ideas.\n          Use it to browse screenshots, ratings, expressions, colors, and profile-picture readability before making your\n          own avatar in the generator.",
    "new": "This gallery pairs simple style illustrations with approved community submissions when available.\n          The eight sample faces in the examples section are illustrations, not game screenshots.\n          Use them to compare expression, contrast, and small-size readability.\n          Display or moderation does not verify authorship or grant image-use rights; check permissions for the specific image."
  }
];
const headings = {
  "h1": [
    "Square Face Icon Gallery"
  ],
  "h2": [
    "Community Square Face Creations",
    "Browse Square Face Icon Gallery Examples",
    "How to Use These Gallery Examples",
    "Create Your Own Square Face Icon"
  ],
  "h3": [
    "Soft Mint Smile",
    "Coral Creator",
    "Game Lobby Green",
    "Peach Chat Icon",
    "Blue Forum Badge",
    "Berry Cute Avatar",
    "Minimal Profile Face",
    "Sunny Group Icon",
    "Pick a mood",
    "Copy the principle, not the exact look",
    "Check the small preview",
    "Open the generator",
    "Use the free avatar maker workflow",
    "Read cute avatar tips"
  ]
};
const expectedLinks = [
  {
    "href": "/#maker",
    "text": "Make your own icon"
  },
  {
    "href": "/#maker",
    "text": "Open the generator Start with the main square face generator and build your own icon."
  },
  {
    "href": "/free-avatar-maker",
    "text": "Use the free avatar maker workflow Follow a fast process for creating profile-ready avatars."
  },
  {
    "href": "/cute-square-avatar-generator",
    "text": "Read cute avatar tips Learn how to choose softer expressions, colors, and accessories."
  }
];
const expectedSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Square Face Icon Gallery",
    "description": "Simple square face icon style examples and approved community submissions when available; selection or moderation does not establish authorship or image-use rights.",
    "url": "https://mysquarefaceicon.com/gallery",
    "isPartOf": {
      "@type": "WebSite",
      "name": "My Square Face Icon",
      "url": "https://mysquarefaceicon.com"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mysquarefaceicon.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Gallery",
        "item": "https://mysquarefaceicon.com/gallery"
      }
    ]
  }
];
const metadata = {
  "title": "Square Face Icon Gallery - Community Creations",
  "description": "Explore the Square Face Icon Gallery for simple avatar style examples and approved community submissions when available. Check source and reuse permissions.",
  "alternates": {
    "canonical": "https://mysquarefaceicon.com/gallery"
  },
  "openGraph": {
    "type": "website",
    "url": "https://mysquarefaceicon.com/gallery",
    "title": "Square Face Icon Gallery - Community Creations",
    "description": "Simple square face icon style examples, plus approved community submissions when available. Source and reuse permissions require separate verification.",
    "images": [
      "/og-image.svg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Square Face Icon Gallery - Community Creations",
    "description": "Browse simple avatar style examples and approved community submissions when available. Check source and reuse permissions before using an image.",
    "images": [
      "/og-image.svg"
    ]
  }
};
const expectedFrozenHash = "0e6e6fb2063f544bd0f6d3757888a8b33d22ed79e8396764866b97ce9380bb39";
const expectedCommunityHash = "02db74c38bf07f57c92defb239866cd75bfeef561333de1db9acfc9d44ddfd21";
const expectedLocalesHash = "a96fefe1140236963e49b59ed632641794f1b39b5f5c3bd5df79adac876df8db";
const acceptedKwCopy = "Use this square face icon gallery to compare expression, contrast, and small-size readability before you make a new design.";

const sha = (value) => createHash("sha256").update(value).digest("hex");
const clone = (value) => JSON.parse(JSON.stringify(value));
const decode = (value) => value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCodePoint(parseInt(hex || dec, hex ? 16 : 10)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const plain = (value) => decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const contents = (value, tag) => [...value.matchAll(new RegExp("<" + tag + "\\b[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "gi"))].map((match) => plain(match[1]));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), decode(match[2])]));

function compile(source, filename, imports) {
  const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  assert.equal(parsed.parseDiagnostics.length, 0, filename + " syntax");
  const compiled = ts.transpileModule(source, {
    fileName: filename, reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
  });
  assert.equal((compiled.diagnostics ?? []).filter((entry) => entry.category === ts.DiagnosticCategory.Error).length, 0, filename + " transpile");
  const mod = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module: mod, exports: mod.exports,
    require: (id) => {
      if (Object.hasOwn(imports, id)) return imports[id];
      if (["react", "react/jsx-runtime", "lucide-react", "next/image"].includes(id)) return require(id);
      throw new Error("Unexpected import in isolated SSR: " + id);
    }
  }, { timeout: 10_000 });
  return mod.exports;
}

const communitySource = readFileSync(resolve(projectRoot, "components/CommentSection.tsx"), "utf8");
const localeSource = readFileSync(resolve(projectRoot, "lib/locales.ts"), "utf8");
assert.equal(sha(communitySource), expectedCommunityHash, "shared community source changed outside this task");
assert.equal(sha(localeSource), expectedLocalesHash, "locale content changed outside this task");
const localeModule = compile(localeSource, "lib/locales.ts", {});
const communityModule = compile(communitySource, "components/CommentSection.tsx", {});
const nullComponent = { __esModule: true, default: () => null };

function renderSource(source) {
  const page = compile(source, "app/gallery/page.tsx", {
    "@/components/SiteHeader": nullComponent, "@/components/SiteFooter": nullComponent,
    "@/components/CommentSection": communityModule, "@/lib/locales": localeModule
  });
  assert.deepEqual(clone(page.metadata), metadata, "metadata differs from the confirmed six-region result");
  return renderToStaticMarkup(React.createElement(page.default));
}

function checkMarkup(markup) {
  const mains = [...markup.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/gi)];
  assert.equal(mains.length, 1, "exactly one main is required");
  const main = mains[0][1];
  assert.doesNotMatch(mains[0][0], /<script\b|\shidden(?:\s|[=>])|class="[^"]*\b(?:hidden|sr-only)\b|style="[^"]*(?:display\s*:\s*none|visibility\s*:\s*hidden)/i,
    "main copy must not be hidden or replaced by scripts");
  for (const tag of ["h1", "h2", "h3"]) assert.deepEqual(contents(main, tag), headings[tag], tag + " structure or text changed");
  const paragraphs = contents(main, "p");
  // Actual shared CommentSection initial SSR adds one empty-state paragraph to the 19 page-owned paragraphs.
  assert.equal(paragraphs.length, 20, "page/initial empty-state paragraphs changed");
  assert.equal(paragraphs.filter((value) => value === plain(edits[5].new)).length, 1, "lead differs from approved copy");
  assert.equal(paragraphs.filter((value) => value === edits[4].new).length, 1, "eyebrow differs from approved copy");
  assert.equal(paragraphs.filter((value) => value === acceptedKwCopy).length, 1, "accepted KW-02 sentence changed");
  assert.equal((plain(main).match(/square face icon gallery/gi) || []).length, 3, "KW-02 coverage changed");
  assert.doesNotMatch(plain(main), /Original avatar ideas|along with original style ideas/);
  const links = [...main.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({ href: attributes(match[1]).href, text: plain(match[2]) }));
  assert.deepEqual(links, expectedLinks, "main link order, destinations or copy changed");
  const samples = [...main.matchAll(/<div\b[^>]*class="avatar-sample"[^>]*>/g)].map((match) => attributes(match[0]));
  assert.equal(samples.length, 8, "eight CSS sample faces required");
  samples.forEach((sample, index) => {
    assert.equal(sample.role, "img");
    assert.equal(sample["aria-label"], headings.h3[index] + " square face icon example");
  });
  assert.equal((main.match(/class="comments-layout comments-layout-single"/g) || []).length, 1, "community module missing");
  assert.equal((main.match(/class="empty-comments"/g) || []).length, 1, "initial SSR empty state missing");
  assert.equal((main.match(/<form\b/g) || []).length, 0, "Gallery must not expose a submission form");
  assert.deepEqual(contents(main, "button"), ["Latest", "Most Liked"], "initial sort controls changed");
  const structure = [...mains[0][0].matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)].map((match) => ({
    tag: match[1].toLowerCase(), closing: match[0].startsWith("</"), attributes: attributes(match[0])
  }));
  return { paragraphs, headings, links, samples, structure, mainText: plain(main) };
}

function readSchemas(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === "application/ld+json").map((match) => JSON.parse(match[2]));
}

function checkSource(source) {
  let frozen = source;
  for (const edit of edits) {
    assert.equal(frozen.split(edit.new).length - 1, 1, edit.id + " must appear exactly once");
    assert.ok(!frozen.includes(edit.old), edit.id + " contains obsolete copy");
    frozen = frozen.replace(edit.new, "__GALLERY_REGION_" + edit.id + "__");
  }
  assert.equal(sha(frozen), expectedFrozenHash, "unapproved source change outside six text regions");
  const html = renderSource(source);
  assert.deepEqual(readSchemas(html), expectedSchemas, "CollectionPage or BreadcrumbList differs from confirmed result");
  return checkMarkup(html);
}

function checkDocument(html, expectedMarkup) {
  assert.deepEqual(checkMarkup(html), expectedMarkup, "raw HTML differs from actual shared-component initial SSR");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, "raw HTML head missing");
  assert.deepEqual(contents(head, "title"), [metadata.title + " | My Square Face Icon"]);
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const expectMeta = (key, value, attribute = "name") => {
    assert.deepEqual(meta.filter((tag) => tag[attribute] === key).map((tag) => tag.content), [value], key + " mismatch");
  };
  expectMeta("description", metadata.description);
  for (const [key, value] of Object.entries({
    "og:title": metadata.openGraph.title, "og:description": metadata.openGraph.description,
    "og:url": canonical, "og:image": new URL(metadata.openGraph.images[0], canonical).href, "og:type": "website"
  })) expectMeta(key, value, "property");
  for (const [key, value] of Object.entries({
    "twitter:card": metadata.twitter.card, "twitter:title": metadata.twitter.title,
    "twitter:description": metadata.twitter.description, "twitter:image": new URL(metadata.twitter.images[0], canonical).href
  })) expectMeta(key, value);
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0])).filter((tag) => tag.rel === "canonical");
  assert.deepEqual(canonicals.map((tag) => tag.href), [canonical]);
  for (const tag of meta.filter((entry) => /^(robots|googlebot)$/i.test(entry.name || ""))) assert.doesNotMatch(tag.content || "", /(?:noindex|none)/i);
  assert.deepEqual(readSchemas(html), expectedSchemas, "raw structured data changed");
}

function rejectNegatives(input, cases, check, label) {
  for (const [original, changed] of cases) {
    assert.ok(input.includes(original), label + " fixture was not applied: " + original);
    assert.notEqual(original, changed);
    assert.throws(() => check(input.replace(original, changed)), undefined, label + " fixture was accepted: " + original);
  }
  return cases.length;
}

function checkCommunityFixtures() {
  const fixture = { id: "gallery-qa-fixture", name: "Fixture Reviewer", content: "In-memory test only.", rating: 3, likes: 7, imageUrl: "/qa-fixture.png", createdAt: "2026-09-02T00:00:00Z" };
  const cases = [
    { name: "empty", comments: [], loadError: false, sort: "latest", liked: [] },
    { name: "load-error", comments: [], loadError: true, sort: "latest", liked: [] },
    { name: "populated-liked", comments: [fixture], loadError: false, sort: "liked", liked: [] },
    { name: "already-liked", comments: [fixture], loadError: false, sort: "latest", liked: [fixture.id] }
  ];
  for (const entry of cases) {
    let hookIndex = 0;
    const state = [entry.comments, 5, "idle", entry.loadError, entry.sort, new Set(entry.liked), "", ""];
    const mockReact = { ...React, useState: () => [state[hookIndex++], () => {}], useEffect: () => {}, useMemo: (fn) => fn() };
    const component = compile(communitySource, "components/CommentSection.tsx", {
      react: mockReact,
      "next/image": { __esModule: true, default: (props) => React.createElement("img", { src: props.src, alt: props.alt, width: props.width, height: props.height, loading: props.loading }) }
    }).default;
    const html = renderToStaticMarkup(React.createElement(component, { locale: "en", content: localeModule.locales.en.comments, limit: 500, showForm: false, showSort: true }));
    assert.equal(hookIndex, 8, "review changed state ordering before updating fixtures");
    assert.doesNotMatch(html, /<form\b|type="email"/i);
    assert.equal((html.match(/class="empty-comments"/g) || []).length, entry.name === "empty" ? 1 : 0);
    assert.equal((html.match(/class="form-message error"/g) || []).length, entry.loadError ? 1 : 0);
    assert.equal((html.match(/class="comment-card"/g) || []).length, entry.comments.length);
    const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map((match) => ({ attrs: attributes(match[1]), text: plain(match[2]) }));
    assert.deepEqual(buttons.slice(0, 2).map((button) => ({ text: button.text, active: button.attrs.class === "is-active" })), [
      { text: "Latest", active: entry.sort === "latest" }, { text: "Most Liked", active: entry.sort === "liked" }
    ]);
    if (entry.comments.length) {
      assert.match(html, /aria-label="Rating 3 out of 5"/);
      assert.match(html, /aria-label="Like comment from Fixture Reviewer"/);
      assert.equal(buttons[2].text, "7", "real likes count rendered");
      assert.equal(Object.hasOwn(buttons[2].attrs, "disabled"), entry.liked.length > 0);
      assert.match(html, /alt="Square face icon shared by Fixture Reviewer"/);
    }
  }
  return cases.map((entry) => entry.name);
}

function checkRawNegatives(html, expectedMarkup) {
  return rejectNegatives(html, [
    ...edits.map((edit) => [plain(edit.new), plain(edit.old)]),
    ["check permissions for the specific image.", "All images are authorized for commercial reuse."],
    [canonical, "https://example.invalid/gallery"],
    ["<title>" + metadata.title + " | My Square Face Icon</title>", "<title>Unapproved title</title>"],
    ["<h1>Square Face Icon Gallery</h1>", "<h1>Unapproved heading</h1>"],
    ['"@type":"CollectionPage"', '"@type":"Product"'],
    ['"@type":"BreadcrumbList"', '"@type":"Product"'],
    ['href="/#maker">Make your own icon</a>', 'href="/missing">Make your own icon</a>'],
    ["</head>", '<meta name="robots" content="noindex"/></head>'],
    ['<main class="resource-page">', '<main class="resource-page" hidden>'],
    [acceptedKwCopy, "Avatar design examples."],
    ['aria-label="Soft Mint Smile square face icon example"', 'aria-label="Unapproved image"'],
    ['<div class="comments-layout comments-layout-single">', '<div class="comments-layout comments-layout-single" hidden>'],
    ["Most Liked", "Unapproved sort"],
    ["</main>", "<p>Unexpected content.</p></main>"]
  ], (candidate) => checkDocument(candidate, expectedMarkup), "raw HTML");
}

try {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run gallery:check [-- --built | -- --base http://127.0.0.1:3100]");
  const source = readFileSync(pagePath, "utf8");
  const expectedMarkup = checkSource(source);
  const rejectedSource = rejectNegatives(source, [
    ...edits.map((edit) => [edit.new, edit.old]),
    ["check permissions for the specific image.", "All images are authorized for commercial reuse."],
    [acceptedKwCopy, "Avatar design examples."],
    ['href="/#maker"', 'href="/missing"'],
    ['className="resource-page"', 'className="resource-page hidden"'],
    [canonical, "https://example.invalid/gallery"],
    ['title: "Square Face Icon Gallery - Community Creations"', 'title: "Unapproved title"'],
    ["<h1>Square Face Icon Gallery</h1>", "<h1>Unapproved heading</h1>"],
    ['"@type": "CollectionPage"', '"@type": "Product"'],
    ['"@type": "BreadcrumbList"', '"@type": "Product"'],
    ['title: "Soft Mint Smile"', 'title: "Unapproved sample"'],
    ["showForm={false}", "showForm={true}"],
    ["showSort />", "showSort={false} />"]
  ], checkSource, "source");
  const fixtures = checkCommunityFixtures();
  console.log("GALLERY-001 source passed: six confirmed regions, other source frozen, 1 H1 / 4 H2 / 14 H3 / 19 page paragraphs + 1 actual initial community paragraph, eight CSS samples, four main links, KW-02 count 3.");
  console.log("Fail-closed source negative fixtures: " + rejectedSource + " rejected. Community in-memory SSR states: " + fixtures.join(", ") + "; no API, database, storage or browser interaction.");
  if (args[0] === "--built") {
    const html = readFileSync(resolve(projectRoot, ".next/server/app/gallery.html"), "utf8");
    checkDocument(html, expectedMarkup);
    console.log("GALLERY-001 built HTML passed: source/render parity, descriptions, metadata/schema/index and community empty-state structure; " + checkRawNegatives(html, expectedMarkup) + " raw negative fixtures rejected.");
    console.log("Offline artifacts do not verify HTTP, hydration/browser/mobile, actual licenses or production release.");
  } else if (args.length) {
    const base = new URL(args[1]);
    assert.ok(["http:", "https:"].includes(base.protocol));
    assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "pre-deployment check requires a local origin");
    assert.ok(base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password, "--base must be a local origin");
    const url = new URL("/gallery", base);
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    assert.equal(response.status, 200, "Gallery returned HTTP " + response.status);
    assert.match(response.headers.get("content-type") || "", /text\/html/i);
    assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /(?:noindex|none)/i);
    const html = await response.text();
    checkDocument(html, expectedMarkup);
    console.log("GALLERY-001 HTTP passed: " + url + "; 200, exact content, metadata/schema/index, actual initial SSR parity; " + checkRawNegatives(html, expectedMarkup) + " raw negative fixtures rejected.");
  } else {
    console.log("Source/SSR fixtures do not verify HTTP, live UGC availability, browser/mobile, actual licenses or production release.");
  }
} catch (error) {
  console.error("GALLERY-001 check failed: " + error.message);
  process.exitCode = 1;
}
