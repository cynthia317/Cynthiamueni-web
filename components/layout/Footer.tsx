import Link from "next/link";
import { Mail } from "lucide-react";
import Container from "@/components/layout/Container";
import ArrowLink from "@/components/ui/ArrowLink";
import { NAV_ITEMS } from "@/lib/navigation";
import { EXPERTISE_AREAS } from "@/lib/data/expertise";
import { CONTACT_EMAIL, HARUNLUCAS_DEV_URL, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {SITE_NAME}
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Occupational Safety &amp; Health professional working across technology and digital
              communication to help organisations operate more safely and effectively.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-sm text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Professional Areas
            </h3>
            <ul className="flex flex-col gap-3">
              {EXPERTISE_AREAS.map((area) => (
                <li key={area.id} className="text-sm text-slate-600 dark:text-slate-400">
                  {area.title}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Commercial software &amp; digital services:
            </p>
            <ArrowLink href={HARUNLUCAS_DEV_URL} external className="-mt-2 text-sm">
              HarunLucas Dev
            </ArrowLink>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Connect</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-sm text-sm text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {CONTACT_EMAIL}
            </a>
            <ul className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm text-sm text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-500">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>Built with Next.js, React &amp; Tailwind CSS.</p>
        </div>
      </Container>
    </footer>
  );
}
