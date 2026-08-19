import { Code2, HardHat, Megaphone } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import LightSweepText from "@/components/ui/LightSweepText";

const NODES = [
  {
    id: "osh",
    label: "Safety",
    icon: HardHat,
    x: 50,
    y: 14,
    color: "amber" as const,
  },
  {
    id: "software",
    label: "Systems",
    icon: Code2,
    x: 16,
    y: 82,
    color: "sky" as const,
  },
  {
    id: "communication",
    label: "Communication",
    icon: Megaphone,
    x: 84,
    y: 82,
    color: "violet" as const,
  },
];

const NODE_STYLES = {
  amber: "border-amber-200 text-amber-700 dark:border-amber-500/30 dark:text-amber-400",
  sky: "border-sky-200 text-sky-700 dark:border-sky-500/30 dark:text-sky-400",
  violet: "border-violet-200 text-violet-700 dark:border-violet-500/30 dark:text-violet-400",
};

export default function ExpertiseHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Expertise
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Expertise Built Around <LightSweepText accent="amber">Safety</LightSweepText>,{" "}
                <LightSweepText accent="sky">Systems</LightSweepText> &amp;{" "}
                <LightSweepText accent="violet">Communication</LightSweepText>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                My expertise combines technical safety knowledge, digital systems capability and
                clear communication to solve practical organisational problems, from identifying
                a workplace risk, to building the tool that manages it, to the content that
                explains it.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {NODES.map((node) => (
                  <a
                    key={node.id}
                    href={`#${node.id}`}
                    className={`rounded-full border bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:bg-slate-900 dark:hover:bg-slate-800 ${NODE_STYLES[node.color]}`}
                  >
                    {node.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div aria-hidden className="relative mx-auto aspect-square w-full max-w-sm">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full text-slate-200 dark:text-slate-800"
                preserveAspectRatio="none"
              >
                {NODES.map((node) => (
                  <line
                    key={node.id}
                    x1={50}
                    y1={50}
                    x2={node.x}
                    y2={node.y}
                    stroke="currentColor"
                    strokeWidth={0.6}
                  />
                ))}
              </svg>

              <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-center text-[0.6rem] font-semibold uppercase leading-tight tracking-wide text-white shadow-lg dark:border-slate-800 dark:bg-slate-100 dark:text-slate-900">
                Core
                <br />
                Expertise
              </div>

              {NODES.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[calc(50%+2px)] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-[-50%] dark:bg-slate-900/95 ${NODE_STYLES[node.color]}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap text-[0.65rem] font-semibold text-slate-700 dark:text-slate-200">
                      {node.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
