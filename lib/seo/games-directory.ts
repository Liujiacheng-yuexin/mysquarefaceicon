import type { Metadata } from "next";
import type { GameRecord } from "../games/game-schema";
import type { JsonLdObject } from "./game-structured-data";

const siteUrl = "https://mysquarefaceicon.com";
export const gamesDirectoryUrl = `${siteUrl}/games`;
export const gamesDirectoryTitle = "Avatar Games & Face Makers";
const title = `${gamesDirectoryTitle} | My Square Face Icon`;
const description = "Browse on-site avatar games and clearly labeled external tools. Compare face makers, read access details, and explore overlapping avatar categories.";

export const gamesDirectoryMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: gamesDirectoryUrl },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  openGraph: {
    type: "website",
    title,
    description,
    url: gamesDirectoryUrl,
    siteName: "My Square Face Icon",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "My Square Face Icon brand illustration" }]
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.svg"] }
};

export function buildGamesDirectoryStructuredData(games: readonly GameRecord[]): readonly JsonLdObject[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: gamesDirectoryTitle,
      url: gamesDirectoryUrl,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: games.length,
        itemListElement: games.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: game.name,
          url: `${siteUrl}${game.route.path}`
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Games", item: gamesDirectoryUrl }
      ]
    }
  ];
}
