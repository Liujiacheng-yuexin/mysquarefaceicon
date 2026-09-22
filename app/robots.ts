import type { MetadataRoute } from "next";
import aiCrawlerPolicy from "@/data/ai-crawler-policy.json";

export default function robots(): MetadataRoute.Robots {
  const publicAccessRules = aiCrawlerPolicy.allowedOnPublicPaths.map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: aiCrawlerPolicy.privatePaths
  }));
  const trainingOptOutRules = aiCrawlerPolicy.blockedFromAllPaths.map((userAgent) => ({
    userAgent,
    disallow: "/"
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: aiCrawlerPolicy.privatePaths
      },
      ...trainingOptOutRules,
      ...publicAccessRules
    ],
    sitemap: "https://mysquarefaceicon.com/sitemap.xml",
    host: "https://mysquarefaceicon.com"
  };
}
