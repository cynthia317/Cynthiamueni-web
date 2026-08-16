import { ArrowRight, HardHat, Layers } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import Button from "@/components/ui/Button";
import LightSweepText from "@/components/ui/LightSweepText";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                About Cynthia Mueni
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Building <LightSweepText accent="amber">Safer</LightSweepText> Workplaces,{" "}
                <LightSweepText accent="sky">Smarter</LightSweepText> Systems and{" "}
                <LightSweepText accent="violet">Stronger</LightSweepText> Communication
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                I&apos;m an Occupational Safety &amp; Health professional with interests in
                technology, software systems and digital communication. My work focuses on
                understanding real-world challenges, developing practical solutions, and improving
                how organisations operate and communicate.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button href="/contact" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Contact Me
                </Button>
                <Button href="/projects" variant="secondary">
                  View My Projects
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal
              delay={80}
              className="group relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-sm transition-[transform,box-shadow,border-color] duration-700 ease-out group-hover:-translate-y-0.5 group-hover:border-amber-300/70 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 dark:border-slate-800 dark:from-amber-500/10 dark:via-slate-900 dark:to-sky-500/10 dark:group-hover:border-amber-400/40">
                {/*
                  TODO: replace this placeholder with a professional head-and-shoulders
                  portrait via next/image (fill, object-cover, with the same
                  group-hover:scale-[1.03] group-hover:brightness-105 classes below).
                  Keep this frame's aspect-[4/5], rounded-3xl and border so the crop
                  stays consistent with the rest of the site's imagery.
                */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-3xl font-semibold tracking-wide text-white shadow-lg dark:border-slate-800 dark:bg-slate-100 dark:text-slate-900">
                    CM
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                    Portrait coming soon
                  </p>
                </div>
              </div>

              <div
                aria-hidden
                className="group/left absolute -left-6 top-8 flex w-48 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-sm transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-amber-300 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-900/95 dark:hover:border-amber-500/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition-transform duration-300 group-hover/left:scale-105 motion-reduce:transition-none motion-reduce:group-hover/left:scale-100 dark:bg-amber-500/15 dark:text-amber-400">
                  <HardHat className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    OSH Professional
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Primary discipline</p>
                </div>
              </div>

              <div
                aria-hidden
                className="group/right absolute -right-6 bottom-10 flex w-48 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-sm transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-sky-300 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-900/95 dark:hover:border-sky-500/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-transform duration-300 group-hover/right:scale-105 motion-reduce:transition-none motion-reduce:group-hover/right:scale-100 dark:bg-slate-100 dark:text-slate-900">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tech &amp; Communication
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complementary capability
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
