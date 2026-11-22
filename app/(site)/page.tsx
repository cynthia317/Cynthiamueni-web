import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import ConnectionSection from "@/components/home/ConnectionSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ReferralSection from "@/components/home/ReferralSection";
import InsightsSection from "@/components/home/InsightsSection";
import FinalCta from "@/components/home/FinalCta";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  // `absolute` keeps the root layout's "%s | Cynthia Mueni" template off the home page title.
  // (Before the (site) route-group move, the home page shared the root layout's segment,
  // where Next.js doesn't apply the template; inside (site) it would.)
  title: { absolute: SITE_TITLE },
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
      <ReferralSection />
      <InsightsSection />
      <FinalCta />
    </>
  );
}
