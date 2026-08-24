import type { Metadata } from "next";
import InsightsHero from "@/components/insights/InsightsHero";
import InsightsGrid from "@/components/insights/InsightsGrid";
import InsightsTopics from "@/components/insights/InsightsTopics";
import InsightsFaq from "@/components/insights/InsightsFaq";
import FinalCta from "@/components/home/FinalCta";
import { FAQS } from "@/lib/data/faqs";
import { INSIGHTS } from "@/lib/data/insights";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const DESCRIPTION =
  "Practical articles and professional perspectives on occupational safety, EHS systems and digital communication.";

const FEATURED_INSIGHT = INSIGHTS.find((insight) => insight.featured) ?? INSIGHTS[0];

export const metadata: Metadata = {
  title: "Insights",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    title: "Insights",
    description: DESCRIPTION,
    url: `${SITE_URL}/insights`,
    siteName: SITE_NAME,
    type: "website",
    images: FEATURED_INSIGHT ? [{ url: FEATURED_INSIGHT.image, alt: FEATURED_INSIGHT.imageAlt }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights",
    description: DESCRIPTION,
    images: FEATURED_INSIGHT ? [FEATURED_INSIGHT.image] : undefined,
  },
};

export default function InsightsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.join(" "),
      },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <InsightsHero />
      <InsightsGrid />
      <InsightsTopics />
      <InsightsFaq />
      <FinalCta
        heading="Interested in EHS Systems, Workplace Safety or Digital Communication?"
        secondaryHref="/projects"
        secondaryLabel="View Projects"
      />
    </>
  );
}
