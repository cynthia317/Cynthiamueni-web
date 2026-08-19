"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ExternalLink, Mail } from "lucide-react";
import Container from "@/components/layout/Container";
import { FacebookIcon, GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { NAV_ITEMS } from "@/lib/navigation";
import {
  CONTACT_EMAIL,
  FACEBOOK_URL,
  GITHUB_URL,
  HARUNLUCAS_DEV_URL,
  LINKEDIN_URL,
  SITE_NAME,
  WHATSAPP_URL,
} from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: LinkedInIcon },
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: WhatsAppIcon },
  { label: "Facebook", href: FACEBOOK_URL, Icon: FacebookIcon },
  { label: "GitHub", href: GITHUB_URL, Icon: GitHubIcon },
];

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
                className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-full bg-slate-900 dark:bg-white"
              >
                <span className="text-xs font-bold leading-none tracking-tight text-white dark:text-slate-900">
                  CM
                </span>
                <span className="h-[2px] w-3.5 rounded-full bg-amber-500" />
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
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label === "WhatsApp" ? "Chat with Cynthia Mueni on" : "Cynthia Mueni on"} ${social.label} (opens in a new tab)`}
                    className="group/ext inline-flex w-fit items-center gap-1.5 text-sm text-slate-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-400 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-950 [@media(hover:hover)]:hover:text-amber-600 dark:[@media(hover:hover)]:hover:text-amber-400"
                  >
                    <social.Icon className="h-3.5 w-3.5 shrink-0" />
                    {social.label}
                    <ExternalLink
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover/ext:translate-x-0.5 [@media(hover:hover)]:group-hover/ext:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
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
        <div className="py-6 text-xs text-slate-500 dark:text-slate-500">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
