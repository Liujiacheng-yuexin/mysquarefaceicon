"use client";

import dynamic from "next/dynamic";
import { Play, RefreshCw } from "lucide-react";
import type { CSSProperties } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import GameControls from "../game/GameControls";
import {
  assertNever,
  assertValidGamePlayerModel,
  getPlayerCapabilities,
  type GamePlayerModel,
  type PlayablePlayerModel,
  type PlayerStatus
} from "../../lib/games/game-player-model";
import ExternalLinkAdapter from "./adapters/ExternalLinkAdapter";
import Html5Adapter from "./adapters/Html5Adapter";
import LocalIframeAdapter from "./adapters/LocalIframeAdapter";
import OfficialIframeAdapter from "./adapters/OfficialIframeAdapter";
import type { AdapterStatusHandler } from "./adapters/adapter-types";
import { recordRecentlyPlayed } from "../../lib/recently-played";

const RuffleAdapter = dynamic(() => import("./adapters/RuffleAdapter"), {
  ssr: false,
  loading: () => null
});

type GamePlayerProps = {
  readonly model: GamePlayerModel;
};

export type GamePlayerHandle = {
  readonly activateOrReload: () => void;
};

type PlayerAdapterProps = {
  readonly model: PlayablePlayerModel;
  readonly instanceKey: number;
  readonly onStatusChange: AdapterStatusHandler;
};

function PlayableAdapter({ model, instanceKey, onStatusChange }: PlayerAdapterProps) {
  switch (model.type) {
    case "RUFFLE_SWF":
      return <RuffleAdapter key={instanceKey} model={model} onStatusChange={onStatusChange} />;
    case "HTML5":
      return <Html5Adapter key={instanceKey} model={model} onStatusChange={onStatusChange} />;
    case "LOCAL_IFRAME":
      return <LocalIframeAdapter key={instanceKey} model={model} onStatusChange={onStatusChange} />;
    case "OFFICIAL_IFRAME":
      return <OfficialIframeAdapter key={instanceKey} model={model} onStatusChange={onStatusChange} />;
    default:
      return assertNever(model);
  }
}

function initialStatus(model: GamePlayerModel): PlayerStatus {
  if (model.type === "EXTERNAL_LINK") {
    return {
      state: "ready",
      message: `${model.name} is provided by ${model.source.providerName} and opens on the original site.`
    };
  }

  return {
    state: "idle",
    message: `${model.name} is ready. Click ${model.labels.start} to load the player.`
  };
}

const GamePlayer = forwardRef<GamePlayerHandle, GamePlayerProps>(function GamePlayer({ model }, ref) {
  assertValidGamePlayerModel(model);
  const capabilities = getPlayerCapabilities(model.type);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activationFrameRef = useRef<number | null>(null);
  const adapterFrameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const [activated, setActivated] = useState(false);
  const [adapterMounted, setAdapterMounted] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>(() => initialStatus(model));
  const stageStyle = {
    "--flash-aspect-ratio": model.frame.aspectRatio,
    "--flash-max-width": model.frame.maxWidth,
    "--game-player-background": model.frame.backgroundColor
  } as CSSProperties;

  useEffect(() => {
    setFullscreenAvailable(capabilities.fullscreen && Boolean(stageRef.current?.requestFullscreen));
  }, [capabilities.fullscreen]);

  const handleStatusChange = useCallback((nextStatus: PlayerStatus) => {
    setStatus(nextStatus);
  }, []);

  const cancelPendingAdapterMount = useCallback(() => {
    if (activationFrameRef.current !== null) {
      window.cancelAnimationFrame(activationFrameRef.current);
      activationFrameRef.current = null;
    }
    if (adapterFrameRef.current !== null) {
      window.cancelAnimationFrame(adapterFrameRef.current);
      adapterFrameRef.current = null;
    }
  }, []);

  const scheduleAdapterMountAfterPaint = useCallback(() => {
    cancelPendingAdapterMount();
    // Leave a paint opportunity for the urgent loading state before mounting heavy adapters.
    activationFrameRef.current = window.requestAnimationFrame(() => {
      activationFrameRef.current = null;
      adapterFrameRef.current = window.requestAnimationFrame(() => {
        adapterFrameRef.current = null;
        setAdapterMounted(true);
      });
    });
  }, [cancelPendingAdapterMount]);

  useEffect(() => cancelPendingAdapterMount, [cancelPendingAdapterMount]);

  const activateOrReload = useCallback(() => {
    setStatus({ state: "loading", message: model.labels.loading });
    if (hasStartedRef.current) {
      setInstanceKey((current) => current + 1);
    } else {
      hasStartedRef.current = true;
      recordRecentlyPlayed(model.id);
      setActivated(true);
      scheduleAdapterMountAfterPaint();
    }
  }, [model.id, model.labels.loading, scheduleAdapterMountAfterPaint]);

  const reload = useCallback(() => {
    setStatus({ state: "loading", message: model.labels.loading });
    if (hasStartedRef.current) {
      setInstanceKey((current) => current + 1);
    } else {
      hasStartedRef.current = true;
      setActivated(true);
      scheduleAdapterMountAfterPaint();
    }
  }, [model.labels.loading, scheduleAdapterMountAfterPaint]);

  useImperativeHandle(ref, () => ({ activateOrReload }), [activateOrReload]);

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage?.requestFullscreen) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await stage.requestFullscreen();
      }
    } catch {
      setStatus({ state: status.state, message: "Fullscreen is not available in this browser." });
    }
  }

  if (model.type === "EXTERNAL_LINK") {
    return (
      <div className="game-player-external-shell" aria-label={model.ariaLabel} data-player-type={model.type}>
        <ExternalLinkAdapter model={model} />
        <GameControls model={model} />
        <p className="game-status" aria-live="polite">{status.message}</p>
        <aside className="game-device-notice">{model.deviceNotice}</aside>
      </div>
    );
  }

  return (
    <div
      className="flash-tool-shell"
      aria-label={model.ariaLabel}
      data-player-type={model.type}
      data-player-activated={activated ? "true" : "false"}
      data-player-adapter-mounted={adapterMounted ? "true" : "false"}
      data-player-activation-phase={!activated ? "idle" : adapterMounted ? "adapter-mounted" : "loading-visible"}
      data-player-state={status.state}
    >
      <div className="flash-stage" ref={stageRef} style={stageStyle}>
        <div className="flash-player" data-player-surface aria-busy={activated && status.state === "loading"}>
          {adapterMounted && (
            <PlayableAdapter model={model} instanceKey={instanceKey} onStatusChange={handleStatusChange} />
          )}

          {!activated && (
            <button
              className="flash-cover flash-preview"
              type="button"
              aria-label={model.labels.cover}
              onClick={activateOrReload}
              data-player-preview
            >
              {model.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="flash-cover-image"
                  src={model.cover.src}
                  width={model.cover.width}
                  height={model.cover.height}
                  alt=""
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              )}
              <span className="flash-play-panel" aria-hidden="true">
                <Play size={18} />
                {model.labels.start}
              </span>
            </button>
          )}

          {activated && status.state === "loading" && (
            <div className="flash-cover is-loading" aria-hidden="true" data-player-loading>
              <span className="flash-cover-status">
                <RefreshCw size={18} />
                {status.message}
                {status.showSlowHint && <small>{model.labels.slowLoadingHint}</small>}
              </span>
            </div>
          )}

          {activated && status.state === "error" && (
            <button
              className="flash-cover game-player-error-cover"
              type="button"
              aria-label={`Retry ${model.name}`}
              onClick={reload}
              data-player-error
            >
              <span className="flash-error-panel">
                {status.message}
                <strong>Click to retry.</strong>
              </span>
            </button>
          )}
        </div>
      </div>

      <GameControls
        model={model}
        activated={activated}
        fullscreenAvailable={fullscreenAvailable}
        onActivateOrReload={activateOrReload}
        onReload={reload}
        onToggleFullscreen={toggleFullscreen}
      />

      <p className="game-status" aria-live="polite">{status.message}</p>
      <aside className="game-device-notice">{model.deviceNotice}</aside>
    </div>
  );
});

export default GamePlayer;
