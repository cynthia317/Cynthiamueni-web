import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Code2, HardHat, Megaphone, Share2 } from "lucide-react";
import Container from "@/components/layout/Container";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectWorkflow from "@/components/projects/ProjectWorkflow";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import SafetyDashboardMockup from "@/components/ui/SafetyDashboardMockup";
import SocialPresenceMockup from "@/components/ui/SocialPresenceMockup";
import { FAQS } from "@/lib/data/faqs";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";
import type { Project, ProjectCategory } from "@/types";

const CATEGORY_ICON: Record<ProjectCategory, typeof HardHat> = {
  "EHS Systems": HardHat,
  "EHS Systems × Digital Communication": Share2,
  "Software / Systems": Code2,
  "Digital Marketing": Megaphone,
  "Research / Professional Work": BookOpen,
};

export default function ProjectDetail({ project }: { project: Project }) {
  const Icon = CATEGORY_ICON[project.category];
  const showSoftwareReferral = project.tier === "referred";
  const relatedFaqs = project.relatedFaqIds
    ?.map((id) => FAQS.find((faq) => faq.id === id))
    .filter((faq): faq is (typeof FAQS)[number] => Boolean(faq));

  return (
    <article className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All Projects
        </Link>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
              {project.category}
            </span>
            <ProjectStatusBadge status={project.status} />
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {project.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            {project.description}
          </p>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900">
          {project.visual === "mockup" ? (
            <SafetyDashboardMockup />
          ) : project.visual === "social" ? (
            <SocialPresenceMockup />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={project.imageAlt ?? project.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon className="h-12 w-12 text-slate-300 dark:text-slate-700" aria-hidden />
            </div>
          )}
        </div>

        {project.workflow && project.workflow.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Key Workflow
            </h2>
            <ProjectWorkflow steps={project.workflow} />
          </div>
        ) : null}

        {project.capabilities && project.capabilities.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Capabilities
            </h2>
            <ProjectCapabilities capabilities={project.capabilities} />
          </div>
        ) : null}

        {relatedFaqs && relatedFaqs.length > 0 ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Questions This Project Addresses
            </h2>
            <ul className="flex flex-col gap-3">
              {relatedFaqs.map((faq) => (
                <li key={faq.id}>
                  <Link
                    href={`/insights#faq-trigger-${faq.id}`}
                    className="group/faq inline-flex items-start gap-1.5 text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                  >
                    <ArrowRight
                      aria-hidden
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/faq:translate-x-0.5"
                    />
                    {faq.question}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showSoftwareReferral ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Looking for a dedicated website, web application or general software solution?{" "}
              <a
                href={HARUNLUCAS_DEV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100 dark:decoration-slate-700 dark:hover:decoration-slate-100"
              >
                Explore HarunLucas Dev
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </p>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
