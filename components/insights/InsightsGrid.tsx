import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import InsightCard from "@/components/ui/InsightCard";
import { INSIGHTS } from "@/lib/data/insights";

export default function InsightsGrid() {
  return (
    <section aria-labelledby="insights-index-heading" className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <h2
          id="insights-index-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
        >
          All Articles
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGHTS.map((insight, index) => (
            <Reveal key={insight.id} delay={(index % 3) * 100}>
              <InsightCard insight={insight} />
            </Reveal>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          More articles coming soon.
        </p>
      </Container>
    </section>
  );
}
