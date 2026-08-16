import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Insight } from "@/types";

interface InsightCardProps {
  insight: Insight;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightCard({ insight }: InsightCardProps) {
  const isPlaceholder = insight.href === "#";

  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
      <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
        {insight.category}
      </span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{insight.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{insight.excerpt}</p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        <time dateTime={insight.date}>{formatDate(insight.date)}</time>
        <span>{insight.readTime}</span>
      </div>

      {isPlaceholder ? (
        <span
          aria-disabled="true"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-600"
        >
          Coming Soon
        </span>
      ) : (
        <Link
          href={insight.href}
          className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100"
        >
          Read Article
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            aria-hidden
          />
        </Link>
      )}
    </article>
  );
}
