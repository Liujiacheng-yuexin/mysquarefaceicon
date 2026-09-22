"use client";

import type { OfficialIframePlayerModel } from "@/lib/games/game-player-model";
import IframeAdapterFrame from "./IframeAdapterFrame";
import type { AdapterStatusHandler } from "./adapter-types";

type OfficialIframeAdapterProps = {
  readonly model: OfficialIframePlayerModel;
  readonly onStatusChange: AdapterStatusHandler;
};

export default function OfficialIframeAdapter({ model, onStatusChange }: OfficialIframeAdapterProps) {
  return (
    <>
      <span className="game-player-source-chip">Official embed · {model.player.providerName}</span>
      <IframeAdapterFrame
        adapterType="OFFICIAL_IFRAME"
        src={model.player.src}
        title={`${model.name} official embed from ${model.player.providerName}`}
        loadingMessage={model.labels.loading}
        readyMessage={`${model.name} loaded from ${model.player.providerName}.`}
        errorMessage={model.labels.error}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
