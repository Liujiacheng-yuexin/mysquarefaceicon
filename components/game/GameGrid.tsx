import type { GameRecord } from "../../lib/games/game-schema";
import EmptyState from "./EmptyState";
import GameCard, { type GameCardVariant } from "./GameCard";
import type { FavoriteToggleChangeHandler } from "./FavoriteToggle";

type GameGridProps = {
  readonly games: readonly GameRecord[];
  readonly ariaLabel?: string;
  readonly actionLabel?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly variant?: GameCardVariant;
  readonly reloadDocument?: boolean;
  readonly onFavoriteChange?: FavoriteToggleChangeHandler;
};

export default function GameGrid({
  games,
  ariaLabel,
  actionLabel,
  emptyTitle = "No games are available",
  emptyDescription = "This collection does not have a published game record yet.",
  variant = "default",
  reloadDocument = false,
  onFavoriteChange
}: GameGridProps) {
  if (games.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul
      className={`game-grid route-game-list${variant === "home-media" ? " game-grid-home-media" : ""}${
        variant === "detail-related" ? " game-grid-detail-related" : ""
      }`}
      aria-label={ariaLabel}
    >
      {games.map((game) => (
        <li key={game.id}>
          <GameCard
            game={game}
            actionLabel={actionLabel}
            variant={variant}
            reloadDocument={reloadDocument}
            onFavoriteChange={onFavoriteChange}
          />
        </li>
      ))}
    </ul>
  );
}
