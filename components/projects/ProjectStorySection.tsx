import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectWorkflow from "@/components/projects/ProjectWorkflow";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import SafetyDashboardMockup from "@/components/ui/SafetyDashboardMockup";
import SocialPresenceMockup from "@/components/ui/SocialPresenceMockup";
import type { Project } from "@/types";

interface ProjectStorySectionProps {
  project: Project;
  number: string;
  imagePosition: "left" | "right";
  tinted?: boolean;
}

export default function ProjectStorySection({ project, number, imagePosition, tinted }: ProjectStorySectionProps) {
  const visual =
    project.visual === "mockup" ? (
      <SafetyDashboardMockup />
    ) : project.visual === "social" ? (
      <SocialPresenceMockup />
    ) : project.image ? (
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.title}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
      />
    ) : null;

  return (
    <section
      aria-labelledby={`project-${project.id}-heading`}
      className={`border-b border-slate-200 py-12 dark:border-slate-800 sm:py-16 ${tinted ? "bg-slate-50/70 dark:bg-slate-900/30" : ""}`}
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
          <Reveal
            delay={80}
            className={`relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 ${
              imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {visual}
          </Reveal>

          <Reveal delay={120} className={`flex flex-col gap-4 ${imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold text-slate-300 dark:text-slate-700">{number}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                {project.category}
              </span>
              <ProjectStatusBadge status={project.status} />
            </div>

            <h2 id={`project-${project.id}-heading`} className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {project.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {project.description}
            </p>

            {project.workflow && project.workflow.length > 0 ? <ProjectWorkflow steps={project.workflow} /> : null}

            {project.capabilities && project.capabilities.length > 0 ? (
              <ProjectCapabilities capabilities={project.capabilities} />
            ) : null}

            <Link
              href={project.href}
              className="group/link mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100"
            >
              View Project
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
