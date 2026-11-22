// Integration tests against the Neon DEVELOPMENT branch only (`npm run test:db`).
// Not part of `npm test`. Requires .env.local; the environment guard refuses any other target.
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // Next.js handles `import "server-only"` itself; outside Next it's a no-op.
      "server-only": fileURLToPath(new URL("./tests/db/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/db/**/*.test.ts"],
    setupFiles: ["tests/db/setup.ts"], // loads .env.local in the worker
    environment: "node",
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
