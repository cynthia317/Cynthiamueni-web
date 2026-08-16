import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import FinalCta from "@/components/home/FinalCta";
import { PROJECTS } from "@/lib/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.id === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectDetail project={project} />
      <FinalCta secondaryHref="/projects" secondaryLabel="View All Projects" />
    </>
  );
}
