# Existing functionality (baseline, 2026-11-21)

How the public site's interactive features work today. Based on the source code, and checked by the baseline script wherever that's possible without sending email (see `snapshots/functionality.json`).

## Contact form and enquiry handling

**Where:** `/contact`. UI in `components/contact/ContactForm.tsx` (client component), endpoint `POST /api/contact` (`app/api/contact/route.ts`, Node runtime).

### Fields

| Field | Required | Server limit | Notes |
| --- | --- | --- | --- |
| Name | yes | 120 chars | |
| Email | yes | 254 chars, simple `x@y.z` pattern | Used as Reply-To on the notification |
| Organisation | no | 160 chars | |
| Phone | no | 40 chars | |
| Enquiry type | **required by the browser form only** | — | `osh`, `ehs-systems`, `digital-communication`, `professional-opportunity`, `collaboration`, `other`. The server accepts a missing or unknown value and labels it "General". Choosing "Other" shows a link to HarunLucas Dev. |
| Subject | yes | 200 chars | |
| Message | yes | 5000 chars | |
| `hp_field` | — | — | Hidden honeypot, deliberately not named like a real field |

### Request flow (verified behaviour)

1. **Browser validation** (form has `noValidate`, custom checks): empty submit shows inline errors for name, email, enquiry type, subject and message. An invalid email shows "Please enter a valid email address."
2. `POST /api/contact` with JSON. The honeypot isn't checked in the browser.
3. **Rate limit:** 5 requests per 10 minutes per IP, using `x-forwarded-for` and then `x-real-ip`. It's stored **in memory per server instance**, so on Vercel it doesn't hold across instances or cold starts. The 6th request from one IP returns `429 rate_limited`.
4. Malformed JSON returns `400 invalid_body`.
5. **Honeypot filled** returns `200 { ok: true }`, and no email is sent (silent drop).
6. **Server validation** returns `400 validation` with a per-field message map.
7. If `BREVO_API_KEY` or `CONTACT_TO_EMAIL` is missing, it returns `500 server_not_configured`.
8. **Brevo Transactional Email API** (`https://api.brevo.com/v3/smtp/email`):
   - sender: "Cynthia Mueni Website" at `CONTACT_FROM_EMAIL`, falling back to `hello@cynthiamueni.com`;
   - to: `CONTACT_TO_EMAIL`, a private inbox that's never shown publicly;
   - reply-to: the visitor's name and email;
   - subject: `New website enquiry — {subject}`;
   - HTML and plain-text bodies with all values HTML-escaped and a Nairobi-time timestamp.
9. A Brevo non-2xx response or a network failure returns `502 send_failed`. A Brevo 2xx returns `200 { ok: true }`.

### What the visitor sees

- **Success:** "Your message has been sent", plus a mailto link and "Send another message".
- **Any failure:** "Something went wrong sending your message", plus a **mailto fallback** to hello@cynthiamueni.com with the subject and body prefilled from the form, and "Try again". (Verified in the browser: with Brevo not configured, a valid submission produces this error state.)

### Enquiry persistence

**None.** Enquiries exist only as the Brevo notification email. If Brevo fails, the enquiry is lost unless the visitor uses the mailto fallback. There's no duplicate-submission protection beyond the submit button being disabled while a request is in flight.

### Logging

The route logs step markers (`route_invoked`, `honeypot_triggered`, `validation_passed` with the names of failed fields, `env_vars_present` as booleans, `brevo_response` with the status and the first 500 characters of Brevo's response body). Form contents aren't logged. On a Brevo error, the full Brevo response body is logged to `console.error`.

The browser form logs `[contact-form] submitting to /api/contact` (a temporary debug line, according to its comment).

### Email infrastructure (owner-confirmed; outside this repository)

Brevo sends the notifications. hello@cynthiamueni.com uses Namecheap email forwarding with Gmail for sending and receiving. None of this is configured in code beyond the three environment variables, and none of it may change without explicit approval.

## Other interactive features

| Feature | Where | Baseline coverage |
| --- | --- | --- |
| Mobile menu (open, close, Escape, auto-close on link click) | `components/layout/Header.tsx` | Verified: opens with all 6 nav links plus "Let's Connect", closes on Escape |
| Theme toggle (light / dark / system via next-themes) | Header (desktop) and mobile menu | Presence recorded. Switching isn't exercised. |
| WhatsApp floating button (`wa.me` link with a prefilled message) | `components/ui/WhatsAppFloatingButton.tsx` | Visible on desktop and mobile on every page |
| Insights topic filter and pagination (6 per page) | `components/insights/InsightsGrid.tsx` | Initial render recorded. Interaction isn't exercised. |
| FAQ accordions | `InsightsFaq`, `ContactFaq` | Initial render recorded |
| Tawk.to live chat | `app/layout.tsx` | **Blocked by the CSP on every page** (see below) |
| Google Analytics | `app/layout.tsx` | **Not present in the served HTML** (see below) |

## Existing issues found by the baseline

These are recorded, not fixed. Fixing any of them is outside Stage 2 and would change the baseline.

| # | Issue | Evidence |
| --- | --- | --- |
| 1 | **Tawk.to chat never loads**: `https://embed.tawk.to` isn't allowed by `script-src` in the CSP | Browser console CSP violation on all 24 pages, desktop and mobile |
| 2 | **Google Analytics never loads**: `<GoogleAnalytics gaId="G-T5KTXNBKG5" />` sits in unreachable code after the first `return` in `app/layout.tsx` | The ID doesn't appear in the served HTML |
| 3 | **No canonical URL or og:image** on 14 pages: `/`, `/about`, `/contact`, `/expertise`, `/services`, `/projects` and all 8 `/projects/*` | `snapshots/SUMMARY.md` |
| 4 | **Overlong meta descriptions** on 5 project pages (397–490 chars, because the full project description is reused) | `snapshots/SUMMARY.md` |
| 5 | Unknown `/projects/*` and `/insights/*` slugs return 404 with `noindex`, but use the site's default title and have no `<h1>` (the generic 404 has "404: This page could not be found.") | `seo-and-routing.json → notFound` |
| 6 | `/favicon.ico` returns 404. Icons are served at `/icon` and `/apple-icon` and linked in `<head>`, so this mostly affects tools that request `/favicon.ico` directly. | `seo-and-routing.json → assets` |
| 7 | The server doesn't require an enquiry type (the browser form does) | `functionality.json → contactApi.emptyPayload` has no `enquiryType` error |
| 8 | The rate limit is per-instance and in memory, and it trusts `x-forwarded-for` | Code review. Locally, 6 requests produce a 429. |
| 9 | Sitemap `lastmod` for static and project pages changes on every build | `app/sitemap.ts` uses `new Date()` |
| 10 | Large or duplicate images in `public/images` (2.4 MB, 1.8 MB and 1.5 MB PNGs, plus `*.webp.webp` copies) | Architecture doc §1.8 |

**Healthy:** every page returns 200 with exactly one `<h1>` and a meta description. There's no horizontal overflow at either viewport. All 22 internal link targets and all fragment targets resolve, and all 20 referenced images return 200. The sitemap matches the 24 discovered pages exactly. Trailing slashes redirect with 308. The security headers are identical on every page and on the API route.
