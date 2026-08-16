import { ArrowDown, BadgeCheck } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { EXPERTISE_AREAS } from "@/lib/data/expertise";
import type { ExpertiseArea, PillarId } from "@/types";

const ROLE_LABEL: Record<PillarId, string> = {
  osh: "Identifies risks, needs & improvement opportunities",
  software: "Builds systems, tools & digital solutions",
  digital: "Translates expertise into clear communication",
};

function Chip({ children }: { children: string }) {
  return (
    <li className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
      {children}
    </li>
  );
}

function PillarCard({
  area,
  primary,
  roleColor,
  iconBoxColor,
  iconSize,
  titleSize,
  badgeColor,
  cardAccent,
  proofAccent,
  peerRowClasses,
  delay,
}: {
  area: ExpertiseArea;
  primary?: boolean;
  roleColor: string;
  iconBoxColor: string;
  iconSize: string;
  titleSize: string;
  badgeColor: string;
  cardAccent: string;
  proofAccent?: string;
  peerRowClasses: string;
  delay: number;
}) {
  const Icon = area.icon;

  return (
    <Reveal
      delay={delay}
      className={`flex flex-col gap-5 rounded-3xl border p-6 transition-colors duration-300 sm:flex-row sm:gap-6 sm:p-8 ${cardAccent} ${peerRowClasses}`}
    >
      <div className={`flex shrink-0 items-center justify-center rounded-2xl ${iconBoxColor} ${iconSize}`}>
        <Icon className={primary ? "h-7 w-7" : "h-6 w-6"} aria-hidden />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <span className={`text-xs font-semibold uppercase tracking-[0.15em] ${roleColor}`}>
          {ROLE_LABEL[area.id]}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <h3 className={`font-semibold text-slate-900 dark:text-slate-50 ${titleSize}`}>{area.title}</h3>
          {area.badge ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white ${badgeColor}`}
            >
              {area.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          {area.summary}
        </p>

        <ul className="flex flex-wrap gap-2">
          {area.capabilities.map((capability) => (
            <Chip key={capability}>{capability}</Chip>
          ))}
        </ul>

        {area.proof ? (
          <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 ${proofAccent}`}>
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="flex flex-col gap-1.5">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <span className="font-semibold">{area.proof.label}: </span>
                {area.proof.text}
              </p>
              {area.proof.flow ? (
                <p className="text-[0.7rem] leading-relaxed text-slate-400 dark:text-slate-500">
                  {area.proof.flow.join(" → ")}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {area.footnote ? (
          <div className="mt-1 border-t border-slate-100 pt-3 dark:border-slate-800">
            <ArrowLink
              href={area.footnote.href}
              external={area.footnote.external}
              className="text-xs text-slate-500 dark:text-slate-500"
            >
              {area.footnote.text}
            </ArrowLink>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

function FlowConnector({
  rowClasses,
  label,
  delay,
}: {
  rowClasses: string;
  label: string;
  delay: number;
}) {
  return (
    <Reveal
      ariaHidden
      delay={delay}
      className={`flex flex-col items-center gap-1.5 text-slate-300 transition-colors duration-500 dark:text-slate-700 ${rowClasses}`}
    >
      <span className="h-6 w-px bg-current sm:h-8" />
      <ArrowDown className="h-4 w-4" />
      <span className="text-center text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-600">
        {label}
      </span>
    </Reveal>
  );
}

export default function ExpertiseSection() {
  const osh = EXPERTISE_AREAS.find((area) => area.id === "osh")!;
  const software = EXPERTISE_AREAS.find((area) => area.id === "software")!;
  const digital = EXPERTISE_AREAS.find((area) => area.id === "digital")!;

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800"
    >
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Core Expertise"
            title="Where Safety, Technology & Communication Connect"
            description="My work connects workplace safety, technology, and digital communication — identifying real problems, building practical systems, and helping organisations communicate and improve effectively."
            id="expertise-heading"
          />
        </Reveal>

        <div className="grid w-full max-w-3xl grid-cols-1">
          {/*
            Cards are placed before connectors in DOM order (independent of their
            visual row-start position) so every connector — which trails both of
            its endpoint cards in the DOM — can react to peer-hover from either one.
            peer-hover only matches *later* siblings, so this ordering is required.
          */}
          <PillarCard
            area={osh}
            primary
            roleColor="text-amber-700 dark:text-amber-400"
            iconBoxColor="bg-amber-600 text-white dark:bg-amber-500"
            iconSize="h-14 w-14"
            titleSize="text-2xl sm:text-3xl"
            badgeColor="bg-amber-600 dark:bg-amber-500"
            cardAccent="border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 dark:border-amber-500/40 dark:from-amber-500/10 dark:to-slate-900 dark:hover:border-amber-400/70"
            peerRowClasses="peer/osh row-start-1"
            delay={60}
          />

          <PillarCard
            area={software}
            roleColor="text-sky-700 dark:text-sky-400"
            iconBoxColor="bg-sky-600 text-white dark:bg-sky-500"
            iconSize="h-12 w-12"
            titleSize="text-xl sm:text-2xl"
            badgeColor="bg-sky-600 dark:bg-sky-500"
            cardAccent="border border-slate-200 bg-white hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-500/50"
            peerRowClasses="peer/software row-start-3"
            delay={180}
          />

          <PillarCard
            area={digital}
            roleColor="text-violet-700 dark:text-violet-400"
            iconBoxColor="bg-violet-600 text-white dark:bg-violet-500"
            iconSize="h-12 w-12"
            titleSize="text-xl sm:text-2xl"
            badgeColor="bg-violet-600 dark:bg-violet-500"
            cardAccent="border border-slate-200 bg-white hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/50"
            proofAccent="border-violet-200 bg-violet-50/70 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-400"
            peerRowClasses="peer/digital row-start-5"
            delay={280}
          />

          <FlowConnector
            rowClasses="row-start-2 peer-hover/osh:text-amber-500 peer-hover/software:text-amber-500"
            label="Identify → Systemise"
            delay={130}
          />

          <FlowConnector
            rowClasses="row-start-4 peer-hover/software:text-sky-500 peer-hover/digital:text-sky-500"
            label="Build → Communicate"
            delay={230}
          />

          <FlowConnector
            rowClasses="row-start-6 peer-hover/digital:text-violet-500"
            label="Measure → Improve"
            delay={320}
          />

          <Reveal
            delay={360}
            className="row-start-7 mt-2 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:justify-center sm:gap-3 peer-hover/osh:border-amber-300 peer-hover/software:border-sky-300 peer-hover/digital:border-violet-300 dark:peer-hover/osh:border-amber-500/50 dark:peer-hover/software:border-sky-500/50 dark:peer-hover/digital:border-violet-500/50"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Together
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                Safer Workplaces
              </span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                •
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400">
                Smarter Systems
              </span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                •
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400">
                Stronger Communication
              </span>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
