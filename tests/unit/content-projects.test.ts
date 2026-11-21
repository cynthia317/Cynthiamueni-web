import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/lib/data/projects";
import { FAQS } from "@/lib/data/faqs";
import {
  getProjectBySlug,
  getProjects,
  getProjectsBySlugs,
  getProjectsByTier,
  getProjectSlugs,
} from "@/lib/content/projects";
import { FEATURED_PROJECT_SLOTS, getFeaturedProjects } from "@/lib/content/featured";
import { getFaqs, getFaqsByIds } from "@/lib/content/faqs";

// Slugs are public URLs (/projects/{slug}); this list must only ever grow.
const PUBLISHED_PROJECT_SLUGS = [
  "safety-management-system",
  "safety-audit-toolkit",
  "safety-reporting-tool",
  "workplace-risk-assessment",
  "safetec-digital-presence",
  "brand-content-strategy",
  "osh-research-brief",
  "internal-systems-dashboard",
];

describe("lib/content/projects", () => {
  it("returns every project from the static source, in curated order", async () => {
    expect(await getProjects()).toEqual(PROJECTS);
  });

  it("preserves every published slug and its URL", async () => {
    expect(await getProjectSlugs()).toEqual(PUBLISHED_PROJECT_SLUGS);
    for (const project of await getProjects()) {
      expect(project.href).toBe(`/projects/${project.id}`);
    }
  });

  it("filters by tier without reordering", async () => {
    for (const tier of ["flagship", "core", "supporting", "referred"] as const) {
      expect(await getProjectsByTier(tier)).toEqual(PROJECTS.filter((project) => project.tier === tier));
    }
    expect(await getProjectsByTier("flagship")).toHaveLength(1);
  });

  it("finds a project by slug, or null", async () => {
    expect(await getProjectBySlug("safety-audit-toolkit")).toBe(PROJECTS[1]);
    expect(await getProjectBySlug("does-not-exist")).toBeNull();
  });

  it("returns projects for slugs in the requested order and skips unknown slugs", async () => {
    const result = await getProjectsBySlugs(["osh-research-brief", "missing", "safety-management-system"]);
    expect(result.map((project) => project.id)).toEqual(["osh-research-brief", "safety-management-system"]);
  });

  it("returns a new array so callers cannot reorder the source", async () => {
    (await getProjects()).reverse();
    expect((await getProjects())[0].id).toBe("safety-management-system");
  });
});

describe("lib/content/featured", () => {
  it("keeps the featured selections that were previously hard-coded in components", () => {
    expect(FEATURED_PROJECT_SLOTS).toEqual({
      homeProjects: ["safety-management-system", "workplace-risk-assessment", "safetec-digital-presence"],
      expertiseFeatured: [
        "safety-management-system",
        "workplace-risk-assessment",
        "safetec-digital-presence",
        "safety-audit-toolkit",
      ],
      expertiseBridge: ["safety-management-system"],
    });
  });

  it("resolves every slot to existing projects, in slot order", async () => {
    for (const [slot, slugs] of Object.entries(FEATURED_PROJECT_SLOTS)) {
      const projects = await getFeaturedProjects(slot as keyof typeof FEATURED_PROJECT_SLOTS);
      expect(projects.map((project) => project.id)).toEqual(slugs);
    }
  });
});

describe("lib/content/faqs", () => {
  it("returns every FAQ in display order", async () => {
    expect(await getFaqs()).toEqual(FAQS);
  });

  it("resolves every FAQ id referenced by a project", async () => {
    for (const project of PROJECTS) {
      const ids = project.relatedFaqIds ?? [];
      expect((await getFaqsByIds(ids)).map((faq) => faq.id)).toEqual(ids);
    }
  });

  it("skips unknown FAQ ids and keeps the requested order", async () => {
    const [first, second] = FAQS;
    expect((await getFaqsByIds([second.id, "missing", first.id])).map((faq) => faq.id)).toEqual([second.id, first.id]);
  });
});
