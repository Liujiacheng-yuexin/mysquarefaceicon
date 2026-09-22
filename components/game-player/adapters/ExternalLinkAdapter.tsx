import { ExternalLink, Gamepad2 } from "lucide-react";
import type { ExternalLinkPlayerModel } from "@/lib/games/game-player-model";

type ExternalLinkAdapterProps = {
  readonly model: ExternalLinkPlayerModel;
};

export default function ExternalLinkAdapter({ model }: ExternalLinkAdapterProps) {
  return (
    <div className="external-open-panel" data-player-adapter="EXTERNAL_LINK">
      <div className="external-open-icon" aria-hidden="true">
        <Gamepad2 size={42} />
      </div>
      <div>
        <p className="eyebrow">External tool · {model.source.providerName}</p>
        <h3>Open the generator on the original site</h3>
        <p>
          This tool is provided by {model.source.providerName}. My Square Face Icon does not host, copy, proxy, or
          iframe the generator; the button opens the verified original page in a new tab.
        </p>
        {model.source.attribution && <p className="game-player-attribution">{model.source.attribution}</p>}
        <a
          className="hero-primary-link"
          href={model.player.url}
          target={model.player.target}
          rel={model.player.rel.join(" ")}
        >
          {model.player.ctaLabel}
          <ExternalLink aria-hidden="true" size={18} />
        </a>
      </div>
    </div>
  );
}
