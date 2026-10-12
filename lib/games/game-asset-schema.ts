export const GAME_ASSET_MANIFEST_VERSION = "1.0.0" as const;
export const GAME_ASSET_CDN_ORIGIN = "https://static.mysquarefaceicon.com" as const;

export type GameAssetKind = "SWF" | "HTML5_BUNDLE" | "IMAGE" | "AUDIO";
export type GameAssetDelivery = "APP_STATIC" | "R2_CUSTOM_DOMAIN";
export type GameAssetRightsGate = "ALLOWED" | "REVIEW_REQUIRED";
export type GameAssetMigrationStatus =
  | "HOLD_CURRENT"
  | "KEEP_APP_STATIC_LCP"
  | "BLOCKED_RIGHTS_UNKNOWN"
  | "R2_CANDIDATE"
  | "MIGRATED";
export type GameAssetExclusionDecision = "EXCLUDED_RUNTIME" | "EXTERNAL_DIRECT_ONLY";

export type GameAssetEntry = {
  readonly assetId: string;
  readonly gameId: string;
  readonly kind: GameAssetKind;
  readonly delivery: GameAssetDelivery;
  readonly url: string;
  readonly objectKey: string | null;
  readonly bytes: number;
  readonly sha256: string;
  readonly contentType: string;
  readonly cacheControl: string;
  readonly licenseRegistryRecordId: string | null;
  readonly rightsGate: GameAssetRightsGate;
  readonly migrationStatus: GameAssetMigrationStatus;
  readonly sourcePath: string | null;
};

export type GameAssetManifest = {
  readonly schemaVersion: typeof GAME_ASSET_MANIFEST_VERSION;
  readonly manifestId: string;
  readonly cdnOrigin: typeof GAME_ASSET_CDN_ORIGIN;
  readonly objectKeyConvention: "games/{game-id}/{kind}/{sha256-prefix}/{filename}";
  readonly cachePolicies: {
    readonly appStatic: "public, max-age=0";
    readonly appStaticNoTransform?: "public, max-age=0, no-transform";
    readonly immutable: "public, max-age=31536000, immutable";
    readonly mutablePointer: "public, max-age=0, must-revalidate";
  };
  readonly exclusions: readonly {
    readonly id: string;
    readonly gameId: string | null;
    readonly decision: GameAssetExclusionDecision;
    readonly reference: string;
    readonly reason: string;
  }[];
  readonly assets: readonly GameAssetEntry[];
};

type UnknownRecord = Record<string, unknown>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha256Pattern = /^[a-f0-9]{64}$/;
const allowedKinds = new Set<GameAssetKind>(["SWF", "HTML5_BUNDLE", "IMAGE", "AUDIO"]);
const allowedDeliveries = new Set<GameAssetDelivery>(["APP_STATIC", "R2_CUSTOM_DOMAIN"]);
const allowedRightsGates = new Set<GameAssetRightsGate>(["ALLOWED", "REVIEW_REQUIRED"]);
const allowedMigrationStatuses = new Set<GameAssetMigrationStatus>([
  "HOLD_CURRENT",
  "KEEP_APP_STATIC_LCP",
  "BLOCKED_RIGHTS_UNKNOWN",
  "R2_CANDIDATE",
  "MIGRATED"
]);
const allowedExclusions = new Set<GameAssetExclusionDecision>(["EXCLUDED_RUNTIME", "EXTERNAL_DIRECT_ONLY"]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasSafeRootPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !/[?#\\\u0000-\u0020]/.test(value);
}

function hasSafeRepositoryPath(value: string) {
  return value.startsWith("public/") && !value.includes("\\") && !value.includes("..") && !/[?#\u0000-\u001f]/.test(value);
}

function contentTypeMatches(kind: GameAssetKind, url: string, contentType: string) {
  const pathname = url.toLowerCase();
  if (kind === "SWF") return pathname.endsWith(".swf") && contentType === "application/x-shockwave-flash";
  if (kind === "IMAGE") {
    return (
      (pathname.endsWith(".png") && contentType === "image/png") ||
      (pathname.endsWith(".webp") && contentType === "image/webp") ||
      (pathname.endsWith(".avif") && contentType === "image/avif") ||
      (pathname.endsWith(".svg") && contentType === "image/svg+xml") ||
      (pathname.endsWith(".jpg") && contentType === "image/jpeg") ||
      (pathname.endsWith(".jpeg") && contentType === "image/jpeg")
    );
  }
  if (kind === "AUDIO") return contentType.startsWith("audio/");
  return [
    "text/html",
    "text/css",
    "text/javascript",
    "application/javascript",
    "application/json",
    "application/wasm",
    "application/octet-stream"
  ].includes(contentType);
}

export function validateGameAssetManifest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Asset manifest must be an object."];

  if (value.schemaVersion !== GAME_ASSET_MANIFEST_VERSION) {
    errors.push(`manifest.schemaVersion must be ${GAME_ASSET_MANIFEST_VERSION}.`);
  }
  if (value.manifestId !== "mysquarefaceicon-game-assets") {
    errors.push("manifest.manifestId must be mysquarefaceicon-game-assets.");
  }
  if (value.cdnOrigin !== GAME_ASSET_CDN_ORIGIN) {
    errors.push(`manifest.cdnOrigin must be ${GAME_ASSET_CDN_ORIGIN}.`);
  }
  if (value.objectKeyConvention !== "games/{game-id}/{kind}/{sha256-prefix}/{filename}") {
    errors.push("manifest.objectKeyConvention drifted from the content-addressed convention.");
  }

  const cachePolicies = value.cachePolicies;
  if (!isRecord(cachePolicies)) {
    errors.push("manifest.cachePolicies must be an object.");
  } else {
    if (cachePolicies.appStatic !== "public, max-age=0") errors.push("manifest.cachePolicies.appStatic drifted.");
    if (cachePolicies.appStaticNoTransform !== undefined && cachePolicies.appStaticNoTransform !== "public, max-age=0, no-transform") {
      errors.push("manifest.cachePolicies.appStaticNoTransform must preserve revalidation and prevent transformations.");
    }
    if (cachePolicies.immutable !== "public, max-age=31536000, immutable") {
      errors.push("manifest.cachePolicies.immutable drifted.");
    }
    if (cachePolicies.mutablePointer !== "public, max-age=0, must-revalidate") {
      errors.push("manifest.cachePolicies.mutablePointer drifted.");
    }
  }

  if (!Array.isArray(value.exclusions)) {
    errors.push("manifest.exclusions must be an array.");
  } else {
    const ids = new Set<string>();
    value.exclusions.forEach((exclusion, index) => {
      const path = `manifest.exclusions[${index}]`;
      if (!isRecord(exclusion)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      for (const key of ["id", "decision", "reference", "reason"]) {
        if (!hasText(exclusion[key])) errors.push(`${path}.${key} must be a non-empty string.`);
      }
      if (hasText(exclusion.id)) {
        if (!slugPattern.test(exclusion.id) || ids.has(exclusion.id)) errors.push(`${path}.id must be unique kebab-case.`);
        ids.add(exclusion.id);
      }
      if (exclusion.gameId !== null && (!hasText(exclusion.gameId) || !slugPattern.test(exclusion.gameId))) {
        errors.push(`${path}.gameId must be null or kebab-case.`);
      }
      if (!allowedExclusions.has(exclusion.decision as GameAssetExclusionDecision)) {
        errors.push(`${path}.decision is not supported.`);
      }
    });
  }

  if (!Array.isArray(value.assets) || value.assets.length === 0) {
    errors.push("manifest.assets must be a non-empty array.");
    return errors;
  }

  const assetIds = new Set<string>();
  const objectKeys = new Set<string>();
  const urlMetadata = new Map<string, string>();
  value.assets.forEach((asset, index) => {
    const path = `manifest.assets[${index}]`;
    if (!isRecord(asset)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    for (const key of ["assetId", "gameId", "kind", "delivery", "url", "sha256", "contentType", "cacheControl", "rightsGate", "migrationStatus"]) {
      if (!hasText(asset[key])) errors.push(`${path}.${key} must be a non-empty string.`);
    }
    if (hasText(asset.assetId)) {
      if (!slugPattern.test(asset.assetId) || assetIds.has(asset.assetId)) errors.push(`${path}.assetId must be unique kebab-case.`);
      assetIds.add(asset.assetId);
    }
    if (hasText(asset.gameId) && !slugPattern.test(asset.gameId)) errors.push(`${path}.gameId must be kebab-case.`);
    if (!allowedKinds.has(asset.kind as GameAssetKind)) errors.push(`${path}.kind is not supported.`);
    if (!allowedDeliveries.has(asset.delivery as GameAssetDelivery)) errors.push(`${path}.delivery is not supported.`);
    if (!allowedRightsGates.has(asset.rightsGate as GameAssetRightsGate)) errors.push(`${path}.rightsGate is not supported.`);
    if (!allowedMigrationStatuses.has(asset.migrationStatus as GameAssetMigrationStatus)) {
      errors.push(`${path}.migrationStatus is not supported.`);
    }
    if (!Number.isInteger(asset.bytes) || (asset.bytes as number) <= 0) errors.push(`${path}.bytes must be a positive integer.`);
    if (!hasText(asset.sha256) || !sha256Pattern.test(asset.sha256)) errors.push(`${path}.sha256 must be lower-case SHA-256.`);
    if (asset.licenseRegistryRecordId !== null && !hasText(asset.licenseRegistryRecordId)) {
      errors.push(`${path}.licenseRegistryRecordId must be null or a non-empty string.`);
    }
    if (asset.sourcePath !== null && (!hasText(asset.sourcePath) || !hasSafeRepositoryPath(asset.sourcePath))) {
      errors.push(`${path}.sourcePath must be null or a safe public/ repository path.`);
    }
    if (hasText(asset.url) && hasText(asset.contentType) && allowedKinds.has(asset.kind as GameAssetKind)) {
      if (!contentTypeMatches(asset.kind as GameAssetKind, asset.url, asset.contentType)) {
        errors.push(`${path}.contentType does not match kind and URL extension.`);
      }
      const signature = `${asset.bytes}|${asset.sha256}|${asset.contentType}`;
      const previous = urlMetadata.get(asset.url);
      if (previous && previous !== signature) errors.push(`${path}.url reuses a file with conflicting byte/hash/MIME metadata.`);
      urlMetadata.set(asset.url, signature);
    }

    if (asset.delivery === "APP_STATIC") {
      if (!hasText(asset.url) || !hasSafeRootPath(asset.url)) errors.push(`${path}.url must be a safe root-relative APP_STATIC URL.`);
      if (asset.objectKey !== null) errors.push(`${path}.objectKey must be null for APP_STATIC.`);
      if (!hasText(asset.sourcePath) || asset.sourcePath !== `public${asset.url}`) {
        errors.push(`${path}.sourcePath must exactly map the APP_STATIC URL into public/.`);
      }
      if (isRecord(cachePolicies) && asset.cacheControl !== cachePolicies.appStatic
        && !(cachePolicies.appStaticNoTransform && asset.cacheControl === cachePolicies.appStaticNoTransform)) {
        errors.push(`${path}.cacheControl must use the APP_STATIC policy.`);
      }
      if (asset.migrationStatus === "R2_CANDIDATE" || asset.migrationStatus === "MIGRATED") {
        errors.push(`${path}.migrationStatus cannot claim R2 state while delivery is APP_STATIC.`);
      }
    }

    if (asset.delivery === "R2_CUSTOM_DOMAIN") {
      if (!hasText(asset.url)) {
        errors.push(`${path}.url must be the R2 custom-domain URL.`);
      } else {
        try {
          const parsed = new URL(asset.url);
          if (parsed.origin !== GAME_ASSET_CDN_ORIGIN) errors.push(`${path}.url must use the approved R2 custom domain.`);
          if (parsed.search || parsed.hash) errors.push(`${path}.url must not use query or fragment versioning.`);
          if (!hasText(asset.objectKey) || parsed.pathname !== `/${asset.objectKey}`) {
            errors.push(`${path}.url pathname must exactly match objectKey.`);
          }
        } catch {
          errors.push(`${path}.url must be a valid HTTPS URL.`);
        }
      }
      if (!hasText(asset.objectKey)) {
        errors.push(`${path}.objectKey must be present for R2_CUSTOM_DOMAIN.`);
      } else {
        if (objectKeys.has(asset.objectKey)) errors.push(`${path}.objectKey must be unique.`);
        objectKeys.add(asset.objectKey);
        const shaPrefix = hasText(asset.sha256) ? asset.sha256.slice(0, 16) : "";
        const kindSegment = String(asset.kind).toLowerCase().replace("_bundle", "");
        if (!asset.objectKey.startsWith(`games/${asset.gameId}/${kindSegment}/${shaPrefix}/`)) {
          errors.push(`${path}.objectKey must contain game, kind and the 16-character SHA-256 prefix.`);
        }
      }
      if (asset.rightsGate !== "ALLOWED") errors.push(`${path}.rightsGate must be ALLOWED before R2 delivery.`);
      if (asset.migrationStatus !== "R2_CANDIDATE" && asset.migrationStatus !== "MIGRATED") {
        errors.push(`${path}.migrationStatus must be R2_CANDIDATE or MIGRATED for R2 delivery.`);
      }
      if (isRecord(cachePolicies) && asset.cacheControl !== cachePolicies.immutable) {
        errors.push(`${path}.cacheControl must use the immutable R2 policy.`);
      }
      if (asset.sourcePath !== null && (!hasText(asset.sourcePath) || !hasSafeRepositoryPath(asset.sourcePath))) {
        errors.push(`${path}.sourcePath must be null or a safe migration source under public/.`);
      }
    }

    if (asset.migrationStatus === "KEEP_APP_STATIC_LCP" && (asset.kind !== "IMAGE" || asset.delivery !== "APP_STATIC")) {
      errors.push(`${path}.KEEP_APP_STATIC_LCP is valid only for APP_STATIC images.`);
    }
    if (asset.migrationStatus === "BLOCKED_RIGHTS_UNKNOWN") {
      if (asset.delivery !== "APP_STATIC" || asset.rightsGate !== "REVIEW_REQUIRED") {
        errors.push(`${path}.BLOCKED_RIGHTS_UNKNOWN must remain APP_STATIC and REVIEW_REQUIRED.`);
      }
    }
  });

  return errors;
}

// Workers Assets may add must-revalidate to a max-age=0 response. This tightens
// the same freshness policy; it must not hide missing no-transform or other drift.
export function matchesAssetCacheControl(actual: string | null, expected: string): boolean {
  if (!actual) return false;
  const required = new Set(expected.toLowerCase().split(",").map((value) => value.trim()));
  const received = new Set(actual.toLowerCase().split(",").map((value) => value.trim()));
  return [...required].every((directive) => received.has(directive))
    && [...received].every((directive) => required.has(directive)
      || (required.has("max-age=0") && directive === "must-revalidate"));
}
