import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

export default function Introduction() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden border-t border-slate-200 bg-amber-50/25 pt-16 pb-16 sm:pt-20 lg:pt-24 lg:pb-24 dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_0%_0%,black_25%,transparent_100%)] dark:opacity-[0.08] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-500/10"
      />

      <Container className="relative flex flex-col">
        {/* Tier 1 — Editorial introduction */}
        <div className="flex flex-col gap-4">
          <Reveal startOpacity={0.2} className="flex items-center gap-3">
            <span aria-hidden className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">01</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-700 dark:text-amber-400">
              About My Work
            </span>
          </Reveal>

          <Reveal startOpacity={0.2} ariaHidden className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            <Reveal delay={60} startOpacity={0.2}>
              <h2
                id="about-heading"
                className="text-balance text-[clamp(1.75rem,1.3rem+2vw,2.25rem)] font-semibold leading-[1.2] tracking-tight text-slate-900 dark:text-slate-50"
              >
                Practical Safety Thinking, Strengthened by Digital Tools
              </h2>
            </Reveal>

            <Reveal delay={100} startOpacity={0.2} className="flex flex-col gap-4 lg:pt-10">
              <p className="max-w-[600px] text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                My work begins with real workplace conditions—identifying hazards, understanding
                operational gaps and helping organisations establish practical safety measures.
                Where technology can improve reporting, organisation or communication, I use
                digital tools to make those processes clearer and more reliable.
              </p>

              <Link
                href="/about"
                className="group/about relative inline-flex w-fit items-center gap-1.5 border-b border-slate-300 pb-1 text-sm font-semibold text-slate-900 transition-[color,transform] duration-300 hover:-translate-y-px hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 dark:border-slate-600 dark:text-slate-100 dark:hover:text-amber-400"
              >
                More about my background
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-amber-600 transition-transform duration-300 group-hover/about:translate-x-1 dark:text-amber-400"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-600 transition-transform duration-[350ms] ease-out group-hover/about:scale-x-100 motion-reduce:transition-none dark:bg-amber-400"
                />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Tier 2 — Full-width working-principle banner */}
        <Reveal delay={220} startOpacity={0.2} className="mt-12 lg:mt-14">
          <div className="group relative overflow-hidden rounded-[26px] border border-slate-700/70 bg-slate-900 shadow-lg transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-amber-500/40 [@media(hover:hover)]:hover:shadow-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,var(--color-slate-600)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-600)_1px,transparent_1px)] [background-size:40px_40px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-80"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 left-[26%] select-none font-serif text-[7rem] leading-none text-slate-100/[0.05] transition-colors duration-500 [@media(hover:hover)]:group-hover:text-slate-100/[0.09] sm:text-[9rem]"
            >
              &rdquo;
            </span>

            <div className="relative grid grid-cols-1 gap-8 px-7 py-10 sm:px-9 sm:py-12 lg:grid-cols-[1fr_2fr_1fr] lg:items-center lg:gap-10 lg:px-10 lg:py-16">
              <div className="flex flex-col gap-2">
                <Reveal
                  variant="line-x"
                  duration={700}
                  delay={280}
                  ariaHidden
                  className="h-[2px] w-10 rounded-full bg-amber-500 [@media(hover:hover)]:group-hover:w-14 motion-reduce:[@media(hover:hover)]:group-hover:w-10"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Working Principle
                </span>
                <span className="text-[0.65rem] font-medium tracking-wide text-slate-500">01 / Practice</span>
              </div>

              <p className="relative max-w-xl text-[26px] font-medium leading-[1.35] text-slate-100 transition-colors duration-500 sm:text-[30px] lg:text-[32px] [@media(hover:hover)]:group-hover:text-white">
                Start with the workplace. Build around the people. Use technology where it{" "}
                <span className="transition-colors duration-500 [@media(hover:hover)]:group-hover:text-amber-400">
                  improves action
                </span>
                .
              </p>

              <div className="flex flex-col gap-1.5 lg:items-end lg:text-right">
                <p className="text-sm leading-relaxed text-slate-400">
                  Grounded in real conditions. Designed for practical use.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
