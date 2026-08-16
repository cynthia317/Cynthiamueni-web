import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Megaphone,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import { PROJECTS } from "@/lib/data/projects";

// Pull the verified facts (id, href, image) for the three featured projects
// from the shared project data so links and assets never drift out of sync
// with the real Projects page.
const SAFETY_SYSTEM = PROJECTS.find((project) => project.id === "safety-management-system")!;
const RISK_ASSESSMENT = PROJECTS.find((project) => project.id === "workplace-risk-assessment")!;
const SAFETEC = PROJECTS.find((project) => project.id === "safetec-digital-presence")!;

function SafetyPlatformPreview() {
  const stats = [
    { label: "Hazard Reports", icon: AlertTriangle },
    { label: "Inspections", icon: ClipboardCheck },
    { label: "Corrective Actions", icon: CheckCircle2 },
  ];
  const records = [
    { label: "Loading dock guardrail", status: "Open" },
    { label: "Fire extinguisher check", status: "Resolved" },
    { label: "PPE compliance walk-through", status: "In Review" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center p-5 sm:p-8">
      <div
        aria-hidden
        className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 shadow-2xl transition-transform duration-500 ease-out motion-reduce:[@media(hover:hover)]:group-hover:translate-y-0 motion-reduce:[@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:-translate-y-1 [@media(hover:hover)]:group-hover:scale-[1.02]"
      >
        <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span className="ml-2 text-[0.6rem] font-medium text-slate-500">Safety Management System</span>
          <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-amber-400">
            Concept UI
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2 py-3 text-center transition-colors duration-500 [@media(hover:hover)]:group-hover:border-cyan-500/40"
                >
                  <Icon className="h-4 w-4 text-cyan-400 transition-colors duration-500 [@media(hover:hover)]:group-hover:text-cyan-300" />
                  <span className="text-[0.58rem] font-medium leading-tight text-slate-400">{tile.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 p-3">
            <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500">Risk Overview</span>
            <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
              <span className="h-full w-1/4 bg-emerald-500/70" />
              <span className="h-full w-1/3 bg-amber-500/70" />
              <span className="h-full w-1/6 bg-orange-500/70" />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-slate-800 p-3">
            {records.map((record) => (
              <div key={record.label} className="flex items-center justify-between gap-2">
                <span className="truncate text-[0.68rem] text-slate-400">{record.label}</span>
                <span className="shrink-0 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[0.58rem] font-semibold text-cyan-400 transition-colors duration-500 [@media(hover:hover)]:group-hover:bg-cyan-500/25 [@media(hover:hover)]:group-hover:text-cyan-300">
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SafetecPreview() {
  const stats = [
    { label: "Posts Published", icon: Megaphone },
    { label: "Profile Views", icon: TrendingUp },
  ];
  const posts = [
    { label: "Safety Culture Series — LinkedIn", icon: ThumbsUp },
    { label: "Google Business Profile Update", icon: MessageCircle },
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-gradient-to-br from-amber-50 to-white p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Digital Presence
        </span>
        <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-white dark:bg-amber-500">
          Ongoing
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.label}
              className="flex items-center gap-2 rounded-lg border border-amber-100 bg-white/80 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900/80"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="truncate text-[0.62rem] font-medium text-slate-600 dark:text-slate-400">
                {tile.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5 rounded-lg border border-amber-100 bg-white/80 p-2.5 dark:border-slate-800 dark:bg-slate-900/80">
        {posts.map((post) => {
          const Icon = post.icon;
          return (
            <div key={post.label} className="flex items-center gap-2">
              <Icon className="h-3 w-3 shrink-0 text-amber-500" />
              <span className="truncate text-[0.62rem] text-slate-600 dark:text-slate-400">{post.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupportingCard({
  href,
  category,
  status,
  title,
  description,
  focusAreas,
  visual,
}: {
  href: string;
  category: string;
  status: string;
  title: string;
  description: string;
  focusAreas: string[];
  visual: ReactNode;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-amber-300 [@media(hover:hover)]:hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:[@media(hover:hover)]:hover:border-amber-500/50">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">{visual}</div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-amber-700 transition-colors duration-300 [@media(hover:hover)]:group-hover:text-amber-500 dark:text-amber-400">
            {category}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>

        <ul className="mt-1 flex flex-wrap gap-1.5">
          {focusAreas.map((item) => (
            <li
              key={item}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors duration-300 [@media(hover:hover)]:group-hover:bg-amber-50 [@media(hover:hover)]:group-hover:text-amber-800 dark:bg-slate-700/70 dark:text-slate-300 dark:[@media(hover:hover)]:group-hover:bg-amber-500/10 dark:[@media(hover:hover)]:group-hover:text-amber-300"
            >
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className="relative mt-auto inline-flex w-fit items-center gap-1.5 pt-3 text-sm font-semibold text-amber-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
        >
          View Project
          <ArrowRight
            aria-hidden
            className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-20 dark:bg-slate-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,black_30%,transparent_100%)] dark:opacity-[0.1] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10"
      />

      <Container className="relative flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <Reveal className="flex items-center gap-3">
            <span aria-hidden className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">04</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-700 dark:text-amber-400">
              Featured Work
            </span>
          </Reveal>

          <Reveal delay={40} ariaHidden className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <Reveal delay={80} className="lg:col-span-7">
              <h2
                id="work-heading"
                className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
              >
                Selected Work Across EHS, Systems and Communication
              </h2>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-4 lg:col-span-5 lg:self-end">
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                A focused selection of work showing how workplace safety practice, practical
                digital systems and professional communication can support better organisational
                action.
              </p>
              <Link
                href="/projects"
                className="group/link relative inline-flex w-fit items-center gap-1.5 border-b border-slate-300 pb-1 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:text-amber-400"
              >
                View All Projects
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-amber-600 transition-transform duration-300 group-hover/link:translate-x-1 dark:text-amber-400"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-600 transition-transform duration-[350ms] ease-out group-hover/link:scale-x-100 motion-reduce:transition-none dark:bg-amber-400"
                />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Row 1 — Featured: Safety Management System */}
        <Reveal delay={180}>
          <div className="group relative overflow-hidden rounded-[26px] border border-slate-700/70 bg-slate-900 shadow-lg transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-cyan-500/40 [@media(hover:hover)]:hover:shadow-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,var(--color-slate-600)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-600)_1px,transparent_1px)] [background-size:40px_40px]"
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-[6fr_7fr] lg:items-stretch">
              <div className="flex flex-col justify-center gap-3 p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cyan-400">
                    EHS Systems
                  </span>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-amber-400">
                    Concept UI
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-white sm:text-3xl">Safety Management System</h3>

                <p className="max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                  A digital EHS platform designed to organise hazard reporting, workplace
                  inspections, risk records and corrective-action follow-up in one structured
                  system.
                </p>

                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {["Hazard Reporting", "Inspections", "Risk Records", "Corrective Actions"].map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={SAFETY_SYSTEM.href}
                  className="relative mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-400 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  View Project
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="min-h-[280px] border-t border-slate-800 lg:min-h-[460px] lg:border-l lg:border-t-0">
                <SafetyPlatformPreview />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Row 2 — Supporting projects */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Reveal delay={260}>
            <SupportingCard
              href={RISK_ASSESSMENT.href}
              category="Occupational Safety & Health"
              status="Professional Practice"
              title="Workplace Risk Assessment Framework"
              description="A structured approach for identifying hazards, assessing workplace risk and organising practical control actions and follow-up."
              focusAreas={["Hazard Identification", "Risk Evaluation", "Control Actions"]}
              visual={
                <>
                  <Reveal variant="image" duration={700} className="absolute inset-0 z-0">
                    <Image
                      src={RISK_ASSESSMENT.image!}
                      alt={RISK_ASSESSMENT.imageAlt ?? RISK_ASSESSMENT.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-500 ease-out motion-reduce:[@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:scale-[1.04]"
                    />
                  </Reveal>
                  <div
                    aria-hidden
                    className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent transition-[background] duration-500 [@media(hover:hover)]:group-hover:via-slate-950/25"
                  />
                </>
              }
            />
          </Reveal>

          <Reveal delay={320}>
            <SupportingCard
              href={SAFETEC.href}
              category="EHS × Digital Communication"
              status="Ongoing"
              title="Safetec Solutions — Digital Presence & Social Media Management"
              description="Ongoing management of safety-focused content and digital presence across LinkedIn, website content and Google Business Profile."
              focusAreas={["LinkedIn Management", "Website & GBP Content", "Performance Monitoring"]}
              visual={<SafetecPreview />}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
