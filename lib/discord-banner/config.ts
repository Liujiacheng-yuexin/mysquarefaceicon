// Manually reviewed against the linked Discord documents on 2026-10-09.
// Review dates must not change automatically at build time.
export const BANNER_PATH = "/discord-banner-size";
export const BANNER_URL = `https://mysquarefaceicon.com${BANNER_PATH}`;
export const CHECKED_DATE = "2026-10-09";
export const CHECKED_LABEL = "October 9, 2026";
export const BANNER_TITLE = "Discord Banner Size Guide & Free Image Resizer";
export const BANNER_DESCRIPTION = "Check Discord profile and server banner sizes, compare current requirements, and crop or fit a static image in your browser before downloading PNG or JPG.";

export const LIMITS = {
  inputBytes: 20_000_000,
  pixels: 16_000_000,
  longestSide: 8192,
  outputBytesExclusive: 9_500_000,
  structures: 16384,
  jpegQuality: { min: 0.5, max: 0.95, default: 0.92 }
} as const;

export const SOURCES = {
  profile: { name: "Custom Profiles", url: "https://support.discord.com/hc/en-us/articles/4403147417623-Custom-Profiles", updated: "March 11, 2026" },
  member: { name: "Per-Server Profiles", url: "https://support.discord.com/hc/en-us/articles/4409388345495-Per-Server-Profiles", updated: "August 6, 2025" },
  server: { name: "Server Banners", url: "https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners", updated: "May 31, 2022" },
  invite: { name: "Server Invite Background", url: "https://support.discord.com/hc/en-us/articles/4415841146391-Server-Invite-Background", updated: "April 8, 2022" },
  boosts: { name: "Server Boosting FAQ", url: "https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ", updated: "September 14, 2026" },
  nitro: { name: "What are Nitro & Nitro Basic?", url: "https://support.discord.com/hc/en-us/articles/115000435108-What-are-Nitro-Nitro-Basic", updated: "September 29, 2026" },
  guild: { name: "Guild API: Modify Guild", url: "https://docs.discord.com/developers/resources/guild#modify-guild" }
} as const;

export const PRESETS = [
  { id: "profile", label: "Profile banner", width: 680, height: 240, sizeNote: "Official minimum", filename: "profile-banner", entitlement: "Full Nitro to upload to your profile.", source: SOURCES.profile },
  { id: "server", label: "Server banner", width: 960, height: 540, sizeNote: "Recommended starting size", filename: "server-banner", entitlement: "Usually Level 2 for a static server banner; appropriate server permissions are also required.", source: SOURCES.server },
  { id: "invite", label: "Invite background", width: 1920, height: 1080, sizeNote: "Exact documented size", filename: "invite-background", entitlement: "Server Level 1 or above. Static JPG or PNG only.", source: SOURCES.invite }
] as const;

export type Preset = (typeof PRESETS)[number];
export type PresetId = Preset["id"];
export type ImageMime = "image/png" | "image/jpeg";
export type ImageMode = "crop" | "fit";

export function isBannerPath(path: string | null): boolean {
  if (path === null) return false;
  try { return /^\/discord-banner-size\/?$/.test(decodeURIComponent(path.split(/[?#]/, 1)[0])); }
  catch { return false; }
}

export function crossesBannerBoundary(from: string | null, to: string | null): boolean {
  return from !== null && to !== null && isBannerPath(from) !== isBannerPath(to);
}

export function formatBytes(bytes: number): string {
  const unit = bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(2)} MB` : `${(bytes / 1000).toFixed(1)} KB`;
  return `${unit} (${bytes.toLocaleString("en-US")} bytes)`;
}
