/**
 * Database environment guard (Architecture §2.12 item 4).
 *
 * Every database connection, at runtime and in the Prisma CLI, passes through
 * `assertDatabaseEnvironment` first. It fails closed when:
 *  - DATABASE_ENVIRONMENT is missing or invalid;
 *  - DATABASE_ENVIRONMENT doesn't match the deployment (VERCEL_ENV), e.g. "production" on a laptop;
 *  - the URL points at a known endpoint that belongs to a different environment
 *    (e.g. production or preview from a laptop, development from a Preview deployment);
 *  - production or preview point at anything other than their own known endpoint.
 * Development may also use an unlisted endpoint (for example a personal Neon branch).
 *
 * Endpoints are compared by SHA-256 of the Neon endpoint ID, so the repository doesn't publish
 * the identifiers. Error messages never include connection strings.
 *
 * Kept dependency-free (except node:crypto) so prisma.config.ts can import it too.
 */
import { createHash } from "node:crypto";

export type DatabaseEnvironment = "production" | "preview" | "development";

const ENVIRONMENTS: readonly DatabaseEnvironment[] = ["production", "preview", "development"];

/**
 * SHA-256 of each known Neon endpoint ID (project red-forest-05302661), mapped to the only
 * environment allowed to use it. Update this map if an endpoint is ever re-created.
 */
export const KNOWN_ENDPOINTS: ReadonlyMap<string, DatabaseEnvironment> = new Map([
  ["3707bedcdd375d43ec08c51e1795def5954a5ca11a98505a4aaf1c2d5c07c1af", "production"], // branch "production"
  ["6985c08d7f81fa738ce6081e2e218717e0192fea3f4f932df3d63913a2948075", "preview"], // branch "preview"
  ["6dbdcec78a4ebbdef4f3dd86748beb449b46acc5b75d142d3edd6d07a87cbdb7", "development"], // branch "development"
]);

export class DatabaseEnvironmentError extends Error {
  constructor(message: string) {
    super(`Database environment check failed: ${message}`);
    this.name = "DatabaseEnvironmentError";
  }
}

/** The environment a process is allowed to use, derived from Vercel's system variable. */
export function expectedDatabaseEnvironment(vercelEnv: string | undefined): DatabaseEnvironment {
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  return "development"; // local machines and `vercel dev`
}

/** Neon endpoint ID from a connection string's host ("ep-xxx" or "ep-xxx-pooler" → "ep-xxx"). */
export function neonEndpointId(connectionString: string): string {
  let host: string;
  try {
    host = new URL(connectionString).hostname;
  } catch {
    throw new DatabaseEnvironmentError("the connection string is not a valid URL");
  }
  return host.split(".")[0].replace(/-pooler$/, "");
}

/** The environment a connection string's endpoint belongs to, or null if it isn't a known endpoint. */
export function endpointEnvironment(
  connectionString: string,
  knownEndpoints: ReadonlyMap<string, DatabaseEnvironment> = KNOWN_ENDPOINTS,
): DatabaseEnvironment | null {
  const hash = createHash("sha256").update(neonEndpointId(connectionString)).digest("hex");
  return knownEndpoints.get(hash) ?? null;
}

export function isProductionEndpoint(
  connectionString: string,
  knownEndpoints: ReadonlyMap<string, DatabaseEnvironment> = KNOWN_ENDPOINTS,
): boolean {
  return endpointEnvironment(connectionString, knownEndpoints) === "production";
}

export interface DatabaseEnvironmentInput {
  connectionString: string | undefined;
  declared: string | undefined; // DATABASE_ENVIRONMENT
  vercelEnv: string | undefined; // VERCEL_ENV
  variableName: string; // for error messages only
  knownEndpoints?: ReadonlyMap<string, DatabaseEnvironment>;
}

export function assertDatabaseEnvironment(input: DatabaseEnvironmentInput): DatabaseEnvironment {
  const { connectionString, declared, vercelEnv, variableName, knownEndpoints = KNOWN_ENDPOINTS } = input;

  if (!connectionString) throw new DatabaseEnvironmentError(`${variableName} is not set`);
  if (!declared || !ENVIRONMENTS.includes(declared as DatabaseEnvironment)) {
    throw new DatabaseEnvironmentError("DATABASE_ENVIRONMENT must be one of production, preview or development");
  }
  const environment = declared as DatabaseEnvironment;
  const expected = expectedDatabaseEnvironment(vercelEnv);
  if (environment !== expected) {
    throw new DatabaseEnvironmentError(`DATABASE_ENVIRONMENT is "${environment}" but this deployment expects "${expected}"`);
  }

  const owner = endpointEnvironment(connectionString, knownEndpoints);
  if (owner !== null && owner !== environment) {
    throw new DatabaseEnvironmentError(`${variableName} points at the ${owner} database, which is not allowed in ${environment}`);
  }
  if (owner === null && environment !== "development") {
    throw new DatabaseEnvironmentError(`${variableName} does not point at the ${environment} database`);
  }
  return environment;
}

/**
 * Runtime TLS: require full certificate and hostname verification with node-postgres.
 * (pg currently treats "require" as verify-full but will adopt weaker libpq semantics in v9.)
 */
export function withVerifiedTls(connectionString: string): string {
  const url = new URL(connectionString);
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}
