"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import { FAQS } from "@/lib/data/faqs";

export default function InsightsFaq() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section aria-labelledby="faq-heading" className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal startOpacity={0.2} className="flex flex-col gap-3 lg:sticky lg:top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                EHS Knowledge
              </span>
              <h2
                id="faq-heading"
                className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50"
              >
                Practical EHS Questions, Answered
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Clear answers to common questions about digital safety systems, workplace inspections, hazard
                management and EHS technology.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Questions inspired by real workplace safety search queries.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {FAQS.map((faq, index) => {
                const isOpen = faq.id === openId;
                const triggerId = `faq-trigger-${faq.id}`;
                const panelId = `faq-panel-${faq.id}`;

                return (
                  <Reveal key={faq.id} delay={index * 50} startOpacity={0.2}>
                    <div>
                      <h3 className="m-0">
                        <button
                          type="button"
                          id={triggerId}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpenId(isOpen ? null : faq.id)}
                          className={`flex w-full items-start gap-4 px-4 py-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-inset sm:px-6 ${
                            isOpen
                              ? "bg-amber-50/50 dark:bg-slate-900/50"
                              : "[@media(hover:hover)]:hover:bg-amber-50/30 dark:[@media(hover:hover)]:hover:bg-slate-900/30"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`w-6 shrink-0 pt-0.5 text-xs font-semibold transition-colors duration-300 ${
                              isOpen ? "text-amber-600 dark:text-amber-400" : "text-slate-300 dark:text-slate-700"
                            }`}
                          >
                            0{index + 1}
                          </span>

                          <span className="flex-1">
                            {faq.category ? (
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                {faq.category}
                              </span>
                            ) : null}
                            <span
                              className={`text-base font-semibold transition-colors duration-300 ${
                                isOpen ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-slate-50"
                              }`}
                            >
                              {faq.question}
                            </span>
                          </span>

                          <span className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden>
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
                          <div className="flex flex-col gap-3 px-4 pb-5 pl-14 sm:px-6 sm:pl-16">
                            {faq.answer.map((paragraph, paragraphIndex) => (
                              <p
                                key={paragraphIndex}
                                className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                              >
                                {paragraph}
                              </p>
                            ))}

                            {faq.relatedHref ? (
                              <Link
                                href={faq.relatedHref}
                                className="group/rel inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
                              >
                                Explore {faq.relatedLabel}
                                <ArrowUpRight
                                  aria-hidden
                                  className="h-3.5 w-3.5 transition-transform duration-300 [@media(hover:hover)]:group-hover/rel:translate-x-0.5 [@media(hover:hover)]:group-hover/rel:-translate-y-0.5"
                                />
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
