import NextDefaultNotFound from "next/dist/client/components/builtin/not-found";

// 404 body for notFound() calls from public pages (e.g. an unknown /projects/{slug}).
// It renders inside app/(site)/layout.tsx, which already provides the site chrome, so it
// must not add the chrome again. Unmatched URLs are handled by app/not-found.tsx instead,
// which renders outside this layout and therefore adds the chrome itself.
export default function SiteNotFound() {
  return <NextDefaultNotFound />;
}
