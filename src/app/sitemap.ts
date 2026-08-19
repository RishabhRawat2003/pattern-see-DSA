import { allPatterns, levels } from "@/lib/curriculum";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/review`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...levels.map((level) => ({
      url: `${site.url}/level/${level.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: level.ready ? 0.9 : 0.4,
    })),
    ...allPatterns().map((pattern) => ({
      url: `${site.url}/patterns/${pattern.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: pattern.ready ? 0.8 : 0.3,
    })),
  ];
}
