import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import HeroVisual from "@/components/home/HeroVisual";
import Button from "@/components/ui/Button";
import LightSweepText from "@/components/ui/LightSweepText";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Occupational Safety &amp; Health · Software Development · Digital Communication
            </span>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
              Building <LightSweepText accent="amber">Safer</LightSweepText> Workplaces and
              Smarter <LightSweepText accent="sky">Digital Systems</LightSweepText>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              I work at the intersection of occupational safety, technology, and digital
              communication — combining risk expertise with technical and digital skill to help
              organisations operate more safely, efficiently, and effectively.
            </p>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="#work" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Explore My Work
              </Button>
              <Button href="/contact" variant="secondary">
                Contact Me
              </Button>
            </div>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
