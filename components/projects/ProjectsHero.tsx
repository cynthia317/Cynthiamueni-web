import { Code2, HardHat, Megaphone } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import LightSweepText from "@/components/ui/LightSweepText";
import { PROJECTS } from "@/lib/data/projects";

const DISCIPLINES = [
  {
    id: "osh",
    label: "Occupational Safety & Health",
    icon: HardHat,
    accent: "amber" as const,
  },
  {
    id: "software",
    label: "Software & Digital Systems",
    icon: Code2,
    accent: "sky" as const,
  },
  {
    id: "communication",
    label: "Digital Communication",
    icon: Megaphone,
    accent: "violet" as const,
  },
];

const ACCENT_STYLES = {
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  sky: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
  violet:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400",
};

export default function ProjectsHero() {
  const count = PROJECTS.length.toString().padStart(2, "0");

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Selected Work
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Work Across <LightSweepText accent="amber">Safety</LightSweepText>,{" "}
                <LightSweepText accent="sky">Systems</LightSweepText> &amp;{" "}
                <LightSweepText accent="violet">Digital Communication</LightSweepText>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                A working index of projects — practical, in progress, and grounded in real
                professional problems.
              </p>
            </Reveal>

            <Reveal delay={170}>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                Index — {count} Projects
              </span>
            </Reveal>
          </div>

          <Reveal
            delay={100}
            className="mx-auto flex w-full max-w-sm flex-col gap-3 lg:mx-0 lg:max-w-none"
          >
            {DISCIPLINES.map((discipline) => {
              const Icon = discipline.icon;
              return (
                <div
                  key={discipline.id}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 ${ACCENT_STYLES[discipline.accent]}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-slate-950/40">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold">{discipline.label}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
