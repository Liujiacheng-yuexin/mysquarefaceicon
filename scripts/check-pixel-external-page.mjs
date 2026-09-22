#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { beforeImageMobileSource } from "./image-mobile-legacy-compat.mjs";
import { beforeGamesIndexNavigation, beforeGamesIndexSource } from "./games-index-compat.mjs";
import { beforeRelatedRemainingMarkup, beforeRelatedRemainingSource } from "./related-remaining-compat.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript"), React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sha = value => createHash("sha256").update(value).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const read = file => beforeImageMobileSource(file, readFileSync(resolve(root, file), "utf8").replace(/\r\n/g, "\n"));
const count = (value, needle) => value.split(needle).length - 1;
const pixelPath = "/pixel-art-avatar-icon-generator";
const pixelSource = "data/games/pixel-art-avatar.ts";
const pixelPage = "app/pixel-art-avatar-icon-generator/page.tsx";
const badge = '<span class="route-game-type">External tool</span>';
// v1.66 pre-implementation contracts plus the user's exact confirmed changes.
// The original source/SSR goldens are not refreshed. Empty React text separators
// are non-content; remove them symmetrically in the Pixel-only HTML comparison.
// Neither mutable evidence nor the current record is used as a golden oracle.
const recordEdits = [
  {
    "path": [
      "features",
      4,
      "text"
    ],
    "new": "The original site restricts iframe embedding. Open the generator directly on icongenerators.net.",
    "old": "The original site currently blocks iframe embedding, so the safest path is opening the generator directly."
  },
  {
    "path": [
      "faq",
      2,
      "question"
    ],
    "new": "Why does this page open the original site?",
    "old": "Why does the embedded generator not load?"
  },
  {
    "path": [
      "faq",
      2,
      "answer"
    ],
    "new": "This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net.",
    "old": "The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly."
  },
  {
    "path": [
      "faq",
      3,
      "answer"
    ],
    "new": "VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later.",
    "old": "Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external page. Try turning off the proxy for this page, switching networks, or opening the original page directly."
  },
  {
    "path": [
      "faq",
      5,
      "answer"
    ],
    "new": "The original site's mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode.",
    "old": "It may work, but detailed avatar controls are usually easier on desktop or in landscape mode."
  },
  {
    "path": [
      "seo",
      "schemaTypes"
    ],
    "new": [
      "WebPage",
      "FAQPage",
      "BreadcrumbList"
    ],
    "old": [
      "WebPage",
      "WebApplication",
      "FAQPage",
      "BreadcrumbList"
    ]
  }
];

const pageSourceEdits = [
  {
    "id": "resolver-import",
    "old": "import { createGamePlayerModel } from \"@/lib/games/game-player-model\";",
    "new": "import { resolvePixelExternalPage } from \"@/lib/games/pixel-external-page\";"
  },
  {
    "id": "serializer-import",
    "old": "import { buildGameMetadata, getGamePageH1 } from \"@/lib/seo/game-metadata\";",
    "new": "import { buildGameMetadata, getGamePageH1 } from \"@/lib/seo/game-metadata\";\nimport { serializeGameStructuredData } from \"@/lib/seo/game-structured-data\";"
  },
  {
    "id": "external-cta-icon",
    "old": "import { ExternalLink, Gamepad2, Monitor, Sparkles, Wrench } from \"lucide-react\";",
    "new": "import { ExternalLink, Monitor, Sparkles, Wrench } from \"lucide-react\";"
  },
  {
    "id": "record-binding",
    "old": "if (pixelArtAvatarGame.player.type !== \"EXTERNAL_LINK\") {\n  throw new Error(\"The Pixel Art Avatar legacy route must resolve to an external-link record.\");\n}\nconst pageUrl = pixelArtAvatarGame.route.canonical;\nconst originalUrl = pixelArtAvatarGame.player.url;\nconst pixelPlayerModel = createGamePlayerModel(pixelArtAvatarGame, {\n  ariaLabel: \"Pixel Art Avatar Icon Generator external tool\",\n  deviceNotice:\n    \"The original site's mobile behavior has not been independently verified. Detailed controls are usually easier on desktop or in landscape mode.\",\n  labels: { help: \"Report Issue\" }\n});\n\nconst howToSteps = [\n  {\n    title: \"Open the original generator\",\n    text: \"Use the original-page button to open the icongenerators.net pixel avatar maker in a new tab.\"\n  },\n  {\n    title: \"Choose pixel character parts\",\n    text: \"Use the generator controls to mix face details, hair, clothes, colors, and small accessories into a chibi pixel character.\"\n  },\n  {\n    title: \"Save or copy your result\",\n    text: \"Follow the controls inside the original generator. If a browser blocks a feature, try a desktop browser or another network.\"\n  }\n];\n\nconst features = [\n  {\n    title: \"External original tool\",\n    text: \"The generator is provided by icongenerators.net, with visible source credit and a direct link to the original page.\"\n  },\n  {\n    title: \"Pixel art avatar style\",\n    text: \"The tool focuses on small chibi character icons with a retro pixel-art look.\"\n  },\n  {\n    title: \"Works beside our face games\",\n    text: \"Use it as a pixel-avatar companion to Square Face Generator and Oval Face Icon Generator.\"\n  },\n  {\n    title: \"No local copy of assets\",\n    text: \"This page does not copy the external site files, artwork, comments, or generator source.\"\n  },\n  {\n    title: \"Original page access\",\n    text: \"The original site currently blocks iframe embedding, so the safest path is opening the generator directly.\"\n  },\n  {\n    title: \"Desktop recommended\",\n    text: \"Avatar generators with detailed controls are usually easier to use on desktop or landscape tablet screens.\"\n  }\n];\n\nconst tips = [\n  \"Use a desktop browser when editing detailed pixel parts\",\n  \"Open the original generator in a new tab for the most reliable experience\",\n  \"Try a simple color palette so the avatar stays readable at small sizes\",\n  \"Check the icon at profile-picture size before using it\",\n  \"Respect the original creator and link back when sharing the tool\"\n];\n\n",
    "new": "const pixelPage = resolvePixelExternalPage(pixelArtAvatarGame);\nconst pageUrl = pixelArtAvatarGame.route.canonical;\nconst { originalUrl, termsUrl, player: pixelPlayerModel } = pixelPage;\nconst { howToPlay: howToSteps, features, tips, faq } = pixelArtAvatarGame;\n\n"
  },
  {
    "id": "faq-binding",
    "old": "const faq = [\n  {\n    question: \"What is Pixel Art Avatar Icon Generator?\",\n    answer:\n      \"Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net.\"\n  },\n  {\n    question: \"Is this tool owned by My Square Face Icon?\",\n    answer:\n      \"No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net.\"\n  },\n  {\n    question: \"Why does the embedded generator not load?\",\n    answer:\n      \"The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly.\"\n  },\n  {\n    question: \"Can a VPN, proxy, or network filter stop the generator from opening?\",\n    answer:\n      \"Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly.\"\n  },\n  {\n    question: \"Does this page copy the generator assets?\",\n    answer:\n      \"No. This site does not host or copy the original generator files, artwork, comments, or source code.\"\n  },\n  {\n    question: \"Can I use it on mobile?\",\n    answer:\n      \"It may work, but detailed avatar controls are usually easier on desktop or in landscape mode.\"\n  }\n];\n\nexport const metadata = buildGameMetadata(pixelArtAvatarGame);",
    "new": "export const metadata = buildGameMetadata(pixelArtAvatarGame);"
  },
  {
    "id": "external-webpage-schema",
    "old": "    url: pageUrl,\n    mainEntity: {\n      \"@type\": \"WebApplication\",\n      name: \"Pixel Art Avatar Icon Generator\",\n      url: originalUrl,\n      applicationCategory: \"DesignApplication\",\n      operatingSystem: \"Web browser\",\n      provider: {\n        \"@type\": \"Organization\",\n        name: \"icongenerators.net\",\n        url: \"https://www.icongenerators.net/\"\n      }\n    }",
    "new": "    url: pageUrl"
  },
  {
    "id": "serialize-webPageSchema",
    "old": "JSON.stringify(webPageSchema)",
    "new": "serializeGameStructuredData(webPageSchema)"
  },
  {
    "id": "serialize-faqSchema",
    "old": "JSON.stringify(faqSchema)",
    "new": "serializeGameStructuredData(faqSchema)"
  },
  {
    "id": "serialize-breadcrumbSchema",
    "old": "JSON.stringify(breadcrumbSchema)",
    "new": "serializeGameStructuredData(breadcrumbSchema)"
  },
  {
    "id": "mobile-header",
    "old": "<SiteHeader />",
    "new": "<SiteHeader mobileStartLabel=\"Open\" mobileStartHref=\"#external-generator\" />"
  },
  {
    "id": "hero-eyebrow",
    "old": "<p className=\"eyebrow\">Embedded external avatar maker</p>",
    "new": "<p className=\"eyebrow\">External tool · {pixelArtAvatarGame.source.providerName}</p>"
  },
  {
    "id": "hero-actions",
    "old": "                <a className=\"hero-primary-link\" href={originalUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                  <Gamepad2 aria-hidden=\"true\" size={20} />\n                  Open Generator\n                </a>\n                <a className=\"hero-secondary-link\" href={originalUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                  Open Original\n                  <ExternalLink aria-hidden=\"true\" size={17} />\n                </a>",
    "new": "                <a className=\"hero-primary-link\" href={originalUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                  <ExternalLink aria-hidden=\"true\" size={20} />\n                  {pixelPlayerModel.player.ctaLabel}\n                </a>\n                <span>Opens icongenerators.net in a new tab.</span>"
  },
  {
    "id": "card-description",
    "old": "                  The original generator is hosted by icongenerators.net. Their current security headers prevent iframe\n                  embedding, so this page sends players to the working original tool.",
    "new": "                  This is an external tool from IconGenerators. Open the original page to use it; My Square Face Icon\n                  does not host or embed the generator."
  },
  {
    "id": "card-label",
    "old": "              <a className=\"tool-card-badge badge-link\" href={originalUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                Original Page\n                <ExternalLink aria-hidden=\"true\" size={14} />\n              </a>",
    "new": "              <span className=\"tool-card-badge\">External tool</span>"
  },
  {
    "id": "terms-note",
    "old": "                VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters can also stop\n                the external page from opening. Try turning off the proxy for this page, switching networks, or use{\" \"}\n                <a href={originalUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                  the original page\n                </a>{\" \"}\n                instead.",
    "new": "                The original site&apos;s{\" \"}\n                <a href={termsUrl} target=\"_blank\" rel=\"noopener noreferrer\">\n                  Terms of Use\n                </a>{\" \"}\n                govern the generator and its outputs. This page provides a direct link, not permission to embed, copy,\n                or use generated images commercially."
  },
  {
    "id": "how-to-heading",
    "old": "<h2>How to Use the Embedded Pixel Avatar Maker</h2>",
    "new": "<h2>How to Use the Pixel Avatar Maker on the Original Site</h2>"
  }
];

const markupEdits = [
  {
    "id": "mobile-header",
    "old": "<a class=\"mobile-start-link\" href=\"/#maker\">Start</a>",
    "new": "<a class=\"mobile-start-link\" href=\"#external-generator\">Open</a>"
  },
  {
    "id": "hero-eyebrow",
    "old": "<div class=\"game-title-block\"><p class=\"eyebrow\">Embedded external avatar maker</p>",
    "new": "<div class=\"game-title-block\"><p class=\"eyebrow\">External tool · IconGenerators</p>"
  },
  {
    "id": "hero-actions",
    "old": "<div class=\"hero-actions\" aria-label=\"Hero actions\"><a class=\"hero-primary-link\" href=\"https://www.icongenerators.net/pixelavatar.html\" target=\"_blank\" rel=\"noopener noreferrer\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-gamepad2\" aria-hidden=\"true\"><line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"></line><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"></line><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"></line><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"></line><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"></path></svg>Open Generator</a><a class=\"hero-secondary-link\" href=\"https://www.icongenerators.net/pixelavatar.html\" target=\"_blank\" rel=\"noopener noreferrer\">Open Original<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\" aria-hidden=\"true\"><path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path></svg></a></div>",
    "new": "<div class=\"hero-actions\" aria-label=\"Hero actions\"><a class=\"hero-primary-link\" href=\"https://www.icongenerators.net/pixelavatar.html\" target=\"_blank\" rel=\"noopener noreferrer\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\" aria-hidden=\"true\"><path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path></svg>Open Original Page</a><span>Opens icongenerators.net in a new tab.</span></div>"
  },
  {
    "id": "card-description",
    "old": "<p class=\"tool-card-description\">The original generator is hosted by icongenerators.net. Their current security headers prevent iframe embedding, so this page sends players to the working original tool.</p>",
    "new": "<p class=\"tool-card-description\">This is an external tool from IconGenerators. Open the original page to use it; My Square Face Icon does not host or embed the generator.</p>"
  },
  {
    "id": "card-label",
    "old": "<a class=\"tool-card-badge badge-link\" href=\"https://www.icongenerators.net/pixelavatar.html\" target=\"_blank\" rel=\"noopener noreferrer\">Original Page<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\" aria-hidden=\"true\"><path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path></svg></a>",
    "new": "<span class=\"tool-card-badge\">External tool</span>"
  },
  {
    "id": "terms-note",
    "old": "<div class=\"external-embed-note\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wrench\" aria-hidden=\"true\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path></svg><p>VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters can also stop the external page from opening. Try turning off the proxy for this page, switching networks, or use <a href=\"https://www.icongenerators.net/pixelavatar.html\" target=\"_blank\" rel=\"noopener noreferrer\">the original page</a> instead.</p></div>",
    "new": "<div class=\"external-embed-note\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wrench\" aria-hidden=\"true\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path></svg><p>The original site&#x27;s <a href=\"https://www.icongenerators.net/terms.html\" target=\"_blank\" rel=\"noopener noreferrer\">Terms of Use</a> govern the generator and its outputs. This page provides a direct link, not permission to embed, copy, or use generated images commercially.</p></div>"
  },
  {
    "id": "how-to-heading",
    "old": "<h2>How to Use the Embedded Pixel Avatar Maker</h2>",
    "new": "<h2>How to Use the Pixel Avatar Maker on the Original Site</h2>"
  },
  {
    "id": "features.4.text",
    "old": "<p>The original site currently blocks iframe embedding, so the safest path is opening the generator directly.</p>",
    "new": "<p>The original site restricts iframe embedding. Open the generator directly on icongenerators.net.</p>"
  },
  {
    "id": "faq.2.question",
    "old": "<summary>Why does the embedded generator not load?</summary>",
    "new": "<summary>Why does this page open the original site?</summary>"
  },
  {
    "id": "faq.2.answer",
    "old": "<p>The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly.</p>",
    "new": "<p>This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net.</p>"
  },
  {
    "id": "faq.3.answer",
    "old": "<p>Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly.</p>",
    "new": "<p>VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later.</p>"
  },
  {
    "id": "faq.5.answer",
    "old": "<p>It may work, but detailed avatar controls are usually easier on desktop or in landscape mode.</p>",
    "new": "<p>The original site&#x27;s mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode.</p>"
  },
  {
    "id": "schema-0",
    "old": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebPage\",\"name\":\"Pixel Art Avatar Icon Generator\",\"description\":\"Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.\",\"url\":\"https://mysquarefaceicon.com/pixel-art-avatar-icon-generator\",\"mainEntity\":{\"@type\":\"WebApplication\",\"name\":\"Pixel Art Avatar Icon Generator\",\"url\":\"https://www.icongenerators.net/pixelavatar.html\",\"applicationCategory\":\"DesignApplication\",\"operatingSystem\":\"Web browser\",\"provider\":{\"@type\":\"Organization\",\"name\":\"icongenerators.net\",\"url\":\"https://www.icongenerators.net/\"}}}</script>",
    "new": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"WebPage\",\"name\":\"Pixel Art Avatar Icon Generator\",\"description\":\"Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.\",\"url\":\"https://mysquarefaceicon.com/pixel-art-avatar-icon-generator\"}</script>"
  },
  {
    "id": "schema-1",
    "old": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"What is Pixel Art Avatar Icon Generator?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net.\"}},{\"@type\":\"Question\",\"name\":\"Is this tool owned by My Square Face Icon?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net.\"}},{\"@type\":\"Question\",\"name\":\"Why does the embedded generator not load?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly.\"}},{\"@type\":\"Question\",\"name\":\"Can a VPN, proxy, or network filter stop the generator from opening?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly.\"}},{\"@type\":\"Question\",\"name\":\"Does this page copy the generator assets?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"No. This site does not host or copy the original generator files, artwork, comments, or source code.\"}},{\"@type\":\"Question\",\"name\":\"Can I use it on mobile?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"It may work, but detailed avatar controls are usually easier on desktop or in landscape mode.\"}}]}</script>",
    "new": "<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"What is Pixel Art Avatar Icon Generator?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net.\"}},{\"@type\":\"Question\",\"name\":\"Is this tool owned by My Square Face Icon?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net.\"}},{\"@type\":\"Question\",\"name\":\"Why does this page open the original site?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net.\"}},{\"@type\":\"Question\",\"name\":\"Can a VPN, proxy, or network filter stop the generator from opening?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later.\"}},{\"@type\":\"Question\",\"name\":\"Does this page copy the generator assets?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"No. This site does not host or copy the original generator files, artwork, comments, or source code.\"}},{\"@type\":\"Question\",\"name\":\"Can I use it on mobile?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"The original site's mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode.\"}}]}</script>"
  }
];

const golden = {
  "recordHash": "fb355a3f3cde6451e9ca1098722207b2dacc1f36126a62c27b9f97496f7fece3",
  "metadataHash": "af9ec6ff28114bbae00bdb28fbe1efa1ffff28e1b832a8e36c7ac57358a3809a",
  "ssrHash": "3fdafc95c8e4d8381d53c2ee958ad7864264c7d754eb97481d0cb91cd4abe9ed",
  "builtMainHash": "6ae27a36a334a10801bff0d76ccb2d39321bc84f5330a0be1ed584b465fad554",
  "headerHash": "3fbd551f09e6bf83b5fdd5cd19dd0609d7c715e61c4b0accc5daca8af273620b",
  "footerHash": "ba4e842321fc95ad45850417c7f4ab6a0e820075c96faa49c340d268a8c0cefb",
  "head": {
    "title": "Pixel Art Avatar Icon Generator - Open the Original Chibi Icon Maker",
    "metas": [
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>",
      "<meta name=\"theme-color\" content=\"#20b8aa\"/>",
      "<meta name=\"description\" content=\"Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.\"/>",
      "<meta name=\"application-name\" content=\"My Square Face Icon\"/>",
      "<meta name=\"author\" content=\"My Square Face Icon\"/>",
      "<meta property=\"og:title\" content=\"Pixel Art Avatar Icon Generator - Open the Original Chibi Icon Maker\"/>",
      "<meta property=\"og:description\" content=\"Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.\"/>",
      "<meta property=\"og:url\" content=\"https://mysquarefaceicon.com/pixel-art-avatar-icon-generator\"/>",
      "<meta property=\"og:site_name\" content=\"My Square Face Icon\"/>",
      "<meta property=\"og:image\" content=\"https://mysquarefaceicon.com/og-image.svg\"/>",
      "<meta property=\"og:image:width\" content=\"1200\"/>",
      "<meta property=\"og:image:height\" content=\"630\"/>",
      "<meta property=\"og:image:alt\" content=\"Pixel Art Avatar Icon Generator external tool page\"/>",
      "<meta property=\"og:type\" content=\"website\"/>",
      "<meta name=\"twitter:card\" content=\"summary_large_image\"/>",
      "<meta name=\"twitter:title\" content=\"Pixel Art Avatar Icon Generator - Open the Original Chibi Icon Maker\"/>",
      "<meta name=\"twitter:description\" content=\"Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.\"/>",
      "<meta name=\"twitter:image\" content=\"https://mysquarefaceicon.com/og-image.svg\"/>"
    ],
    "links": [
      "<link rel=\"canonical\" href=\"https://mysquarefaceicon.com/pixel-art-avatar-icon-generator\"/>"
    ]
  },
  "oldSchemas": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Pixel Art Avatar Icon Generator",
      "description": "Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.",
      "url": "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator",
      "mainEntity": {
        "@type": "WebApplication",
        "name": "Pixel Art Avatar Icon Generator",
        "url": "https://www.icongenerators.net/pixelavatar.html",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web browser",
        "provider": {
          "@type": "Organization",
          "name": "icongenerators.net",
          "url": "https://www.icongenerators.net/"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Pixel Art Avatar Icon Generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net."
          }
        },
        {
          "@type": "Question",
          "name": "Is this tool owned by My Square Face Icon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the embedded generator not load?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly."
          }
        },
        {
          "@type": "Question",
          "name": "Can a VPN, proxy, or network filter stop the generator from opening?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly."
          }
        },
        {
          "@type": "Question",
          "name": "Does this page copy the generator assets?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This site does not host or copy the original generator files, artwork, comments, or source code."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use it on mobile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It may work, but detailed avatar controls are usually easier on desktop or in landscape mode."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Square Face Generator",
          "item": "https://mysquarefaceicon.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pixel Art Avatar Icon Generator",
          "item": "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator"
        }
      ]
    }
  ],
  "expectedSchemas": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Pixel Art Avatar Icon Generator",
      "description": "Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.",
      "url": "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Pixel Art Avatar Icon Generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net."
          }
        },
        {
          "@type": "Question",
          "name": "Is this tool owned by My Square Face Icon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net."
          }
        },
        {
          "@type": "Question",
          "name": "Why does this page open the original site?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net."
          }
        },
        {
          "@type": "Question",
          "name": "Can a VPN, proxy, or network filter stop the generator from opening?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later."
          }
        },
        {
          "@type": "Question",
          "name": "Does this page copy the generator assets?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This site does not host or copy the original generator files, artwork, comments, or source code."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use it on mobile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The original site's mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Square Face Generator",
          "item": "https://mysquarefaceicon.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pixel Art Avatar Icon Generator",
          "item": "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator"
        }
      ]
    }
  ],
  "playerModel": {
    "id": "pixel-art-avatar",
    "name": "Pixel Art Avatar Icon Generator",
    "ariaLabel": "Pixel Art Avatar Icon Generator external tool",
    "cover": {
      "src": "/game-face-samples/gamer.webp",
      "width": 512,
      "height": 512
    },
    "frame": {
      "aspectRatio": "16 / 9",
      "maxWidth": "980px",
      "backgroundColor": "#111827"
    },
    "labels": {
      "start": "Play",
      "reload": "Reload",
      "help": "Report Issue",
      "cover": "Start Pixel Art Avatar Icon Generator",
      "loading": "Loading Pixel Art Avatar Icon Generator...",
      "error": "Pixel Art Avatar Icon Generator could not be loaded. Please retry or use a desktop browser.",
      "slowLoadingHint": "Still loading? This game may take a few seconds to start."
    },
    "source": {
      "providerName": "IconGenerators",
      "originalUrl": "https://www.icongenerators.net/pixelavatar.html",
      "attribution": "Original generator by Eichi Zerona / えいちぜろな (@h071019) on icongenerators.net."
    },
    "policy": {
      "releaseDecision": "DIRECT_LINK_ONLY",
      "allowedDeliveryTypes": [
        "EXTERNAL_LINK"
      ]
    },
    "deviceNotice": "The original site's mobile behavior has not been independently verified. Detailed controls are usually easier on desktop or in landscape mode.",
    "reportHref": "/contact",
    "showStartControl": true,
    "type": "EXTERNAL_LINK",
    "player": {
      "url": "https://www.icongenerators.net/pixelavatar.html",
      "ctaLabel": "Open Original Page",
      "target": "_blank",
      "rel": [
        "noopener",
        "noreferrer"
      ],
      "directLinkOnly": true
    }
  }
};

const sourceHashes = {
  "data/games/pixel-art-avatar.ts": "118d1b40325cb26d8ff19141f5af2ff1b451a3b89de0e6131836a37a0510fabb",
  "app/pixel-art-avatar-icon-generator/page.tsx": "514139869fbd206326dc6d2e426d86c2b49f27c557b86868471de200fe94c50d"
};

const frozenSources = {
  "app/about-us/page.tsx": "bd812baed9b69e531d369be6e0be168dc5232d3729def0d7f5a747fbccbf1779",
  "app/admin/comments/page.tsx": "5da66215f6c126892b132af3f11937d2fba81dc9d3b86b680b207b0cd6680f99",
  "app/api/admin/comment-images/[...key]/route.ts": "818b0b4c81cd56f9455a3228adc95137268a90db6b82f1a2e1f6f8ec232f03a0",
  "app/api/admin/comments/route.ts": "63ddcb14964f633f199af6873497abb9091420dba4e889396ca7d2d775578bb2",
  "app/api/admin/comments/[id]/route.ts": "e471d00f054151ac6636c81fd9d21ce108b19c86875ee524f2e0b44f429c135b",
  "app/api/comment-images/[...key]/route.ts": "defb2f8ec7f4be7c19beb82663f781ae2e735cf19db127d603f5c82d8925d98a",
  "app/api/comments/route.ts": "4297d56bf81fb7182236ef0c880cd1039907dc345415e1bacddc39ae01ab2e7f",
  "app/api/comments/[id]/like/route.ts": "edf2b13178884db9af47debed1186655b55a96abe807e1dde8f4367381089a14",
  "app/blog/avatar-maker-without-signup/page.tsx": "27b767b9898a1cf54a8bd8d15949690a99c3bcf8fee0a510275d2c05880dce97",
  "app/blog/best-discord-avatar-style/page.tsx": "2e0807728e27e7b62e0be6aee9319079626b6d8f259fbf452afb3193f6040b9d",
  "app/blog/cute-profile-picture-ideas/page.tsx": "23d0d94e184f86457eec7bccce657e83a401d94fef36686008af683fbf9ed126",
  "app/blog/discord-avatar-size-guide/page.tsx": "3990a509c0f009f3007edf767e28983943e35ec03a9422483d7427972e3a7a24",
  "app/blog/how-to-make-a-cute-discord-profile-icon/page.tsx": "126709f27ed82ffa275ec56f8c19d3ef97bd972f3a6d7737eca02eb016fe4a38",
  "app/blog/page.tsx": "ae764e709b2e95b94978264e94f7c8339e18fbb40619e2b61003e73979b777e9",
  "app/blog/square-avatar-vs-round-avatar/page.tsx": "21831b3d94e787b7442827822de117fd9cb6854408e25ea55443bc5cafb3c82b",
  "app/blog/tiktok-profile-icon-ideas/page.tsx": "c480c6c80cc10800e1ff12710861712d4bde2aefe7145e7666d8352e0f2c29ad",
  "app/category/[slug]/page.tsx": "db5f8c1c1c4df37b7f8a0a726e540d1a0897fa14d84efd8a2f50a8b79aaba0e1",
  "app/contact/page.tsx": "43c774c71e326750845afe0168f4d66bbb1ee47367bcfc6015bb17592860c98e",
  "app/cute-square-avatar-generator/page.tsx": "fe22cddd887475ecc89983278ceeabc06678a344c8ea7aefb47a65eb7a893042",
  "app/editorial-policy/page.tsx": "c758e70ce143b58db1453877efcb6d82a9e89fd96d1bc473c73c6dcf4c81a529",
  "app/free-avatar-maker/page.tsx": "65b5cd3745e7aad2dd9bdb11a851fb8a7fa74fe6e7a2e3221474688c76b75aa5",
  "app/gallery/page.tsx": "d051f12b8e4c71a9b15a75efb59c3ffbb1f9904ec5d69577f9640ff47d479901",
  "app/games/page.tsx": "325b8221aec0d9ea69a2374faad321a0fa75dd7e8c0df05c59da4db93e46c44f",
  "app/games/[slug]/page.tsx": "0131595a7dc55e0b9227944e41f5cf54548213f5527cc62f034eb8a61c05aab4",
  "app/globals.css": "5b5e8d7253be79edbd479a01a53bf3f760d52482ced5f4c6edcd387975669867",
  "app/layout.tsx": "c9d72791c1167896c2ab3a72bb9e7eada5b909bbf8f540a6e64fb52bed4e77b5",
  "app/manifest.ts": "035fb0b64fd59984750a16cca5b4e7bd4e776d8ee7c9a608e339cabef2a8a179",
  "app/not-found.tsx": "1ae05e6e788c22dba45d7cbdce2a4b9271d584246a553bda51428c396991a351",
  "app/oval-face-icon-generator/page.tsx": "7047682caac9809799f475caece2ce110d82e769bee389ceedaba966167701cf",
  "app/page.tsx": "d10f79e2522ca3c3e21195e09df0f090b119af6452c265e48eb125639b2c46c1",
  "app/pixel-square-face-maker/page.tsx": "b691a2359a6a6581eadc75fb1944a93a1718f85c4fff11ba6ebdfbad756603e5",
  "app/privacy-policy/page.tsx": "eba51fcadf3aa4e61506242d5d5fb1d9d4ac7d870626e7877670ae0984c7d1c4",
  "app/robots.ts": "dd47d2bd1355fb44791c0f5e481b06c98142639383a902cd6e976cb4f7583aa8",
  "app/sitemap.ts": "183aafaeb14f529f8c341c70aa9c3278082f670aeaa4f487271d6ff110e0db18",
  "app/square-avatar-generator/page.tsx": "a239bb17efb6eddce7e49f3214cef92017eed9f167c0879103855d91b4554a31",
  "app/square-face-icon-generator/page.tsx": "24e88b1057bfea65f350bb84205cc5fc89fec0cd06e4f6dea24719c7513ff731",
  "app/terms-of-service/page.tsx": "8121043e9a474a19a5c1c366ed80e03db93ec6bc8dc1ed9eda63ef60d85c83f5",
  "app/[locale]/page.tsx": "e47894775647c4a8630490b2e7ab0a72cc4fdcc2d0f253ce2ce724676adf7ece",
  "components/AdminComments.tsx": "a3a1dd2d1bc175a4862a49299b363fe50c9b006945fc6b20df97dc08d527af4d",
  "components/AvatarGenerator.tsx": "61e65dd817d517975ba89ca2ba7e7b182cf015bc296e4a993aa4733342fda74b",
  "components/CloudflareAnalytics.tsx": "54e33cdc6f229a708c86013649a283ed946be150f717b11eebc6ccdb793368c4",
  "components/CommentSection.tsx": "02db74c38bf07f57c92defb239866cd75bfeef561333de1db9acfc9d44ddfd21",
  "components/CuratedGalleryPreview.tsx": "0238422e69aa37737063f1600e11a82505b0b8f94bd813161eb8ea6985e78792",
  "components/DeferredThirdPartyScripts.tsx": "09ae2617d036e47be5874e366d0ced2fc1634d03b59ac9c2505f1938c7cfe7e2",
  "components/FlashGenerator.tsx": "c443323031b15428a502ff4fcad3653ffc424ef75db9335b76883576f45ac794",
  "components/game/AdSlotShell.tsx": "3c1aaa1ab799dddb7e7e0bb607a31c0cc9d77683c42554b7663bc4bdc4a28a27",
  "components/game/CategoryChip.tsx": "78e2ddcf2ce6b77899d3ab35f06f5d49a87f82f1015d8f4deb862dfe76ab0850",
  "components/game/EmptyState.tsx": "2ef1bad5737139a2cd9c1cf9d003b28a9f202a50fa9925072cea8e35cef549d2",
  "components/game/GameBreadcrumb.tsx": "933a23729f0c280559d64ac1376022520c3d700031a489935d1e1b30b604b474",
  "components/game/GameCard.tsx": "94af78fdd701884f8e69d2d3cdf919d2a0b730c685b6e5287130d85ef9b92edf",
  "components/game/GameControls.tsx": "2a738d34297ad718e59a678ea9572d8c6cc981180e083e8fca7cb03e21c1b4da",
  "components/game/GameDetailTemplate.tsx": "c643d800efd8bdbc6d439047b53c3aad6fae403ad59ed55b7c8349218c1ca43c",
  "components/game/GameFaq.tsx": "c680b9728a08c896095bb85fc688f6d451360142e0bb447763b8fed0a0a1139a",
  "components/game/GameGrid.tsx": "261672ac47c7cafeb3f2576caf6ba6240fa3c9b15472f55778b8ae3f45d631b5",
  "components/game/GameMeta.tsx": "d7c6e283401f295579cff65cd01ee761626d727098fbc6e983e8d18e47f807e9",
  "components/game/GamePlayer.tsx": "a568634e413cacc1ef816bd2835be4916dfc6094f9cc4d3a2ee3a3fd5d51b2da",
  "components/game/GameSourceRights.tsx": "ebc2ec19b91bf5dde44eae24ca75b6ee208a487c707a9862f694c6d88dbd2243",
  "components/game/README.md": "4c7ea3c7e616a686fbf08567f8b9e28082912a2dbcbfc7a73d3166867c172f89",
  "components/game/RelatedGames.tsx": "1fa094f28bd8b0855c7869596b9df55b0072a48a8db6d3db8c6558f954209aa7",
  "components/game-player/adapters/adapter-types.ts": "4e6c492777363116b8a450d5b7e822abdf99609e518f15a3fc682f2d6fd84df5",
  "components/game-player/adapters/ExternalLinkAdapter.tsx": "f7d4c98916a2a25785175af7ae6bf009a700f68271b8345322fd904c2431f45c",
  "components/game-player/adapters/Html5Adapter.tsx": "524f0c49fd8af608ddf86aed872fe1cd0af72839b30391206be8eae639e08325",
  "components/game-player/adapters/IframeAdapterFrame.tsx": "af31a35c493f607bacbfb548b386f604cbb98c7722a32cf580da11a7b7b593b6",
  "components/game-player/adapters/LocalIframeAdapter.tsx": "b73408e66cb4dec9fe5b8460960627c95a1a92c43282345562dbfd173b3f4d9f",
  "components/game-player/adapters/OfficialIframeAdapter.tsx": "0668f81f43684d59522799c55ecc4affe8fb24fdfc571af7e6ac8e56118cc23c",
  "components/game-player/adapters/RuffleAdapter.tsx": "5fcff6669f4ca75147728e8a73434cdef8abb2823325110d585ad46a1cfe8ada",
  "components/game-player/GamePlayer.tsx": "142cf22ac3a485c78285d920bbe84114f3931a38f0e9aec067bbf8ca2e562d5c",
  "components/home/CoreGamePreview.tsx": "9a05388d53d969ef1ea1f4ea9a6273a0ebd1cd8ec6d1df43a1afd8da1c4c44a1",
  "components/home/HomeDiscoveryRegion.tsx": "8652a91eeeb4650230235422c661be58841a49475ce1bc446425c7e2ac697b04",
  "components/home/HomeHero.tsx": "d7c0c2c35b98735c002d4a9066b68615e73df77326cc42468eaee6607b442fd3",
  "components/home/HomeResourceLinks.tsx": "fd03f53ecc08510a86e3edd54864e132af9e70b363a7d5dee4c50d1eea207e23",
  "components/HomePage.tsx": "fd9f94372bd2cbc98ddcf88b4364183d860ad24dd5dbb5551790fca63e8a8c9c",
  "components/InstallPrompt.tsx": "fb4a9fd5a43625673f03b26b8d31284c955b4e970d9fbe80be41863228c02ac8",
  "components/ShareButtons.tsx": "5becc8e6cf2a779dd192222de56087f468b41243f60950d0290f45ff07a71a28",
  "components/SiteFooter.tsx": "0a8f7e7ca185853a8494ba94f8ecaa65e9ddd73ba3e43781c0efacfcdd3c2291",
  "components/SiteHeader.tsx": "8182d2e2a5012cfbb62ebadcc8cb581d088364d263f9eb11f9d217686df115a1",
  "lib/comment-store.ts": "734fa24cbf3cf6518f5026c93953628dca8c28935db6927d53650d4019865804",
  "lib/games/catalog.ts": "6cc0df85e3acf146b3cc18b63cc4785982607fc0e59142ce89f59d2d6ef0ac0d",
  "lib/games/game-player-model.ts": "42672e8d0917e9d7d6a1b28137e505ecd4d7b09ba40e3c971751b6d7f3fbe84c",
  "lib/games/game-schema.ts": "b3d036c8973bc9562b99b55058e042d9040605f6e04f008dc54378eb005e8df6",
  "lib/games/home-discovery.ts": "b172dd4a9e807754f59dfe5f9bb5b42fdc2d360bd89c54eab504f5577dac166e",
  "lib/games/routes.ts": "058434c725a09ae921c2c5f184396377873ad67603130f985fcfe39bcd97c5a6",
  "lib/locales.ts": "a96fefe1140236963e49b59ed632641794f1b39b5f5c3bd5df79adac876df8db",
  "lib/metadata.ts": "ed02bc92dbfe7e71c0988bef9cf8bbdabc34caef5a1a2ba67d40cf69d839a275",
  "lib/seo/canonical-origin.ts": "2d506dc08f622a898efd6eb57c9210018d2b8ba73ec8666a3bd4c9685e831fd9",
  "lib/seo/game-metadata.ts": "87e7f42b085e2714cd22bce3634ccf1272fa822fb70b77292c5831d0f38fe660",
  "lib/seo/game-structured-data.ts": "84193180e9b8827a2566d38585ce753b94ee30f4c9b5f6aee4fe22da3c875391",
  "data/ai-crawler-policy.json": "adea8bf57c056c93b319da9033654f573989948058ab04a7c74e4739c472487c",
  "data/curated-icon-ideas.ts": "b51d0f7b57249b1e3cfe0e16bede29688154814168a2c6271a7388ad10933dce",
  "data/game-categories.ts": "b0bbb1eccbc70bdc70323c05da94acc725df06d857c70eaba8860f5b3e701d8d",
  "data/game-license-registry.json": "fb0b94f56ffa3c7feca89ee136c73795a95d993de0ebe16d81ca8041da4a8924",
  "data/games/oval-face.ts": "03d3c9d884161baafd9f5baadf85bbb05567324cc8e7251f094ca0bbe4b872fe",
  "data/games/README.md": "71272ce378d8adc438b34b6d60e58080fa32b8728fd9c513e6aad2001eac24ee",
  "data/games/square-face.ts": "5f70eb18ae8e87db1db4d2603c080e5a4b01d44ae2b57f7abcf9afbf26550d0e",
  "scripts/check-ai-crawler-policy.mjs": "76e030b11a653a01ed101e13c06460f29354f55d33c1e96aab4ace3f53be5042",
  "scripts/check-terms-rights.mjs": "62ab3d26bb2459fe9abe92a1c520e740cba77f01cec5324a7d19ddadfe6dba50",
  "scripts/cloudflare-login.cmd": "9285c7cf0105fa6087da2dbb9264265a5daed85475ea61a12b0310431e3c8b0f",
  "scripts/cloudflare-provision.cmd": "72b6efc1ad0cab89dc54d6d18cb6a6c3f2c1bbc7fa42444b9be968cc1cd22aeb",
  "scripts/cloudflare-set-secrets.cmd": "5964a356784cc9ea3beeb76b801fc04ae79762ff1c47ab1fecb9f5a0d35a8cd0",
  "scripts/patch-opennext-worker.mjs": "1f761820c8ec949e7a32f1435b82f14f9919d46bf965090741ab55add8b4068b",
  "scripts/post-deploy-check.mjs": "51b28a8e14558dfc69c71779ebe9ed28d195f2f671d5eda07977afe885bbee82",
  "scripts/robots-policy.mjs": "0d3f85f8568a4b17a53c2eaa82fd06460a14262160ba53131f29978c5f4416ed",
  "scripts/run-canonical-host-check.mjs": "99c282d9246c3a3c060c9b697d0c4a769e6b7622a63b97ab99899d41bc2edc4b",
  "scripts/run-game-component-check.mjs": "bf05d0f3119b094bc4674846c71bbc69482541921ba199ec693dce021ba86e62",
  "scripts/run-game-data-check.mjs": "985321918bfc7abdbea07a675b710d40fe8ddbbfa6d128e24e67cd90309f536b",
  "scripts/run-game-metadata-check.mjs": "a6a16a08338143f1ada4f8f446e89f2e08208c0896cf884a5d494c894931ccf8",
  "scripts/run-game-player-check.mjs": "59f17f0f2dacc0b596f572a9a1871e58f78623a267257e3f33e7f1eac7bd9f09",
  "scripts/run-game-route-check.mjs": "be951b8407d08aadf9e1b2b29dda30fe33ffb133af6cd8ee6e8c7897a95eac44",
  "scripts/run-game-template-check.mjs": "c7121e18a868db05d702639ff8448cbaad958c20117e91b71fb0ed71d98ced8d",
  "scripts/run-home-discovery-check.mjs": "70cb3221dedd42081b24c201902a3dce2ff46c31e54b8ee478384da4545b4196",
  "scripts/run-home-gallery-check.mjs": "e0bf58437b6de392dd98af862c97be25107432cec1a24df9a8d9d028b7ab738d",
  "scripts/run-home-hero-check.mjs": "40ad21661b97f27e306c2eaa8d130637ecbd9a31d5c72c8ef25c214fb3a276e0",
  "scripts/run-home-information-architecture-check.mjs": "6fc9c018915cb8cbdf68f23fde16239be0cb246bd6f92eab7000b243a98d9f66",
  "scripts/run-home-performance-check.mjs": "58c55d5a6be4d07961c9163167fb2b1394c2807d4a31b8522da4e79ff7d9d308",
  "scripts/seo-check.mjs": "a56453c56c8f55f4a308790e38a34aed19b667d1ba3514bd09eb18709db2ca9f",
  "scripts/start-local-preview.cmd": "edd040a98ac02704de22f632fb21f981976c70b88932461874e4631db1dbcfb1",
  "scripts/submit-indexnow.mjs": "1394eb5cfa2bb600af3bd3fbdf0f8c2eae9adf78b31d18d6f4cd57f3be0f4ae9",
  "scripts/validate-canonical-host.ts": "1c7d329c5a0d5ac1b06432381f0933cfe70e0f17f8b4081f5e9695d23a6d32aa",
  "scripts/validate-game-components.tsx": "3ba59b4e768241a57ec53da796c5cca2c35c6b69c95259f827166c0780a7b74d",
  "scripts/validate-game-data.ts": "7e6f204d5397830accd8e33534939146bcbdd934b3ec49d8653c113b412d73bd",
  "scripts/validate-game-metadata.ts": "72c8aa3f30b341d9eec53d55551ddd422c9271aca9b52d203469a8910b11b403",
  "scripts/validate-game-player.tsx": "370b6809735b2b1ccbd99003fea04ea0f06a9761950333d765a661b3157797eb",
  "scripts/validate-game-routes.ts": "bca62350b59f545437c2e5a8e834275dce7c5df330bb58d268befd12ab00803f",
  "scripts/validate-game-template.tsx": "5427f7fbd835530eaa34ef7fc514692b203f8f312e71624ed51df3dc14af6406",
  "scripts/validate-home-discovery.tsx": "f0236c66dc6e603595d39ba675293c5aba44add9a50cd71b7a2f7e461065d894",
  "scripts/validate-home-gallery.tsx": "9d551c13b6df1c9173c32a805b07abe6ba85bef830057db78bc4653d56aac19b",
  "scripts/validate-home-hero.tsx": "6d2f6dc8332a7ea2fed9776ae3e453857c6ee2f4adfd2528ce6663fab73c9e3c",
  "scripts/validate-home-information-architecture.tsx": "e3c0001100d69301d7007ba8fc3840779530fbdadae93bd784d48978138cfbc4",
  "scripts/validate-home-performance.tsx": "8aefc3b9227758e6f2b651f539b8385bb5275376b6d939f6c0e76f618a48d90d",
  "public/games/oval-face-cover.png": "0e914b27b602683442d57dfa232c88be1fdea5a2ed45bdabe0da72e3ff464073",
  "public/games/oval-face-icon.png": "a3cdaeff0397647bd1580980c60e2996e5aa499eab8e5f2e634557b1c5da0909",
  "public/games/oval-face.swf": "80e974d8ef4ad5e849e93464eaea1833620c269bac30601d960f5438c285e09b",
  "public/games/README.md": "e5ae6e267570980805a1f298d9a6f0b5cf842f934035ae8e6d2355e5b8a3cf0c",
  "public/games/square-face-cover.png": "15a5c93f79859441eef3032ce45e07abc2e91a7520a9aaef42158dd4fe00a535",
  "public/games/square-face.swf": "b1d074c95f15b7dcecdbc2405abf820ead985669bb12cd47247fc8ea7537bc1e",
  "package-lock.json": "bf7b778ff42d02d40a11190d56d969cb03ac183a0cf70dbd85c199dc79778c97",
  "next.config.mjs": "10f3416af7a0a92f59c4d283113624e9c286f645c6155e91c5a381d512feb9ee",
  "middleware.ts": "4ce3b9cd325b843f1f80bca6545c114ac84f3336434a719cbfd47577c7ab53d6",
  "tsconfig.json": "a749da922f5e6f1d93a68270185c1ed56e3e45c786d1de1ee59f9bdb7512d720",
  "scripts/check-about-rights.mjs": "5d1591d13e293168dda865890daecbd33048bfca16b569a4059a262afae94868",
  "scripts/check-editorial-rights.mjs": "1ec7268b707490f6b55d297b5bfb7a1b36f944da45ddcc8d6f561a52518a503b",
  "scripts/check-gallery-rights.mjs": "bd2ed64fb002334e4e3d72527ec28e87414877bd8777535b97ca102b4953996f",
  "lib/games/square-homepage.ts": "ce7d111d8a4df65194394ed31468a43fac96c83da1f53c8761090f159efe3aa4",
  "lib/games/oval-legacy-page.ts": "29a465e18d5a0520e1e4db970f7fa5b7b23b6022f317f890d31c8ba22efa4f79"
};

function getAt(record, path) { return path.reduce((value, key) => value[key], record); }
function setAt(record, path, value) {
  let cursor = record;
  for (const key of path.slice(0, -1)) cursor = cursor[key];
  cursor[path.at(-1)] = value;
}
function reverseExact(source, edits) {
  for (const edit of [...edits].reverse()) {
    assert.equal(count(source, edit.new), 1, edit.id + " must match the exact approved change");
    source = source.replace(edit.new, edit.old);
  }
  return source;
}
function sourceLiteral(value) {
  return Array.isArray(value) ? "[" + value.map(item => JSON.stringify(item)).join(", ") + "]" : JSON.stringify(value);
}

export function originalPixelSource(file, source) {
  assert.ok(file in sourceHashes, "Only the two approved Pixel sources may be normalized");
  source = beforeRelatedRemainingSource(file, source);
  const edits = file === pixelSource
    ? recordEdits.map(edit => ({ id: edit.path.join("."), old: sourceLiteral(edit.old), new: sourceLiteral(edit.new) }))
    : pageSourceEdits;
  const original = reverseExact(source.replace(/\r\n/g, "\n"), edits);
  assert.equal(sha(original), sourceHashes[file], file + " changed outside the exact confirmed Pixel scope");
  return original;
}

export function originalPixelDiscoveryRecord(record) {
  const original = plain(record);
  assert.equal(original.id, "pixel-art-avatar");
  for (const edit of recordEdits) {
    assert.deepEqual(getAt(original, edit.path), edit.new, edit.path.join(".") + " must match the confirmed Pixel value");
    setAt(original, edit.path, plain(edit.old));
  }
  assert.equal(sha(JSON.stringify(original)), golden.recordHash, "Pixel normalization cannot hide extra data, rights, URL, or copy changes");
  return original;
}

// Strip only the exact badge AND type attribute on the one legacy Pixel card.
// Other card content/links stay intact and are checked by the original goldens.
export function originalPixelSidebarMarkup(html, expectedCount) {
  assert.ok(expectedCount === 0 || expectedCount === 1);
  const cards = [...html.matchAll(/<a class="side-game-card"[^>]*>[\s\S]*?<\/a>/g)];
  let found = 0;
  for (const match of cards) {
    const card = match[0], opening = card.slice(0, card.indexOf(">") + 1);
    const href = opening.match(/\bhref="([^"]*)"/)?.[1];
    if (href !== pixelPath) {
      assert.doesNotMatch(card, /data-game-page-type=|class="route-game-type"/, "A guide, game, or unknown href must not be marked External");
      continue;
    }
    found++;
    assert.equal(count(card, 'data-game-page-type="EXTERNAL_TOOL"'), 1, "Pixel card needs exactly one External type");
    assert.equal(count(card, badge), 1, "Pixel card needs one exact visible External tool badge");
    assert.ok(card.includes("</strong>" + badge + "<small>"), "The badge belongs between the existing title and description");
    const restored = card.replace(' data-game-page-type="EXTERNAL_TOOL"', "").replace(badge, "");
    assert.doesNotMatch(restored, /data-game-page-type=|class="route-game-type"/);
    html = html.replace(card, restored);
  }
  assert.equal(found, expectedCount, "Unexpected/missing legacy Pixel sidebar entry");
  return html;
}
const normalizeTextSeparators = html => html.replace(/<!-- -->/g, "");
function originalPixelMarkup(html) {
  return reverseExact(
    normalizeTextSeparators(beforeGamesIndexNavigation(beforeRelatedRemainingMarkup(html))),
    markupEdits
  );
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
function checkVisibleBoundary(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, "Pixel requires visible server-rendered main content");
  const links = [...main.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(match => ({
    attrs: Object.fromEntries([...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map(item => [item[1], item[2]])),
    text: match[2].replace(/<[^>]*>/g, "").trim()
  }));
  const external = links.filter(link => link.attrs.href?.startsWith("https://"));
  assert.equal(external.length, 3, "Only two original-page CTAs and one Terms link");
  assert.deepEqual(external.map(link => [link.attrs.href, link.text]), [
    [golden.playerModel.player.url, "Open Original Page"],
    [golden.playerModel.player.url, "Open Original Page"],
    ["https://www.icongenerators.net/terms.html", "Terms of Use"]
  ]);
  for (const link of external) {
    assert.equal(link.attrs.target, "_blank");
    assert.equal(link.attrs.rel, "noopener noreferrer");
  }
  assert.equal(count(main, 'data-player-type="EXTERNAL_LINK"'), 1);
  assert.equal(count(main, 'data-player-adapter="EXTERNAL_LINK"'), 1);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((main.match(/<h2\b/g) ?? []).length, 10);
  assert.equal((main.match(/class="faq-item"/g) ?? []).length, 6);
  assert.doesNotMatch(main, /<iframe\b|<ruffle-|embedded external avatar maker|embedded generator not load|external embedded page|Use the Embedded|>Open Generator<|>Original Page<|>Play<|>Reload<|>Fullscreen</i);
  assert.doesNotMatch(html, /(?:src|href)="[^"]*(?:\/ruffle\/|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$))/i);
  assert.doesNotMatch(main, /<(?:img|script|iframe)\b[^>]*src="https:\/\/[^"]*icongenerators\.net/i);
  assert.deepEqual(schemas(html), golden.expectedSchemas, "Only WebPage removal and the approved visible FAQ alignment may change schema");
  assert.equal(sha(originalPixelSidebarMarkup(main, 0)), sha(main), "Pixel's own sidebar has no Pixel card and must remain unchanged");
}
function checkPixelDocument(html) {
  checkVisibleBoundary(html);
  assert.deepEqual(headContract(html), golden.head, "Title, all description/OG/Twitter/canonical/index metadata are frozen");
  const original = originalPixelMarkup(html);
  const main = original.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.equal(sha(main), golden.builtMainHash, "Only approved Pixel markup may change");
  assert.equal(sha(original.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? ""), golden.headerHash);
  assert.equal(sha(original.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? ""), golden.footerHash);
  assert.deepEqual(schemas(original), golden.oldSchemas, "Other original schema fields must remain frozen");
  assert.doesNotMatch(html, /registryRecordId|licenseEvidenceUrl|semanticCoverage|timestampStatus|writtenPermissionPath/, "The entire Record/Registry must not be serialized into the client payload");
}

const compiledCache = new Map();
function modules(options = {}) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    if (file === "data/games/pixel-art-avatar.ts" && options.record) {
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
    if (file === "data/game-license-registry.json" && options.registry) {
      mod.exports = options.registry;
      return mod.exports;
    }
    if (file === "lib/games/catalog.ts" && options.records) {
      mod.exports = { gameCatalog: options.records };
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

function rejectNormalizationNegatives(record) {
  let rejected = 0;
  for (const edit of recordEdits) {
    const candidate = plain(record);
    setAt(candidate, edit.path, edit.old);
    assert.throws(() => originalPixelDiscoveryRecord(candidate), undefined, "Missing approved Pixel data change must fail");
    rejected++;
  }
  for (const [path, value] of [
    [["source", "originalUrl"], "https://example.invalid/tool"],
    [["player", "url"], "https://example.invalid/tool"],
    [["license", "allowedDeliveryTypes"], ["EXTERNAL_LINK", "OFFICIAL_IFRAME"]],
    [["license", "status"], "VERIFIED"],
    [["features", 0, "text"], "Unapproved extra copy"],
    [["seo", "title"], "Unapproved title"],
    [["relatedGameIds"], []]
  ]) {
    const candidate = plain(record); setAt(candidate, path, value);
    assert.throws(() => originalPixelDiscoveryRecord(candidate), undefined, "Normalization hid " + path.join("."));
    rejected++;
  }
  for (const file of [pixelPage, pixelSource]) {
    const source = read(file);
    assert.throws(() => originalPixelSource(file, source + "\n// unapproved source drift\n"));
    rejected++;
  }
  const source = read(pixelSource);
  for (const edit of recordEdits) {
    assert.throws(() => originalPixelSource(pixelSource, source.replace(sourceLiteral(edit.new), sourceLiteral(edit.old))));
    rejected++;
  }
  const page = beforeRelatedRemainingSource(pixelPage, read(pixelPage));
  for (const edit of pageSourceEdits) {
    const candidate = page.replace(edit.new, edit.old);
    assert.notEqual(candidate, page, "Approved page change fixture must apply: " + edit.id);
    assert.throws(() => {
      const original = reverseExact(candidate, pageSourceEdits);
      assert.equal(sha(original), sourceHashes[pixelPage]);
    }, undefined, "Missing approved page change: " + edit.id);
    rejected++;
  }
  return rejected;
}

function rejectResolverNegatives(loader, record, registry) {
  const { resolvePixelExternalPage } = loader.load("lib/games/pixel-external-page.ts");
  let rejected = 0;
  function rejectRecord(label, mutate) {
    const value = plain(record); mutate(value);
    assert.throws(() => resolvePixelExternalPage(value, registry), undefined, label + " must fail closed");
    rejected++;
  }
  function rejectRegistry(label, mutate) {
    const value = plain(registry); mutate(value);
    assert.throws(() => resolvePixelExternalPage(record, value), undefined, label + " must fail closed");
    rejected++;
  }
  for (const value of [undefined, null, [], "missing", {}]) {
    assert.throws(() => resolvePixelExternalPage(value, registry));
    rejected++;
  }
  for (const [path, values] of [
    [["id"], ["oval-face", "", null]],
    [["pageType"], ["GAME", "", null]],
    [["type"], ["OFFICIAL_IFRAME", "", null]],
    [["status"], ["DRAFT", "REVIEW", "BROKEN", "ARCHIVED"]],
    [["route", "path"], ["/games/pixel-art-avatar-icon-generator", "/"]],
    [["route", "existingPublishedRoute"], [false, null]],
    [["license", "registryRecordId"], ["square-face-swf", "", null]],
    [["license", "status"], ["UNKNOWN", "VERIFIED", "", null]],
    [["license", "releaseDecision"], ["APPROVED", "REVIEW_REQUIRED", "BLOCKED", "", null]],
    [["license", "newPublicationAllowed"], [false, "true", null]],
    [["license", "allowedDeliveryTypes"], [[], ["EXTERNAL_LINK", "OFFICIAL_IFRAME"], ["EXTERNAL_LINK", "EXTERNAL_LINK"], ["HTML5"], null]],
    [["player", "type"], ["OFFICIAL_IFRAME", "RUFFLE_SWF"]],
    [["player", "target"], ["_self", "", null]],
    [["player", "rel"], [["noopener"], ["noreferrer"], ["noreferrer", "noopener"], [], null]],
    [["player", "directLinkOnly"], [false, null]],
    [["player", "ctaLabel"], ["", null]],
    [["source", "kind"], ["LOCAL_PROJECT_FILE"]],
    [["source", "localAssetPath"], ["/games/pixel.html"]],
    [["howToPlay"], [null, "invalid"]],
    [["features"], [null, "invalid"]],
    [["tips"], [null, "invalid"]],
    [["faq"], [null, "invalid"]]
  ]) for (const value of values) rejectRecord(path.join("."), candidate => setAt(candidate, path, value));
  rejectRecord("destination mismatch", candidate => { candidate.player.url = "https://example.invalid/other"; });
  rejectRecord("source mismatch", candidate => { candidate.source.originalUrl = "https://example.invalid/other"; });

  for (const value of [null, [], "invalid", {}, { records: [] }]) {
    assert.throws(() => resolvePixelExternalPage(record, value)); rejected++;
  }
  const evidence = candidate => candidate.records.find(item => item.id === "pixel-avatar-external");
  rejectRegistry("missing associated evidence", candidate => { candidate.records = candidate.records.filter(item => item.id !== "pixel-avatar-external"); });
  rejectRegistry("duplicate evidence", candidate => { candidate.records.push(plain(evidence(candidate))); });
  for (const [path, values] of [
    [["publicPage"], ["https://example.invalid/tool", null]],
    [["deliveryType"], ["OFFICIAL_IFRAME", null]],
    [["releaseDecision"], [null, {}]],
    [["releaseDecision", "status"], ["APPROVED", "REVIEW_REQUIRED", "BLOCKED", null]],
    [["license"], [null, {}]],
    [["license", "status"], ["UNKNOWN", "VERIFIED", null]],
    [["source"], [null, {}]],
    [["source", "sourceUrl"], ["https://example.invalid/tool", null]],
    [["permissions"], [null, {}]],
    [["permissions", "directLinkAllowed"], [null, {}]],
    [["permissions", "directLinkAllowed", "status"], ["NO", "UNKNOWN", null]]
  ]) for (const value of values) rejectRegistry(path.join("."), candidate => setAt(evidence(candidate), path, value));
  const unsafeUrls = [
    "", "UNKNOWN", null, "http://www.icongenerators.net/terms.html", "//www.icongenerators.net/terms.html",
    "/terms.html", "https:relative-path", "javascript:alert(1)", "data:text/html,test",
    "https://user:password@www.icongenerators.net/terms.html", "https://www.icongenerators.net/terms.html ",
    "https://www.icongenerators.net/\nterms.html", "https://www.icongenerators.net\\@example.invalid/terms"
  ];
  for (const value of unsafeUrls) {
    rejectRegistry("unsafe/missing terms URL", candidate => { evidence(candidate).license.licenseEvidenceUrl = value; });
    const valueRecord = plain(record), valueRegistry = plain(registry);
    valueRecord.player.url = valueRecord.source.originalUrl = value;
    evidence(valueRegistry).source.sourceUrl = value;
    assert.throws(() => resolvePixelExternalPage(valueRecord, valueRegistry), undefined, "Unsafe but matching original URL must fail");
    rejected++;
  }
  return rejected;
}

function checkSidebar(loader) {
  const Sidebar = loader.load("components/GameSidebar.tsx").default;
  const gameCatalog = plain(loader.load("lib/games/catalog.ts").gameCatalog);
  const item = href => ({ title: "Sidebar test " + href, text: "Frozen description.", href, imageSrc: "/game-face-samples/gamer.webp", imageAlt: "Existing preview" });
  const items = ["/", pixelPath, "/oval-face-icon-generator", "/gallery", "/free-avatar-maker", "/unknown", pixelPath + "?frame=true", "/games/pixel-art-avatar-icon-generator"].map(item);
  const html = renderToStaticMarkup(React.createElement(Sidebar, { items }));
  const original = originalPixelSidebarMarkup(html, 1);
  assert.equal(count(html, badge), 1);
  assert.equal(count(original, badge), 0);
  assert.equal(count(html, 'class="side-game-card"'), items.length);
  let exclusions = 0;
  for (const status of ["DRAFT", "REVIEW", "BROKEN", "ARCHIVED"]) {
    const records = plain(gameCatalog); records.find(game => game.id === "pixel-art-avatar").status = status;
    const component = modules({ records }).load("components/GameSidebar.tsx").default;
    const candidate = renderToStaticMarkup(React.createElement(component, { items }));
    assert.equal(count(candidate, badge), 0, status + " must not receive a public External label");
    exclusions++;
  }
  for (const alter of [
    records => { records.find(game => game.id === "pixel-art-avatar").route.existingPublishedRoute = false; },
    records => { records.find(game => game.id === "pixel-art-avatar").pageType = "GAME"; },
    records => records.splice(records.findIndex(game => game.id === "pixel-art-avatar"), 1)
  ]) {
    const records = plain(gameCatalog); alter(records);
    const component = modules({ records }).load("components/GameSidebar.tsx").default;
    assert.equal(count(renderToStaticMarkup(React.createElement(component, { items })), badge), 0);
    exclusions++;
  }
  const hrefTag = 'href="' + pixelPath + '"';
  const fixtures = [
    html.replace(badge, ""),
    html.replace(badge, badge + badge),
    html.replace(badge, badge.replace("<span ", "<span hidden ")),
    html.replace(badge, badge.replace("External tool", "Browser game")),
    html.replace(' data-game-page-type="EXTERNAL_TOOL"', ""),
    html.replace('data-game-page-type="EXTERNAL_TOOL"', 'data-game-page-type="GAME"'),
    html.replace(hrefTag, 'href="/unapproved"'),
    html.replace(badge, "").replace("</small>", "</small>" + badge),
    html.replace('href="/gallery"', 'href="/gallery" data-game-page-type="EXTERNAL_TOOL"'),
    html.replace("Frozen description.", "Unapproved copy."),
    html + "<p>Extra unapproved content.</p>"
  ];
  for (const candidate of fixtures) {
    assert.notEqual(candidate, html);
    assert.throws(() => {
      assert.equal(originalPixelSidebarMarkup(candidate, 1), original, "Badge normalization cannot hide other content/link changes");
    });
  }
  return { visibleCards: items.length, exclusions, negativeFixtures: fixtures.length };
}

function checkBindings(loader, record, registry) {
  const paths = [];
  for (const key of ["howToPlay", "features", "tips", "faq"]) {
    for (let i = 0; i < record[key].length; i++) {
      if (typeof record[key][i] === "string") paths.push([key, i]);
      else for (const field of Object.keys(record[key][i])) paths.push([key, i, field]);
    }
  }
  const render = instance => renderToStaticMarkup(React.createElement(instance.load(pixelPage).default));
  let bindings = 0;
  for (const [index, path] of paths.entries()) {
    const candidate = plain(record), marker = "PixelBindingSentinel" + index;
    setAt(candidate, path, getAt(candidate, path) + " " + marker);
    const html = render(modules({ record: candidate }));
    assert.ok(html.includes(marker), path.join(".") + " must reach real rendered content");
    if (path[0] === "faq") {
      const schema = schemas(html).find(item => item["@type"] === "FAQPage");
      assert.ok(JSON.stringify(schema).includes(marker), "FAQ and FAQPage must share the same data");
    }
    bindings++;
  }
  for (const path of [["player", "ctaLabel"], ["source", "providerName"], ["source", "attribution"], ["seo", "h1"]]) {
    const candidate = plain(record), marker = "PixelBindingSentinel" + bindings;
    setAt(candidate, path, getAt(candidate, path) + " " + marker);
    assert.ok(render(modules({ record: candidate })).includes(marker), path.join("."));
    bindings++;
  }
  const termsRegistry = plain(registry);
  termsRegistry.records.find(item => item.id === "pixel-avatar-external").license.licenseEvidenceUrl = "https://www.icongenerators.net/terms-test.html";
  assert.ok(render(modules({ registry: termsRegistry })).includes('href="https://www.icongenerators.net/terms-test.html"'));
  bindings++;
  const linkedRecord = plain(record), linkedRegistry = plain(registry), originalUrl = "https://www.icongenerators.net/pixelavatar-test.html";
  linkedRecord.player.url = linkedRecord.source.originalUrl = originalUrl;
  linkedRegistry.records.find(item => item.id === "pixel-avatar-external").source.sourceUrl = originalUrl;
  assert.equal(count(render(modules({ record: linkedRecord, registry: linkedRegistry })), 'href="' + originalUrl + '"'), 2, "Both approved CTAs share the validated original URL");
  bindings++;
  const injected = plain(record);
  injected.faq[0].answer += ' </script><img src=x onerror="alert(1)">';
  const injectedHtml = render(modules({ record: injected }));
  assert.equal(schemas(injectedHtml).length, 3);
  assert.ok(schemas(injectedHtml)[1].mainEntity[0].acceptedAnswer.text.includes("</script><img"));
  assert.doesNotMatch(injectedHtml, /<img src=x/);
  const models = [];
  render(modules({ models }));
  assert.equal(models.length, 1);
  assert.deepEqual(models[0], golden.playerModel, "The existing minimal PlayerModel and adapter controls must remain unchanged");
  return { contentAndLinkBindings: bindings, escapedSchemaFixture: 1, unchangedPlayerModels: models.length };
}

function rejectHtmlNegatives(html) {
  const fixtures = [
    ['<title>Pixel Art Avatar Icon Generator', '<title>Unapproved Pixel Art Avatar Icon Generator'],
    ['<h1>Pixel Art Avatar Icon Generator</h1>', '<h1>Changed H1</h1>'],
    ['rel="canonical" href="https://mysquarefaceicon.com/pixel-art-avatar-icon-generator"', 'rel="canonical" href="https://example.invalid/pixel"'],
    ['<head>', '<head><meta name="robots" content="noindex"/>'],
    ['href="https://www.icongenerators.net/terms.html"', 'href="https://example.invalid/terms"'],
    ['href="https://www.icongenerators.net/pixelavatar.html"', 'href="https://example.invalid/tool"'],
    ['target="_blank"', 'target="_self"'],
    ['rel="noopener noreferrer"', 'rel="opener"'],
    ['<span class="tool-card-badge">External tool</span>', '<span class="tool-card-badge">Playable here</span>'],
    ['Opens icongenerators.net in a new tab.', 'Opens here.'],
    ['not permission to embed, copy,', 'permission to embed, copy,'],
    ['href="/contact"', 'href="/invalid-report"'],
    ['href="/oval-face-icon-generator"', 'href="/invalid-oval"'],
    ['data-player-type="EXTERNAL_LINK"', 'data-player-type="OFFICIAL_IFRAME"'],
    ['data-player-adapter="EXTERNAL_LINK"', 'data-player-adapter="LOCAL_IFRAME"'],
    ['<main>', '<main><iframe src="https://www.icongenerators.net/pixelavatar.html"></iframe>'],
    ['<main>', '<main><script src="/ruffle/ruffle.js"></script>'],
    ['<main>', '<main><img src="https://www.icongenerators.net/unapproved.png"/>'],
    ['</main>', '<p>Extra unapproved paragraph.</p></main>'],
    ['"@type":"WebPage"', '"@type":"WebApplication"'],
    ['How to Use the Pixel Avatar Maker on the Original Site', 'How to Use the Embedded Pixel Avatar Maker'],
    ['Why does this page open the original site?', 'Why does the embedded generator not load?'],
    ['href="#external-generator"', 'href="/#maker"']
  ];
  for (const [before, after] of fixtures) {
    assert.ok(html.includes(before), "HTML negative fixture did not apply: " + before);
    assert.throws(() => checkPixelDocument(html.replace(before, after)), undefined, "HTML drift was accepted: " + before);
  }
  return fixtures.length;
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run pixel-page:check [-- --built | -- --base http://127.0.0.1:3100]");
  for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(originalPixelSource(file, read(file))), hash);
  for (const [file, hash] of Object.entries(frozenSources)) assert.equal(sha(beforeGamesIndexSource(file, readFileSync(resolve(root, file)))), hash, file + " is outside MIG-PIXEL-001 plus confirmed directory changes");
  const loader = modules(), record = plain(loader.load(pixelSource).default);
  const registry = JSON.parse(read("data/game-license-registry.json"));
  originalPixelDiscoveryRecord(record);
  assert.deepEqual([record.howToPlay.length, record.features.length, record.tips.length, record.faq.length], [3, 6, 5, 6]);
  const { resolvePixelExternalPage } = loader.load("lib/games/pixel-external-page.ts");
  assert.deepEqual(plain(resolvePixelExternalPage(record).player), golden.playerModel);
  assert.equal(sha(JSON.stringify(loader.load(pixelPage).metadata)), golden.metadataHash);
  assert.match(read(pixelPage), /const \{ howToPlay: howToSteps, features, tips, faq \} = pixelArtAvatarGame/);
  assert.doesNotMatch(read(pixelPage), /const (?:howToSteps|features|tips|faq)\s*=\s*\[/);
  assert.match(read(pixelPage), /<GamePlayer model=\{pixelPlayerModel\} \/>/);
  assert.doesNotMatch(read("lib/games/pixel-external-page.ts"), /"use client"|'use client'|fetch\(/);
  assert.match(read("components/GameSidebar.tsx"), /resolveLegacyGamePath\(item\.href\)\?\.pageType === "EXTERNAL_TOOL"/);
  const warnings = [], originalError = console.error;
  let bindingResults, sidebarResults;
  console.error = (...items) => warnings.push(items.map(String).join(" "));
  try {
    const html = renderToStaticMarkup(React.createElement(loader.load(pixelPage).default));
    checkVisibleBoundary(html);
    assert.equal(sha(originalPixelMarkup(html)), golden.ssrHash, "Full real-component SSR must equal the old output after exact reversals only");
    bindingResults = checkBindings(loader, record, registry);
    sidebarResults = checkSidebar(loader);
  } finally { console.error = originalError; }
  assert.ok(warnings.every(message => message.includes("fetchPriority")), "Unexpected SSR warning: " + warnings.join(" | "));
  const normalizationNegatives = rejectNormalizationNegatives(record);
  const resolverNegatives = rejectResolverNegatives(loader, record, registry);
  console.log("MIG-PIXEL-001 source/real SSR passed: 3 How-to / 6 Features / 5 Tips / 6 FAQ; " + bindingResults.contentAndLinkBindings + " content/link bindings; original metadata and minimal PlayerModel preserved.");
  console.log("Exact old source/SSR reversals passed; " + normalizationNegatives + " source/data normalization negatives, " + resolverNegatives + " fail-closed record/Registry negatives, " + sidebarResults.negativeFixtures + " badge negatives rejected; " + sidebarResults.exclusions + " unpublished/non-External sidebar exclusions.");
  console.log(Object.keys(frozenSources).length + " other source/check/config hashes unchanged. No rights waiver, iframe, hosted tool, extra runtime, schema claim, or URL/index change.");

  if (args.length) {
    let base;
    if (args[0] === "--base") {
      base = new URL(args[1]);
      assert.ok(["http:", "https:"].includes(base.protocol) && ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Only loopback previews may be checked");
      assert.ok(base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password);
    }
    async function get(path, file) {
      if (!base) return read(file);
      const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10_000) });
      assert.equal(response.status, 200, path + " status");
      assert.match(response.headers.get("content-type") ?? "", /text\/html/i);
      if (path === pixelPath || path === "/") assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|none/i);
      return response.text();
    }
    const html = await get(pixelPath, ".next/server/app/pixel-art-avatar-icon-generator.html");
    checkPixelDocument(html);
    const negatives = rejectHtmlNegatives(html);
    const routes = ["/", "/oval-face-icon-generator", "/es", "/vi", "/ja", "/th", "/ar", "/ru", "/id"];
    for (const route of routes) {
      const page = await get(route, ".next/server/app/" + (route === "/" ? "index" : route.slice(1)) + ".html");
      const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
      assert.ok(main);
      originalPixelSidebarMarkup(main, route === "/" ? 0 : 1);
      if (route.length === 3) {
        assert.match(page, /<meta name="robots" content="noindex, follow"/);
        assert.doesNotMatch(page, /hreflang=/i);
      }
    }
    console.log("Pixel " + (base ? "loopback HTTP" : "built HTML") + " passed: exact content/header/footer/metadata/schema; " + negatives + " HTML negatives; 8 labeled legacy sidebars and unchanged root labels. Full frozen-route parity is separately checked by Square/Oval/Locale regressions.");
  }
  console.log("Browser/mobile/new-tab behavior, external generator functionality, CWV, actual licensing, production and deployment require separate evidence.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(); } catch (error) {
    console.error("MIG-PIXEL-001 check failed: " + (error.stack ?? error.message));
    process.exitCode = 1;
  }
}
