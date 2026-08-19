import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-16 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-500/10"
      />

      <Container className="relative">
        <div className="flex flex-col gap-5">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Services
            </span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Practical Support Across Safety, Systems &amp; Communication
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              What you can bring me in on: workplace safety consulting, digital systems that
              replace manual EHS processes, and communication that makes good work, safety or
              otherwise, visible.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
