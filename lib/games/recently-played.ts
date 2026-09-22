import type { GameRecord } from "./game-schema";
import { validateGameRecord } from "./game-schema";
import { gameCatalog } from "./catalog";
import { getPublicGameHref, listPublishedGames } from "./routes";
import type { RecentlyPlayedCandidate } from "../recently-played";
import { getGameImage } from "./game-images";

const playableTypes = new Set(["RUFFLE_SWF", "HTML5", "LOCAL_IFRAME", "OFFICIAL_IFRAME"]);

function isSafeLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !/[\\\u0000-\u0020]/.test(value);
}

function hasKnownLegacyIdentity(game: GameRecord) {
  if (!game.route.existingPublishedRoute) return true;
  return gameCatalog.some((known) => known.id === game.id && known.route.path === game.route.path);
}

export function resolveRecentlyPlayedCandidates(
  records: readonly GameRecord[] = gameCatalog
): readonly RecentlyPlayedCandidate[] {
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();

  return listPublishedGames(records).flatMap((game) => {
    const href = getPublicGameHref(game);
    if (
      validateGameRecord(game).length > 0 ||
      game.pageType !== "GAME" ||
      !playableTypes.has(game.player.type) ||
      !hasKnownLegacyIdentity(game) ||
      !isSafeLocalPath(href) ||
      seenIds.has(game.id) ||
      seenPaths.has(href)
    ) {
      return [];
    }

    seenIds.add(game.id);
    seenPaths.add(href);
    const thumbnail = getGameImage(game, "THUMBNAIL");
    const image = thumbnail && isSafeLocalPath(thumbnail.src)
      ? {
          src: thumbnail.src,
          alt: thumbnail.alt,
          width: thumbnail.width,
          height: thumbnail.height
        }
      : null;

    return [{ gameId: game.id, name: game.name, href, summary: game.content.summary, image }];
  });
}
