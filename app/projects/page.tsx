import type { Metadata } from "next";
import ProjectsHero from "@/components/projects/ProjectsHero";
import FeaturedProjectShowcase from "@/components/projects/FeaturedProjectShowcase";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectsFinalCta from "@/components/projects/ProjectsFinalCta";
import { PROJECTS } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A working index of projects across Occupational Safety & Health, software development and digital systems, and digital communication.",
};

export default function ProjectsPage() {
  const featuredProject = PROJECTS.find((project) => project.featured);
  const otherProjects = PROJECTS.filter((project) => !project.featured);

  return (
    <>
      <ProjectsHero />
      {featuredProject ? <FeaturedProjectShowcase project={featuredProject} /> : null}
      <ProjectsGrid projects={otherProjects} />
      <ProjectsFinalCta />
    </>
  );
}
