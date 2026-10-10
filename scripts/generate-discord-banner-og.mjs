// Deterministic, locally rendered text graphic; no external artwork or network calls.
import sharp from "sharp";
import { resolve } from "node:path";
import { modules, root } from "./category-sample-test-utils.mjs";
const { PRESETS } = modules().load("lib/discord-banner/config.ts");
const cards = PRESETS.map((p, i) => `<g transform="translate(${64 + i * 362},316)"><rect width="348" height="208" rx="8" fill="#fffdf8"/><text x="24" y="46" font-size="25">${p.label}</text><text x="24" y="108" font-size="40" font-weight="700">${p.width} × ${p.height}</text><text x="24" y="162" font-size="19" fill="#6f6158">${p.sizeNote}</text></g>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#d8f5e1"/><g font-family="Arial,sans-serif" fill="#3f3028"><text x="64" y="115" font-size="25" fill="#08795e">MY SQUARE FACE ICON · GUIDE + TOOL</text><text x="64" y="207" font-size="66" font-weight="700">Discord Banner Size</text><text x="64" y="264" font-size="29">Choose a surface. Crop or fit a static image.</text>${cards}</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(resolve(root, "public/discord-banner-size-og.png"));
console.log("Generated public/discord-banner-size-og.png (1200 x 630) from banner presets.");
