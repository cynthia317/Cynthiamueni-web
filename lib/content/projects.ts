// Project content access.
//
// Source: static data in `lib/data/projects.ts`. Public pages read projects only through
// these functions, so a future database-backed implementation replaces the function bodies
// here without changing any call site. The functions are async for that reason.
//
// A project's slug is its `id`; it is also the last segment of its public URL
// (`/projects/{slug}`). Slugs of published projects must never change.
import { PROJECTS } from "@/lib/data/projects";
import type { Project, ProjectTier } from "./types";

/** All projects, in curated display order. */
export async function getProjects(): Promise<Project[]> {
  return [...PROJECTS];
}

/** Projects in one storytelling tier, in display order. */
export async function getProjectsByTier(tier: ProjectTier): Promise<Project[]> {
  return PROJECTS.filter((project) => project.tier === tier);
}

/** A single project by slug, or `null` when no project has that slug. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return PROJECTS.find((project) => project.id === slug) ?? null;
}

/** Every project slug, used for static generation and the sitemap. */
export async function getProjectSlugs(): Promise<string[]> {
  return PROJECTS.map((project) => project.id);
}

/** Projects for the given slugs, in the order requested. Unknown slugs are skipped. */
export async function getProjectsBySlugs(slugs: readonly string[]): Promise<Project[]> {
  return slugs
    .map((slug) => PROJECTS.find((project) => project.id === slug))
    .filter((project): project is Project => Boolean(project));
}
