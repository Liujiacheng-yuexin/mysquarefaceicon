import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import GameLink from "./GameLink";
import FavoriteToggle, { type FavoriteToggleChangeHandler } from "./FavoriteToggle";
import type { GameRecord } from "../../lib/games/game-schema";
import { getGameImage } from "../../lib/games/game-images";
import { getPublicGameHref } from "../../lib/games/routes";

export type GameCardVariant = "default" | "home-media" | "detail-related";

type GameCardProps = {
  readonly game: GameRecord;
  readonly actionLabel?: string;
  readonly variant?: GameCardVariant;
  readonly reloadDocument?: boolean;
  readonly onFavoriteChange?: FavoriteToggleChangeHandler;
};

function getDefaultActionLabel(game: GameRecord) {
  return game.pageType === "EXTERNAL_TOOL" ? "View access details" : "Open game";
}

export default function GameCard({
  game,
  actionLabel,
  variant = "default",
  reloadDocument = false,
  onFavoriteChange
}: GameCardProps) {
  const isExternal = game.pageType === "EXTERNAL_TOOL";
  const resolvedActionLabel = actionLabel ?? getDefaultActionLabel(game);

  if (variant === "default") {
    return (
      <div className="favoritable-game-card">
        <GameLink
          className={`game-list-card route-game-link${isExternal ? " route-game-link-external" : ""}`}
          href={getPublicGameHref(game)}
          reloadDocument={reloadDocument}
          data-game-id={game.id}
          data-game-page-type={game.pageType}
        >
          <span className="route-game-type">{isExternal ? "External tool" : "Browser game"}</span>
          <strong>{game.name}</strong>
          <span>{game.content.summary}</span>
          <span className="route-card-action">{resolvedActionLabel}</span>
        </GameLink>
        <FavoriteToggle
          gameId={game.id}
          gameName={game.name}
          pageType={game.pageType}
          onFavoriteChange={onFavoriteChange}
        />
      </div>
    );
  }

  const thumbnail = getGameImage(game, "THUMBNAIL");

  if (variant === "detail-related") {
    return (
      <div className="favoritable-game-card">
        <GameLink
          className={`game-list-card route-game-link game-list-card-detail-related${
            isExternal ? " route-game-link-external" : ""
          }${thumbnail ? "" : " game-list-card-without-media"}`}
          href={getPublicGameHref(game)}
          reloadDocument={reloadDocument}
          data-game-id={game.id}
          data-game-page-type={game.pageType}
          data-game-card-variant="detail-related"
        >
          {thumbnail ? (
            <span className="game-detail-related-media">
              <Image
                src={thumbnail.src}
                alt={thumbnail.alt}
                width={thumbnail.width}
                height={thumbnail.height}
                sizes="(max-width: 430px) 96px, 88px"
                loading="lazy"
              />
            </span>
          ) : null}
          <span className="game-detail-related-copy">
            <strong>{game.name}</strong>
            <span className={`route-game-type${isExternal ? " route-game-type-external" : ""}`}>
              {isExternal ? <ExternalLink aria-hidden="true" size={15} strokeWidth={2.2} /> : null}
              {isExternal ? "External tool" : "Browser game"}
            </span>
            <span className="game-detail-related-summary">{game.content.summary}</span>
          </span>
          <span className="game-detail-related-action">
            {resolvedActionLabel}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
          </span>
        </GameLink>
        <FavoriteToggle
          gameId={game.id}
          gameName={game.name}
          pageType={game.pageType}
          onFavoriteChange={onFavoriteChange}
        />
      </div>
    );
  }

  return (
    <div className="favoritable-game-card">
      <GameLink
        className={`game-list-card route-game-link game-list-card-home-media${
          isExternal ? " route-game-link-external" : ""
        }${thumbnail ? "" : " game-list-card-without-media"}`}
        href={getPublicGameHref(game)}
        reloadDocument={reloadDocument}
        data-game-id={game.id}
        data-game-page-type={game.pageType}
        data-game-card-variant="home-media"
      >
        {thumbnail ? (
          <span className="home-game-card-media">
            <Image
              src={thumbnail.src}
              alt={thumbnail.alt}
              width={thumbnail.width}
              height={thumbnail.height}
              sizes="(max-width: 430px) 88px, (max-width: 760px) 96px, (max-width: 1100px) 140px, 180px"
              loading="lazy"
            />
          </span>
        ) : null}
        <span className="home-game-card-copy">
          <span className={`route-game-type${isExternal ? " route-game-type-external" : ""}`}>
            {isExternal ? <ExternalLink aria-hidden="true" size={14} strokeWidth={2.2} /> : null}
            {isExternal ? "External tool" : "Browser game"}
          </span>
          <strong>{game.name}</strong>
          <span className="home-game-card-summary">{game.content.summary}</span>
          <span className="route-card-action">
            {resolvedActionLabel}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
          </span>
        </span>
      </GameLink>
      <FavoriteToggle
        gameId={game.id}
        gameName={game.name}
        pageType={game.pageType}
        onFavoriteChange={onFavoriteChange}
      />
    </div>
  );
}
