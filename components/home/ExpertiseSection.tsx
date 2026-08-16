import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, HardHat, Megaphone, Workflow, type LucideIcon } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

interface SupportingCard {
  id: "systems" | "communication";
  title: string;
  description: string;
  focusAreas: string[];
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  objectPosition: string;
  number: string;
  accent: "sky" | "amber";
}

const SUPPORTING_CARDS: SupportingCard[] = [
  {
    id: "systems",
    title: "EHS Systems & Digital Tools",
    description:
      "Using practical digital tools to improve safety reporting, inspections, records and corrective-action follow-up.",
    focusAreas: [
      "Digital Safety Reporting",
      "Inspection Workflows",
      "Corrective-Action Tracking",
      "Structured EHS Records",
    ],
    icon: Workflow,
    image: "/images/home/expertise-ehs-systems-dashboard.png",
    imageAlt:
      "Rugged tablet mounted on industrial equipment displaying an EHS monitoring dashboard with safety checklist and status indicators",
    objectPosition: "object-center",
    number: "02",
    accent: "sky",
  },
  {
    id: "communication",
    title: "Digital Communication",
    description:
      "Turning safety and professional information into clear content that organisations and audiences can understand and act on.",
    focusAreas: ["Safety Content Strategy", "Social Media & GBP", "Website Content", "Performance Reporting"],
    icon: Megaphone,
    image: "/images/home/expertise-digital-communication-workspace.webp",
    imageAlt:
      "Laptop and tablet displaying safety content and performance analytics dashboards on a desk beside a hard hat and notebook",
    objectPosition: "object-[60%_35%]",
    number: "03",
    accent: "amber",
  },
];

function FocusList({
  items,
  layout,
  checkClasses,
  textHoverClasses,
  rowHoverClasses,
}: {
  items: string[];
  layout: "grid" | "list";
  checkClasses: string;
  textHoverClasses: string;
  rowHoverClasses: string;
}) {
  return (
    <ul className={layout === "grid" ? "grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2" : "flex flex-col gap-1"}>
      {items.map((item) => (
        <li key={item}>
          <span
            className={`group/item -mx-1.5 flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs text-slate-600 transition-colors duration-300 dark:text-slate-400 ${rowHoverClasses}`}
          >
            <Check
              className={`h-3 w-3 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover/item:translate-x-0.5 motion-reduce:[@media(hover:hover)]:group-hover/item:translate-x-0 ${checkClasses}`}
              aria-hidden
            />
            <span className={`transition-colors duration-300 ${textHoverClasses}`}>{item}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ExpertiseSection() {
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="relative overflow-hidden border-t border-slate-200 bg-slate-50/60 pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-20 lg:pb-14 dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,black_30%,transparent_100%)] dark:opacity-[0.12] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10"
      />

      <Container className="relative flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <Reveal className="flex items-center gap-3">
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">02</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-700 dark:text-amber-400">
              Core Expertise
            </span>
          </Reveal>

          <Reveal delay={40} ariaHidden className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <Reveal delay={80} className="lg:col-span-7">
              <h2
                id="expertise-heading"
                className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
              >
                EHS Expertise Supported by Practical Digital Capability
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5 lg:self-end">
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                My work is grounded in occupational safety and health, supported by digital
                systems that improve reporting and follow-up, and communication that helps
                important information reach the right people.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:items-start lg:gap-6">
          {/* Primary: Occupational Safety & Health */}
          <Reveal
            delay={160}
            className="sm:col-span-2 lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <div className="group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-[600ms] ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-amber-300 [@media(hover:hover)]:hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:[@media(hover:hover)]:hover:border-amber-500/50">
              <div className="relative aspect-[5/2] w-full shrink-0 overflow-hidden">
                <Reveal variant="image" duration={700} className="absolute inset-0 z-0">
                  <Image
                    src="/images/home/expertise-osh-safety-inspection.webp"
                    alt="Safety inspector in a hard hat and hi-vis coveralls reviewing a tablet while walking an industrial facility floor"
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover object-center transition-transform duration-[600ms] ease-out motion-reduce:[@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:scale-[1.04]"
                  />
                </Reveal>
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent transition-[background] duration-[600ms] [@media(hover:hover)]:group-hover:via-slate-950/25"
                />

                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 transition-transform duration-[600ms] motion-reduce:[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:-translate-y-[3px]">
                    <HardHat className="h-4 w-4 text-amber-400" aria-hidden />
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-400">
                      Primary Expertise
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="h-[2px] w-8 rounded-full bg-amber-400 transition-[width] duration-[600ms] motion-reduce:[@media(hover:hover)]:group-hover:w-8 [@media(hover:hover)]:group-hover:w-12"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5 p-6 sm:p-7">
                <span className="text-xs font-semibold tracking-wide text-slate-300 dark:text-slate-600">01</span>
                <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-50">
                  Occupational Safety &amp; Health
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Identifying workplace hazards, assessing risk and helping organisations
                  establish practical safety measures that respond to real working conditions.
                </p>

                <FocusList
                  layout="grid"
                  items={[
                    "Risk Assessment",
                    "OSH & Fire Safety Audits",
                    "Hazard Identification",
                    "Safety Documentation",
                  ]}
                  checkClasses="text-amber-600 [@media(hover:hover)]:group-hover:text-amber-500 dark:text-amber-400 dark:[@media(hover:hover)]:group-hover:text-amber-300"
                  textHoverClasses="[@media(hover:hover)]:group-hover/item:text-amber-700 dark:[@media(hover:hover)]:group-hover/item:text-amber-300"
                  rowHoverClasses="[@media(hover:hover)]:hover:bg-amber-50 dark:[@media(hover:hover)]:hover:bg-amber-500/10"
                />

                <p className="mt-6 flex flex-wrap items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Risk awareness
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-[600ms] motion-reduce:[@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                  Practical controls
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-[600ms] motion-reduce:[@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                  Safer work
                </p>
              </div>
            </div>
          </Reveal>

          {SUPPORTING_CARDS.map((card, index) => {
            const CardIcon = card.icon;
            const isSky = card.accent === "sky";

            return (
              <Reveal
                key={card.id}
                delay={220 + index * 60}
                className={`lg:col-span-5 lg:col-start-8 ${index === 0 ? "lg:row-start-1" : "lg:row-start-2"}`}
              >
                <div
                  className={`group relative flex h-full overflow-hidden rounded-[22px] border bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-lg dark:bg-slate-800 ${
                    isSky
                      ? "border-slate-200 [@media(hover:hover)]:hover:border-sky-300 dark:border-slate-700 dark:[@media(hover:hover)]:hover:border-sky-400/50"
                      : "border-slate-200 [@media(hover:hover)]:hover:border-amber-300 dark:border-slate-700 dark:[@media(hover:hover)]:hover:border-amber-400/50"
                  }`}
                >
                  <div className="flex w-[64%] flex-col justify-center gap-1.5 p-4 sm:w-[62%]">
                    <span className="text-[0.65rem] font-semibold tracking-wide text-slate-300 dark:text-slate-600">
                      {card.number}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <CardIcon
                        className={`h-4 w-4 shrink-0 transition-transform duration-500 motion-reduce:[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:-translate-y-[3px] ${
                          isSky ? "text-sky-600 dark:text-sky-400" : "text-amber-600 dark:text-amber-400"
                        }`}
                        aria-hidden
                      />
                      <span
                        className={`text-[0.6rem] font-semibold uppercase tracking-[0.12em] ${
                          isSky ? "text-sky-700 dark:text-sky-400" : "text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        Supporting Capability
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-50">
                      {card.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{card.description}</p>

                    <div
                      className={`-mx-1.5 rounded-lg px-1.5 py-1 transition-colors duration-500 ${
                        isSky
                          ? "[@media(hover:hover)]:group-hover:bg-sky-50 dark:[@media(hover:hover)]:group-hover:bg-sky-500/10"
                          : "[@media(hover:hover)]:group-hover:bg-amber-50 dark:[@media(hover:hover)]:group-hover:bg-amber-500/10"
                      }`}
                    >
                      <FocusList
                        layout="list"
                        items={card.focusAreas}
                        checkClasses={isSky ? "text-sky-600 dark:text-sky-400" : "text-amber-600 dark:text-amber-400"}
                        textHoverClasses={
                          isSky
                            ? "[@media(hover:hover)]:group-hover/item:text-sky-700 dark:[@media(hover:hover)]:group-hover/item:text-sky-300"
                            : "[@media(hover:hover)]:group-hover/item:text-amber-700 dark:[@media(hover:hover)]:group-hover/item:text-amber-300"
                        }
                        rowHoverClasses={
                          isSky
                            ? "[@media(hover:hover)]:hover:bg-sky-100/70 dark:[@media(hover:hover)]:hover:bg-sky-500/15"
                            : "[@media(hover:hover)]:hover:bg-amber-100/70 dark:[@media(hover:hover)]:hover:bg-amber-500/15"
                        }
                      />
                    </div>
                  </div>

                  <div className="relative w-[36%] shrink-0 overflow-hidden sm:w-[38%]">
                    <Reveal variant="image" duration={700} delay={60} className="absolute inset-0 z-0">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 12rem, (min-width: 640px) 10rem, 40vw"
                        className={`object-cover transition-transform duration-500 ease-out motion-reduce:[@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:scale-[1.04] ${card.objectPosition}`}
                      />
                    </Reveal>
                    <div
                      aria-hidden
                      className={`absolute inset-0 z-10 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-0 ${
                        isSky ? "bg-sky-500/10" : "bg-amber-500/10"
                      }`}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={340} className="flex justify-start lg:justify-end">
          <Link
            href="/expertise"
            className="group/link relative inline-flex w-fit items-center gap-1.5 border-b border-slate-300 pb-1 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:text-amber-400"
          >
            Explore My Expertise
            <ArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 text-amber-600 transition-transform duration-300 group-hover/link:translate-x-1 dark:text-amber-400"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-600 transition-transform duration-[350ms] ease-out group-hover/link:scale-x-100 motion-reduce:transition-none dark:bg-amber-400"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
