import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import { CONNECTION_STEPS } from "@/lib/data/connection";

export default function ConnectionSection() {
  return (
    <section
      aria-labelledby="connection-heading"
      className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="How It Connects"
            title="One Way of Solving Problems, Three Disciplines"
            description="Occupational safety identifies workplace risks and operational needs. Technology builds the systems that solve them. Digital communication makes sure the outcome actually reaches people."
          />
        </Reveal>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CONNECTION_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.id}>
                <Reveal delay={100 + index * 80} className="h-full">
                  <div className="relative flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                        {index + 1}
                      </span>
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {step.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
