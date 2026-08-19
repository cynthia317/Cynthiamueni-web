import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

const LEDGER_ROWS = [
  {
    number: "01",
    label: "Primary Field",
    value: "Occupational Safety & Health",
  },
  {
    number: "02",
    label: "Systems Focus",
    value: "EHS Reporting & Practical Workflows",
  },
  {
    number: "03",
    label: "Communication",
    value: "Safety & Professional Content",
  },
  {
    number: "04",
    label: "Working Style",
    value: "Practical · People-centred · Evidence-informed",
  },
];

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,var(--color-slate-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-500)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_40%,transparent_100%)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left — narrative */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal startOpacity={0.3} distance={24} duration={700}>
              <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span aria-hidden className="h-[2px] w-6 rounded-full bg-amber-500" />
                About Cynthia Mueni
              </span>
            </Reveal>

            <Reveal delay={60} startOpacity={0.3} distance={24} duration={700}>
              <h1 className="max-w-[720px] text-[clamp(2.625rem,1.5rem+4vw,4.75rem)] font-semibold leading-[1.1] tracking-tight text-white">
                Grounded in Safety. Focused on <span className="text-amber-500">Practical Change.</span>
              </h1>
            </Reveal>

            <Reveal delay={120} startOpacity={0.3} distance={24} duration={700}>
              <p className="max-w-[620px] text-lg leading-relaxed text-slate-400 sm:text-xl">
                I am an Occupational Safety &amp; Health professional whose work begins with
                understanding how people, processes and workplace conditions interact. I use
                practical EHS systems and clear digital communication to help turn safety needs
                into organised action.
              </p>
            </Reveal>

            <Reveal delay={180} startOpacity={0.3} distance={24} duration={700}>
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-sm transition-[background-color,transform,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:bg-amber-600 [@media(hover:hover)]:hover:shadow-md"
                  >
                    Explore My Work
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/expertise"
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-600 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-[background-color,border-color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-amber-500/60 [@media(hover:hover)]:hover:bg-amber-500/10"
                  >
                    View My Expertise
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <p className="text-sm text-slate-500">
                  Based in Kenya · Working across EHS practice, systems and communication
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right — professional profile ledger */}
          <Reveal delay={240} startOpacity={0.3} distance={24} duration={700} className="lg:col-span-5">
            <div className="group/ledger relative rounded-[24px] border border-slate-700/70 bg-slate-900/80 p-6 shadow-xl shadow-black/20 transition-[transform,box-shadow,border-color] duration-[350ms] sm:p-7 [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-amber-500/30 [@media(hover:hover)]:hover:shadow-2xl">
              <span aria-hidden className="mb-5 block h-[2px] w-10 rounded-full bg-amber-500" />

              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Professional Profile
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  EHS-First Practice
                </span>
              </div>

              <div className="flex flex-col">
                {LEDGER_ROWS.map((row, index) => (
                  <Reveal
                    key={row.number}
                    delay={300 + index * 40}
                    startOpacity={0.3}
                    distance={16}
                    duration={700}
                  >
                    <div
                      className={`group/row relative flex items-baseline gap-3 rounded-lg px-3 py-4 transition-colors duration-300 [@media(hover:hover)]:hover:bg-slate-800/60 ${
                        index > 0 ? "border-t border-slate-700/60" : ""
                      }`}
                    >
                      <span className="text-xs font-semibold text-amber-500/70 transition-colors duration-300 [@media(hover:hover)]:group-hover/row:text-amber-400">
                        {row.number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {row.label}
                        </p>
                        <p className="mt-1 text-base font-medium text-white transition-transform duration-300 [@media(hover:hover)]:group-hover/row:translate-x-0.5">
                          {row.value}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-amber-500/60 transition-transform duration-300 [@media(hover:hover)]:group-hover/row:scale-x-100"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
