"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import ProjectTile from "@/components/projects/ProjectTile";
import type { Project } from "@/types";

type BucketId = "all" | "osh" | "software" | "communication";

const FILTERS: { id: BucketId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "osh", label: "Occupational Safety & Health" },
  { id: "software", label: "Software & Digital Systems" },
  { id: "communication", label: "Digital Communication" },
];

// Presentation-layer categorisation for filtering only — not part of the shared data model.
const PROJECT_BUCKETS: Record<string, BucketId[]> = {
  "workplace-risk-assessment": ["osh"],
  "safety-audit-toolkit": ["osh"],
  "internal-systems-dashboard": ["software"],
  "safety-reporting-tool": ["software"],
  "safetec-digital-presence": ["osh", "communication"],
  "brand-content-strategy": ["communication"],
  "osh-research-brief": ["osh"],
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<BucketId>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => PROJECT_BUCKETS[project.id]?.includes(activeFilter));
  }, [projects, activeFilter]);

  // Keyed to the unfiltered list so a project's number stays fixed as filters change.
  const projectNumbers = useMemo(() => {
    const numbers = new Map<string, string>();
    projects.forEach((project, index) => numbers.set(project.id, String(index + 2).padStart(2, "0")));
    return numbers;
  }, [projects]);

  return (
    <section aria-labelledby="project-index-heading" className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="project-index-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project Index
          </h2>
          <div role="group" aria-label="Filter projects by discipline" className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-flow-row lg:grid-cols-6 lg:gap-6">
          {filtered.map((project, index) => (
            <ProjectTile
              key={project.id}
              project={project}
              index={index}
              number={projectNumbers.get(project.id) ?? ""}
              delay={(index % 4) * 60}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            No projects in this category yet.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
