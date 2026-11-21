#!/usr/bin/env node
// Public-website baseline capture.
//
//   npm run build                 # the baseline runs against a production build
//   npm run baseline:capture      # (re)write tests/baseline/snapshots
//   npm run baseline:check        # compare the current build against the committed snapshots
//
// Starts `next start` on 127.0.0.1, discovers routes from the build manifests, and records
// SEO metadata, structured data, content, links, images, shared UI chrome, desktop/mobile
// layout facts, robots/sitemap/redirect behaviour and contact-form behaviour.
//
// Safety: Brevo/contact environment variables are removed from the server's environment,
// and the valid-submission tests are skipped if any .env file defines BREVO_API_KEY, so
// this script can never send a real email. Test submissions use fake example.com data
// and documentation-range IPs (203.0.113.0/24).
import { startServer } from "./lib/server.mjs";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { findBrowser, launchBrowser, openPage, sleep } from "./lib/cdp.mjs";
import { extractFromRawHtml, measureLayout } from "./lib/browser-extractors.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SNAPSHOT_DIR = join(HERE, "snapshots");
const ARTIFACT_DIR = join(HERE, ".artifacts");
const MODE = process.argv.includes("--check") ? "check" : "write";
const TAKE_SCREENSHOTS = !process.argv.includes("--no-screenshots");
const PORT = Number(process.env.BASELINE_PORT ?? 3999);
const BASE = `http://127.0.0.1:${PORT}`;
const SITE_URL = "https://cynthiamueni.com";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  mobile: {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  },
};

const SECURITY_HEADERS = [
  "content-security-policy",
  "permissions-policy",
  "referrer-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
];

const FAKE_ENQUIRY = {
  name: "Baseline Test",
  email: "baseline.test@example.com",
  organisation: "Example Organisation",
  phone: "+000 000 000",
  enquiryType: "osh",
  subject: "Automated baseline test",
  message: "Automated baseline test submission. Not a real enquiry.",
};

// ─────────────────────────── helpers ───────────────────────────

const sha = (value) => createHash("sha256").update(value).digest("hex").slice(0, 16);
const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;
const routeFileName = (route) => (route === "/" ? "index" : route.slice(1).replaceAll("/", "__"));

function securityHeaders(headers) {
  const out = {};
  for (const name of SECURITY_HEADERS) {
    const value = headers.get(name);
    out[name] =
      name === "content-security-policy" && value
        ? value.split(";").map((directive) => directive.trim()).filter(Boolean)
        : value;
  }
  return out;
}

async function get(path, init = {}) {
  const res = await fetch(BASE + path, { redirect: "manual", ...init });
  const body = await res.text();
  return { res, body };
}

function brevoConfiguredInEnvFiles() {
  for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
    const full = join(ROOT, file);
    if (existsSync(full) && /^\s*BREVO_API_KEY\s*=\s*\S+/m.test(readFileSync(full, "utf8"))) return true;
  }
  return false;
}

// ─────────────────────────── route discovery ───────────────────────────

function discoverRoutes() {
  const appRoutes = JSON.parse(readFileSync(join(ROOT, ".next", "app-path-routes-manifest.json"), "utf8"));
  const prerender = JSON.parse(readFileSync(join(ROOT, ".next", "prerender-manifest.json"), "utf8"));
  const declared = [...new Set(Object.values(appRoutes))].sort();
  const dynamicPatterns = Object.keys(prerender.dynamicRoutes ?? {}).sort();
  const prerendered = Object.keys(prerender.routes).sort();

  const internal = new Set(["/_global-error", "/_not-found"]);
  const special = new Set(["/robots.txt", "/sitemap.xml", "/icon", "/apple-icon"]);
  const apiRoutes = declared.filter((route) => route.startsWith("/api/"));

  const pages = prerendered
    .filter((route) => !internal.has(route) && !special.has(route) && !route.startsWith("/api/"))
    .map((route) => {
      const pattern = dynamicPatterns.find((p) => new RegExp(`^${p.replace(/\[[^\]]+\]/g, "[^/]+")}$`).test(route));
      return { route, source: pattern ? `dynamic ${pattern} (generateStaticParams)` : "static" };
    });

  return { declared, dynamicPatterns, pages, apiRoutes, special: [...special].sort(), internal: [...internal].sort() };
}

// ─────────────────────────── browser checks ───────────────────────────

async function setViewport(page, viewport) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
  });
  await page.send("Emulation.setTouchEmulationEnabled", { enabled: viewport.mobile });
  if (viewport.userAgent) await page.send("Emulation.setUserAgentOverride", { userAgent: viewport.userAgent });
  await page.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: "light" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
}

// Review artifacts only (not part of the deterministic snapshot). Very long pages are
// clipped, and a failed capture is reported instead of aborting the run.
async function screenshot(page, viewport, file, notes) {
  try {
    const metrics = await page.send("Page.getLayoutMetrics");
    const fullHeight = Math.ceil(metrics.cssContentSize.height);
    const height = Math.min(fullHeight, 8000);
    const shot = await page.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: viewport.width, height, scale: 1 },
    });
    await writeFile(file, Buffer.from(shot.data, "base64"));
    if (height < fullHeight) notes.push(`${relative(ARTIFACT_DIR, file)}: clipped to top ${height}px of ${fullHeight}px`);
  } catch (error) {
    notes.push(`${relative(ARTIFACT_DIR, file)}: screenshot failed (${error.message})`);
  }
}

const SET_VALUE_HELPER = `
window.__baselineSet = (selector, value) => {
  const el = document.querySelector(selector);
  const proto = el.tagName === "SELECT" ? HTMLSelectElement.prototype
    : el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
};
window.__baselineErrors = () => [...document.querySelectorAll('#contact-form [aria-invalid="true"]')].map((el) => ({
  field: el.id,
  message: document.getElementById(el.getAttribute("aria-describedby") || "")?.textContent.trim() ?? null,
}));
true;`;

async function checkMobileMenu(page) {
  await page.navigate(`${BASE}/`);
  const state = () =>
    page.evaluate(`(() => {
      const button = document.querySelector('button[aria-controls="mobile-nav"]');
      const panel = document.getElementById("mobile-nav");
      return {
        expanded: button?.getAttribute("aria-expanded"),
        label: button?.getAttribute("aria-label"),
        panelOpen: panel ? panel.getBoundingClientRect().height > 100 : false,
        links: panel ? [...panel.querySelectorAll("a")].map((a) => a.textContent.trim()) : [],
      };
    })()`);
  const initial = await state();
  let opened = initial;
  for (let attempt = 0; attempt < 20 && opened.expanded !== "true"; attempt++) {
    await page.evaluate(`document.querySelector('button[aria-controls="mobile-nav"]').click(); true`);
    await sleep(700);
    opened = await state();
  }
  await page.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); true`);
  await sleep(700);
  const afterEscape = await state();
  return {
    initial: { expanded: initial.expanded, label: initial.label, panelOpen: initial.panelOpen },
    afterClick: { expanded: opened.expanded, label: opened.label, panelOpen: opened.panelOpen, links: opened.links },
    afterEscape: { expanded: afterEscape.expanded, panelOpen: afterEscape.panelOpen },
  };
}

async function checkContactFormUi(page, brevoConfigured) {
  await page.navigate(`${BASE}/contact`);
  await page.evaluate(SET_VALUE_HELPER);

  // 1. Empty submit (retry until React has hydrated and attached the handler).
  let emptyErrors = [];
  for (let attempt = 0; attempt < 20 && emptyErrors.length === 0; attempt++) {
    await page.evaluate(`document.querySelector('#contact-form button[type="submit"]').click(); true`);
    await sleep(300);
    emptyErrors = await page.evaluate("window.__baselineErrors()");
  }

  // 2. Invalid email, "Other" enquiry type (which reveals the HarunLucas Dev note).
  await page.evaluate(`
    __baselineSet("#contact-name", ${JSON.stringify(FAKE_ENQUIRY.name)});
    __baselineSet("#contact-email", "not-an-email");
    __baselineSet("#contact-enquiry-type", "other");
    __baselineSet("#contact-subject", ${JSON.stringify(FAKE_ENQUIRY.subject)});
    __baselineSet("#contact-message", ${JSON.stringify(FAKE_ENQUIRY.message)});
    true`);
  await sleep(200);
  const otherNote = await page.evaluate(
    `[...document.querySelectorAll("#contact-form p")].find((p) => p.textContent.includes("HarunLucas"))?.textContent.replace(/\\s+/g, " ").trim() ?? null`
  );
  await page.evaluate(`document.querySelector('#contact-form button[type="submit"]').click(); true`);
  await sleep(300);
  const invalidEmailErrors = await page.evaluate("window.__baselineErrors()");

  // 3. Valid submission → expected server_not_configured (no Brevo credentials) → error UI.
  let submission = { skipped: "Brevo credentials present in a .env file; a real email would be sent" };
  if (!brevoConfigured) {
    await page.evaluate(`
      __baselineSet("#contact-email", ${JSON.stringify(FAKE_ENQUIRY.email)});
      __baselineSet("#contact-enquiry-type", ${JSON.stringify(FAKE_ENQUIRY.enquiryType)});
      document.querySelector('#contact-form button[type="submit"]').click();
      true`);
    let outcome = null;
    for (let attempt = 0; attempt < 60 && !outcome; attempt++) {
      await sleep(250);
      outcome = await page.evaluate(`(() => {
        const alert = document.querySelector('main [role="alert"] p.font-semibold, main div[role="alert"] p');
        const status = document.querySelector('main div[role="status"] p');
        const box = document.querySelector('main div[role="alert"]') || document.querySelector('main div[role="status"]');
        if (!box || document.getElementById("contact-form")) return null;
        return {
          state: box.getAttribute("role") === "alert" ? "error" : "success",
          heading: (alert || status)?.textContent.trim() ?? null,
          links: [...box.querySelectorAll("a")].map((a) => a.getAttribute("href").split("?")[0]),
          buttons: [...box.querySelectorAll("button")].map((b) => b.textContent.trim()),
        };
      })()`);
    }
    submission = outcome ?? { state: "timeout" };
  }

  return { emptySubmitErrors: emptyErrors, otherEnquiryNote: otherNote, invalidEmailErrors, validSubmission: submission };
}

// ─────────────────────────── HTTP checks ───────────────────────────

async function checkContactApi(brevoConfigured) {
  const post = async (body, ip) => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
    let json = null;
    try {
      json = await res.json();
    } catch {
      // non-JSON
    }
    return { status: res.status, body: json };
  };

  const results = {
    getMethod: { status: (await fetch(`${BASE}/api/contact`)).status },
    invalidJson: await post("{not json", "203.0.113.1"),
    emptyPayload: await post({}, "203.0.113.2"),
    invalidEmail: await post({ ...FAKE_ENQUIRY, email: "not-an-email" }, "203.0.113.3"),
    overlongMessage: await post({ ...FAKE_ENQUIRY, message: "x".repeat(5001) }, "203.0.113.4"),
    honeypotFilled: await post({ ...FAKE_ENQUIRY, hp_field: "bot" }, "203.0.113.5"),
    validWithoutBrevoConfig: brevoConfigured
      ? { skipped: "Brevo credentials present in a .env file; a real email would be sent" }
      : await post(FAKE_ENQUIRY, "203.0.113.6"),
  };

  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await post({}, "203.0.113.250")).status);
  results.rateLimitSixRequestsSameIp = statuses;
  return results;
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => {
    const tag = (name) => block.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1] ?? null;
    const loc = tag("loc");
    const isInsight = loc?.includes("/insights/");
    return {
      loc,
      // Static/project entries use `new Date()` at build time; only insight dates are stable.
      lastmod: isInsight ? tag("lastmod") : tag("lastmod") ? "<build-time>" : null,
      changefreq: tag("changefreq"),
      priority: tag("priority"),
    };
  });
}

// ─────────────────────────── main ───────────────────────────

async function main() {
  if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) throw new Error("No production build found. Run `npm run build` first.");
  const brevoConfigured = brevoConfiguredInEnvFiles();
  const serverLog = [];
  const discovered = discoverRoutes();
  const files = new Map(); // relative path → content
  const consoleErrors = {};
  const problems = [];
  const screenshotNotes = [];

  await rm(ARTIFACT_DIR, { recursive: true, force: true });
  await mkdir(join(ARTIFACT_DIR, "screenshots"), { recursive: true });

  console.log(`Starting next start on ${BASE} ...`);
  const { server } = await startServer({ root: ROOT, port: PORT, logLines: serverLog });
  const browser = await launchBrowser(findBrowser());

  try {
    const pages = { desktop: await openPage(browser.cdp), mobile: await openPage(browser.cdp) };
    for (const [name, page] of Object.entries(pages)) await setViewport(page, VIEWPORTS[name]);

    // Global: security headers + shared chrome, from the home page.
    const home = await get("/");
    const globalHeaders = securityHeaders(home.res.headers);
    const homeExtract = await pages.desktop.evaluate(`(${extractFromRawHtml})(${JSON.stringify(home.body)})`);
    const globalChrome = homeExtract.chrome;
    const globalChromeHash = sha(JSON.stringify(globalChrome));

    const idsByRoute = {};
    const linkSources = [];
    const imagePaths = new Set();
    const summaryRows = [];

    for (const { route, source } of discovered.pages) {
      process.stdout.write(`  ${route}\n`);
      const { res, body } = await get(route);
      const extracted = await pages.desktop.evaluate(`(${extractFromRawHtml})(${JSON.stringify(body)})`);
      idsByRoute[route] = new Set(extracted.ids);

      const layout = {};
      for (const [name, page] of Object.entries(pages)) {
        await page.navigate(BASE + route);
        const measured = await page.evaluate(`(${measureLayout})()`);
        const { renderedTitle, ...rest } = measured;
        layout[name] = { ...rest, renderedTitleMatchesServerTitle: renderedTitle === extracted.head.title };
        if (TAKE_SCREENSHOTS) {
          await screenshot(page, VIEWPORTS[name], join(ARTIFACT_DIR, "screenshots", `${routeFileName(route)}.${name}.png`), screenshotNotes);
        }
        if (page.consoleErrors.length) consoleErrors[`${route} [${name}]`] = [...page.consoleErrors];
        if (measured.horizontalOverflow) problems.push(`${route}: horizontal overflow on ${name} (scrollWidth ${measured.scrollWidth})`);
      }

      const chromeMatches = sha(JSON.stringify(extracted.chrome)) === globalChromeHash;
      const routeHeaders = securityHeaders(res.headers);
      const snapshot = {
        route,
        source,
        http: {
          status: res.status,
          contentType: res.headers.get("content-type"),
          cacheControl: res.headers.get("cache-control"),
          xRobotsTag: res.headers.get("x-robots-tag"),
          securityHeadersMatchGlobal: JSON.stringify(routeHeaders) === JSON.stringify(globalHeaders),
        },
        head: extracted.head,
        jsonLd: extracted.jsonLd,
        content: { ...extracted.content, mainTextSha256: sha(extracted.content.mainText), mainTextWords: extracted.content.mainText.split(" ").filter(Boolean).length },
        sharedChrome: chromeMatches ? "matches global.json" : extracted.chrome,
        layout,
      };
      files.set(`routes/${routeFileName(route)}.json`, stable(snapshot));

      for (const link of [...extracted.content.links, ...extracted.chrome.headerLinks, ...extracted.chrome.footerLinks]) {
        linkSources.push({ from: route, href: link.href });
      }
      for (const img of extracted.content.images) imagePaths.add(img.src.split(" (next/image")[0]);
      for (const [key, value] of extracted.head.openGraph) {
        if (key === "og:image") imagePaths.add(value.replace(SITE_URL, ""));
      }

      const jsonLdTypes = extracted.jsonLd.map((item) => item["@type"]).join(", ") || "—";
      const ogImage = extracted.head.openGraph.find(([key]) => key === "og:image")?.[1];
      summaryRows.push(
        `| \`${route}\` | ${res.status} | ${extracted.head.title.replaceAll("|", "\\|")} | ${extracted.head.description?.length ?? "**missing**"} | ${extracted.head.canonical ? "yes" : "no"} | ${ogImage ? "yes" : "no"} | ${jsonLdTypes} | ${extracted.content.h1Count} | ${layout.desktop.horizontalOverflow ? "**yes**" : "no"} / ${layout.mobile.horizontalOverflow ? "**yes**" : "no"} |`
      );
      if (extracted.content.h1Count !== 1) problems.push(`${route}: ${extracted.content.h1Count} <h1> elements`);
      if (!extracted.head.description) problems.push(`${route}: missing meta description`);
    }

    // Internal links and fragment targets.
    const linkStatus = {};
    const linkIssues = [];
    for (const { from, href } of linkSources) {
      if (!href) continue;
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (id && !idsByRoute[from]?.has(id)) linkIssues.push({ from, href, problem: "fragment target missing on page" });
        continue;
      }
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const [path, fragment] = href.split("#");
      if (!(path in linkStatus)) linkStatus[path] = (await get(path)).res.status;
      if (linkStatus[path] !== 200) linkIssues.push({ from, href, problem: `HTTP ${linkStatus[path]}` });
      else if (fragment && idsByRoute[path] && !idsByRoute[path].has(fragment)) {
        linkIssues.push({ from, href, problem: "fragment target missing on target page" });
      }
    }
    const uniqueLinkIssues = [...new Map(linkIssues.map((issue) => [`${issue.from} ${issue.href}`, issue])).values()];

    const imageStatus = {};
    for (const path of [...imagePaths].sort()) {
      if (!path.startsWith("/")) continue;
      imageStatus[path] = (await fetch(BASE + path, { method: "HEAD" })).status;
    }
    for (const [path, status] of Object.entries(imageStatus)) if (status !== 200) problems.push(`image ${path}: HTTP ${status}`);

    // Special routes.
    const robots = await get("/robots.txt");
    const sitemap = await get("/sitemap.xml");
    const sitemapEntries = parseSitemap(sitemap.body);
    const sitemapPaths = sitemapEntries.map((entry) => entry.loc.replace(SITE_URL, "") || "/");
    const pagePaths = discovered.pages.map((page) => page.route);

    const notFound = {};
    for (const path of ["/this-page-does-not-exist", "/projects/this-project-does-not-exist", "/insights/this-insight-does-not-exist", "/api/does-not-exist"]) {
      const { res, body } = await get(path);
      const isHtml = (res.headers.get("content-type") ?? "").includes("text/html");
      const parsed = isHtml ? await pages.desktop.evaluate(`(${extractFromRawHtml})(${JSON.stringify(body)})`) : null;
      notFound[path] = {
        status: res.status,
        contentType: res.headers.get("content-type"),
        title: parsed?.head.title ?? null,
        robots: parsed?.head.robots ?? null,
        h1: parsed?.content.headings.find((h) => h.level === 1)?.text ?? null,
      };
    }

    const redirects = {};
    for (const path of ["/about/", "/projects/", "/insights/what-is-a-safety-management-system/", "/ABOUT", "/index"]) {
      const { res } = await get(path);
      redirects[path] = { status: res.status, location: res.headers.get("location") };
    }

    const assets = {};
    for (const path of ["/icon", "/apple-icon", "/favicon.ico", "/googlec5f391ecf2ca5cb5.html"]) {
      const { res } = await get(path);
      assets[path] = { status: res.status, contentType: res.headers.get("content-type") };
    }

    const apiResult = await checkContactApi(brevoConfigured);
    const apiHeaders = securityHeaders((await fetch(`${BASE}/api/contact`)).headers);
    const mobileMenu = await checkMobileMenu(pages.mobile);
    const contactUi = await checkContactFormUi(pages.desktop, brevoConfigured);
    if (pages.desktop.consoleErrors.length) consoleErrors["/contact form flow [desktop]"] = [...pages.desktop.consoleErrors];

    // ── Assemble snapshot files ──
    files.set(
      "manifest.json",
      stable({
        description: "Public routes discovered from .next/app-path-routes-manifest.json and .next/prerender-manifest.json",
        declaredAppRoutes: discovered.declared,
        dynamicRoutePatterns: discovered.dynamicPatterns,
        capturedPages: discovered.pages,
        apiRoutes: discovered.apiRoutes,
        metadataRoutes: discovered.special,
        frameworkInternalRoutes: discovered.internal,
        viewports: Object.fromEntries(Object.entries(VIEWPORTS).map(([k, v]) => [k, { width: v.width, height: v.height, mobile: v.mobile }])),
        emulation: { colorScheme: "light", reducedMotion: "reduce" },
      })
    );
    files.set("global.json", stable({ securityHeaders: globalHeaders, sharedChrome: globalChrome }));
    files.set(
      "seo-and-routing.json",
      stable({
        robotsTxt: { status: robots.res.status, contentType: robots.res.headers.get("content-type"), body: robots.body },
        sitemap: {
          status: sitemap.res.status,
          contentType: sitemap.res.headers.get("content-type"),
          entries: sitemapEntries,
          pagesMissingFromSitemap: pagePaths.filter((path) => !sitemapPaths.includes(path)),
          sitemapEntriesWithoutPage: sitemapPaths.filter((path) => !pagePaths.includes(path)),
        },
        redirects,
        notFound,
        assets,
        internalLinks: { checkedPaths: linkStatus, issues: uniqueLinkIssues },
        images: imageStatus,
      })
    );
    files.set(
      "functionality.json",
      stable({
        note: "Contact checks run with Brevo variables removed, so no email is sent. Inputs are fake (example.com).",
        brevoCredentialsInEnvFiles: brevoConfigured,
        contactApi: { ...apiResult, securityHeadersMatchGlobal: JSON.stringify(apiHeaders) === JSON.stringify(globalHeaders) },
        contactFormUi: contactUi,
        mobileMenu,
      })
    );
    files.set(
      "SUMMARY.md",
      [
        "# Public website baseline: summary",
        "",
        "Generated by `tests/baseline/capture.mjs`. Do not edit by hand.",
        "",
        `Pages captured: ${discovered.pages.length}. Viewports: desktop 1440×900, mobile 390×844 (light theme, reduced motion).`,
        "",
        "| Route | Status | Title | Description length | Canonical | og:image | JSON-LD | h1 count | Horizontal overflow (desktop / mobile) |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
        ...summaryRows,
        "",
        "## Detected issues",
        "",
        ...(problems.length || uniqueLinkIssues.length
          ? [...problems, ...uniqueLinkIssues.map((i) => `${i.from}: link ${i.href}: ${i.problem}`)].map((p) => `- ${p}`)
          : ["- none"]),
        "",
      ].join("\n")
    );

    await writeFile(join(ARTIFACT_DIR, "console-errors.json"), stable(consoleErrors));
    await writeFile(join(ARTIFACT_DIR, "screenshot-notes.txt"), `${screenshotNotes.join("\n")}\n`);
  } finally {
    await browser.close();
    server.kill();
    await writeFile(join(ARTIFACT_DIR, "server.log"), serverLog.join(""));
  }

  if (MODE === "write") {
    await rm(SNAPSHOT_DIR, { recursive: true, force: true });
    for (const [path, content] of files) {
      await mkdir(dirname(join(SNAPSHOT_DIR, path)), { recursive: true });
      await writeFile(join(SNAPSHOT_DIR, path), content);
    }
    console.log(`\nWrote ${files.size} snapshot files to ${relative(ROOT, SNAPSHOT_DIR)}`);
    return 0;
  }

  // check mode
  const existing = await listFiles(SNAPSHOT_DIR);
  const differences = [];
  for (const [path, content] of files) {
    const full = join(SNAPSHOT_DIR, path);
    if (!existsSync(full)) differences.push(`added:   ${path}`);
    else if ((await readFile(full, "utf8")).replace(/\r\n/g, "\n") !== content) differences.push(`changed: ${path}`);
  }
  for (const path of existing) if (!files.has(path)) differences.push(`removed: ${path}`);
  if (differences.length) {
    console.log(`\nBaseline differences (${differences.length}):\n${differences.join("\n")}`);
    console.log("To inspect: run `npm run baseline:capture`, then `git diff tests/baseline/snapshots`.");
    return 1;
  }
  console.log(`\nBaseline check passed: ${files.size} snapshot files identical.`);
  return 0;
}

async function listFiles(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await listFiles(join(dir, entry.name), rel)));
    else out.push(rel);
  }
  return out;
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
