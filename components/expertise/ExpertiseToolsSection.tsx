import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";

const TOOL_GROUPS = [
  {
    id: "safety",
    title: "Safety & Professional Practice",
    tools: ["Risk Assessment", "Hazard Identification", "Safety Audits", "Workplace Inspections", "Documentation & Reporting"],
  },
  {
    id: "development",
    title: "Development",
    tools: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git", "GitHub", "VS Code"],
  },
  {
    id: "communication",
    title: "Digital Communication",
    tools: ["Canva", "SEO Tools", "Analytics Tools", "Social Media Platforms", "Google Business Profile"],
  },
];

export default function ExpertiseToolsSection() {
  return (
    <section
      aria-labelledby="tools-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Tools & Working Methods"
            title="Grouped by Purpose, Not Just Listed"
            id="tools-heading"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TOOL_GROUPS.map((group, index) => (
            <Reveal key={group.id} delay={index * 90} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <li
                      key={tool}
                      className="cursor-default rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
