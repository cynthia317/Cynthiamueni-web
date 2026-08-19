import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { PROJECTS } from "@/lib/data/projects";

const STAGES = ["Workplace Problem", "Safety Assessment", "Structured Data", "Digital System", "Monitoring & Improvement"];

export default function SafetyDigitalBridge() {
  const smsProject = PROJECTS.find((project) => project.id === "safety-management-system");

  return (
    <section aria-label="Where safety and digital systems connect" className="py-14 sm:py-16">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
              {STAGES.map((stage, index) => (
                <Fragment key={stage}>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {stage}
                  </span>
                  {index < STAGES.length - 1 ? (
                    <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-700" aria-hidden />
                  ) : null}
                </Fragment>
              ))}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              A workplace safety problem becomes valuable once it&apos;s structured and turned into
              data a digital system can hold, track and surface over time. The{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Safety Management System
              </span>{" "}
              project is a practical example of this connection in progress.
            </p>

            {smsProject ? (
              <ArrowLink href={smsProject.href} className="text-sm">
                View Safety Management System
              </ArrowLink>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
