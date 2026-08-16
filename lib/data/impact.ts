import { ShieldCheck, Cpu, Signal, MessageSquare } from "lucide-react";
import type { ImpactItem } from "@/types";

export const IMPACT_ITEMS: ImpactItem[] = [
  {
    id: "safer-workplaces",
    title: "Safer Workplaces",
    description: "Practical risk assessment and safety systems that hold up in real conditions.",
    icon: ShieldCheck,
  },
  {
    id: "smarter-systems",
    title: "Smarter Systems",
    description: "Digital tools that replace manual processes with something reliable and simple.",
    icon: Cpu,
  },
  {
    id: "stronger-presence",
    title: "Stronger Digital Presence",
    description: "Content and social strategy that puts professional work in front of the right people.",
    icon: Signal,
  },
  {
    id: "clearer-communication",
    title: "Clearer Communication",
    description: "Safety and technical information explained in a way people actually act on.",
    icon: MessageSquare,
  },
];
