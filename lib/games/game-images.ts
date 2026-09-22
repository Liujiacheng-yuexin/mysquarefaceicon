import type { GameImage, GameImageRole, GameRecord } from "./game-schema";

export const GAME_IMAGE_USAGE = Object.freeze({
  THUMBNAIL: "cards-related-recent-favorites",
  LANDSCAPE_COVER: "optional-landscape-marketing-cover",
  PLAYER_PREVIEW: "click-to-load-player-preview",
  OPEN_GRAPH: "metadata-only"
} satisfies Readonly<Record<GameImageRole, string>>);

export function getGameImage(game: GameRecord, role: GameImageRole): GameImage | null {
  return game.images.find((image) => image.role === role) ?? null;
}

export function requireGameImage(game: GameRecord, role: GameImageRole): GameImage {
  const image = getGameImage(game, role);
  if (!image) throw new Error(`${game.id} requires exactly one ${role} image.`);
  return image;
}

export function getGameThumbnail(game: GameRecord): GameImage {
  return requireGameImage(game, "THUMBNAIL");
}

export function getGamePlayerPreview(game: GameRecord): GameImage | null {
  return getGameImage(game, "PLAYER_PREVIEW");
}

export function getGameOpenGraphImage(game: GameRecord): GameImage {
  return requireGameImage(game, "OPEN_GRAPH");
}
