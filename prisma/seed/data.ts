/**
 * Maps the current static content (lib/data, lib/content/featured) to database records for the seed.
 * Pure and deterministic, so it's unit-tested (tests/unit/seed-data.test.ts).
 *
 * Stable mapping keys: slugs (= the existing `id` values used in URLs), insight category names,
 * and (slot, position) for featured placements. Display order is preserved through `sortOrder`
 * (the current array index). Images keep their existing /public paths.
 *
 * Not seeded yet: SiteSettings (its values need owner approval), FAQs, testimonials, media.
 */
import { Code2, HardHat, Megaphone } from "lucide-react";

import { FEATURED_PROJECT_SLOTS, type FeaturedProjectSlot } from "@/lib/content/featured";
import { isPublishedInsight } from "@/lib/content/insights";
import { INSIGHTS } from "@/lib/data/insights";
import { PROJECTS } from "@/lib/data/projects";
import { SERVICES } from "@/lib/data/services";
import type {
  FeaturedSlot,
  ProjectCategory,
  ProjectStatus,
  ProjectTier,
  ProjectVisual,
  PublishStatus,
} from "@/lib/generated/prisma/enums";
import type { Project as StaticProject } from "@/types";

const PROJECT_CATEGORY: Record<StaticProject["category"], ProjectCategory> = {
  "EHS Systems": "EHS_SYSTEMS",
  "EHS Systems × Digital Communication": "EHS_DIGITAL_COMMUNICATION",
  "Software / Systems": "SOFTWARE_SYSTEMS",
  "Digital Marketing": "DIGITAL_MARKETING",
  "Research / Professional Work": "RESEARCH_PROFESSIONAL",
};

const PROJECT_STATUS: Record<StaticProject["status"], ProjectStatus> = {
  Live: "LIVE",
  "In Development": "IN_DEVELOPMENT",
  Planned: "PLANNED",
  "Active Professional Work": "ACTIVE_PROFESSIONAL_WORK",
};

const PROJECT_TIER: Record<StaticProject["tier"], ProjectTier> = {
  flagship: "FLAGSHIP",
  core: "CORE",
  supporting: "SUPPORTING",
  referred: "REFERRED",
};

const PROJECT_VISUAL: Record<NonNullable<StaticProject["visual"]>, ProjectVisual> = {
  mockup: "MOCKUP",
  social: "SOCIAL",
};

const FEATURED_SLOT: Record<FeaturedProjectSlot, FeaturedSlot> = {
  homeProjects: "HOME_PROJECTS",
  expertiseFeatured: "EXPERTISE_FEATURED",
  expertiseBridge: "EXPERTISE_BRIDGE",
};

/** Icon registry keys (Database Plan §4). Unknown icons fail the seed instead of guessing. */
const ICON_KEYS = new Map<unknown, string>([
  [HardHat, "hard-hat"],
  [Code2, "code-2"],
  [Megaphone, "megaphone"],
]);

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface SeedCategory {
  slug: string;
  name: string;
  sortOrder: number;
}

export interface SeedInsight {
  slug: string;
  title: string;
  seoTitle: string | null;
  categoryName: string;
  excerpt: string;
  publishedAt: string; // YYYY-MM-DD
  readTime: string;
  imagePath: string;
  imageAlt: string;
  featured: boolean;
  content: unknown[];
  keywords: string[];
  sortOrder: number;
  status: PublishStatus;
}

export interface SeedProject {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tier: ProjectTier;
  description: string;
  workflow: string[];
  capabilities: { label: string; planned?: boolean }[];
  tools: string[];
  imagePath: string | null;
  imageAlt: string | null;
  visual: ProjectVisual | null;
  relatedFaqSlugs: string[];
  relatedInsightSlugs: string[];
  sortOrder: number;
  publishStatus: PublishStatus;
  isProtected: boolean;
}

export interface SeedService {
  slug: string;
  title: string;
  iconKey: string;
  summary: string;
  deliverables: string[];
  idealFor: string;
  footnoteText: string | null;
  footnoteHref: string | null;
  footnoteExternal: boolean;
  sortOrder: number;
  publishStatus: PublishStatus;
}

export interface SeedPlacement {
  slot: FeaturedSlot;
  position: number;
  projectSlug: string;
}

export interface SeedData {
  categories: SeedCategory[];
  insights: SeedInsight[];
  projects: SeedProject[];
  services: SeedService[];
  placements: SeedPlacement[];
}

export function buildSeedData(): SeedData {
  // Categories in first-appearance order (the topic filter derives its order the same way).
  const categoryNames = [...new Set(INSIGHTS.map((insight) => insight.category))];
  const categories = categoryNames.map((name, index) => ({ slug: slugify(name), name, sortOrder: index }));

  const insights: SeedInsight[] = INSIGHTS.map((insight, index) => ({
    slug: insight.id,
    title: insight.title,
    seoTitle: insight.seoTitle ?? null,
    categoryName: insight.category,
    excerpt: insight.excerpt,
    publishedAt: insight.date,
    readTime: insight.readTime,
    imagePath: insight.image,
    imageAlt: insight.imageAlt,
    featured: insight.featured === true,
    content: insight.content ?? [],
    keywords: insight.keywords ?? [],
    sortOrder: index,
    status: isPublishedInsight(insight) ? "PUBLISHED" : "DRAFT",
  }));

  const featuredSlugs = new Set<string>(Object.values(FEATURED_PROJECT_SLOTS).flat());
  const projects: SeedProject[] = PROJECTS.map((project, index) => ({
    slug: project.id,
    title: project.title,
    category: PROJECT_CATEGORY[project.category],
    status: PROJECT_STATUS[project.status],
    tier: PROJECT_TIER[project.tier],
    description: project.description,
    workflow: project.workflow ?? [],
    capabilities: project.capabilities ?? [],
    tools: project.tools ?? [],
    imagePath: project.image ?? null,
    imageAlt: project.imageAlt ?? null,
    visual: project.visual ? PROJECT_VISUAL[project.visual] : null,
    relatedFaqSlugs: project.relatedFaqIds ?? [],
    relatedInsightSlugs: project.relatedInsightIds ?? [],
    sortOrder: index,
    publishStatus: "PUBLISHED",
    isProtected: featuredSlugs.has(project.id), // referenced by page sections: no delete, slug locked
  }));

  const services: SeedService[] = SERVICES.map((service, index) => {
    const iconKey = ICON_KEYS.get(service.icon);
    if (!iconKey) throw new Error(`Seed: service "${service.id}" uses an icon with no registry key`);
    return {
      slug: service.id,
      title: service.title,
      iconKey,
      summary: service.summary,
      deliverables: service.deliverables,
      idealFor: service.idealFor,
      footnoteText: service.footnote?.text ?? null,
      footnoteHref: service.footnote?.href ?? null,
      footnoteExternal: service.footnote?.external === true,
      sortOrder: index,
      publishStatus: "PUBLISHED",
    };
  });

  const placements: SeedPlacement[] = (Object.keys(FEATURED_PROJECT_SLOTS) as FeaturedProjectSlot[]).flatMap((slot) =>
    FEATURED_PROJECT_SLOTS[slot].map((projectSlug, position) => ({ slot: FEATURED_SLOT[slot], position, projectSlug })),
  );

  return { categories, insights, projects, services, placements };
}
