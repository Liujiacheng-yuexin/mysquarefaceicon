import { LIMITS, type ImageMime } from "./config";

export class ImageProblem extends Error {}
export const FORMAT_ERROR = "This tool supports static PNG and JPG only. Animated images are not supported.";
const BAD_FILE = "We couldn’t read this image. Try another PNG or JPG file.";
export type ImageInfo = {
  mime: ImageMime; rawWidth: number; rawHeight: number; width: number; height: number;
  orientation: number; metadataRanges: Array<[number, number]>;
};

export function checkInputSize(size: number) {
  if (!Number.isSafeInteger(size) || size <= 0) throw new ImageProblem(BAD_FILE);
  if (size > LIMITS.inputBytes) throw new ImageProblem("Choose a file no larger than 20 MB (20,000,000 bytes). This is this tool’s input limit.");
}

export function checkDimensions(width: number, height: number) {
  if (![width, height].every(n => Number.isSafeInteger(n) && n > 0)) throw new ImageProblem(BAD_FILE);
  if (width > LIMITS.longestSide || height > LIMITS.longestSide || width * height > LIMITS.pixels) {
    throw new ImageProblem("Choose an image with at most 16,000,000 pixels and no side longer than 8192 px. This is this tool’s input limit.");
  }
}

function fail(): never { throw new ImageProblem(BAD_FILE); }
function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}
function u32(bytes: Uint8Array, offset: number) {
  if (offset < 0 || offset + 4 > bytes.length) return fail();
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0);
}

const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crc32(bytes: Uint8Array, start: number, end: number): number {
  let crc = 0xffffffff;
  for (let i = start; i < end; i++) crc = crcTable[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// Only IFD0 is needed for orientation. Offsets are relative to this bounded TIFF block.
function exifOrientation(bytes: Uint8Array): number {
  if (bytes.length < 8) return fail();
  const order = ascii(bytes, 0, 2);
  if (order !== "II" && order !== "MM") return fail();
  const little = order === "II", view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const short = (p: number) => p >= 0 && p + 2 <= bytes.length ? view.getUint16(p, little) : fail();
  const long = (p: number) => p >= 0 && p + 4 <= bytes.length ? view.getUint32(p, little) : fail();
  if (short(2) !== 42) return fail();
  const ifd = long(4);
  if (ifd < 8) return fail();
  const count = short(ifd);
  if (count > 4096 || ifd + 2 + count * 12 + 4 > bytes.length) return fail();
  let orientation = 1, seen = false;
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (short(entry) !== 0x112) continue;
    if (seen || short(entry + 2) !== 3 || long(entry + 4) !== 1) return fail();
    orientation = short(entry + 8); seen = true;
    if (orientation < 1 || orientation > 8) return fail();
  }
  return orientation;
}

function info(mime: ImageMime, rawWidth: number, rawHeight: number, orientation: number, metadataRanges: Array<[number, number]>): ImageInfo {
  checkDimensions(rawWidth, rawHeight);
  return { mime, rawWidth, rawHeight, width: orientation >= 5 ? rawHeight : rawWidth, height: orientation >= 5 ? rawWidth : rawHeight, orientation, metadataRanges };
}

function inspectPng(bytes: Uint8Array): ImageInfo {
  let position = 8, width = 0, height = 0, orientation = 1, chunks = 0, idat = false, endedIdat = false, palette = false, exif = false;
  let colorType = -1;
  const metadataRanges: Array<[number, number]> = [];
  while (position < bytes.length) {
    if (++chunks > LIMITS.structures || position + 12 > bytes.length) return fail();
    const length = u32(bytes, position), type = ascii(bytes, position + 4, 4), end = position + 12 + length;
    if (length > 0x7fffffff || end > bytes.length || !/^[A-Za-z]{4}$/.test(type) || /[a-z]/.test(type[2])) return fail();
    if (chunks === 1 && type !== "IHDR") return fail();
    if (["acTL", "fcTL", "fdAT"].includes(type)) throw new ImageProblem(FORMAT_ERROR);
    if (type === "IHDR") {
      if (chunks !== 1 || length !== 13) return fail();
      width = u32(bytes, position + 8); height = u32(bytes, position + 12);
      checkDimensions(width, height); // Before CRC work or any bitmap allocation.
      const depth = bytes[position + 16]; colorType = bytes[position + 17];
      const depths: Record<number, number[]> = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] };
      if (!depths[colorType]?.includes(depth) || bytes[position + 18] !== 0 || bytes[position + 19] !== 0 || bytes[position + 20] > 1) return fail();
    } else if (type === "PLTE") {
      if (idat || palette || length === 0 || length > 768 || length % 3 !== 0) return fail();
      palette = true;
    } else if (type === "IDAT") {
      if (endedIdat || (colorType === 3 && !palette)) return fail();
      idat = true;
    } else {
      if (idat) endedIdat = true;
      if (type === "eXIf") {
        if (exif || length > 1_048_576) return fail();
        orientation = exifOrientation(bytes.subarray(position + 8, position + 8 + length));
        metadataRanges.push([position, end]); exif = true;
      } else if (type !== "IEND" && type[0] === type[0].toUpperCase()) return fail();
    }
    if (crc32(bytes, position + 4, end - 4) !== u32(bytes, end - 4)) return fail();
    if (type === "IEND") {
      if (length !== 0 || !idat || end !== bytes.length) return fail();
      return info("image/png", width, height, orientation, metadataRanges);
    }
    position = end;
  }
  return fail();
}

function inspectJpeg(bytes: Uint8Array): ImageInfo {
  let position = 2, width = 0, height = 0, orientation = 1, segments = 0, scans = 0, exif = false, components = 0;
  const metadataRanges: Array<[number, number]> = [];
  while (position < bytes.length) {
    if (++segments > LIMITS.structures || bytes[position] !== 0xff) return fail();
    const start = position++;
    while (bytes[position] === 0xff) position++;
    if (position >= bytes.length) return fail();
    const marker = bytes[position++];
    if (marker === 0xd9) {
      if (position !== bytes.length || !scans || !width) return fail();
      return info("image/jpeg", width, height, orientation, metadataRanges);
    }
    if (marker === 0 || marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7) || position + 2 > bytes.length) return fail();
    const length = bytes[position] * 256 + bytes[position + 1], end = position + length;
    if (length < 2 || end > bytes.length) return fail();
    const body = position + 2;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      if (![0xc0, 0xc1, 0xc2].includes(marker) || width || length < 8 || bytes[body] !== 8) return fail();
      height = bytes[body + 1] * 256 + bytes[body + 2]; width = bytes[body + 3] * 256 + bytes[body + 4];
      checkDimensions(width, height);
      components = bytes[body + 5];
      if (![1, 3, 4].includes(components) || length !== 8 + 3 * components) return fail();
    }
    if (marker === 0xe1) {
      if (ascii(bytes, body, 6) === "Exif\0\0") {
        if (exif) return fail();
        orientation = exifOrientation(bytes.subarray(body + 6, end)); exif = true;
      }
      // Remove all APP1 blocks from the decoder input, including EXIF/XMP.
      metadataRanges.push([start, end]);
    }
    if (marker === 0xe2 && ascii(bytes, body, 4) === "MPF\0") throw new ImageProblem(FORMAT_ERROR);
    position = end;
    if (marker === 0xda) {
      if (!width || length < 6 || bytes[body] < 1 || bytes[body] > components || length !== 6 + 2 * bytes[body]) return fail();
      scans++;
      // Bounded scan through entropy data: FF00 stuffing and restart markers are not segments.
      while (position < bytes.length) {
        if (bytes[position] !== 0xff) { position++; continue; }
        const next = bytes[position + 1];
        if (next === 0 || (next >= 0xd0 && next <= 0xd7)) { position += 2; continue; }
        if (next === 0xff) { position++; continue; }
        break;
      }
    }
  }
  return fail();
}

// A bounded compressed-file read (<=20 MB), never a full-resolution pixel allocation.
// Extension and browser MIME are deliberately not trusted.
export function inspectImage(bytes: Uint8Array): ImageInfo {
  checkInputSize(bytes.length);
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n)) return inspectPng(bytes);
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return inspectJpeg(bytes);
  throw new ImageProblem(FORMAT_ERROR);
}

export function decoderBlob(bytes: Uint8Array, metadata: ImageInfo): Blob {
  // Firefox can reject JPEGs assembled from sliced Blob parts. Flatten the bounded
  // compressed bytes after removing metadata; this never allocates decoded pixels.
  const removed = metadata.metadataRanges.reduce((total, [start, end]) => total + end - start, 0);
  const data = new Uint8Array(bytes.length - removed);
  let offset = 0, target = 0;
  for (const [start, end] of metadata.metadataRanges) {
    data.set(bytes.subarray(offset, start), target);
    target += start - offset; offset = end;
  }
  data.set(bytes.subarray(offset), target);
  return new Blob([data], { type: metadata.mime });
}
