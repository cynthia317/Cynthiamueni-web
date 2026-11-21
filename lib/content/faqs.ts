// FAQ content access.
//
// Source: static data in `lib/data/faqs.ts`. Public pages read FAQs only through these
// functions, so a future database-backed implementation replaces the function bodies here
// without changing any call site.
import { FAQS } from "@/lib/data/faqs";
import type { Faq } from "./types";

/** All FAQs, in display order. */
export async function getFaqs(): Promise<Faq[]> {
  return [...FAQS];
}

/** FAQs for the given ids, in the order requested. Unknown ids are skipped. */
export async function getFaqsByIds(ids: readonly string[]): Promise<Faq[]> {
  return ids.map((id) => FAQS.find((faq) => faq.id === id)).filter((faq): faq is Faq => Boolean(faq));
}
