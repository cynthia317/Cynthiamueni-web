import { describe, expect, it } from "vitest";
import { INSIGHTS } from "@/lib/data/insights";
import {
  getFeaturedInsight,
  getInsightBySlug,
  getInsightSummaries,
  getPublishedInsightSlugs,
  getPublishedInsightSummaries,
  getRelatedInsights,
  isPublishedInsight,
} from "@/lib/content/insights";
import type { Insight } from "@/types";

// Slugs are public URLs (/insights/{slug}); this list must only ever grow.
const PUBLISHED_INSIGHT_SLUGS = [
  "digital-safety-management-systems",
  "how-digital-tools-can-improve-workplace-safety-management",
  "how-to-improve-safety-compliance-in-the-workplace",
  "why-ppe-alone-does-not-make-workplace-safe",
  "safety-inspections-should-lead-to-action",
  "what-is-a-safety-management-system",
  "risk-assessment-basics",
  "digital-tools-for-safety-teams",
  "communicating-safety-online",
];

const withoutContent = (insight: Insight) => {
  const copy: Partial<Insight> = { ...insight };
  delete copy.content;
  return copy;
};

// The pre-refactor implementation from components/insights/InsightArticle.tsx, kept here
// to prove the content-layer version selects exactly the same articles.
function legacyRelated(current: Insight, max = 3) {
  const published = INSIGHTS.filter((item) => item.id !== current.id && item.href !== "#");
  const sameCategory = published.filter((item) => item.category === current.category);
  const rest = published.filter((item) => item.category !== current.category);
  return [...sameCategory, ...rest].slice(0, max);
}

describe("lib/content/insights", () => {
  it("lists every insight in display order without article bodies", async () => {
    const summaries = await getInsightSummaries();
    expect(summaries).toEqual(INSIGHTS.map(withoutContent));
    expect(summaries.every((summary) => !("content" in summary))).toBe(true);
  });

  it("does not mutate the source insights when building summaries", async () => {
    await getInsightSummaries();
    expect(INSIGHTS.every((insight) => Array.isArray(insight.content))).toBe(true);
  });

  it("preserves every published slug and its URL", async () => {
    expect(await getPublishedInsightSlugs()).toEqual(PUBLISHED_INSIGHT_SLUGS);
    for (const insight of await getPublishedInsightSummaries()) {
      expect(insight.href).toBe(`/insights/${insight.id}`);
    }
  });

  it("treats href '#' as a coming-soon placeholder", () => {
    expect(isPublishedInsight({ href: "#" })).toBe(false);
    expect(isPublishedInsight({ href: "/insights/x" })).toBe(true);
  });

  it("returns the full insight including its article body by slug, or null", async () => {
    const insight = await getInsightBySlug("risk-assessment-basics");
    expect(insight).toBe(INSIGHTS.find((item) => item.id === "risk-assessment-basics"));
    expect(insight?.content?.length).toBeGreaterThan(0);
    expect(await getInsightBySlug("does-not-exist")).toBeNull();
  });

  it("returns the pinned featured insight", async () => {
    const pinned = INSIGHTS.find((insight) => insight.featured) ?? INSIGHTS[0];
    expect(await getFeaturedInsight()).toEqual(withoutContent(pinned));
  });

  it("selects the same related insights as the previous inline implementation, for every article", async () => {
    for (const insight of INSIGHTS) {
      const related = await getRelatedInsights(insight);
      expect(related).toEqual(legacyRelated(insight).map(withoutContent));
    }
  });
});
