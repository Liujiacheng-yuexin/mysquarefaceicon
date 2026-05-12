"use client";

import { Download, Palette, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FaceStyle = "soft" | "wide" | "rounded" | "tiny";
type HairStyle = "bob" | "spikes" | "curtain" | "cap" | "side";
type EyeStyle = "dot" | "happy" | "sleepy" | "sparkle" | "wink";
type MouthStyle = "smile" | "flat" | "open" | "cat" | "tiny";
type CheekStyle = "none" | "blush" | "dots" | "pixel";
type AccessoryStyle = "none" | "glasses" | "star" | "bandage" | "freckles";

type AvatarConfig = {
  face: FaceStyle;
  hair: HairStyle;
  eyes: EyeStyle;
  mouth: MouthStyle;
  cheeks: CheekStyle;
  accessory: AccessoryStyle;
  skinColor: string;
  hairColor: string;
  backgroundColor: string;
  accentColor: string;
};

const faceOptions: FaceStyle[] = ["soft", "wide", "rounded", "tiny"];
const hairOptions: HairStyle[] = ["bob", "spikes", "curtain", "cap", "side"];
const eyeOptions: EyeStyle[] = ["dot", "happy", "sleepy", "sparkle", "wink"];
const mouthOptions: MouthStyle[] = ["smile", "flat", "open", "cat", "tiny"];
const cheekOptions: CheekStyle[] = ["none", "blush", "dots", "pixel"];
const accessoryOptions: AccessoryStyle[] = ["none", "glasses", "star", "bandage", "freckles"];

const defaultConfig: AvatarConfig = {
  face: "soft",
  hair: "bob",
  eyes: "happy",
  mouth: "smile",
  cheeks: "blush",
  accessory: "glasses",
  skinColor: "#ffd7b5",
  hairColor: "#46322b",
  backgroundColor: "#c9f3ee",
  accentColor: "#ff6f61"
};

const skinPalette = ["#ffd7b5", "#f2bd8f", "#d9956a", "#8d5b43", "#ffe4ce"];
const hairPalette = ["#31241e", "#75462e", "#f0c05a", "#25364a", "#d85b7f"];
const backgroundPalette = ["#c9f3ee", "#f8d7de", "#fff0b8", "#d9dcff", "#e7f5d4"];
const accentPalette = ["#ff6f61", "#20b8aa", "#ffbf3f", "#8f7ff5", "#ef5da8"];

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeRandomConfig(): AvatarConfig {
  return {
    face: randomItem(faceOptions),
    hair: randomItem(hairOptions),
    eyes: randomItem(eyeOptions),
    mouth: randomItem(mouthOptions),
    cheeks: randomItem(cheekOptions),
    accessory: randomItem(accessoryOptions),
    skinColor: randomItem(skinPalette),
    hairColor: randomItem(hairPalette),
    backgroundColor: randomItem(backgroundPalette),
    accentColor: randomItem(accentPalette)
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string
) {
  roundRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outer: number, inner: number) {
  let rotation = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i += 1) {
    ctx.lineTo(cx + Math.cos(rotation) * outer, cy + Math.sin(rotation) * outer);
    rotation += step;
    ctx.lineTo(cx + Math.cos(rotation) * inner, cy + Math.sin(rotation) * inner);
    rotation += step;
  }
  ctx.lineTo(cx, cy - outer);
  ctx.closePath();
  ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  for (let y = 32; y < 512; y += 64) {
    for (let x = 32; x < 512; x += 64) {
      ctx.fillRect(x, y, 10, 10);
    }
  }
}

function faceBox(config: AvatarConfig) {
  if (config.face === "wide") return { x: 116, y: 122, width: 280, height: 280, radius: 58 };
  if (config.face === "rounded") return { x: 128, y: 112, width: 256, height: 292, radius: 82 };
  if (config.face === "tiny") return { x: 148, y: 136, width: 216, height: 244, radius: 50 };
  return { x: 126, y: 120, width: 260, height: 270, radius: 62 };
}

function drawFace(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  const box = faceBox(config);
  fillRoundRect(ctx, box.x + 8, box.y + 10, box.width, box.height, box.radius, "rgba(21, 43, 53, 0.14)");
  fillRoundRect(ctx, box.x, box.y, box.width, box.height, box.radius, config.skinColor);
  ctx.strokeStyle = "rgba(23,33,43,0.28)";
  ctx.lineWidth = 6;
  roundRect(ctx, box.x, box.y, box.width, box.height, box.radius);
  ctx.stroke();
}

function drawHair(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  const color = config.hairColor;
  ctx.fillStyle = color;

  if (config.hair === "bob") {
    fillRoundRect(ctx, 108, 82, 296, 166, 70, color);
    fillRoundRect(ctx, 96, 190, 68, 132, 28, color);
    fillRoundRect(ctx, 348, 190, 68, 132, 28, color);
    fillRoundRect(ctx, 156, 120, 78, 76, 24, color);
    fillRoundRect(ctx, 226, 110, 82, 88, 24, color);
    fillRoundRect(ctx, 298, 122, 62, 74, 22, color);
  }

  if (config.hair === "spikes") {
    ctx.beginPath();
    ctx.moveTo(112, 208);
    ctx.lineTo(142, 86);
    ctx.lineTo(188, 158);
    ctx.lineTo(226, 72);
    ctx.lineTo(266, 154);
    ctx.lineTo(324, 82);
    ctx.lineTo(390, 212);
    ctx.lineTo(112, 208);
    ctx.closePath();
    ctx.fill();
    fillRoundRect(ctx, 118, 164, 276, 96, 42, color);
  }

  if (config.hair === "curtain") {
    fillRoundRect(ctx, 108, 92, 296, 120, 62, color);
    ctx.fillRect(244, 104, 24, 142);
    fillRoundRect(ctx, 116, 126, 118, 130, 34, color);
    fillRoundRect(ctx, 278, 126, 118, 130, 34, color);
  }

  if (config.hair === "cap") {
    fillRoundRect(ctx, 112, 96, 288, 122, 60, color);
    fillRoundRect(ctx, 156, 74, 200, 70, 34, config.accentColor);
    fillRoundRect(ctx, 316, 138, 100, 38, 18, config.accentColor);
  }

  if (config.hair === "side") {
    fillRoundRect(ctx, 104, 92, 306, 116, 56, color);
    fillRoundRect(ctx, 100, 154, 154, 178, 44, color);
    ctx.fillRect(176, 138, 88, 72);
  }
}

function drawEyes(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  ctx.strokeStyle = "#17212b";
  ctx.fillStyle = "#17212b";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  if (config.eyes === "dot") {
    ctx.beginPath();
    ctx.arc(206, 254, 12, 0, Math.PI * 2);
    ctx.arc(306, 254, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  if (config.eyes === "happy") {
    ctx.beginPath();
    ctx.arc(204, 252, 22, Math.PI * 0.08, Math.PI * 0.92);
    ctx.arc(308, 252, 22, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();
  }

  if (config.eyes === "sleepy") {
    ctx.beginPath();
    ctx.moveTo(184, 256);
    ctx.lineTo(226, 248);
    ctx.moveTo(286, 248);
    ctx.lineTo(328, 256);
    ctx.stroke();
  }

  if (config.eyes === "sparkle") {
    ctx.fillStyle = config.accentColor;
    drawStar(ctx, 206, 252, 4, 20, 8);
    drawStar(ctx, 306, 252, 4, 20, 8);
    ctx.fillStyle = "#17212b";
    ctx.fillRect(199, 245, 14, 14);
    ctx.fillRect(299, 245, 14, 14);
  }

  if (config.eyes === "wink") {
    ctx.beginPath();
    ctx.arc(206, 254, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(286, 252);
    ctx.lineTo(328, 252);
    ctx.stroke();
  }
}

function drawMouth(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  ctx.strokeStyle = "#17212b";
  ctx.fillStyle = "#17212b";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  if (config.mouth === "smile") {
    ctx.beginPath();
    ctx.arc(256, 306, 34, Math.PI * 0.12, Math.PI * 0.88);
    ctx.stroke();
  }

  if (config.mouth === "flat") {
    ctx.beginPath();
    ctx.moveTo(224, 318);
    ctx.lineTo(288, 318);
    ctx.stroke();
  }

  if (config.mouth === "open") {
    fillRoundRect(ctx, 232, 296, 48, 58, 22, "#17212b");
    fillRoundRect(ctx, 240, 324, 32, 20, 10, config.accentColor);
  }

  if (config.mouth === "cat") {
    ctx.beginPath();
    ctx.moveTo(256, 304);
    ctx.quadraticCurveTo(238, 330, 220, 312);
    ctx.moveTo(256, 304);
    ctx.quadraticCurveTo(274, 330, 292, 312);
    ctx.stroke();
  }

  if (config.mouth === "tiny") {
    ctx.beginPath();
    ctx.arc(256, 316, 9, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCheeks(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  if (config.cheeks === "none") return;

  if (config.cheeks === "blush") {
    ctx.fillStyle = "rgba(255,111,97,0.45)";
    fillRoundRect(ctx, 154, 292, 48, 24, 12, "rgba(255,111,97,0.45)");
    fillRoundRect(ctx, 310, 292, 48, 24, 12, "rgba(255,111,97,0.45)");
  }

  if (config.cheeks === "dots") {
    drawPixel(ctx, 168, 294, 10, config.accentColor);
    drawPixel(ctx, 190, 300, 8, config.accentColor);
    drawPixel(ctx, 318, 300, 8, config.accentColor);
    drawPixel(ctx, 340, 294, 10, config.accentColor);
  }

  if (config.cheeks === "pixel") {
    for (let i = 0; i < 3; i += 1) {
      drawPixel(ctx, 158 + i * 14, 296, 10, "rgba(255,111,97,0.48)");
      drawPixel(ctx, 326 + i * 14, 296, 10, "rgba(255,111,97,0.48)");
    }
  }
}

function drawAccessories(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  ctx.strokeStyle = "#17212b";
  ctx.fillStyle = config.accentColor;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  if (config.accessory === "glasses") {
    ctx.strokeRect(168, 228, 72, 52);
    ctx.strokeRect(272, 228, 72, 52);
    ctx.beginPath();
    ctx.moveTo(240, 254);
    ctx.lineTo(272, 254);
    ctx.stroke();
  }

  if (config.accessory === "star") {
    drawStar(ctx, 360, 188, 5, 26, 11);
  }

  if (config.accessory === "bandage") {
    fillRoundRect(ctx, 172, 346, 84, 28, 10, "#fff3d4");
    ctx.strokeStyle = "rgba(23,33,43,0.18)";
    ctx.strokeRect(190, 352, 16, 16);
    ctx.strokeRect(222, 352, 16, 16);
  }

  if (config.accessory === "freckles") {
    ["#17212b", "#17212b", "#17212b"].forEach((color, index) => {
      drawPixel(ctx, 176 + index * 18, 284 + (index % 2) * 8, 6, color);
      drawPixel(ctx, 316 + index * 18, 284 + (index % 2) * 8, 6, color);
    });
  }
}

function drawAvatar(ctx: CanvasRenderingContext2D, config: AvatarConfig) {
  ctx.clearRect(0, 0, 512, 512);
  drawBackground(ctx, config);
  drawFace(ctx, config);
  drawHair(ctx, config);
  drawEyes(ctx, config);
  drawMouth(ctx, config);
  drawCheeks(ctx, config);
  drawAccessories(ctx, config);
}

type OptionGroupProps<T extends string> = {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
};

function OptionGroup<T extends string>({ label, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <fieldset className="control-group">
      <legend>{label}</legend>
      <div className="segmented-list">
        {options.map((option) => (
          <button
            className={option === value ? "segment is-active" : "segment"}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type ColorControlProps = {
  label: string;
  value: string;
  presets: string[];
  onChange: (value: string) => void;
};

function ColorControl({ label, value, presets, onChange }: ColorControlProps) {
  return (
    <div className="color-control">
      <label>
        <span>{label}</span>
        <input
          aria-label={`${label} color`}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <div className="swatch-row" aria-label={`${label} color presets`}>
        {presets.map((preset) => (
          <button
            aria-label={`Use ${preset} for ${label}`}
            className={preset.toLowerCase() === value.toLowerCase() ? "swatch is-active" : "swatch"}
            key={preset}
            onClick={() => onChange(preset)}
            style={{ backgroundColor: preset }}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

export default function AvatarGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [config, setConfig] = useState<AvatarConfig>(defaultConfig);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    drawAvatar(ctx, config);
  }, [config]);

  function updateConfig<T extends keyof AvatarConfig>(key: T, value: AvatarConfig[T]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function downloadAvatar() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "my-square-face-icon.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="generator-shell" aria-label="Square face icon generator">
      <div className="preview-panel">
        <div className="canvas-frame">
          <canvas
            aria-label="Generated square face icon preview"
            height={512}
            ref={canvasRef}
            role="img"
            width={512}
          />
        </div>
        <div className="action-row">
          <button className="tool-button secondary" type="button" onClick={() => setConfig(makeRandomConfig())}>
            <Shuffle aria-hidden="true" size={18} />
            Random
          </button>
          <button className="tool-button secondary" type="button" onClick={() => setConfig(defaultConfig)}>
            <RotateCcw aria-hidden="true" size={18} />
            Reset
          </button>
          <button className="tool-button primary" type="button" onClick={downloadAvatar}>
            <Download aria-hidden="true" size={18} />
            Download PNG
          </button>
        </div>
      </div>

      <div className="controls-panel">
        <div className="panel-title">
          <Palette aria-hidden="true" size={20} />
          <h2>Customize Your Icon</h2>
        </div>

        <div className="controls-grid">
          <OptionGroup label="Face" options={faceOptions} value={config.face} onChange={(value) => updateConfig("face", value)} />
          <OptionGroup label="Hair" options={hairOptions} value={config.hair} onChange={(value) => updateConfig("hair", value)} />
          <OptionGroup label="Eyes" options={eyeOptions} value={config.eyes} onChange={(value) => updateConfig("eyes", value)} />
          <OptionGroup label="Mouth" options={mouthOptions} value={config.mouth} onChange={(value) => updateConfig("mouth", value)} />
          <OptionGroup label="Cheeks" options={cheekOptions} value={config.cheeks} onChange={(value) => updateConfig("cheeks", value)} />
          <OptionGroup
            label="Accessory"
            options={accessoryOptions}
            value={config.accessory}
            onChange={(value) => updateConfig("accessory", value)}
          />
        </div>

        <div className="color-grid">
          <ColorControl label="Skin" value={config.skinColor} presets={skinPalette} onChange={(value) => updateConfig("skinColor", value)} />
          <ColorControl label="Hair" value={config.hairColor} presets={hairPalette} onChange={(value) => updateConfig("hairColor", value)} />
          <ColorControl
            label="Background"
            value={config.backgroundColor}
            presets={backgroundPalette}
            onChange={(value) => updateConfig("backgroundColor", value)}
          />
          <ColorControl
            label="Accent"
            value={config.accentColor}
            presets={accentPalette}
            onChange={(value) => updateConfig("accentColor", value)}
          />
        </div>
      </div>
    </div>
  );
}
