import { ClipboardCheck, PenTool, RefreshCw, Radio, Search, Wrench } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import type { AccentColor } from "@/types";

const STAGES: { id: string; label: string; icon: typeof Search; accent: AccentColor; description: string }[] = [
  {
    id: "identify",
    label: "Identify",
    icon: Search,
    accent: "amber",
    description: "Understand the problem, risk or need.",
  },
  {
    id: "assess",
    label: "Assess",
    icon: ClipboardCheck,
    accent: "amber",
    description: "Analyse hazards, processes, information or requirements.",
  },
  {
    id: "design",
    label: "Design",
    icon: PenTool,
    accent: "sky",
    description: "Develop the appropriate process, system, strategy or solution.",
  },
  {
    id: "implement",
    label: "Implement",
    icon: Wrench,
    accent: "sky",
    description: "Apply the solution through workplace systems, technology or communication.",
  },
  {
    id: "communicate",
    label: "Communicate",
    icon: Radio,
    accent: "violet",
    description: "Make information understandable and actionable.",
  },
  {
    id: "improve",
    label: "Improve",
    icon: RefreshCw,
    accent: "emerald",
    description: "Use feedback, data and observation for continuous improvement.",
  },
];

const ACCENT: Record<AccentColor, { icon: string; line: string; hoverBorder: string }> = {
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    line: "bg-amber-500 dark:bg-amber-400",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-500/50",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    line: "bg-sky-500 dark:bg-sky-400",
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-500/50",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    line: "bg-violet-500 dark:bg-violet-400",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-500/50",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    line: "bg-emerald-500 dark:bg-emerald-400",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
  },
};

export default function IntegratedProcess() {
  return (
    <section
      aria-labelledby="process-heading"
      className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="How My Expertise Connects"
            title="One Pathway Across All Three Disciplines"
            description="This is the methodology underneath everything on this page: the reason Occupational Safety & Health, software and communication belong together rather than standing as separate, unrelated skills."
            id="process-heading"
          />
        </Reveal>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const accent = ACCENT[stage.accent];
            return (
              <li key={stage.id}>
                <Reveal delay={80 + index * 70} className="group h-full">
                  <div
                    className={`relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-none ${accent.hoverBorder}`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 top-0 h-0.5 w-0 transition-[width] duration-300 group-hover:w-full motion-reduce:transition-none motion-reduce:group-hover:w-0 ${accent.line}`}
                    />
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                        {index + 1}
                      </span>
                      <Icon
                        className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${accent.icon}`}
                        aria-hidden
                      />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {stage.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {stage.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
