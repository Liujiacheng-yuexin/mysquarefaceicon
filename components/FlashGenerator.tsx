"use client";

import { CirclePlay, Download, Maximize2, MousePointerClick, Palette, RefreshCw } from "lucide-react";
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

const SCRIPT_TIMEOUT_MS = 8000;
const SWF_LOAD_TIMEOUT_MS = 15000;

const gameGuideSteps = [
  {
    title: "Click the preview",
    text: "Load the original square face game in your browser.",
    icon: MousePointerClick
  },
  {
    title: "Press START",
    text: "Use the START button inside the game screen.",
    icon: CirclePlay
  },
  {
    title: "Customize & SAVE",
    text: "Pick parts, colors, and save when your icon is ready.",
    icon: Download
  }
];

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
          await withTimeout(
            player.load({
              url: source,
              autoplay: "on",
              unmuteOverlay: "hidden",
              backgroundColor: "#FFAF03",
              letterbox: "on",
              warnOnUnsupportedContent: false,
              contextMenu: "on"
            }),
            SWF_LOAD_TIMEOUT_MS,
            "The game file took too long to load."
          );
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
      <div className="play-guide" aria-label="How to start the square face game">
        {gameGuideSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div className="play-guide-step" key={step.title}>
              <span className="play-guide-number">{index + 1}</span>
              <Icon aria-hidden="true" size={18} />
              <div>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </div>
            </div>
          );
        })}
      </div>
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
              {loadState !== "loading" && (
                <span className="flash-start-chip" aria-live="polite">
                  <CirclePlay aria-hidden="true" size={18} />
                  {loadState === "error" ? "Retry game" : "Click preview to start"}
                </span>
              )}
              {loadState === "loading" && (
                <span className="flash-cover-status" aria-live="polite">
                  <RefreshCw aria-hidden="true" size={18} />
                  {message}
                </span>
              )}
            </div>
          )}
          <button className="flash-fullscreen" type="button" onClick={toggleFullscreen} aria-label="Fullscreen game">
            <Maximize2 aria-hidden="true" size={22} />
          </button>
        </div>
      </div>

      <div className="flash-actions">
        <button className="tool-button secondary" type="button" onClick={() => setShowFallback((current) => !current)}>
          <Palette aria-hidden="true" size={18} />
          {showFallback ? "Hide HTML5 backup" : "Use HTML5 backup maker"}
        </button>
        {loadState === "ready" && (
          <button className="tool-button secondary" type="button" onClick={startPlayer}>
            <RefreshCw aria-hidden="true" size={18} />
            Reload Game
          </button>
        )}
      </div>

      {showFallback && (
        <div className="fallback-section">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Backup option</p>
            <h2>{loadState === "error" ? "Ruffle could not load" : "HTML5 backup maker"}</h2>
            <p className="section-intro">
              Use this lightweight Canvas maker if you want a quick downloadable square avatar without waiting for the original game.
            </p>
          </div>
          <AvatarGenerator />
        </div>
      )}
    </div>
  );
}
