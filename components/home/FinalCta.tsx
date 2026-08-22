import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import Button from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/constants";

interface FinalCtaProps {
  heading?: string;
  description?: ReactNode;
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export default function FinalCta({
  heading = "Let's Work on Something Meaningful",
  description = (
    <>
      Open to Occupational Safety &amp; Health opportunities, EHS systems projects, digital
      communication work, and professional collaboration. Reach out at{" "}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="rounded-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100 dark:decoration-slate-700 dark:hover:decoration-slate-100"
      >
        {CONTACT_EMAIL}
      </a>
      .
    </>
  ),
  secondaryHref = "#work",
  secondaryLabel = "View My Work",
  primaryHref = `mailto:${CONTACT_EMAIL}`,
  primaryLabel = "Contact Me",
}: FinalCtaProps) {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2
              id="cta-heading"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
            >
              {heading}
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              {description}
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row">
              <Button href={primaryHref} icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                {primaryLabel}
              </Button>
              <Button href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
