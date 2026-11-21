import type { Metadata } from "next";
import InsightsHero from "@/components/insights/InsightsHero";
import InsightsGrid from "@/components/insights/InsightsGrid";
import InsightsTopics from "@/components/insights/InsightsTopics";
import InsightsFaq from "@/components/insights/InsightsFaq";
import FinalCta from "@/components/home/FinalCta";
import { getFaqs } from "@/lib/content/faqs";
import { getFeaturedInsight, getInsightSummaries } from "@/lib/content/insights";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const DESCRIPTION =
  "Practical articles and professional perspectives on occupational safety, EHS systems and digital communication.";

export async function generateMetadata(): Promise<Metadata> {
  const featuredInsight = await getFeaturedInsight();

  return {
    title: "Insights",
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/insights` },
    openGraph: {
      title: "Insights",
      description: DESCRIPTION,
      url: `${SITE_URL}/insights`,
      siteName: SITE_NAME,
      type: "website",
      images: featuredInsight ? [{ url: featuredInsight.image, alt: featuredInsight.imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: "Insights",
      description: DESCRIPTION,
      images: featuredInsight ? [featuredInsight.image] : undefined,
    },
  };
}

export default async function InsightsPage() {
  const [insights, faqs] = await Promise.all([getInsightSummaries(), getFaqs()]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
      <InsightsGrid insights={insights} />
      <InsightsTopics />
      <InsightsFaq faqs={faqs} />
      <FinalCta
        heading="Interested in EHS Systems, Workplace Safety or Digital Communication?"
        secondaryHref="/projects"
        secondaryLabel="View Projects"
      />
    </>
  );
}
