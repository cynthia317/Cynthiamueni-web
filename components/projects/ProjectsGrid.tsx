import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import type { Project } from "@/types";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="supporting-work-heading" className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <h2
          id="supporting-work-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
        >
          Also Explored
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 80} className="h-full">
              <Link
                href={project.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none"
              >
                {project.image ? (
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt ?? project.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-amber-700 dark:text-slate-50 dark:group-hover:text-amber-400">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    View Project
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
