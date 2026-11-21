// Insight (blog article) content access.
//
// Source: static data in `lib/data/insights.ts`. Public pages read insights only through
// these functions, so a future database-backed implementation replaces the function bodies
// here without changing any call site. The functions are async for that reason.
//
// An insight's slug is its `id` and the last segment of its URL (`/insights/{slug}`).
// "Coming soon" entries have `href: "#"`: they're listed but not linked, not statically
// generated and not included in the sitemap. Slugs of published insights must never change.
import { INSIGHTS } from "@/lib/data/insights";
import type { Insight, InsightSummary } from "./types";

/** True when the insight has a real article page (not a "coming soon" placeholder). */
export function isPublishedInsight(insight: Pick<Insight, "href">): boolean {
  return insight.href !== "#";
}

function toSummary(insight: Insight): InsightSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- drop the article body
  const { content, ...summary } = insight;
  return summary;
}

/** Every listed insight (published and coming soon) without article bodies, in display order. */
export async function getInsightSummaries(): Promise<InsightSummary[]> {
  return INSIGHTS.map(toSummary);
}

/** Published insights without article bodies, in display order. */
export async function getPublishedInsightSummaries(): Promise<InsightSummary[]> {
  return INSIGHTS.filter(isPublishedInsight).map(toSummary);
}

/** Slugs of published insights, used for static generation. */
export async function getPublishedInsightSlugs(): Promise<string[]> {
  return INSIGHTS.filter(isPublishedInsight).map((insight) => insight.id);
}

/** A full insight (including its article body) by slug, or `null`. */
export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  return INSIGHTS.find((insight) => insight.id === slug) ?? null;
}

/** The pinned featured insight, falling back to the first listed insight; `null` if none exist. */
export async function getFeaturedInsight(): Promise<InsightSummary | null> {
  const insight = INSIGHTS.find((item) => item.featured) ?? INSIGHTS[0];
  return insight ? toSummary(insight) : null;
}

/**
 * Up to `max` other published insights for an article's "More Insights" list: same category
 * first, then the rest, each group in display order.
 */
export async function getRelatedInsights(
  current: Pick<Insight, "id" | "category">,
  max = 3
): Promise<InsightSummary[]> {
  const published = INSIGHTS.filter((item) => item.id !== current.id && isPublishedInsight(item));
  const sameCategory = published.filter((item) => item.category === current.category);
  const rest = published.filter((item) => item.category !== current.category);
  return [...sameCategory, ...rest].slice(0, max).map(toSummary);
}
