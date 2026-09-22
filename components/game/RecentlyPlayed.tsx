"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  clearRecentlyPlayed,
  getRecentlyPlayedSnapshot,
  parseRecentlyPlayed,
  selectRecentlyPlayedCandidates,
  subscribeToRecentlyPlayed,
  type RecentlyPlayedCandidate
} from "../../lib/recently-played";
import FavoriteToggle from "./FavoriteToggle";

type RecentlyPlayedProps = {
  readonly candidates: readonly RecentlyPlayedCandidate[];
  readonly variant: "home" | "directory";
  readonly nextHeadingSelector: string;
};

type RecentCardProps = {
  readonly candidate: RecentlyPlayedCandidate;
  readonly reloadDocument: boolean;
};

function RecentCard({ candidate, reloadDocument }: RecentCardProps) {
  const content = (
    <>
      {candidate.image ? (
        <span className="recently-played-media">
          <Image
            src={candidate.image.src}
            alt={candidate.image.alt}
            width={candidate.image.width}
            height={candidate.image.height}
            sizes="(max-width: 430px) 82px, (max-width: 760px) 96px, 112px"
            loading="lazy"
          />
        </span>
      ) : null}
      <span className="recently-played-copy">
        <span className="route-game-type">Browser game</span>
        <strong>{candidate.name}</strong>
        <span className="recently-played-summary">{candidate.summary}</span>
        <span className="route-card-action recently-played-action">
          Continue game
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
        </span>
      </span>
    </>
  );
  const className = `game-list-card route-game-link recently-played-card${
    candidate.image ? "" : " game-list-card-without-media recently-played-card-no-media"
  }`;
  const attributes = {
    className,
    "data-game-id": candidate.gameId,
    "data-game-page-type": "GAME",
    "data-recently-played-card": "true"
  } as const;

  return (
    <div className="favoritable-game-card">
      {reloadDocument ? (
        <a {...attributes} href={candidate.href} data-navigation="document">{content}</a>
      ) : (
        <Link {...attributes} href={candidate.href}>{content}</Link>
      )}
      <FavoriteToggle gameId={candidate.gameId} gameName={candidate.name} pageType="GAME" />
    </div>
  );
}

function RecentCards({ games, reloadDocument }: {
  readonly games: readonly RecentlyPlayedCandidate[];
  readonly reloadDocument: boolean;
}) {
  return (
    <ul className="route-game-list recently-played-list" aria-label="Recently played avatar games">
      {games.map((candidate) => (
        <li key={candidate.gameId}>
          <RecentCard candidate={candidate} reloadDocument={reloadDocument} />
        </li>
      ))}
    </ul>
  );
}

export default function RecentlyPlayed({ candidates, variant, nextHeadingSelector }: RecentlyPlayedProps) {
  const snapshot = useSyncExternalStore(subscribeToRecentlyPlayed, getRecentlyPlayedSnapshot, () => null);
  const games = useMemo(
    () => selectRecentlyPlayedCandidates(parseRecentlyPlayed(snapshot), candidates),
    [candidates, snapshot]
  );
  const [announcement, setAnnouncement] = useState("");

  function handleClear() {
    if (!clearRecentlyPlayed()) {
      setAnnouncement("Recently played history could not be cleared in this browser.");
      return;
    }
    setAnnouncement("Recently played history cleared.");
    const nextHeading = document.querySelector<HTMLElement>(nextHeadingSelector);
    if (nextHeading) {
      const previousTabIndex = nextHeading.getAttribute("tabindex");
      nextHeading.setAttribute("tabindex", "-1");
      nextHeading.focus({ preventScroll: true });
      nextHeading.addEventListener("blur", () => {
        if (previousTabIndex === null) nextHeading.removeAttribute("tabindex");
        else nextHeading.setAttribute("tabindex", previousTabIndex);
      }, { once: true });
    }
  }

  const liveRegion = (
    <span className="recently-played-live" aria-live="polite" aria-atomic="true">
      {announcement}
    </span>
  );
  if (games.length === 0) return announcement ? liveRegion : null;

  if (variant === "home") {
    return (
      <div className="home-discovery-panel" data-home-module="recently-played">
        <div className="home-discovery-heading recently-played-heading">
          <div>
            <h3>Continue Playing</h3>
            <p>Return to avatar games you started in this browser.</p>
          </div>
          <button className="recently-played-clear" type="button" onClick={handleClear}>
            <Trash2 aria-hidden="true" size={17} />
            Clear history
          </button>
        </div>
        <RecentCards games={games} reloadDocument={false} />
        {liveRegion}
      </div>
    );
  }

  return (
    <section
      className="route-directory-section"
      aria-labelledby="recently-played-directory-heading"
      data-directory-module="recently-played"
    >
      <div className="route-section-heading recently-played-heading">
        <div>
          <p className="route-eyebrow">Saved in this browser</p>
          <h2 id="recently-played-directory-heading">Continue Playing</h2>
        </div>
        <button className="recently-played-clear" type="button" onClick={handleClear}>
          <Trash2 aria-hidden="true" size={17} />
          Clear history
        </button>
      </div>
      <RecentCards games={games} reloadDocument />
      {liveRegion}
    </section>
  );
}
