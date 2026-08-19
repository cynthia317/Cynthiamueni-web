import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

export default function AboutIntroduction() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2
              id="intro-heading"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
            >
              One Problem-Solving Mindset, Three Disciplines
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              My core professional foundation is Occupational Safety &amp; Health: understanding
              how people, processes and environments interact, and where that interaction breaks
              down into risk. Software development and digital communication grew out of that same
              foundation. They are practical extensions of the same problem-solving mindset, not
              separate careers running in parallel.
            </p>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Identifying a safety risk is only useful if something is done about it. Technology
              gives me a way to build the systems and tools that manage that risk properly.
              Digital communication makes sure the people affected actually understand it and act
              on it. Together, these disciplines let me take a problem from &ldquo;this is a
              risk&rdquo; to &ldquo;this is a system, and here is how to use it.&rdquo;
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
