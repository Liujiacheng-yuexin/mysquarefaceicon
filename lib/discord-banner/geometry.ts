import type { ImageMode } from "./config";

export type Crop = { zoom: number; x: number; y: number };
export const DEFAULT_CROP: Crop = { zoom: 1, x: 0.5, y: 0.5 };
export type Geometry = {
  sx: number; sy: number; sw: number; sh: number;
  dx: number; dy: number; dw: number; dh: number; scale: number;
};

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) throw new Error("Invalid image position or zoom.");
  return Math.min(max, Math.max(min, value));
}

export function geometry(ws: number, hs: number, wt: number, ht: number, mode: ImageMode, crop: Crop): Geometry {
  if (![ws, hs, wt, ht].every(n => Number.isSafeInteger(n) && n > 0)) throw new Error("Invalid image dimensions.");
  const zoom = clamp(crop.zoom, 1, 4), x = clamp(crop.x, 0, 1), y = clamp(crop.y, 0, 1);
  if (mode === "fit") {
    const scale = Math.min(wt / ws, ht / hs), dw = ws * scale, dh = hs * scale;
    return { sx: 0, sy: 0, sw: ws, sh: hs, dx: (wt - dw) / 2, dy: (ht - dh) / 2, dw, dh, scale };
  }
  if (mode !== "crop") throw new Error("Invalid image mode.");
  const scale = Math.max(wt / ws, ht / hs) * zoom;
  const sw = wt / scale, sh = ht / scale;
  return { sx: Math.max(0, ws - sw) * x, sy: Math.max(0, hs - sh) * y, sw, sh, dx: 0, dy: 0, dw: wt, dh: ht, scale };
}

// Raw JPEG pixels -> EXIF-normalized coordinates. No intermediate full-size canvas.
export function orientationTransform(orientation: number, width: number, height: number): [number, number, number, number, number, number] {
  switch (orientation) {
    case 1: return [1, 0, 0, 1, 0, 0];
    case 2: return [-1, 0, 0, 1, width, 0];
    case 3: return [-1, 0, 0, -1, width, height];
    case 4: return [1, 0, 0, -1, 0, height];
    case 5: return [0, 1, 1, 0, 0, 0];
    case 6: return [0, 1, -1, 0, height, 0];
    case 7: return [0, -1, -1, 0, height, width];
    case 8: return [0, -1, 1, 0, 0, width];
    default: throw new Error("Invalid image orientation.");
  }
}
