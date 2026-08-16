import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import InsightCard from "@/components/ui/InsightCard";
import { INSIGHTS } from "@/lib/data/insights";

export default function InsightsSection() {
  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
      className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Insights"
              title="Notes on Safety, Systems & Digital Practice"
              description="Short, practical articles on occupational safety, technology, and digital communication."
              id="insights-heading"
            />
            <ArrowLink href="/insights" className="shrink-0">
              View All Insights
            </ArrowLink>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGHTS.map((insight, index) => (
            <Reveal key={insight.id} delay={index * 100}>
              <InsightCard insight={insight} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
