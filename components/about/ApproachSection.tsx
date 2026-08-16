import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import { CONNECTION_STEPS } from "@/lib/data/connection";

export default function ApproachSection() {
  return (
    <section
      aria-labelledby="approach-heading"
      className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="My Approach"
            title="A Consistent Way of Solving Problems"
            description="Whatever the discipline, the underlying method stays the same — a working methodology I apply across safety practice, systems and communication."
            id="approach-heading"
          />
        </Reveal>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CONNECTION_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.id}>
                <Reveal delay={100 + index * 80} className="group h-full">
                  <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-0.5 w-0 bg-amber-500 transition-[width] duration-300 group-hover:w-full motion-reduce:transition-none motion-reduce:group-hover:w-0 dark:bg-amber-400"
                    />
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                        {index + 1}
                      </span>
                      <Icon
                        className="h-5 w-5 text-amber-600 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 dark:text-amber-400"
                        aria-hidden
                      />
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
