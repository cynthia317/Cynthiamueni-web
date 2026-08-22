import type { Metadata } from "next";
import ExpertiseHero from "@/components/expertise/ExpertiseHero";
import ExpertiseOverview from "@/components/expertise/ExpertiseOverview";
import OshSection from "@/components/expertise/OshSection";
import SafetyDigitalBridge from "@/components/expertise/SafetyDigitalBridge";
import SoftwareSection from "@/components/expertise/SoftwareSection";
import CommunicationSection from "@/components/expertise/CommunicationSection";
import SafetecExample from "@/components/expertise/SafetecExample";
import IntegratedProcess from "@/components/expertise/IntegratedProcess";
import ExpertiseToolsSection from "@/components/expertise/ExpertiseToolsSection";
import PracticalValue from "@/components/expertise/PracticalValue";
import FeaturedExpertiseProjects from "@/components/expertise/FeaturedExpertiseProjects";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Expertise",
  description:
    "In-depth look at Cynthia Mueni's expertise across Occupational Safety & Health, EHS systems and digital communication, and how they connect.",
};

export default function ExpertisePage() {
  return (
    <>
      <ExpertiseHero />
      <ExpertiseOverview />
      <OshSection />
      <SafetyDigitalBridge />
      <SoftwareSection />
      <CommunicationSection />
      <SafetecExample />
      <IntegratedProcess />
      <ExpertiseToolsSection />
      <PracticalValue />
      <FeaturedExpertiseProjects />
      <FinalCta
        heading="Have a Challenge That Could Benefit From Safety, Technology or Better Communication?"
        description={
          <>
            Open to professional opportunities, OSH collaboration, technology projects, research,
            digital communication work, and networking.
          </>
        }
        secondaryHref="/projects"
        secondaryLabel="View My Work"
      />
    </>
  );
}
