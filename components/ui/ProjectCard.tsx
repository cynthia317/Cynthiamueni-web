import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HardHat, Code2, Megaphone, BookOpen, ClipboardCheck, Share2 } from "lucide-react";
import SafetyDashboardMockup from "@/components/ui/SafetyDashboardMockup";
import SocialPresenceMockup from "@/components/ui/SocialPresenceMockup";
import type { Project, ProjectCategory } from "@/types";

const CATEGORY_ICON: Record<ProjectCategory, typeof HardHat> = {
  "Occupational Safety & Health": HardHat,
  "Occupational Safety & Health × Digital Systems": ClipboardCheck,
  "Occupational Safety & Health × Digital Communication": Share2,
  "Software / Systems": Code2,
  "Digital Marketing": Megaphone,
  "Research / Professional Work": BookOpen,
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon = CATEGORY_ICON[project.category];
  const featured = Boolean(project.featured);

  return (
    <article
      id={project.id}
      className={`group flex h-full scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 ${
          featured
            ? "aspect-[16/10] border-b md:aspect-auto md:w-1/2 md:border-b-0 md:border-r"
            : "aspect-[16/10] border-b"
        }`}
      >
        {project.visual === "mockup" ? (
          <SafetyDashboardMockup />
        ) : project.visual === "social" ? (
          <SocialPresenceMockup />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes={
              featured
                ? "(min-width: 768px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <Icon
            className="h-10 w-10 text-slate-300 transition-colors group-hover:text-amber-500 dark:text-slate-700"
            aria-hidden
          />
        )}
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 ${featured ? "justify-center p-8 md:w-1/2 md:p-10" : "p-6"}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {project.category}
          </span>
          {featured ? (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
              Featured
            </span>
          ) : null}
        </div>
        <h3
          className={`font-semibold text-slate-900 dark:text-slate-50 ${featured ? "text-2xl" : "text-lg"}`}
        >
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        {project.tools && project.tools.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {tool}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={project.href}
          className="mt-auto inline-flex items-center gap-1.5 rounded-sm pt-4 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100"
        >
          View Project
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
