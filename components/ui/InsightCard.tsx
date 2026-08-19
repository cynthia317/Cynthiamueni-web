import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/layout/Reveal";
import type { Insight } from "@/types";

interface InsightCardProps {
  insight: Insight;
  size?: "default" | "compact";
  delay?: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightCard({ insight, size = "default", delay = 0 }: InsightCardProps) {
  const isPublished = insight.href !== "#";

  const card = (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[transform,box-shadow,border-color] duration-300 dark:border-slate-800 dark:bg-slate-900 motion-reduce:transition-colors motion-reduce:[@media(hover:hover)]:hover:translate-y-0 ${
        isPublished
          ? "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-slate-300 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-slate-200/60 dark:[@media(hover:hover)]:hover:border-slate-700 dark:[@media(hover:hover)]:hover:shadow-none"
          : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden ${size === "compact" ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <Image
          src={insight.image}
          alt={insight.imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-transform duration-700 ease-out motion-reduce:transition-none ${
            isPublished ? "[@media(hover:hover)]:group-hover:scale-[1.03]" : ""
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          {insight.category}
        </span>

        <h3
          className={`font-semibold text-slate-900 transition-colors duration-300 dark:text-slate-50 ${
            isPublished
              ? "[@media(hover:hover)]:group-hover:text-amber-700 dark:[@media(hover:hover)]:group-hover:text-amber-400"
              : ""
          } ${size === "compact" ? "text-base" : "text-lg"}`}
        >
          {insight.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {insight.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <time dateTime={insight.date}>{formatDate(insight.date)}</time>
          <span>{insight.readTime}</span>
        </div>

        {isPublished ? (
          <span className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Read Article
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-600"
          >
            Coming Soon
          </span>
        )}
      </div>
    </article>
  );

  return (
    <Reveal delay={delay} className="h-full">
      {isPublished ? (
        <Link
          href={insight.href}
          className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </Reveal>
  );
}
