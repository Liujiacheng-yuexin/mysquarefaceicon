#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = resolve(projectRoot, "app/about-us/page.tsx");
const canonical = "https://mysquarefaceicon.com/about-us";
const title = "About My Square Face Icon";
const acceptedKwCopy = "This page also explains what visitors should know about My Square Face Icon before using the generator, gallery, guides, or community features.";
// These constants are the seven explicitly approved regions, not a mutable status fixture.
const edits = [
  {
    "id": "metadata-description",
    "old": "Learn about My Square Face Icon, a free browser-based square face generator focused on cute profile icons, privacy, and original avatar resources.",
    "new": "Learn about My Square Face Icon, its browser-based avatar tools, curated examples, community gallery, privacy practices, and unverified game-file rights."
  },
  {
    "id": "twitter-description",
    "old": "Learn why My Square Face Icon exists and how the site approaches free avatar tools, privacy, and original content.",
    "new": "Learn how My Square Face Icon handles avatar tools, curated examples, community submissions, privacy, and unverified game-file rights."
  },
  {
    "id": "gallery-heading",
    "old": "Original gallery ideas",
    "new": "Avatar inspiration"
  },
  {
    "id": "gallery-paragraph",
    "old": "Gallery examples are created for this site as inspiration. They are not copied from competitors, user comments, or third-party art packs.",
    "new": "The homepage shows site-curated icon examples. The gallery includes simple style examples and approved community submissions when available. Selection or moderation does not establish authorship or grant image-use permissions."
  },
  {
    "id": "rights-heading",
    "old": "Originality and Rights",
    "new": "Game Files and Image Rights"
  },
  {
    "id": "rights-paragraph",
    "old": "The site does not copy competitor page text, screenshots, image libraries, comments, or downloadable assets. The main tool uses the square face game file that was provided for this project, while new examples and support content are written specifically for My Square Face Icon.",
    "new": "Square and Oval run third-party Flash (SWF) files through Ruffle. We have not verified the original source, rights holder, or permissions for the exact files used here, including hosting, public use, redistribution, and use of generated images. The site's availability and examples do not establish authorization or grant third-party rights."
  },
  {
    "id": "gallery-link-description",
    "old": "See original square face icon ideas for style inspiration.",
    "new": "Browse style ideas and approved community submissions when available."
  }
];
const headings = {
  "h1": [
    "About My Square Face Icon"
  ],
  "h2": [
    "About My Square Face Icon: Why This Site Exists",
    "What We Provide",
    "Game Files and Image Rights",
    "Privacy and Community",
    "Next Product Direction"
  ],
  "h3": [
    "Free square face generator",
    "Helpful avatar guides",
    "Avatar inspiration",
    "Use the generator",
    "Free avatar maker guide",
    "Browse the gallery",
    "Contact the project"
  ]
};
const expectedLinks = [
  {
    "href": "/#maker",
    "text": "Back to the generator"
  },
  {
    "href": "/privacy-policy",
    "text": "Privacy Policy"
  },
  {
    "href": "/terms-of-service",
    "text": "Terms of Service"
  },
  {
    "href": "/editorial-policy",
    "text": "Editorial Policy"
  },
  {
    "href": "/#maker",
    "text": "Use the generator Start with the core square face generator experience."
  },
  {
    "href": "/free-avatar-maker",
    "text": "Free avatar maker guide Learn how to use the site as a simple free avatar maker."
  },
  {
    "href": "/gallery",
    "text": "Browse the gallery Browse style ideas and approved community submissions when available."
  },
  {
    "href": "/contact",
    "text": "Contact the project Send generator feedback, privacy questions, or correction requests."
  }
];
const expectedSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About My Square Face Icon",
    "description": "About page for My Square Face Icon, a free browser-based square face generator and avatar resource site.",
    "url": "https://mysquarefaceicon.com/about-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "My Square Face Icon",
      "url": "https://mysquarefaceicon.com",
      "logo": "https://mysquarefaceicon.com/favicon512.png"
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
        "name": "About Us",
        "item": "https://mysquarefaceicon.com/about-us"
      }
    ]
  }
];
const metadata = {
  "title": "About My Square Face Icon",
  "description": "Learn about My Square Face Icon, its browser-based avatar tools, curated examples, community gallery, privacy practices, and unverified game-file rights.",
  "alternates": {
    "canonical": "https://mysquarefaceicon.com/about-us"
  },
  "openGraph": {
    "type": "website",
    "url": "https://mysquarefaceicon.com/about-us",
    "title": "About My Square Face Icon",
    "description": "A practical, privacy-aware avatar tool site for making cute square face icons in the browser.",
    "images": [
      "/og-image.svg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "About My Square Face Icon",
    "description": "Learn how My Square Face Icon handles avatar tools, curated examples, community submissions, privacy, and unverified game-file rights.",
    "images": [
      "/og-image.svg"
    ]
  }
};
const expectedFrozenHash = "1fa66ad37bc918b8f99b2fd907e8b2c0e32db8435d71a6c1badca8c3cf689e27";

// JSX requires escaping this apostrophe; rendered text remains the exact confirmed sentence.
const sourceCopy = (edit) => edit.id === "rights-paragraph" ? edit.new.replace("site's", "site&apos;s") : edit.new;

const decode = (value) => value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCodePoint(parseInt(hex || dec, hex ? 16 : 10)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const plain = (value) => decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const contents = (value, tag) => [...value.matchAll(new RegExp("<" + tag + "\\b[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "gi"))].map((match) => plain(match[1]));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), decode(match[2])]));

function checkMarkup(markup) {
  const mains = [...markup.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/gi)];
  assert.equal(mains.length, 1, "exactly one main is required");
  const main = mains[0][1];
  for (const tag of ["h1", "h2", "h3"]) {
    assert.deepEqual(contents(main, tag), headings[tag], tag + " structure or text changed");
  }
  const paragraphs = contents(main, "p");
  assert.equal(paragraphs.length, 16, "paragraph structure changed");
  for (const id of ["gallery-paragraph", "rights-paragraph", "gallery-link-description"]) {
    const copy = edits.find((edit) => edit.id === id).new;
    assert.equal(paragraphs.filter((text) => text === copy).length, 1, id + " differs from confirmed copy");
  }
  assert.equal(paragraphs.filter((text) => text === acceptedKwCopy).length, 1, "accepted KW-02 sentence changed");
  assert.equal((plain(main).match(/about my square face icon/gi) || []).length, 3, "KW-02 main coverage changed");
  assert.doesNotMatch(plain(main), /Original gallery ideas|Originality and Rights|provided for this project|Gallery examples are created for this site|See original square face icon ideas/i);
  const links = [...main.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: attributes(match[1]).href,
    text: plain(match[2])
  }));
  assert.deepEqual(links, expectedLinks, "main link order, destinations or copy changed");
  return { paragraphs, headings, links };
}

function checkSource(source) {
  let frozen = source.replace(/\r\n/g, "\n");
  for (const edit of edits) {
    const copy = sourceCopy(edit);
    assert.equal(frozen.split(copy).length - 1, 1, edit.id + " must appear exactly once");
    assert.ok(!frozen.includes(edit.old), edit.id + " still contains obsolete copy");
    frozen = frozen.replace(copy, "__ABOUT001_" + edit.id + "__");
  }
  assert.equal(createHash("sha256").update(frozen).digest("hex"), expectedFrozenHash,
    "unapproved source change outside the seven regions: metadata/schema, imports, layout, links or other copy");
  return checkMarkup(source);
}

function checkDocument(html, expectedMarkup) {
  assert.deepEqual(checkMarkup(html), expectedMarkup, "raw HTML differs from approved source");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, "raw HTML head is missing");
  assert.deepEqual(contents(head, "title"), [title + " | My Square Face Icon"]);
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const expectMeta = (key, value, attribute = "name") => {
    assert.deepEqual(meta.filter((tag) => tag[attribute] === key).map((tag) => tag.content), [value], key + " mismatch");
  };
  expectMeta("description", metadata.description);
  const openGraph = {
    "og:title": metadata.openGraph.title,
    "og:description": metadata.openGraph.description,
    "og:url": canonical,
    "og:image": new URL(metadata.openGraph.images[0], canonical).href,
    "og:type": metadata.openGraph.type
  };
  for (const [key, value] of Object.entries(openGraph)) expectMeta(key, value, "property");
  const twitter = {
    "twitter:card": metadata.twitter.card,
    "twitter:title": metadata.twitter.title,
    "twitter:description": metadata.twitter.description,
    "twitter:image": new URL(metadata.twitter.images[0], canonical).href
  };
  for (const [key, value] of Object.entries(twitter)) expectMeta(key, value);
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0])).filter((tag) => tag.rel === "canonical");
  assert.deepEqual(canonicals.map((tag) => tag.href), [canonical]);
  for (const tag of meta.filter((entry) => /^(robots|googlebot)$/i.test(entry.name || ""))) {
    assert.doesNotMatch(tag.content || "", /(?:noindex|none)/i, "About unexpectedly became noindex");
  }
  const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === "application/ld+json")
    .map((match) => JSON.parse(match[2]));
  assert.deepEqual(schemas, expectedSchemas, "AboutPage or BreadcrumbList changed");
}

function checkRawNegatives(html, expectedMarkup) {
  const cases = [
    [edits[0].new, edits[0].old],
    ["We have not verified the original source", "We have verified the original source"],
    ['<a href="/gallery"><h3>Browse the gallery</h3>', '<a href="/missing-gallery"><h3>Browse the gallery</h3>'],
    [canonical, "https://example.invalid/about-us"],
    ['"@type":"AboutPage"', '"@type":"WebPage"'],
    ["</head>", '<meta name="robots" content="noindex"/></head>']
  ];
  for (const [original, changed] of cases) {
    assert.ok(html.includes(original), "raw negative fixture not applied: " + original);
    assert.throws(() => checkDocument(html.replace(original, changed), expectedMarkup), undefined,
      "raw negative fixture was accepted: " + original);
  }
  return cases.length;
}

try {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run about:check [-- --built | -- --base http://127.0.0.1:3100]");
  const source = readFileSync(pagePath, "utf8");
  const expectedMarkup = checkSource(source);
  const negativeCases = [
    ...edits.map((edit) => [sourceCopy(edit), edit.old]),
    ["We have not verified the original source", "We have verified the original source"],
    [acceptedKwCopy, "This page explains the project."],
    ['href="/gallery"', 'href="/missing-gallery"'],
    ['className="resource-page"', 'className="resource-page hidden"'],
    [canonical, "https://example.invalid/about-us"],
    [metadata.openGraph.description, "Unapproved Open Graph description."],
    ['"@type": "AboutPage"', '"@type": "WebPage"']
  ];
  for (const [original, changed] of negativeCases) {
    assert.ok(source.includes(original), "source negative fixture not applied: " + original);
    assert.throws(() => checkSource(source.replace(original, changed)), undefined,
      "source negative fixture was accepted: " + original);
  }
  console.log("ABOUT-001 source passed: seven exact approved regions, frozen remaining source/metadata/schema, 1 H1 / 5 H2 / 7 H3 / 16 paragraphs, KW-02 count 3, eight main links.");
  console.log("Fail-closed source negative fixtures: " + negativeCases.length + " rejected.");

  if (args[0] === "--built") {
    const html = readFileSync(resolve(projectRoot, ".next/server/app/about-us.html"), "utf8");
    checkDocument(html, expectedMarkup);
    const rejected = checkRawNegatives(html, expectedMarkup);
    console.log("ABOUT-001 built HTML passed: source/render parity, both descriptions, frozen title/canonical/OG/Twitter/schema, no noindex; " + rejected + " raw negative fixtures rejected.");
    console.log("Offline artifacts do not verify HTTP, browser interactions or deployment.");
  } else if (args.length) {
    const base = new URL(args[1]);
    assert.ok(["http:", "https:"].includes(base.protocol));
    assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "this pre-deployment check requires a local origin, not production");
    assert.ok(base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password, "--base must be a local origin");
    const url = new URL("/about-us", base);
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    assert.equal(response.status, 200, "About returned HTTP " + response.status);
    assert.match(response.headers.get("content-type") || "", /text\/html/i);
    assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /(?:noindex|none)/i);
    const html = await response.text();
    checkDocument(html, expectedMarkup);
    const rejected = checkRawNegatives(html, expectedMarkup);
    console.log("ABOUT-001 local production HTTP passed: " + url + "; HTTP 200, exact copy, metadata/schema/index and source/render parity; " + rejected + " raw negative fixtures rejected.");
  } else {
    console.log("Source checks do not verify raw HTTP, browser/mobile, actual licenses or production release.");
  }
} catch (error) {
  console.error("ABOUT-001 check failed: " + error.message);
  process.exitCode = 1;
}
