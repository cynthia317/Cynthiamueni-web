import type { Project } from "@/types";

// TODO: replace with real projects. Structure is ready — swap content per item.
export const PROJECTS: Project[] = [
  {
    id: "safety-management-system",
    title: "Safety Management System",
    category: "Occupational Safety & Health × Digital Systems",
    description:
      "A digital Occupational Safety & Health platform currently in development, designed to bring hazard reporting, workplace inspections, risk records and corrective actions into one structured system — with basic visibility into safety status over time.",
    tools: ["Hazard Reporting", "Inspections", "Risk Management", "Corrective Actions", "Safety Dashboard"],
    visual: "mockup",
    href: "/projects/safety-management-system",
    featured: true,
  },
  {
    id: "workplace-risk-assessment",
    title: "Workplace Risk Assessment Framework",
    category: "Occupational Safety & Health",
    description:
      "A structured hazard identification and risk assessment process built for a small operations team, covering documentation and follow-up actions.",
    tools: ["Risk Assessment", "OSH Documentation"],
    image: "/images/projects/osh-ppe-welding.webp",
    imageAlt: "Welder in protective gear working with sparks flying, representing hands-on hazard exposure",
    href: "/projects/workplace-risk-assessment",
  },
  {
    id: "safety-audit-toolkit",
    title: "Fire & Safety Audit Toolkit",
    category: "Occupational Safety & Health",
    description:
      "A standardised checklist and reporting toolkit for conducting fire safety and general workplace compliance audits.",
    tools: ["Fire Safety", "Compliance"],
    image: "/images/projects/osh-warehouse-compliance.webp",
    imageAlt: "Rows of shelving in an industrial warehouse used for compliance and storage audits",
    href: "/projects/safety-audit-toolkit",
  },
  {
    id: "internal-systems-dashboard",
    title: "Internal Operations Dashboard",
    category: "Software / Systems",
    description:
      "A lightweight internal web application for tracking day-to-day operational tasks, built with a focus on clarity and speed.",
    tools: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/images/projects/software-dashboard-review.webp",
    imageAlt: "Dark-themed analytics dashboard on a laptop screen showing usage charts",
    href: "/projects/internal-systems-dashboard",
  },
  {
    id: "safety-reporting-tool",
    title: "Digital Safety Reporting Tool",
    category: "Software / Systems",
    description:
      "A simple web tool that lets field teams log incidents and hazards digitally, replacing a paper-based reporting process.",
    tools: ["React", "Automation"],
    image: "/images/projects/software-team-workspace.webp",
    imageAlt: "Overhead view of a shared workspace with multiple laptops and devices in use",
    href: "/projects/safety-reporting-tool",
  },
  {
    id: "safetec-digital-presence",
    title: "Safetec Solutions — Digital Presence & Social Media Management",
    category: "Occupational Safety & Health × Digital Communication",
    description:
      "Ongoing digital communication and social media management for Safetec Solutions Ltd, an occupational safety and health organisation — connecting OSH expertise with a clear, consistent digital presence across social platforms, website content and Google Business Profile.",
    tools: [
      "LinkedIn Management",
      "Google Business Profile",
      "Website Content",
      "Content Planning",
      "Performance Monitoring",
    ],
    visual: "social",
    href: "/projects/safetec-digital-presence",
  },
  {
    id: "brand-content-strategy",
    title: "Professional Brand Content Strategy",
    category: "Digital Marketing",
    description:
      "A content and social media plan built to communicate professional safety and technical work clearly to a wider audience.",
    tools: ["Content Strategy", "SEO"],
    image: "/images/projects/marketing-strategy-flatlay.webp",
    imageAlt: "Smartphone displaying a folder of social media apps on its home screen",
    href: "/projects/brand-content-strategy",
  },
  {
    id: "osh-research-brief",
    title: "Workplace Safety Research Brief",
    category: "Research / Professional Work",
    description:
      "A short-form research brief examining common gaps between documented safety policy and everyday workplace practice.",
    tools: ["Research", "Analysis"],
    image: "/images/projects/research-data-analysis.webp",
    imageAlt: "Overhead view of financial documents and a calculator laid out for review",
    href: "/projects/osh-research-brief",
  },
];
