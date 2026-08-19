"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import InsightCard from "@/components/ui/InsightCard";
import InsightsFeatured from "@/components/insights/InsightsFeatured";
import { INSIGHTS } from "@/lib/data/insights";

export default function InsightsGrid() {
  const featured = useMemo(() => INSIGHTS.find((insight) => insight.featured) ?? INSIGHTS[0], []);
  const rest = useMemo(() => INSIGHTS.filter((insight) => insight.id !== featured.id), [featured]);

  // Derived from the articles that can actually be filtered to (the pinned
  // featured article stays visible regardless of filter), so no filter pill
  // ever points at an empty result set.
  const categories = useMemo(() => ["All", ...new Set(rest.map((insight) => insight.category))], [rest]);

  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () => (activeFilter === "All" ? rest : rest.filter((insight) => insight.category === activeFilter)),
    [rest, activeFilter]
  );

  return (
    <>
      <section className="pb-8 sm:pb-10">
        <Container>
          <Reveal startOpacity={0.2}>
            <div role="group" aria-label="Filter insights by topic" className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = category === activeFilter;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(category)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </section>

      <InsightsFeatured insight={featured} />

      <section aria-labelledby="latest-insights-heading" className="py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <h2
            id="latest-insights-heading"
            className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Latest Insights
          </h2>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {filtered.map((insight, index) => (
                <div key={insight.id} className={index === 0 ? "lg:col-span-7" : "lg:col-span-5"}>
                  <InsightCard insight={insight} size={index === 0 ? "default" : "compact"} delay={index * 100} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              No articles in this topic yet.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
