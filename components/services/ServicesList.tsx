import { CheckCircle2, ExternalLink } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { SERVICES } from "@/lib/data/services";

export default function ServicesList() {
  return (
    <section aria-labelledby="services-heading" className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="What I Offer"
            title="Three Ways I Can Help"
            description="Each service below can stand on its own or connect with the others, the way a safety need often turns into a system and a system needs to be communicated."
            id="services-heading"
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={index * 80}>
                <article
                  id={service.id}
                  className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 transition-colors duration-300 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40 sm:p-10"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white dark:bg-amber-500">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-50">
                      {service.title}
                    </h3>
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                    {service.summary}
                  </p>

                  <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Ideal for:</span>{" "}
                    {service.idealFor}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {service.footnote ? (
                      <a
                        href={service.footnote.href}
                        target={service.footnote.external ? "_blank" : undefined}
                        rel={service.footnote.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-sm text-xs text-slate-500 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-500 dark:hover:text-amber-400"
                      >
                        {service.footnote.text}
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                      </a>
                    ) : (
                      <span />
                    )}
                    <ArrowLink href="/contact">Get in touch</ArrowLink>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
