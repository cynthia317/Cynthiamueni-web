// Node module hook for running repository TypeScript directly with Node's built-in type stripping
// (used by the seed script; no extra runtime such as tsx). Resolves the "@/..." alias from
// tsconfig.json and extensionless relative imports to .ts/.tsx/index.ts files.
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const EXTENSIONS = [".ts", ".tsx", "/index.ts"];

function withExtension(path) {
  if (existsSync(path) && statSync(path).isFile()) return path;
  for (const ext of EXTENSIONS) if (existsSync(path + ext)) return path + ext;
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate = null;
    if (specifier.startsWith("@/")) candidate = ROOT + specifier.slice(2);
    else if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:") &&
      !context.parentURL.includes("/node_modules/") // only repository files, never dependencies
    ) {
      candidate = fileURLToPath(new URL(specifier, context.parentURL));
    }
    if (candidate) {
      const file = withExtension(candidate);
      if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
  },
});
