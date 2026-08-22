import { ArrowUpRight, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import Button from "@/components/ui/Button";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";

export default function ReferralSection() {
  return (
    <section aria-labelledby="referral-heading" className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="flex max-w-xl flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                For organisations &amp; businesses
              </span>
              <h2
                id="referral-heading"
                className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50"
              >
                Need a digital solution for your business?
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                This portfolio focuses on Occupational Safety &amp; Health, EHS systems and digital
                communication. For general websites, web applications, business systems or
                software development, that work is handled separately through HarunLucas Dev.
              </p>
            </div>

            <Button
              href={HARUNLUCAS_DEV_URL}
              external
              className="shrink-0"
              icon={<ArrowUpRight className="h-4 w-4" aria-hidden />}
            >
              Visit HarunLucas Dev
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
