"use client";

import { Flag, Maximize2, RefreshCw, RotateCcw } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    RufflePlayer?: {
      newest: () => {
        createPlayer: () => HTMLElement & {
          load: (options: {
            url: string;
            autoplay?: "on" | "off";
            backgroundColor?: string;
            letterbox?: "on" | "off";
            unmuteOverlay?: "hidden" | "visible";
            warnOnUnsupportedContent?: boolean;
            contextMenu?: "on" | "off";
          }) => Promise<void>;
        };
      };
    };
  }
}

type LoadState = "idle" | "loading" | "ready" | "error";

const ruffleUrls = [
  "/ruffle/ruffle.js",
  "https://unpkg.com/@ruffle-rs/ruffle",
  "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@latest/ruffle.js"
];

const defaultSwfSources = [
  "/games/square-face.swf"
];

const defaultCoverImageUrl = "https://static.mysquarefaceicon.com/squarefacegenerator/square-face-cover.png";

const SCRIPT_TIMEOUT_MS = 8000;
const SWF_LOAD_TIMEOUT_MS = 15000;

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
};

function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-ruffle-url="${url}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing ?? document.createElement("script");
    const timeout = window.setTimeout(() => {
      reject(new Error(`Timed out loading Ruffle from ${url}`));
    }, SCRIPT_TIMEOUT_MS);

    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.ruffleUrl = url;
    script.onload = () => {
      window.clearTimeout(timeout);
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error(`Failed to load Ruffle from ${url}`));
    };

    if (!existing) {
      document.head.appendChild(script);
    }
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(errorMessage)), timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeout);
        reject(error);
      }
    );
  });
}

async function loadRuffleRuntime() {
  if (window.RufflePlayer?.newest) return;

  let lastError: unknown;
  for (const url of ruffleUrls) {
    try {
      await loadScript(url);
      for (let attempt = 0; attempt < 30; attempt += 1) {
        if (window.RufflePlayer?.newest) return;
        await new Promise((resolve) => window.setTimeout(resolve, 150));
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Ruffle did not initialize.");
}

export default function FlashGenerator({
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
  reportHref = "/contact"
}: FlashGeneratorProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slowLoadingTimerRef = useRef<number | null>(null);
  const autoStartedRef = useRef(false);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState(loadingMessage);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const sourceList = useMemo(() => (swfSources.length > 0 ? swfSources : defaultSwfSources), [swfSources]);

  const startPlayer = useCallback(async () => {
    const mount = mountRef.current;
    if (!mount) return;

    if (slowLoadingTimerRef.current) {
      window.clearTimeout(slowLoadingTimerRef.current);
    }

    setLoadState("loading");
    setMessage(loadingMessage);
    setShowSlowHint(false);
    mount.replaceChildren();
    slowLoadingTimerRef.current = window.setTimeout(() => {
      setShowSlowHint(true);
    }, 6000);

    try {
      await loadRuffleRuntime();
      const ruffle = window.RufflePlayer?.newest();
      if (!ruffle) throw new Error("Ruffle runtime is unavailable.");

      const player = ruffle.createPlayer();
      player.style.width = "100%";
      player.style.height = "100%";
      player.style.display = "block";
      mount.appendChild(player);

      let lastError: unknown;
      for (const source of sourceList) {
        try {
          setMessage(loadingMessage);
          await withTimeout(
            player.load({
              url: source,
              autoplay: "on",
              unmuteOverlay: "hidden",
              backgroundColor,
              letterbox: "on",
              warnOnUnsupportedContent: false,
              contextMenu: "on"
            }),
            SWF_LOAD_TIMEOUT_MS,
            "The game file took too long to load."
          );
          if (slowLoadingTimerRef.current) {
            window.clearTimeout(slowLoadingTimerRef.current);
          }
          setLoadState("ready");
          setMessage(`${gameName} loaded.`);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError ?? new Error("SWF failed to load.");
    } catch {
      if (slowLoadingTimerRef.current) {
        window.clearTimeout(slowLoadingTimerRef.current);
      }
      mount.replaceChildren();
      setLoadState("error");
      setMessage(errorMessage);
    }
  }, [backgroundColor, errorMessage, gameName, loadingMessage, sourceList]);

  useEffect(() => {
    setFullscreenAvailable(Boolean(stageRef.current?.requestFullscreen));

    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      void startPlayer();
    }

    return () => {
      if (slowLoadingTimerRef.current) {
        window.clearTimeout(slowLoadingTimerRef.current);
      }
    };
  }, [startPlayer]);

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage) return;

    try {
      if (!stage.requestFullscreen) {
        setMessage("Fullscreen is not available in this browser.");
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await stage.requestFullscreen();
    } catch {
      setMessage("Fullscreen is not available in this browser.");
    }
  }

  function handleCoverKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (loadState === "loading") return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void startPlayer();
    }
  }

  return (
    <div className="flash-tool-shell" aria-label={ariaLabel}>
      <div className="flash-stage" ref={stageRef}>
        <div className="flash-player">
          <div className="ruffle-mount" ref={mountRef} />
          {loadState !== "ready" && (
            <div
              className={loadState === "loading" ? "flash-cover is-loading" : "flash-cover"}
              style={coverImageUrl ? { backgroundImage: `url("${coverImageUrl}")` } : undefined}
              role="button"
              tabIndex={loadState === "loading" ? -1 : 0}
              aria-label={coverLabel}
              onClick={() => {
                if (loadState !== "loading") void startPlayer();
              }}
              onKeyDown={handleCoverKeyDown}
            >
              {loadState === "error" && (
                <span className="flash-error-panel" aria-live="polite">
                  {message}
                  <strong>Click to retry.</strong>
                </span>
              )}
              {loadState === "loading" && (
                <span className="flash-cover-status" aria-live="polite">
                  <RefreshCw aria-hidden="true" size={18} />
                  {message}
                  {showSlowHint && (
                    <small>{slowLoadingHint}</small>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="game-control-bar" aria-label="Game controls">
        <button className="tool-button secondary" type="button" onClick={toggleFullscreen} disabled={!fullscreenAvailable}>
          <Maximize2 aria-hidden="true" size={18} />
          Fullscreen
        </button>
        <button className="tool-button secondary" type="button" onClick={() => void startPlayer()}>
          <RotateCcw aria-hidden="true" size={18} />
          Reload Game
        </button>
        <a className="tool-button secondary" href={reportHref}>
          <Flag aria-hidden="true" size={18} />
          Report Issue
        </a>
      </div>

      <p className="game-status" aria-live="polite">{message}</p>
      <aside className="game-device-notice">
        {deviceNotice}
      </aside>
    </div>
  );
}
