import type { Metadata } from "next";
import GameLink from "@/components/game/GameLink";
import CategoryChip from "@/components/game/CategoryChip";
import { notFound } from "next/navigation";
import GameBreadcrumb from "@/components/game/GameBreadcrumb";
import GameGrid from "@/components/game/GameGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  getDirectoryCategoryStaticParams as getCategoryStaticParams,
  listDirectoryCategoryRoutes,
  resolveDirectoryCategoryRoute as resolveCategoryRoute
} from "@/lib/games/categories";
import { faceMakersContent } from "@/lib/games/category-content";
import { categoryPolicy } from "@/lib/games/category-policy";
import { resolveRemainingCategoryContent } from "@/lib/games/category-remaining-content";
import { buildCategorySampleMetadata, buildCategorySampleStructuredData } from "@/lib/seo/category-sample";
import { serializeGameStructuredData } from "@/lib/seo/game-structured-data";

type CategoryRoutePageProps = {
  params: {
    slug: string;
  };
};

// Static params cover the allowlist; runtime requests still pass through the
// same resolver so unknown slugs receive explicit noindex metadata and a real 404.
export const dynamicParams = true;

export function generateStaticParams() {
  return getCategoryStaticParams();
}

export function generateMetadata({ params }: CategoryRoutePageProps): Metadata {
  const route = resolveCategoryRoute(params.slug);
  if (!route) {
    return {
      title: {
        absolute: "Category Not Found | My Square Face Icon"
      },
      robots: { index: false, follow: false }
    };
  }

  return buildCategorySampleMetadata(route);
}

export default function CategoryRoutePage({ params }: CategoryRoutePageProps) {
  const route = resolveCategoryRoute(params.slug);
  if (!route) notFound();

  const { category, games } = route;
  const sample = category.slug === faceMakersContent.slug;
  const allCategories = listDirectoryCategoryRoutes();
  const otherCategories = allCategories.filter(({ category: other }) => other.slug !== category.slug);
  const remaining = sample ? undefined : resolveRemainingCategoryContent(route, allCategories);

  return (
    <>
      {buildCategorySampleStructuredData(route).map((schema) => (
        <script key={String(schema["@type"])} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(schema) }} />
      ))}
      <SiteHeader />
      <main className="route-directory-shell" data-ad-eligible={categoryPolicy.adEligible}>
        <GameBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Games", href: "/games" },
            { label: category.name }
          ]}
          reloadDocument
        />

        <header className="route-directory-hero route-category-hero">
          <p className="route-eyebrow">Avatar game category</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </header>

        <section className="route-directory-section" aria-labelledby="category-games-heading">
          <div className="route-section-heading">
            <div>
              <p className="route-eyebrow">Current collection</p>
              <h2 id="category-games-heading">{sample ? faceMakersContent.entriesHeading : remaining?.entriesHeading ?? <>Available {category.name}</>}</h2>
            </div>
            <span>{games.length} {games.length === 1 ? "entry" : "entries"}</span>
          </div>
          <GameGrid games={games} ariaLabel={sample ? faceMakersContent.entriesHeading : remaining?.entriesHeading ?? `Available ${category.name}`} reloadDocument />
        </section>

        {sample ? (
          <section className="route-directory-section" aria-labelledby="category-choice-heading">
            <h2 id="category-choice-heading">{faceMakersContent.choiceHeading}</h2>
            {faceMakersContent.choiceParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ) : remaining && remaining.paragraphs.length > 0 ? (
          <section className="route-directory-section" aria-labelledby="category-choice-heading">
            <h2 id="category-choice-heading">{remaining.choiceHeading}</h2>
            {remaining.paragraphs.map((paragraph) => (
              <p key={paragraph.id}>
                {paragraph.parts.map((part, index) => typeof part === "string" ? part : (
                  <GameLink key={`${paragraph.id}-${index}`} href={part.href} reloadDocument>{part.text}</GameLink>
                ))}
              </p>
            ))}
          </section>
        ) : null}

        {(sample || remaining) && otherCategories.length > 0 ? (
          <section className="route-directory-section" aria-labelledby="other-categories-heading">
            <h2 id="other-categories-heading">{faceMakersContent.otherCategoriesHeading}</h2>
            <p>{faceMakersContent.overlapNote}</p>
            <div className="route-category-links">
              {otherCategories.map(({ category: other, games: entries }) => (
                <CategoryChip key={other.slug} category={other} gameCount={entries.length} reloadDocument />
              ))}
            </div>
          </section>
        ) : null}

        <div className="route-return-links" aria-label="Continue browsing">
          <GameLink href="/games">Browse all avatar games</GameLink>
          <GameLink href="/" reloadDocument>Return to Square Face Generator</GameLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
