import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { beforeFavoritesSource } from "./favorites-compat.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
const count = (value, needle) => value.split(needle).length - 1;

const hashes = {
  "components/FlashGenerator.tsx": ["76c5140008653dfd8bf2e34c461d250ab25517fa4b189a03bd93a65416ef3f16", "c443323031b15428a502ff4fcad3653ffc424ef75db9335b76883576f45ac794"],
  "components/game-player/GamePlayer.tsx": ["965107b002be63d29e8e70cfbcb573c6a19ac2c20ee26cc6eba52206ffcf16fb", "142cf22ac3a485c78285d920bbe84114f3931a38f0e9aec067bbf8ca2e562d5c"],
  "components/game/GameControls.tsx": ["d5bc71a4710e7ed171ef88d11a36be82a1e1eebe4c171130a9740a453ca6d0f0", "2a738d34297ad718e59a678ea9572d8c6cc981180e083e8fca7cb03e21c1b4da"],
  "lib/games/square-homepage.ts": ["319e298ea362613100410b5400f56765baf996aabb08abd03420d88cb862b6db", "ce7d111d8a4df65194394ed31468a43fac96c83da1f53c8761090f159efe3aa4"],
  "lib/games/oval-legacy-page.ts": ["39748eaa373f0f997237e86d3b96ace408d30ca3d00875836c2cec8cb699593c", "29a465e18d5a0520e1e4db970f7fa5b7b23b6022f317f890d31c8ba22efa4f79"],
  "components/home/HomeDiscoveryRegion.tsx": ["ee9cd5542b9573db6c16f443e7aa0fe209d479fe7da58887b7077cfed34204b2", "c7fb2ac8ea2e54ae2f4000217128434016b2875b846e9c830efb6e9d2df0dec0"],
  "app/games/page.tsx": ["14de6c9dc2e3eab53eaffb264c225e929ac99f9828d1fd2ad583c81c207a7409", "5c154f0c23e174f94b68ce7e705ae978f7ecb6ffab15d04fd1439e148234d3c5"],
  "app/privacy-policy/page.tsx": ["fce773f0aa2d14a915cde7a9efacd1369b3834eb8fb7d7100fcc6a02cfb4c1f4", "eba51fcadf3aa4e61506242d5d5fb1d9d4ac7d870626e7877670ae0984c7d1c4"],
  "app/globals.css": ["ba915d64081b80d6f166983c090f155f9434267b0ef844ed3074932c0a2993c6", "5b5e8d7253be79edbd479a01a53bf3f760d52482ced5f4c6edcd387975669867"],
  "package.json": ["56bb4a5cd9743882b38f1d51a3683829fc8cafb95f6ba223402294e6062c94cd", "fb680047b7f00a24ed1ffd928191e6c0eb63657a83a24094e013d0dab1a0a694"],
  "scripts/README.md": ["fcef3c53881348b5eb979c4ba7baf48a54a438fc5d1ae44910faa586471f6d81", "ebed6696b6ca8f096a9516c76ddfa369a5e664eb89a84d9f94784a053fd56e73"],
  "scripts/check-square-homepage.mjs": ["e042365fbbc450db03788800fab6416eacb5a93c097cb8c8cf74d9d0716da378", "b7539ae337c92971ff4545157110793a58b13052160111cf968057c0f5392f2b"],
  "scripts/check-oval-legacy-page.mjs": ["d19297fc1594791af5308eb87392be798bf28dd48201265455a02f964a92fe64", "0dea536cdd2e7728c0dccf8895a54052677ab7d6eb208aa85c42305318794e13"],
  "scripts/check-locale-rights.mjs": ["a1806d6a6c48ef796acfb6ebe0e6f0bb0e1e9be7651653fbf8abc5282f5fb9ab", "da5409558edfd5987e7e413878803e41d780b26b7b8185d823bbfcd50035182d"],
  "scripts/games-index-compat.mjs": ["ae10af65ad02f916dfce54eea5ca8a89ae202e0f64477f2d1dc56a4c80425510", "fc9b87e8c900d32b3058d4a023ff2e58374e173ddd932671ac7079093062ead9"]
};

function replaceOne(source, after, before, file) {
  assert.equal(count(source, after), 1, `${file}: approved RECENT-001 fragment missing or duplicated`);
  return source.replace(after, before);
}

export function beforeRecentlyPlayedSource(file, value) {
  value = beforeFavoritesSource(file, value);
  const expected = hashes[file];
  if (!expected) return value;
  let source = value.toString();
  if (sha(source) === expected[1]) return source;
  assert.equal(sha(source), expected[0], `${file}: unexpected RECENT-001 source change`);

  if (file === "components/FlashGenerator.tsx") {
    source = replaceOne(source, "export type FlashGeneratorProps = {\n  gameId: string;\n", "export type FlashGeneratorProps = {\n", file);
    source = replaceOne(source, "  {\n    gameId,\n    gameName", "  {\n    gameName", file);
    source = replaceOne(source, "    id: gameId,", "    id: `legacy-${gameName.toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/^-|-$/g, \"\")}`,", file);
  } else if (file === "components/game-player/GamePlayer.tsx") {
    source = replaceOne(source, 'import { recordRecentlyPlayed } from "../../lib/recently-played";\n', "", file);
    source = replaceOne(source, "  const hasStartedRef = useRef(false);\n", "", file);
    source = replaceOne(
      source,
      `
  const reload = useCallback(() => {
    setStatus({ state: "loading", message: model.labels.loading });
    if (hasStartedRef.current) {
      setInstanceKey((current) => current + 1);
    } else {
      hasStartedRef.current = true;
      setActivated(true);
      scheduleAdapterMountAfterPaint();
    }
  }, [model.labels.loading, scheduleAdapterMountAfterPaint]);
`,
      "",
      file
    );
    source = replaceOne(source, "              onClick={reload}\n", "              onClick={activateOrReload}\n", file);
    source = replaceOne(source, "        onReload={reload}\n", "", file);
    source = replaceOne(
      source,
      `  const activateOrReload = useCallback(() => {\n    setStatus({ state: "loading", message: model.labels.loading });\n    if (hasStartedRef.current) {\n      setInstanceKey((current) => current + 1);\n    } else {\n      hasStartedRef.current = true;\n      recordRecentlyPlayed(model.id);\n      setActivated(true);\n      scheduleAdapterMountAfterPaint();\n    }\n  }, [model.id, model.labels.loading, scheduleAdapterMountAfterPaint]);`,
      `  const activateOrReload = useCallback(() => {\n    setStatus({ state: "loading", message: model.labels.loading });\n    if (activated) {\n      setInstanceKey((current) => current + 1);\n    } else {\n      setActivated(true);\n      scheduleAdapterMountAfterPaint();\n    }\n  }, [activated, model.labels.loading, scheduleAdapterMountAfterPaint]);`,
      file
    );
  } else if (file === "components/game/GameControls.tsx") {
    source = replaceOne(source, "  readonly onReload?: () => void;\n", "", file);
    source = replaceOne(
      source,
      "  const { activated, fullscreenAvailable, onActivateOrReload, onReload, onToggleFullscreen } = props;",
      "  const { activated, fullscreenAvailable, onActivateOrReload, onToggleFullscreen } = props;",
      file
    );
    source = replaceOne(source, "onClick={onReload ?? onActivateOrReload}", "onClick={onActivateOrReload}", file);
  } else if (file === "lib/games/square-homepage.ts" || file === "lib/games/oval-legacy-page.ts") {
    const typeName = file.includes("square") ? "SquareHomepagePlayerProps" : "OvalLegacyPlayerProps";
    source = replaceOne(source, `export type ${typeName} = ${file.includes("square") ? "GameHomepageContent" : "GameLegacyPageContent"}["playerPresentation"] & {\n  readonly gameId: string;\n`, `export type ${typeName} = ${file.includes("square") ? "GameHomepageContent" : "GameLegacyPageContent"}["playerPresentation"] & {\n`, file);
    source = replaceOne(source, "  const player: " + typeName + " = {\n    gameId: game.id,\n", "  const player: " + typeName + " = {\n", file);
  } else if (file === "components/home/HomeDiscoveryRegion.tsx") {
    source = replaceOne(source, 'import RecentlyPlayed from "../game/RecentlyPlayed";\n', "", file);
    source = replaceOne(source, 'import { resolveRecentlyPlayedCandidates } from "../../lib/games/recently-played";\n', "", file);
    source = replaceOne(source, "\nconst recentlyPlayedCandidates = resolveRecentlyPlayedCandidates();\n", "", file);
    source = replaceOne(source,
      `  const nextHeadingSelector = featuredGames.length > 0\n    ? '[data-home-module="related"] h3'\n    : newGames.length > 0\n      ? '[data-home-module="new"] h3'\n      : '[data-home-module="categories"] h3';\n`,
      "",
      file
    );
    source = replaceOne(source,
      `\n        <RecentlyPlayed\n          candidates={recentlyPlayedCandidates}\n          variant="home"\n          nextHeadingSelector={nextHeadingSelector}\n        />\n`,
      "",
      file
    );
  } else if (file === "app/games/page.tsx") {
    source = replaceOne(source, 'import RecentlyPlayed from "@/components/game/RecentlyPlayed";\n', "", file);
    source = replaceOne(source, 'import { resolveRecentlyPlayedCandidates } from "@/lib/games/recently-played";\n', "", file);
    source = replaceOne(source, "const recentlyPlayedCandidates = resolveRecentlyPlayedCandidates();\n", "", file);
    source = replaceOne(source,
      `\n        <RecentlyPlayed\n          candidates={recentlyPlayedCandidates}\n          variant="directory"\n          nextHeadingSelector="#on-site-games-heading"\n        />\n`,
      "",
      file
    );
  } else if (file === "app/privacy-policy/page.tsx") {
    source = replaceOne(source, "Last updated: September 7, 2026", "Last updated: May 21, 2026", file);
    source = replaceOne(source,
      `      <p>\n        This browser may also save the stable ID and start time of recently played\n        games to show Continue Playing. You can remove that history with Clear\n        history, and it does not sync across devices.\n      </p>\n`,
      "",
      file
    );
  } else if (file === "app/globals.css") {
    const firstStart = source.indexOf(".recently-played-heading {");
    const firstEnd = source.indexOf(".home-category-list {", firstStart);
    assert.ok(firstStart >= 0 && firstEnd > firstStart, `${file}: approved desktop styles missing`);
    source = source.slice(0, firstStart) + source.slice(firstEnd);
    const mobileStart = source.indexOf("  .recently-played-heading {");
    const mobileEnd = source.indexOf("  .home-discovery-section .route-game-list,", mobileStart);
    assert.ok(mobileStart >= 0 && mobileEnd > mobileStart, `${file}: approved mobile styles missing`);
    source = source.slice(0, mobileStart) + source.slice(mobileEnd);
  } else if (file === "package.json") {
    source = replaceOne(source, '    "recent:check": "node scripts/run-recently-played-check.mjs",\n', "", file);
  } else if (file === "scripts/README.md") {
    source = replaceOne(source,
      "## RECENT-001 Recently Played check\n\n`npm run recent:check` compiles and runs the confirmed local-history contract. It covers versioned parsing, malformed data, duplicate/order/8-store/4-display limits, storage failures, isolated Clear behavior, published playable candidate filtering, Pixel External exclusion, real Square/Oval/future Game Data IDs, first-Play-only recording, empty server output, homepage and `/games` placement, focus recovery, and the Privacy disclosure. It performs no network writes and does not prove browser layout, production behavior, rights, or release approval.\n\n",
      "",
      file
    );
  } else if (file === "scripts/check-square-homepage.mjs") {
    source = replaceOne(source, 'import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";\n', "", file);
    source = replaceOne(
      source,
      'const read = file => beforeRecentlyPlayedSource(file, readFileSync(resolve(root, file), "utf8"));',
      'const read = file => readFileSync(resolve(root, file), "utf8");',
      file
    );
  } else if (file === "scripts/check-oval-legacy-page.mjs") {
    source = replaceOne(source, 'import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";\n', "", file);
    source = replaceOne(
      source,
      'const read = file => beforeRecentlyPlayedSource(file, readFileSync(resolve(root, file), "utf8").replace(/\\r\\n/g, "\\n"));',
      'const read = file => readFileSync(resolve(root, file), "utf8").replace(/\\r\\n/g, "\\n");',
      file
    );
  } else if (file === "scripts/check-locale-rights.mjs") {
    source = replaceOne(source, 'import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";\n', "", file);
    source = replaceOne(
      source,
      'const read = (file) => beforeRecentlyPlayedSource(file, readFileSync(resolve(projectRoot, file), "utf8"));',
      'const read = (file) => readFileSync(resolve(projectRoot, file), "utf8");',
      file
    );
  } else if (file === "scripts/games-index-compat.mjs") {
    source = replaceOne(source, 'import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";\n', "", file);
    source = replaceOne(source, "  value = beforeRecentlyPlayedSource(file, value);\n", "", file);
  }

  assert.equal(sha(source), expected[1], `${file}: change outside confirmed RECENT-001 scope`);
  return source;
}
