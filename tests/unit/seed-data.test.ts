import { describe, expect, it } from "vitest";

import { FEATURED_PROJECT_SLOTS } from "@/lib/content/featured";
import { INSIGHTS } from "@/lib/data/insights";
import { PROJECTS } from "@/lib/data/projects";
import { SERVICES } from "@/lib/data/services";
import { buildSeedData, slugify } from "@/prisma/seed/data";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/; // matches the migration's CHECK constraint
const data = buildSeedData();

describe("seed data mapping", () => {
  it("covers every static record exactly once, keeping slugs and order", () => {
    expect(data.projects.map((p) => p.slug)).toEqual(PROJECTS.map((p) => p.id));
    expect(data.insights.map((i) => i.slug)).toEqual(INSIGHTS.map((i) => i.id));
    expect(data.services.map((s) => s.slug)).toEqual(SERVICES.map((s) => s.id));
    for (const list of [data.projects, data.insights, data.services]) {
      expect(list.map((r) => r.sortOrder)).toEqual(list.map((_, index) => index));
    }
  });

  it("produces slugs the database accepts", () => {
    const all = [...data.projects, ...data.insights, ...data.services, ...data.categories].map((r) => r.slug);
    expect(all.every((slug) => SLUG.test(slug))).toBe(true);
  });

  it("normalises insight categories by exact name, in first-appearance order", () => {
    expect(data.categories.map((c) => c.name)).toEqual([...new Set(INSIGHTS.map((i) => i.category))]);
    expect(new Set(data.categories.map((c) => c.slug)).size).toBe(data.categories.length);
    expect(slugify("EHS Systems & Digital Solutions")).toBe("ehs-systems-digital-solutions");
    for (const insight of data.insights) expect(data.categories.some((c) => c.name === insight.categoryName)).toBe(true);
  });

  it("keeps images, dates and content unchanged", () => {
    INSIGHTS.forEach((source, index) => {
      const seeded = data.insights[index];
      expect(seeded.imagePath).toBe(source.image);
      expect(seeded.publishedAt).toBe(source.date);
      expect(seeded.content).toEqual(source.content ?? []);
    });
    PROJECTS.forEach((source, index) => expect(data.projects[index].imagePath).toBe(source.image ?? null));
  });

  it("satisfies the single-featured-insight and single-flagship rules", () => {
    expect(data.insights.filter((i) => i.featured)).toHaveLength(1);
    expect(data.projects.filter((p) => p.tier === "FLAGSHIP" && p.publishStatus === "PUBLISHED")).toHaveLength(1);
  });

  it("only references projects and insights that exist", () => {
    const projectSlugs = new Set(data.projects.map((p) => p.slug));
    const insightSlugs = new Set(data.insights.map((i) => i.slug));
    for (const p of data.projects) for (const slug of p.relatedInsightSlugs) expect(insightSlugs.has(slug)).toBe(true);
    for (const pl of data.placements) expect(projectSlugs.has(pl.projectSlug)).toBe(true);
  });

  it("reproduces today's featured slots exactly, and protects featured projects", () => {
    const total = Object.values(FEATURED_PROJECT_SLOTS).reduce((n, slugs) => n + slugs.length, 0);
    expect(data.placements).toHaveLength(total);
    expect(data.placements.filter((p) => p.slot === "HOME_PROJECTS").map((p) => p.projectSlug)).toEqual([
      ...FEATURED_PROJECT_SLOTS.homeProjects,
    ]);
    const featured = new Set(data.placements.map((p) => p.projectSlug));
    for (const p of data.projects) expect(p.isProtected).toBe(featured.has(p.slug));
  });

  it("maps every service icon to a registry key", () => {
    expect(data.services.map((s) => s.iconKey)).toEqual(["hard-hat", "code-2", "megaphone"]);
  });
});
