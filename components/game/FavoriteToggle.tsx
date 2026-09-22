"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  getFavoritesSnapshot,
  parseFavorites,
  setFavorite,
  subscribeToFavorites
} from "../../lib/favorites";
import type { GamePageType } from "../../lib/games/game-schema";

export type FavoriteToggleChangeHandler = (gameId: string, isFavorite: boolean) => void;

type FavoriteToggleProps = {
  readonly gameId: string;
  readonly gameName: string;
  readonly pageType: GamePageType;
  readonly variant?: "card" | "detail";
  readonly showViewLink?: boolean;
  readonly onFavoriteChange?: FavoriteToggleChangeHandler;
};

export default function FavoriteToggle({
  gameId,
  gameName,
  pageType,
  variant = "card",
  showViewLink = false,
  onFavoriteChange
}: FavoriteToggleProps) {
  const snapshot = useSyncExternalStore(subscribeToFavorites, getFavoritesSnapshot, () => null);
  const isFavorite = parseFavorites(snapshot).includes(gameId);
  const [announcement, setAnnouncement] = useState("");
  const isExternal = pageType === "EXTERNAL_TOOL";
  const label = isExternal
    ? (isFavorite ? "Saved tool" : "Save tool")
    : (isFavorite ? "Favorited" : "Favorite");

  function handleToggle() {
    const result = setFavorite(gameId, !isFavorite);
    if (!result.ok) {
      setAnnouncement(`${gameName} could not be saved in this browser.`);
      return;
    }
    setAnnouncement(
      result.isFavorite ? `${gameName} saved to favorites.` : `${gameName} removed from favorites.`
    );
    onFavoriteChange?.(gameId, result.isFavorite);
  }

  return (
    <div className={`favorite-actions favorite-actions-${variant}`} data-favorite-actions>
      <button
        className={`favorite-toggle favorite-toggle-${variant}`}
        type="button"
        aria-label={`${label} ${gameName}`}
        aria-pressed={isFavorite}
        onClick={handleToggle}
        data-favorite-toggle
        data-game-id={gameId}
        data-game-page-type={pageType}
      >
        <Heart aria-hidden="true" size={18} fill={isFavorite ? "currentColor" : "none"} />
        <span>{label}</span>
      </button>
      {showViewLink ? <Link className="favorite-view-link" href="/games">View favorites</Link> : null}
      <span className="favorites-live" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
