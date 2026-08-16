import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";

export default function Introduction() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2
              id="about-heading"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
            >
              Where Safety, Technology, and Communication Meet
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              My work sits at the intersection of Occupational Safety &amp; Health, technology, and
              digital communication. I use these disciplines together to solve practical
              organisational problems — identifying risk, building the systems that manage it, and
              communicating it clearly to the people affected.
            </p>
            <ArrowLink href="/about">More about my background</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
