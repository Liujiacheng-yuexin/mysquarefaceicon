"use client";

import GamePlayer from "./game-player/GamePlayer";
import type { GamePlayerHandle } from "./game-player/GamePlayer";
import type { RufflePlayerModel } from "../lib/games/game-player-model";
import { forwardRef } from "react";

export type FlashGeneratorProps = {
  gameId: string;
  gameName?: string;
  swfSources?: readonly string[];
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

export type FlashGeneratorHandle = GamePlayerHandle;

const defaultSwfSources: [string, ...string[]] = ["/games/square-face.swf"];
const defaultCoverImageUrl = "/games/square-face-cover.png";

const FlashGenerator = forwardRef<FlashGeneratorHandle, FlashGeneratorProps>(function FlashGenerator(
  {
    gameId,
    gameName = "Square Face Generator",
    swfSources = defaultSwfSources,
    coverImageUrl = defaultCoverImageUrl,
    backgroundColor = "#FFAF03",
    ariaLabel = "Square face Flash generator",
    coverLabel = "Start Square Face Generator game",
    loadingMessage = "Loading Square Face Generator...",
    errorMessage = "The game could not be loaded. Please refresh the page or try a desktop browser.",
    slowLoadingHint = "Still loading? This classic Flash game may take a few seconds to start.",
    deviceNotice = "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better experience.",
    reportHref = "/contact",
    aspectRatio = "690 / 600",
    maxWidth = "980px",
    coverImageWidth = 970,
    coverImageHeight = 844,
    startLabel = "Start Game",
    reloadLabel = "Reload",
    helpLabel = "Game Help",
    showStartControl = true
  },
  ref
) {
  const resolvedSources = (swfSources.length > 0 ? swfSources : defaultSwfSources) as [string, ...string[]];
  const model: RufflePlayerModel = {
    id: gameId,
    name: gameName,
    type: "RUFFLE_SWF",
    ariaLabel,
    cover: coverImageUrl
      ? { src: coverImageUrl, width: coverImageWidth, height: coverImageHeight }
      : null,
    frame: { aspectRatio, maxWidth, backgroundColor },
    labels: {
      start: startLabel,
      reload: reloadLabel,
      help: helpLabel,
      cover: coverLabel,
      loading: loadingMessage,
      error: errorMessage,
      slowLoadingHint
    },
    source: {
      providerName: "My Square Face Icon project archive",
      originalUrl: null,
      attribution: null
    },
    policy: {
      releaseDecision: "REVIEW_REQUIRED",
      allowedDeliveryTypes: ["RUFFLE_SWF"]
    },
    deviceNotice,
    reportHref,
    showStartControl,
    player: {
      swfSources: resolvedSources,
      backgroundColor,
      clickToLoad: true
    }
  };

  return <GamePlayer ref={ref} model={model} />;
});

export default FlashGenerator;
