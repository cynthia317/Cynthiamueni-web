import { HardHat, Code2, Megaphone, RefreshCw } from "lucide-react";
import type { JourneyStage, WorkArea } from "@/types";

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "osh",
    title: "Occupational Safety & Health",
    icon: HardHat,
    accent: "amber",
    description:
      "Grounds everything in real workplace conditions, identifying hazards, operational challenges and opportunities for improvement.",
  },
  {
    id: "technology",
    title: "Technology & Digital Systems",
    icon: Code2,
    accent: "sky",
    description:
      "Turns those findings into practical tools and systems that make safer, more efficient ways of working possible.",
  },
  {
    id: "communication",
    title: "Digital Communication",
    icon: Megaphone,
    accent: "violet",
    description:
      "Makes sure people understand, adopt and actually benefit from those solutions, not just that they exist.",
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    icon: RefreshCw,
    accent: "emerald",
    description:
      "Feeds outcomes and feedback back into the process, so safety practice and the systems supporting it keep getting better.",
  },
];

export const WORK_AREAS: WorkArea[] = [
  {
    id: "osh",
    title: "Occupational Safety & Health",
    icon: HardHat,
    accent: "amber",
    items: [
      "Workplace Safety",
      "Risk Assessment",
      "Safety Audits",
      "Fire Safety",
      "Safety Documentation",
      "Workplace Compliance",
    ],
  },
  {
    id: "software",
    title: "EHS Systems & Digital Solutions",
    icon: Code2,
    accent: "sky",
    items: ["EHS Reporting Systems", "Inspection & Audit Tools", "Hazard Tracking Workflows", "Safety Dashboards"],
  },
  {
    id: "communication",
    title: "Digital Communication",
    icon: Megaphone,
    accent: "violet",
    items: ["Social Media Management", "Content Strategy", "SEO", "Website Content", "Digital Marketing", "Analytics"],
  },
];
