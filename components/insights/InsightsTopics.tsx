import { Flame, HardHat, LayoutDashboard, Megaphone, ShieldAlert } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

const TOPICS = [
  {
    id: "osh",
    title: "Occupational Safety & Health",
    description: "Workplace safety, compliance, inspections, hazard identification and practical OSH issues.",
    icon: HardHat,
  },
  {
    id: "ehs-systems",
    title: "EHS Systems",
    description:
      "Digital inspections, safety management systems, reporting, dashboards, corrective actions and EHS workflows.",
    icon: LayoutDashboard,
  },
  {
    id: "risk-hazard",
    title: "Risk & Hazard Management",
    description: "Risk assessment, hazard identification, controls and continuous improvement.",
    icon: ShieldAlert,
  },
  {
    id: "fire-safety",
    title: "Fire Safety",
    description: "Fire preparedness, emergency planning, workplace fire risks and compliance.",
    icon: Flame,
  },
  {
    id: "digital-communication",
    title: "Digital Communication",
    description: "Safety communication, professional content, social media, digital presence and reporting.",
    icon: Megaphone,
  },
];

export default function InsightsTopics() {
  return (
    <section aria-labelledby="topics-heading" className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal startOpacity={0.2} className="flex flex-col gap-3 lg:sticky lg:top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Topics I Write About
              </span>
              <h2
                id="topics-heading"
                className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50"
              >
                Where practical safety work meets digital systems and communication
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {TOPICS.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <Reveal key={topic.id} delay={index * 60} startOpacity={0.2}>
                    <div className="group flex items-start gap-5 p-6 transition-colors duration-300 [@media(hover:hover)]:hover:bg-amber-50/40 dark:[@media(hover:hover)]:hover:bg-slate-900/40 sm:items-center">
                      <span className="w-6 shrink-0 text-xs font-semibold text-slate-300 dark:text-slate-700">
                        0{index + 1}
                      </span>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition-colors duration-300 dark:bg-amber-500/10 dark:text-amber-400">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{topic.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
