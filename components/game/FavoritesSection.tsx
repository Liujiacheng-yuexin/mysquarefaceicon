"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  getFavoritesSnapshot,
  parseFavorites,
  subscribeToFavorites
} from "../../lib/favorites";
import { selectFavoriteGames } from "../../lib/games/favorites";
import type { GameRecord } from "../../lib/games/game-schema";
import GameGrid from "./GameGrid";

type FavoritesSectionProps = {
  readonly candidates: readonly GameRecord[];
  readonly nextHeadingSelector: string;
};

function focusHeading(selector: string) {
  const heading = document.querySelector<HTMLElement>(selector);
  if (!heading) return;
  const previousTabIndex = heading.getAttribute("tabindex");
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
  heading.addEventListener("blur", () => {
    if (previousTabIndex === null) heading.removeAttribute("tabindex");
    else heading.setAttribute("tabindex", previousTabIndex);
  }, { once: true });
}

export default function FavoritesSection({ candidates, nextHeadingSelector }: FavoritesSectionProps) {
  const snapshot = useSyncExternalStore(subscribeToFavorites, getFavoritesSnapshot, () => null);
  const games = useMemo(
    () => selectFavoriteGames(parseFavorites(snapshot), candidates),
    [candidates, snapshot]
  );
  const [announcement, setAnnouncement] = useState("");
  const pendingFocusId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (pendingFocusId.current === undefined) return;
    const targetId = pendingFocusId.current;
    pendingFocusId.current = undefined;
    if (targetId) {
      document.querySelector<HTMLButtonElement>(
        `[data-directory-module="favorites"] [data-favorite-toggle][data-game-id="${targetId}"]`
      )?.focus({ preventScroll: true });
      return;
    }
    focusHeading(nextHeadingSelector);
  }, [games, nextHeadingSelector]);

  function handleFavoriteChange(gameId: string, isFavorite: boolean) {
    if (isFavorite) return;
    const removedIndex = games.findIndex((game) => game.id === gameId);
    const nextGame = games[removedIndex + 1] ?? games[removedIndex - 1];
    pendingFocusId.current = nextGame?.id ?? null;
    const removedGame = games[removedIndex];
    setAnnouncement(`${removedGame?.name ?? "Item"} removed from favorites.`);
  }

  const liveRegion = (
    <span className="favorites-live" aria-live="polite" aria-atomic="true">
      {announcement}
    </span>
  );
  if (games.length === 0) return liveRegion;

  return (
    <section
      className="route-directory-section favorites-directory-section"
      aria-labelledby="favorites-directory-heading"
      data-directory-module="favorites"
    >
      <div className="route-section-heading">
        <div>
          <p className="route-eyebrow">Saved in this browser</p>
          <h2 id="favorites-directory-heading">Favorites</h2>
        </div>
        <span>{games.length} {games.length === 1 ? "item" : "items"}</span>
      </div>
      <GameGrid
        games={games}
        ariaLabel="Favorite avatar games and tools"
        reloadDocument
        onFavoriteChange={handleFavoriteChange}
      />
      {liveRegion}
    </section>
  );
}
