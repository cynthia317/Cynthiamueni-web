import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightArticle from "@/components/insights/InsightArticle";
import FinalCta from "@/components/home/FinalCta";
import { INSIGHTS } from "@/lib/data/insights";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return INSIGHTS.map((insight) => ({ slug: insight.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const insight = INSIGHTS.find((item) => item.id === slug);
  if (!insight) return {};

  const url = `${SITE_URL}/insights/${insight.id}`;

  return {
    title: insight.title,
    description: insight.excerpt,
    keywords: [insight.category, "Occupational Safety & Health", "EHS", SITE_NAME],
    alternates: { canonical: url },
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: insight.date,
      authors: [SITE_NAME],
      images: [{ url: insight.image, alt: insight.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.excerpt,
      images: [insight.image],
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const insight = INSIGHTS.find((item) => item.id === slug);

  if (!insight) {
    notFound();
  }

  const url = `${SITE_URL}/insights/${insight.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    image: `${SITE_URL}${insight.image}`,
    datePublished: insight.date,
    dateModified: insight.date,
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Person", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InsightArticle insight={insight} />
      <FinalCta secondaryHref="/insights" secondaryLabel="View All Insights" />
    </>
  );
}
