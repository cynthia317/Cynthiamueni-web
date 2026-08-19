import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import Button from "@/components/ui/Button";
import { CONTACT_EMAIL, HARUNLUCAS_DEV_URL } from "@/lib/constants";

export default function ProjectsFinalCta() {
  return (
    <section id="contact" aria-labelledby="projects-cta-heading" className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
            <h2
              id="projects-cta-heading"
              className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50"
            >
              Have a Problem Worth Building Around?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Open to OSH collaboration, digital system projects, professional opportunities, and
              digital communication work.
            </p>
            <Button href={`mailto:${CONTACT_EMAIL}`} icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Contact Me
            </Button>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Looking for a general website, web application or other software solution?{" "}
              <a
                href={HARUNLUCAS_DEV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-300 dark:decoration-slate-700 dark:hover:decoration-slate-300"
              >
                Explore HarunLucas Dev
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
