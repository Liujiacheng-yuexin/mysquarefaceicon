"use client";

import { ExternalLink, Flag, Maximize2, Play, RotateCcw } from "lucide-react";
import {
  getPlayerCapabilities,
  type ExternalLinkPlayerModel,
  type PlayablePlayerModel
} from "../../lib/games/game-player-model";

type ExternalGameControlsProps = {
  readonly model: ExternalLinkPlayerModel;
};

type PlayableGameControlsProps = {
  readonly model: PlayablePlayerModel;
  readonly activated: boolean;
  readonly fullscreenAvailable: boolean;
  readonly onActivateOrReload: () => void;
  readonly onReload?: () => void;
  readonly onToggleFullscreen: () => void | Promise<void>;
};

export type GameControlsProps = ExternalGameControlsProps | PlayableGameControlsProps;

function isExternalControlsProps(props: GameControlsProps): props is ExternalGameControlsProps {
  return props.model.type === "EXTERNAL_LINK";
}

export default function GameControls(props: GameControlsProps) {
  if (isExternalControlsProps(props)) {
    const { model } = props;
    return (
      <div className="game-control-bar" aria-label="External tool controls">
        <a className="tool-button secondary" href={model.reportHref}>
          <Flag aria-hidden="true" size={18} />
          {model.labels.help}
        </a>
      </div>
    );
  }

  const { model } = props;
  const capabilities = getPlayerCapabilities(model.type);
  const { activated, fullscreenAvailable, onActivateOrReload, onReload, onToggleFullscreen } = props;

  return (
    <div className="game-control-bar" aria-label="Game controls">
      {model.showStartControl && !activated && capabilities.play && (
        <button className="tool-button primary" type="button" onClick={onActivateOrReload}>
          <Play aria-hidden="true" size={18} />
          {model.labels.start}
        </button>
      )}
      {fullscreenAvailable && (
        <button className="tool-button secondary" type="button" onClick={() => void onToggleFullscreen()}>
          <Maximize2 aria-hidden="true" size={18} />
          Fullscreen
        </button>
      )}
      {capabilities.reload && (
        <button className="tool-button secondary" type="button" onClick={onReload ?? onActivateOrReload}>
          <RotateCcw aria-hidden="true" size={18} />
          {model.labels.reload}
        </button>
      )}
      {capabilities.outbound && model.source.originalUrl && (
        <a
          className="tool-button secondary"
          href={model.source.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink aria-hidden="true" size={18} />
          Open Original
        </a>
      )}
      <a className="tool-button secondary" href={model.reportHref}>
        <Flag aria-hidden="true" size={18} />
        {model.labels.help}
      </a>
    </div>
  );
}
