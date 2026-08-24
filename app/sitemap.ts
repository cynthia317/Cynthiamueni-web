import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { INSIGHTS } from "@/lib/data/insights";
import { SITE_URL } from "@/lib/constants";

const STATIC_ROUTE_PRIORITY: Record<string, number> = {
  "": 1,
  "/insights": 0.9,
  "/projects": 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/expertise",
    "/services",
    "/projects",
    "/insights",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: STATIC_ROUTE_PRIORITY[path] ?? 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}${project.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // "Coming Soon" entries (href === "#") don't have a real article body yet — keep them
  // out of the sitemap so search engines are never pointed at thin/empty content.
  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.filter((insight) => insight.href !== "#").map(
    (insight) => ({
      url: `${SITE_URL}${insight.href}`,
      lastModified: new Date(insight.date),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
