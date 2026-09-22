"use client";

import { useEffect, useRef } from "react";
import type { AdapterStatusHandler } from "./adapter-types";

type IframeAdapterFrameProps = {
  readonly adapterType: "HTML5" | "LOCAL_IFRAME" | "OFFICIAL_IFRAME";
  readonly src: string;
  readonly title: string;
  readonly loadingMessage: string;
  readonly readyMessage: string;
  readonly errorMessage: string;
  readonly onStatusChange: AdapterStatusHandler;
  readonly sandbox?: string;
};

const IFRAME_LOAD_TIMEOUT_MS = 15000;

export default function IframeAdapterFrame({
  adapterType,
  src,
  title,
  loadingMessage,
  readyMessage,
  errorMessage,
  onStatusChange,
  sandbox
}: IframeAdapterFrameProps) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    onStatusChange({ state: "loading", message: loadingMessage });
    timeoutRef.current = window.setTimeout(() => {
      onStatusChange({ state: "error", message: errorMessage });
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [errorMessage, loadingMessage, onStatusChange, src]);

  function clearLoadTimeout() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  return (
    <iframe
      className="game-player-frame"
      data-player-adapter={adapterType}
      src={src}
      title={title}
      sandbox={sandbox}
      allow="fullscreen"
      loading="eager"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => {
        clearLoadTimeout();
        onStatusChange({ state: "ready", message: readyMessage });
      }}
      onError={() => {
        clearLoadTimeout();
        onStatusChange({ state: "error", message: errorMessage });
      }}
    />
  );
}
