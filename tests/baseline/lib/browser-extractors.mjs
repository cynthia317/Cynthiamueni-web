// Functions in this file are serialised with Function.prototype.toString() and executed
// inside the headless browser. They must be self-contained (no imports, no closures).

/**
 * Parses the raw server HTML (what crawlers receive, before hydration) with DOMParser and
 * returns SEO metadata, structured data and the main content in document order.
 */
export function extractFromRawHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const norm = (value) => (value ?? "").replace(/\s+/g, " ").trim();
  const attr = (el, name) => (el && el.hasAttribute(name) ? el.getAttribute(name) : undefined);
  const stripAssetHash = (url) =>
    url == null
      ? url
      : url
          .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/<asset>")
          .replace(/\?[a-z0-9]{10,}$/i, "");
  const decodeImage = (src) => {
    if (!src || !src.startsWith("/_next/image")) return src;
    const params = new URL(src, "http://local").searchParams;
    return `${params.get("url")} (next/image w=${params.get("w")} q=${params.get("q")})`;
  };
  const metaByName = (name) => attr(doc.querySelector(`meta[name="${name}"]`), "content") ?? null;
  const metaGroup = (selector, keyAttr) =>
    [...doc.querySelectorAll(selector)].map((m) => [m.getAttribute(keyAttr), m.getAttribute("content")]);
  const linkSummary = (a) => ({
    href: stripAssetHash(a.getAttribute("href")),
    text: norm(a.textContent) || null,
    ariaLabel: attr(a, "aria-label"),
    target: attr(a, "target"),
    rel: attr(a, "rel"),
  });
  const textOf = (root) => {
    if (!root) return "";
    const clone = root.cloneNode(true);
    clone.querySelectorAll("script, style, template, noscript").forEach((el) => el.remove());
    return norm(clone.textContent);
  };

  const main = doc.querySelector("main");
  const header = doc.querySelector("body header");
  const footer = doc.querySelector("body footer");
  const inMain = (el) => Boolean(main && main.contains(el));

  const jsonLd = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((script) => {
    try {
      return JSON.parse(script.textContent);
    } catch {
      return { __invalidJsonLd: script.textContent.slice(0, 200) };
    }
  });

  const forms = [...doc.querySelectorAll("form")].map((form) => ({
    id: form.id || null,
    noValidate: form.noValidate,
    fields: [...form.querySelectorAll("input, select, textarea")].map((el) => ({
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      name: attr(el, "name") ?? null,
      type: attr(el, "type"),
      required: el.hasAttribute("required"),
      autocomplete: attr(el, "autocomplete"),
      tabIndex: attr(el, "tabindex"),
      label: el.id ? norm(doc.querySelector(`label[for="${el.id}"]`)?.textContent) || null : null,
      placeholder: attr(el, "placeholder"),
      options: el.tagName === "SELECT" ? [...el.options].map((o) => ({ value: o.value, label: norm(o.textContent) })) : undefined,
    })),
    submitText: norm(form.querySelector('button[type="submit"]')?.textContent) || null,
  }));

  return {
    head: {
      lang: doc.documentElement.getAttribute("lang"),
      title: doc.title,
      titleElementCount: doc.querySelectorAll("title").length,
      description: metaByName("description"),
      keywords: metaByName("keywords"),
      robots: metaByName("robots"),
      googlebot: metaByName("googlebot"),
      canonical: attr(doc.querySelector('link[rel="canonical"]'), "href") ?? null,
      viewport: metaByName("viewport"),
      openGraph: metaGroup('meta[property^="og:"], meta[property^="article:"]', "property"),
      twitter: metaGroup('meta[name^="twitter:"]', "name"),
      icons: [...doc.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => ({
        rel: l.getAttribute("rel"),
        href: stripAssetHash(l.getAttribute("href")),
        type: attr(l, "type"),
        sizes: attr(l, "sizes"),
      })),
    },
    jsonLd,
    content: {
      headings: [...doc.querySelectorAll("h1, h2, h3, h4, h5, h6")]
        .filter(inMain)
        .map((h) => ({ level: Number(h.tagName[1]), text: norm(h.textContent), id: h.id || undefined })),
      h1Count: [...doc.querySelectorAll("h1")].length,
      links: main ? [...main.querySelectorAll("a[href]")].map(linkSummary) : [],
      images: main
        ? [...main.querySelectorAll("img")].map((img) => ({
            src: decodeImage(img.getAttribute("src")),
            alt: img.getAttribute("alt"),
            width: attr(img, "width"),
            height: attr(img, "height"),
            loading: attr(img, "loading"),
            fetchPriority: attr(img, "fetchpriority"),
          }))
        : [],
      buttons: main
        ? [...main.querySelectorAll("button")].map((b) => norm(b.getAttribute("aria-label") || b.textContent))
        : [],
      forms,
      mainText: textOf(main),
    },
    chrome: {
      headerLinks: header ? [...header.querySelectorAll("a[href]")].map(linkSummary) : [],
      headerButtons: header
        ? [...header.querySelectorAll("button")].map((b) => norm(b.getAttribute("aria-label") || b.textContent))
        : [],
      footerLinks: footer ? [...footer.querySelectorAll("a[href]")].map(linkSummary) : [],
      footerText: textOf(footer).replace(/\b20\d\d\b/g, "<year>"),
      floatingLinks: [...doc.querySelectorAll("body > a[href], body a[aria-label*='WhatsApp']")]
        .filter((a) => !(footer && footer.contains(a)) && !(header && header.contains(a)) && !inMain(a))
        .map(linkSummary),
    },
    ids: [...doc.querySelectorAll("[id]")].map((el) => el.id),
  };
}

/** Measures the live, hydrated page at the current viewport. */
export function measureLayout() {
  const visible = (el) => {
    if (!el) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  const header = document.querySelector("body header");
  const primaryNav = document.querySelector('nav[aria-label="Primary"]');
  const menuButton = document.querySelector('button[aria-controls="mobile-nav"]');
  const h1 = document.querySelector("main h1") || document.querySelector("h1");
  const whatsapp = [...document.querySelectorAll('a[aria-label*="WhatsApp"]')].find(
    (a) => !a.closest("footer") && !a.closest("main")
  );
  const headerCta = header ? [...header.querySelectorAll('a[href="/contact"]')].find(visible) : null;
  const themeToggle = header ? [...header.querySelectorAll('[aria-label^="Theme"]')].find(visible) : null;
  const doc = document.documentElement;

  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    horizontalOverflow: doc.scrollWidth > window.innerWidth,
    scrollWidth: doc.scrollWidth,
    header: {
      visible: visible(header),
      position: header ? getComputedStyle(header).position : null,
      heightPx: header ? Math.round(header.getBoundingClientRect().height) : null,
      primaryNavVisible: visible(primaryNav),
      primaryNavLinks: primaryNav ? [...primaryNav.querySelectorAll("a")].filter(visible).map((a) => a.textContent.trim()) : [],
      mobileMenuButtonVisible: visible(menuButton),
      ctaVisible: Boolean(headerCta),
      themeToggleVisible: Boolean(themeToggle),
    },
    h1: h1
      ? {
          text: h1.textContent.replace(/\s+/g, " ").trim(),
          visible: visible(h1),
          fontSizePx: Math.round(parseFloat(getComputedStyle(h1).fontSize)),
        }
      : null,
    footerPresent: Boolean(document.querySelector("body footer")),
    whatsappButtonVisible: visible(whatsapp),
    renderedTitle: document.title,
  };
}
