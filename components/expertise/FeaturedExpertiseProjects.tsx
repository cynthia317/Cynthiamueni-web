import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/lib/data/projects";

const FEATURED_IDS = [
  "safety-management-system",
  "workplace-risk-assessment",
  "safetec-digital-presence",
  "safety-audit-toolkit",
];

export default function FeaturedExpertiseProjects() {
  const projects = FEATURED_IDS.map((id) => PROJECTS.find((project) => project.id === id)).filter(
    (project): project is (typeof PROJECTS)[number] => Boolean(project)
  );
  const featuredProject = projects.find((project) => project.tier === "flagship");
  const otherProjects = projects.filter((project) => project.tier !== "flagship");

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Expertise in Practice"
              title="Featured Expertise Projects"
              description="A selection of projects demonstrating these disciplines applied together, not in isolation."
              id="featured-projects-heading"
            />
            <ArrowLink href="/projects" className="shrink-0">
              Explore All Projects
            </ArrowLink>
          </div>
        </Reveal>

        {featuredProject ? (
          <Reveal delay={80}>
            <ProjectCard project={featuredProject} />
          </Reveal>
        ) : null}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <Reveal key={project.id} delay={140 + index * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
