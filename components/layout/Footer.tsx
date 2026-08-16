"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ExternalLink, Mail } from "lucide-react";
import Container from "@/components/layout/Container";
import { NAV_ITEMS } from "@/lib/navigation";
import { CONTACT_EMAIL, HARUNLUCAS_DEV_URL, LINKEDIN_URL, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container className="motion-safe:animate-[footer-fade_450ms_ease-out]">
        {/* Structured column grid — brand, navigation, connect */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-16">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1 lg:max-w-sm">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold tracking-tight text-white dark:bg-white dark:text-slate-900"
              >
                CM
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{SITE_NAME}</p>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                  Occupational Safety &amp; Health · EHS Systems · Digital Communication
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Practical safety systems and clear digital communication for organisations that need
              both.
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-900 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:text-amber-600 dark:[@media(hover:hover)]:hover:text-amber-400"
            >
              <Mail className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              Navigation
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group/nav relative inline-flex w-fit items-center gap-1.5 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 ${
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-400 [@media(hover:hover)]:hover:text-slate-900 dark:[@media(hover:hover)]:hover:text-white"
                      }`}
                    >
                      {isActive ? (
                        <span
                          aria-hidden
                          className="h-1 w-1 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400"
                        />
                      ) : null}
                      {item.label}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left bg-amber-600 transition-transform duration-300 dark:bg-amber-400 ${
                          isActive ? "scale-x-100" : "scale-x-0 [@media(hover:hover)]:group-hover/nav:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              Connect
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cynthia Mueni on LinkedIn (opens in a new tab)"
                  className="group/ext inline-flex w-fit items-center gap-1.5 text-sm text-slate-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-400 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:text-amber-600 dark:[@media(hover:hover)]:hover:text-amber-400"
                >
                  LinkedIn
                  <ExternalLink
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover/ext:translate-x-0.5 [@media(hover:hover)]:group-hover/ext:-translate-y-0.5"
                  />
                </a>
              </li>
              <li>
                <a
                  href={HARUNLUCAS_DEV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HarunLucas Dev (opens in a new tab)"
                  className="group/ext inline-flex w-fit items-center gap-1.5 text-sm text-slate-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-400 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:text-amber-600 dark:[@media(hover:hover)]:hover:text-amber-400"
                >
                  HarunLucas Dev
                  <ExternalLink
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover/ext:translate-x-0.5 [@media(hover:hover)]:group-hover/ext:-translate-y-0.5"
                  />
                </a>
              </li>
            </ul>

            <a
              href="#top"
              className="group/top mt-6 inline-flex w-fit items-center gap-1.5 border-t border-slate-200 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-800 dark:text-slate-400 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:text-amber-600 dark:[@media(hover:hover)]:hover:text-amber-400"
            >
              Back to top
              <ArrowUp
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover/top:-translate-y-1"
              />
            </a>
          </div>
        </div>

        <div aria-hidden className="h-px w-full bg-slate-200 dark:bg-slate-800" />

        {/* Legal bar */}
        <div className="flex flex-col gap-2 py-6 text-xs text-slate-500 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>Built thoughtfully with Next.js.</p>
        </div>
      </Container>
    </footer>
  );
}
