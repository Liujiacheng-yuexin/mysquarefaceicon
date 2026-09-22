import type {
  GameDeliveryType,
  GameRecord,
  ReleaseDecision
} from "./game-schema";
import { getGamePlayerPreview } from "./game-images";

export type PlayerLoadState = "idle" | "loading" | "ready" | "error";

export type PlayerStatus = {
  readonly state: PlayerLoadState;
  readonly message: string;
  readonly showSlowHint?: boolean;
};

export type PlayerCapabilities = {
  readonly play: boolean;
  readonly fullscreen: boolean;
  readonly reload: boolean;
  readonly outbound: boolean;
};

export const PLAYER_DELIVERY_TYPES = [
  "RUFFLE_SWF",
  "HTML5",
  "LOCAL_IFRAME",
  "OFFICIAL_IFRAME",
  "EXTERNAL_LINK"
] as const satisfies readonly GameDeliveryType[];

const RELEASE_DECISIONS = ["APPROVED", "REVIEW_REQUIRED", "DIRECT_LINK_ONLY", "BLOCKED"] as const;

const PLAYER_CAPABILITIES = {
  RUFFLE_SWF: { play: true, fullscreen: true, reload: true, outbound: false },
  HTML5: { play: true, fullscreen: true, reload: true, outbound: false },
  LOCAL_IFRAME: { play: true, fullscreen: true, reload: true, outbound: false },
  OFFICIAL_IFRAME: { play: true, fullscreen: true, reload: true, outbound: true },
  EXTERNAL_LINK: { play: false, fullscreen: false, reload: false, outbound: true }
} as const satisfies Record<GameDeliveryType, PlayerCapabilities>;

export type PlayerCover = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
};

export type PlayerSourceSummary = {
  readonly providerName: string;
  readonly originalUrl: string | null;
  readonly attribution: string | null;
};

export type PlayerLabels = {
  readonly start: string;
  readonly reload: string;
  readonly help: string;
  readonly cover: string;
  readonly loading: string;
  readonly error: string;
  readonly slowLoadingHint: string;
};

export type PlayerReleasePolicy = {
  readonly releaseDecision: ReleaseDecision;
  readonly allowedDeliveryTypes: readonly GameDeliveryType[];
};

type PlayerModelBase<TType extends GameDeliveryType> = {
  readonly id: string;
  readonly name: string;
  readonly type: TType;
  readonly ariaLabel: string;
  readonly cover: PlayerCover | null;
  readonly frame: {
    readonly aspectRatio: string;
    readonly maxWidth: string;
    readonly backgroundColor: string;
  };
  readonly labels: PlayerLabels;
  readonly source: PlayerSourceSummary;
  readonly policy: PlayerReleasePolicy;
  readonly deviceNotice: string;
  readonly reportHref: string;
  readonly showStartControl: boolean;
};

export type RufflePlayerModel = PlayerModelBase<"RUFFLE_SWF"> & {
  readonly player: {
    readonly swfSources: readonly [string, ...string[]];
    readonly backgroundColor: string;
    readonly clickToLoad: true;
  };
};

export type Html5PlayerModel = PlayerModelBase<"HTML5"> & {
  readonly player: {
    readonly entryUrl: string;
  };
};

export type LocalIframePlayerModel = PlayerModelBase<"LOCAL_IFRAME"> & {
  readonly player: {
    readonly src: string;
    readonly sandbox: readonly [string, ...string[]];
  };
};

export type OfficialIframePlayerModel = PlayerModelBase<"OFFICIAL_IFRAME"> & {
  readonly player: {
    readonly src: string;
    readonly providerName: string;
    readonly permissionEvidenceUrl: string;
  };
};

export type ExternalLinkPlayerModel = PlayerModelBase<"EXTERNAL_LINK"> & {
  readonly player: {
    readonly url: string;
    readonly ctaLabel: string;
    readonly target: "_blank";
    readonly rel: readonly ["noopener", "noreferrer"];
    readonly directLinkOnly: true;
  };
};

export type PlayablePlayerModel =
  | RufflePlayerModel
  | Html5PlayerModel
  | LocalIframePlayerModel
  | OfficialIframePlayerModel;

export type GamePlayerModel = PlayablePlayerModel | ExternalLinkPlayerModel;

type PlayerPresentationOverrides = Partial<{
  ariaLabel: string;
  cover: PlayerCover | null;
  aspectRatio: string;
  maxWidth: string;
  backgroundColor: string;
  labels: Partial<PlayerLabels>;
  deviceNotice: string;
  reportHref: string;
  showStartControl: boolean;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export function assertNever(value: never, message = "Unsupported player delivery type"): never {
  throw new Error(`${message}: ${String(value)}`);
}

export function getPlayerCapabilities(type: GameDeliveryType): PlayerCapabilities {
  switch (type) {
    case "RUFFLE_SWF":
      return PLAYER_CAPABILITIES.RUFFLE_SWF;
    case "HTML5":
      return PLAYER_CAPABILITIES.HTML5;
    case "LOCAL_IFRAME":
      return PLAYER_CAPABILITIES.LOCAL_IFRAME;
    case "OFFICIAL_IFRAME":
      return PLAYER_CAPABILITIES.OFFICIAL_IFRAME;
    case "EXTERNAL_LINK":
      return PLAYER_CAPABILITIES.EXTERNAL_LINK;
    default:
      return assertNever(type);
  }
}

export function assertPlayerReleasePolicy(policy: PlayerReleasePolicy, type: GameDeliveryType) {
  if (policy.releaseDecision === "BLOCKED") {
    throw new Error("Blocked game records cannot be dispatched to a player adapter.");
  }

  if (!policy.allowedDeliveryTypes.includes(type)) {
    throw new Error(`${type} is not allowed by the game release policy.`);
  }

  if (policy.releaseDecision === "DIRECT_LINK_ONLY" && type !== "EXTERNAL_LINK") {
    throw new Error("DIRECT_LINK_ONLY records can only use the EXTERNAL_LINK adapter.");
  }
}

export function validateGamePlayerModel(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Player model must be an object."];

  const type = value.type;
  if (typeof type !== "string" || !PLAYER_DELIVERY_TYPES.includes(type as GameDeliveryType)) {
    return ["Player model has an unsupported delivery type."];
  }

  for (const key of ["id", "name", "ariaLabel", "deviceNotice", "reportHref"] as const) {
    if (typeof value[key] !== "string" || value[key].trim().length === 0) {
      errors.push(`Player model ${key} must be a non-empty string.`);
    }
  }

  if (!isRecord(value.player)) {
    errors.push("Player model player must be an object.");
    return errors;
  }

  if (!isRecord(value.policy)) {
    errors.push("Player model policy must be an object.");
  } else {
    const releaseDecision = value.policy.releaseDecision;
    const allowedDeliveryTypes = value.policy.allowedDeliveryTypes;
    if (
      typeof releaseDecision !== "string" ||
      !RELEASE_DECISIONS.includes(releaseDecision as ReleaseDecision)
    ) {
      errors.push("Player model policy has an unsupported release decision.");
    }
    if (
      !Array.isArray(allowedDeliveryTypes) ||
      allowedDeliveryTypes.some(
        (allowedType) =>
          typeof allowedType !== "string" || !PLAYER_DELIVERY_TYPES.includes(allowedType as GameDeliveryType)
      )
    ) {
      errors.push("Player model policy has unsupported allowed delivery types.");
    }
    if (
      typeof releaseDecision === "string" &&
      RELEASE_DECISIONS.includes(releaseDecision as ReleaseDecision) &&
      Array.isArray(allowedDeliveryTypes)
    ) {
      try {
        assertPlayerReleasePolicy(
          {
            releaseDecision: releaseDecision as ReleaseDecision,
            allowedDeliveryTypes: allowedDeliveryTypes as GameDeliveryType[]
          },
          type as GameDeliveryType
        );
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Player release policy is invalid.");
      }
    }
  }

  switch (type as GameDeliveryType) {
    case "RUFFLE_SWF":
      if (!Array.isArray(value.player.swfSources) || value.player.swfSources.length === 0) {
        errors.push("RUFFLE_SWF requires at least one SWF source.");
      } else if (value.player.swfSources.some((source) => typeof source !== "string" || !isLocalPath(source))) {
        errors.push("RUFFLE_SWF sources must be local root-relative paths.");
      }
      if (value.player.clickToLoad !== true) errors.push("RUFFLE_SWF must remain click-to-load.");
      break;
    case "HTML5":
      if (typeof value.player.entryUrl !== "string" || !isLocalPath(value.player.entryUrl)) {
        errors.push("HTML5 requires a local root-relative entry URL.");
      }
      break;
    case "LOCAL_IFRAME":
      if (typeof value.player.src !== "string" || !isLocalPath(value.player.src)) {
        errors.push("LOCAL_IFRAME requires a local root-relative source.");
      }
      if (!Array.isArray(value.player.sandbox) || value.player.sandbox.length === 0) {
        errors.push("LOCAL_IFRAME requires a non-empty sandbox policy.");
      }
      break;
    case "OFFICIAL_IFRAME":
      if (typeof value.player.src !== "string" || !isHttpsUrl(value.player.src)) {
        errors.push("OFFICIAL_IFRAME requires an HTTPS source.");
      }
      if (
        typeof value.player.permissionEvidenceUrl !== "string" ||
        !isHttpsUrl(value.player.permissionEvidenceUrl)
      ) {
        errors.push("OFFICIAL_IFRAME requires HTTPS permission evidence.");
      }
      if (typeof value.player.providerName !== "string" || value.player.providerName.trim().length === 0) {
        errors.push("OFFICIAL_IFRAME requires a provider name.");
      }
      break;
    case "EXTERNAL_LINK":
      if (typeof value.player.url !== "string" || !isHttpsUrl(value.player.url)) {
        errors.push("EXTERNAL_LINK requires an HTTPS destination.");
      }
      if (
        value.player.target !== "_blank" ||
        value.player.directLinkOnly !== true ||
        !Array.isArray(value.player.rel) ||
        value.player.rel.join(" ") !== "noopener noreferrer"
      ) {
        errors.push("EXTERNAL_LINK must be direct-link-only and use safe new-tab attributes.");
      }
      if (typeof value.player.ctaLabel !== "string" || value.player.ctaLabel.trim().length === 0) {
        errors.push("EXTERNAL_LINK requires a CTA label.");
      }
      break;
    default:
      return assertNever(type as never);
  }

  return errors;
}

export function assertValidGamePlayerModel(value: unknown): asserts value is GamePlayerModel {
  const errors = validateGamePlayerModel(value);
  if (errors.length > 0) throw new Error(`Invalid GamePlayer model: ${errors.join(" ")}`);
}

function pickCover(game: GameRecord): PlayerCover | null {
  const image = getGamePlayerPreview(game);
  if (!image) return null;

  return {
    src: image.src,
    width: image.width,
    height: image.height
  };
}

export function createGamePlayerModel(
  game: GameRecord,
  overrides: PlayerPresentationOverrides = {}
): GamePlayerModel {
  const policy = {
    releaseDecision: game.license.releaseDecision,
    allowedDeliveryTypes: game.license.allowedDeliveryTypes
  } satisfies PlayerReleasePolicy;
  assertPlayerReleasePolicy(policy, game.player.type);

  const defaultLabels: PlayerLabels = {
    start: "Play",
    reload: "Reload",
    help: "Report Issue",
    cover: `Start ${game.name}`,
    loading: `Loading ${game.name}...`,
    error: `${game.name} could not be loaded. Please retry or use a desktop browser.`,
    slowLoadingHint: "Still loading? This game may take a few seconds to start."
  };
  const base = {
    id: game.id,
    name: game.name,
    ariaLabel: overrides.ariaLabel ?? `${game.name} player`,
    cover: overrides.cover === undefined ? pickCover(game) : overrides.cover,
    frame: {
      aspectRatio:
        overrides.aspectRatio ?? (game.player.type === "RUFFLE_SWF" ? game.player.aspectRatio : "16 / 9"),
      maxWidth: overrides.maxWidth ?? "980px",
      backgroundColor:
        overrides.backgroundColor ??
        (game.player.type === "RUFFLE_SWF" ? game.player.backgroundColor : "#111827")
    },
    labels: { ...defaultLabels, ...overrides.labels },
    source: {
      providerName: game.source.providerName,
      originalUrl: game.source.originalUrl,
      attribution: game.source.attribution
    },
    policy,
    deviceNotice: overrides.deviceNotice ?? game.mobile.note,
    reportHref: overrides.reportHref ?? "/contact",
    showStartControl: overrides.showStartControl ?? true
  };

  switch (game.player.type) {
    case "RUFFLE_SWF":
      return {
        ...base,
        type: "RUFFLE_SWF",
        player: {
          swfSources: [...game.player.swfSources],
          backgroundColor: game.player.backgroundColor,
          clickToLoad: true
        }
      };
    case "HTML5":
      return { ...base, type: "HTML5", player: { entryUrl: game.player.entryUrl } };
    case "LOCAL_IFRAME":
      return {
        ...base,
        type: "LOCAL_IFRAME",
        player: { src: game.player.src, sandbox: [...game.player.sandbox] }
      };
    case "OFFICIAL_IFRAME":
      return {
        ...base,
        type: "OFFICIAL_IFRAME",
        player: {
          src: game.player.src,
          providerName: game.player.providerName,
          permissionEvidenceUrl: game.player.permissionEvidenceUrl
        }
      };
    case "EXTERNAL_LINK":
      return {
        ...base,
        type: "EXTERNAL_LINK",
        player: {
          url: game.player.url,
          ctaLabel: game.player.ctaLabel,
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          directLinkOnly: true
        }
      };
    default:
      return assertNever(game.player);
  }
}
