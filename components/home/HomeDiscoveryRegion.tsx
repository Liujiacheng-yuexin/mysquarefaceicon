import CategoryChip from "../game/CategoryChip";
import GameGrid from "../game/GameGrid";
import RecentlyPlayed from "../game/RecentlyPlayed";
import type { CategoryRoute } from "../../lib/games/routes";
import type { GameRecord } from "../../lib/games/game-schema";
import { resolveRecentlyPlayedCandidates } from "../../lib/games/recently-played";

type HomeDiscoveryRegionProps = {
  readonly featuredGames: readonly GameRecord[];
  readonly newGames: readonly GameRecord[];
  readonly categories: readonly CategoryRoute[];
};

const recentlyPlayedCandidates = resolveRecentlyPlayedCandidates();

export default function HomeDiscoveryRegion({ featuredGames, newGames, categories }: HomeDiscoveryRegionProps) {
  if (featuredGames.length === 0 && newGames.length === 0 && categories.length === 0) return null;
  const nextHeadingSelector = featuredGames.length > 0
    ? '[data-home-module="related"] h3'
    : newGames.length > 0
      ? '[data-home-module="new"] h3'
      : '[data-home-module="categories"] h3';

  return (
    <section
      className="home-discovery-section"
      aria-labelledby="home-discovery-title"
      data-home-section="discovery"
    >
      <div className="home-discovery-inner">
        <header className="home-discovery-intro">
          <h2 id="home-discovery-title">Discover More Avatar Games</h2>
          <p>Continue with related face, avatar, and pixel creator experiences after playing the Square game.</p>
        </header>

        <RecentlyPlayed
          candidates={recentlyPlayedCandidates}
          variant="home"
          nextHeadingSelector={nextHeadingSelector}
        />

        {featuredGames.length > 0 ? (
          <div className="home-discovery-panel" data-home-module="related">
            <div className="home-discovery-heading">
              <h3>Related Avatar Games</h3>
              <p>Matched from published games that share avatar categories or tags with Square Face Generator.</p>
            </div>
            <GameGrid games={featuredGames} ariaLabel="Related avatar games" variant="home-media" />
          </div>
        ) : null}

        {newGames.length > 0 ? (
          <div className="home-discovery-panel" data-home-module="new">
            <div className="home-discovery-heading">
              <h3>New Games</h3>
            </div>
            <GameGrid games={newGames} ariaLabel="New avatar games" variant="home-media" />
          </div>
        ) : null}

        {categories.length > 0 ? (
          <div className="home-discovery-panel" data-home-module="categories">
            <div className="home-discovery-heading">
              <h3>Browse by Category</h3>
              <p>Only categories with a current published game record are shown.</p>
            </div>
            <nav className="home-category-list route-category-links" aria-label="Avatar game categories">
              {categories.map(({ category, games }) => (
                <CategoryChip
                  category={category}
                  gameCount={games.length}
                  key={category.slug}
                  variant="home-discovery"
                />
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </section>
  );
}
