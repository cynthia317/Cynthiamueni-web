import type { ReactNode } from "react";
import SiteChrome from "@/components/layout/SiteChrome";

// Layout for every public page. `(site)` is a route group: it adds no URL segment, so
// /about, /projects/... and the rest keep their URLs. Future /admin routes live outside
// this group and therefore don't receive the public header, footer or chat widgets.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
