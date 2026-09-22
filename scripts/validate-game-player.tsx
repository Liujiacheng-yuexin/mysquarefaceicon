import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import ExternalLinkAdapter from "../components/game-player/adapters/ExternalLinkAdapter";
import pixelArtAvatarGame from "../data/games/pixel-art-avatar";
import {
  PLAYER_DELIVERY_TYPES,
  assertPlayerReleasePolicy,
  assertValidGamePlayerModel,
  createGamePlayerModel,
  getPlayerCapabilities,
  validateGamePlayerModel,
  type GamePlayerModel
} from "../lib/games/game-player-model";
import type { GameDeliveryType } from "../lib/games/game-schema";

const projectRoot = resolve(__dirname, "../..");

function fixtureBase<TType extends GameDeliveryType>(type: TType) {
  return {
    id: `fixture-${type.toLowerCase()}`,
    name: `${type} fixture`,
    type,
    ariaLabel: `${type} fixture player`,
    cover: { src: "/fixture-cover.png", width: 640, height: 360 },
    frame: { aspectRatio: "16 / 9", maxWidth: "980px", backgroundColor: "#111827" },
    labels: {
      start: "Play",
      reload: "Reload",
      help: "Report Issue",
      cover: `Start ${type} fixture`,
      loading: `Loading ${type} fixture...`,
      error: `${type} fixture failed to load.`,
      slowLoadingHint: "Still loading?"
    },
    source: { providerName: "Fixture Provider", originalUrl: null, attribution: null },
    policy: { releaseDecision: "APPROVED" as const, allowedDeliveryTypes: [type] },
    deviceNotice: "Fixture device guidance.",
    reportHref: "/contact",
    showStartControl: true
  };
}

const fixtures = [
  {
    ...fixtureBase("RUFFLE_SWF"),
    player: {
      swfSources: ["/games/fixture.swf"],
      backgroundColor: "#FFAF03",
      clickToLoad: true
    }
  },
  {
    ...fixtureBase("HTML5"),
    player: { entryUrl: "/fixtures/html5/index.html" }
  },
  {
    ...fixtureBase("LOCAL_IFRAME"),
    player: { src: "/fixtures/local/index.html", sandbox: ["allow-scripts"] }
  },
  {
    ...fixtureBase("OFFICIAL_IFRAME"),
    source: {
      providerName: "Official Fixture Provider",
      originalUrl: "https://example.com/game",
      attribution: null
    },
    player: {
      src: "https://example.com/embed/game",
      providerName: "Official Fixture Provider",
      permissionEvidenceUrl: "https://example.com/embed-permission"
    }
  },
  {
    ...fixtureBase("EXTERNAL_LINK"),
    source: {
      providerName: "External Fixture Provider",
      originalUrl: "https://example.com/game",
      attribution: "External fixture attribution."
    },
    policy: { releaseDecision: "DIRECT_LINK_ONLY" as const, allowedDeliveryTypes: ["EXTERNAL_LINK" as const] },
    player: {
      url: "https://example.com/game",
      ctaLabel: "Open Original",
      target: "_blank" as const,
      rel: ["noopener", "noreferrer"] as const,
      directLinkOnly: true as const
    }
  }
] satisfies readonly GamePlayerModel[];

assert.deepEqual(
  fixtures.map((fixture) => fixture.type),
  PLAYER_DELIVERY_TYPES,
  "The fixture set must cover every delivery type in stable order."
);

for (const fixture of fixtures) {
  assert.deepEqual(validateGamePlayerModel(fixture), [], `${fixture.type} fixture must be valid.`);
  const capabilities = getPlayerCapabilities(fixture.type);
  if (fixture.type === "EXTERNAL_LINK") {
    assert.deepEqual(capabilities, { play: false, fullscreen: false, reload: false, outbound: true });
  } else {
    assert.equal(capabilities.play, true);
    assert.equal(capabilities.fullscreen, true);
    assert.equal(capabilities.reload, true);
  }
}

assert.throws(
  () =>
    assertPlayerReleasePolicy(
      { releaseDecision: "DIRECT_LINK_ONLY", allowedDeliveryTypes: ["EXTERNAL_LINK"] },
      "RUFFLE_SWF"
    ),
  /not allowed|DIRECT_LINK_ONLY/,
  "A direct-link-only record must fail closed before an onsite adapter is selected."
);

assert.deepEqual(
  validateGamePlayerModel({ ...fixtures[4], type: "UNSUPPORTED_PLAYER" }),
  ["Player model has an unsupported delivery type."],
  "Unknown adapters must fail closed."
);
assert.throws(
  () => assertValidGamePlayerModel({ ...fixtures[1], player: { entryUrl: "javascript:alert(1)" } }),
  /local root-relative entry URL/,
  "Unsafe frame URLs must fail before rendering."
);

const pixelModel = createGamePlayerModel(pixelArtAvatarGame);
if (pixelModel.type !== "EXTERNAL_LINK") throw new Error("Pixel player must remain EXTERNAL_LINK.");
const externalMarkup = renderToStaticMarkup(<ExternalLinkAdapter model={pixelModel} />);
assert.doesNotMatch(externalMarkup, /<iframe/i, "ExternalLinkAdapter must never render an iframe.");
assert.match(externalMarkup, /target="_blank"/);
assert.match(externalMarkup, /rel="noopener noreferrer"/);
assert.match(externalMarkup, /data-player-adapter="EXTERNAL_LINK"/);

const gamePlayerSource = readFileSync(resolve(projectRoot, "components/game-player/GamePlayer.tsx"), "utf8");
const ruffleAdapterSource = readFileSync(
  resolve(projectRoot, "components/game-player/adapters/RuffleAdapter.tsx"),
  "utf8"
);
assert.match(
  gamePlayerSource,
  /dynamic\(\(\) => import\("\.\/adapters\/RuffleAdapter"\)/,
  "RuffleAdapter must remain a conditional dynamic import."
);
assert.doesNotMatch(
  gamePlayerSource,
  /import RuffleAdapter from/,
  "RuffleAdapter must not be added to the initial static client graph."
);
assert.match(
  gamePlayerSource,
  /assertValidGamePlayerModel\(model\)/,
  "GamePlayer must validate delivery and release policy before adapter dispatch."
);
assert.match(
  gamePlayerSource,
  /scheduleAdapterMountAfterPaint[\s\S]*?window\.requestAnimationFrame\(\(\) => \{[\s\S]*?window\.requestAnimationFrame\(\(\) => \{[\s\S]*?setAdapterMounted\(true\)/,
  "The first loading response must be given a paint opportunity before adapter initialization."
);
assert.match(
  gamePlayerSource,
  /\{adapterMounted && \(\s*<PlayableAdapter/,
  "Playable adapters must mount from the deferred adapter phase, not directly from the click state."
);
assert.match(
  ruffleAdapterSource,
  /let ruffleRuntimePromise: Promise<RuffleRelease> \| null = null/,
  "Ruffle reloads must reuse one initialized release instead of switching runtime sources."
);

console.log("PLAYER-001 validation passed");
console.log("- all five delivery adapters have valid fixtures and exhaustive capabilities");
console.log("- unknown and DIRECT_LINK_ONLY mismatches fail closed");
console.log("- ExternalLinkAdapter renders a safe new-tab link and no iframe");
console.log("- RuffleAdapter remains conditionally dynamic for click-to-load delivery");
console.log("- GamePlayer validates URLs and release policy before runtime adapter dispatch");
console.log("- first activation paints loading before the dynamic adapter mounts");
console.log("- Ruffle reloads reuse one initialized release");
