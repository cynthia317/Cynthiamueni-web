// Featured-project placements.
//
// Page sections that highlight specific projects read them from a named slot instead of
// hard-coding project IDs in the component. The slots mirror the planned `FeaturedPlacement`
// database model (docs/ADMIN_DATABASE_PLAN.md): today they're static configuration, later
// they become admin-editable rows, and the section components don't change.
import { getProjectsBySlugs } from "./projects";
import type { Project } from "./types";

export const FEATURED_PROJECT_SLOTS = {
  /** Home page "Projects" section: lead project, then two supporting cards (position matters). */
  homeProjects: ["safety-management-system", "workplace-risk-assessment", "safetec-digital-presence"],
  /** Expertise page "Featured Expertise Projects" grid. */
  expertiseFeatured: [
    "safety-management-system",
    "workplace-risk-assessment",
    "safetec-digital-presence",
    "safety-audit-toolkit",
  ],
  /** Expertise page "safety ↔ digital systems" bridge link. */
  expertiseBridge: ["safety-management-system"],
} as const satisfies Record<string, readonly string[]>;

export type FeaturedProjectSlot = keyof typeof FEATURED_PROJECT_SLOTS;

/** Projects placed in a slot, in slot order. Slugs that no longer exist are skipped. */
export async function getFeaturedProjects(slot: FeaturedProjectSlot): Promise<Project[]> {
  return getProjectsBySlugs(FEATURED_PROJECT_SLOTS[slot]);
}
