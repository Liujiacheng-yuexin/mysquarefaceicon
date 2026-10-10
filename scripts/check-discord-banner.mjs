import assert from "node:assert/strict";
import { deflateSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { modules, plain, root } from "./category-sample-test-utils.mjs";
import { resolve } from "node:path";
import { beforeDiscordBannerMarkup, beforeDiscordBannerSource } from "./discord-banner-compat.mjs";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { protectBannerWorker } from "./banner-worker-policy.mjs";

let closed = 0, decodeCalls = 0;
const loader = modules({}, { Blob, createImageBitmap: async () => { decodeCalls++; return { width: 680, height: 240, close() { closed++; } }; } });
const { geometry, orientationTransform } = loader.load("lib/discord-banner/geometry.ts");
const file = loader.load("lib/discord-banner/image-file.ts");
const { verifyOutput } = loader.load("lib/discord-banner/canvas.ts");
const { PRESETS, isBannerPath, crossesBannerBoundary } = loader.load("lib/discord-banner/config.ts");
let cases = 0, assertions = 0;
function test(name, fn) { fn(); cases++; console.log(`PASS ${name}`); }
function near(actual, expected, message) { assert.ok(Math.abs(actual - expected) < 0.00001, `${message}: ${actual} != ${expected}`); assertions++; }
function same(a, b, message) { assert.deepEqual(plain(a), plain(b), message); assertions++; }
function rejects(fn, pattern = /image|static|pixels|side|file/i) { assert.throws(fn, pattern); assertions++; }
const center = { zoom: 1, x: .5, y: .5 };
function geom(ws, hs, wt, ht, mode = "crop", crop = center) { return geometry(ws, hs, wt, ht, mode, crop); }
function values(g, expected) { for (const [key, value] of Object.entries(expected)) near(g[key], value, key); }

test("A01 exact-ratio profile", () => values(geom(1360, 480, 680, 240), { scale: .5, sx: 0, sy: 0, sw: 1360, sh: 480 }));
test("A02 square -> profile Crop", () => values(geom(1000, 1000, 680, 240), { sw: 1000, sh: 352.941176, sx: 0, sy: 323.529412 }));
test("A03 square -> profile Fit", () => values(geom(1000, 1000, 680, 240, "fit"), { dw: 240, dh: 240, dx: 220, dy: 0 }));
test("A04 landscape -> server Crop/Fit", () => { for (const mode of ["crop", "fit"]) values(geom(1920, 1080, 960, 540, mode), { scale: .5, sw: 1920, sh: 1080, dx: 0, dy: 0 }); });
test("A05 square -> server Crop", () => values(geom(1000, 1000, 960, 540), { sw: 1000, sh: 562.5, sx: 0, sy: 218.75 }));
test("A06 square -> server Fit", () => values(geom(1000, 1000, 960, 540, "fit"), { dw: 540, dh: 540, dx: 210, dy: 0 }));
test("A07 zoom 2 and enlargement", () => values(geom(1000, 1000, 680, 240, "crop", { ...center, zoom: 2 }), { scale: 1.36, sw: 500, sh: 176.470588, sx: 250, sy: 411.764706 }));
test("A08 crop edges", () => { near(geom(1000, 1000, 680, 240, "crop", { ...center, y: 0 }).sy, 0); near(geom(1000, 1000, 680, 240, "crop", { ...center, y: 1 }).sy, 647.058824); });
test("A09 small image is allowed with scale 2", () => { for (const mode of ["crop", "fit"]) near(geom(340, 120, 680, 240, mode).scale, 2); });
test("A10 EXIF orientation matrices include all rotations and mirrors", () => {
  const expected = [[1,0,0,1,0,0],[-1,0,0,1,80,0],[-1,0,0,-1,80,40],[1,0,0,-1,0,40],[0,1,1,0,0,0],[0,1,-1,0,40,0],[0,-1,-1,0,40,80],[0,-1,1,0,0,80]];
  for (let o = 1; o <= 8; o++) same(orientationTransform(o, 80, 40), expected[o - 1]);
  rejects(() => orientationTransform(9, 80, 40));
});
test("A13 wide source -> server", () => values(geom(2400, 800, 960, 540), { sw: 1422.222222, sh: 800, sx: 488.888889, sy: 0 }));
test("A14 invite exact dimensions", () => { for (const mode of ["crop", "fit"]) values(geom(3840, 2160, 1920, 1080, mode), { scale: .5, dw: 1920, dh: 1080, dx: 0, dy: 0 }); });
test("Finite guards, clamping, Fit zoom independence, random geometry bounds", () => {
  for (const value of [NaN, Infinity, -Infinity]) rejects(() => geom(1000, 1000, 680, 240, "crop", { ...center, x: value }));
  for (const value of [0, -1, 1.2, NaN]) rejects(() => geom(value, 100, 680, 240));
  same(geom(1000, 1000, 680, 240, "fit", { zoom: 4, x: 0, y: 1 }), geom(1000, 1000, 680, 240, "fit"));
  same(geom(1000, 1000, 680, 240, "crop", { zoom: 7, x: -3, y: 8 }), geom(1000, 1000, 680, 240, "crop", { zoom: 4, x: 0, y: 1 }));
  for (const ws of [1, 340, 1000, 2400, 8192]) for (const hs of [1, 120, 1000, 4000]) for (const p of PRESETS) for (const x of [0, .5, 1]) for (const zoom of [1, 2, 4]) {
    const g = geom(ws, hs, p.width, p.height, "crop", { zoom, x, y: x });
    assert.ok(g.sx >= 0 && g.sy >= 0 && g.sx + g.sw <= ws + 1e-6 && g.sy + g.sh <= hs + 1e-6);
    near(g.dw / g.sw, g.dh / g.sh, "uniform scale");
  }
});

function chunk(type, body) {
  const output = Buffer.alloc(body.length + 12); output.writeUInt32BE(body.length); output.write(type, 4); body.copy(output, 8);
  output.writeUInt32BE(file.crc32(output, 4, output.length - 4), output.length - 4); return output;
}
function png(w = 1, h = 1, extra = []) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  // Dimensions can intentionally disagree with IDAT for pre-decode limit tests.
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), chunk("IHDR", ihdr), ...extra, chunk("IDAT", deflateSync(Buffer.from([0,255,0,0,255]))), chunk("IEND", Buffer.alloc(0))]);
}
function exif(o) {
  const data = Buffer.alloc(26); data.write("II"); data.writeUInt16LE(42, 2); data.writeUInt32LE(8, 4); data.writeUInt16LE(1, 8);
  data.writeUInt16LE(0x112, 10); data.writeUInt16LE(3, 12); data.writeUInt32LE(1, 14); data.writeUInt16LE(o, 18); return data;
}
function marker(id, body) { const head = Buffer.from([255, id, 0, 0]); head.writeUInt16BE(body.length + 2, 2); return Buffer.concat([head, body]); }
function jpeg(o) {
  return Buffer.concat([Buffer.from([255,216]), marker(225, Buffer.concat([Buffer.from("Exif\0\0"), exif(o)])), marker(192, Buffer.from([8,0,40,0,80,1,1,0x11,0])), marker(218, Buffer.from([1,1,0,0,63,0])), Buffer.from([0,255,0,255,208,0,255,217])]);
}
test("B01 signatures, including renamed GIF/WebP/SVG/HEIC", () => {
  for (const input of ["GIF89a", "RIFFxxxxWEBP", "<svg xmlns='http://www.w3.org/2000/svg'/>", "0000ftypheic", "random text"]) rejects(() => file.inspectImage(Buffer.from(input)), /static PNG and JPG/);
  same(file.inspectImage(png()).mime, "image/png");
});
test("B02 APNG chunks vs incidental acTL text", () => {
  const control = Buffer.alloc(8); control.writeUInt32BE(2);
  rejects(() => file.inspectImage(png(1, 1, [chunk("acTL", control)])), /Animated/);
  same(file.inspectImage(png(1, 1, [chunk("tEXt", Buffer.from("Comment\0acTL"))])).mime, "image/png");
});
test("B03 byte, area and longest-side limits are inclusive for input", () => {
  file.checkInputSize(20_000_000); rejects(() => file.checkInputSize(20_000_001), /20 MB/);
  file.checkDimensions(4000, 4000); file.checkDimensions(8192, 1);
  rejects(() => file.inspectImage(png(4000, 4001)), /16,000,000/); rejects(() => file.inspectImage(png(8193, 1)), /8192/);
  const padding = Buffer.alloc(20_000_000 - png().length - 12, 32);
  padding.write("Comment\0");
  same(file.inspectImage(png(1, 1, [chunk("tEXt", padding)])).width, 1);
});
test("B04 PNG boundaries, CRC, zero size, truncation and JPEG markers", () => {
  rejects(() => file.inspectImage(png(0, 1)));
  const image = png(); for (let i = 0; i < image.length; i++) rejects(() => file.inspectImage(image.subarray(0, i)));
  const corrupted = Buffer.from(image); corrupted[20] ^= 1; rejects(() => file.inspectImage(corrupted));
  const length = Buffer.from(image); length.writeUInt32BE(0x7fffffff, 8); rejects(() => file.inspectImage(length));
  const j = jpeg(1); for (let i = 0; i < j.length; i++) rejects(() => file.inspectImage(j.subarray(0, i)));
  rejects(() => file.inspectImage(Buffer.concat([j, Buffer.from([0])])));
  rejects(() => file.inspectImage(jpeg(9))); same(file.inspectImage(jpeg(1)).mime, "image/jpeg");
});
test("EXIF 1-8 normalized dimensions and decoder metadata exclusion", () => {
  for (let o = 1; o <= 8; o++) {
    const image = jpeg(o), parsed = file.inspectImage(image);
    same([parsed.width, parsed.height], o >= 5 ? [40, 80] : [80, 40]);
    same(parsed.orientation, o); same(parsed.metadataRanges.length, 1);
  }
  const image = png(80, 40, [chunk("eXIf", exif(6))]); same(file.inspectImage(image).orientation, 6);
});

const settings = { preset: PRESETS[0], mode: "crop", crop: center, background: "#ffffff", transparent: false, mime: "image/png", quality: .92 };
for (const [name, blob, override, pattern] of [
  ["B05 null encoding", null, {}, /Export failed/],
  ["B05 MIME fallback", new Blob([png()], { type: "image/png" }), { mime: "image/jpeg" }, /selected format/],
  ["B05 MIME lies about signature", new Blob([png(680, 240)], { type: "image/jpeg" }), { mime: "image/jpeg" }, /did not match/],
  ["B06 exactly 9,500,000 bytes", new Blob([new Uint8Array(9_500_000)], { type: "image/png" }), {}, /9,500,000 bytes/],
  ["B06 above byte limit", new Blob([new Uint8Array(9_500_001)], { type: "image/png" }), {}, /9,500,001 bytes/],
  ["wrong real pixel dimensions", new Blob([png(681, 240)], { type: "image/png" }), {}, /did not match/]
]) {
  await assert.rejects(verifyOutput(blob, { ...settings, ...override }), pattern); cases++; console.log(`PASS ${name}`);
}
same(decodeCalls, 0, "invalid outputs fail before bitmap decode");
await verifyOutput(new Blob([png(680, 240)], { type: "image/png" }), settings);
same(closed, 1, "verification bitmap is closed");
const stripped = await file.decoderBlob(jpeg(6), file.inspectImage(jpeg(6))).arrayBuffer();
same(file.inspectImage(new Uint8Array(stripped)).orientation, 1, "decoder cannot rotate again");
same(file.decoderBlob(jpeg(6), file.inspectImage(jpeg(6))).type, "image/jpeg");
same(Buffer.from(await file.decoderBlob(png(), file.inspectImage(png())).arrayBuffer()), png(), "PNG compressed bytes stay intact");

test("Private route policy covers slash/query/hash and document boundaries", () => {
  for (const path of ["/discord-banner-size", "/discord-banner-size/", "/discord-banner-size?x=1", "/discord-banner-size#tool", "/%64iscord-banner-size", "/discord%2Dbanner%2Dsize", "/discord-banner-size%2F"]) same(isBannerPath(path), true);
  for (const path of [null, "/", "/discord-banner-size-other", "/blog", "/%ZZ"]) same(isBannerPath(path), false);
  same(crossesBannerBoundary("/", "/discord-banner-size"), true); same(crossesBannerBoundary("/discord-banner-size", "/blog"), true);
  same(crossesBannerBoundary("/discord-banner-size", "/discord-banner-size#tool"), false);
  same(crossesBannerBoundary("/", "/%64iscord-banner-size"), true);
});
test("P0 surface has no file telemetry/storage sink or remote input", () => {
  const source = ["components/DiscordBannerEditor.tsx", "lib/discord-banner/canvas.ts", "lib/discord-banner/image-file.ts"].map(p => readFileSync(resolve(root, p), "utf8")).join("\n");
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|console\.(log|error)|gtag)\s*[.(]/);
  assert.doesNotMatch(source, /file\.name|dangerouslySetInnerHTML/);
});
test("Historical SSR inverse preserves all content except the reviewed brand label", () => {
  const after = '<a class="brand" href="/" aria-label="Square Face Generator home">Square Face Generator</a><p>Unchanged</p>';
  same(beforeDiscordBannerMarkup(after), after.replace('aria-label="Square Face Generator home"', 'aria-label="My Square Face Icon home"'));
  same(beforeDiscordBannerMarkup(after.replace("Unchanged", "Unexpected")), beforeDiscordBannerMarkup(after).replace("Unchanged", "Unexpected"));
  rejects(() => beforeDiscordBannerMarkup(after + after), /unique/);
});
const workerFixture = `export default {
    async fetch(request, env, ctx) {
        return runWithCloudflareRequestContext(request, env, ctx, async () => {
            return upstream;
        });
    },
};
`;
test("Worker privacy patch is idempotent and fails on an unexpected generated entry", () => {
  const patched = protectBannerWorker(workerFixture);
  same(protectBannerWorker(patched), patched);
  rejects(() => protectBannerWorker(workerFixture.replace("runWithCloudflareRequestContext", "unknownContext")), /entry changed/);
  rejects(() => protectBannerWorker(patched.replace('headers.set("Cache-Control"', 'headers.set("X-Other"')), /incomplete/);
});
for (const path of ["/discord-banner-size", "/discord-banner-size?x=1", "/%64iscord-banner-size", "/discord%2Dbanner%2Dsize/", "/", "/blog", "/discord-banner-size-other", "/%ZZ"]) {
  for (const cache of [null, "public, max-age=600", "private, no-store, no-transform"]) {
    const upstream = new Response("unchanged streamed body", { status: 404, headers: { "X-Robots-Tag": "noindex", ...(cache ? { "Cache-Control": cache } : {}) } });
    const context = { URL, Response, Headers, upstream, runWithCloudflareRequestContext: (_request, _env, _ctx, callback) => callback() };
    vm.runInNewContext(protectBannerWorker(workerFixture).replace("export default", "globalThis.worker ="), context);
    const result = await context.worker.fetch(new Request("https://mysquarefaceicon.com" + path), {}, {});
    same(result.status, 404); same(result.headers.get("X-Robots-Tag"), "noindex");
    if (isBannerPath(path)) {
      same(result.body === upstream.body, true, "body is streamed without buffering");
      same(result.headers.get("Cache-Control"), cache?.includes("no-transform") ? cache : cache ? cache + ", no-transform" : "no-transform");
    } else same(result === upstream, true, "unrelated response is not modified");
    same(await result.text(), "unchanged streamed body");
  }
}
cases++; console.log("PASS Worker policy paths, status, body stream, noindex and cache preservation");
test("Exact historical inverses reject unrelated changes to every touched shared file", () => {
  const delta = JSON.parse(readFileSync(resolve(root, "scripts/fixtures/discord-banner-local-delta.json"), "utf8"));
  for (const [path, change] of Object.entries(delta.files)) {
    const source = readFileSync(resolve(root, path), "utf8");
    const original = beforeDiscordBannerSource(path, source);
    same(createHash("sha256").update(original).digest("hex"), change.beforeReturnedSha256 ?? change.beforeSha256, path);
    rejects(() => beforeDiscordBannerSource(path, source + "\n// unrequested change\n"), /unexpected Discord banner change/);
    rejects(() => beforeDiscordBannerSource(path, source.replace(change.after, change.after + " ")), /unexpected Discord banner change/);
  }
});
console.log(`Discord banner: ${cases} cases, ${assertions} numeric/structural assertions passed. Browser pixels, lifecycle and downloads require the separate browser matrix.`);
