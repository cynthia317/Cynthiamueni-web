// Service content access.
//
// Source: static data in `lib/data/services.ts`. Public pages read services only through
// these functions, so a future database-backed implementation replaces the function bodies
// here without changing any call site. The functions are async for that reason.
import { SERVICES } from "@/lib/data/services";
import type { Service } from "./types";

/** All services, in display order. */
export async function getServices(): Promise<Service[]> {
  return [...SERVICES];
}
