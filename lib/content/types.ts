// Content types used by the public site. The canonical interfaces stay in `types/index.ts`
// (the contract every component already uses); this module re-exports them for the content
// layer and adds the derived shapes the access functions return.
import type { Insight } from "@/types";

export type {
  Faq,
  Insight,
  InsightContentBlock,
  Project,
  ProjectCapability,
  ProjectCategory,
  ProjectStatus,
  ProjectTier,
  Service,
} from "@/types";

/**
 * An insight without its article body. Used for listings, cards and anything passed to
 * client components, so full article bodies are only loaded by the article page itself.
 */
export type InsightSummary = Omit<Insight, "content">;
