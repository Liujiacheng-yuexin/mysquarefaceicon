import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { gameCatalog } from "../lib/games/catalog";
import { getGameImage, getGameOpenGraphImage, getGamePlayerPreview, getGameThumbnail } from "../lib/games/game-images";
import { validateGameRecord, type GameImage, type GameImageRole, type GameRecord } from "../lib/games/game-schema";

type ImageMime = "image/png" | "image/webp" | "image/svg+xml" | "image/x-icon" | "image/avif" | "image/jpeg";
type ImageFacts = { readonly mime: ImageMime; readonly width: number; readonly height: number; readonly bytes: number };
type ManifestImage = {
  readonly gameId: string;
  readonly kind: string;
  readonly delivery: string;
  readonly url: string;
  readonly sourcePath: string | null;
  readonly contentType: string;
};
type LoadingUsage = {
  readonly role: GameImageRole;
  readonly firstViewport: boolean;
  readonly loading: "lazy" | "eager" | null;
  readonly priority: "high" | null;
  readonly metadataOnly?: boolean;
};

const projectRoot = resolve(__dirname, "../..");
const publicRoot = resolve(projectRoot, "public");
const imageExtensions = new Set([".png", ".webp", ".svg", ".ico", ".avif", ".jpg", ".jpeg"]);
const preferredContentTypes = new Set<ImageMime>(["image/webp", "image/avif"]);
const exactLegacyFormats = new Map<string, Readonly<{ role: GameImageRole; mime: ImageMime }>>([
  ["/square-face-icon.png", { role: "THUMBNAIL", mime: "image/png" }],
  ["/games/oval-face-icon.png", { role: "THUMBNAIL", mime: "image/png" }],
  ["/games/square-face-cover.png", { role: "PLAYER_PREVIEW", mime: "image/png" }],
  ["/games/oval-face-cover.png", { role: "PLAYER_PREVIEW", mime: "image/png" }],
  ["/og-image.svg", { role: "OPEN_GRAPH", mime: "image/svg+xml" }]
]);

function detectMime(buffer: Buffer): ImageMime {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) return "image/png";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (buffer.length >= 4 && buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1) return "image/x-icon";
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer.length >= 16 && buffer.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(buffer.toString("ascii", 8, 32))) return "image/avif";
  const text = buffer.toString("utf8", 0, Math.min(buffer.length, 4096)).replace(/^\uFEFF/, "").trimStart();
  if (/^(?:<\?xml[^>]*>\s*)?<svg\b/i.test(text)) return "image/svg+xml";
  throw new Error("unsupported or mismatched image signature");
}

function readPngDimensions(buffer: Buffer) {
  assert.ok(buffer.length >= 24, "PNG is too short for IHDR dimensions");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readWebpDimensions(buffer: Buffer) {
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const kind = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > buffer.length) break;
    if (kind === "VP8X" && size >= 10) {
      const width = 1 + buffer.readUIntLE(data + 4, 3);
      const height = 1 + buffer.readUIntLE(data + 7, 3);
      return { width, height };
    }
    if (kind === "VP8L" && size >= 5 && buffer[data] === 0x2f) {
      const b1 = buffer[data + 1];
      const b2 = buffer[data + 2];
      const b3 = buffer[data + 3];
      const b4 = buffer[data + 4];
      return {
        width: 1 + (((b2 & 0x3f) << 8) | b1),
        height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
      };
    }
    if (kind === "VP8 " && size >= 10 && buffer.subarray(data + 3, data + 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) {
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }
    offset = data + size + (size % 2);
  }
  throw new Error("WEBP does not contain a supported VP8/VP8L/VP8X dimension chunk");
}

function readSvgDimensions(buffer: Buffer) {
  const root = buffer.toString("utf8").match(/<svg\b[^>]*>/i)?.[0];
  assert.ok(root, "SVG root element is missing");
  const numeric = (name: string) => {
    const raw = root.match(new RegExp(`\\b${name}=["']([0-9]+(?:\\.[0-9]+)?)(?:px)?["']`, "i"))?.[1];
    return raw ? Number(raw) : null;
  };
  const width = numeric("width");
  const height = numeric("height");
  if (width && height) return { width, height };
  const viewBox = root.match(/\bviewBox=["']\s*[-+\d.]+[ ,]+[-+\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)\s*["']/i);
  assert.ok(viewBox, "SVG requires numeric width/height or a viewBox");
  return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
}

function readIcoDimensions(buffer: Buffer) {
  assert.ok(buffer.length >= 22 && buffer.readUInt16LE(4) > 0, "ICO directory entry is missing");
  return { width: buffer[6] || 256, height: buffer[7] || 256 };
}

function readJpegDimensions(buffer: Buffer) {
  let offset = 2;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (sofMarkers.has(marker) && offset + 9 < buffer.length) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    assert.ok(length >= 2, "JPEG segment length is invalid");
    offset += 2 + length;
  }
  throw new Error("JPEG SOF dimensions are missing");
}

function readAvifDimensions(buffer: Buffer) {
  const marker = buffer.indexOf(Buffer.from("ispe", "ascii"));
  assert.ok(marker >= 4 && marker + 16 <= buffer.length, "AVIF ispe dimensions are missing");
  return { width: buffer.readUInt32BE(marker + 8), height: buffer.readUInt32BE(marker + 12) };
}

function readImageFacts(path: string): ImageFacts {
  const buffer = readFileSync(path);
  const mime = detectMime(buffer);
  const dimensions = mime === "image/png" ? readPngDimensions(buffer)
    : mime === "image/webp" ? readWebpDimensions(buffer)
    : mime === "image/svg+xml" ? readSvgDimensions(buffer)
    : mime === "image/x-icon" ? readIcoDimensions(buffer)
    : mime === "image/jpeg" ? readJpegDimensions(buffer)
    : readAvifDimensions(buffer);
  assert.ok(Number.isSafeInteger(dimensions.width) && dimensions.width > 0, `${path} has an invalid width`);
  assert.ok(Number.isSafeInteger(dimensions.height) && dimensions.height > 0, `${path} has an invalid height`);
  return { mime, width: dimensions.width, height: dimensions.height, bytes: buffer.byteLength };
}

function listPublicImages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listPublicImages(path);
    return entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

function extensionMime(path: string): ImageMime {
  const extension = extname(path).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".ico") return "image/x-icon";
  if (extension === ".avif") return "image/avif";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  throw new Error(`${path} has an unsupported extension`);
}

function validateRoleFormat(image: Pick<GameImage, "role" | "src">, mime: ImageMime): string[] {
  if (preferredContentTypes.has(mime)) return [];
  const legacy = exactLegacyFormats.get(image.src);
  if (legacy?.role === image.role && legacy.mime === mime) return [];
  return [`${image.role} ${image.src} uses ${mime} outside the exact IMG-001 legacy allowlist.`];
}

function validateLoadingUsage(usage: LoadingUsage): string[] {
  if (usage.role === "OPEN_GRAPH") return usage.metadataOnly ? [] : ["OPEN_GRAPH must remain metadata-only."];
  if (usage.role === "PLAYER_PREVIEW" && usage.firstViewport) {
    return usage.loading === "eager" && usage.priority === "high"
      ? []
      : ["First-viewport PLAYER_PREVIEW must remain eager with high fetch priority."];
  }
  return usage.loading === "lazy" && usage.priority === null
    ? []
    : [`Non-first-viewport ${usage.role} must be lazy and must not use high priority.`];
}

function validateLocalRecord(image: Pick<GameImage, "src" | "width" | "height">, facts: ImageFacts): string[] {
  return image.width === facts.width && image.height === facts.height
    ? []
    : [`${image.src} declared ${image.width}x${image.height}, actual ${facts.width}x${facts.height}.`];
}

function cloneGame(game: GameRecord): Record<string, any> {
  return JSON.parse(JSON.stringify(game)) as Record<string, any>;
}

function expectSchemaRejected(label: string, expected: RegExp, mutate: (record: Record<string, any>) => void) {
  const record = cloneGame(gameCatalog[0]);
  mutate(record);
  const errors = validateGameRecord(record);
  assert.ok(errors.some((error) => expected.test(error)), `${label} was not rejected:\n${errors.join("\n")}`);
}

function validateSourceLoadingContracts() {
  const source = (path: string) => readFileSync(resolve(projectRoot, path), "utf8");
  const gameCard = source("components/game/GameCard.tsx");
  const recent = source("components/game/RecentlyPlayed.tsx");
  const sidebar = source("components/GameSidebar.tsx");
  const curated = source("components/CuratedGalleryPreview.tsx");
  const player = source("components/game-player/GamePlayer.tsx");
  assert.ok((gameCard.match(/loading="lazy"/g) ?? []).length >= 2, "Both GameCard media variants must explicitly lazy-load");
  assert.match(recent, /<Image[\s\S]*?loading="lazy"/);
  assert.match(sidebar, /<Image[^>]*loading="lazy"/);
  assert.match(curated, /<Image[\s\S]*?loading="lazy"/);
  assert.match(player, /data-player-preview[\s\S]*?<img[\s\S]*?loading="eager"[\s\S]*?fetchPriority="high"/);
}

function runNegativeFixtures() {
  const imageAt = (record: Record<string, any>, role: GameImageRole) => record.images.find((image: GameImage) => image.role === role);
  expectSchemaRejected("missing width", /width must be a positive safe integer/, (record) => { imageAt(record, "THUMBNAIL").width = null; });
  expectSchemaRejected("fractional height", /height must be a positive safe integer/, (record) => { imageAt(record, "THUMBNAIL").height = 0.5; });
  expectSchemaRejected("non-square thumbnail", /THUMBNAIL must use an exact 1:1 ratio/, (record) => { imageAt(record, "THUMBNAIL").width = 511; });
  expectSchemaRejected("non-16:9 landscape", /LANDSCAPE_COVER must use an exact 16:9 ratio/, (record) => {
    record.images.push({ role: "LANDSCAPE_COVER", src: "/game-face-samples/gamer.webp", alt: "Landscape fixture", width: 1600, height: 901, provenance: "PROJECT_ASSET" });
  });
  expectSchemaRejected("bad OG dimensions", /OPEN_GRAPH must be exactly 1200x630/, (record) => { imageAt(record, "OPEN_GRAPH").width = 1201; });
  expectSchemaRejected("unsupported role", /not a supported Game Image role/, (record) => { imageAt(record, "THUMBNAIL").role = "COVER"; });
  expectSchemaRejected("duplicate role", /duplicate role THUMBNAIL/, (record) => { record.images.push({ ...imageAt(record, "THUMBNAIL") }); });
  expectSchemaRejected("missing preview", /must contain exactly one PLAYER_PREVIEW/, (record) => { record.images = record.images.filter((image: GameImage) => image.role !== "PLAYER_PREVIEW"); });
  expectSchemaRejected("empty alt", /alt must be a non-empty string/, (record) => { imageAt(record, "THUMBNAIL").alt = ""; });
  expectSchemaRejected("unsafe competitor path", /safe root-relative path/, (record) => { imageAt(record, "THUMBNAIL").src = "https://competitor.invalid/image.png"; });
  expectSchemaRejected("unknown provenance", /provenance must be PROJECT_ASSET or PROJECT_CDN/, (record) => { imageAt(record, "THUMBNAIL").provenance = "COMPETITOR_ASSET"; });

  const external = cloneGame(gameCatalog.find((game) => game.pageType === "EXTERNAL_TOOL")!);
  external.images.push({ role: "PLAYER_PREVIEW", src: "/games/square-face-cover.png", alt: "Invalid onsite preview", width: 970, height: 844, provenance: "PROJECT_ASSET" });
  assert.ok(validateGameRecord(external).some((error) => /must not contain a PLAYER_PREVIEW/.test(error)));

  assert.ok(validateRoleFormat({ role: "THUMBNAIL", src: "/new-thumbnail.png" }, "image/png").length > 0);
  assert.ok(validateRoleFormat({ role: "THUMBNAIL", src: "/new-thumbnail.jpg" }, "image/jpeg").length > 0);
  assert.ok(validateRoleFormat({ role: "THUMBNAIL", src: "https://competitor.invalid/image.webp" }, "image/webp").length === 0);
  assert.ok(validateLocalRecord({ src: "/fake.webp", width: 512, height: 512 }, { mime: "image/webp", width: 511, height: 512, bytes: 100 }).length > 0);
  assert.ok(validateLoadingUsage({ role: "THUMBNAIL", firstViewport: false, loading: "eager", priority: "high" }).length > 0);
  assert.ok(validateLoadingUsage({ role: "PLAYER_PREVIEW", firstViewport: true, loading: "lazy", priority: null }).length > 0);
  assert.ok(validateLoadingUsage({ role: "OPEN_GRAPH", firstViewport: false, loading: null, priority: null }).length > 0);
}

function main() {
  assert.equal(process.argv.length, 2, "usage: npm run images:check");
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, "data/game-asset-manifest.json"), "utf8")) as { assets: ManifestImage[] };
  const inventoryPaths = listPublicImages(publicRoot);
  const inventory = new Map<string, ImageFacts>();
  let totalBytes = 0;
  for (const path of inventoryPaths) {
    const publicPath = `/${relative(publicRoot, path).split(sep).join("/")}`;
    const facts = readImageFacts(path);
    assert.equal(facts.mime, extensionMime(path), `${publicPath} MIME does not match its extension`);
    inventory.set(publicPath, facts);
    totalBytes += facts.bytes;
  }

  for (const game of gameCatalog) {
    const schemaErrors = validateGameRecord(game);
    assert.deepEqual(schemaErrors, [], `${game.id} image schema failed:\n${schemaErrors.join("\n")}`);
    assert.equal(getGameThumbnail(game).role, "THUMBNAIL");
    assert.equal(getGameOpenGraphImage(game).role, "OPEN_GRAPH");
    assert.equal(Boolean(getGamePlayerPreview(game)), game.pageType === "GAME");
    for (const image of game.images) {
      const mappings = manifest.assets.filter((asset) => asset.gameId === game.id && asset.kind === "IMAGE" && asset.url === image.src);
      assert.equal(mappings.length, 1, `${game.id} ${image.role} must map to exactly one ASSET-001 image entry`);
      if (image.provenance === "PROJECT_ASSET") {
        const facts = inventory.get(image.src);
        assert.ok(facts, `${game.id} ${image.src} is missing from public image inventory`);
        assert.deepEqual(validateLocalRecord(image, facts), []);
        assert.equal(mappings[0].delivery, "APP_STATIC", `${image.src} must remain APP_STATIC`);
        assert.equal(mappings[0].sourcePath, `public${image.src}`, `${image.src} sourcePath drifted`);
        assert.equal(mappings[0].contentType, facts.mime, `${image.src} manifest MIME drifted`);
        assert.deepEqual(validateRoleFormat(image, facts.mime), []);
      }
    }
  }

  const square = gameCatalog.find((game) => game.id === "square-face")!;
  const reordered = { ...square, images: [...square.images].reverse() } as unknown as GameRecord;
  assert.equal(getGamePlayerPreview(reordered)?.src, "/games/square-face-cover.png", "Role selection must not fall back to array order");
  const pixel = gameCatalog.find((game) => game.id === "pixel-art-avatar")!;
  assert.equal(getGameImage(pixel, "PLAYER_PREVIEW"), null, "External Tool must not inherit its first image as a player preview");
  const missingThumbnail = {
    ...square,
    images: square.images.filter((image) => image.role !== "THUMBNAIL")
  } as unknown as GameRecord;
  assert.throws(() => getGameThumbnail(missingThumbnail), /requires exactly one THUMBNAIL/);

  validateSourceLoadingContracts();
  runNegativeFixtures();

  const mimeCounts = [...inventory.values()].reduce<Record<string, number>>((counts, facts) => {
    counts[facts.mime] = (counts[facts.mime] ?? 0) + 1;
    return counts;
  }, {});
  console.log("IMG-001 validation passed");
  console.log(`- ${inventory.size} public images inspected from file signatures (${totalBytes} bytes)`);
  console.log(`- MIME inventory: ${Object.entries(mimeCounts).sort().map(([mime, count]) => `${mime}=${count}`).join(", ")}`);
  console.log(`- ${gameCatalog.reduce((count, game) => count + game.images.length, 0)} Game Data image records match intrinsic dimensions and ASSET-001 mappings`);
  console.log("- role ratios, required/forbidden roles, alt, provenance, legacy formats and no-array-fallback selection passed");
  console.log("- non-first-viewport images are explicitly lazy; first-viewport Player preview remains eager/high priority");
  console.log("- 18 fail-closed image/schema/format/loading negative fixtures rejected");
}

main();
