import licenseRegistry from "../../data/game-license-registry.json";
import { createGamePlayerModel, assertValidGamePlayerModel } from "./game-player-model";
import { validateGameRecord, type GameRecord } from "./game-schema";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSafeHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith("https://") || /[\\\u0000-\u0020]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

// Server-side binding for this existing direct-link page, not a new permission
// model. Contradictory or missing record/Registry evidence must stop rendering.
export function resolvePixelExternalPage(game: GameRecord, registry: unknown = licenseRegistry) {
  const errors = validateGameRecord(game);
  if (errors.length) throw new Error(`Invalid Pixel external record: ${errors.join(" ")}`);
  if (
    game.id !== "pixel-art-avatar" ||
    game.route.path !== "/pixel-art-avatar-icon-generator" ||
    !game.route.existingPublishedRoute ||
    game.status !== "PUBLISHED" ||
    game.pageType !== "EXTERNAL_TOOL" ||
    game.type !== "EXTERNAL_LINK" ||
    game.player.type !== "EXTERNAL_LINK" ||
    game.license.registryRecordId !== "pixel-avatar-external" ||
    game.license.status !== "RESTRICTED" ||
    game.license.releaseDecision !== "DIRECT_LINK_ONLY" ||
    game.license.newPublicationAllowed !== true ||
    game.license.allowedDeliveryTypes.length !== 1 ||
    game.license.allowedDeliveryTypes[0] !== "EXTERNAL_LINK"
  ) {
    throw new Error("The Pixel page requires its published, restricted, direct-link-only External Tool record.");
  }
  if (!isObject(registry) || !Array.isArray(registry.records)) {
    throw new Error("The Pixel page requires a License Registry.");
  }
  const matches = registry.records.filter(record => isObject(record) && record.id === game.license.registryRecordId);
  const evidence = matches[0];
  if (
    matches.length !== 1 || !isObject(evidence) ||
    evidence.publicPage !== game.route.canonical ||
    evidence.deliveryType !== "EXTERNAL_LINK" ||
    !isObject(evidence.releaseDecision) || evidence.releaseDecision.status !== "DIRECT_LINK_ONLY" ||
    !isObject(evidence.license) || evidence.license.status !== game.license.status ||
    !isObject(evidence.source) || evidence.source.sourceUrl !== game.source.originalUrl ||
    !isObject(evidence.permissions) || !isObject(evidence.permissions.directLinkAllowed) ||
    evidence.permissions.directLinkAllowed.status !== "YES"
  ) {
    throw new Error("Pixel Game Data and its direct-link License Registry evidence must agree.");
  }
  if (
    !isSafeHttpsUrl(game.player.url) || game.player.url !== game.source.originalUrl ||
    !isSafeHttpsUrl(evidence.license.licenseEvidenceUrl)
  ) {
    throw new Error("Pixel requires matching safe HTTPS original-page URLs and a safe HTTPS Terms of Use URL.");
  }

  const player = createGamePlayerModel(game, {
    ariaLabel: "Pixel Art Avatar Icon Generator external tool",
    deviceNotice:
      "The original site's mobile behavior has not been independently verified. Detailed controls are usually easier on desktop or in landscape mode.",
    labels: { help: "Report Issue" }
  });
  assertValidGamePlayerModel(player);
  if (player.type !== "EXTERNAL_LINK") throw new Error("Pixel must use the existing ExternalLinkAdapter.");

  return { originalUrl: game.player.url, termsUrl: evidence.license.licenseEvidenceUrl, player };
}
