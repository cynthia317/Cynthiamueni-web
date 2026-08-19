import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutIntroduction from "@/components/about/AboutIntroduction";
import ProfessionalJourney from "@/components/about/ProfessionalJourney";
import ExperienceHighlight from "@/components/about/ExperienceHighlight";
import WorkAreas from "@/components/about/WorkAreas";
import ApproachSection from "@/components/about/ApproachSection";
import ValuesSection from "@/components/about/ValuesSection";
import ToolsSection from "@/components/about/ToolsSection";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: { absolute: "About Cynthia Mueni | Occupational Safety & Health" },
  description:
    "Learn about Cynthia Mueni's Occupational Safety & Health work, practical EHS systems approach and experience in professional digital communication.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntroduction />
      <ProfessionalJourney />
      <ExperienceHighlight />
      <WorkAreas />
      <ApproachSection />
      <ValuesSection />
      <ToolsSection />
      <FinalCta
        heading="Let's Connect"
        description={
          <>
            Open to collaboration, professional opportunities, workplace safety projects,
            technology projects, digital communication projects, and networking.
          </>
        }
        secondaryHref="/projects"
        secondaryLabel="View My Projects"
      />
    </>
  );
}
