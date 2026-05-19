import type { Metadata } from "next";
import { getLanguageAlternates, getLocaleUrl, isReviewedLocaleCode, locales, type LocaleCode } from "./locales";

export function buildHomeMetadata(locale: LocaleCode): Metadata {
  const content = locales[locale];
  const isIndexable = isReviewedLocaleCode(locale);

  return {
    title: {
      absolute: content.title
    },
    description: content.description,
    alternates: {
      canonical: getLocaleUrl(locale),
      ...(isIndexable
        ? {
            languages: {
              ...getLanguageAlternates(),
              "x-default": getLocaleUrl("en")
            }
          }
        : {})
    },
    robots: isIndexable
      ? undefined
      : {
          index: false,
          follow: true
        },
    openGraph: {
      type: "website",
      url: getLocaleUrl(locale),
      title: content.title,
      description: content.description,
      siteName: "My Square Face Icon",
      locale: locale === "en" ? "en_US" : locale,
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "My Square Face Icon square avatar generator preview"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/og-image.svg"]
    }
  };
}
