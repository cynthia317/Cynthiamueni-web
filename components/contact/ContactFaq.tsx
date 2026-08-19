"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Minus, Plus } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import { HARUNLUCAS_DEV_URL } from "@/lib/constants";

interface ContactFaqItem {
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string; external?: boolean };
}

const CONTACT_FAQS: ContactFaqItem[] = [
  {
    id: "opportunity-types",
    question: "What types of opportunities can I contact you about?",
    answer:
      "Occupational Safety & Health, EHS Systems, Digital Communication, professional opportunities and collaboration — feel free to reach out about any of these.",
  },
  {
    id: "outside-nairobi",
    question: "Do you work outside Nairobi?",
    answer:
      "Yes. I can support opportunities in Nairobi, across Kenya, and remote work where appropriate.",
  },
  {
    id: "response-time",
    question: "How quickly can I expect a response?",
    answer: "I aim to respond to professional enquiries within approximately 24 hours.",
  },
  {
    id: "ehs-system-idea",
    question: "Can I discuss an EHS system idea with you?",
    answer:
      "Yes — I'm glad to discuss ideas around workplace inspections, hazard reporting, corrective actions, risk management and related EHS processes. Some of these systems are still in development, so we'd be discussing direction and fit rather than a finished product.",
  },
  {
    id: "general-software",
    question: "What if I need a website or general software solution?",
    answer: "For general websites, web applications and non-EHS software solutions, visit HarunLucas Dev.",
    link: { label: "Visit HarunLucas Dev", href: HARUNLUCAS_DEV_URL, external: true },
  },
];

export default function ContactFaq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-labelledby="contact-faq-heading" className="border-t border-slate-200 py-12 dark:border-slate-800 sm:py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-8">
        <Reveal startOpacity={0.2} className="flex flex-col gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Questions
          </span>
          <h2 id="contact-faq-heading" className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Before You Reach Out
          </h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {CONTACT_FAQS.map((faq, index) => {
            const isOpen = faq.id === openId;
            const triggerId = `contact-faq-trigger-${faq.id}`;
            const panelId = `contact-faq-panel-${faq.id}`;

            return (
              <Reveal key={faq.id} delay={index * 40} startOpacity={0.2}>
                <div>
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-inset ${
                        isOpen
                          ? "bg-amber-50/50 dark:bg-slate-900/50"
                          : "[@media(hover:hover)]:hover:bg-amber-50/30 dark:[@media(hover:hover)]:hover:bg-slate-900/30"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          isOpen ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-slate-50"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span className="shrink-0 text-slate-400 dark:text-slate-500" aria-hidden>
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3 px-5 pb-4">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.answer}</p>
                        {faq.link ? (
                          faq.link.external ? (
                            <a
                              href={faq.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
                            >
                              {faq.link.label}
                              <ExternalLink
                                aria-hidden
                                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                              />
                            </a>
                          ) : (
                            <Link
                              href={faq.link.href}
                              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
                            >
                              {faq.link.label}
                            </Link>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
