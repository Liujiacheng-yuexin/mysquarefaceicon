"use client";

import { useEffect, useRef } from "react";
import type { RufflePlayerModel } from "@/lib/games/game-player-model";
import type { AdapterStatusHandler } from "./adapter-types";

type RufflePlayerElement = HTMLElement & {
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

type RuffleRelease = {
  createPlayer: () => RufflePlayerElement;
};

declare global {
  interface Window {
    RufflePlayer?: {
      config?: Record<string, unknown>;
      newest?: () => RuffleRelease;
    };
  }
}

type RuffleAdapterProps = {
  readonly model: RufflePlayerModel;
  readonly onStatusChange: AdapterStatusHandler;
};

const RUFFLE_PUBLIC_PATH = "/ruffle/";
const RUFFLE_RUNTIME_URL = `${RUFFLE_PUBLIC_PATH}ruffle.js`;

const SCRIPT_TIMEOUT_MS = 8000;
const SWF_LOAD_TIMEOUT_MS = 15000;
const SLOW_LOADING_MS = 6000;
let ruffleRuntimePromise: Promise<RuffleRelease> | null = null;

function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-ruffle-url="${url}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing?.isConnected ? existing : document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
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
      script.remove();
      reject(new Error(`Failed to load Ruffle from ${url}`));
    };

    if (!existing) document.head.appendChild(script);
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

async function initializeRuffleRuntime(): Promise<RuffleRelease> {
  const existingRelease = window.RufflePlayer?.newest?.();
  if (existingRelease) return existingRelease;

  window.RufflePlayer = window.RufflePlayer ?? {};
  window.RufflePlayer.config = {
    ...(window.RufflePlayer.config ?? {}),
    publicPath: RUFFLE_PUBLIC_PATH,
    polyfills: false
  };

  let lastError: unknown;
  try {
    await loadScript(RUFFLE_RUNTIME_URL);
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const release = window.RufflePlayer?.newest?.();
      if (release) return release;
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    }
  } catch (error) {
    lastError = error;
  }

  throw lastError ?? new Error("Ruffle did not initialize.");
}

function loadRuffleRuntime() {
  if (!ruffleRuntimePromise) {
    ruffleRuntimePromise = initializeRuffleRuntime().catch((error) => {
      ruffleRuntimePromise = null;
      throw error;
    });
  }

  return ruffleRuntimePromise;
}

export default function RuffleAdapter({ model, onStatusChange }: RuffleAdapterProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const swfSources = model.player.swfSources;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    const slowTimer = window.setTimeout(() => {
      if (!cancelled) {
        onStatusChange({ state: "loading", message: model.labels.loading, showSlowHint: true });
      }
    }, SLOW_LOADING_MS);

    onStatusChange({ state: "loading", message: model.labels.loading, showSlowHint: false });
    mount.replaceChildren();

    async function start(playerMount: HTMLDivElement) {
      try {
        const ruffle = await loadRuffleRuntime();
        if (cancelled) return;

        const player = ruffle.createPlayer();
        player.style.width = "100%";
        player.style.height = "100%";
        player.style.display = "block";
        playerMount.appendChild(player);

        let lastError: unknown;
        for (const source of swfSources) {
          try {
            await withTimeout(
              player.load({
                url: source,
                autoplay: "on",
                unmuteOverlay: "hidden",
                backgroundColor: model.player.backgroundColor,
                letterbox: "on",
                warnOnUnsupportedContent: false,
                contextMenu: "on"
              }),
              SWF_LOAD_TIMEOUT_MS,
              "The game file took too long to load."
            );
            if (cancelled) return;
            window.clearTimeout(slowTimer);
            onStatusChange({ state: "ready", message: `${model.name} loaded.` });
            return;
          } catch (error) {
            lastError = error;
          }
        }

        throw lastError ?? new Error("SWF failed to load.");
      } catch {
        if (cancelled) return;
        window.clearTimeout(slowTimer);
        playerMount.replaceChildren();
        onStatusChange({ state: "error", message: model.labels.error });
      }
    }

    void start(mount);

    return () => {
      cancelled = true;
      window.clearTimeout(slowTimer);
      mount.replaceChildren();
    };
  }, [model.labels.error, model.labels.loading, model.name, model.player.backgroundColor, onStatusChange, swfSources]);

  return <div className="ruffle-mount" ref={mountRef} data-player-adapter="RUFFLE_SWF" />;
}
