import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/assessment", "/resources", "/contact"].map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified: "2026-04-09",
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const notes = articles.map((article) => ({
    url: `${site.url}/resources/${article.slug}`,
    lastModified: article.updated,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...notes];
}
