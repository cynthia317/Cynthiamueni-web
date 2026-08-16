"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="rounded-sm text-base font-semibold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 sm:text-lg dark:text-slate-50"
          >
            {SITE_NAME}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button href="/contact" size="sm">
              Let&apos;s Connect
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 md:hidden dark:text-slate-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md transition-[max-height] duration-300 ease-in-out md:hidden dark:border-slate-800/80 dark:bg-slate-950/95 ${
          isMenuOpen ? "max-h-[40rem]" : "max-h-0"
        }`}
      >
        <Container>
          <nav aria-label="Mobile" className="flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/contact" size="sm" onClick={() => setIsMenuOpen(false)} className="mt-2">
              Let&apos;s Connect
            </Button>
            <div className="mt-2 border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
              <ThemeToggle variant="inline" />
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
