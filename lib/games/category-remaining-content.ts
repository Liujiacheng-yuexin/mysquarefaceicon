import type { GameRecord } from "./game-schema";
import type { CategoryRoute } from "./routes";

type CopyPart = string | { readonly text: string; readonly href: "/category/face-makers" };
type ChoiceParagraph = {
  readonly id: string;
  readonly parts: readonly CopyPart[];
  readonly available: boolean;
};

// These identities constrain the approved factual copy, not publication rights.
// Missing or changed dependencies omit only their explanation, never real cards.
const dependencies = {
  square: { id: "square-face", name: "Square Face Generator", path: "/", type: "RUFFLE_SWF" },
  oval: { id: "oval-face", name: "Oval Face Icon Generator", path: "/oval-face-icon-generator", type: "RUFFLE_SWF" },
  pixel: { id: "pixel-art-avatar", name: "Pixel Art Avatar Icon Generator", path: "/pixel-art-avatar-icon-generator", type: "EXTERNAL_LINK" }
} as const;

function hasDependency(route: CategoryRoute | undefined, key: keyof typeof dependencies): boolean {
  const expected = dependencies[key];
  const matches = route?.games.filter((game) => game.id === expected.id) ?? [];
  if (matches.length !== 1) return false;
  const game: GameRecord = matches[0];
  if (game.name !== expected.name || game.route.path !== expected.path || !game.route.existingPublishedRoute ||
    game.status !== "PUBLISHED" || game.type !== expected.type || game.player.type !== expected.type) return false;
  return expected.type === "RUFFLE_SWF"
    ? game.pageType === "GAME" && game.player.type === "RUFFLE_SWF" && game.player.clickToLoad === true
    : game.pageType === "EXTERNAL_TOOL" && game.player.type === "EXTERNAL_LINK" &&
      game.player.directLinkOnly === true && game.license.releaseDecision === "DIRECT_LINK_ONLY";
}

const faceMakersLink = { text: "Face Makers", href: "/category/face-makers" } as const;

export function resolveRemainingCategoryContent(route: CategoryRoute, allRoutes: readonly CategoryRoute[]) {
  const onSitePair = hasDependency(route, "square") && hasDependency(route, "oval");
  const pixel = hasDependency(route, "pixel");
  const faces = allRoutes.filter(({ category }) => category.slug === "face-makers");
  const faceAlternative = faces.length === 1 && hasDependency(faces[0], "square") && hasDependency(faces[0], "oval");
  let entriesHeading: string, choiceHeading: string, paragraphs: readonly ChoiceParagraph[];

  switch (route.category.slug) {
    case "avatar-makers":
      entriesHeading = "Avatar maker entries";
      choiceHeading = "Choose where to create";
      paragraphs = [
        { id: "onsite-choice", available: onSitePair, parts: [
          "Square Face Generator and Oval Face Icon Generator open maker pages on this site. Start with either entry if you want a square or rounded face icon."
        ] },
        { id: "external-access", available: pixel, parts: [
          "Pixel Art Avatar Icon Generator is an external tool entry. Its card opens our access-details page first, where you can review the source and usage notes before visiting the original website."
        ] }
      ];
      break;
    case "pixel-avatars":
      entriesHeading = "Pixel avatar entries";
      choiceHeading = "Before opening the pixel avatar tool";
      paragraphs = [
        { id: "external-boundary", available: pixel, parts: [
          "The Pixel Art Avatar Icon Generator entry is an external tool. Its card opens the access-details page on this site, not an embedded editor."
        ] },
        { id: "source-and-alternative", available: pixel && faceAlternative, parts: [
          "Read the source and usage notes on that page before following the link to the original website. For the site's Square and Oval entries, browse ",
          faceMakersLink, "."
        ] }
      ];
      break;
    case "retro-flash":
      entriesHeading = "Retro Flash entries";
      choiceHeading = "Opening the Flash-based makers";
      paragraphs = [
        { id: "click-to-load", available: onSitePair, parts: [
          "Square Face Generator and Oval Face Icon Generator use Flash-based game files with a browser player. Open a maker page on this site, then select Play to load its player."
        ] },
        { id: "category-boundary", available: onSitePair, parts: [
          "This category does not run a game or download its player on its own. See the maker page for controls, saving guidance, and source or usage limitations."
        ] }
      ];
      break;
    case "character-creators":
      entriesHeading = "Character creator entries";
      choiceHeading = "About this collection";
      paragraphs = [
        { id: "current-collection", available: pixel && route.games.length === 1, parts: [
          "The current character-creator entry is Pixel Art Avatar Icon Generator. It is listed here as an external tool, so this collection is a starting point for browsing rather than an on-site character editor."
        ] },
        { id: "face-alternative", available: faceAlternative, parts: [
          "For a face-based character, browse ", faceMakersLink,
          " for the Square and Oval entries. Compare their square and rounded face styles before choosing a maker page."
        ] }
      ];
      break;
    default:
      return undefined;
  }

  return {
    entriesHeading,
    choiceHeading,
    paragraphs: paragraphs.filter((paragraph) => paragraph.available),
    omittedParagraphIds: paragraphs.filter((paragraph) => !paragraph.available).map((paragraph) => paragraph.id)
  };
}
