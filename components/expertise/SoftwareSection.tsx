import { ArrowUpRight, Code2 } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";

const CAPABILITIES = [
  "EHS reporting systems",
  "Inspection & audit tools",
  "Hazard tracking workflows",
  "Corrective-action systems",
  "Safety dashboards",
  "Digital record-keeping",
];

const TECHNOLOGIES = ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git", "GitHub", "VS Code"];

export default function SoftwareSection() {
  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      className="scroll-mt-24 border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Complementary Capability"
            title="EHS Systems & Digital Solutions"
            description="The ability to turn EHS needs, hazard reporting, inspections, audits and corrective actions, into practical digital systems that are reliable and easy to use."
            id="software-heading"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white dark:bg-sky-500">
                <Code2 className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Capability Areas
              </h3>
              <ul className="flex flex-wrap gap-2">
                {CAPABILITIES.map((item) => (
                  <li
                    key={item}
                    className="cursor-default rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Technologies
              </h3>
              <ul className="flex flex-wrap gap-2">
                {TECHNOLOGIES.map((tech) => (
                  <li
                    key={tech}
                    className="cursor-default rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Looking for a general website, web application or non-EHS software solution?{" "}
                  <a
                    href={HARUNLUCAS_DEV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100 dark:decoration-slate-700 dark:hover:decoration-slate-100"
                  >
                    Explore HarunLucas Dev
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
