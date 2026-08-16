import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import HeroVisual from "@/components/home/HeroVisual";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:flex lg:min-h-[calc(100vh-5rem)] lg:items-center lg:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.12] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container maxWidth="max-w-[1240px]" className="relative w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[13fr_12fr] lg:gap-8">
          <div className="flex flex-col gap-5">
            <p className="group flex max-w-md flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-600 transition-[width] duration-[450ms] ease-out [@media(hover:hover)]:group-hover:w-[42px] motion-reduce:[@media(hover:hover)]:group-hover:w-[30px] dark:bg-amber-400"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700 transition-colors duration-[450ms] [@media(hover:hover)]:group-hover:text-amber-800 sm:tracking-[0.13em] dark:text-amber-400 dark:[@media(hover:hover)]:group-hover:text-amber-300">
                  Occupational Safety &amp; Health
                </span>
              </span>

              <span className="flex items-center gap-3 pl-[42px] sm:pl-0">
                <span
                  aria-hidden
                  className="hidden h-3 w-px shrink-0 bg-slate-300 sm:block dark:bg-slate-600"
                />
                <span className="text-balance text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 opacity-90 transition-opacity duration-[450ms] [@media(hover:hover)]:group-hover:opacity-100 sm:tracking-[0.13em] dark:text-slate-400">
                  EHS Systems · Digital Communication
                </span>
              </span>
            </p>

            <h1 className="text-balance text-4xl font-semibold leading-[1.2] text-slate-900 sm:text-5xl lg:max-w-[35rem] dark:text-slate-50">
              Building <span className="text-amber-700 dark:text-amber-400">Safer</span> Workplaces
              Through Practical <span className="whitespace-nowrap">EHS Systems</span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              I help organisations identify workplace risks, strengthen safety practices and
              communicate more effectively—combining occupational safety experience with
              practical digital tools and clear professional communication.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="#work"
                variant="accent"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                className="shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-600/20 motion-reduce:hover:translate-y-0"
              >
                Explore My EHS Work
              </Button>
              <Button
                href="/contact"
                variant="navyOutline"
                className="hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                Let&apos;s Work Together
              </Button>
            </div>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
