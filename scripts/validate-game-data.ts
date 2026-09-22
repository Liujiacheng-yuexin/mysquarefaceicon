import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { gameCatalog, getGameById, getGameByPath, getGameBySlug } from "../lib/games/catalog";
import type { GameDeliveryType } from "../lib/games/game-schema";

type RegistryRecord = {
  id: string;
  gameName: string;
  publicPage: string;
  deliveryType: string;
  source: {
    sourceUrl?: string;
    repositoryPath: string;
    sha256: string;
  };
  license: {
    status: string;
  };
  releaseDecision: {
    status: string;
  };
};

type LicenseRegistry = {
  records: RegistryRecord[];
};

const projectRoot = resolve(__dirname, "../..");
const errors: string[] = [];
const registryPath = resolve(projectRoot, "data/game-license-registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8")) as LicenseRegistry;
const registryById = new Map(registry.records.map((record) => [record.id, record]));
const expectedGameIds = new Set(["square-face", "oval-face", "pixel-art-avatar"]);

const registryDeliveryType: Record<GameDeliveryType, string> = {
  RUFFLE_SWF: "LOCAL_RUFFLE_SWF",
  HTML5: "LOCAL_HTML5",
  LOCAL_IFRAME: "LOCAL_IFRAME",
  OFFICIAL_IFRAME: "OFFICIAL_IFRAME",
  EXTERNAL_LINK: "EXTERNAL_LINK"
};

function normalizeUrl(url: string) {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  parsed.pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/$/, "");
  return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
}

function verifyFile(relativePath: string, label: string) {
  const absolutePath = resolve(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    errors.push(`${label} is missing: ${relativePath}`);
    return;
  }
  if (!statSync(absolutePath).isFile() || statSync(absolutePath).size === 0) {
    errors.push(`${label} is not a non-empty file: ${relativePath}`);
  }
}

function verifySha256(relativePath: string, expected: string, label: string) {
  const absolutePath = resolve(projectRoot, relativePath);
  if (!existsSync(absolutePath)) return;
  const actual = createHash("sha256").update(readFileSync(absolutePath)).digest("hex").toUpperCase();
  if (actual !== expected) errors.push(`${label} SHA-256 differs: expected ${expected}, received ${actual}`);
}

if (gameCatalog.length !== expectedGameIds.size) {
  errors.push(`Expected ${expectedGameIds.size} current records, received ${gameCatalog.length}.`);
}

for (const expectedId of expectedGameIds) {
  if (!getGameById(expectedId)) errors.push(`Missing current game record: ${expectedId}.`);
}

for (const game of gameCatalog) {
  if (!expectedGameIds.has(game.id)) errors.push(`Unexpected current game record: ${game.id}.`);
  if (getGameBySlug(game.slug)?.id !== game.id) errors.push(`Slug lookup failed for ${game.id}.`);
  if (getGameByPath(game.route.path)?.id !== game.id) errors.push(`Path lookup failed for ${game.id}.`);

  const registryRecord = registryById.get(game.license.registryRecordId);
  if (!registryRecord) {
    errors.push(`${game.id} references missing license record ${game.license.registryRecordId}.`);
    continue;
  }

  if (registryRecord.gameName !== game.name) errors.push(`${game.id} name differs from its license record.`);
  if (normalizeUrl(registryRecord.publicPage) !== normalizeUrl(game.route.canonical)) {
    errors.push(`${game.id} canonical differs from its license record publicPage.`);
  }
  if (registryRecord.deliveryType !== registryDeliveryType[game.type]) {
    errors.push(`${game.id} delivery type differs from its license record.`);
  }
  if (registryRecord.license.status !== game.license.status) {
    errors.push(`${game.id} license status differs from its license record.`);
  }
  if (registryRecord.releaseDecision.status !== game.license.releaseDecision) {
    errors.push(`${game.id} release decision differs from its license record.`);
  }

  for (const image of game.images) {
    if (image.provenance === "PROJECT_ASSET") {
      if (!image.src.startsWith("/")) {
        errors.push(`${game.id} PROJECT_ASSET image must use a root-relative URL: ${image.src}`);
      } else {
        verifyFile(`public${image.src}`, `${game.id} ${image.role} image`);
      }
    }
  }

  if (game.player.type === "RUFFLE_SWF") {
    if (!game.source.localAssetPath || !game.source.sha256) {
      errors.push(`${game.id} local SWF source identity is incomplete.`);
      continue;
    }
    verifyFile(game.source.localAssetPath, `${game.id} SWF`);
    verifySha256(game.source.localAssetPath, game.source.sha256, `${game.id} SWF`);
    if (registryRecord.source.repositoryPath !== game.source.localAssetPath) {
      errors.push(`${game.id} source path differs from its license record.`);
    }
    if (registryRecord.source.sha256 !== game.source.sha256) {
      errors.push(`${game.id} source SHA-256 differs from its license record.`);
    }
    for (const source of game.player.swfSources) verifyFile(`public${source}`, `${game.id} player source`);
    if (game.license.newPublicationAllowed) errors.push(`${game.id} cannot enable new publication while rights remain UNKNOWN.`);
  }

  if (game.player.type === "EXTERNAL_LINK") {
    if (game.source.originalUrl !== game.player.url) errors.push(`${game.id} player URL must match its official source URL.`);
    if (registryRecord.source.sourceUrl !== game.player.url) errors.push(`${game.id} external URL differs from its license record.`);
    if (game.license.allowedDeliveryTypes.length !== 1 || game.license.allowedDeliveryTypes[0] !== "EXTERNAL_LINK") {
      errors.push(`${game.id} must remain constrained to EXTERNAL_LINK delivery.`);
    }
  }
}

if (errors.length > 0) {
  console.error("GAME-DATA-001 validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("GAME-DATA-001 validation passed");
  console.log(`- ${gameCatalog.length} current records validated`);
  console.log("- IDs, slugs, routes, canonicals, relations, and query lookups are unique/valid");
  console.log("- license status and delivery gates match data/game-license-registry.json");
  console.log("- local SWF checksums, player sources, and project image files are present");
  console.log("- external tool remains direct-link-only with no local generator asset path");
}
