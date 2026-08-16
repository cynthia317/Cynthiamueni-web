import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export type PillarId = "osh" | "software" | "digital";

export interface ExpertiseFootnote {
  text: string;
  href: string;
  external?: boolean;
}

export interface ExpertiseProof {
  label: string;
  text: string;
  flow?: string[];
}

export interface ExpertiseArea {
  id: PillarId;
  title: string;
  icon: LucideIcon;
  summary: string;
  capabilities: string[];
  image: string;
  imageAlt: string;
  badge?: string;
  footnote?: ExpertiseFootnote;
  proof?: ExpertiseProof;
}

export interface ConnectionStep {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export type ProjectCategory =
  | "Occupational Safety & Health"
  | "Occupational Safety & Health × Digital Systems"
  | "Occupational Safety & Health × Digital Communication"
  | "Software / Systems"
  | "Digital Marketing"
  | "Research / Professional Work";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tools?: string[];
  image?: string;
  imageAlt?: string;
  /**
   * Renders an illustrative visual instead of a photo when no real screenshot exists yet.
   * "mockup" — a concept product UI, e.g. for in-development software.
   * "social" — a digital/social-presence preview, e.g. for ongoing communications work.
   */
  visual?: "mockup" | "social";
  href: string;
  featured?: boolean;
}

export interface ImpactItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Insight {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
}

export type AccentColor = "amber" | "sky" | "violet" | "emerald";

export interface JourneyStage {
  id: string;
  title: string;
  icon: LucideIcon;
  accent: AccentColor;
  description: string;
}

export interface WorkArea {
  id: string;
  title: string;
  icon: LucideIcon;
  accent: AccentColor;
  items: string[];
}
