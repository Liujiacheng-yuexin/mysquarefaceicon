"use client";

import type { Html5PlayerModel } from "@/lib/games/game-player-model";
import IframeAdapterFrame from "./IframeAdapterFrame";
import type { AdapterStatusHandler } from "./adapter-types";

type Html5AdapterProps = {
  readonly model: Html5PlayerModel;
  readonly onStatusChange: AdapterStatusHandler;
};

export default function Html5Adapter({ model, onStatusChange }: Html5AdapterProps) {
  return (
    <IframeAdapterFrame
      adapterType="HTML5"
      src={model.player.entryUrl}
      title={`${model.name} HTML5 game`}
      loadingMessage={model.labels.loading}
      readyMessage={`${model.name} loaded.`}
      errorMessage={model.labels.error}
      onStatusChange={onStatusChange}
    />
  );
}
