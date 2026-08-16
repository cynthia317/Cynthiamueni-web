import { Layers, MessageSquare, Search, Settings2, TrendingUp, type LucideIcon } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

interface Stage {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  nodeBorder: string;
  nodeBorderHover: string;
  nodeIcon: string;
  badge: string;
  titleHover: string;
  panelBorderHover: string;
  extraGlow?: string;
}

const STAGES: Stage[] = [
  {
    id: "identify",
    number: "01",
    title: "Identify",
    description:
      "Observe the workplace, recognise hazards and understand the operational gaps affecting safety and performance.",
    icon: Search,
    nodeBorder: "border-amber-500/40",
    nodeBorderHover: "[@media(hover:hover)]:group-hover:border-amber-400",
    nodeIcon: "text-amber-400",
    badge: "bg-amber-500 text-slate-950",
    titleHover: "[@media(hover:hover)]:group-hover:text-amber-400",
    panelBorderHover: "[@media(hover:hover)]:hover:border-amber-500/40",
  },
  {
    id: "structure",
    number: "02",
    title: "Structure",
    description:
      "Translate the findings into clear priorities, controls, responsibilities and a practical course of action.",
    icon: Layers,
    nodeBorder: "border-yellow-500/40",
    nodeBorderHover: "[@media(hover:hover)]:group-hover:border-yellow-400",
    nodeIcon: "text-yellow-400",
    badge: "bg-yellow-500 text-slate-950",
    titleHover: "[@media(hover:hover)]:group-hover:text-yellow-400",
    panelBorderHover: "[@media(hover:hover)]:hover:border-yellow-500/40",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    description: "Create the process, document or digital tool needed to organise reporting, inspections and follow-up.",
    icon: Settings2,
    nodeBorder: "border-cyan-500/40",
    nodeBorderHover: "[@media(hover:hover)]:group-hover:border-cyan-400",
    nodeIcon: "text-cyan-400",
    badge: "bg-cyan-500 text-slate-950",
    titleHover: "[@media(hover:hover)]:group-hover:text-cyan-400",
    panelBorderHover: "[@media(hover:hover)]:hover:border-cyan-400/60",
    extraGlow: "[@media(hover:hover)]:hover:shadow-[inset_0_0_18px_rgba(34,211,238,0.16)]",
  },
  {
    id: "communicate",
    number: "04",
    title: "Communicate",
    description:
      "Present the information clearly so employees, managers and relevant audiences understand what action is needed.",
    icon: MessageSquare,
    nodeBorder: "border-sky-500/40",
    nodeBorderHover: "[@media(hover:hover)]:group-hover:border-sky-400",
    nodeIcon: "text-sky-400",
    badge: "bg-sky-500 text-slate-950",
    titleHover: "[@media(hover:hover)]:group-hover:text-sky-400",
    panelBorderHover: "[@media(hover:hover)]:hover:border-sky-500/40",
  },
  {
    id: "improve",
    number: "05",
    title: "Improve",
    description: "Use feedback, observations and performance information to strengthen the system over time.",
    icon: TrendingUp,
    nodeBorder: "border-teal-500/40",
    nodeBorderHover: "[@media(hover:hover)]:group-hover:border-teal-400",
    nodeIcon: "text-teal-400",
    badge: "bg-teal-500 text-slate-950",
    titleHover: "[@media(hover:hover)]:group-hover:text-teal-400",
    panelBorderHover: "[@media(hover:hover)]:hover:border-teal-500/40",
  },
];

function StageNode({ stage, delay, large }: { stage: Stage; delay: number; large?: boolean }) {
  const Icon = stage.icon;
  return (
    <Reveal variant="node" delay={delay} duration={700}>
      <div
        className={`group relative flex shrink-0 items-center justify-center rounded-full border-2 bg-slate-800 shadow-sm transition-[border-color,box-shadow] duration-[400ms] ease-out [@media(hover:hover)]:group-hover:shadow-md ${
          large ? "h-12 w-12" : "h-11 w-11"
        } ${stage.nodeBorder} ${stage.nodeBorderHover}`}
      >
        <Icon
          className={`h-[18px] w-[18px] transition-transform duration-[400ms] motion-reduce:[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:-translate-y-0.5 ${stage.nodeIcon}`}
          aria-hidden
        />
        <span
          aria-hidden
          className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] font-bold ${stage.badge}`}
        >
          {stage.number}
        </span>
      </div>
    </Reveal>
  );
}

function StagePanel({ stage, delay, widthClasses }: { stage: Stage; delay: number; widthClasses: string }) {
  return (
    <Reveal delay={delay} distance={16} duration={700} className={widthClasses}>
      <div
        className={`group rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-sm transition-[transform,border-color,box-shadow] duration-[400ms] ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:shadow-md ${stage.panelBorderHover} ${stage.extraGlow ?? ""}`}
      >
        <span className="text-[0.65rem] font-semibold text-slate-500">{stage.number}</span>
        <h3
          className={`mt-1 text-sm font-semibold text-slate-100 transition-colors duration-[400ms] ${stage.titleHover}`}
        >
          {stage.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{stage.description}</p>
      </div>
    </Reveal>
  );
}

export default function ConnectionSection() {
  return (
    <section
      id="how-i-work"
      aria-labelledby="connection-heading"
      className="relative overflow-hidden bg-slate-900 py-14 lg:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_0%_100%,black_30%,transparent_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      <Container className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Reveal className="flex items-center gap-3">
            <span aria-hidden className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-500" />
            <span className="text-sm font-bold text-amber-400">03</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-400">How I Work</span>
          </Reveal>

          <Reveal delay={40} ariaHidden className="h-px w-full bg-slate-800" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <Reveal delay={80} className="lg:col-span-7">
              <h2
                id="connection-heading"
                className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                From Workplace Risk to Practical Improvement
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5 lg:self-end">
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                I begin with the conditions people actually work in, then turn what I observe into
                practical controls, organised systems and clear communication. Feedback and
                evidence help improve the result over time.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Desktop: horizontal connected workflow */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 items-end gap-x-3">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex justify-center">
                {i % 2 === 0 ? <StagePanel stage={stage} delay={380 + i * 80} widthClasses="w-full max-w-[190px]" /> : null}
              </div>
            ))}
          </div>

          <div className="relative mt-4 grid grid-cols-5 items-center gap-x-3">
            <div aria-hidden className="pointer-events-none absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 bg-slate-700/70" />
            <Reveal
              variant="line-x"
              duration={1400}
              delay={200}
              ariaHidden
              className="pointer-events-none absolute inset-x-[10%] top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-teal-400"
            />
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex justify-center">
                <StageNode stage={stage} delay={300 + i * 80} large={stage.id === "build"} />
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-5 items-start gap-x-3">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex justify-center">
                {i % 2 === 1 ? <StagePanel stage={stage} delay={380 + i * 80} widthClasses="w-full max-w-[190px]" /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <div className="relative lg:hidden">
          <div aria-hidden className="absolute left-5 top-5 bottom-5 w-px bg-slate-700/70" />
          <Reveal
            variant="line-y"
            duration={1400}
            delay={160}
            ariaHidden
            className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-amber-500 via-cyan-400 to-teal-400"
          />

          <ol className="flex flex-col gap-7">
            {STAGES.map((stage, i) => (
              <li key={stage.id} className="relative flex items-start gap-4">
                <StageNode stage={stage} delay={220 + i * 60} />
                <StagePanel stage={stage} delay={250 + i * 60} widthClasses="min-w-0 flex-1" />
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={780} className="flex flex-col items-center gap-2 pt-1 text-center">
          <span aria-hidden className="h-[2px] w-8 rounded-full bg-amber-500" />
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-amber-400">The Outcome</p>
          <p className="text-sm font-medium text-slate-300 sm:text-base">
            <span className="text-white">Safer work</span>
            <span aria-hidden className="mx-2 text-slate-600">
              ·
            </span>
            <span className="text-white">Better follow-up</span>
            <span aria-hidden className="mx-2 text-slate-600">
              ·
            </span>
            <span className="text-white">Clearer communication</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
