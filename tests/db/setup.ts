// Loads .env.local inside the Vitest worker for local development runs. Next's loader (@next/env)
// intentionally skips .env.local when NODE_ENV=test, so this uses Node's built-in loader.
// If DATABASE_ENVIRONMENT is already set (a deliberate preview run), nothing is loaded, so local
// values can never mix with injected ones. The environment guard in lib/db still decides.
import { existsSync } from "node:fs";

if (!process.env.DATABASE_ENVIRONMENT && existsSync(".env.local")) process.loadEnvFile(".env.local");
