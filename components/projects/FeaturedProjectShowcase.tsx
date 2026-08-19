import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectWorkflow from "@/components/projects/ProjectWorkflow";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import SafetyDashboardMockup from "@/components/ui/SafetyDashboardMockup";
import type { Project } from "@/types";

export default function FeaturedProjectShowcase({ project }: { project: Project }) {
  return (
    <section aria-labelledby="featured-project-heading" className="border-b border-slate-200 py-12 dark:border-slate-800 sm:py-16">
      <Container>
        <Reveal className="group">
          <div className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-200 p-2 transition-colors duration-300 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-0 lg:p-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 lg:aspect-auto lg:rounded-r-none lg:rounded-l-3xl lg:border-0 lg:border-r">
              <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <SafetyDashboardMockup />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-slate-300 dark:text-slate-700">01</span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                  {project.category}
                </span>
                <ProjectStatusBadge status={project.status} />
              </div>

              <h2 id="featured-project-heading" className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                {project.title}
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {project.description}
              </p>

              {project.workflow && project.workflow.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Key Workflow
                  </span>
                  <ProjectWorkflow steps={project.workflow} />
                </div>
              ) : null}

              {project.capabilities && project.capabilities.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Capabilities
                  </span>
                  <ProjectCapabilities capabilities={project.capabilities} />
                </div>
              ) : null}

              <Link
                href={project.href}
                className="group/link mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100"
              >
                View Case Study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
