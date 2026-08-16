import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

export default function Introduction() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-slate-200 bg-slate-50 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-16 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[3fr_2fr] md:gap-8 lg:gap-16">
          <Reveal distance={16} className="flex flex-col items-start gap-5">
            <span className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-600 dark:bg-amber-400"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-700 dark:text-amber-400">
                About My Work
              </span>
            </span>

            <h2
              id="about-heading"
              className="text-balance text-3xl font-semibold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
            >
              <span className="font-bold">Practical Safety Thinking</span>, Strengthened by
              Digital Tools
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              My work begins with real workplace conditions—identifying hazards, understanding
              operational gaps and helping organisations establish practical safety measures.
              Where technology can improve reporting, organisation or communication, I use
              digital tools to make those processes clearer and more reliable.
            </p>

            <Link
              href="/about"
              className="group/about relative inline-flex w-fit items-center gap-1.5 border-b border-slate-300 pb-1 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:text-amber-400"
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

          <Reveal distance={16} delay={120}>
            <div className="group relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900 p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-amber-500/40 [@media(hover:hover)]:hover:shadow-md motion-reduce:[@media(hover:hover)]:hover:translate-y-0 sm:p-8">
              <span
                aria-hidden
                className="mb-4 block h-[2px] w-8 rounded-full bg-amber-500 transition-[width] duration-500 [@media(hover:hover)]:group-hover:w-12 motion-reduce:[@media(hover:hover)]:group-hover:w-8"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Working Principle
              </p>

              <p className="mt-3 text-lg font-medium leading-snug text-slate-100 sm:text-xl">
                Start with the workplace. Build around the people. Use technology where it
                improves action.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-800 pt-5 text-xs font-medium uppercase tracking-wide text-slate-400 transition-colors duration-500 [@media(hover:hover)]:group-hover:text-slate-200">
                <span>Observe</span>
                <span
                  aria-hidden
                  className="text-slate-600 transition-colors duration-500 [@media(hover:hover)]:group-hover:text-amber-500"
                >
                  →
                </span>
                <span>Organise</span>
                <span
                  aria-hidden
                  className="text-slate-600 transition-colors duration-500 [@media(hover:hover)]:group-hover:text-amber-500"
                >
                  →
                </span>
                <span>Act</span>
                <span
                  aria-hidden
                  className="text-slate-600 transition-colors duration-500 [@media(hover:hover)]:group-hover:text-amber-500"
                >
                  →
                </span>
                <span>Improve</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
