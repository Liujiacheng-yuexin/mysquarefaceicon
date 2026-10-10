import { formatBytes, LIMITS, PRESETS, type ImageMime, type ImageMode, type Preset } from "./config";
import { geometry, orientationTransform, type Crop } from "./geometry";
import { checkInputSize, decoderBlob, ImageProblem, inspectImage, type ImageInfo } from "./image-file";

export type SourceImage = { bitmap: ImageBitmap; info: ImageInfo };
export type EditSettings = { preset: Preset; mode: ImageMode; crop: Crop; background: string; transparent: boolean; mime: ImageMime; quality: number };
export const CANCELLED = "Image operation cancelled.";

export async function loadImage(file: Blob, current: () => boolean): Promise<SourceImage> {
  checkInputSize(file.size);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!current()) throw new ImageProblem(CANCELLED);
  const info = inspectImage(bytes);
  if (!current()) throw new ImageProblem(CANCELLED);
  // EXIF has been removed. The browser cannot apply the original orientation a second time.
  const bitmap = await createImageBitmap(decoderBlob(bytes, info), { imageOrientation: "from-image" });
  if (!current() || bitmap.width !== info.rawWidth || bitmap.height !== info.rawHeight) {
    bitmap.close();
    throw new ImageProblem(current() ? "This browser could not read the image dimensions reliably. Try another PNG or JPG." : CANCELLED);
  }
  return { bitmap, info };
}

// The preview and export both call this renderer at the exact preset dimensions.
export function drawBanner(canvas: HTMLCanvasElement, source: SourceImage, settings: EditSettings) {
  const { preset, crop, mode, mime, background, transparent } = settings;
  if (!PRESETS.some(p => p.id === preset.id && p.width === preset.width && p.height === preset.height)) throw new ImageProblem("Choose a supported output size.");
  if (!/^#[0-9a-f]{6}$/i.test(background)) throw new ImageProblem("Choose a valid background color.");
  if (mime !== "image/png" && mime !== "image/jpeg") throw new ImageProblem("Choose PNG or JPG output.");
  const g = geometry(source.info.width, source.info.height, preset.width, preset.height, mode, crop);
  canvas.width = preset.width; canvas.height = preset.height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageProblem("Canvas is unavailable in this browser. Try another browser.");
  if (mime === "image/jpeg" || !transparent) {
    context.fillStyle = background; context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
  context.save();
  context.beginPath(); context.rect(0, 0, canvas.width, canvas.height); context.clip();
  context.translate(g.dx, g.dy); context.scale(g.scale, g.scale); context.translate(-g.sx, -g.sy);
  context.transform(...orientationTransform(source.info.orientation, source.info.rawWidth, source.info.rawHeight));
  context.drawImage(source.bitmap, 0, 0);
  context.restore();
  return g;
}

export async function verifyOutput(blob: Blob | null, settings: EditSettings): Promise<Blob> {
  if (!blob || blob.size === 0) throw new ImageProblem("Export failed. Please retry or choose another output format.");
  if (blob.type !== settings.mime) throw new ImageProblem("This browser did not encode the selected format. Choose PNG or try another browser.");
  if (blob.size >= LIMITS.outputBytesExclusive) {
    throw new ImageProblem(`Output is ${formatBytes(blob.size)}. This tool requires less than 9,500,000 bytes. Choose JPG or lower JPG quality, then retry.`);
  }
  const info = inspectImage(new Uint8Array(await blob.arrayBuffer()));
  if (info.mime !== settings.mime || info.orientation !== 1 || info.width !== settings.preset.width || info.height !== settings.preset.height) {
    throw new ImageProblem("The exported format or pixel dimensions did not match. Please retry or choose another format.");
  }
  const check = await createImageBitmap(blob);
  try {
    if (check.width !== settings.preset.width || check.height !== settings.preset.height) throw new ImageProblem("Exported pixel dimensions did not match. Please retry.");
  } finally { check.close(); }
  return blob;
}

export async function exportBanner(source: SourceImage, settings: EditSettings): Promise<Blob> {
  if (!Number.isFinite(settings.quality) || settings.quality < LIMITS.jpegQuality.min || settings.quality > LIMITS.jpegQuality.max) throw new ImageProblem("Choose JPG quality from 50% to 95%.");
  const canvas = document.createElement("canvas");
  try {
    drawBanner(canvas, source, settings);
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      try { canvas.toBlob(resolve, settings.mime, settings.mime === "image/jpeg" ? settings.quality : undefined); }
      catch { reject(new ImageProblem("Export failed. Please retry or choose another output format.")); }
    });
    return await verifyOutput(blob, settings);
  } finally { canvas.width = 0; canvas.height = 0; }
}

export function friendlyError(error: unknown, fallback: string): string {
  // Do not log files, browser exception text, EXIF or file names to telemetry.
  return error instanceof ImageProblem ? error.message : fallback;
}
