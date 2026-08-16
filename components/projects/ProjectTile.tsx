import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ClipboardCheck, Code2, HardHat, Megaphone, Share2 } from "lucide-react";
import Reveal from "@/components/layout/Reveal";
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

const TILE_PATTERN = [
  { span: "lg:col-span-4", aspect: "aspect-[16/10]", layout: "stacked" as const, compact: false },
  { span: "lg:col-span-2", aspect: "aspect-[3/4]", layout: "stacked" as const, compact: true },
  { span: "lg:col-span-6", aspect: "aspect-[21/9]", layout: "split" as const, compact: false },
  { span: "lg:col-span-2", aspect: "aspect-[3/4]", layout: "stacked" as const, compact: true },
  { span: "lg:col-span-4", aspect: "aspect-[16/10]", layout: "stacked" as const, compact: false },
  { span: "lg:col-span-3", aspect: "aspect-[4/3]", layout: "stacked" as const, compact: false },
  { span: "lg:col-span-3", aspect: "aspect-[4/3]", layout: "stacked" as const, compact: false },
];

interface ProjectTileProps {
  project: Project;
  index: number;
  number: string;
  delay: number;
}

export default function ProjectTile({ project, index, number, delay }: ProjectTileProps) {
  const Icon = CATEGORY_ICON[project.category];
  const config = TILE_PATTERN[index % TILE_PATTERN.length];

  const visual = (
    <div className={`relative overflow-hidden ${config.aspect} ${config.layout === "split" ? "h-full" : "rounded-t-2xl"}`}>
      {project.visual === "mockup" ? (
        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <SafetyDashboardMockup />
        </div>
      ) : project.visual === "social" ? (
        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <SocialPresenceMockup />
        </div>
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt ?? project.title}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <Icon className="h-8 w-8 text-slate-300 dark:text-slate-700" aria-hidden />
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );

  const content = (
    <div className={`flex flex-1 flex-col gap-2.5 p-5 ${config.compact ? "" : "sm:p-6"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {project.category}
        </span>
        <span className="text-xs font-semibold text-slate-300 transition-colors duration-300 group-hover:text-amber-500 dark:text-slate-700">
          {number}
        </span>
      </div>

      <h3
        className={`font-semibold text-slate-900 transition-colors duration-300 group-hover:text-amber-700 dark:text-slate-50 dark:group-hover:text-amber-400 ${config.compact ? "text-base" : "text-lg"}`}
      >
        {project.title}
      </h3>

      {!config.compact ? (
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
      ) : null}

      <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        View Project
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          aria-hidden
        />
      </span>
    </div>
  );

  return (
    <Reveal delay={delay} className={`group h-full ${config.span}`}>
      <Link
        href={project.href}
        className={`flex h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none ${
          config.layout === "split" ? "flex-col sm:flex-row" : "flex-col"
        }`}
      >
        <div className={config.layout === "split" ? "sm:w-2/5 sm:shrink-0" : ""}>{visual}</div>
        {content}
      </Link>
    </Reveal>
  );
}
