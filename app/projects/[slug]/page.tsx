import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import FinalCta from "@/components/home/FinalCta";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content/projects";
import { getFaqsByIds } from "@/lib/content/faqs";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedFaqs = await getFaqsByIds(project.relatedFaqIds ?? []);

  return (
    <>
      <ProjectDetail project={project} relatedFaqs={relatedFaqs} />
      <FinalCta secondaryHref="/projects" secondaryLabel="View All Projects" />
    </>
  );
}
