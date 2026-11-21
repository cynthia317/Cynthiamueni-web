// Starts `next start` against the existing production build for local test runs.
// Brevo/contact variables are removed from the server environment so no email can be sent.
import { spawn } from "node:child_process";
import { join } from "node:path";
import { sleep } from "./cdp.mjs";

export const STRIPPED_ENV_VARS = ["BREVO_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];

export async function startServer({ root, port, logLines = [] }) {
  const base = `http://127.0.0.1:${port}`;
  try {
    await fetch(base, { signal: AbortSignal.timeout(1000) });
    throw new Error(`Port ${port} is already in use. Stop that server or choose another port.`);
  } catch (error) {
    if (error.message.startsWith("Port")) throw error;
  }

  const env = { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
  for (const name of STRIPPED_ENV_VARS) delete env[name];

  const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => logLines.push(chunk.toString()));
  server.stderr.on("data", (chunk) => logLines.push(chunk.toString()));

  for (let attempt = 0; attempt < 240; attempt++) {
    try {
      const res = await fetch(base, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return { server, base };
    } catch {
      // not up yet
    }
    if (server.exitCode !== null) throw new Error(`next start exited (code ${server.exitCode}):\n${logLines.join("")}`);
    await sleep(250);
  }
  server.kill();
  throw new Error("next start did not become ready within 60s");
}
