import { FileText, Grid2X2, Maximize2, Monitor, Smartphone } from "lucide-react";
import { getGameCategory } from "../../data/game-categories";
import type { GameRecord } from "../../lib/games/game-schema";

const MOBILE_LABELS = {
  SUPPORTED: "Supported",
  PARTIAL: "Partial support",
  UNSUPPORTED: "Unsupported",
  UNKNOWN: "Not verified"
} as const satisfies Record<GameRecord["mobile"]["support"], string>;

const FULLSCREEN_LABELS = {
  SUPPORTED: "Supported",
  BROWSER_DEPENDENT: "Browser dependent",
  UNSUPPORTED: "Unsupported",
  NOT_APPLICABLE: "Not applicable"
} as const satisfies Record<GameRecord["fullscreen"]["availability"], string>;

type GameMetaProps = {
  readonly game: GameRecord;
};

export default function GameMeta({ game }: GameMetaProps) {
  const category = getGameCategory(game.category.primary);

  return (
    <dl className="game-meta" aria-label={`${game.name} details`}>
      <div>
        <dt><Monitor aria-hidden="true" size={20} />Experience</dt>
        <dd>{game.pageType === "EXTERNAL_TOOL" ? "External tool" : "Browser game"}</dd>
      </div>
      <div>
        <dt><Grid2X2 aria-hidden="true" size={20} />Category</dt>
        <dd>{category?.name ?? game.category.primary}</dd>
      </div>
      <div>
        <dt><Smartphone aria-hidden="true" size={20} />Mobile</dt>
        <dd>{MOBILE_LABELS[game.mobile.support]}</dd>
      </div>
      <div>
        <dt><Maximize2 aria-hidden="true" size={20} />Fullscreen</dt>
        <dd>{FULLSCREEN_LABELS[game.fullscreen.availability]}</dd>
      </div>
      <div>
        <dt><FileText aria-hidden="true" size={20} />Source</dt>
        <dd>{game.source.providerName}</dd>
      </div>
    </dl>
  );
}
