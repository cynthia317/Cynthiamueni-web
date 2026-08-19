import { HardHat, Code2, Megaphone } from "lucide-react";
import type { Service } from "@/types";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";

export const SERVICES: Service[] = [
  {
    id: "osh",
    title: "Occupational Safety & Health Consulting",
    icon: HardHat,
    summary:
      "Practical, evidence-based support to help organisations identify hazards, manage risk and build safety practices that hold up under real working conditions.",
    deliverables: [
      "Workplace hazard identification & risk assessments",
      "OSH compliance audits",
      "HSE auditing",
      "Safety documentation & policy support",
      "Fire safety reviews",
    ],
    idealFor:
      "Organisations that need a practical look at workplace safety, not just a compliance checkbox.",
  },
  {
    id: "software",
    title: "EHS Digital Systems Development",
    icon: Code2,
    summary:
      "Web applications and internal tools built specifically to replace manual, error-prone EHS processes, hazard reporting, inspections, audits and corrective-action tracking, with reliable digital systems.",
    deliverables: [
      "EHS reporting & workflow systems",
      "Inspection & audit tools",
      "Hazard & corrective-action tracking",
      "Safety dashboards",
    ],
    idealFor: "Teams replacing paper-based or spreadsheet EHS processes with something reliable and easy to use.",
    footnote: {
      text: "For general websites, web apps or non-EHS software work, visit HarunLucas Dev",
      href: HARUNLUCAS_DEV_URL,
      external: true,
    },
  },
  {
    id: "digital",
    title: "Digital Communication & Social Media Management",
    icon: Megaphone,
    summary:
      "Content strategy and platform management that translate professional and technical work, safety included, into clear communication that reaches the right audience.",
    deliverables: [
      "Social media management",
      "Content strategy & planning",
      "Website content",
      "SEO & analytics reporting",
    ],
    idealFor:
      "Organisations and professionals doing solid work, in safety or any other field, that isn't communicated clearly online.",
  },
];
