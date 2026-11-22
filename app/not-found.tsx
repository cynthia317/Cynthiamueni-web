import NextDefaultNotFound from "next/dist/client/components/builtin/not-found";
import SiteChrome from "@/components/layout/SiteChrome";

// Root 404 page for URLs that match no route at all. It renders inside the root layout but
// outside app/(site)/layout.tsx, so it wraps Next's built-in 404 body in the same site
// chrome the 404 page had before the (site) route-group move. notFound() calls from public
// pages use app/(site)/not-found.tsx instead (it already sits inside the site chrome).
//
// Note: the built-in component is imported from an internal Next.js path; if a Next.js
// upgrade moves it, the build fails loudly here (tracked in docs/TECHNICAL_DEBT.md).
export default function NotFound() {
  return (
    <SiteChrome>
      <NextDefaultNotFound />
    </SiteChrome>
  );
}
