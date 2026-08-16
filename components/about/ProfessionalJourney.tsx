import { ArrowDown, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import { JOURNEY_STAGES } from "@/lib/data/about";
import type { AccentColor } from "@/types";

const ACCENT: Record<AccentColor, { card: string; hoverBorder: string; icon: string }> = {
  amber: {
    card: "border-amber-200 bg-amber-50/60 dark:border-amber-500/25 dark:bg-amber-500/5",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-400/60",
    icon: "bg-amber-600 text-white dark:bg-amber-500",
  },
  sky: {
    card: "border-sky-200 bg-sky-50/60 dark:border-sky-500/25 dark:bg-sky-500/5",
    hoverBorder: "hover:border-sky-400 dark:hover:border-sky-400/60",
    icon: "bg-sky-600 text-white dark:bg-sky-500",
  },
  violet: {
    card: "border-violet-200 bg-violet-50/60 dark:border-violet-500/25 dark:bg-violet-500/5",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-400/60",
    icon: "bg-violet-600 text-white dark:bg-violet-500",
  },
  emerald: {
    card: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-500/5",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-400/60",
    icon: "bg-emerald-600 text-white dark:bg-emerald-500",
  },
};

// Peer names, one per stage — used to wire connector hover-highlighting below.
const PEER_NAMES = ["osh", "technology", "communication", "improvement"] as const;

// Visual position (flex `order`) for each card: 1, 3, 5, 7 — leaving the even
// slots (2, 4, 6) for the connectors placed after them in the DOM below.
const CARD_ORDER = ["order-1", "order-3", "order-5", "order-7"] as const;

export default function ProfessionalJourney() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="My Journey"
            title="How My Disciplines Connect"
            description="Occupational Safety & Health identifies risks, operational challenges and opportunities. Technology creates the systems and tools that solve them. Communication makes sure people understand and adopt those solutions — and the results feed back into how the work keeps improving."
            id="journey-heading"
          />
        </Reveal>

        {/*
          Cards are placed before connectors in DOM order (independent of their
          visual `order-*` position) so every connector — which trails both of
          its endpoint cards in the DOM — can react to peer-hover from either
          one. peer-hover only matches *later* siblings, so this ordering is
          required. Hovering the middle stages (technology / communication)
          therefore lights up both of their adjacent connectors at once.
        */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
          {JOURNEY_STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const accent = ACCENT[stage.accent];
            const peerName = PEER_NAMES[index];
            return (
              <Reveal
                key={stage.id}
                delay={index * 110}
                className={`group peer/${peerName} ${CARD_ORDER[index]} lg:flex-1`}
              >
                <div
                  className={`flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-colors ${accent.card} ${accent.hoverBorder} hover:shadow-md`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${accent.icon}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {stage.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {stage.description}
                  </p>
                </div>
              </Reveal>
            );
          })}

          {/* osh <-> technology */}
          <div
            aria-hidden
            className="order-2 flex shrink-0 items-center justify-center py-1 text-slate-300 transition-colors duration-300 peer-hover/osh:text-amber-500 peer-hover/technology:text-amber-500 dark:text-slate-700 lg:w-10 lg:py-0"
          >
            <ArrowDown className="h-5 w-5 lg:hidden" />
            <ArrowRight className="hidden h-5 w-5 lg:block" />
          </div>

          {/* technology <-> communication */}
          <div
            aria-hidden
            className="order-4 flex shrink-0 items-center justify-center py-1 text-slate-300 transition-colors duration-300 peer-hover/technology:text-sky-500 peer-hover/communication:text-sky-500 dark:text-slate-700 lg:w-10 lg:py-0"
          >
            <ArrowDown className="h-5 w-5 lg:hidden" />
            <ArrowRight className="hidden h-5 w-5 lg:block" />
          </div>

          {/* communication <-> improvement */}
          <div
            aria-hidden
            className="order-6 flex shrink-0 items-center justify-center py-1 text-slate-300 transition-colors duration-300 peer-hover/communication:text-violet-500 peer-hover/improvement:text-violet-500 dark:text-slate-700 lg:w-10 lg:py-0"
          >
            <ArrowDown className="h-5 w-5 lg:hidden" />
            <ArrowRight className="hidden h-5 w-5 lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
