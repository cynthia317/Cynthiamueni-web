import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import Button from "@/components/ui/Button";
import LightSweepText from "@/components/ui/LightSweepText";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/constants";

export default function ContactHero() {
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
                Contact
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Let&apos;s Talk <LightSweepText accent="amber">Safety</LightSweepText>,{" "}
                <LightSweepText accent="sky">Systems</LightSweepText> &amp;{" "}
                <LightSweepText accent="violet">Communication</LightSweepText>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Whether it&apos;s an occupational safety project, a digital system, or
                communication work — I&apos;d like to hear about it. Send a message and
                I&apos;ll get back to you.
              </p>
            </Reveal>

            <Reveal delay={170}>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  href={`mailto:${CONTACT_EMAIL}`}
                  icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                >
                  Email Me
                </Button>
                <Button href="/projects" variant="secondary">
                  View My Work
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                Reach Me Directly
              </span>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors duration-200 hover:border-amber-300 hover:bg-amber-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-700 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Mail className="h-4 w-4" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {CONTACT_EMAIL}
                </span>
              </a>

              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-slate-200 p-3.5 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {social.label}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 dark:text-slate-500"
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
