"use client";

import { Maximize2, Play, RefreshCw } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import AvatarGenerator from "./AvatarGenerator";

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

const swfSources = [
  "/games/square-face.swf"
];

function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-ruffle-url="${url}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing ?? document.createElement("script");
    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.ruffleUrl = url;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load Ruffle from ${url}`));

    if (!existing) {
      document.head.appendChild(script);
    }
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

export default function FlashGenerator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("Click the preview to load the square face game.");
  const [showFallback, setShowFallback] = useState(false);

  async function startPlayer() {
    const mount = mountRef.current;
    if (!mount) return;

    setLoadState("loading");
    setMessage("Loading Flash player...");
    setShowFallback(false);
    mount.replaceChildren();

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
      for (const source of swfSources) {
        try {
          setMessage(source.startsWith("/") ? "Loading local game file..." : "Loading authorized fallback game file...");
          await player.load({
            url: source,
            autoplay: "on",
            unmuteOverlay: "hidden",
            backgroundColor: "#FFAF03",
            letterbox: "on",
            warnOnUnsupportedContent: false,
            contextMenu: "on"
          });
          setLoadState("ready");
          setMessage("Game loaded.");
          return;
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError ?? new Error("SWF failed to load.");
    } catch {
      mount.replaceChildren();
      setLoadState("error");
      setMessage("The Flash game could not load. You can use the HTML5 fallback below.");
      setShowFallback(true);
    }
  }

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await stage.requestFullscreen();
  }

  function handleCoverKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (loadState === "loading") return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void startPlayer();
    }
  }

  return (
    <div className="flash-tool-shell" aria-label="Square face Flash generator">
      <div className="flash-stage" ref={stageRef}>
        <div className="flash-player">
          <div className="ruffle-mount" ref={mountRef} />
          {loadState !== "ready" && (
            <div
              className={loadState === "loading" ? "flash-cover is-loading" : "flash-cover"}
              role="button"
              tabIndex={loadState === "loading" ? -1 : 0}
              aria-label="Start Square Face Generator game"
              onClick={() => {
                if (loadState !== "loading") void startPlayer();
              }}
              onKeyDown={handleCoverKeyDown}
            >
              <span className="flash-cover-status" aria-live="polite">
                {loadState === "loading" ? <RefreshCw aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
                {loadState === "loading" ? message : "Click to start"}
              </span>
            </div>
          )}
          <button className="flash-fullscreen" type="button" onClick={toggleFullscreen} aria-label="Fullscreen game">
            <Maximize2 aria-hidden="true" size={22} />
          </button>
        </div>
      </div>

      {loadState === "ready" && (
        <div className="flash-actions">
          <button className="tool-button secondary" type="button" onClick={startPlayer}>
            <RefreshCw aria-hidden="true" size={18} />
            Reload Game
          </button>
        </div>
      )}

      {showFallback && (
        <div className="fallback-section">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Backup option</p>
            <h2>Ruffle could not load</h2>
          </div>
          <AvatarGenerator />
        </div>
      )}
    </div>
  );
}
