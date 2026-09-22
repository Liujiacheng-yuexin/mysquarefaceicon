import type { GameRecord } from "../games/game-schema";
import { assertValidGameMetadata } from "./game-metadata";

export type JsonLdValue = string | number | boolean | null | JsonLdObject | readonly JsonLdValue[];
export type JsonLdObject = { readonly [key: string]: JsonLdValue };

const SITE_URL = "https://mysquarefaceicon.com";

function buildBreadcrumbList(game: GameRecord): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Games",
        item: `${SITE_URL}/games`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.name,
        item: game.seo.canonical
      }
    ]
  };
}

function buildPageEntity(game: GameRecord): JsonLdObject {
  if (game.pageType === "EXTERNAL_TOOL") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: game.seo.h1,
      url: game.seo.canonical,
      description: game.content.summary,
      isPartOf: {
        "@type": "WebSite",
        name: "My Square Face Icon",
        url: SITE_URL
      }
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.seo.h1,
    url: game.seo.canonical,
    description: game.content.summary,
    gamePlatform: "Web browser"
  };
}

function buildFaqPage(game: GameRecord): JsonLdObject | null {
  if (game.faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildGameStructuredData(game: GameRecord): readonly JsonLdObject[] {
  assertValidGameMetadata(game);
  const faqPage = buildFaqPage(game);
  return [buildBreadcrumbList(game), buildPageEntity(game), ...(faqPage ? [faqPage] : [])];
}

export function serializeGameStructuredData(value: JsonLdObject): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
