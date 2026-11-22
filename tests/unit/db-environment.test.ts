import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  assertDatabaseEnvironment,
  type DatabaseEnvironment,
  DatabaseEnvironmentError,
  endpointEnvironment,
  expectedDatabaseEnvironment,
  KNOWN_ENDPOINTS,
  neonEndpointId,
  withVerifiedTls,
} from "@/lib/db/environment";

// Synthetic endpoints only; the real endpoint hashes aren't used here.
const PROD = "ep-fake-production-000000";
const PREVIEW = "ep-fake-preview-222222";
const DEV = "ep-fake-development-111111";
const PERSONAL = "ep-fake-personal-333333"; // not in the map
const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const known = new Map<string, DatabaseEnvironment>([
  [sha(PROD), "production"],
  [sha(PREVIEW), "preview"],
  [sha(DEV), "development"],
]);
const url = (endpoint: string, pooled = false) =>
  `postgresql://user:secret-value@${endpoint}${pooled ? "-pooler" : ""}.c-1.us-east-2.aws.neon.tech/neondb?sslmode=require`;
const check = (connectionString: string | undefined, declared: string | undefined, vercelEnv?: string) =>
  assertDatabaseEnvironment({ connectionString, declared, vercelEnv, variableName: "DATABASE_URL", knownEndpoints: known });

describe("database environment guard", () => {
  it("maps VERCEL_ENV to the allowed database environment", () => {
    expect(expectedDatabaseEnvironment("production")).toBe("production");
    expect(expectedDatabaseEnvironment("preview")).toBe("preview");
    expect(expectedDatabaseEnvironment("development")).toBe("development");
    expect(expectedDatabaseEnvironment(undefined)).toBe("development");
  });

  it("extracts the Neon endpoint ID from direct and pooled hosts", () => {
    expect(neonEndpointId(url(DEV))).toBe(DEV);
    expect(neonEndpointId(url(DEV, true))).toBe(DEV);
    expect(endpointEnvironment(url(PREVIEW, true), known)).toBe("preview");
    expect(endpointEnvironment(url(PERSONAL), known)).toBeNull();
  });

  it("knows exactly one endpoint per environment in the real map", () => {
    expect([...KNOWN_ENDPOINTS.values()].sort()).toEqual(["development", "preview", "production"]);
  });

  it("accepts each environment on its own endpoint", () => {
    expect(check(url(DEV, true), "development")).toBe("development");
    expect(check(url(PREVIEW, true), "preview", "preview")).toBe("preview");
    expect(check(url(PROD, true), "production", "production")).toBe("production");
  });

  it("allows development on an unlisted personal endpoint", () => {
    expect(check(url(PERSONAL), "development")).toBe("development");
  });

  it("rejects the production endpoint in development and preview, direct or pooled", () => {
    expect(() => check(url(PROD), "development")).toThrow(/points at the production database/);
    expect(() => check(url(PROD, true), "development")).toThrow(DatabaseEnvironmentError);
    expect(() => check(url(PROD), "preview", "preview")).toThrow(/production database/);
  });

  it("rejects the preview endpoint from a local machine", () => {
    expect(() => check(url(PREVIEW), "development")).toThrow(/points at the preview database/);
  });

  it("rejects the development endpoint, or an unlisted one, in a Preview deployment", () => {
    expect(() => check(url(DEV), "preview", "preview")).toThrow(/points at the development database/);
    expect(() => check(url(PERSONAL), "preview", "preview")).toThrow(/does not point at the preview database/);
  });

  it("rejects DATABASE_ENVIRONMENT that doesn't match the deployment", () => {
    expect(() => check(url(PROD), "production")).toThrow(/expects "development"/);
    expect(() => check(url(PROD), "production", "preview")).toThrow(/expects "preview"/);
    expect(() => check(url(PREVIEW), "preview")).toThrow(/expects "development"/);
  });

  it("rejects production deployments pointing anywhere else", () => {
    expect(() => check(url(DEV), "production", "production")).toThrow(/development database/);
    expect(() => check(url(PERSONAL), "production", "production")).toThrow(/does not point at the production database/);
  });

  it("fails closed on missing or invalid configuration", () => {
    expect(() => check(undefined, "development")).toThrow(/DATABASE_URL is not set/);
    expect(() => check(url(DEV), undefined)).toThrow(/must be one of/);
    expect(() => check(url(DEV), "staging")).toThrow(/must be one of/);
    expect(() => check("not a url", "development")).toThrow(/not a valid URL/);
  });

  it("never includes the connection string or endpoint in error messages", () => {
    expect.assertions(2);
    try {
      check(url(PROD), "development");
    } catch (error) {
      expect(String(error)).not.toContain("secret-value");
      expect(String(error)).not.toContain(PROD);
    }
  });

  it("forces certificate and hostname verification for node-postgres", () => {
    const result = new URL(withVerifiedTls(url(DEV)));
    expect(result.searchParams.get("sslmode")).toBe("verify-full");
  });
});
