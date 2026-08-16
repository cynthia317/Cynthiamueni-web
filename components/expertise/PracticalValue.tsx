import { MessageSquare, ShieldCheck, TrendingUp, Workflow } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

const VALUE_ITEMS = [
  {
    id: "safer-workplaces",
    title: "Safer Workplaces",
    description: "Identify hazards, improve safety systems and support compliance.",
    icon: ShieldCheck,
  },
  {
    id: "smarter-processes",
    title: "Smarter Digital Processes",
    description: "Transform manual or fragmented processes into structured digital workflows.",
    icon: Workflow,
  },
  {
    id: "better-communication",
    title: "Better Communication",
    description: "Translate technical information into understandable content.",
    icon: MessageSquare,
  },
  {
    id: "continuous-improvement",
    title: "Continuous Improvement",
    description: "Use observations, data and feedback to improve processes and performance.",
    icon: TrendingUp,
  },
];

export default function PracticalValue() {
  return (
    <section
      aria-label="What I can contribute"
      className="border-t border-slate-800 bg-slate-900 py-16 dark:border-slate-900 dark:bg-black sm:py-20"
    >
      <Container>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Reveal delay={index * 100}>
                  <div className="flex flex-col gap-3">
                    <Icon className="h-6 w-6 text-amber-400" aria-hidden />
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
