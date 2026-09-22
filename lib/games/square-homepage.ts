import { validateGameRecord, type GameHomepageContent, type GameRecord, type NonEmptyReadonlyArray } from "./game-schema";
import { getGamePageH1 } from "../seo/game-metadata";
import { getGamePlayerPreview, getGameThumbnail } from "./game-images";

export type SquareHomepagePlayerProps = GameHomepageContent["playerPresentation"] & {
  readonly gameId: string;
  readonly gameName: string;
  readonly swfSources: NonEmptyReadonlyArray<string>;
  readonly coverImageUrl: string;
  readonly backgroundColor: string;
  readonly aspectRatio: string;
  readonly coverImageWidth: number;
  readonly coverImageHeight: number;
};

function isLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !/[\\\u0000-\u0020]/.test(value);
}

function isDimension(value: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// Presentation for the existing Square compatibility entry, not a GamePlayerModel
// or a license grant. The generic model's fail-closed release policy stays separate.
export function resolveSquareHomepage(game: GameRecord) {
  const errors = validateGameRecord(game);
  if (errors.length > 0) throw new Error(`Invalid Square homepage record: ${errors.join(" ")}`);
  if (
    game.id !== "square-face" ||
    game.route.path !== "/" ||
    !game.route.existingPublishedRoute ||
    game.player.type !== "RUFFLE_SWF"
  ) {
    throw new Error("The Square homepage requires its existing root RUFFLE_SWF record.");
  }
  const content = game.content.homepage;
  if (!content) throw new Error("The Square homepage presentation is missing from Game Data.");

  const cover = getGamePlayerPreview(game);
  const artwork = getGameThumbnail(game);
  if (!cover || !isLocalPath(cover.src) || !isDimension(cover.width) || !isDimension(cover.height)) {
    throw new Error("The Square homepage requires a local cover with explicit positive dimensions.");
  }
  if (!artwork || !isLocalPath(artwork.src)) {
    throw new Error("The Square homepage requires its local game artwork.");
  }
  if (!game.player.swfSources.every(isLocalPath)) {
    throw new Error("The Square compatibility entry requires local SWF paths.");
  }

  const presentation = content.playerPresentation;
  const player: SquareHomepagePlayerProps = {
    gameId: game.id,
    gameName: game.name,
    swfSources: game.player.swfSources,
    coverImageUrl: cover.src,
    backgroundColor: game.player.backgroundColor,
    aspectRatio: game.player.aspectRatio,
    coverImageWidth: cover.width,
    coverImageHeight: cover.height,
    ariaLabel: presentation.ariaLabel,
    coverLabel: presentation.coverLabel,
    loadingMessage: presentation.loadingMessage,
    errorMessage: presentation.errorMessage,
    slowLoadingHint: presentation.slowLoadingHint,
    deviceNotice: presentation.deviceNotice,
    maxWidth: presentation.maxWidth,
    reportHref: presentation.reportHref,
    startLabel: presentation.startLabel,
    reloadLabel: presentation.reloadLabel,
    helpLabel: presentation.helpLabel,
    showStartControl: presentation.showStartControl
  };

  return { h1: getGamePageH1(game), player, content, artworkSrc: artwork.src };
}
