import type { ReactNode } from "react";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";

/**
 * The public website's shared chrome: header, main landmark, footer, WhatsApp button and
 * the Tawk.to chat script. Moved here unchanged from the root layout so the public site
 * (app/(site)/layout.tsx) and the root 404 page (app/not-found.tsx) render it, while future
 * /admin routes do not.
 *
 * Known issue (tracked in docs/TECHNICAL_DEBT.md): the Tawk.to script is blocked by the
 * site's CSP. It is intentionally left as-is here.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Non-sticky anchor target for "Back to top" links — the sticky
          Header can't be the target itself, since its bounding rect is
          pinned at the viewport top once scrolled, which makes browsers
          treat it as already in view and skip the scroll. */}
      <div id="top" aria-hidden className="sr-only" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
      <Script id="tawk-to" src="https://embed.tawk.to/6a982041ff007d344587c72a/default" strategy="afterInteractive" />
    </>
  );
}
