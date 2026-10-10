"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { formatBytes, LIMITS, PRESETS, type ImageMime, type ImageMode, type PresetId } from "@/lib/discord-banner/config";
import { clamp, DEFAULT_CROP, geometry, type Crop } from "@/lib/discord-banner/geometry";
import type { SourceImage, EditSettings } from "@/lib/discord-banner/canvas";
import styles from "@/app/discord-banner-size/banner.module.css";

type Output = { url: string; bytes: number; filename: string; mime: ImageMime; width: number; height: number };
const engine = () => import("@/lib/discord-banner/canvas");
const shortNames: Record<PresetId, string> = { profile: "Profile", server: "Server", invite: "Invite" };

export default function DiscordBannerEditor() {
  const [presetId, setPresetId] = useState<PresetId>("profile");
  const [source, setSource] = useState<SourceImage | null>(null);
  const [mode, setMode] = useState<ImageMode>("crop");
  const [crop, setCrop] = useState<Crop>({ ...DEFAULT_CROP });
  const [background, setBackground] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [mime, setMime] = useState<ImageMime>("image/png");
  const [quality, setQuality] = useState<number>(LIMITS.jpegQuality.default);
  const [output, setOutput] = useState<Output | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const chooseButton = useRef<HTMLButtonElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<SourceImage | null>(null);
  const outputUrl = useRef<string | null>(null);
  const loadVersion = useRef(0), exportVersion = useRef(0);
  const mounted = useRef(true);
  const loadQueue = useRef<Promise<void>>(Promise.resolve());
  const exportQueue = useRef<Promise<void>>(Promise.resolve());
  const drag = useRef<{ id: number; x: number; y: number; crop: Crop } | null>(null);
  const preset = PRESETS.find(p => p.id === presetId)!;
  const enlarged = source ? geometry(source.info.width, source.info.height, preset.width, preset.height, mode, crop).scale > 1 : false;

  const invalidateExport = useCallback(() => {
    exportVersion.current++;
    if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
    outputUrl.current = null;
    setOutput(null); setError(""); setExporting(false);
  }, []);

  useEffect(() => {
    const loading = loadVersion, encoding = exportVersion;
    mounted.current = true;
    const release = () => {
      mounted.current = false; loading.current++; encoding.current++;
      sourceRef.current?.bitmap.close(); sourceRef.current = null;
      if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
      outputUrl.current = null;
    };
    const leave = () => {
      release(); setSource(null); setOutput(null); setPreparing(false); setExporting(false); setError("");
    };
    const returnToPage = () => { mounted.current = true; };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", returnToPage);
    return () => {
      release(); window.removeEventListener("pagehide", leave); window.removeEventListener("pageshow", returnToPage);
    };
  }, []);

  function removeImage() {
    loadVersion.current++; invalidateExport();
    sourceRef.current?.bitmap.close(); sourceRef.current = null;
    setSource(null); setPreparing(false); setCrop({ ...DEFAULT_CROP });
    if (fileInput.current) fileInput.current.value = "";
    chooseButton.current?.focus();
  }

  function chooseFile(file?: File) {
    if (!file) return; // Cancelling the system picker preserves the current image.
    const version = ++loadVersion.current;
    invalidateExport();
    sourceRef.current?.bitmap.close(); sourceRef.current = null;
    setSource(null); setPreparing(true); setCrop({ ...DEFAULT_CROP });
    const current = () => mounted.current && version === loadVersion.current;
    // At most one source bitmap decode is in flight, even during rapid replacements.
    loadQueue.current = loadQueue.current.then(async () => {
      if (!current()) return;
      const api = await engine();
      try {
        const next = await api.loadImage(file, current);
        if (!current()) { next.bitmap.close(); return; }
        sourceRef.current = next; setSource(next); setPreparing(false);
      } catch (reason) {
        if (current()) {
          setPreparing(false);
          setError(api.friendlyError(reason, "We couldn’t read this image. Try another PNG or JPG file."));
        }
      }
    }).catch(() => {
      if (current()) { setPreparing(false); setError("The image editor could not load. Please choose your image again."); }
    });
  }

  useEffect(() => {
    if (!source) return;
    const encoding = exportVersion;
    const version = ++encoding.current;
    const current = () => mounted.current && version === encoding.current;
    const settings: EditSettings = { preset, crop, mode, mime, quality, background, transparent };
    let timer: ReturnType<typeof setTimeout> | undefined;
    setExporting(true);
    engine().then(api => {
      if (!current() || !preview.current) return;
      try { api.drawBanner(preview.current, source, settings); }
      catch (reason) {
        setExporting(false); setError(api.friendlyError(reason, "Preview failed. Remove the image and try a smaller PNG or JPG.")); return;
      }
      timer = setTimeout(() => {
        // Serial encoding prevents a slider gesture from allocating many export canvases.
        exportQueue.current = exportQueue.current.then(async () => {
          if (!current()) return;
          try {
            const blob = await api.exportBanner(source, settings);
            if (!current()) return;
            const url = URL.createObjectURL(blob);
            if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
            outputUrl.current = url;
            setOutput({ url, bytes: blob.size, mime: blob.type as ImageMime, width: preset.width, height: preset.height,
              filename: `discord-${preset.filename}-${preset.width}x${preset.height}.${mime === "image/png" ? "png" : "jpg"}` });
            setExporting(false);
          } catch (reason) {
            if (current()) { setExporting(false); setError(api.friendlyError(reason, "Export failed. Please retry or choose another output format.")); }
          }
        }).catch(() => {
          if (current()) { setExporting(false); setError("Export failed. Please retry."); }
        });
      }, 160);
    }).catch(() => {
      if (current()) { setExporting(false); setError("The image editor could not load. Please retry."); }
    });
    return () => { if (timer) clearTimeout(timer); if (current()) encoding.current++; };
  }, [source, preset, crop, mode, mime, quality, background, transparent, retry]);

  function changeCrop(key: keyof Crop, value: number) {
    if (!Number.isFinite(value)) return;
    invalidateExport();
    setCrop(previous => ({ ...previous, [key]: clamp(value, key === "zoom" ? 1 : 0, key === "zoom" ? 4 : 1) }));
  }

  function movePointer(event: PointerEvent<HTMLCanvasElement>) {
    if (!drag.current || drag.current.id !== event.pointerId || !source || mode !== "crop") return;
    const g = geometry(source.info.width, source.info.height, preset.width, preset.height, mode, crop);
    const box = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - drag.current.x) * preset.width / box.width / g.scale;
    const dy = (event.clientY - drag.current.y) * preset.height / box.height / g.scale;
    invalidateExport();
    setCrop({ ...drag.current.crop,
      x: source.info.width > g.sw ? clamp(drag.current.crop.x - dx / (source.info.width - g.sw), 0, 1) : 0.5,
      y: source.info.height > g.sh ? clamp(drag.current.crop.y - dy / (source.info.height - g.sh), 0, 1) : 0.5 });
  }

  function download() {
    if (!output || preparing || exporting || error || outputUrl.current !== output.url) return;
    const link = document.createElement("a");
    link.href = output.url; link.download = output.filename;
    document.body.appendChild(link); link.click(); link.remove();
    // Keep the exact verified Blob URL alive until replacement/removal/unmount.
  }

  return (
    <section className={styles.editor} aria-labelledby="banner-editor-title" data-banner-editor>
      <h2 id="banner-editor-title">Resize a static banner</h2>
      <fieldset className={styles.presets}>
        <legend>Banner type</legend>
        {PRESETS.map(item => (
          <label className={styles.preset} key={item.id} htmlFor={`banner-type-${item.id}`} data-selected={item.id === presetId}>
            <span><input id={`banner-type-${item.id}`} type="radio" name="banner-type" value={item.id} checked={item.id === presetId} aria-label={item.label}
              onChange={() => { invalidateExport(); setPresetId(item.id); }} /> <span className={styles.wideLabel}>{item.label}</span><span className={styles.narrowLabel} aria-hidden="true">{shortNames[item.id]}</span></span>
            <strong>{item.width} × {item.height}</strong>
            <small className={styles.wideLabel}>{item.sizeNote}</small>
          </label>
        ))}
      </fieldset>
      <div className={styles.selection}>
        <p><strong>Output size:</strong> {preset.width} × {preset.height} px<span className={styles.narrowLabel}> · {preset.sizeNote}</span></p>
        <p>{preset.entitlement} <a href={preset.source.url}>Official source</a></p>
      </div>
      <div className={styles.dropzone} data-dragging={dragOver}
        onDragOver={event => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={event => { event.preventDefault(); setDragOver(false); if (event.dataTransfer.files.length !== 1) { removeImage(); setError("Choose one static PNG or JPG at a time."); return; } chooseFile(event.dataTransfer.files[0]); }}>
        <input ref={fileInput} className={styles.fileInput} id="banner-file" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          aria-label="Choose a static PNG or JPG image" aria-describedby={`banner-input-help${error ? " banner-error" : ""}`} aria-invalid={!!error}
          onChange={event => { chooseFile(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
        <div className={styles.fileActions}>
          <button ref={chooseButton} className="tool-button primary" type="button" onClick={() => fileInput.current?.click()} aria-describedby="banner-input-help">
            {source ? "Replace image" : "Choose image"}
          </button>
          {source || preparing ? <button className="tool-button" type="button" onClick={removeImage}>Remove image</button> : <span>or drop a PNG or JPG here</span>}
        </div>
        <p id="banner-input-help">Static PNG or JPG only. Up to 20 MB, 16 megapixels and 8192 px per side. Images are processed in your browser.</p>
      </div>
      <noscript><p>Enable JavaScript to edit an image. The specifications and source notes below remain available.</p></noscript>
      {source ? (
        <div className={styles.workspace}>
          <div className={styles.previewColumn}>
            <p className={styles.sourceDimensions}>Source: {source.info.width} × {source.info.height} px · direction normalized</p>
            <div className={styles.canvasFrame}>
              <canvas ref={preview} className={styles.canvas} width={preset.width} height={preset.height} role="img"
                aria-label={`Banner composition preview, ${preset.width} by ${preset.height} pixels`}
                onPointerDown={event => {
                  if (mode !== "crop" || event.pointerType === "touch" || event.button !== 0) return;
                  drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, crop };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }} onPointerMove={movePointer}
                onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
                onLostPointerCapture={() => { drag.current = null; }}>
                Use the labeled position controls to adjust your image.
              </canvas>
            </div>
            <p className={styles.note}>Approximate preview. Discord may crop or display banners differently across clients.</p>
            <p className={styles.note}>Use the sliders to compose your image. With a mouse, you can also drag the preview. Touch scrolling stays available.</p>
            {enlarged ? <p className={styles.warning}>This image will be enlarged. It may look softer after export.</p> : null}
          </div>
          <div className={styles.controls}>
            <fieldset className={styles.mode}>
              <legend>Image composition</legend>
              {([['crop', 'Crop to fill'], ['fit', 'Fit whole image']] as const).map(([value, label]) => (
                <label key={value} htmlFor={`banner-mode-${value}`}><input id={`banner-mode-${value}`} type="radio" name="composition" checked={mode === value} onChange={() => { invalidateExport(); setMode(value); }} /> {label}</label>
              ))}
            </fieldset>
            {mode === "crop" ? <>
              <label htmlFor="banner-zoom">Zoom <span data-control-value aria-hidden="true">{crop.zoom.toFixed(2)}×</span></label>
              <input id="banner-zoom" type="range" min="1" max="4" step="0.01" value={crop.zoom} onChange={e => changeCrop("zoom", e.currentTarget.valueAsNumber)} />
              <label htmlFor="banner-x">Horizontal position <span data-control-value aria-hidden="true">{Math.round(crop.x * 100)}%</span></label>
              <input id="banner-x" type="range" min="0" max="100" step="1" value={crop.x * 100} onChange={e => changeCrop("x", e.currentTarget.valueAsNumber / 100)} />
              <label htmlFor="banner-y">Vertical position <span data-control-value aria-hidden="true">{Math.round(crop.y * 100)}%</span></label>
              <input id="banner-y" type="range" min="0" max="100" step="1" value={crop.y * 100} onChange={e => changeCrop("y", e.currentTarget.valueAsNumber / 100)} />
              <button className="tool-button" type="button" onClick={() => { invalidateExport(); setCrop({ ...DEFAULT_CROP }); }}>Reset crop</button>
            </> : <p className={styles.note}>The whole image is centered. Background fills the remaining space; the output size stays the same.</p>}
            <div className={styles.colorRow}>
              <label htmlFor="banner-background">Background color</label>
              <input id="banner-background" type="color" value={background} onChange={e => { invalidateExport(); setBackground(e.currentTarget.value); }} />
            </div>
            {mime === "image/png" ? <label className={styles.checkbox} htmlFor="banner-transparent"><input id="banner-transparent" type="checkbox" checked={transparent} onChange={e => { invalidateExport(); setTransparent(e.currentTarget.checked); }} /> Transparent background</label>
              : <p className={styles.note}>JPG uses the chosen background color for transparency and empty space (white by default).</p>}
            <label htmlFor="banner-format">Output format</label>
            <select id="banner-format" value={mime} onChange={e => { invalidateExport(); setMime(e.currentTarget.value as ImageMime); }}>
              <option value="image/png">PNG</option><option value="image/jpeg">JPG</option>
            </select>
            {mime === "image/jpeg" ? <>
              <label htmlFor="banner-quality">JPG quality <span data-control-value aria-hidden="true">{Math.round(quality * 100)}%</span></label>
              <input id="banner-quality" type="range" min="50" max="95" step="1" value={quality * 100} onChange={e => { invalidateExport(); setQuality(e.currentTarget.valueAsNumber / 100); }} />
            </> : null}
          </div>
        </div>
      ) : null}
      <div className={styles.exportPanel}>
        <div role="status" aria-live="polite" aria-atomic="true" className={styles.status}>
          {preparing ? "Preparing image…" : exporting ? "Exporting…" : output
            ? `Output: ${output.width} × ${output.height} px · ${output.mime === "image/png" ? "PNG" : "JPG"} · ${formatBytes(output.bytes)}`
            : "Choose an image to prepare a download."}
        </div>
        {error ? <div id="banner-error" role="alert" className={styles.error}>
          <p>{error}</p>
          {source ? <button className="tool-button" type="button" onClick={() => { invalidateExport(); setRetry(n => n + 1); }}>Retry export</button> : null}
        </div> : null}
        <button className="tool-button primary" type="button" disabled={!output || preparing || exporting || !!error} onClick={download}>
          Download {mime === "image/png" ? "PNG" : "JPG"}
        </button>
        <p className={styles.note}>Downloads must be smaller than 9.5 MB (9,500,000 bytes), our conservative export limit. MB means 1,000,000 bytes. Images and file names are not uploaded, saved in browser storage, or sent to analytics.</p>
      </div>
    </section>
  );
}
