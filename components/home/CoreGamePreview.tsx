"use client";

import { forwardRef } from "react";
import FlashGenerator, {
  type FlashGeneratorHandle,
  type FlashGeneratorProps
} from "../FlashGenerator";

type CoreGamePreviewProps = FlashGeneratorProps & {
  readonly previewId: string;
  readonly cardLabel: string;
};

const CoreGamePreview = forwardRef<FlashGeneratorHandle, CoreGamePreviewProps>(function CoreGamePreview(
  { previewId, cardLabel, ...playerProps },
  ref
) {
  return (
    <div
      className="home-game-player-card home-core-game-preview"
      id={previewId}
      aria-label={cardLabel}
      data-core-game-preview
    >
      <FlashGenerator ref={ref} {...playerProps} />
    </div>
  );
});

export default CoreGamePreview;
