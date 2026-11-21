// Minimal Chrome DevTools Protocol client for the baseline script.
// Uses Node's built-in WebSocket (Node >= 22), so no browser-automation dependency is needed.
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BROWSER_CANDIDATES = [
  process.env.BASELINE_BROWSER,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

export function findBrowser() {
  const found = BROWSER_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error("No Chromium-based browser found. Set BASELINE_BROWSER to a Chrome/Edge executable.");
  }
  return found;
}

export async function launchBrowser(executable) {
  const userDataDir = await mkdtemp(join(tmpdir(), "baseline-browser-"));
  const proc = spawn(
    executable,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--disable-features=Translate,MediaRouter",
      "--hide-scrollbars",
      "--mute-audio",
      "--force-color-profile=srgb",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  const wsUrl = await new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("Browser did not start within 30s")), 30_000);
    proc.stderr.on("data", (chunk) => {
      buffer += chunk.toString();
      const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    proc.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Browser exited early (code ${code})`));
    });
  });

  const cdp = await CDP.connect(wsUrl);
  return {
    cdp,
    async close() {
      try {
        await cdp.send("Browser.close");
      } catch {
        // already closed
      }
      cdp.close();
      proc.kill();
      await new Promise((resolve) => setTimeout(resolve, 500));
      await rm(userDataDir, { recursive: true, force: true, maxRetries: 5 }).catch(() => {});
    },
  };
}

export class CDP {
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => resolve(new CDP(ws)), { once: true });
      ws.addEventListener("error", () => reject(new Error("Could not connect to DevTools")), { once: true });
    });
  }

  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Set();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(typeof event.data === "string" ? event.data : event.data.toString());
      if (message.id !== undefined) {
        const entry = this.pending.get(message.id);
        if (!entry) return;
        this.pending.delete(message.id);
        if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
        else entry.resolve(message.result);
        return;
      }
      for (const listener of this.listeners) listener(message);
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject, method }));
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  waitFor(method, sessionId, timeoutMs = 30_000) {
    return new Promise((resolve, reject) => {
      const off = this.on((message) => {
        if (message.method === method && message.sessionId === sessionId) {
          clearTimeout(timer);
          off();
          resolve(message.params);
        }
      });
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
    });
  }

  close() {
    this.ws.close();
  }
}

/** A single browser tab with helpers. */
export async function openPage(cdp) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const send = (method, params) => cdp.send(method, params, sessionId);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");

  const consoleErrors = [];
  const off = cdp.on((message) => {
    if (message.sessionId !== sessionId) return;
    if (message.method === "Runtime.exceptionThrown") {
      consoleErrors.push(`exception: ${message.params.exceptionDetails?.exception?.description ?? message.params.exceptionDetails?.text}`);
    } else if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      consoleErrors.push(`console: ${message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ")}`);
    } else if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      consoleErrors.push(`log: ${message.params.entry.text}`);
    }
  });

  return {
    send,
    consoleErrors,
    async evaluate(expression) {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) {
        throw new Error(`evaluate failed: ${result.exceptionDetails.exception?.description ?? result.exceptionDetails.text}`);
      }
      return result.result.value;
    },
    async navigate(url) {
      consoleErrors.length = 0;
      const loaded = cdp.waitFor("Page.loadEventFired", sessionId, 60_000);
      await send("Page.navigate", { url });
      await loaded;
      await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
      // Let React hydrate and effects settle.
      await sleep(600);
    },
    async close() {
      off();
      await cdp.send("Target.closeTarget", { targetId });
    },
  };
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
