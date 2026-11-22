// Loads .env.local inside the Vitest worker. Next's loader (@next/env) intentionally skips
// .env.local when NODE_ENV=test, so this uses Node's built-in loader for the development
// integration tests only. The environment guard in lib/db still decides whether to connect.
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
