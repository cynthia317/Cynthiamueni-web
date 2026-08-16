import type { Metadata } from "next";
import InsightsHero from "@/components/insights/InsightsHero";
import InsightsGrid from "@/components/insights/InsightsGrid";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Short, practical articles on occupational safety, technology, and digital communication.",
};

export default function InsightsPage() {
  return (
    <>
      <InsightsHero />
      <InsightsGrid />
      <FinalCta secondaryHref="/projects" secondaryLabel="View My Projects" />
    </>
  );
}
