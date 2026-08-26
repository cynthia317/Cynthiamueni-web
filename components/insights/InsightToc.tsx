"use client";

import { useEffect, useState } from "react";

interface TocItem {
  label: string;
  id: string;
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string | null }) {
  return (
    <ol className="flex flex-col gap-1">
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`block rounded-sm border-l-2 py-1 pl-3 text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                isActive
                  ? "border-amber-600 font-semibold text-amber-700 dark:border-amber-400 dark:text-amber-400"
                  : "border-transparent text-slate-600 hover:border-amber-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {String(index + 1).padStart(2, "0")}. {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function InsightToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstVisible = entries.find((entry) => entry.isIntersecting);
        if (firstVisible) setActiveId(firstVisible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      <details className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 [&_summary::-webkit-details-marker]:hidden dark:border-slate-800 dark:bg-slate-900/40 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
          On This Page
          <span aria-hidden className="text-slate-400 transition-transform duration-200 group-open:rotate-180">
            ⌄
          </span>
        </summary>
        <div className="mt-4">
          <TocList items={items} activeId={activeId} />
        </div>
      </details>

      <nav
        aria-label="Table of contents"
        className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900/40 lg:block"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
          On This Page
        </p>
        <div className="mt-4">
          <TocList items={items} activeId={activeId} />
        </div>
      </nav>
    </>
  );
}
