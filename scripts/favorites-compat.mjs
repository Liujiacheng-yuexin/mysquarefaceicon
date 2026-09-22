import assert from "node:assert/strict";
import { beforeRuffleSource } from "./ruffle-compat.mjs";

const count = (value, needle) => value.split(needle).length - 1;

function replaceOne(source, after, before, file) {
  assert.equal(count(source, after), 1, `${file}: approved FAV-001 fragment missing or duplicated`);
  return source.replace(after, before);
}

function removeFavoriteToggleBlocks(source, expected, file) {
  let removed = 0;
  source = source.replace(/^([ ]*)<FavoriteToggle\n(?:[ ]+.*\n)*?\1\/>\n/gm, () => {
    removed++;
    return "";
  });
  assert.equal(removed, expected, `${file}: expected ${expected} FAV-001 toggle blocks`);
  return source;
}

function unwrapGameCardSource(source, expected, file) {
  let unwrapped = 0;
  source = source.replace(/^([ ]*)<div className="favoritable-game-card">\n([\s\S]*?)^\1<\/div>/gm, (_, indent, content) => {
    unwrapped++;
    return content.replace(/^  /gm, "").replace(/\n$/, "");
  });
  assert.equal(unwrapped, expected, `${file}: expected ${expected} FAV-001 card wrappers`);
  return source;
}

// Remove only the confirmed FAV-001 source additions before immutable older
// task hashes run. The downstream goldens still reject unrelated changes.
export function beforeFavoritesSource(file, value) {
  value = beforeRuffleSource(file, value);
  let source = value.toString();
  const markers = {
    "components/game/GameCard.tsx": 'import FavoriteToggle, { type FavoriteToggleChangeHandler }',
    "components/game/GameGrid.tsx": 'import type { FavoriteToggleChangeHandler }',
    "components/game/RecentlyPlayed.tsx": 'import FavoriteToggle from "./FavoriteToggle";',
    "components/home/HomeHero.tsx": 'import FavoriteToggle from "../game/FavoriteToggle";',
    "components/game/GameDetailTemplate.tsx": 'import FavoriteToggle from "./FavoriteToggle";',
    "app/games/page.tsx": 'import FavoritesSection from "@/components/game/FavoritesSection";',
    "app/privacy-policy/page.tsx": "If you use Favorite or Save tool",
    "app/oval-face-icon-generator/page.tsx": 'import FavoriteToggle from "@/components/game/FavoriteToggle";',
    "app/pixel-art-avatar-icon-generator/page.tsx": 'import FavoriteToggle from "@/components/game/FavoriteToggle";',
    "app/globals.css": "/* FAV-001: browser-local favorites without nested interactive controls */",
    "package.json": '"favorites:check":',
    "scripts/README.md": "## FAV-001 Favorites check",
    "scripts/validate-game-components.tsx": 'import { beforeFavoritesMarkup } from "./favorites-markup-compat";',
    "scripts/validate-home-information-architecture.tsx": 'import { beforeFavoritesMarkup } from "./favorites-markup-compat";',
    "scripts/check-games-index.mjs": 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";',
    "scripts/check-category-sample.mjs": 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";',
    "scripts/check-category-remaining.mjs": 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";'
  };
  const marker = markers[file];
  if (!marker) return value;
  if (!source.includes(marker)) return source;
  source = source.replace(/\r\n/g, "\n");

  if (file === "components/game/GameCard.tsx") {
    source = replaceOne(source, 'import FavoriteToggle, { type FavoriteToggleChangeHandler } from "./FavoriteToggle";\n', "", file);
    source = replaceOne(source, "  readonly onFavoriteChange?: FavoriteToggleChangeHandler;\n", "", file);
    source = replaceOne(
      source,
      'export default function GameCard({\n  game,\n  actionLabel,\n  variant = "default",\n  reloadDocument = false,\n  onFavoriteChange\n}: GameCardProps) {',
      'export default function GameCard({ game, actionLabel, variant = "default", reloadDocument = false }: GameCardProps) {',
      file
    );
    source = removeFavoriteToggleBlocks(source, 3, file);
    return unwrapGameCardSource(source, 3, file);
  }

  if (file === "components/game/GameGrid.tsx") {
    source = replaceOne(source, 'import type { FavoriteToggleChangeHandler } from "./FavoriteToggle";\n', "", file);
    source = replaceOne(source, "  readonly onFavoriteChange?: FavoriteToggleChangeHandler;\n", "", file);
    source = replaceOne(source, "  reloadDocument = false,\n  onFavoriteChange\n", "  reloadDocument = false\n", file);
    return replaceOne(
      source,
      `          <GameCard
            game={game}
            actionLabel={actionLabel}
            variant={variant}
            reloadDocument={reloadDocument}
            onFavoriteChange={onFavoriteChange}
          />`,
      "          <GameCard game={game} actionLabel={actionLabel} variant={variant} reloadDocument={reloadDocument} />",
      file
    );
  }

  if (file === "components/game/RecentlyPlayed.tsx") {
    source = replaceOne(source, 'import FavoriteToggle from "./FavoriteToggle";\n', "", file);
    return replaceOne(
      source,
      `  return (
    <div className="favoritable-game-card">
      {reloadDocument ? (
        <a {...attributes} href={candidate.href} data-navigation="document">{content}</a>
      ) : (
        <Link {...attributes} href={candidate.href}>{content}</Link>
      )}
      <FavoriteToggle gameId={candidate.gameId} gameName={candidate.name} pageType="GAME" />
    </div>
  );`,
      `  return reloadDocument ? (
    <a {...attributes} href={candidate.href} data-navigation="document">{content}</a>
  ) : (
    <Link {...attributes} href={candidate.href}>{content}</Link>
  );`,
      file
    );
  }

  if (file === "components/home/HomeHero.tsx") {
    source = replaceOne(source, 'import FavoriteToggle from "../game/FavoriteToggle";\n', "", file);
    return replaceOne(
      source,
      `          <div className="home-hero-actions" aria-label="Game actions">
            <button
              className="home-hero-play"
              type="button"
              aria-controls={corePreviewId}
              onClick={handleHeroPlay}
              data-home-hero-play
            >
              <Play aria-hidden="true" size={24} />
              {player.startLabel}
            </button>
            <FavoriteToggle
              gameId={player.gameId}
              gameName="Square Face Generator"
              pageType="GAME"
              variant="detail"
              showViewLink
            />
          </div>`,
      `          <button
            className="home-hero-play"
            type="button"
            aria-controls={corePreviewId}
            onClick={handleHeroPlay}
            data-home-hero-play
          >
            <Play aria-hidden="true" size={24} />
            {player.startLabel}
          </button>`,
      file
    );
  }

  if (file === "components/game/GameDetailTemplate.tsx") {
    source = replaceOne(source, 'import FavoriteToggle from "./FavoriteToggle";\n', "", file);
    return replaceOne(
      source,
      `          <FavoriteToggle
            gameId={game.id}
            gameName={game.name}
            pageType={game.pageType}
            variant="detail"
            showViewLink
          />
`,
      "",
      file
    );
  }

  if (file === "app/games/page.tsx") {
    source = replaceOne(source, 'import FavoritesSection from "@/components/game/FavoritesSection";\n', "", file);
    source = replaceOne(source, 'import { resolveFavoriteGames } from "@/lib/games/favorites";\n', "", file);
    source = replaceOne(source, "const favoriteCandidates = resolveFavoriteGames();\n", "", file);
    source = replaceOne(source, '          nextHeadingSelector="#favorites-directory-heading, #on-site-games-heading"', '          nextHeadingSelector="#on-site-games-heading"', file);
    return replaceOne(source, '\n        <FavoritesSection candidates={favoriteCandidates} nextHeadingSelector="#on-site-games-heading" />\n', "", file);
  }

  if (file === "app/privacy-policy/page.tsx") {
    return replaceOne(
      source,
      `      <p>
        If you use Favorite or Save tool, this browser stores only stable game IDs
        so it can show your saved games and tools on the Games page. Favorites do
        not contain account or personal information and do not sync across devices.
        Press the Favorited or Saved tool button again to remove an item, or clear
        this site&apos;s stored data in your browser settings.
      </p>
`,
      "",
      file
    );
  }

  if (file === "app/oval-face-icon-generator/page.tsx") {
    source = replaceOne(source, 'import FavoriteToggle from "@/components/game/FavoriteToggle";\n', "", file);
    source = replaceOne(
      source,
      `                <FavoriteToggle
                  gameId={ovalFaceGame.id}
                  gameName={ovalFaceGame.name}
                  pageType={ovalFaceGame.pageType}
                  variant="detail"
                  showViewLink
                />
`,
      "",
      file
    );
    return replaceOne(
      source,
      `                <div className="favoritable-game-card favoritable-related-card" key={item.gameId}>
                  <a
                    className={\`related-card\${item.external ? " route-game-link-external" : ""}\`}
                    data-game-id={item.gameId}
                    data-game-page-type={item.external ? "EXTERNAL_TOOL" : "GAME"}
                    href={item.href}
                  >
                    <Sparkles aria-hidden="true" size={20} />
                    {item.external ? <span className="route-game-type">External tool</span> : null}
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.external ? <span className="route-card-action">View access details</span> : null}
                  </a>
                  <FavoriteToggle
                    gameId={item.gameId}
                    gameName={item.title}
                    pageType={item.external ? "EXTERNAL_TOOL" : "GAME"}
                  />
                </div>`,
      `                <a
                  className={\`related-card\${item.external ? " route-game-link-external" : ""}\`}
                  data-game-id={item.gameId}
                  data-game-page-type={item.external ? "EXTERNAL_TOOL" : "GAME"}
                  href={item.href}
                  key={item.gameId}
                >
                  <Sparkles aria-hidden="true" size={20} />
                  {item.external ? <span className="route-game-type">External tool</span> : null}
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.external ? <span className="route-card-action">View access details</span> : null}
                </a>`,
      file
    );
  }

  if (file === "app/pixel-art-avatar-icon-generator/page.tsx") {
    source = replaceOne(source, 'import FavoriteToggle from "@/components/game/FavoriteToggle";\n', "", file);
    source = replaceOne(
      source,
      `                <FavoriteToggle
                  gameId={pixelArtAvatarGame.id}
                  gameName={pixelArtAvatarGame.name}
                  pageType={pixelArtAvatarGame.pageType}
                  variant="detail"
                  showViewLink
                />
`,
      "",
      file
    );
    return replaceOne(
      source,
      `              <div className="favoritable-game-card favoritable-related-card" key={game.id}>
                <a
                  className="related-card"
                  data-game-id={game.id}
                  data-game-page-type={game.pageType}
                  href={getPublicGameHref(game)}
                >
                  <Sparkles aria-hidden="true" size={20} />
                  <h3>{copy.title}</h3>
                  <p>{copy.text}</p>
                </a>
                <FavoriteToggle gameId={game.id} gameName={copy.title} pageType={game.pageType} />
              </div>`,
      `              <a
                className="related-card"
                data-game-id={game.id}
                data-game-page-type={game.pageType}
                href={getPublicGameHref(game)}
                key={game.id}
              >
                <Sparkles aria-hidden="true" size={20} />
                <h3>{copy.title}</h3>
                <p>{copy.text}</p>
              </a>`,
      file
    );
  }

  if (file === "app/globals.css") {
    const start = source.indexOf("/* FAV-001: browser-local favorites without nested interactive controls */");
    const end = source.indexOf(".home-category-list {", start);
    assert.ok(start >= 0 && end > start, `${file}: approved FAV-001 style block missing`);
    source = source.slice(0, start) + "\n" + source.slice(end);
    source = replaceOne(source, `
  .hero-actions > .favorite-actions,
  .hero-actions > .favorite-actions .favorite-toggle,
  .hero-actions > .favorite-actions .favorite-view-link {
    width: 100%;
  }
`, "", file);
    return replaceOne(source, `
  .home-hero-actions {
    align-items: stretch;
  }

  .home-hero-actions > .favorite-actions,
  .home-hero-actions .favorite-toggle,
  .home-hero-actions .favorite-view-link {
    width: 100%;
  }
`, "", file);
  }

  if (file === "package.json") {
    return replaceOne(source, '    "favorites:check": "node scripts/run-favorites-check.mjs",\n', "", file);
  }

  if (file === "scripts/README.md") {
    return replaceOne(source, "## FAV-001 Favorites check\n\n`npm run favorites:check` compiles and runs the confirmed browser-local favorites contract. It covers versioned parsing, malformed data, duplicate/newest-first/50-item limits, storage failures, isolation from Recently Played, published Game Data eligibility including Pixel External, non-nested card controls, unselected SSR, `/games` placement and removal focus target, detail CTA order, Privacy disclosure, 44px controls, and the no-network boundary. It does not prove production behavior, third-party rights, visual quality, or release approval.\n\n", "", file);
  }

  if (file === "scripts/validate-game-components.tsx") {
    source = replaceOne(source, 'import { beforeFavoritesMarkup } from "./favorites-markup-compat";\n', "", file);
    source = replaceOne(source, "const gameCardMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<GameCard game={squareFaceGame} />));", "const gameCardMarkup = renderToStaticMarkup(<GameCard game={squareFaceGame} />);", file);
    source = replaceOne(source, "const externalCardMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<GameCard game={pixelArtAvatarGame} />));", "const externalCardMarkup = renderToStaticMarkup(<GameCard game={pixelArtAvatarGame} />);", file);
    source = replaceOne(source, "const gridMarkup = beforeFavoritesMarkup(renderToStaticMarkup(\n", "const gridMarkup = renderToStaticMarkup(\n", file);
    source = replaceOne(source, "\n));\nassert.equal((gridMarkup.match(/data-game-id=/g) ?? []).length, 3);", "\n);\nassert.equal((gridMarkup.match(/data-game-id=/g) ?? []).length, 3);", file);
    return replaceOne(source, "const relatedMarkup = beforeFavoritesMarkup(renderToStaticMarkup(<RelatedGames game={squareFaceGame} />));", "const relatedMarkup = renderToStaticMarkup(<RelatedGames game={squareFaceGame} />);", file);
  }

  if (file === "scripts/validate-home-information-architecture.tsx") {
    source = replaceOne(source, 'import { beforeFavoritesMarkup } from "./favorites-markup-compat";\n', "", file);
    source = replaceOne(source, "const discoveryMarkup = beforeFavoritesMarkup(renderToStaticMarkup(\n", "const discoveryMarkup = renderToStaticMarkup(\n", file);
    return replaceOne(source, "\n));\nassert.match(discoveryMarkup, /data-home-section=", "\n);\nassert.match(discoveryMarkup, /data-home-section=", file);
  }

  if (file === "scripts/check-games-index.mjs") {
    source = replaceOne(source, 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";\n', "", file);
    return replaceOne(source, "  html = beforeFavoritesMarkup(html);\n", "", file);
  }

  if (file === "scripts/check-category-sample.mjs") {
    source = replaceOne(source, 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";\n', "", file);
    assert.equal(count(source, "  html = beforeFavoritesMarkup(html);\n"), 2, `${file}: expected two markup compatibility calls`);
    return source.replaceAll("  html = beforeFavoritesMarkup(html);\n", "");
  }

  if (file === "scripts/check-category-remaining.mjs") {
    source = replaceOne(source, 'import { beforeFavoritesMarkup } from "./favorites-compat.mjs";\n', "", file);
    source = replaceOne(source, "  html = beforeFavoritesMarkup(html);\n", "", file);
    source = replaceOne(source, "  const legacyHtml = beforeFavoritesMarkup(html);\n", "", file);
    source = replaceOne(source, "  same(sha(legacyHtml), contract.categories[slug].afterSsrSha256,", "  same(sha(html), contract.categories[slug].afterSsrSha256,", file);
    source = replaceOne(source, "  same(sha(beforeCategoryRemainingMarkup(legacyHtml, slug)),", "  same(sha(beforeCategoryRemainingMarkup(html, slug)),", file);
    source = replaceOne(source, "same((body(beforeFavoritesMarkup(html)).match(/data-game-id=/g) ?? []).length,", "same((body(html).match(/data-game-id=/g) ?? []).length,", file);
    return replaceOne(source, "beforeCategoryRemainingMarkup(beforeFavoritesMarkup(html.replace(copy[slug].heading, \"Unexpected\")), slug)", "beforeCategoryRemainingMarkup(html.replace(copy[slug].heading, \"Unexpected\"), slug)", file);
  }

  return source;
}

// Remove only FAV-001 controls/wrappers from current SSR before older task
// snapshots run. This does not normalize card copy, links, ordering, or SEO.
export function beforeFavoritesMarkup(value) {
  let html = value.toString();
  html = html.replace(/<span class="favorites-live" aria-live="polite" aria-atomic="true"><\/span>/g, "");
  html = html.replace(/<div class="favorite-actions favorite-actions-detail" data-favorite-actions="true">[\s\S]*?<\/div>/g, "");
  html = html.replace(/<div class="favoritable-game-card(?: favoritable-related-card)?">(<a\b[\s\S]*?<\/a>)<div class="favorite-actions favorite-actions-card" data-favorite-actions="true">[\s\S]*?<\/div><\/div>/g, "$1");
  html = html.replace(/<div class="home-hero-actions" aria-label="Game actions">([\s\S]*?)<\/div>/g, "$1");
  return html;
}
