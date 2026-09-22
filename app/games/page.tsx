import CategoryChip from "@/components/game/CategoryChip";
import GameBreadcrumb from "@/components/game/GameBreadcrumb";
import GameGrid from "@/components/game/GameGrid";
import RecentlyPlayed from "@/components/game/RecentlyPlayed";
import FavoritesSection from "@/components/game/FavoritesSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { directoryEntryCount, resolveGamesDirectory } from "@/lib/games/directory";
import { gamesDirectoryPolicy } from "@/lib/games/directory-policy";
import { resolveRecentlyPlayedCandidates } from "@/lib/games/recently-played";
import { resolveFavoriteGames } from "@/lib/games/favorites";
import { buildGamesDirectoryStructuredData, gamesDirectoryMetadata } from "@/lib/seo/games-directory";
import { serializeGameStructuredData } from "@/lib/seo/game-structured-data";

export const metadata = gamesDirectoryMetadata;

const { games, onSiteGames, externalTools, categoryRoutes } = resolveGamesDirectory();
const recentlyPlayedCandidates = resolveRecentlyPlayedCandidates();
const favoriteCandidates = resolveFavoriteGames();

export default function GamesRoutePage() {
  return (
    <>
      {buildGamesDirectoryStructuredData(games).map((schema) => (
        <script key={String(schema["@type"])} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(schema) }} />
      ))}
      <SiteHeader />
      <main className="route-directory-shell" data-ad-eligible={gamesDirectoryPolicy.adEligible}>
        <GameBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Games" }]} reloadDocument />

        <header className="route-directory-hero">
          <p className="route-eyebrow">Avatar game directory</p>
          <h1>Avatar Games &amp; Face Makers</h1>
          <p>
            Choose an on-site avatar game or explore an external tool. Each card opens its own
            page with game information or source and access details.
          </p>
        </header>

        <RecentlyPlayed
          candidates={recentlyPlayedCandidates}
          variant="directory"
          nextHeadingSelector="#favorites-directory-heading, #on-site-games-heading"
        />

        <FavoritesSection candidates={favoriteCandidates} nextHeadingSelector="#on-site-games-heading" />

        <section className="route-directory-section" aria-labelledby="on-site-games-heading">
          <div className="route-section-heading">
            <div>
              <p className="route-eyebrow">Play here</p>
              <h2 id="on-site-games-heading">On-site avatar games</h2>
            </div>
            <span>{directoryEntryCount(onSiteGames.length)}</span>
          </div>
          <GameGrid games={onSiteGames} ariaLabel="On-site avatar games" actionLabel="Open game"
            emptyTitle="No on-site entries" reloadDocument />
        </section>

        {externalTools.length > 0 ? (
          <section className="route-directory-section" aria-labelledby="external-tools-heading">
            <div className="route-section-heading">
              <div>
                <p className="route-eyebrow">Clearly labeled</p>
                <h2 id="external-tools-heading">External avatar tools</h2>
              </div>
              <span>{directoryEntryCount(externalTools.length)}</span>
            </div>
            <p>Read the source and access details here before choosing to open the original site.</p>
            <GameGrid
              games={externalTools}
              ariaLabel="External avatar tools"
              actionLabel="View source and access details"
              reloadDocument
            />
          </section>
        ) : null}

        <section className="route-directory-section" aria-labelledby="browse-categories-heading">
          <div className="route-section-heading">
            <div>
              <p className="route-eyebrow">Browse by type</p>
              <h2 id="browse-categories-heading">Avatar game categories</h2>
            </div>
          </div>
          <p>Categories overlap: the same entry can appear in more than one group.</p>
          <div className="route-category-links">
            {categoryRoutes.map(({ category, games }) => (
              <CategoryChip category={category} gameCount={games.length} key={category.slug} reloadDocument />
            ))}
          </div>
        </section>

        <aside className="route-scope-note" aria-label="Directory scope">
          <strong>Focused collection</strong>
          <p>
            This directory stays centered on face, avatar, pixel, and character-creation experiences.
            Guides, gallery pages, and blog articles remain separate resources.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
