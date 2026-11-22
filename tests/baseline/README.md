# Public website baseline

A reproducible record of how the public site behaves **before** the admin-dashboard work (Stage 2 of [the roadmap](../../docs/ADMIN_DASHBOARD_ROADMAP.md)). Later stages must keep `npm run baseline:check` passing, or explain every difference.

Captured on 2026-11-21 from `feature/admin-dashboard`. The application code is identical to `main` at `376f2e8`.

## Running it

```bash
npm run build              # the baseline always runs against a production build
npm run baseline:check     # compare the current build with the committed snapshots (exit 1 on any difference)
npm run baseline:capture   # rewrite the snapshots, for intentional changes only; review the git diff
```

Related suites (added in Stage 3): `npm run test:interactive` runs assertion-based browser checks for insights filtering and pagination, FAQ accordions, mobile navigation, theme switching and the contact form (submissions are mocked in the browser; the run fails if any request reaches `/api/contact`). `npm test` runs the Vitest unit tests for `lib/content`. Both reuse `lib/cdp.mjs` and `lib/server.mjs` from this folder.

Optional flags and variables: `--no-screenshots`, `BASELINE_PORT` (default `3999`), and `BASELINE_BROWSER` (a path to Chrome or Edge; otherwise one is auto-detected).

**Requirements:** Node 22+ (it uses the built-in `fetch` and `WebSocket`) and a Chromium-based browser (Edge or Chrome). It adds **no npm dependencies**: the browser is driven directly over the Chrome DevTools Protocol (`lib/cdp.mjs`).

## What it does

1. Discovers routes from the build output (`.next/app-path-routes-manifest.json` and `.next/prerender-manifest.json`), including every path generated from the dynamic routes `/projects/[slug]` and `/insights/[slug]`.
2. Starts `next start` on `127.0.0.1` with the Brevo and contact variables **removed** from its environment.
3. For each page, it fetches the **raw server HTML** (what crawlers receive) and parses it in the browser with `DOMParser` to capture:
   - the title, meta description, keywords, robots, canonical, viewport, icons, Open Graph and Twitter tags;
   - all JSON-LD structured data;
   - headings, main text, links, images (with alt text and `next/image` sizing), buttons and forms;
   - the shared header, footer and floating chrome (stored once in `global.json`; each page records whether it matches).
4. Loads each page in headless Edge at **desktop 1440×900** and **mobile 390×844** (light theme, reduced motion) and records layout facts:
   - horizontal overflow;
   - header position and height, and which navigation elements are visible;
   - the mobile menu button;
   - h1 text, visibility and font size;
   - the WhatsApp button;
   - whether the hydrated title matches the server title.
5. Checks robots.txt, the sitemap (entries cross-checked against discovered routes), trailing-slash and casing redirects, 404 behaviour, icons, every internal link and fragment target, and every referenced image.
6. Exercises the contact form API (validation, honeypot, rate limit, missing configuration) and the browser form (validation messages, the "Other" enquiry note, the error state with mailto fallback), plus the mobile menu (open, close, Escape).

## Safety

- **No email can be sent.** The server runs without `BREVO_API_KEY`, `CONTACT_TO_EMAIL` or `CONTACT_FROM_EMAIL`. If any `.env*` file defines `BREVO_API_KEY`, the valid-submission tests are skipped and recorded as skipped.
- Test submissions use fake data (`example.com`) and documentation-range IPs (`203.0.113.0/24`). Neither appears in the snapshots.
- Snapshots contain only public page content. The only contact details in them are the public ones shown on the site.

## Determinism

Output is stable JSON in document order. Normalised or excluded:

| Volatile value | Handling |
| --- | --- |
| `/_next/static/...` hashed asset URLs | replaced with `/_next/static/<asset>` |
| Icon cache-busting query strings | stripped |
| Footer copyright year | replaced with `<year>` |
| Sitemap `lastmod` for static pages and projects (`new Date()` at build time) | `<build-time>`; insight dates are kept because they're stable |
| Screenshots, console messages, server log | written to the git-ignored `.artifacts/` folder only |

Verified by running the capture twice. `baseline:check` reported all 29 files identical, and it fails as expected when a snapshot is tampered with.

## Files

| Path | Contents |
| --- | --- |
| `snapshots/manifest.json` | Discovered routes, dynamic patterns, viewports |
| `snapshots/global.json` | Security headers (CSP split by directive) and the shared header, footer and floating chrome |
| `snapshots/routes/*.json` | One file per page: HTTP, head/SEO, JSON-LD, content, layout (desktop and mobile) |
| `snapshots/seo-and-routing.json` | robots.txt, sitemap, redirects, 404s, icons, internal-link and image checks |
| `snapshots/functionality.json` | Contact API and UI behaviour, mobile menu |
| `snapshots/SUMMARY.md` | Generated per-route SEO and layout table, plus detected issues |
| `FUNCTIONALITY.md` | Hand-written description of the contact and enquiry flow and the known issues |
| `.artifacts/` (git-ignored) | Screenshots (light theme, clipped at 8000px tall), console errors, server log |

## Coverage limitations

- **Visual appearance** is recorded as structural and layout facts, not pixel comparisons. Screenshots are for human review and aren't part of the check. Very long pages are clipped.
- **Light theme only.** Dark mode isn't snapshotted.
- Two viewports (desktop and mobile). Tablet widths aren't checked.
- **Live Brevo delivery isn't exercised** (by design). Production email still needs a real test submission on a preview deployment when the contact route changes.
- Production platform behaviour isn't reproduced locally: Vercel's HTTPS and domain redirects, edge headers, real client-IP handling, and analytics.
- External links are recorded but not fetched.
- Client interactions other than the contact form and mobile menu aren't exercised: insights topic filters and pagination, FAQ accordions, the theme toggle.
