export const GAME_SCHEMA_VERSION = "1.0.0" as const;

export type GamePageType = "GAME" | "EXTERNAL_TOOL";
export type GameDeliveryType =
  | "RUFFLE_SWF"
  | "HTML5"
  | "LOCAL_IFRAME"
  | "OFFICIAL_IFRAME"
  | "EXTERNAL_LINK";
export type GameStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "TRENDING" | "DECLINING" | "BROKEN" | "ARCHIVED";
export type IndexStatus = "INDEX" | "NOINDEX";
export type LicenseStatus = "VERIFIED" | "RESTRICTED" | "UNKNOWN" | "NOT_APPLICABLE";
export type ReleaseDecision = "APPROVED" | "REVIEW_REQUIRED" | "DIRECT_LINK_ONLY" | "BLOCKED";
export type InputMethod = "POINTER" | "TOUCH" | "KEYBOARD";
export type GameImageRole = "THUMBNAIL" | "LANDSCAPE_COVER" | "PLAYER_PREVIEW" | "OPEN_GRAPH";
export type GameImageProvenance = "PROJECT_ASSET" | "PROJECT_CDN";

export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];

export type TextSection = {
  readonly title: string;
  readonly text: string;
};

export type GameImage = {
  readonly role: GameImageRole;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly provenance: GameImageProvenance;
};

export type GameControl = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly inputMethods: NonEmptyReadonlyArray<InputMethod>;
};

export type GameFaq = {
  readonly question: string;
  readonly answer: string;
};

export type GameHomepageContent = {
  readonly hero: {
    readonly eyebrow: string;
    readonly intro: string;
    readonly cardLabel: string;
  };
  readonly about: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
    readonly notesLabel: string;
    readonly notes: readonly [string, string];
  };
  readonly headings: {
    readonly features: string;
    readonly howToPlay: string;
    readonly tipsEyebrow: string;
    readonly tips: string;
    readonly faq: string;
  };
  readonly tipsIntro: string;
  readonly finalCta: {
    readonly ariaLabel: string;
    readonly title: string;
    readonly text: string;
    readonly linkLabel: string;
  };
  readonly videoGameDescription: string;
  readonly playerPresentation: {
    readonly ariaLabel: string;
    readonly coverLabel: string;
    readonly loadingMessage: string;
    readonly errorMessage: string;
    readonly slowLoadingHint: string;
    readonly deviceNotice: string;
    readonly maxWidth: string;
    readonly reportHref: string;
    readonly startLabel: string;
    readonly reloadLabel: string;
    readonly helpLabel: string;
    readonly showStartControl: boolean;
  };
};

export type GameLegacyPageContent = {
  readonly hero: {
    readonly eyebrow: string;
    readonly intro: string;
    readonly playLabel: string;
    readonly howToPlayLabel: string;
  };
  readonly card: {
    readonly label: string;
    readonly title: string;
    readonly description: string;
    readonly badge: string;
  };
  readonly about: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
  };
  readonly headings: {
    readonly howToPlayEyebrow: string;
    readonly howToPlay: string;
    readonly featuresEyebrow: string;
    readonly features: string;
    readonly tipsEyebrow: string;
    readonly tips: string;
    readonly troubleshootingEyebrow: string;
    readonly troubleshooting: string;
    readonly faqEyebrow: string;
    readonly faq: string;
    readonly relatedEyebrow: string;
    readonly related: string;
  };
  readonly troubleshooting: NonEmptyReadonlyArray<TextSection>;
  readonly relatedGames: readonly {
    readonly gameId: string;
    readonly title: string;
    readonly text: string;
    readonly imageSrc: string;
    readonly imageAlt: string;
    readonly relatedCard?: TextSection;
  }[];
  readonly videoGameDescription: string;
  readonly playerPresentation: GameHomepageContent["playerPresentation"];
};

export type RuffleSwfPlayer = {
  readonly type: "RUFFLE_SWF";
  readonly swfSources: NonEmptyReadonlyArray<string>;
  readonly backgroundColor: string;
  readonly aspectRatio: string;
  readonly clickToLoad: boolean;
};

export type Html5Player = {
  readonly type: "HTML5";
  readonly entryUrl: string;
};

export type LocalIframePlayer = {
  readonly type: "LOCAL_IFRAME";
  readonly src: string;
  readonly sandbox: NonEmptyReadonlyArray<string>;
};

export type OfficialIframePlayer = {
  readonly type: "OFFICIAL_IFRAME";
  readonly src: string;
  readonly providerName: string;
  readonly permissionEvidenceUrl: string;
};

export type ExternalLinkPlayer = {
  readonly type: "EXTERNAL_LINK";
  readonly url: string;
  readonly ctaLabel: string;
  readonly target: "_blank";
  readonly rel: readonly ["noopener", "noreferrer"];
  readonly directLinkOnly: true;
};

export type GamePlayer = RuffleSwfPlayer | Html5Player | LocalIframePlayer | OfficialIframePlayer | ExternalLinkPlayer;

export type GameRecord = {
  readonly schemaVersion: typeof GAME_SCHEMA_VERSION;
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly pageType: GamePageType;
  readonly type: GameDeliveryType;
  readonly route: {
    readonly path: string;
    readonly canonical: string;
    readonly indexStatus: IndexStatus;
    readonly existingPublishedRoute: boolean;
  };
  readonly source: {
    readonly kind: "LOCAL_PROJECT_ASSET" | "OFFICIAL_EXTERNAL_PAGE";
    readonly providerName: string;
    readonly originalUrl: string | null;
    readonly localAssetPath: string | null;
    readonly sha256: string | null;
    readonly attribution: string | null;
  };
  readonly license: {
    readonly registryRecordId: string;
    readonly status: LicenseStatus;
    readonly releaseDecision: ReleaseDecision;
    readonly newPublicationAllowed: boolean;
    readonly allowedDeliveryTypes: readonly GameDeliveryType[];
  };
  readonly category: {
    readonly primary: string;
    readonly secondary: readonly string[];
  };
  readonly tags: NonEmptyReadonlyArray<string>;
  readonly images: NonEmptyReadonlyArray<GameImage>;
  readonly controls: NonEmptyReadonlyArray<GameControl>;
  readonly howToPlay: NonEmptyReadonlyArray<TextSection>;
  readonly features: NonEmptyReadonlyArray<TextSection>;
  readonly tips: NonEmptyReadonlyArray<string>;
  readonly faq: NonEmptyReadonlyArray<GameFaq>;
  readonly mobile: {
    readonly support: "SUPPORTED" | "PARTIAL" | "UNSUPPORTED" | "UNKNOWN";
    readonly orientation: "ANY" | "PORTRAIT_RECOMMENDED" | "LANDSCAPE_RECOMMENDED" | "UNKNOWN";
    readonly verifiedAt: string | null;
    readonly note: string;
  };
  readonly fullscreen: {
    readonly availability: "SUPPORTED" | "BROWSER_DEPENDENT" | "UNSUPPORTED" | "NOT_APPLICABLE";
    readonly mode: "BROWSER_FULLSCREEN_API" | "PLAYER_NATIVE" | "NONE";
    readonly note: string;
  };
  readonly player: GamePlayer;
  readonly status: GameStatus;
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly h1: string;
    readonly canonical: string;
    readonly primaryKeyword: string;
    readonly secondaryKeywords: readonly string[];
    readonly searchIntent: string;
    readonly semanticCoverage: {
      readonly topics: NonEmptyReadonlyArray<string>;
      readonly score: number | null;
      readonly reviewedAt: string | null;
      readonly note: string;
    };
    readonly schemaTypes: NonEmptyReadonlyArray<string>;
  };
  readonly content: {
    readonly summary: string;
    readonly description?: readonly string[];
    readonly sections: NonEmptyReadonlyArray<string>;
    readonly homepage?: GameHomepageContent;
    readonly legacyPage?: GameLegacyPageContent;
  };
  readonly relatedGameIds: readonly string[];
  readonly measurements: {
    readonly inboundLinkCount: number | null;
    readonly qualityScore: number | null;
  };
  readonly publication: {
    readonly publishedAt: string | null;
    readonly modifiedAt: string | null;
    readonly timestampStatus: "VERIFIED" | "UNKNOWN";
    readonly note: string;
  };
  readonly author: string | null;
};

type UnknownRecord = Record<string, unknown>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha256Pattern = /^[A-F0-9]{64}$/;
const hexColorPattern = /^#[A-Fa-f0-9]{6}$/;
const gameImageRoles = new Set<GameImageRole>([
  "THUMBNAIL",
  "LANDSCAPE_COVER",
  "PLAYER_PREVIEW",
  "OPEN_GRAPH"
]);
const gameImageProvenances = new Set<GameImageProvenance>(["PROJECT_ASSET", "PROJECT_CDN"]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeRootPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !/[?#\\\u0000-\u0020]/.test(value);
}

function isIsoTimestamp(value: string) {
  return !Number.isNaN(Date.parse(value)) && /T/.test(value);
}

function requireText(record: UnknownRecord, key: string, path: string, errors: string[]) {
  if (!hasText(record[key])) errors.push(`${path}.${key} must be a non-empty string.`);
}

function requireTextArray(value: unknown, path: string, errors: string[], allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    errors.push(`${path} must be ${allowEmpty ? "an" : "a non-empty"} array.`);
    return;
  }

  value.forEach((item, index) => {
    if (!hasText(item)) errors.push(`${path}[${index}] must be a non-empty string.`);
  });
}

function validateTextSections(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array.`);
    return;
  }

  value.forEach((item, index) => {
    if (!isRecord(item)) {
      errors.push(`${path}[${index}] must be an object.`);
      return;
    }
    requireText(item, "title", `${path}[${index}]`, errors);
    requireText(item, "text", `${path}[${index}]`, errors);
  });
}

function validateNullableTimestamp(value: unknown, path: string, errors: string[]) {
  if (value !== null && (typeof value !== "string" || !isIsoTimestamp(value))) {
    errors.push(`${path} must be null or an ISO timestamp.`);
  }
}

function validateHomepageContent(value: unknown, errors: string[]) {
  const path = "game.content.homepage";
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  for (const key of ["tipsIntro", "videoGameDescription"]) requireText(value, key, path, errors);
  const textGroups = {
    hero: ["eyebrow", "intro", "cardLabel"],
    about: ["eyebrow", "title", "text", "notesLabel"],
    headings: ["features", "howToPlay", "tipsEyebrow", "tips", "faq"],
    finalCta: ["ariaLabel", "title", "text", "linkLabel"],
    playerPresentation: [
      "ariaLabel", "coverLabel", "loadingMessage", "errorMessage", "slowLoadingHint",
      "deviceNotice", "maxWidth", "reportHref", "startLabel", "reloadLabel", "helpLabel"
    ]
  } as const;

  for (const [group, keys] of Object.entries(textGroups)) {
    const section = value[group];
    if (!isRecord(section)) {
      errors.push(`${path}.${group} must be an object.`);
      continue;
    }
    for (const key of keys) requireText(section, key, `${path}.${group}`, errors);
  }
  if (isRecord(value.about)) {
    requireTextArray(value.about.notes, `${path}.about.notes`, errors);
    if (!Array.isArray(value.about.notes) || value.about.notes.length !== 2) {
      errors.push(`${path}.about.notes must contain the two homepage browser notes.`);
    }
  }
  if (isRecord(value.playerPresentation)) {
    if (typeof value.playerPresentation.showStartControl !== "boolean") {
      errors.push(`${path}.playerPresentation.showStartControl must be boolean.`);
    }
    const href = value.playerPresentation.reportHref;
    if (!hasText(href) || !href.startsWith("/") || href.startsWith("//") || /[\\\u0000-\u0020]/.test(href)) {
      errors.push(`${path}.playerPresentation.reportHref must be a local root-relative path.`);
    }
  }
}

function validateLegacyPageContent(value: unknown, errors: string[]) {
  const path = "game.content.legacyPage";
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  requireText(value, "videoGameDescription", path, errors);
  const textGroups = {
    hero: ["eyebrow", "intro", "playLabel", "howToPlayLabel"],
    card: ["label", "title", "description", "badge"],
    about: ["eyebrow", "title", "text"],
    headings: [
      "howToPlayEyebrow", "howToPlay", "featuresEyebrow", "features", "tipsEyebrow", "tips",
      "troubleshootingEyebrow", "troubleshooting", "faqEyebrow", "faq", "relatedEyebrow", "related"
    ],
    playerPresentation: [
      "ariaLabel", "coverLabel", "loadingMessage", "errorMessage", "slowLoadingHint",
      "deviceNotice", "maxWidth", "reportHref", "startLabel", "reloadLabel", "helpLabel"
    ]
  } as const;
  for (const [group, keys] of Object.entries(textGroups)) {
    const section = value[group];
    if (!isRecord(section)) {
      errors.push(`${path}.${group} must be an object.`);
      continue;
    }
    for (const key of keys) requireText(section, key, `${path}.${group}`, errors);
  }
  validateTextSections(value.troubleshooting, `${path}.troubleshooting`, errors);

  if (isRecord(value.playerPresentation)) {
    if (typeof value.playerPresentation.showStartControl !== "boolean") {
      errors.push(`${path}.playerPresentation.showStartControl must be boolean.`);
    }
    const href = value.playerPresentation.reportHref;
    if (!hasText(href) || !href.startsWith("/") || href.startsWith("//") || /[\\\u0000-\u0020]/.test(href)) {
      errors.push(`${path}.playerPresentation.reportHref must be a local root-relative path.`);
    }
  }
  if (!Array.isArray(value.relatedGames)) {
    errors.push(`${path}.relatedGames must be an array.`);
    return;
  }
  const seenIds = new Set<string>();
  value.relatedGames.forEach((item, index) => {
    const itemPath = `${path}.relatedGames[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object.`);
      return;
    }
    for (const key of ["gameId", "title", "text", "imageSrc", "imageAlt"]) requireText(item, key, itemPath, errors);
    if (hasText(item.gameId)) {
      if (!slugPattern.test(item.gameId) || seenIds.has(item.gameId)) {
        errors.push(`${itemPath}.gameId must be a unique kebab-case game ID.`);
      }
      seenIds.add(item.gameId);
    }
    if (item.relatedCard !== undefined) validateTextSections([item.relatedCard], `${itemPath}.relatedCard`, errors);
    const src = item.imageSrc;
    if (!hasText(src) || !src.startsWith("/") || src.startsWith("//") || /[\\\u0000-\u0020]/.test(src)) {
      errors.push(`${itemPath}.imageSrc must be a local root-relative path.`);
    }
  });
}

export function validateGameRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Game record must be an object."];

  for (const key of ["id", "name", "slug", "pageType", "type", "status"]) {
    requireText(value, key, "game", errors);
  }

  if (value.schemaVersion !== GAME_SCHEMA_VERSION) {
    errors.push(`game.schemaVersion must be ${GAME_SCHEMA_VERSION}.`);
  }
  if (hasText(value.slug) && !slugPattern.test(value.slug)) {
    errors.push("game.slug must use lower-case kebab-case.");
  }

  const route = value.route;
  if (!isRecord(route)) {
    errors.push("game.route must be an object.");
  } else {
    requireText(route, "path", "game.route", errors);
    requireText(route, "canonical", "game.route", errors);
    if (route.indexStatus !== "INDEX" && route.indexStatus !== "NOINDEX") {
      errors.push("game.route.indexStatus must be INDEX or NOINDEX.");
    }
    if (typeof route.existingPublishedRoute !== "boolean") {
      errors.push("game.route.existingPublishedRoute must be boolean.");
    }
    if (hasText(route.path) && !route.path.startsWith("/")) {
      errors.push("game.route.path must start with /.");
    }
    if (hasText(route.canonical)) {
      if (!isHttpsUrl(route.canonical)) {
        errors.push("game.route.canonical must be an HTTPS URL.");
      } else if (hasText(route.path) && new URL(route.canonical).pathname !== route.path) {
        errors.push("game.route.canonical pathname must match game.route.path.");
      }
    }
  }

  const source = value.source;
  if (!isRecord(source)) {
    errors.push("game.source must be an object.");
  } else {
    requireText(source, "kind", "game.source", errors);
    requireText(source, "providerName", "game.source", errors);
    if (source.originalUrl !== null && (!hasText(source.originalUrl) || !isHttpsUrl(source.originalUrl))) {
      errors.push("game.source.originalUrl must be null or an HTTPS URL.");
    }
    if (source.localAssetPath !== null && !hasText(source.localAssetPath)) {
      errors.push("game.source.localAssetPath must be null or a non-empty path.");
    }
    if (source.sha256 !== null && (typeof source.sha256 !== "string" || !sha256Pattern.test(source.sha256))) {
      errors.push("game.source.sha256 must be null or an uppercase 64-character SHA-256 value.");
    }
    if (source.attribution !== null && !hasText(source.attribution)) {
      errors.push("game.source.attribution must be null or a non-empty string.");
    }
  }

  const license = value.license;
  if (!isRecord(license)) {
    errors.push("game.license must be an object.");
  } else {
    requireText(license, "registryRecordId", "game.license", errors);
    requireText(license, "status", "game.license", errors);
    requireText(license, "releaseDecision", "game.license", errors);
    if (typeof license.newPublicationAllowed !== "boolean") {
      errors.push("game.license.newPublicationAllowed must be boolean.");
    }
    requireTextArray(license.allowedDeliveryTypes, "game.license.allowedDeliveryTypes", errors, true);
    if (license.status === "UNKNOWN" && license.newPublicationAllowed !== false) {
      errors.push("UNKNOWN license status cannot allow new publication.");
    }
    if (license.releaseDecision === "DIRECT_LINK_ONLY") {
      if (value.type !== "EXTERNAL_LINK") errors.push("DIRECT_LINK_ONLY records must use EXTERNAL_LINK delivery.");
      if (license.newPublicationAllowed !== true) errors.push("DIRECT_LINK_ONLY must allow its constrained direct-link publication.");
    }
  }

  const category = value.category;
  if (!isRecord(category)) {
    errors.push("game.category must be an object.");
  } else {
    requireText(category, "primary", "game.category", errors);
    if (hasText(category.primary) && !slugPattern.test(category.primary)) {
      errors.push("game.category.primary must use lower-case kebab-case.");
    }
    requireTextArray(category.secondary, "game.category.secondary", errors, true);
  }
  requireTextArray(value.tags, "game.tags", errors);
  if (Array.isArray(value.tags)) {
    value.tags.forEach((tag, index) => {
      if (hasText(tag) && !slugPattern.test(tag)) errors.push(`game.tags[${index}] must use lower-case kebab-case.`);
    });
  }

  if (!Array.isArray(value.images) || value.images.length === 0) {
    errors.push("game.images must be a non-empty array.");
  } else {
    const roles = new Set<string>();
    value.images.forEach((image, index) => {
      const path = `game.images[${index}]`;
      if (!isRecord(image)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      for (const key of ["role", "src", "alt", "provenance"]) requireText(image, key, path, errors);
      if (hasText(image.role)) {
        if (!gameImageRoles.has(image.role as GameImageRole)) {
          errors.push(`${path}.role is not a supported Game Image role.`);
        }
        if (roles.has(image.role)) errors.push(`game.images contains duplicate role ${image.role}.`);
        roles.add(image.role);
      }
      if (hasText(image.provenance) && !gameImageProvenances.has(image.provenance as GameImageProvenance)) {
        errors.push(`${path}.provenance must be PROJECT_ASSET or PROJECT_CDN.`);
      }
      if (hasText(image.src)) {
        if (image.provenance === "PROJECT_ASSET" && !isSafeRootPath(image.src)) {
          errors.push(`${path}.src must be a safe root-relative path for PROJECT_ASSET.`);
        } else if (image.provenance === "PROJECT_CDN" && !isHttpsUrl(image.src)) {
          errors.push(`${path}.src must be an HTTPS URL for PROJECT_CDN.`);
        } else if (image.provenance !== "PROJECT_ASSET" && image.provenance !== "PROJECT_CDN") {
          if (!isSafeRootPath(image.src) && !isHttpsUrl(image.src)) {
            errors.push(`${path}.src must be a safe root-relative path or HTTPS URL.`);
          }
        }
      }
      for (const dimension of ["width", "height"] as const) {
        const dimensionValue = image[dimension];
        if (typeof dimensionValue !== "number" || !Number.isSafeInteger(dimensionValue) || dimensionValue <= 0) {
          errors.push(`${path}.${dimension} must be a positive safe integer.`);
        }
      }
      if (
        typeof image.width === "number" && Number.isSafeInteger(image.width) && image.width > 0 &&
        typeof image.height === "number" && Number.isSafeInteger(image.height) && image.height > 0
      ) {
        if (image.role === "THUMBNAIL" && image.width !== image.height) {
          errors.push(`${path} THUMBNAIL must use an exact 1:1 ratio.`);
        }
        if (image.role === "LANDSCAPE_COVER" && image.width * 9 !== image.height * 16) {
          errors.push(`${path} LANDSCAPE_COVER must use an exact 16:9 ratio.`);
        }
        if (image.role === "OPEN_GRAPH" && (image.width !== 1200 || image.height !== 630)) {
          errors.push(`${path} OPEN_GRAPH must be exactly 1200x630.`);
        }
      }
    });

    for (const requiredRole of ["THUMBNAIL", "OPEN_GRAPH"] as const) {
      if (!roles.has(requiredRole)) errors.push(`game.images must contain exactly one ${requiredRole} image.`);
    }
    if (value.pageType === "GAME" && !roles.has("PLAYER_PREVIEW")) {
      errors.push("GAME records must contain exactly one PLAYER_PREVIEW image.");
    }
    if (value.pageType === "EXTERNAL_TOOL" && roles.has("PLAYER_PREVIEW")) {
      errors.push("EXTERNAL_TOOL records must not contain a PLAYER_PREVIEW image.");
    }
  }

  if (!Array.isArray(value.controls) || value.controls.length === 0) {
    errors.push("game.controls must be a non-empty array.");
  } else {
    value.controls.forEach((control, index) => {
      const path = `game.controls[${index}]`;
      if (!isRecord(control)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      for (const key of ["id", "label", "description"]) requireText(control, key, path, errors);
      requireTextArray(control.inputMethods, `${path}.inputMethods`, errors);
    });
  }

  validateTextSections(value.howToPlay, "game.howToPlay", errors);
  validateTextSections(value.features, "game.features", errors);
  requireTextArray(value.tips, "game.tips", errors);

  if (!Array.isArray(value.faq) || value.faq.length === 0) {
    errors.push("game.faq must be a non-empty array.");
  } else {
    value.faq.forEach((faq, index) => {
      const path = `game.faq[${index}]`;
      if (!isRecord(faq)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      requireText(faq, "question", path, errors);
      requireText(faq, "answer", path, errors);
    });
  }

  const mobile = value.mobile;
  if (!isRecord(mobile)) {
    errors.push("game.mobile must be an object.");
  } else {
    for (const key of ["support", "orientation", "note"]) requireText(mobile, key, "game.mobile", errors);
    validateNullableTimestamp(mobile.verifiedAt, "game.mobile.verifiedAt", errors);
  }

  const fullscreen = value.fullscreen;
  if (!isRecord(fullscreen)) {
    errors.push("game.fullscreen must be an object.");
  } else {
    for (const key of ["availability", "mode", "note"]) requireText(fullscreen, key, "game.fullscreen", errors);
  }

  const player = value.player;
  if (!isRecord(player)) {
    errors.push("game.player must be an object.");
  } else {
    requireText(player, "type", "game.player", errors);
    if (player.type !== value.type) errors.push("game.player.type must match game.type.");
    if (player.type === "RUFFLE_SWF") {
      requireTextArray(player.swfSources, "game.player.swfSources", errors);
      if (!hasText(player.backgroundColor) || !hexColorPattern.test(player.backgroundColor)) {
        errors.push("game.player.backgroundColor must be a six-digit hex color.");
      }
      requireText(player, "aspectRatio", "game.player", errors);
      if (player.clickToLoad !== true) errors.push("RUFFLE_SWF records must declare the current click-to-load behavior.");
      if (isRecord(source) && source.kind !== "LOCAL_PROJECT_ASSET") {
        errors.push("RUFFLE_SWF records must use LOCAL_PROJECT_ASSET source kind.");
      }
    } else if (player.type === "EXTERNAL_LINK") {
      if (!hasText(player.url) || !isHttpsUrl(player.url)) errors.push("EXTERNAL_LINK player.url must be an HTTPS URL.");
      requireText(player, "ctaLabel", "game.player", errors);
      if (player.target !== "_blank" || player.directLinkOnly !== true) {
        errors.push("EXTERNAL_LINK records must open a direct link in a new tab.");
      }
      if (!Array.isArray(player.rel) || player.rel.join(" ") !== "noopener noreferrer") {
        errors.push("EXTERNAL_LINK player.rel must be [noopener, noreferrer].");
      }
      if (isRecord(source) && source.kind !== "OFFICIAL_EXTERNAL_PAGE") {
        errors.push("EXTERNAL_LINK records must use OFFICIAL_EXTERNAL_PAGE source kind.");
      }
      if (isRecord(source) && source.localAssetPath !== null) {
        errors.push("EXTERNAL_LINK records cannot declare a local copy of the external tool.");
      }
    }
  }

  const seo = value.seo;
  if (!isRecord(seo)) {
    errors.push("game.seo must be an object.");
  } else {
    for (const key of ["title", "description", "h1", "canonical", "primaryKeyword", "searchIntent"]) {
      requireText(seo, key, "game.seo", errors);
    }
    requireTextArray(seo.secondaryKeywords, "game.seo.secondaryKeywords", errors, true);
    requireTextArray(seo.schemaTypes, "game.seo.schemaTypes", errors);
    if (isRecord(route) && seo.canonical !== route.canonical) {
      errors.push("game.seo.canonical must match game.route.canonical.");
    }
    const semanticCoverage = seo.semanticCoverage;
    if (!isRecord(semanticCoverage)) {
      errors.push("game.seo.semanticCoverage must be an object.");
    } else {
      requireTextArray(semanticCoverage.topics, "game.seo.semanticCoverage.topics", errors);
      if (
        semanticCoverage.score !== null &&
        (typeof semanticCoverage.score !== "number" || semanticCoverage.score < 0 || semanticCoverage.score > 100)
      ) {
        errors.push("game.seo.semanticCoverage.score must be null or a number from 0 to 100.");
      }
      validateNullableTimestamp(semanticCoverage.reviewedAt, "game.seo.semanticCoverage.reviewedAt", errors);
      requireText(semanticCoverage, "note", "game.seo.semanticCoverage", errors);
    }
  }

  const content = value.content;
  if (!isRecord(content)) {
    errors.push("game.content must be an object.");
  } else {
    requireText(content, "summary", "game.content", errors);
    if (content.description !== undefined) {
      requireTextArray(content.description, "game.content.description", errors, true);
    }
    requireTextArray(content.sections, "game.content.sections", errors);
    if (content.homepage !== undefined) validateHomepageContent(content.homepage, errors);
    if (content.legacyPage !== undefined) validateLegacyPageContent(content.legacyPage, errors);
  }
  requireTextArray(value.relatedGameIds, "game.relatedGameIds", errors, true);

  const measurements = value.measurements;
  if (!isRecord(measurements)) {
    errors.push("game.measurements must be an object.");
  } else {
    for (const key of ["inboundLinkCount", "qualityScore"] as const) {
      const measurement = measurements[key];
      if (measurement !== null && (typeof measurement !== "number" || measurement < 0)) {
        errors.push(`game.measurements.${key} must be null or a non-negative number.`);
      }
    }
  }

  const publication = value.publication;
  if (!isRecord(publication)) {
    errors.push("game.publication must be an object.");
  } else {
    validateNullableTimestamp(publication.publishedAt, "game.publication.publishedAt", errors);
    validateNullableTimestamp(publication.modifiedAt, "game.publication.modifiedAt", errors);
    if (publication.timestampStatus !== "VERIFIED" && publication.timestampStatus !== "UNKNOWN") {
      errors.push("game.publication.timestampStatus must be VERIFIED or UNKNOWN.");
    }
    requireText(publication, "note", "game.publication", errors);
    if (publication.timestampStatus === "UNKNOWN" && (publication.publishedAt !== null || publication.modifiedAt !== null)) {
      errors.push("UNKNOWN publication timestamps must remain null.");
    }
  }
  if (value.author !== null && !hasText(value.author)) errors.push("game.author must be null or a non-empty string.");

  if (value.status === "PUBLISHED" && isRecord(route) && route.indexStatus !== "INDEX") {
    errors.push("Current PUBLISHED records must remain INDEX in GAME-DATA-001.");
  }

  return errors;
}

export function defineGame(record: GameRecord): Readonly<GameRecord> {
  const errors = validateGameRecord(record);
  if (errors.length > 0) {
    throw new Error(`Invalid game record ${record.id || "(unknown)"}:\n- ${errors.join("\n- ")}`);
  }
  return Object.freeze(record);
}

export function defineGameCatalog(records: readonly GameRecord[]): readonly GameRecord[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const paths = new Set<string>();
  const canonicals = new Set<string>();

  for (const record of records) {
    for (const error of validateGameRecord(record)) errors.push(`${record.id}: ${error}`);
    for (const [label, value, seen] of [
      ["id", record.id, ids],
      ["slug", record.slug, slugs],
      ["route.path", record.route.path, paths],
      ["route.canonical", record.route.canonical, canonicals]
    ] as const) {
      if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}.`);
      seen.add(value);
    }
  }

  for (const record of records) {
    for (const relatedId of record.relatedGameIds) {
      if (relatedId === record.id) errors.push(`${record.id} cannot relate to itself.`);
      if (!ids.has(relatedId)) errors.push(`${record.id} references missing related game ${relatedId}.`);
    }
  }

  if (errors.length > 0) throw new Error(`Invalid game catalog:\n- ${errors.join("\n- ")}`);
  return Object.freeze([...records]);
}
