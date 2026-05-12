import type { Metadata } from "next";
import { getLanguageAlternates, getLocaleUrl, locales, type LocaleCode } from "./locales";

export function buildHomeMetadata(locale: LocaleCode): Metadata {
  const content = locales[locale];

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: getLocaleUrl(locale),
      languages: {
        ...getLanguageAlternates(),
        "x-default": getLocaleUrl("en")
      }
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
