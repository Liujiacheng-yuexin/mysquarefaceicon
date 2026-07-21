"use client";

import dynamic from "next/dynamic";
import { Flag, Maximize2, Play, RotateCcw } from "lucide-react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type FlashGeneratorProps = {
  gameName?: string;
  swfSources?: string[];
  coverImageUrl?: string;
  backgroundColor?: string;
  ariaLabel?: string;
  coverLabel?: string;
  loadingMessage?: string;
  errorMessage?: string;
  slowLoadingHint?: string;
  deviceNotice?: string;
  reportHref?: string;
  aspectRatio?: string;
  maxWidth?: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  startLabel?: string;
  reloadLabel?: string;
  helpLabel?: string;
  showStartControl?: boolean;
};

const FlashGeneratorRuntime = dynamic(() => import("@/components/FlashGeneratorRuntime"), {
  ssr: false,
  loading: () => null
});

const defaultCoverImageUrl = "https://static.mysquarefaceicon.com/squarefacegenerator/square-face-cover.png";

export default function FlashGenerator({
  gameName = "Square Face Generator",
  coverImageUrl = defaultCoverImageUrl,
  ariaLabel = "Square face Flash generator",
  coverLabel = "Start Square Face Generator game",
  deviceNotice = "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better experience.",
  reportHref = "/contact",
  aspectRatio = "690 / 600",
  maxWidth = "980px",
  coverImageWidth = 690,
  coverImageHeight = 600,
  startLabel = "Start Game",
  reloadLabel = "Reload",
  helpLabel = "Game Help",
  showStartControl = true,
  ...runtimeProps
}: FlashGeneratorProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [activated, setActivated] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const stageStyle = {
    "--flash-aspect-ratio": aspectRatio,
    "--flash-max-width": maxWidth
  } as CSSProperties;

  useEffect(() => {
    setFullscreenAvailable(Boolean(stageRef.current?.requestFullscreen));
  }, []);

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage?.requestFullscreen) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await stage.requestFullscreen();
    } catch {
      // Fullscreen support varies across mobile browsers; keep the preview usable.
    }
  }

  function startGame() {
    setActivated(true);
  }

  function handleCoverKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startGame();
    }
  }

  if (activated) {
    return (
      <FlashGeneratorRuntime
        {...runtimeProps}
        gameName={gameName}
        coverImageUrl={coverImageUrl}
        ariaLabel={ariaLabel}
        coverLabel={coverLabel}
        deviceNotice={deviceNotice}
        reportHref={reportHref}
        aspectRatio={aspectRatio}
        maxWidth={maxWidth}
        coverImageWidth={coverImageWidth}
        coverImageHeight={coverImageHeight}
        startLabel={startLabel}
        reloadLabel={reloadLabel}
        helpLabel={helpLabel}
      />
    );
  }

  return (
    <div className="flash-tool-shell" aria-label={ariaLabel}>
      <div className="flash-stage" ref={stageRef} style={stageStyle}>
        <div className="flash-player">
          <div
            className="flash-cover flash-preview"
            role="button"
            tabIndex={0}
            aria-label={coverLabel}
            onClick={startGame}
            onKeyDown={handleCoverKeyDown}
          >
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="flash-cover-image"
                src={coverImageUrl}
                width={coverImageWidth}
                height={coverImageHeight}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            )}
            <span className="flash-play-panel" aria-hidden="true">
              <Play size={18} />
              {startLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="game-control-bar" aria-label="Game controls">
        {showStartControl && (
          <button className="tool-button primary" type="button" onClick={startGame}>
            <Play aria-hidden="true" size={18} />
            {startLabel}
          </button>
        )}
        <button className="tool-button secondary" type="button" onClick={toggleFullscreen} disabled={!fullscreenAvailable}>
          <Maximize2 aria-hidden="true" size={18} />
          Fullscreen
        </button>
        <button className="tool-button secondary" type="button" onClick={startGame}>
          <RotateCcw aria-hidden="true" size={18} />
          {reloadLabel}
        </button>
        <a className="tool-button secondary" href={reportHref}>
          <Flag aria-hidden="true" size={18} />
          {helpLabel}
        </a>
      </div>

      <p className="game-status" aria-live="polite">
        {gameName} is ready. Click {startLabel} to load the classic Flash player.
      </p>
      <aside className="game-device-notice">{deviceNotice}</aside>
    </div>
  );
}
