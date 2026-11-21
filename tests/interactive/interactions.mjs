#!/usr/bin/env node
// Interactive behaviour tests for the public site (assertion-based, not snapshots).
//
//   npm run build && npm run test:interactive
//
// Covers behaviour the Stage 2 baseline does not exercise: insights topic filtering and
// pagination, FAQ accordions, mobile navigation, theme switching and contact-form validation
// and states. Contact-form submissions are intercepted in the browser (CDP Fetch domain) and
// answered with mocked responses, so no request reaches /api/contact or Brevo.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findBrowser, launchBrowser, openPage, sleep } from "../baseline/lib/cdp.mjs";
import { startServer } from "../baseline/lib/server.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PORT = Number(process.env.INTERACTIVE_PORT ?? 3997);

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 1, mobile: true };

const results = [];
let BASE;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${message}\n      expected: ${e}\n      actual:   ${a}`);
}

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.log(`  ✗ ${name}\n      ${error.message}`);
  }
}

async function preparePage(page, viewport, colorScheme = "light") {
  await page.send("Emulation.setDeviceMetricsOverride", viewport);
  await page.send("Emulation.setTouchEmulationEnabled", { enabled: viewport.mobile });
  await page.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: colorScheme },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
}

/** Retry a check until it passes (absorbs hydration/animation timing). */
async function waitUntil(page, expression, { timeout = 8000, interval = 150, message } = {}) {
  const started = Date.now();
  let last;
  while (Date.now() - started < timeout) {
    last = await page.evaluate(expression);
    if (last) return last;
    await sleep(interval);
  }
  throw new Error(message ?? `Timed out waiting for: ${expression}`);
}

const click = (page, selector) =>
  page.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error("missing " + ${JSON.stringify(selector)}); el.click(); return true; })()`);

const clickByText = (page, scopeSelector, text) =>
  page.evaluate(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(scopeSelector)})].find((e) => e.textContent.trim() === ${JSON.stringify(text)});
    if (!el) throw new Error("no element with text " + ${JSON.stringify(text)});
    el.click();
    return true;
  })()`);

/** Wait until React has hydrated: clicking does something observable. */
async function clickUntil(page, selector, checkExpression) {
  for (let attempt = 0; attempt < 30; attempt++) {
    await click(page, selector);
    await sleep(200);
    if (await page.evaluate(checkExpression)) return;
  }
  throw new Error(`Clicking ${selector} never satisfied: ${checkExpression}`);
}

// ─────────────────────────── insights grid ───────────────────────────

const GRID_STATE = `(() => {
  const filters = [...document.querySelectorAll('[role="group"][aria-label="Filter insights by topic"] button')];
  const list = document.querySelector('section[aria-labelledby="latest-insights-heading"]');
  const cards = [...list.querySelectorAll("article")].map((card) => ({
    category: card.querySelector("span")?.textContent.trim(),
    title: card.querySelector("h3")?.textContent.trim(),
  }));
  const pagination = list.querySelector('nav[aria-label="Insights pagination"]');
  return {
    filters: filters.map((b) => ({ label: b.textContent.trim(), pressed: b.getAttribute("aria-pressed") })),
    cards,
    currentPage: pagination?.querySelector('[aria-current="page"]')?.textContent.trim() ?? null,
    pageButtons: pagination ? [...pagination.querySelectorAll("ol button")].map((b) => b.textContent.trim()) : [],
    prevDisabled: pagination?.querySelector('[aria-label="Previous page"]')?.disabled ?? null,
    nextDisabled: pagination?.querySelector('[aria-label="Next page"]')?.disabled ?? null,
    emptyMessage: list.textContent.includes("No articles in this topic yet."),
  };
})()`;

async function insightsTests(page) {
  await page.send("Page.bringToFront");
  await page.navigate(`${BASE}/insights`);
  const initial = await page.evaluate(GRID_STATE);

  await test("insights: 'All' filter is active initially and page 1 shows at most 6 cards", async () => {
    assert(initial.filters.length >= 2, "expected at least 'All' plus one topic");
    assertEqual(initial.filters[0], { label: "All", pressed: "true" }, "first filter should be the pressed 'All'");
    assert(initial.filters.slice(1).every((f) => f.pressed === "false"), "other filters should not be pressed");
    assert(initial.cards.length > 0 && initial.cards.length <= 6, `page 1 should show 1–6 cards, got ${initial.cards.length}`);
  });

  // Collect every card across all pages under "All".
  const allCards = [...initial.cards];
  if (initial.pageButtons.length > 1) {
    await clickUntil(page, 'nav[aria-label="Insights pagination"] [aria-label="Next page"]', `(${GRID_STATE}).currentPage === "2"`);
    let state = await page.evaluate(GRID_STATE);
    allCards.push(...state.cards);
    while (!state.nextDisabled) {
      await click(page, 'nav[aria-label="Insights pagination"] [aria-label="Next page"]');
      await sleep(250);
      state = await page.evaluate(GRID_STATE);
      allCards.push(...state.cards);
    }
  }

  await test("insights: pagination shows each article once, with correct prev/next states", async () => {
    const titles = allCards.map((c) => c.title);
    assertEqual(new Set(titles).size, titles.length, "no article should appear on two pages");
    assertEqual(initial.pageButtons.length, Math.max(1, Math.ceil(allCards.length / 6)), "page count should be ceil(articles / 6)");
    if (initial.pageButtons.length > 1) {
      assertEqual(initial.prevDisabled, true, "'Previous' disabled on page 1");
      const last = await page.evaluate(GRID_STATE);
      assertEqual(last.nextDisabled, true, "'Next' disabled on the last page");
      assertEqual(last.currentPage, String(initial.pageButtons.length), "aria-current on the last page number");
    }
  });

  await test("insights: clicking a page number and 'Previous' returns to the original page 1", async () => {
    if (initial.pageButtons.length < 2) return;
    await clickByText(page, 'nav[aria-label="Insights pagination"] ol button', "1");
    await sleep(250);
    const back = await page.evaluate(GRID_STATE);
    assertEqual(back.cards, initial.cards, "page 1 content should match the initial render");
    await clickByText(page, 'nav[aria-label="Insights pagination"] ol button', "2");
    await sleep(250);
    await click(page, 'nav[aria-label="Insights pagination"] [aria-label="Previous page"]');
    await sleep(250);
    assertEqual((await page.evaluate(GRID_STATE)).currentPage, "1", "'Previous' from page 2 should land on page 1");
  });

  await test("insights: each topic filter shows only its own articles; counts add up to 'All'", async () => {
    let total = 0;
    for (const filter of initial.filters.slice(1)) {
      // Start each topic from page 2 (when it exists) to prove filtering resets to page 1.
      if (initial.pageButtons.length > 1) {
        await clickByText(page, '[role="group"][aria-label="Filter insights by topic"] button', "All");
        await sleep(200);
        await clickByText(page, 'nav[aria-label="Insights pagination"] ol button', "2");
        await sleep(200);
      }
      await clickByText(page, '[role="group"][aria-label="Filter insights by topic"] button', filter.label);
      await sleep(300);
      const state = await page.evaluate(GRID_STATE);
      const pressed = state.filters.filter((f) => f.pressed === "true").map((f) => f.label);
      assertEqual(pressed, [filter.label], `only '${filter.label}' should be pressed`);
      assert(state.cards.length > 0 && !state.emptyMessage, `'${filter.label}' should list at least one article`);
      assert(state.cards.every((c) => c.category === filter.label), `'${filter.label}' shows a card from another topic`);
      assert(state.currentPage === null || state.currentPage === "1", `'${filter.label}' should reset to page 1`);
      total += allCards.filter((c) => c.category === filter.label).length;
    }
    assertEqual(total, allCards.length, "topic counts should sum to the 'All' count");
  });

  await test("insights: featured article stays visible while filtering; 'All' restores the list", async () => {
    const featuredTitle = () =>
      page.evaluate(`document.querySelector('section[aria-labelledby="latest-insights-heading"]').previousElementSibling?.querySelector("h2, h3")?.textContent.trim() ?? null`);
    const before = await featuredTitle();
    await clickByText(page, '[role="group"][aria-label="Filter insights by topic"] button', initial.filters.at(-1).label);
    await sleep(250);
    assertEqual(await featuredTitle(), before, "featured article should not change with the filter");
    await clickByText(page, '[role="group"][aria-label="Filter insights by topic"] button', "All");
    await sleep(250);
    const restored = await page.evaluate(GRID_STATE);
    assertEqual(restored.cards, initial.cards, "'All' should restore the initial page 1");
  });
}

// ─────────────────────────── FAQ accordions ───────────────────────────

function accordionState(triggerPrefix) {
  return `(() => [...document.querySelectorAll('button[id^="${triggerPrefix}"]')].map((b) => {
    const panel = document.getElementById(b.getAttribute("aria-controls"));
    return { id: b.id, expanded: b.getAttribute("aria-expanded"), panelOpen: panel ? panel.getBoundingClientRect().height > 1 : null };
  }))()`;
}

async function accordionTests(page, label, path, triggerPrefix) {
  await page.send("Page.bringToFront");
  await page.navigate(BASE + path);
  const initial = await page.evaluate(accordionState(triggerPrefix));

  await test(`${label}: initial state is consistent (aria-expanded matches the visible panel)`, async () => {
    assert(initial.length >= 2, `expected at least 2 FAQ items, got ${initial.length}`);
    assert(initial.every((i) => (i.expanded === "true") === i.panelOpen), "aria-expanded must match panel visibility");
    assert(initial.filter((i) => i.expanded === "true").length <= 1, "at most one item open initially");
  });

  await test(`${label}: opening an item closes the others; clicking it again closes it`, async () => {
    const target = initial.find((i) => i.expanded !== "true");
    await clickUntil(page, `#${target.id}`, `document.getElementById(${JSON.stringify(target.id)}).getAttribute("aria-expanded") === "true"`);
    await sleep(150);
    let state = await page.evaluate(accordionState(triggerPrefix));
    assertEqual(state.filter((i) => i.expanded === "true").map((i) => i.id), [target.id], "only the clicked item should be open");
    assert(state.find((i) => i.id === target.id).panelOpen, "the clicked item's panel should be visible");
    await click(page, `#${target.id}`);
    await sleep(200);
    state = await page.evaluate(accordionState(triggerPrefix));
    assert(state.every((i) => i.expanded === "false" && !i.panelOpen), "all items should be closed after clicking the open one");
  });
}

// ─────────────────────────── mobile navigation ───────────────────────────

async function mobileNavTests(page) {
  await page.send("Page.bringToFront");
  await page.navigate(`${BASE}/`);
  const menuState = `(() => {
    const b = document.querySelector('button[aria-controls="mobile-nav"]');
    return { expanded: b.getAttribute("aria-expanded"), panelOpen: document.getElementById("mobile-nav").getBoundingClientRect().height > 100 };
  })()`;

  await test("mobile nav: menu opens, a link navigates, and the menu is closed afterwards", async () => {
    await clickUntil(page, 'button[aria-controls="mobile-nav"]', `(${menuState}).expanded === "true"`);
    await sleep(400);
    assert((await page.evaluate(menuState)).panelOpen, "panel should be open");
    await clickByText(page, '#mobile-nav a', "Services");
    await waitUntil(page, `location.pathname === "/services"`, { message: "did not navigate to /services" });
    await sleep(400);
    const after = await page.evaluate(menuState);
    assertEqual(after, { expanded: "false", panelOpen: false }, "menu should be closed after navigation");
  });

  await test("mobile nav: inline theme buttons switch to dark", async () => {
    await page.evaluate(`localStorage.removeItem("theme"); true`);
    await page.navigate(`${BASE}/`);
    await clickUntil(page, 'button[aria-controls="mobile-nav"]', `(${menuState}).expanded === "true"`);
    await clickByText(page, '#mobile-nav [role="group"][aria-label="Theme"] button', "Dark");
    await waitUntil(page, `document.documentElement.classList.contains("dark")`, { message: "dark class not applied" });
    assertEqual(await page.evaluate(`localStorage.getItem("theme")`), "dark", "theme persisted to localStorage");
    await page.evaluate(`localStorage.removeItem("theme"); true`);
  });
}

// ─────────────────────────── theme switching ───────────────────────────

async function themeTests(page) {
  // Background tabs don't re-evaluate media queries, so the tab under test must be in front.
  await page.send("Page.bringToFront");
  const toggle = 'header button[aria-haspopup="true"][aria-label^="Theme:"]';
  const isDark = `document.documentElement.classList.contains("dark")`;
  const choose = async (label) => {
    await clickUntil(page, toggle, `!!document.querySelector('[role="group"][aria-label="Theme options"]')`);
    await clickByText(page, '[role="group"][aria-label="Theme options"] button', label);
    await sleep(200);
  };

  await page.evaluate(`localStorage.removeItem("theme"); true`).catch(() => {});
  await page.navigate(`${BASE}/`);
  await page.evaluate(`localStorage.removeItem("theme"); true`);
  await page.navigate(`${BASE}/`);

  await test("theme: defaults to system (light OS preference → no dark class)", async () => {
    assertEqual(await page.evaluate(isDark), false, "light OS preference should render light");
    await waitUntil(page, `document.querySelector(${JSON.stringify(toggle)})?.getAttribute("aria-label") === "Theme: System. Change theme"`, {
      message: "toggle label should report System",
    });
  });

  await test("theme: choosing Dark applies and persists across reload", async () => {
    await choose("Dark");
    assertEqual(await page.evaluate(isDark), true, "dark class after choosing Dark");
    assertEqual(await page.evaluate(`localStorage.getItem("theme")`), "dark", "persisted");
    assert(!(await page.evaluate(`!!document.querySelector('[role="group"][aria-label="Theme options"]')`)), "dropdown closes after choosing");
    await page.navigate(`${BASE}/about`);
    assertEqual(await page.evaluate(isDark), true, "dark persists on another page after reload");
  });

  await test("theme: choosing Light removes dark; System follows the OS preference", async () => {
    await choose("Light");
    assertEqual(await page.evaluate(isDark), false, "light after choosing Light");
    assertEqual(await page.evaluate(`localStorage.getItem("theme")`), "light", "Light persisted");
    await choose("System");
    assertEqual(await page.evaluate(`localStorage.getItem("theme")`), "system", "System persisted");
    assertEqual(await page.evaluate(isDark), false, "System + light OS → light");
    await page.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: "dark" },
        { name: "prefers-reduced-motion", value: "reduce" },
      ],
    });
    await waitUntil(page, isDark, { message: "System + dark OS should switch to dark" });
    await preparePage(page, DESKTOP, "light");
    await waitUntil(page, `!${isDark}`, { message: "System should follow OS back to light" });
  });

  await test("theme: Escape closes the dropdown", async () => {
    await clickUntil(page, toggle, `!!document.querySelector('[role="group"][aria-label="Theme options"]')`);
    await page.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); true`);
    await sleep(200);
    assert(!(await page.evaluate(`!!document.querySelector('[role="group"][aria-label="Theme options"]')`)), "dropdown should close on Escape");
    await page.evaluate(`localStorage.removeItem("theme"); true`);
  });
}

// ─────────────────────────── contact form (mocked network) ───────────────────────────

const FORM_HELPERS = `
window.__set = (selector, value) => {
  const el = document.querySelector(selector);
  const proto = el.tagName === "SELECT" ? HTMLSelectElement.prototype
    : el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
};
window.__invalid = () => [...document.querySelectorAll('#contact-form [aria-invalid="true"]')].map((el) => el.id);
window.__fillValid = () => {
  __set("#contact-name", "Interactive Test");
  __set("#contact-email", "interactive.test@example.com");
  __set("#contact-organisation", "Example Organisation");
  __set("#contact-enquiry-type", "osh");
  __set("#contact-subject", "Mocked submission");
  __set("#contact-message", "Automated interactive test. The request is intercepted and mocked.");
};
true;`;

async function contactFormTests(page) {
  await page.send("Page.bringToFront");
  const intercepted = [];
  let responder = null;
  await page.send("Fetch.enable", { patterns: [{ urlPattern: "*/api/contact*", requestStage: "Request" }] });
  const off = page.onEvent("Fetch.requestPaused", async (params) => {
    intercepted.push({ method: params.request.method, url: new URL(params.request.url).pathname, body: params.request.postData });
    const reply = responder ?? { status: 500, body: { ok: false } };
    if (reply.delayMs) await sleep(reply.delayMs);
    if (reply.networkError) {
      await page.send("Fetch.failRequest", { requestId: params.requestId, errorReason: "Failed" });
      return;
    }
    await page.send("Fetch.fulfillRequest", {
      requestId: params.requestId,
      responseCode: reply.status,
      responseHeaders: [{ name: "content-type", value: "application/json" }],
      body: Buffer.from(JSON.stringify(reply.body)).toString("base64"),
    });
  });

  const load = async () => {
    await page.navigate(`${BASE}/contact`);
    await page.evaluate(FORM_HELPERS);
  };
  const submit = () => click(page, '#contact-form button[type="submit"]');
  const outcome = `(() => {
    const box = document.querySelector('main div[role="alert"]:not(#contact-form *)') || document.querySelector('main div[role="status"]');
    if (!box || document.getElementById("contact-form")) return null;
    return { role: box.getAttribute("role"), heading: box.querySelector("p")?.textContent.trim(), mailto: box.querySelector('a[href^="mailto:"]')?.getAttribute("href") ?? null };
  })()`;

  try {
    await load();

    await test("contact: empty submit flags the five required fields; typing clears a field's error", async () => {
      await clickUntil(page, '#contact-form button[type="submit"]', `__invalid().length > 0`);
      assertEqual(
        await page.evaluate("__invalid()"),
        ["contact-name", "contact-email", "contact-enquiry-type", "contact-subject", "contact-message"],
        "required fields flagged"
      );
      await page.evaluate(`__set("#contact-name", "A"); true`);
      await sleep(150);
      assert(!(await page.evaluate("__invalid()")).includes("contact-name"), "name error should clear after typing");
      assert(!(await page.evaluate(`!!document.getElementById("contact-name-error")`)), "name error message removed");
      assertEqual(intercepted.length, 0, "invalid form must not send a request");
    });

    await test("contact: successful (mocked) submission shows the sent state and posts the expected JSON", async () => {
      responder = { status: 200, body: { ok: true }, delayMs: 800 };
      await page.evaluate("__fillValid(); true");
      await submit();
      await sleep(250);
      const busy = await page.evaluate(`(() => { const b = document.querySelector('#contact-form button[type="submit"]'); return b ? { disabled: b.disabled, text: b.textContent.trim() } : null; })()`);
      assertEqual(busy, { disabled: true, text: "Preparing your message…" }, "submit button shows the in-flight state");
      const result = await waitUntil(page, outcome, { message: "no success state" });
      assertEqual(result.role, "status", "success uses role=status");
      assertEqual(result.heading, "Your message has been sent", "success heading");
      const request = intercepted.at(-1);
      assertEqual([request.method, request.url], ["POST", "/api/contact"], "same-origin POST to /api/contact");
      assertEqual(Object.keys(JSON.parse(request.body)), ["name", "email", "organisation", "phone", "enquiryType", "subject", "message", "hp_field"], "payload fields");
      assertEqual(JSON.parse(request.body).hp_field, "", "honeypot sent empty");
    });

    await test("contact: 'Send another message' returns an empty form", async () => {
      await clickByText(page, 'main div[role="status"] button', "Send another message");
      await waitUntil(page, `!!document.getElementById("contact-form")`);
      assertEqual(await page.evaluate(`document.getElementById("contact-name").value`), "", "fields reset");
    });

    await test("contact: server error (mocked 502) shows the error state with a prefilled mailto; 'Try again' keeps values", async () => {
      responder = { status: 502, body: { ok: false, error: "send_failed" } };
      await page.evaluate("__fillValid(); true");
      await submit();
      const result = await waitUntil(page, outcome, { message: "no error state" });
      assertEqual(result.role, "alert", "error uses role=alert");
      assertEqual(result.heading, "Something went wrong sending your message", "error heading");
      assert(result.mailto.startsWith("mailto:hello@cynthiamueni.com?subject="), "mailto fallback to the public address");
      assert(decodeURIComponent(result.mailto).includes("[Occupational Safety & Health] Mocked submission"), "mailto subject prefilled");
      await clickByText(page, 'main div[role="alert"] button', "Try again");
      await waitUntil(page, `!!document.getElementById("contact-form")`);
      assertEqual(await page.evaluate(`document.getElementById("contact-subject").value`), "Mocked submission", "values preserved after Try again");
    });

    await test("contact: network failure (mocked) shows the error state", async () => {
      responder = { networkError: true };
      await submit();
      const result = await waitUntil(page, outcome, { message: "no error state after network failure" });
      assertEqual(result.role, "alert", "network failure shows the error state");
    });

    await test("contact: { ok: false } with HTTP 200 (mocked) is treated as an error", async () => {
      await load();
      responder = { status: 200, body: { ok: false } };
      await page.evaluate("__fillValid(); true");
      await clickUntil(page, '#contact-form button[type="submit"]', `${outcome} !== null`);
      assertEqual((await page.evaluate(outcome)).role, "alert", "ok:false must not show success");
    });
  } finally {
    off();
    await page.send("Fetch.disable");
  }
  return intercepted.length;
}

// ─────────────────────────── main ───────────────────────────

async function main() {
  const logLines = [];
  const started = await startServer({ root: ROOT, port: PORT, logLines });
  BASE = started.base;
  const browser = await launchBrowser(findBrowser());
  let mockedRequests = 0;
  try {
    const desktop = await openPage(browser.cdp);
    await preparePage(desktop, DESKTOP);
    const mobile = await openPage(browser.cdp);
    await preparePage(mobile, MOBILE);

    console.log("Insights grid");
    await insightsTests(desktop);
    console.log("FAQ accordions");
    await accordionTests(desktop, "insights FAQ", "/insights", "faq-trigger-");
    await accordionTests(desktop, "contact FAQ", "/contact", "contact-faq-trigger-");
    console.log("Mobile navigation");
    await mobileNavTests(mobile);
    console.log("Theme switching");
    await themeTests(desktop);
    console.log("Contact form (mocked network)");
    mockedRequests = await contactFormTests(desktop);
  } finally {
    await browser.close();
    started.server.kill();
  }

  const contactHits = logLines.join("").match(/\[contact\] route_invoked/g)?.length ?? 0;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed. Mocked contact requests: ${mockedRequests}. Real /api/contact invocations: ${contactHits}.`);
  if (contactHits !== 0) {
    console.log("✗ A contact request reached the server; mocks must intercept every submission.");
    return 1;
  }
  return failed.length ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
