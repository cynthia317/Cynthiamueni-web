import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightArticle from "@/components/insights/InsightArticle";
import FinalCta from "@/components/home/FinalCta";
import { INSIGHTS } from "@/lib/data/insights";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  // "Coming Soon" entries (href === "#") aren't linked to anywhere and have no article body
  // yet, so they're not pre-rendered — dynamicParams still lets a direct hit render (and
  // correctly noindex) rather than a hard 404, but no thin page ships at build time.
  return INSIGHTS.filter((insight) => insight.href !== "#").map((insight) => ({ slug: insight.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const insight = INSIGHTS.find((item) => item.id === slug);
  if (!insight) return {};

  const url = `${SITE_URL}/insights/${insight.id}`;
  const isPublished = insight.href !== "#";
  const metaTitle = insight.seoTitle ?? insight.title;

  return {
    title: metaTitle,
    description: insight.excerpt,
    keywords: insight.keywords ?? [insight.category, "Occupational Safety & Health", "EHS", SITE_NAME],
    alternates: { canonical: url },
    // Unpublished ("Coming Soon") entries get a real static route so their card can link
    // somewhere later, but should never be indexed while there's no article body yet.
    robots: isPublished ? undefined : { index: false, follow: true },
    openGraph: {
      title: metaTitle,
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
      title: metaTitle,
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
    articleSection: insight.category,
    keywords: (insight.keywords ?? [insight.category, "Occupational Safety & Health", "EHS", SITE_NAME]).join(", "),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
      { "@type": "ListItem", position: 3, name: insight.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <InsightArticle insight={insight} />
      <FinalCta secondaryHref="/insights" secondaryLabel="View All Insights" />
    </>
  );
}
