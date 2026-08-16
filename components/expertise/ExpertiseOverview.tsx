import { ArrowRight, Code2, HardHat, Megaphone } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";

const SATELLITES = [
  {
    id: "software",
    title: "Software Development & Digital Systems",
    summary: "Turning organisational needs into practical, reliable digital tools.",
    icon: Code2,
    border: "border-slate-200 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-500/50",
    iconBg: "bg-sky-600 text-white dark:bg-sky-500",
  },
  {
    id: "communication",
    title: "Digital Communication & Social Media",
    summary: "Making technical work understandable, visible and measurable.",
    icon: Megaphone,
    border: "border-slate-200 hover:border-violet-300 dark:border-slate-800 dark:hover:border-violet-500/50",
    iconBg: "bg-violet-600 text-white dark:bg-violet-500",
  },
];

export default function ExpertiseOverview() {
  return (
    <section
      aria-labelledby="overview-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Overview"
            title="Three Connected Areas, One Foundation"
            description="Occupational Safety & Health remains the strongest professional pillar. Software development and digital communication extend that same foundation into practical systems and clear visibility."
            id="overview-heading"
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <a
              href="#osh"
              className="group flex flex-col gap-5 rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 to-white p-8 transition-colors duration-300 hover:border-amber-400 dark:border-amber-500/40 dark:from-amber-500/10 dark:to-slate-900 dark:hover:border-amber-400/70 sm:flex-row sm:items-center sm:p-10"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:bg-amber-500">
                <HardHat className="h-7 w-7" aria-hidden />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    Occupational Safety &amp; Health
                  </h3>
                  <span className="rounded-full bg-amber-600 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white dark:bg-amber-500">
                    Primary Discipline
                  </span>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  The strongest professional foundation — identifying hazards, assessing risk and
                  building the safety systems everything else connects back to.
                </p>
              </div>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-amber-700 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 dark:text-amber-400"
                aria-hidden
              />
            </a>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SATELLITES.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.id} delay={100 + index * 100} className="h-full">
                  <a
                    href={`#${item.id}`}
                    className={`group flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:bg-slate-900 ${item.border}`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${item.iconBg}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.summary}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Learn more
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        aria-hidden
                      />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
