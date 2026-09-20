import type { MetadataRoute } from "next";
import { guidePath, guides } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/assessment/", "/library/", "/contact/"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: "2026-09-01",
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const notes = guides.map((guide) => ({
    url: `${site.url}${guidePath(guide.slug)}`,
    lastModified: guide.updated,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...notes];
}
