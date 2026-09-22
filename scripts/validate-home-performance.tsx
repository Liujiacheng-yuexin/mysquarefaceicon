import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  throw new Error("PERF-HOME-001 requires the Square record to use the click-to-load RUFFLE_SWF adapter.");
}

assert.equal(player.clickToLoad, true, "The Square player must remain explicitly click-to-load.");

const cover = squareFaceGame.images.find((image) => image.role === "PLAYER_PREVIEW");
assert.ok(cover, "The Square record must provide a stable first-viewport cover.");
assert.equal(cover.src, "/games/square-face-cover.png");
assert.equal(cover.width, 970);
assert.equal(cover.height, 844);
assert.equal(cover.provenance, "PROJECT_ASSET");

const coverBytes = readFileSync(resolve(projectRoot, "public/games/square-face-cover.png"));
assert.equal(coverBytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "The local cover must be a PNG.");
assert.equal(
  createHash("sha256").update(coverBytes).digest("hex").toUpperCase(),
  "15A5C93F79859441EEF3032CE45E07ABC2E91A7520A9AAEF42158DD4FE00A535",
  "The local cover must remain byte-identical to the recorded project-CDN asset."
);

const renderWarnings: string[] = [];
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => renderWarnings.push(args.map(String).join(" "));
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
assert.match(markup, /src="\/games\/square-face-cover\.png"/);
assert.match(markup, /width="970" height="844"/);
assert.match(markup, /loading="eager"/);
assert.match(markup, /fetchPriority="high"/);
assert.match(markup, /data-player-activated="false"/);
assert.match(markup, /data-player-adapter-mounted="false"/);
assert.match(markup, /data-player-activation-phase="idle"/);
assert.match(markup, /data-player-state="idle"/);
assert.match(markup, /data-player-surface="true"/);
assert.match(markup, /data-player-preview="true"/);
assert.match(markup, /aria-busy="false"/);
assert.doesNotMatch(markup, /static\.mysquarefaceicon\.com/i, "The LCP cover must not require the project CDN.");
assert.doesNotMatch(
  markup,
  /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i,
  "Initial HTML must not contain a Ruffle runtime, WASM, or SWF request."
);

const gamePlayerSource = readFileSync(resolve(projectRoot, "components/game-player/GamePlayer.tsx"), "utf8");
assert.match(gamePlayerSource, /dynamic\(\(\) => import\("\.\/adapters\/RuffleAdapter"\)/);
assert.match(gamePlayerSource, /ssr:\s*false/);
assert.doesNotMatch(gamePlayerSource, /import RuffleAdapter from/, "Ruffle must not return to the static client graph.");
assert.match(gamePlayerSource, /\{adapterMounted && \(\s*<PlayableAdapter/);
assert.match(gamePlayerSource, /!activated && \(\s*<button[\s\S]*?data-player-preview/);
assert.match(gamePlayerSource, /activated && status\.state === "loading"[\s\S]*?data-player-loading/);
assert.match(gamePlayerSource, /data-player-activation-phase=\{!activated \? "idle" : adapterMounted \? "adapter-mounted" : "loading-visible"\}/);
assert.match(
  gamePlayerSource,
  /scheduleAdapterMountAfterPaint[\s\S]*?window\.requestAnimationFrame\(\(\) => \{[\s\S]*?window\.requestAnimationFrame\(\(\) => \{[\s\S]*?setAdapterMounted\(true\)/,
  "The visible loading response must receive a paint opportunity before adapter mounting begins."
);
const activationHandlerStart = gamePlayerSource.indexOf("const activateOrReload");
const activationHandler = gamePlayerSource.slice(
  activationHandlerStart,
  gamePlayerSource.indexOf("useImperativeHandle", activationHandlerStart)
);
assert.ok(
  activationHandler.indexOf("setStatus") < activationHandler.indexOf("setActivated(true)"),
  "The urgent loading status must be queued before activation."
);
assert.ok(
  activationHandler.indexOf("setActivated(true)") < activationHandler.indexOf("scheduleAdapterMountAfterPaint()"),
  "The visible loading phase must be activated before adapter mounting is scheduled."
);

const ruffleAdapterSource = readFileSync(
  resolve(projectRoot, "components/game-player/adapters/RuffleAdapter.tsx"),
  "utf8"
);
assert.match(ruffleAdapterSource, /useEffect\(\(\) => \{/);
assert.match(ruffleAdapterSource, /const ruffle = await loadRuffleRuntime\(\)/);
assert.match(ruffleAdapterSource, /player\.load\(\{[\s\S]*?url:\s*source/);

const cssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
assert.match(
  cssSource,
  /\.flash-player\s*\{[\s\S]*?position:\s*relative;[\s\S]*?aspect-ratio:\s*var\(--flash-aspect-ratio, 690 \/ 600\);[\s\S]*?overflow:\s*hidden;/
);
assert.match(cssSource, /\.ruffle-mount\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;/);
assert.match(cssSource, /\.flash-cover\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;/);

const serviceWorkerSource = readFileSync(resolve(projectRoot, "public/sw.js"), "utf8");
const coreAssets = serviceWorkerSource.match(/const CORE_ASSETS = \[([\s\S]*?)\];/)?.[1] ?? "";
assert.doesNotMatch(coreAssets, /ruffle|\.swf/i, "Service-worker install must not prefetch runtime or SWF assets.");

console.log("PERF-HOME-001 validation passed");
console.log("- the LCP cover is a byte-verified local project asset with truthful intrinsic dimensions");
console.log("- initial HTML contains no Ruffle runtime, WASM, or SWF request");
console.log("- Ruffle remains conditional on activation and preview/loading/runtime share one reserved surface");
console.log("- the loading response is committed before the dynamic adapter mounts after a paint opportunity");
console.log("- the service-worker install list does not prefetch Ruffle or SWF assets");
