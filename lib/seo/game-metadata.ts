import type { Metadata } from "next";
import type { GameRecord } from "../games/game-schema";
import { getGameOpenGraphImage } from "../games/game-images";
import { isIndexAllowedNewGame } from "../games/friend-quiz-policy";

const SITE_NAME = "My Square Face Icon";
const PRODUCTION_HOST = "mysquarefaceicon.com";

export type GameMetadataOptions = {
  readonly forceNoIndex?: boolean;
  readonly follow?: boolean;
  readonly languages?: Readonly<Record<string, string>>;
  readonly openGraphLocale?: string;
};

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function canonicalPath(canonical: string) {
  try {
    const url = new URL(canonical);
    return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function expectedCanonicalPath(path: string) {
  return path === "/" ? "/" : path.replace(/\/$/, "");
}

export function validateGameMetadata(game: GameRecord): string[] {
  const errors: string[] = [];
  const requiredFields = [
    ["seo.title", game.seo.title],
    ["seo.description", game.seo.description],
    ["seo.h1", game.seo.h1],
    ["seo.canonical", game.seo.canonical]
  ] as const;

  for (const [field, value] of requiredFields) {
    if (!hasText(value)) errors.push(`${game.id}.${field} must be a non-empty string.`);
  }

  if (game.seo.canonical !== game.route.canonical) {
    errors.push(`${game.id}.seo.canonical must match route.canonical.`);
  }

  try {
    const canonical = new URL(game.seo.canonical);
    if (canonical.protocol !== "https:") {
      errors.push(`${game.id}.seo.canonical must use HTTPS.`);
    }
    if (canonical.hostname !== PRODUCTION_HOST) {
      errors.push(`${game.id}.seo.canonical must use ${PRODUCTION_HOST}.`);
    }
    if (canonical.search || canonical.hash) {
      errors.push(`${game.id}.seo.canonical cannot contain a query or hash.`);
    }
  } catch {
    errors.push(`${game.id}.seo.canonical must be a valid absolute URL.`);
  }

  if (canonicalPath(game.seo.canonical) !== expectedCanonicalPath(game.route.path)) {
    errors.push(`${game.id}.seo.canonical pathname must match route.path.`);
  }

  if (game.route.existingPublishedRoute && !game.route.path.startsWith("/")) {
    errors.push(`${game.id}.route.path must preserve an absolute legacy path.`);
  }

  const openGraphImages = game.images.filter((image) => image.role === "OPEN_GRAPH");
  if (openGraphImages.length !== 1) {
    errors.push(`${game.id}.images must contain exactly one OPEN_GRAPH image.`);
  } else {
    const [image] = openGraphImages;
    if (!hasText(image.src)) errors.push(`${game.id}.OPEN_GRAPH.src must be a non-empty path or URL.`);
    if (!hasText(image.alt)) errors.push(`${game.id}.OPEN_GRAPH.alt must be non-empty.`);
    if (!Number.isSafeInteger(image.width) || !Number.isSafeInteger(image.height)) {
      errors.push(`${game.id}.OPEN_GRAPH width and height are required for stable metadata.`);
    }
  }

  return errors;
}

export function validateGameMetadataCatalog(games: readonly GameRecord[]): string[] {
  const errors = games.flatMap(validateGameMetadata);
  const uniqueIndexFields = [
    ["title", (game: GameRecord) => game.seo.title],
    ["description", (game: GameRecord) => game.seo.description],
    ["canonical", (game: GameRecord) => game.seo.canonical]
  ] as const;
  const indexGames = games.filter((game) => game.route.indexStatus === "INDEX");

  for (const [field, getValue] of uniqueIndexFields) {
    const owners = new Map<string, string>();
    for (const game of indexGames) {
      const value = getValue(game);
      const existingOwner = owners.get(value);
      if (existingOwner) {
        errors.push(`Index game ${game.id} duplicates ${field} from ${existingOwner}.`);
      } else {
        owners.set(value, game.id);
      }
    }
  }

  return errors;
}

export function assertValidGameMetadata(game: GameRecord): void {
  const errors = validateGameMetadata(game);
  if (errors.length > 0) {
    throw new Error(`Invalid game metadata for ${game.id}:\n- ${errors.join("\n- ")}`);
  }
}

export function assertValidGameMetadataCatalog(games: readonly GameRecord[]): void {
  const errors = validateGameMetadataCatalog(games);
  if (errors.length > 0) {
    throw new Error(`Invalid game metadata catalog:\n- ${errors.join("\n- ")}`);
  }
}

export function getGamePageH1(game: GameRecord): string {
  assertValidGameMetadata(game);
  return game.seo.h1;
}

export function buildGameMetadata(game: GameRecord, options: GameMetadataOptions = {}): Metadata {
  assertValidGameMetadata(game);

  const openGraphImage = getGameOpenGraphImage(game);

  const noIndex = options.forceNoIndex === true || game.route.indexStatus === "NOINDEX"
    || (!game.route.existingPublishedRoute && !isIndexAllowedNewGame(game));
  const follow = options.follow ?? true;

  return {
    title: {
      absolute: game.seo.title
    },
    description: game.seo.description,
    alternates: {
      canonical: game.seo.canonical,
      ...(options.languages ? { languages: options.languages } : {})
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow,
            googleBot: {
              index: false,
              follow
            }
          }
        }
      : {}),
    openGraph: {
      type: "website",
      url: game.seo.canonical,
      title: game.seo.title,
      description: game.seo.description,
      siteName: SITE_NAME,
      ...(options.openGraphLocale ? { locale: options.openGraphLocale } : {}),
      images: [
        {
          url: openGraphImage.src,
          width: openGraphImage.width,
          height: openGraphImage.height,
          alt: openGraphImage.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: game.seo.title,
      description: game.seo.description,
      images: [openGraphImage.src]
    }
  };
}

export function buildMissingGameMetadata(): Metadata {
  return {
    title: {
      absolute: "Page Not Found | My Square Face Icon"
    },
    robots: {
      index: false,
      follow: false
    }
  };
}
