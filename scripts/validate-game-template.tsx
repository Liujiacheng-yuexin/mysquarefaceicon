import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import GameDetailTemplate from "../components/game/GameDetailTemplate";
import GameSourceRights from "../components/game/GameSourceRights";
import { gameCatalog } from "../lib/games/catalog";
import { GAME_SCHEMA_VERSION, defineGame, validateGameRecord, type GameDeliveryType, type GamePlayer, type GameRecord } from "../lib/games/game-schema";
import { createGamePlayerModel } from "../lib/games/game-player-model";
import { buildGameStructuredData, serializeGameStructuredData } from "../lib/seo/game-structured-data";

const projectRoot = resolve(__dirname, "../..");
const deliveryTypes = [
  "RUFFLE_SWF",
  "HTML5",
  "LOCAL_IFRAME",
  "OFFICIAL_IFRAME",
  "EXTERNAL_LINK"
] as const satisfies readonly GameDeliveryType[];

function fixturePlayer(type: GameDeliveryType, slug: string): GamePlayer {
  switch (type) {
    case "RUFFLE_SWF":
      return {
        type,
        swfSources: [`/games/${slug}.swf`],
        backgroundColor: "#FFAF03",
        aspectRatio: "16 / 9",
        clickToLoad: true
      };
    case "HTML5":
      return { type, entryUrl: `/games/${slug}/index.html` };
    case "LOCAL_IFRAME":
      return { type, src: `/games/${slug}/index.html`, sandbox: ["allow-scripts"] };
    case "OFFICIAL_IFRAME":
      return {
        type,
        src: "https://example.com/avatar-maker/embed",
        providerName: "Fixture Provider",
        permissionEvidenceUrl: "https://example.com/avatar-maker/embed-policy"
      };
    case "EXTERNAL_LINK":
      return {
        type,
        url: "https://example.com/avatar-maker",
        ctaLabel: "Open Original Page",
        target: "_blank",
        rel: ["noopener", "noreferrer"],
        directLinkOnly: true
      };
  }
}

function buildFixture(type: GameDeliveryType): GameRecord {
  const suffix = type.toLowerCase().replaceAll("_", "-");
  const id = `template-${suffix}`;
  const slug = `template-${suffix}`;
  const isExternal = type === "EXTERNAL_LINK";
  const record = {
    schemaVersion: GAME_SCHEMA_VERSION,
    id,
    name: `Template ${suffix} Avatar Maker`,
    slug,
    pageType: isExternal ? "EXTERNAL_TOOL" : "GAME",
    type,
    route: {
      path: `/games/${slug}`,
      canonical: `https://mysquarefaceicon.com/games/${slug}`,
      indexStatus: "INDEX",
      existingPublishedRoute: false
    },
    source: {
      kind: isExternal ? "OFFICIAL_EXTERNAL_PAGE" : "LOCAL_PROJECT_ASSET",
      providerName: isExternal ? "Fixture Original Site" : "Approved fixture package",
      originalUrl: isExternal ? "https://example.com/avatar-maker" : null,
      localAssetPath: isExternal ? null : `public/games/${slug}`,
      sha256: null,
      attribution: isExternal ? "Fixture attribution for the external original site." : null
    },
    license: {
      registryRecordId: id,
      status: isExternal ? "RESTRICTED" : "VERIFIED",
      releaseDecision: isExternal ? "DIRECT_LINK_ONLY" : "APPROVED",
      newPublicationAllowed: true,
      allowedDeliveryTypes: [type]
    },
    category: { primary: "face-makers", secondary: ["avatar-makers"] },
    tags: ["avatar-maker", "template-fixture"],
    images: [
      {
        role: "THUMBNAIL",
        src: "/square-face-icon.png",
        alt: "Template avatar maker thumbnail",
        width: 512,
        height: 512,
        provenance: "PROJECT_ASSET"
      },
      ...(!isExternal ? [{
        role: "PLAYER_PREVIEW" as const,
        src: "/games/square-face-cover.png",
        alt: "Template avatar maker player preview",
        width: 970,
        height: 844,
        provenance: "PROJECT_ASSET" as const
      }] : []),
      {
        role: "OPEN_GRAPH",
        src: "/og-image.svg",
        alt: "Template avatar maker social preview",
        width: 1200,
        height: 630,
        provenance: "PROJECT_ASSET"
      }
    ],
    controls: [
      {
        id: isExternal ? "open-original" : "play",
        label: isExternal ? "Open original" : "Play",
        description: isExternal ? "Open the original tool." : "Start the approved fixture.",
        inputMethods: ["POINTER", "TOUCH", "KEYBOARD"]
      }
    ],
    howToPlay: [
      { title: "Open the experience", text: "Use the visible primary control to begin." },
      { title: "Choose avatar parts", text: "Use the real controls to customize the avatar." },
      { title: "Finish the avatar", text: "Follow the recorded save or screenshot guidance." }
    ],
    features: [{ title: "Avatar-focused", text: "The fixture remains inside the approved avatar-maker scope." }],
    tips: ["Use a desktop browser when controls need more space"],
    faq: [{ question: "What is this fixture?", answer: "It is a local validation record for the shared template." }],
    mobile: {
      support: "SUPPORTED",
      orientation: "ANY",
      verifiedAt: "2026-09-01T00:00:00.000Z",
      note: "The fixture is used only for local template validation."
    },
    fullscreen: {
      availability: isExternal ? "NOT_APPLICABLE" : "BROWSER_DEPENDENT",
      mode: isExternal ? "NONE" : "BROWSER_FULLSCREEN_API",
      note: isExternal ? "The external tool is not embedded." : "Fullscreen depends on the browser API."
    },
    player: fixturePlayer(type, slug),
    status: "PUBLISHED",
    seo: {
      title: `Template ${suffix} Avatar Maker | My Square Face Icon`,
      description: `Validate the ${suffix} shared avatar-game detail template with factual content and rights boundaries.`,
      h1: `Template ${suffix} Avatar Maker`,
      canonical: `https://mysquarefaceicon.com/games/${slug}`,
      primaryKeyword: `${suffix} avatar maker`,
      secondaryKeywords: ["avatar maker template"],
      searchIntent: "Validate the shared avatar-game detail page",
      semanticCoverage: {
        topics: ["avatar controls", "source rights", "mobile guidance"],
        score: null,
        reviewedAt: null,
        note: "Validation fixture only; no public SEO score."
      },
      schemaTypes: isExternal
        ? ["WebPage", "FAQPage", "BreadcrumbList"]
        : ["VideoGame", "FAQPage", "BreadcrumbList"]
    },
    content: {
      summary: `Use the ${suffix} fixture to verify the approved Player-first game detail template.`,
      description: [
        "This local fixture provides factual template content.",
        "It is removed from the production catalog after browser QA."
      ],
      sections: ["game-player", "related", "how-to-play", "description", "features", "tips", "faq", "rights"]
    },
    relatedGameIds: ["square-face", "oval-face"],
    measurements: { inboundLinkCount: null, qualityScore: null },
    publication: {
      publishedAt: null,
      modifiedAt: null,
      timestampStatus: "UNKNOWN",
      note: "Local validation fixture; no public timestamps."
    },
    author: null
  } as unknown as GameRecord;

  return defineGame(record);
}

function renderTemplate(game: GameRecord, relatedGameRecords: readonly GameRecord[] = [game, ...gameCatalog]) {
  const model = createGamePlayerModel(game, {
    labels: { start: "Play Game", reload: "Reload Game", help: "Report Issue" },
    showStartControl: false
  });
  return renderToStaticMarkup(
    <GameDetailTemplate game={game} playerModel={model} relatedGameRecords={relatedGameRecords} />
  );
}

const fixtures = deliveryTypes.map(buildFixture);
for (const fixture of fixtures) {
  const markup = renderTemplate(fixture);
  assert.equal((markup.match(/<h1/g) ?? []).length, 1, `${fixture.type} must render one H1.`);
  assert.match(markup, /Home[\s\S]*Games[\s\S]*Template/, `${fixture.type} must render the breadcrumb.`);
  assert.match(markup, /game-detail-player/, `${fixture.type} must render the Player-first region.`);
  assert.match(markup, /Experience[\s\S]*Category[\s\S]*Mobile[\s\S]*Fullscreen[\s\S]*Source/);
  assert.match(markup, /How to play/);
  assert.match(markup, /Frequently asked questions/);
  assert.match(markup, /Source &amp; Rights/);
  assert.match(markup, /More avatar games/);
  assert.doesNotMatch(markup, /route-eyebrow/, "The accepted detail template must not add an eyebrow above the H1 or Related heading.");
  assert.doesNotMatch(markup, /data-ad-slot|adsbygoogle/i, "The template must not mount an ad slot or ad script.");
  assert.doesNotMatch(markup, /ruffle\.js|\.wasm|template-ruffle-swf\.swf/i, "Initial markup must not load Ruffle, WASM, or SWF assets.");

  const playerIndex = markup.indexOf("game-detail-player");
  const metaIndex = markup.indexOf("game-detail-meta");
  const relatedIndex = markup.indexOf("Related avatar games");
  const howToIndex = markup.indexOf("How to play");
  const aboutIndex = markup.indexOf("About Template");
  const faqIndex = markup.indexOf("Frequently asked questions");
  const rightsIndex = markup.indexOf("Source &amp; Rights");
  const moreIndex = markup.indexOf("More avatar games");
  assert.ok(playerIndex < metaIndex && metaIndex < relatedIndex && relatedIndex < howToIndex);
  assert.ok(howToIndex < aboutIndex && aboutIndex < faqIndex && faqIndex < rightsIndex && rightsIndex < moreIndex);
}

const externalFixture = fixtures.find((fixture) => fixture.type === "EXTERNAL_LINK");
assert.ok(externalFixture);
const externalMarkup = renderTemplate(externalFixture);
const externalPlayerMarkup = externalMarkup.slice(
  externalMarkup.indexOf("game-detail-player"),
  externalMarkup.indexOf("game-detail-meta")
);
assert.match(externalMarkup, /Open Original Page/);
assert.match(externalMarkup, /Direct-link only/);
assert.doesNotMatch(externalPlayerMarkup, />Fullscreen<|>Reload Game<|>Play Game</);

const externalSchema = JSON.stringify(buildGameStructuredData(externalFixture));
assert.match(externalSchema, /"@type":"WebPage"/);
assert.doesNotMatch(externalSchema, /VideoGame|WebApplication|aggregateRating|review|userCount/);

const gameFixture = fixtures.find((fixture) => fixture.type === "HTML5");
assert.ok(gameFixture);
const gameSchema = JSON.stringify(buildGameStructuredData(gameFixture));
assert.match(gameSchema, /VideoGame/);
assert.match(gameSchema, /FAQPage/);
assert.match(gameSchema, /BreadcrumbList/);

const noOptionalModules = {
  ...gameFixture,
  content: { ...gameFixture.content, description: [] },
  relatedGameIds: [],
  features: []
} as unknown as GameRecord;
const noOptionalMarkup = renderTemplate(noOptionalModules, [noOptionalModules]);
assert.doesNotMatch(noOptionalMarkup, /About Template/);
assert.doesNotMatch(noOptionalMarkup, /Related avatar games/);
assert.doesNotMatch(noOptionalMarkup, />Features</);
assert.match(noOptionalMarkup, />Tips</);

const unknownRights = {
  ...gameFixture,
  license: {
    ...gameFixture.license,
    status: "UNKNOWN",
    releaseDecision: "REVIEW_REQUIRED",
    newPublicationAllowed: false,
    allowedDeliveryTypes: []
  }
} as GameRecord;
const unknownRightsMarkup = renderToStaticMarkup(<GameSourceRights game={unknownRights} />);
assert.match(unknownRightsMarkup, /UNKNOWN does not mean permission/);
assert.match(unknownRightsMarkup, /Repository presence is not proof of authorization/);

const blockedFixture = {
  ...gameFixture,
  license: {
    ...gameFixture.license,
    releaseDecision: "BLOCKED",
    newPublicationAllowed: false,
    allowedDeliveryTypes: []
  }
} as GameRecord;
assert.throws(() => createGamePlayerModel(blockedFixture), /blocked|not allowed|policy/i);

const blankDescriptionErrors = validateGameRecord({
  ...gameFixture,
  content: { ...gameFixture.content, description: [" "] }
});
assert.ok(blankDescriptionErrors.some((error) => error.includes("content.description[0]")));
assert.equal(validateGameRecord({ ...gameFixture, content: { ...gameFixture.content, description: [] } }).length, 0);
assert.equal(validateGameRecord({ ...gameFixture, content: { summary: gameFixture.content.summary, sections: gameFixture.content.sections } }).length, 0);

assert.equal(serializeGameStructuredData({ value: "</script>" }).includes("</script>"), false);

const routeSource = readFileSync(resolve(projectRoot, "app/games/[slug]/page.tsx"), "utf8");
assert.match(routeSource, /resolveNewGameSlug/);
assert.match(routeSource, /forceNoIndex:\s*!isIndexAllowedNewGame\(game\)/);
assert.match(routeSource, /createGamePlayerModel/);
assert.match(routeSource, /<GameDetailTemplate/);
assert.doesNotMatch(routeSource, /AdSlotShell/);

const relatedSource = readFileSync(resolve(projectRoot, "components/game/RelatedGames.tsx"), "utf8");
assert.match(relatedSource, /selectRelatedGames\(game, records, limit\)/);
assert.doesNotMatch(relatedSource, /relatedGameIds/);

console.log("GAME-TPL-001 validation passed");
console.log("- five delivery types render through the shared Player-first detail template");
console.log("- module order, conditional sections, FAQ DOM, factual rights, and internal navigation are present");
console.log("- External Tool structured data stays WebPage-only; playable records use conservative VideoGame data");
console.log("- initial template markup contains no Ruffle runtime, WASM, or SWF request URL");
console.log("- future route keeps resolver, true-404 boundary, and force-noindex metadata gate");
