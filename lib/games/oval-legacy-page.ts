import { gameCatalog } from "./catalog";
import { validateGameRecord, type GameLegacyPageContent, type GameRecord, type NonEmptyReadonlyArray } from "./game-schema";
import { getGamePlayerPreview } from "./game-images";
import { getPublicGameHref, listPublishedGames } from "./routes";

export type OvalLegacyPlayerProps = GameLegacyPageContent["playerPresentation"] & {
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
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

// Scoped presentation for the existing Oval compatibility entry. This does not
// produce a GamePlayerModel, grant rights, or bypass the generic release policy.
export function resolveOvalLegacyPage(game: GameRecord, records: readonly GameRecord[] = gameCatalog) {
  const errors = validateGameRecord(game);
  if (errors.length > 0) throw new Error(`Invalid Oval legacy record: ${errors.join(" ")}`);
  if (
    game.id !== "oval-face" ||
    game.route.path !== "/oval-face-icon-generator" ||
    !game.route.existingPublishedRoute ||
    game.status !== "PUBLISHED" ||
    game.player.type !== "RUFFLE_SWF"
  ) {
    throw new Error("The Oval legacy page requires its existing published RUFFLE_SWF record.");
  }
  const content = game.content.legacyPage;
  if (!content) throw new Error("The Oval legacy page presentation is missing from Game Data.");

  const cover = getGamePlayerPreview(game);
  if (!cover || !isLocalPath(cover.src) || !isDimension(cover.width) || !isDimension(cover.height)) {
    throw new Error("The Oval legacy page requires a local cover with explicit positive integer dimensions.");
  }
  if (!game.player.swfSources.every(isLocalPath)) {
    throw new Error("The Oval compatibility entry requires local SWF paths.");
  }
  const presentation = content.playerPresentation;
  const maxWidth = Number.parseFloat(presentation.maxWidth);
  if (!/^\d+(?:\.\d+)?px$/.test(presentation.maxWidth) || !Number.isFinite(maxWidth) || maxWidth <= 0) {
    throw new Error("The Oval legacy page requires a positive pixel maxWidth.");
  }
  const ratio = game.player.aspectRatio.split("/").map((part) => Number(part.trim()));
  if (ratio.length !== 2 || !ratio.every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error("The Oval legacy page requires a positive width / height aspect ratio.");
  }
  const player: OvalLegacyPlayerProps = {
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

  const publicGamesById = new Map(
    listPublishedGames(records)
      .filter((record) => isLocalPath(getPublicGameHref(record)))
      .map((record) => [record.id, record])
  );
  const copyById = new Map(content.relatedGames.map((item) => [item.gameId, item]));
  const seenIds = new Set([game.id]);
  const relatedGames = game.relatedGameIds.flatMap((gameId) => {
    if (seenIds.has(gameId)) return [];
    const target = publicGamesById.get(gameId);
    const copy = copyById.get(gameId);
    if (!target || !copy) return [];
    seenIds.add(gameId);
    return [{ ...copy, href: getPublicGameHref(target) }];
  });
  const sidebarGames = relatedGames.map(({ title, text, href, imageSrc, imageAlt }) => ({
    title, text, href, imageSrc, imageAlt
  }));
  const relatedCards = relatedGames.flatMap(({ relatedCard, href, gameId }) =>
    relatedCard ? [{ ...relatedCard, href, gameId }] : []
  );

  return { player, content, sidebarGames, relatedCards };
}
