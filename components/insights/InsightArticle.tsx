import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/layout/Container";
import InsightCard from "@/components/ui/InsightCard";
import InsightToc from "@/components/insights/InsightToc";
import { INSIGHTS } from "@/lib/data/insights";
import type { Insight, InsightContentBlock } from "@/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRelatedInsights(current: Insight, max = 3) {
  const published = INSIGHTS.filter((item) => item.id !== current.id && item.href !== "#");
  const sameCategory = published.filter((item) => item.category === current.category);
  const rest = published.filter((item) => item.category !== current.category);
  return [...sameCategory, ...rest].slice(0, max);
}

function renderContentBlock(block: InsightContentBlock, index: number): ReactNode {
  if (block.type === "heading") {
    return (
      <h2
        key={index}
        id={block.id}
        className="mt-4 scroll-mt-28 text-xl font-semibold tracking-tight text-slate-900 first:mt-0 dark:text-slate-50 sm:text-2xl"
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={index} className="flex flex-col gap-2.5">
        {block.items?.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-base leading-relaxed text-slate-600 dark:text-slate-400"
          >
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "linkParagraph") {
    return (
      <p
        key={index}
        className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-base leading-relaxed text-slate-600 dark:border-amber-500/20 dark:bg-amber-500/[0.06] dark:text-slate-400"
      >
        {block.text}{" "}
        <Link
          href={block.linkHref ?? "/insights"}
          className="font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 transition-colors hover:decoration-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400 dark:decoration-amber-500/40 dark:hover:decoration-amber-400"
        >
          {block.linkLabel}
        </Link>
        .
      </p>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="rounded-r-xl border-l-4 border-slate-800 bg-slate-50 py-3 pl-5 pr-4 text-base italic leading-relaxed text-slate-700 dark:border-amber-400 dark:bg-slate-900/40 dark:text-slate-300"
      >
        {block.text}
      </blockquote>
    );
  }

  if (block.type === "image" && block.imageSrc) {
    return (
      <figure key={index} className="flex flex-col gap-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <Image
            src={block.imageSrc}
            alt={block.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        {block.caption ? (
          <figcaption className="text-center text-sm text-slate-500 dark:text-slate-400">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "references") {
    return (
      <div key={index} className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-8 dark:border-slate-800">
        {block.text ? (
          <h2
            id={block.id}
            className="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl"
          >
            {block.text}
          </h2>
        ) : null}
        <ul className="flex flex-col gap-2">
          {block.referenceItems
            ? block.referenceItems.map((item) => (
                <li key={item.text} className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900 hover:decoration-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:decoration-slate-700 dark:hover:text-white"
                    >
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </li>
              ))
            : block.items?.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item}
                </li>
              ))}
        </ul>
      </div>
    );
  }

  return (
    <p key={index} className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
      {block.text}
    </p>
  );
}

export default function InsightArticle({ insight }: { insight: Insight }) {
  const relatedInsights = getRelatedInsights(insight);
  const tocBlock = insight.content?.find((block) => block.type === "toc");
  const tocItems = tocBlock?.tocItems ?? [];
  const bodyBlocks = insight.content?.filter((block) => block.type !== "toc") ?? [];

  const articleBody = (
    <div className="flex w-full flex-col gap-5">{bodyBlocks.map((block, index) => renderContentBlock(block, index))}</div>
  );

  return (
    <article className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li className="flex items-center gap-1.5">
                <Link
                  href="/"
                  className="rounded-sm transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:hover:text-white"
                >
                  Home
                </Link>
                <span aria-hidden>/</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Link
                  href="/insights"
                  className="rounded-sm transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:hover:text-white"
                >
                  Insights
                </Link>
                <span aria-hidden>/</span>
              </li>
              <li aria-current="page" className="max-w-[16rem] truncate text-slate-700 dark:text-slate-300 sm:max-w-sm">
                {insight.title}
              </li>
            </ol>
          </nav>

          <Link
            href="/insights"
            className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All Insights
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
              {insight.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatDate(insight.date)} · {insight.readTime}
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {insight.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            {insight.excerpt}
          </p>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
          <Image
            src={insight.image}
            alt={insight.imageAlt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {tocItems.length > 0 ? (
          <div className="mx-auto w-full max-w-5xl lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="mb-8 lg:order-2 lg:col-span-4 lg:mb-0">
              <InsightToc items={tocItems} />
            </div>
            <div className="lg:order-1 lg:col-span-8">{articleBody}</div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl">{articleBody}</div>
        )}

        {relatedInsights.length > 0 ? (
          <div className="flex flex-col gap-6 border-t border-slate-200 pt-10 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              More Insights
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedInsights.map((related, index) => (
                <InsightCard key={related.id} insight={related} size="compact" delay={index * 80} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
