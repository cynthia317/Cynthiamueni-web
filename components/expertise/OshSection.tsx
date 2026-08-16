import { AlertTriangle, ClipboardCheck, FileText, Radio } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";

const CAPABILITY_GROUPS = [
  {
    id: "risk",
    title: "Risk & Hazard Management",
    icon: AlertTriangle,
    items: ["Hazard identification", "Risk assessment", "Incident / near-miss awareness"],
  },
  {
    id: "audits",
    title: "Audits & Compliance",
    icon: ClipboardCheck,
    items: ["OSH audits", "Workplace inspections", "Workplace compliance"],
  },
  {
    id: "systems",
    title: "Safety Systems & Documentation",
    icon: FileText,
    items: ["Safety documentation", "Safety management systems", "Corrective action follow-up"],
  },
  {
    id: "communication",
    title: "Workplace Safety & Communication",
    icon: Radio,
    items: ["Workplace safety", "Fire safety", "Safety communication"],
  },
];

export default function OshSection() {
  return (
    <section
      id="osh"
      aria-labelledby="osh-heading"
      className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Primary Discipline"
            title="Occupational Safety & Health"
            description="My core professional foundation. I focus on identifying hazards, assessing risk and supporting the safety systems and documentation that keep organisations compliant and their people safer — grounded in real working conditions, not paperwork for its own sake."
            id="osh-heading"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITY_GROUPS.map((group, index) => {
            const Icon = group.icon;
            return (
              <Reveal key={group.id} delay={index * 90} className="h-full">
                <div className="group flex h-full flex-col gap-4 rounded-2xl border border-amber-200/70 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md motion-reduce:transition-colors motion-reduce:hover:translate-y-0 dark:border-amber-500/20 dark:bg-slate-900 dark:hover:border-amber-500/50">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 text-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:bg-amber-500">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
