import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import type { Insight } from "@/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightsFeatured({ insight }: { insight: Insight }) {
  const isPublished = insight.href !== "#";

  return (
    <section aria-labelledby="featured-insight-heading" className="pb-4">
      <Container>
        <Reveal
          startOpacity={0.2}
          className={`group relative flex flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 lg:flex-row ${
            isPublished
              ? "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-amber-300 [@media(hover:hover)]:hover:shadow-lg dark:[@media(hover:hover)]:hover:border-amber-500/40"
              : "[@media(hover:hover)]:hover:border-slate-300 dark:[@media(hover:hover)]:hover:border-slate-700"
          }`}
        >
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden lg:aspect-auto lg:w-[52%]">
            <Image
              src={insight.image}
              alt={insight.imageAlt}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className={`object-cover transition-transform duration-700 ease-out motion-reduce:transition-none ${
                isPublished
                  ? "[@media(hover:hover)]:group-hover:scale-[1.03]"
                  : "[@media(hover:hover)]:group-hover:scale-[1.015]"
              }`}
              priority
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur-sm dark:bg-slate-950/80 dark:text-slate-300">
              Featured
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-4 p-7 sm:p-9 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
                {insight.category}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {formatDate(insight.date)} · {insight.readTime}
              </span>
            </div>

            <h2
              id="featured-insight-heading"
              className={`text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl lg:text-[2rem] transition-colors duration-300 ${
                isPublished
                  ? "[@media(hover:hover)]:group-hover:text-amber-700 dark:[@media(hover:hover)]:group-hover:text-amber-400"
                  : ""
              }`}
            >
              {insight.title}
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {insight.excerpt}
            </p>

            {isPublished ? (
              <Link
                href={insight.href}
                className="relative mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
              >
                Read Article
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              >
                Coming Soon
              </span>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
