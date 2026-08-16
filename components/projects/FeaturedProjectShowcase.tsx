import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import SafetyDashboardMockup from "@/components/ui/SafetyDashboardMockup";
import type { Project } from "@/types";

export default function FeaturedProjectShowcase({ project }: { project: Project }) {
  return (
    <section aria-labelledby="featured-project-heading" className="border-b border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <Container>
        <Reveal className="group">
          <Link
            href={project.href}
            className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-200 p-2 transition-colors duration-300 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:hover:border-slate-700 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-0 lg:p-0"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 lg:aspect-auto lg:rounded-r-none lg:rounded-l-3xl lg:border-0 lg:border-r">
              <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <SafetyDashboardMockup />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-12">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-slate-300 dark:text-slate-700">01</span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                  {project.category}
                </span>
              </div>

              <h2
                id="featured-project-heading"
                className="text-2xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-amber-700 dark:text-slate-50 dark:group-hover:text-amber-400 sm:text-3xl"
              >
                {project.title}
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {project.description}
              </p>

              {project.tools && project.tools.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              ) : null}

              <span className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                View Case Study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
