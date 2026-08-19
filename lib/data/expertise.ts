import { HardHat, Code2, Megaphone } from "lucide-react";
import type { ExpertiseArea } from "@/types";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";

export const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    id: "osh",
    title: "Occupational Safety & Health",
    icon: HardHat,
    summary:
      "Helping organisations identify hazards, manage risk, and build safety practices that hold up under real working conditions.",
    capabilities: [
      "Workplace safety & compliance",
      "Risk assessment",
      "OSH audits",
      "Fire safety",
      "Hazard identification",
      "Safety documentation",
    ],
    image: "/images/home/expertise-osh-inspection.webp",
    imageAlt: "Industrial manufacturing floor with robotic assembly equipment, representing a modern regulated workplace",
    badge: "Primary Focus",
  },
  {
    id: "software",
    title: "EHS Systems & Digital Solutions",
    icon: Code2,
    summary:
      "Building web applications and internal tools that turn manual, error-prone EHS processes into reliable digital systems.",
    capabilities: [
      "EHS reporting systems",
      "Inspection & audit tools",
      "Hazard tracking workflows",
      "Corrective-action systems",
      "Safety dashboards",
      "Digital record-keeping",
    ],
    image: "/images/home/expertise-software-dashboard.webp",
    imageAlt: "Laptop screen displaying a data dashboard with charts and metrics on a wooden desk",
    footnote: {
      text: "For general websites, web apps or non-EHS software work, visit HarunLucas Dev",
      href: HARUNLUCAS_DEV_URL,
      external: true,
    },
  },
  {
    id: "digital",
    title: "Digital Communication & Social Media",
    icon: Megaphone,
    summary:
      "Using digital communication, content strategy and platform management to translate professional and technical information into clear, useful content that reaches the right audiences.",
    capabilities: [
      "Social media management",
      "Content strategy",
      "Digital marketing",
      "SEO",
      "Website content",
      "Analytics & performance reporting",
    ],
    image: "/images/home/expertise-marketing-strategy.webp",
    imageAlt: "Handwritten marketing strategy note on a desk beside a notebook, pens, and a small plant",
    proof: {
      label: "Applied in Practice",
      text: "Managing social media, website content and digital platform presence for Safetec Solutions Ltd, an occupational safety and health organisation.",
      flow: [
        "Safety expertise",
        "Content planning",
        "Social media communication",
        "Website / GBP presence",
        "Performance review",
      ],
    },
  },
];
