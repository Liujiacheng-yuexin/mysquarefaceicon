import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import HomeHero from "../components/home/HomeHero";
import squareFaceGame from "../data/games/square-face";
import { resolveSquareHomepage } from "../lib/games/square-homepage";

const projectRoot = resolve(__dirname, "../..");
const homepage = resolveSquareHomepage(squareFaceGame);
const player = squareFaceGame.player;
if (player.type !== "RUFFLE_SWF") {
  throw new Error("HOME-HERO-001 requires the Square record to use the RUFFLE_SWF adapter.");
}

const cover = squareFaceGame.images.find((image) => image.role === "PLAYER_PREVIEW");
assert.ok(cover?.src, "The Square Game Data record must provide the core preview cover.");

const renderWarnings: string[] = [];
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  renderWarnings.push(args.map(String).join(" "));
};
let markup = "";
try {
  markup = renderToStaticMarkup(
    <HomeHero
      h1={homepage.h1}
      copy={homepage.content.hero}
      player={homepage.player}
    />
  );
} finally {
  console.error = originalConsoleError;
}
assert.ok(
  renderWarnings.every((warning) => warning.includes("fetchPriority")),
  `Unexpected server-render warning: ${renderWarnings.join(" | ")}`
);

assert.match(markup, /data-home-section="hero"/);
assert.match(markup, /data-core-game-preview="true"/);
assert.equal((markup.match(/<h1>/g) ?? []).length, 1, "HomeHero must render exactly one H1.");
assert.match(markup, /<h1>Square Face Generator<\/h1>/);
assert.match(markup, /Classic Flash avatar maker/);
assert.match(
  markup,
  /Play the classic Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more\./
);
assert.match(markup, /data-home-hero-play="true"/);
assert.match(markup, /aria-controls="home-core-game-preview"/);
assert.match(markup, /class="flash-cover flash-preview"/);
assert.match(markup, /data-player-type="RUFFLE_SWF"/);
assert.equal((markup.match(/data-player-type=/g) ?? []).length, 1, "HomeHero must render one player instance.");
assert.match(markup, /Reload Game/);
assert.match(markup, /Report Issue/);
assert.doesNotMatch(markup, /ruffle-player|\.wasm|\.swf|\/ruffle\//i, "Initial Hero HTML must not contain runtime or SWF requests.");
assert.doesNotMatch(
  markup,
  /official|original|popular|trending|ratings?|users?|AI generator|modern rebuilt/i,
  "HomeHero must not introduce unsupported rights, popularity, or product claims."
);

const homePageSource = readFileSync(resolve(projectRoot, "components/HomePage.tsx"), "utf8");
const heroIndex = homePageSource.indexOf("<HomeHero");
const discoveryIndex = homePageSource.indexOf("<HomeDiscoveryRegion");
assert.ok(heroIndex >= 0, "The primary homepage must render HomeHero.");
assert.ok(discoveryIndex > heroIndex, "The accepted discovery region must remain immediately after HomeHero.");
assert.match(homePageSource, /isPrimaryHomepage \? \(\s*<HomeHero/);
assert.match(homePageSource, /<GameSidebar items=\{legacyLocaleSidebarItems\}/);

const heroSource = readFileSync(resolve(projectRoot, "components/home/HomeHero.tsx"), "utf8");
assert.match(heroSource, /useRef<FlashGeneratorHandle/);
assert.match(heroSource, /playerRef\.current\?\.activateOrReload\(\)/);
assert.doesNotMatch(heroSource, /useEffect/, "The Hero Play action must run directly from its event handler.");

const playerSource = readFileSync(resolve(projectRoot, "components/game-player/GamePlayer.tsx"), "utf8");
assert.match(playerSource, /dynamic\(\(\) => import\("\.\/adapters\/RuffleAdapter"\)/);
assert.match(playerSource, /activated && \(/);
assert.match(playerSource, /useImperativeHandle\(ref/);

const cssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
for (const className of [
  ".game-station.home-hero",
  ".home-hero-grid",
  ".home-hero-copy",
  ".home-hero-play",
  ".home-core-game-preview"
]) {
  assert.match(cssSource, new RegExp(className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.match(cssSource, /\.home-hero-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(340px, 0\.78fr\) minmax\(0, 1\.22fr\)/);
assert.match(cssSource, /@media \(max-width:\s*760px\)[\s\S]*?\.home-hero-play\s*\{[\s\S]*?display:\s*none/);
assert.match(cssSource, /\.home-hero \.home-game-player-card \.game-control-bar\s*\{[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(
  cssSource,
  /\.home-game-player-card \.flash-play-panel\s*\{[\s\S]*?right:\s*auto;[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translateX\(-50%\);[\s\S]*?\}/,
  "The mobile preview Play overlay must remain centered."
);
assert.match(
  cssSource,
  /\.home-game-player-card \.flash-cover:hover \.flash-play-panel\s*\{\s*transform:\s*translateY\(1px\);/,
  "Desktop hover must not shift the cover Play overlay sideways."
);
assert.match(
  cssSource,
  /@media \(max-width:\s*760px\)[\s\S]*?\.home-game-player-card \.flash-cover:hover \.flash-play-panel\s*\{\s*transform:\s*translate\(-50%, 1px\);/,
  "Mobile hover must preserve horizontal centering."
);

console.log("HOME-HERO-001 validation passed");
console.log("- exact H1/value copy, one core preview, and both Play entry points are present");
console.log("- the desktop Hero uses the accepted split layout and mobile hides the duplicate CTA");
console.log("- initial HTML contains no Ruffle/WASM/SWF and the heavy adapter remains conditional");
console.log("- the external Hero Play action controls the same GamePlayer instance directly");
