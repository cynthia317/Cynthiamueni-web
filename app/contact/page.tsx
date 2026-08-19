import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactSocial from "@/components/contact/ContactSocial";
import ContactFaq from "@/components/contact/ContactFaq";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about Occupational Safety & Health collaboration, EHS systems or digital communication work. Based in Nairobi, Kenya.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSocial />
      <ContactFaq />
      <FinalCta
        heading="Start a Conversation That Leads to Better Workplaces."
        description="Whether it's workplace safety, an EHS system idea, digital communication work, or professional collaboration — I'd like to hear about it."
        primaryHref="#contact-form"
        primaryLabel="Send a Message"
        secondaryHref="/projects"
        secondaryLabel="View My Work"
      />
    </>
  );
}
