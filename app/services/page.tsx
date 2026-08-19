import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Occupational Safety & Health consulting, software development and digital communication services from Cynthia Mueni, for organisations that need practical safety, systems or communication support.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <FinalCta
        heading="Have a Safety, Systems or Communication Need?"
        description={
          <>
            Open to professional opportunities, OSH consulting, systems projects and digital
            communication work.
          </>
        }
        secondaryHref="/expertise"
        secondaryLabel="View My Expertise"
      />
    </>
  );
}
