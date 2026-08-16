import { Fragment } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";

const CAPABILITIES = [
  "Content strategy",
  "Social media management",
  "Digital marketing",
  "Website content",
  "Google Business Profile",
  "SEO",
  "Analytics",
  "Performance reporting",
  "Professional brand communication",
];

const RELATIONSHIP = ["Technical knowledge", "Clear communication", "Audience understanding", "Measurable improvement"];

export default function CommunicationSection() {
  return (
    <section
      id="communication"
      aria-labelledby="communication-heading"
      className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Complementary Capability"
            title="Digital Communication & Social Media"
            description="More than posting on social media — this is about translating technical and professional information into content that reaches the right audience and can be measured over time."
            id="communication-heading"
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-col gap-4 rounded-2xl border border-violet-200 bg-white p-6 dark:border-violet-500/25 dark:bg-slate-900 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white dark:bg-violet-500">
              <Megaphone className="h-5 w-5" aria-hidden />
            </div>
            <ul className="flex flex-wrap gap-2">
              {CAPABILITIES.map((item) => (
                <li
                  key={item}
                  className="cursor-default rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            {RELATIONSHIP.map((step, index) => (
              <Fragment key={step}>
                <span className="rounded-full bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-800 dark:bg-violet-500/10 dark:text-violet-400">
                  {step}
                </span>
                {index < RELATIONSHIP.length - 1 ? (
                  <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-700" aria-hidden />
                ) : null}
              </Fragment>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
