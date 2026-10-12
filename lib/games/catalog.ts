import ovalFaceGame from "../../data/games/oval-face";
import pixelArtAvatarGame from "../../data/games/pixel-art-avatar";
import squareFaceGame from "../../data/games/square-face";
import friendBlockTest from "../../data/games/friend-block-test";
import { defineGameCatalog, type GameRecord } from "./game-schema";

export const gameCatalog = defineGameCatalog([
  squareFaceGame,
  ovalFaceGame,
  pixelArtAvatarGame,
  friendBlockTest
]);

const gamesById = new Map(gameCatalog.map((game) => [game.id, game]));
const gamesBySlug = new Map(gameCatalog.map((game) => [game.slug, game]));
const gamesByPath = new Map(gameCatalog.map((game) => [game.route.path, game]));

export function getGameById(id: string): GameRecord | undefined {
  return gamesById.get(id);
}

export function getGameBySlug(slug: string): GameRecord | undefined {
  return gamesBySlug.get(slug);
}

export function getGameByPath(path: string): GameRecord | undefined {
  return gamesByPath.get(path);
}
