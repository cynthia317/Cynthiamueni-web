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
  | "EHS Systems"
  | "EHS Systems × Digital Communication"
  | "Software / Systems"
  | "Digital Marketing"
  | "Research / Professional Work";

/** Honest build state — never implied as more finished than it is. */
export type ProjectStatus = "Live" | "In Development" | "Prototype" | "Concept";

/**
 * Where a project sits in the portfolio's storytelling structure:
 * "flagship" — the single lead EHS project, full editorial showcase.
 * "core" — the other major EHS/communication projects, each gets its own editorial section.
 * "supporting" — genuinely relevant but secondary work, shown as compact cards.
 * "referred" — general software/web work kept in the data (so its detail page and any
 *   existing links keep working) but not featured on the index — visitors are pointed to
 *   HarunLucas Dev instead.
 */
export type ProjectTier = "flagship" | "core" | "supporting" | "referred";

export interface ProjectCapability {
  label: string;
  /** True when this capability is designed-for but not yet built. */
  planned?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tier: ProjectTier;
  /**
   * Overview paragraph — opens by naming the real workplace problem in prose, then moves
   * into the solution. Used on cards and as the detail-page lead paragraph. No separate
   * "question" or "why it matters" fields — that framing is woven directly into this text
   * instead of being displayed as its own labelled block.
   */
  description: string;
  /** Short step labels for a simple process diagram, e.g. ["Hazard", "Assess", "Assign", "Close"]. */
  workflow?: string[];
  capabilities?: ProjectCapability[];
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
  /** Faq ids (from lib/data/faqs.ts) this project directly answers. */
  relatedFaqIds?: string[];
  /** Insight ids (from lib/data/insights.ts) that expand on this project's problem space. */
  relatedInsightIds?: string[];
}

export interface InsightContentBlock {
  type: "paragraph" | "heading" | "list" | "linkParagraph";
  text?: string;
  items?: string[];
  /** linkParagraph only — rendered as "{text} {linkLabel}." with linkLabel as the anchor. */
  linkLabel?: string;
  linkHref?: string;
}

export interface Insight {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
  image: string;
  imageAlt: string;
  /** Pins this article as the single featured article on the Insights index. */
  featured?: boolean;
  /** Full article body for /insights/[slug]. Omitted while an article is still "Coming Soon". */
  content?: InsightContentBlock[];
}

export interface Faq {
  id: string;
  question: string;
  /** 1-4 short paragraphs. */
  answer: string[];
  category?: string;
  /** Only set once the linked article or route genuinely exists — never a placeholder link. */
  relatedLabel?: string;
  relatedHref?: string;
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
