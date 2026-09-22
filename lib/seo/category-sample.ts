import type { Metadata } from "next";
import type { CategoryRoute } from "../games/routes";
import type { JsonLdObject } from "./game-structured-data";

const siteUrl = "https://mysquarefaceicon.com";

export function buildCategorySampleMetadata({ category }: CategoryRoute): Metadata {
  const url = `${siteUrl}/category/${category.slug}`;
  const title = `${category.name} | My Square Face Icon`;
  return {
    title: { absolute: title },
    description: category.description,
    alternates: { canonical: url },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: "website",
      title,
      description: category.description,
      url,
      siteName: "My Square Face Icon",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "My Square Face Icon brand illustration" }]
    },
    twitter: { card: "summary_large_image", title, description: category.description, images: ["/og-image.svg"] }
  };
}

export function buildCategorySampleStructuredData({ category, games }: CategoryRoute): readonly JsonLdObject[] {
  const url = `${siteUrl}/category/${category.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      url,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: games.length,
        itemListElement: games.map((game, index) => ({
          "@type": "ListItem", position: index + 1, name: game.name, url: `${siteUrl}${game.route.path}`
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Games", item: `${siteUrl}/games` },
        { "@type": "ListItem", position: 3, name: category.name, item: url }
      ]
    }
  ];
}
