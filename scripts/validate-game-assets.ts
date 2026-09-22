import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { gameCatalog } from "../lib/games/catalog";
import {
  GAME_ASSET_CDN_ORIGIN,
  validateGameAssetManifest,
  type GameAssetEntry,
  type GameAssetManifest
} from "../lib/games/game-asset-schema";

type RegistryRecord = {
  id: string;
  license: { status: string };
  permissions?: { assetRedistributionAllowed?: unknown };
  releaseDecision: { status: string };
};

type LicenseRegistry = { records: RegistryRecord[] };

type MutableAsset = {
  -readonly [Key in keyof GameAssetEntry]: GameAssetEntry[Key];
};

type SyntheticManifest = {
  schemaVersion: string;
  manifestId: string;
  cdnOrigin: string;
  objectKeyConvention: string;
  cachePolicies: {
    appStatic: string;
    immutable: string;
    mutablePointer: string;
  };
  exclusions: Array<{
    id: string;
    gameId: string | null;
    decision: string;
    reference: string;
    reason: string;
  }>;
  assets: MutableAsset[];
};

const projectRoot = resolve(__dirname, "../..");
const manifestPath = resolve(projectRoot, "data/game-asset-manifest.json");
const registryPath = resolve(projectRoot, "data/game-license-registry.json");
const rawManifest: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
const registry = JSON.parse(readFileSync(registryPath, "utf8")) as LicenseRegistry;
const registryById = new Map(registry.records.map((record) => [record.id, record]));
const gamesById = new Map(gameCatalog.map((game) => [game.id, game]));

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function isYes(value: unknown) {
  if (value === "YES") return true;
  return typeof value === "object" && value !== null && "status" in value && value.status === "YES";
}

function validateProjectContract(value: unknown, verifyLocalFiles = true): string[] {
  const errors = validateGameAssetManifest(value);
  if (errors.length > 0) return errors;
  const manifest = value as GameAssetManifest;

  const ruffleExclusion = manifest.exclusions.find((entry) => entry.id === "ruffle-runtime");
  if (
    !ruffleExclusion ||
    ruffleExclusion.decision !== "EXCLUDED_RUNTIME" ||
    ruffleExclusion.reference !== "data/ruffle-runtime-manifest.json"
  ) {
    errors.push("Ruffle must remain excluded and governed by data/ruffle-runtime-manifest.json.");
  }
  const pixelExclusion = manifest.exclusions.find((entry) => entry.id === "pixel-avatar-external");
  if (
    !pixelExclusion ||
    pixelExclusion.gameId !== "pixel-art-avatar" ||
    pixelExclusion.decision !== "EXTERNAL_DIRECT_ONLY" ||
    pixelExclusion.reference !== "https://www.icongenerators.net/pixelavatar.html"
  ) {
    errors.push("Pixel must remain an explicit EXTERNAL_DIRECT_ONLY exclusion.");
  }

  const expectedReferences: Array<{ gameId: string; url: string; kind: "IMAGE" | "SWF" }> = [];
  for (const game of gameCatalog) {
    for (const image of game.images) expectedReferences.push({ gameId: game.id, url: image.src, kind: "IMAGE" });
    if (game.player.type === "RUFFLE_SWF") {
      for (const url of game.player.swfSources) expectedReferences.push({ gameId: game.id, url, kind: "SWF" });
    }
  }

  for (const reference of expectedReferences) {
    const matches = manifest.assets.filter(
      (asset) => asset.gameId === reference.gameId && asset.url === reference.url && asset.kind === reference.kind
    );
    if (matches.length !== 1) {
      errors.push(`${reference.gameId} ${reference.kind} ${reference.url} must map to exactly one manifest asset.`);
    }
  }

  for (const asset of manifest.assets) {
    const game = gamesById.get(asset.gameId);
    if (!game) {
      errors.push(`${asset.assetId} references an unknown game ID.`);
      continue;
    }
    if (asset.url.startsWith("/ruffle/") || asset.sourcePath?.startsWith("public/ruffle/")) {
      errors.push(`${asset.assetId} must not take over Ruffle runtime files.`);
    }
    if (game.player.type === "EXTERNAL_LINK") {
      if (asset.kind !== "IMAGE" || asset.delivery !== "APP_STATIC") {
        errors.push(`${asset.assetId} must not host or migrate assets for the Pixel external tool.`);
      }
      if (asset.url === game.player.url || asset.sourcePath?.includes("icongenerators.net")) {
        errors.push(`${asset.assetId} must not copy or hotlink the Pixel external tool.`);
      }
    }

    if (asset.delivery === "R2_CUSTOM_DOMAIN") {
      const registryRecord = asset.licenseRegistryRecordId
        ? registryById.get(asset.licenseRegistryRecordId)
        : undefined;
      if (
        !registryRecord ||
        registryRecord.license.status !== "VERIFIED" ||
        registryRecord.releaseDecision.status !== "APPROVED" ||
        !isYes(registryRecord.permissions?.assetRedistributionAllowed) ||
        game.license.registryRecordId !== asset.licenseRegistryRecordId ||
        game.license.status !== "VERIFIED" ||
        game.license.releaseDecision !== "APPROVED" ||
        game.license.newPublicationAllowed !== true
      ) {
        errors.push(`${asset.assetId} cannot use R2 until exact redistribution rights and Game Data release gates are verified.`);
      }
    }

    if (asset.licenseRegistryRecordId) {
      const registryRecord = registryById.get(asset.licenseRegistryRecordId);
      if (!registryRecord) {
        errors.push(`${asset.assetId} references a missing license registry record.`);
      } else if (
        asset.migrationStatus === "BLOCKED_RIGHTS_UNKNOWN" &&
        (registryRecord.license.status !== "UNKNOWN" || registryRecord.releaseDecision.status !== "REVIEW_REQUIRED")
      ) {
        errors.push(`${asset.assetId} rights block must match the UNKNOWN/REVIEW_REQUIRED registry state.`);
      }
      if (game.license.registryRecordId !== asset.licenseRegistryRecordId) {
        errors.push(`${asset.assetId} license record must match its Game Data record.`);
      }
    }

    if (asset.delivery === "APP_STATIC" && verifyLocalFiles && asset.sourcePath) {
      const absolutePath = resolve(projectRoot, asset.sourcePath);
      if (!existsSync(absolutePath)) {
        errors.push(`${asset.assetId} local file is missing.`);
      } else if (!statSync(absolutePath).isFile()) {
        errors.push(`${asset.assetId} sourcePath is not a file.`);
      } else {
        const bytes = statSync(absolutePath).size;
        if (bytes !== asset.bytes) errors.push(`${asset.assetId} byte length drifted: ${bytes} !== ${asset.bytes}.`);
        const digest = sha256(absolutePath);
        if (digest !== asset.sha256) errors.push(`${asset.assetId} SHA-256 drifted: ${digest} !== ${asset.sha256}.`);
      }
    }
  }

  const squareCover = manifest.assets.find((asset) => asset.assetId === "square-face-cover");
  if (
    !squareCover ||
    squareCover.delivery !== "APP_STATIC" ||
    squareCover.migrationStatus !== "KEEP_APP_STATIC_LCP" ||
    squareCover.url !== "/games/square-face-cover.png"
  ) {
    errors.push("The Square first-viewport cover must remain APP_STATIC under KEEP_APP_STATIC_LCP.");
  }
  for (const assetId of ["square-face-swf", "oval-face-swf"]) {
    const asset = manifest.assets.find((candidate) => candidate.assetId === assetId);
    if (
      !asset ||
      asset.delivery !== "APP_STATIC" ||
      asset.rightsGate !== "REVIEW_REQUIRED" ||
      asset.migrationStatus !== "BLOCKED_RIGHTS_UNKNOWN"
    ) {
      errors.push(`${assetId} must remain locally hosted and blocked from migration while rights are UNKNOWN.`);
    }
  }

  return errors;
}

function cloneManifest() {
  return JSON.parse(JSON.stringify(rawManifest)) as SyntheticManifest;
}

function makeR2Candidate(asset: MutableAsset) {
  const kindSegment = asset.kind.toLowerCase().replace("_bundle", "");
  const extension = asset.url.split(".").pop() ?? "bin";
  asset.delivery = "R2_CUSTOM_DOMAIN";
  asset.objectKey = `games/${asset.gameId}/${kindSegment}/${asset.sha256.slice(0, 16)}/${asset.assetId}.${extension}`;
  asset.url = `${GAME_ASSET_CDN_ORIGIN}/${asset.objectKey}`;
  asset.cacheControl = "public, max-age=31536000, immutable";
  asset.rightsGate = "ALLOWED";
  asset.migrationStatus = "R2_CANDIDATE";
  asset.sourcePath = null;
  return asset;
}

function expectRejected(label: string, expected: RegExp, mutate: (manifest: SyntheticManifest) => void) {
  const fixture = cloneManifest();
  mutate(fixture);
  const errors = validateProjectContract(fixture);
  assert.ok(errors.some((error) => expected.test(error)), `${label} was not rejected for the expected reason:\n${errors.join("\n")}`);
}

async function verifyHttp(manifest: GameAssetManifest, baseArgument: string) {
  const base = new URL(baseArgument);
  assert.equal(base.protocol, "http:", "ASSET-001 HTTP verification accepts local HTTP only");
  assert.ok(["127.0.0.1", "localhost"].includes(base.hostname), "ASSET-001 HTTP verification accepts loopback only");
  assert.equal(base.pathname, "/", "ASSET-001 HTTP base must be an origin");

  const uniqueAssets = [...new Map(
    manifest.assets
      .filter((asset) => asset.delivery === "APP_STATIC")
      .map((asset) => [asset.url, asset])
  ).values()];
  const responses = [];
  for (const asset of uniqueAssets) {
    const response = await fetch(new URL(asset.url, base), { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, `${asset.url} HTTP status drifted`);
    assert.equal(response.headers.get("content-type")?.split(";")[0].toLowerCase(), asset.contentType, `${asset.url} HTTP MIME drifted`);
    assert.equal(response.headers.get("cache-control")?.toLowerCase(), asset.cacheControl, `${asset.url} HTTP cache policy drifted`);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(body.byteLength, asset.bytes, `${asset.url} HTTP byte length drifted`);
    assert.equal(createHash("sha256").update(body).digest("hex"), asset.sha256, `${asset.url} HTTP SHA-256 drifted`);
    responses.push(asset.url);
  }

  for (const path of ["/", "/oval-face-icon-generator", "/pixel-art-avatar-icon-generator"]) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, `${path} HTTP status drifted`);
    const html = await response.text();
    assert.ok(!html.includes(`${GAME_ASSET_CDN_ORIGIN}/games/`), `${path} unexpectedly references an R2 game object`);
  }
  return responses;
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 2 && args[0] === "--base"), "usage: npm run assets:check [-- --base http://127.0.0.1:3100]");
  const errors = validateProjectContract(rawManifest);
  if (errors.length > 0) {
    console.error("ASSET-001 validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const negativeFixtures: Array<[string, RegExp, (manifest: SyntheticManifest) => void]> = [
    ["schema drift", /schemaVersion/, (manifest) => { manifest.schemaVersion = "2.0.0"; }],
    ["duplicate asset ID", /assetId must be unique/, (manifest) => { manifest.assets[1].assetId = manifest.assets[0].assetId; }],
    ["missing Game Data mapping", /must map to exactly one manifest asset/, (manifest) => {
      manifest.assets = manifest.assets.filter((asset) => asset.assetId !== "square-face-cover");
    }],
    ["byte drift", /byte length drifted/, (manifest) => { manifest.assets[1].bytes += 1; }],
    ["hash drift", /SHA-256 drifted/, (manifest) => { manifest.assets[1].sha256 = "0".repeat(64); }],
    ["MIME drift", /contentType does not match/, (manifest) => { manifest.assets[1].contentType = "image/jpeg"; }],
    ["APP_STATIC object key", /objectKey must be null/, (manifest) => { manifest.assets[1].objectKey = "games/not-allowed"; }],
    ["unknown CDN", /approved R2 custom domain/, (manifest) => {
      const asset = makeR2Candidate(manifest.assets[2]);
      asset.url = `https://cdn.example.invalid/${asset.objectKey}`;
    }],
    ["HTTP CDN", /approved R2 custom domain/, (manifest) => {
      const asset = makeR2Candidate(manifest.assets[2]);
      asset.url = `http://static.mysquarefaceicon.com/${asset.objectKey}`;
    }],
    ["r2.dev", /approved R2 custom domain/, (manifest) => {
      const asset = makeR2Candidate(manifest.assets[2]);
      asset.url = `https://example.r2.dev/${asset.objectKey}`;
    }],
    ["query versioning", /query or fragment versioning/, (manifest) => {
      const asset = makeR2Candidate(manifest.assets[2]);
      asset.url += "?v=2";
    }],
    ["unhashed object key", /16-character SHA-256 prefix/, (manifest) => {
      const asset = makeR2Candidate(manifest.assets[2]);
      asset.objectKey = "games/square-face/image/latest/square-face-cover.png";
      asset.url = `${GAME_ASSET_CDN_ORIGIN}/${asset.objectKey}`;
    }],
    ["mutable cache on R2", /immutable R2 policy/, (manifest) => {
      makeR2Candidate(manifest.assets[2]).cacheControl = "public, max-age=0";
    }],
    ["review-required R2", /rightsGate must be ALLOWED/, (manifest) => {
      makeR2Candidate(manifest.assets[2]).rightsGate = "REVIEW_REQUIRED";
    }],
    ["UNKNOWN rights R2", /cannot use R2 until exact redistribution rights/, (manifest) => {
      makeR2Candidate(manifest.assets[0]).migrationStatus = "MIGRATED";
    }],
    ["duplicate R2 object key", /objectKey must be unique/, (manifest) => {
      const first = makeR2Candidate(manifest.assets[2]);
      const second = makeR2Candidate(manifest.assets[6]);
      second.objectKey = first.objectKey;
      second.url = first.url;
    }],
    ["Ruffle takeover", /must not take over Ruffle runtime files/, (manifest) => {
      const asset = manifest.assets[1];
      asset.kind = "HTML5_BUNDLE";
      asset.url = "/ruffle/ruffle.js";
      asset.sourcePath = "public/ruffle/ruffle.js";
      asset.contentType = "application/javascript";
    }],
    ["Pixel tool copy", /must not host or migrate assets for the Pixel external tool/, (manifest) => {
      makeR2Candidate(manifest.assets[8]);
    }],
    ["missing Pixel exclusion", /Pixel must remain an explicit EXTERNAL_DIRECT_ONLY exclusion/, (manifest) => {
      manifest.exclusions = manifest.exclusions.filter((entry) => entry.id !== "pixel-avatar-external");
    }],
    ["missing Ruffle exclusion", /Ruffle must remain excluded/, (manifest) => {
      manifest.exclusions = manifest.exclusions.filter((entry) => entry.id !== "ruffle-runtime");
    }]
  ];

  for (const [label, expected, mutate] of negativeFixtures) expectRejected(label, expected, mutate);

  const manifest = rawManifest as GameAssetManifest;
  const referencedBytes = manifest.assets.reduce((total, asset) => total + asset.bytes, 0);
  const uniqueLocalBytes = [...new Map(
    manifest.assets
      .filter((asset) => asset.delivery === "APP_STATIC" && asset.sourcePath)
      .map((asset) => [asset.sourcePath, asset])
  ).values()]
    .reduce((total, asset) => total + asset.bytes, 0);
  console.log("ASSET-001 validation passed");
  console.log(`- ${manifest.assets.length} Game Data asset references validated`);
  console.log(`- ${uniqueLocalBytes} unique local bytes (${referencedBytes} referenced bytes including shared assets)`);
  console.log(`- ${negativeFixtures.length} fail-closed negative fixtures rejected`);
  console.log("- no R2 assets declared; Square/Oval SWFs remain blocked, Ruffle excluded, Pixel direct-link-only");

  if (args.length === 2) {
    const responses = await verifyHttp(manifest, args[1]);
    console.log(`- ${responses.length} unique local asset responses verified by status, MIME, cache, bytes and SHA-256`);
    console.log("- Square, Oval and Pixel HTML contain no R2 game-object URL");
  }
}

main().catch((error) => {
  console.error(`ASSET-001 validation failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
