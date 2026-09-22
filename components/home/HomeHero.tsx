"use client";

import { Play } from "lucide-react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import AvatarGenerator from "../AvatarGenerator";
import type { FlashGeneratorHandle } from "../FlashGenerator";
import type { GameHomepageContent } from "../../lib/games/game-schema";
import type { SquareHomepagePlayerProps } from "../../lib/games/square-homepage";
import CoreGamePreview from "./CoreGamePreview";
import FavoriteToggle from "../game/FavoriteToggle";

type HomeHeroProps = {
  readonly h1: string;
  readonly copy: GameHomepageContent["hero"];
  readonly player: SquareHomepagePlayerProps;
};

const corePreviewId = "home-core-game-preview";
const simpleMakerId = "home-simple-maker";
const mobileQuery = "(max-width: 760px)";
type MakerMode = "classic" | "simple";

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function getServerSnapshot() { return null; }

export default function HomeHero({
  h1,
  copy,
  player
}: HomeHeroProps) {
  const isMobile = useSyncExternalStore<boolean | null>(subscribeToViewport, getMobileSnapshot, getServerSnapshot);
  const [chosenMode, setChosenMode] = useState<MakerMode | null>(null);
  // CSS supplies the same responsive default before hydration, without flashing
  // the classic player on phones. An explicit choice survives viewport changes.
  const mode = chosenMode ?? (isMobile === null ? "auto" : isMobile ? "simple" : "classic");
  const playerRef = useRef<FlashGeneratorHandle | null>(null);
  const handleHeroPlay = useCallback(() => {
    playerRef.current?.activateOrReload();
  }, []);

  return (
    <section className="game-station home-hero" id="game-player" data-home-section="hero" data-maker-mode={mode}>
      <span className="anchor-target" id="maker" aria-hidden="true" />
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <p className="eyebrow home-classic-copy">{copy.eyebrow}</p>
          <p className="eyebrow home-simple-copy">Free online avatar maker</p>
          <h1>{h1}</h1>
          <p className="hero-text home-classic-copy">{copy.intro}</p>
          <p className="hero-text home-simple-copy">Make a simple square avatar and download a PNG. No signup needed.</p>
          <div className="home-hero-actions" aria-label="Game actions">
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
          </div>
        </div>

        <div className="home-maker">
          <div className="home-maker-switch" role="group" aria-label="Choose an editor">
            <button type="button" aria-pressed={mode === "classic" || mode === "auto"} aria-controls="home-classic-maker" onClick={() => setChosenMode("classic")} data-maker-choice="classic">Classic game</button>
            <button type="button" aria-pressed={mode === "simple"} aria-controls={simpleMakerId} onClick={() => setChosenMode("simple")} data-maker-choice="simple">Simple maker</button>
          </div>
          <div className="home-classic-panel" id="home-classic-maker" hidden={mode === "simple"}>
            <p className="home-maker-note">Classic game artwork and controls. Press Play to start.</p>
            <CoreGamePreview
              ref={playerRef}
              previewId={corePreviewId}
              cardLabel={copy.cardLabel}
              {...player}
            />
          </div>
          <div className="home-simple-panel" id={simpleMakerId} hidden={mode === "classic"}>
            <p className="home-maker-note">Simple illustrated avatars, with a different look from the classic game.</p>
            <AvatarGenerator compact />
          </div>
        </div>
      </div>
    </section>
  );
}
