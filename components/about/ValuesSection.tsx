import { Award, BookOpen, Lightbulb, Network, ShieldCheck, Users } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import type { AccentColor } from "@/types";

const ACCENT: Record<AccentColor, { hover: string; icon: string; underline: string }> = {
  amber: {
    hover: "hover:border-amber-200 hover:bg-amber-50/50 dark:hover:border-amber-500/20 dark:hover:bg-amber-500/5",
    icon: "group-hover:bg-amber-100 group-hover:text-amber-700 dark:group-hover:bg-amber-500/15 dark:group-hover:text-amber-400",
    underline: "bg-amber-500 dark:bg-amber-400",
  },
  sky: {
    hover: "hover:border-sky-200 hover:bg-sky-50/50 dark:hover:border-sky-500/20 dark:hover:bg-sky-500/5",
    icon: "group-hover:bg-sky-100 group-hover:text-sky-700 dark:group-hover:bg-sky-500/15 dark:group-hover:text-sky-400",
    underline: "bg-sky-500 dark:bg-sky-400",
  },
  violet: {
    hover: "hover:border-violet-200 hover:bg-violet-50/50 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/5",
    icon: "group-hover:bg-violet-100 group-hover:text-violet-700 dark:group-hover:bg-violet-500/15 dark:group-hover:text-violet-400",
    underline: "bg-violet-500 dark:bg-violet-400",
  },
  emerald: {
    hover: "hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-500/20 dark:hover:bg-emerald-500/5",
    icon: "group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:group-hover:bg-emerald-500/15 dark:group-hover:text-emerald-400",
    underline: "bg-emerald-500 dark:bg-emerald-400",
  },
};

const VALUES: { id: string; label: string; icon: typeof Award; accent: AccentColor; description: string }[] = [
  {
    id: "professionalism",
    label: "Professionalism",
    icon: Award,
    accent: "amber",
    description: "Approaching every project with discipline, accountability and attention to detail.",
  },
  {
    id: "learning",
    label: "Continuous Learning",
    icon: BookOpen,
    accent: "sky",
    description: "Staying current across safety practice, technology and digital communication.",
  },
  {
    id: "problem-solving",
    label: "Practical Problem Solving",
    icon: Lightbulb,
    accent: "violet",
    description: "Favouring solutions that work in real conditions over purely theoretical ones.",
  },
  {
    id: "integrity",
    label: "Integrity",
    icon: ShieldCheck,
    accent: "emerald",
    description: "Being honest about risk, capability and what a solution can realistically achieve.",
  },
  {
    id: "systems-thinking",
    label: "Systems Thinking",
    icon: Network,
    accent: "amber",
    description: "Looking at how people, processes and technology interact — not just isolated parts.",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: Users,
    accent: "sky",
    description: "Working closely with the people who understand a problem best: those living with it.",
  },
];

export default function ValuesSection() {
  return (
    <section
      aria-labelledby="values-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow="What Guides My Work" title="Values" id="values-heading" />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, index) => {
            const Icon = value.icon;
            const accent = ACCENT[value.accent];
            return (
              <Reveal key={value.id} delay={index * 80} className="group">
                <div
                  className={`-m-4 flex gap-4 rounded-xl border border-transparent p-4 transition-colors duration-300 ${accent.hover}`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors duration-300 dark:bg-slate-800 dark:text-slate-300 ${accent.icon}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="w-fit text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {value.label}
                      <span
                        aria-hidden
                        className={`mt-0.5 block h-px w-0 transition-[width] duration-300 group-hover:w-full motion-reduce:transition-none motion-reduce:group-hover:w-0 ${accent.underline}`}
                      />
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
