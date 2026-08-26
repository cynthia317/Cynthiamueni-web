import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The contact form posts to this site's own /api/contact route, which calls Brevo
// server-to-server (never from the browser), so no third-party origin is needed in
// connect-src for it — 'self' already covers the same-origin request. The policy also
// allowlists the marketing/analytics platforms this site is expected to use — Google
// Analytics/Tag Manager, Meta (Facebook) Pixel, and the LinkedIn Insight Tag — so those can
// be dropped in later without a CSP change. 'unsafe-inline' on script-src is required for
// next-themes' inline no-flash script, the two static JSON-LD <script> blocks (Insights
// pages), and inline config snippets some of these tags require; 'unsafe-eval' is dev-only,
// needed for Next.js Fast Refresh / HMR and never shipped to production.
const MARKETING_SCRIPT_ORIGINS = [
  "https://www.googletagmanager.com",
  "https://connect.facebook.net",
  "https://snap.licdn.com",
];
const MARKETING_CONNECT_ORIGINS = [
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://www.googletagmanager.com",
  "https://connect.facebook.net",
  "https://www.facebook.com",
  "https://px.ads.linkedin.com",
  "https://snap.licdn.com",
];
const MARKETING_IMG_ORIGINS = [
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://www.facebook.com",
  "https://px.ads.linkedin.com",
];

const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${MARKETING_SCRIPT_ORIGINS.join(" ")}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${MARKETING_IMG_ORIGINS.join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${MARKETING_CONNECT_ORIGINS.join(" ")}${isDev ? " ws:" : ""}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
