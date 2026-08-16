import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/lib/data/projects";

export default function ProjectsSection() {
  const featuredProject = PROJECTS.find((project) => project.featured);
  const otherProjects = PROJECTS.filter((project) => !project.featured);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured Work"
              title="Projects Across Safety, Systems & Digital"
              description="A selection of work spanning occupational safety practice, digital systems, and communication — with more added as new work is completed."
              id="work-heading"
            />
            <ArrowLink href="/projects" className="shrink-0">
              View All Projects
            </ArrowLink>
          </div>
        </Reveal>

        {featuredProject ? (
          <Reveal>
            <ProjectCard project={featuredProject} />
          </Reveal>
        ) : null}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
