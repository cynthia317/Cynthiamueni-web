import { Code2, HardHat, Megaphone } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import type { AccentColor } from "@/types";

const ACCENT: Record<AccentColor, { border: string; icon: string }> = {
  amber: {
    border: "border-slate-200 hover:border-amber-300 dark:border-slate-800 dark:hover:border-amber-500/50",
    icon: "bg-amber-600 text-white dark:bg-amber-500",
  },
  sky: {
    border: "border-slate-200 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-500/50",
    icon: "bg-sky-600 text-white dark:bg-sky-500",
  },
  violet: {
    border: "border-slate-200 hover:border-violet-300 dark:border-slate-800 dark:hover:border-violet-500/50",
    icon: "bg-violet-600 text-white dark:bg-violet-500",
  },
  emerald: {
    border: "border-slate-200 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-500/50",
    icon: "bg-emerald-600 text-white dark:bg-emerald-500",
  },
};

const REASONS: { id: string; title: string; icon: typeof HardHat; accent: AccentColor; description: string }[] = [
  {
    id: "osh",
    title: "Occupational Safety & Health",
    icon: HardHat,
    accent: "amber",
    description: "Risk assessments, workplace audits, safety documentation, and OSH collaboration.",
  },
  {
    id: "software",
    title: "Software & Digital Systems",
    icon: Code2,
    accent: "sky",
    description: "Internal tools, safety-management systems, and other practical software projects.",
  },
  {
    id: "communication",
    title: "Digital Communication",
    icon: Megaphone,
    accent: "violet",
    description: "Social media management, content strategy, and digital presence for OSH-related work.",
  },
];

export default function ContactReasons() {
  return (
    <section
      aria-labelledby="contact-reasons-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="What I Can Help With"
            title="Reach Out About Any of These"
            id="contact-reasons-heading"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            const accent = ACCENT[reason.accent];
            return (
              <Reveal key={reason.id} delay={index * 100} className="group h-full">
                <div
                  className={`flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:bg-slate-900 ${accent.border}`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${accent.icon}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
