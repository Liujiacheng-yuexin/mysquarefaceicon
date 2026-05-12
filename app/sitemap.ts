import type { MetadataRoute } from "next";
import { getLocaleUrl, localeCodes } from "@/lib/locales";

const baseUrl = "https://mysquarefaceicon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-12");

  return [
    ...localeCodes.map((locale) => ({
      url: getLocaleUrl(locale),
      lastModified,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.8
    }) satisfies MetadataRoute.Sitemap[number]),
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
