import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeFavoritesMarkup } from "./favorites-markup-compat";
import AdSlotShell from "../components/game/AdSlotShell";
import CategoryChip from "../components/game/CategoryChip";
import EmptyState from "../components/game/EmptyState";
import GameBreadcrumb from "../components/game/GameBreadcrumb";
import GameCard from "../components/game/GameCard";
import GameControls from "../components/game/GameControls";
import GameGrid from "../components/game/GameGrid";
import GameMeta from "../components/game/GameMeta";
import RelatedGames from "../components/game/RelatedGames";
import { gameCategories } from "../data/game-categories";
import ovalFaceGame from "../data/games/oval-face";
import pixelArtAvatarGame from "../data/games/pixel-art-avatar";
import squareFaceGame from "../data/games/square-face";
import {
  createGamePlayerModel,
  type RufflePlayerModel
} from "../lib/games/game-player-model";

const projectRoot = resolve(__dirname, "../..");

const gameCardMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<GameCard game={squareFaceGame} />));
assert.match(gameCardMarkup, /href="\/"/);
assert.match(gameCardMarkup, /game-list-card/);
assert.doesNotMatch(gameCardMarkup, /class="game-card(?:\s|\")/, "Directory cards must not collide with the legacy player-shell class.");
assert.match(gameCardMarkup, /data-game-id="square-face"/);
assert.match(gameCardMarkup, /Browser game/);
assert.match(gameCardMarkup, /Square Face Generator/);

const externalCardMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<GameCard game={pixelArtAvatarGame} />));
assert.match(externalCardMarkup, /route-game-link-external/);
assert.match(externalCardMarkup, /External tool/);
assert.match(externalCardMarkup, /href="\/pixel-art-avatar-icon-generator"/);
assert.doesNotMatch(externalCardMarkup, /target="_blank"/, "Directory cards must open the local source-details page first.");

const gridMarkup = beforeFavoritesMarkup(renderToStaticMarkup(
  <GameGrid games={[squareFaceGame, ovalFaceGame, pixelArtAvatarGame]} ariaLabel="Published games" />
));
assert.equal((gridMarkup.match(/data-game-id=/g) ?? []).length, 3);
assert.match(gridMarkup, /aria-label="Published games"/);

const emptyMarkup = renderToStaticMarkup(
  <EmptyState title="No games" description="Nothing has passed the publication gate." />
);
assert.match(emptyMarkup, /No games/);
assert.match(emptyMarkup, /publication gate/);

const breadcrumbMarkup = renderToStaticMarkup(
  <GameBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Face Makers" }]} />
);
assert.match(breadcrumbMarkup, /aria-label="Breadcrumb"/);
assert.match(breadcrumbMarkup, /href="\/games"/);
assert.match(breadcrumbMarkup, /aria-current="page">Face Makers/);

const categoryMarkup = renderToStaticMarkup(
  <CategoryChip category={gameCategories[0]} gameCount={2} />
);
assert.match(categoryMarkup, /href="\/category\/face-makers"/);
assert.match(categoryMarkup, /2 current entries/);

const metaMarkup = renderToStaticMarkup(<GameMeta game={squareFaceGame} />);
assert.match(metaMarkup, /Partial support/);
assert.match(metaMarkup, /Browser dependent/);
assert.match(metaMarkup, /Face Makers/);
assert.doesNotMatch(metaMarkup, /popular|rating|users/i, "GameMeta must not invent popularity or rating claims.");

const relatedMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<RelatedGames game={squareFaceGame} />));
assert.match(relatedMarkup, /Oval Face Icon Generator/);
assert.match(relatedMarkup, /Pixel Art Avatar Icon Generator/);
assert.doesNotMatch(relatedMarkup, /data-game-id="square-face"/);

const pixelPlayerModel = createGamePlayerModel(pixelArtAvatarGame);
if (pixelPlayerModel.type !== "EXTERNAL_LINK") throw new Error("Pixel must remain an external-link model.");
const externalControlsMarkup = renderToStaticMarkup(<GameControls model={pixelPlayerModel} />);
assert.match(externalControlsMarkup, /External tool controls/);
assert.match(externalControlsMarkup, /Report Issue/);
assert.doesNotMatch(externalControlsMarkup, /Fullscreen|Reload|Open Original/);

const playableControlsModel = {
  id: "controls-fixture",
  name: "Controls fixture",
  type: "RUFFLE_SWF",
  ariaLabel: "Controls fixture player",
  cover: null,
  frame: { aspectRatio: "16 / 9", maxWidth: "980px", backgroundColor: "#111827" },
  labels: {
    start: "Play",
    reload: "Reload",
    help: "Report Issue",
    cover: "Start controls fixture",
    loading: "Loading controls fixture...",
    error: "Controls fixture failed.",
    slowLoadingHint: "Still loading?"
  },
  source: { providerName: "Fixture Provider", originalUrl: null, attribution: null },
  policy: { releaseDecision: "APPROVED", allowedDeliveryTypes: ["RUFFLE_SWF"] },
  deviceNotice: "Fixture guidance.",
  reportHref: "/contact",
  showStartControl: true,
  player: { swfSources: ["/games/fixture.swf"], backgroundColor: "#111827", clickToLoad: true }
} satisfies RufflePlayerModel;
const playableControlsMarkup = renderToStaticMarkup(
  <GameControls
    model={playableControlsModel}
    activated={false}
    fullscreenAvailable
    onActivateOrReload={() => undefined}
    onToggleFullscreen={() => undefined}
  />
);
assert.match(playableControlsMarkup, />Play</);
assert.match(playableControlsMarkup, /Fullscreen/);
assert.match(playableControlsMarkup, /Reload/);
assert.match(playableControlsMarkup, /Report Issue/);

const adMarkup = renderToStaticMarkup(<AdSlotShell slotId="detail-below-player" minHeight={280} />);
assert.match(adMarkup, /data-ad-slot="detail-below-player"/);
assert.match(adMarkup, /--ad-slot-min-height:280px/);
assert.doesNotMatch(adMarkup, /<script|<iframe/i, "AdSlotShell must remain an inert layout reservation.");

const requiredComponentFiles = [
  "AdSlotShell.tsx",
  "CategoryChip.tsx",
  "EmptyState.tsx",
  "GameBreadcrumb.tsx",
  "GameCard.tsx",
  "GameControls.tsx",
  "GameGrid.tsx",
  "GameMeta.tsx",
  "GamePlayer.tsx",
  "RelatedGames.tsx"
];
for (const file of requiredComponentFiles) {
  assert.doesNotThrow(() => readFileSync(resolve(projectRoot, "components/game", file), "utf8"), `${file} must exist.`);
}

const gamePlayerSource = readFileSync(resolve(projectRoot, "components/game-player/GamePlayer.tsx"), "utf8");
assert.match(
  gamePlayerSource,
  /import GameControls from "(?:@\/components\/game\/GameControls|\.\.\/game\/GameControls)"/,
  "GamePlayer must consume the shared GameControls component through a valid project or relative import."
);
assert.doesNotMatch(gamePlayerSource, /className="game-control-bar"/, "GamePlayer controls must use the shared component.");

for (const routeFile of ["app/games/page.tsx", "app/category/[slug]/page.tsx"]) {
  const source = readFileSync(resolve(projectRoot, routeFile), "utf8");
  assert.match(source, /<GameGrid/);
  assert.match(source, /<GameBreadcrumb/);
  assert.doesNotMatch(source, /className="route-game-link/, `${routeFile} must not duplicate card markup.`);
  assert.doesNotMatch(source, /AdSlotShell/, `${routeFile} must not load ads on the current noindex scaffold.`);
}

const notFoundSource = readFileSync(resolve(projectRoot, "app/not-found.tsx"), "utf8");
assert.doesNotMatch(notFoundSource, /AdSlotShell/, "The 404 boundary must not load an ad slot.");

console.log("COMP-001 validation passed");
console.log("- all ten required shared components exist under components/game");
console.log("- cards, grids, categories, breadcrumbs, metadata, related records, empty state, and ad shell render from typed data");
console.log("- GameControls preserves playable and external-tool capability boundaries");
console.log("- route pages consume shared components without duplicate card markup");
console.log("- noindex directory/category scaffolds and the 404 boundary do not import AdSlotShell");
