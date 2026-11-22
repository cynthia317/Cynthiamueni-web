import type { Metadata } from "next";
import ProjectsHero from "@/components/projects/ProjectsHero";
import FeaturedProjectShowcase from "@/components/projects/FeaturedProjectShowcase";
import ProjectStorySection from "@/components/projects/ProjectStorySection";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectsFinalCta from "@/components/projects/ProjectsFinalCta";
import { getProjectsByTier } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Practical EHS problems and the digital systems being developed to address them, including hazard reporting, inspections, risk assessment, corrective actions and EHS digital communication.",
};

export default async function ProjectsPage() {
  const [flagshipProjects, coreProjects, supportingProjects] = await Promise.all([
    getProjectsByTier("flagship"),
    getProjectsByTier("core"),
    getProjectsByTier("supporting"),
  ]);
  const flagshipProject = flagshipProjects[0];

  return (
    <>
      <ProjectsHero />
      {flagshipProject ? <FeaturedProjectShowcase project={flagshipProject} /> : null}
      {coreProjects.map((project, index) => (
        <ProjectStorySection
          key={project.id}
          project={project}
          number={String(index + 2).padStart(2, "0")}
          imagePosition={index % 2 === 0 ? "left" : "right"}
          tinted={index % 2 === 1}
        />
      ))}
      <ProjectsGrid projects={supportingProjects} />
      <ProjectsFinalCta />
    </>
  );
}
