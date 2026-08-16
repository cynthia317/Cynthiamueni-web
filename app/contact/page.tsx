import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactReasons from "@/components/contact/ContactReasons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about occupational safety and health collaboration, software and digital systems projects, or digital communication work.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactReasons />
    </>
  );
}
