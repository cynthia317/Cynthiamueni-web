import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { INSIGHTS } from "@/lib/data/insights";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ["", "/about", "/expertise", "/projects", "/insights", "/contact"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}${project.href}`,
    lastModified: new Date(),
  }));

  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.map((insight) => ({
    url: `${SITE_URL}${insight.href}`,
    lastModified: new Date(insight.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
