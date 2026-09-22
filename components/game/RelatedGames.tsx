import { gameCatalog } from "../../lib/games/catalog";
import type { GameRecord } from "../../lib/games/game-schema";
import { selectRelatedGames } from "../../lib/recommendations/related-games";
import type { GameCardVariant } from "./GameCard";
import GameGrid from "./GameGrid";

type RelatedGamesProps = {
  readonly game: GameRecord;
  readonly limit?: number;
  readonly records?: readonly GameRecord[];
  readonly variant?: GameCardVariant;
};

export default function RelatedGames({
  game,
  limit = 4,
  records = gameCatalog,
  variant = "default"
}: RelatedGamesProps) {
  const relatedGames = selectRelatedGames(game, records, limit).recommendations.map(({ game: related }) => related);

  if (relatedGames.length === 0) return null;

  const headingId = `related-games-${game.id}`;

  return (
    <section
      className={`related-games route-directory-section${variant === "detail-related" ? " game-detail-related" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="route-section-heading">
        <div>
          {variant === "detail-related" ? null : <p className="route-eyebrow">Continue exploring</p>}
          <h2 id={headingId}>Related avatar games</h2>
        </div>
      </div>
      <GameGrid games={relatedGames} ariaLabel={`Games related to ${game.name}`} variant={variant} />
    </section>
  );
}
