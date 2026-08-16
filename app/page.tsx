import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import ConnectionSection from "@/components/home/ConnectionSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ImpactStrip from "@/components/home/ImpactStrip";
import ReferralSection from "@/components/home/ReferralSection";
import InsightsSection from "@/components/home/InsightsSection";
import FinalCta from "@/components/home/FinalCta";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <ExpertiseSection />
      <ConnectionSection />
      <ProjectsSection />
      <ImpactStrip />
      <ReferralSection />
      <InsightsSection />
      <FinalCta />
    </>
  );
}
