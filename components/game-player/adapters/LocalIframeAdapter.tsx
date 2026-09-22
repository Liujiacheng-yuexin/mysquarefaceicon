"use client";

import type { LocalIframePlayerModel } from "@/lib/games/game-player-model";
import IframeAdapterFrame from "./IframeAdapterFrame";
import type { AdapterStatusHandler } from "./adapter-types";

type LocalIframeAdapterProps = {
  readonly model: LocalIframePlayerModel;
  readonly onStatusChange: AdapterStatusHandler;
};

export default function LocalIframeAdapter({ model, onStatusChange }: LocalIframeAdapterProps) {
  return (
    <IframeAdapterFrame
      adapterType="LOCAL_IFRAME"
      src={model.player.src}
      title={`${model.name} local game`}
      sandbox={model.player.sandbox.join(" ")}
      loadingMessage={model.labels.loading}
      readyMessage={`${model.name} loaded.`}
      errorMessage={model.labels.error}
      onStatusChange={onStatusChange}
    />
  );
}
