import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

type InsightAccent = "amber" | "sky";

interface BaseInsight {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  accent: InsightAccent;
}

type HomeInsight =
  | (BaseInsight & { status: "published"; date: string; readTime: string; href: string })
  | (BaseInsight & { status: "in-preparation" });

// None of these three articles have a published route yet (no /insights/[slug]
// route exists in the app), so all three are accurately marked "in-preparation"
// rather than carrying the placeholder past dates the old card used to show.
const FEATURED_INSIGHT: HomeInsight = {
  id: "risk-assessment-basics",
  title: "Getting Risk Assessments Right in Small Teams",
  category: "Occupational Safety & Health",
  excerpt:
    "Why lightweight, consistently applied risk assessments often protect people better than a thick policy document nobody uses in practice.",
  image: "/images/home/expertise-osh-safety-inspection.webp",
  imageAlt: "Safety professional in a hard hat reviewing a tablet while walking an industrial facility floor",
  accent: "amber",
  status: "in-preparation",
};

const SUPPORTING_INSIGHTS: HomeInsight[] = [
  {
    id: "digital-tools-for-safety-teams",
    title: "Where Digital Tools Actually Help Safety Teams",
    category: "EHS Systems",
    excerpt:
      "A practical look at which parts of workplace safety benefit from digitisation — and where technology can create unnecessary complexity.",
    image: "/images/projects/software-dashboard-review.webp",
    imageAlt: "Dark-themed analytics dashboard displaying monitoring charts, representing a digital EHS interface",
    accent: "sky",
    status: "in-preparation",
  },
  {
    id: "communicating-safety-online",
    title: "Communicating Safety Culture Beyond the Noticeboard",
    category: "EHS Communication",
    excerpt:
      "How organisations can use clear, consistent digital communication to reinforce safety habits rather than simply announce policy.",
    image: "/images/projects/marketing-strategy-flatlay.webp",
    imageAlt: "Smartphone screen showing a folder of social media apps, representing safety content planning",
    accent: "amber",
    status: "in-preparation",
  },
];

const ACCENT_CATEGORY: Record<InsightAccent, string> = {
  amber: "text-amber-700 dark:text-amber-400",
  sky: "text-sky-700 dark:text-sky-400",
};

const ACCENT_CATEGORY_HOVER: Record<InsightAccent, string> = {
  amber: "[@media(hover:hover)]:group-hover:text-amber-500 dark:[@media(hover:hover)]:group-hover:text-amber-300",
  sky: "[@media(hover:hover)]:group-hover:text-sky-500 dark:[@media(hover:hover)]:group-hover:text-sky-300",
};

const ACCENT_BORDER_HOVER: Record<InsightAccent, string> = {
  amber: "[@media(hover:hover)]:hover:border-amber-300 dark:[@media(hover:hover)]:hover:border-amber-500/50",
  sky: "[@media(hover:hover)]:hover:border-sky-300 dark:[@media(hover:hover)]:hover:border-sky-500/50",
};

function StatusBadge({ status }: { status: HomeInsight["status"] }) {
  if (status === "published") return null;
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
      In Preparation
    </span>
  );
}

function FeaturedInsightCard({ insight }: { insight: HomeInsight }) {
  const isPublished = insight.status === "published";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out motion-reduce:[@media(hover:hover)]:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-800 ${
        isPublished
          ? "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-amber-300 [@media(hover:hover)]:hover:shadow-lg dark:[@media(hover:hover)]:hover:border-amber-500/50"
          : "cursor-default [@media(hover:hover)]:hover:border-slate-300 dark:[@media(hover:hover)]:hover:border-slate-600"
      }`}
    >
      <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden">
        <Reveal variant="image" duration={700} className="absolute inset-0 z-0">
          <Image
            src={insight.image}
            alt={insight.imageAlt}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className={`object-cover object-[50%_20%] transition-transform duration-500 ease-out motion-reduce:[@media(hover:hover)]:group-hover:scale-100 ${
              isPublished ? "[@media(hover:hover)]:group-hover:scale-[1.04]" : "[@media(hover:hover)]:group-hover:scale-[1.025]"
            }`}
          />
        </Reveal>
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent transition-[background] duration-500 [@media(hover:hover)]:group-hover:via-slate-950/15"
        />
      </div>

      <div className="flex flex-col gap-2.5 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[0.65rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${ACCENT_CATEGORY[insight.accent]} ${ACCENT_CATEGORY_HOVER[insight.accent]}`}
          >
            {insight.category}
          </span>
          {isPublished ? (
            <span className="text-[0.65rem] text-slate-400 dark:text-slate-500">
              {(insight as Extract<HomeInsight, { status: "published" }>).date} ·{" "}
              {(insight as Extract<HomeInsight, { status: "published" }>).readTime}
            </span>
          ) : (
            <StatusBadge status={insight.status} />
          )}
        </div>

        <h3
          className={`text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-50 transition-colors duration-300 ${
            isPublished ? "[@media(hover:hover)]:group-hover:text-amber-700 dark:[@media(hover:hover)]:group-hover:text-amber-400" : ""
          }`}
        >
          {insight.title}
        </h3>

        <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{insight.excerpt}</p>

        {isPublished ? (
          <Link
            href={(insight as Extract<HomeInsight, { status: "published" }>).href}
            className="relative mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
          >
            Read Article
            <ArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function SupportingInsightRow({ insight }: { insight: HomeInsight }) {
  const isPublished = insight.status === "published";

  return (
    <article className={`group relative flex flex-col gap-4 p-5 sm:flex-row sm:items-stretch ${isPublished ? "" : "cursor-default"}`}>
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-[160px]">
        <Reveal variant="image" duration={700} className="absolute inset-0 z-0">
          <Image
            src={insight.image}
            alt={insight.imageAlt}
            fill
            sizes="(min-width: 640px) 160px, 100vw"
            className={`object-cover transition-transform duration-500 ease-out motion-reduce:[@media(hover:hover)]:group-hover:scale-100 ${
              isPublished ? "[@media(hover:hover)]:group-hover:scale-[1.04]" : "[@media(hover:hover)]:group-hover:scale-[1.025]"
            }`}
          />
        </Reveal>
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/40 via-slate-950/0 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-1.5 transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${ACCENT_CATEGORY[insight.accent]} ${ACCENT_CATEGORY_HOVER[insight.accent]}`}
          >
            {insight.category}
          </span>
          {isPublished ? (
            <span className="text-[0.62rem] text-slate-400 dark:text-slate-500">
              {(insight as Extract<HomeInsight, { status: "published" }>).date}
            </span>
          ) : (
            <StatusBadge status={insight.status} />
          )}
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{insight.title}</h3>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{insight.excerpt}</p>

        {isPublished ? (
          <Link
            href={(insight as Extract<HomeInsight, { status: "published" }>).href}
            className="relative mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400"
          >
            Read Article
            <ArrowRight
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:translate-x-1"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function InsightsSection() {
  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
      className="relative overflow-hidden bg-amber-50/25 pt-14 pb-20 sm:pt-16 lg:pt-16 dark:bg-slate-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_0%_100%,black_25%,transparent_100%)] dark:opacity-[0.08] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />

      <Container className="relative flex flex-col">
        <div className="flex flex-col gap-4">
          <Reveal startOpacity={0.2} className="flex items-center gap-3">
            <span aria-hidden className="h-[2px] w-[30px] shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">05</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-700 dark:text-amber-400">
              Insights
            </span>
          </Reveal>

          <Reveal startOpacity={0.2} ariaHidden className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <Reveal startOpacity={0.2} className="lg:col-span-7">
              <h2
                id="insights-heading"
                className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
              >
                Notes on Safety, Systems &amp; Digital Practice
              </h2>
            </Reveal>
            <Reveal startOpacity={0.2} className="flex flex-col gap-4 lg:col-span-5 lg:self-end">
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                Practical observations on workplace safety, EHS systems and digital
                communication—written to turn professional ideas into clearer, more useful action.
              </p>
              <Link
                href="/insights"
                className="group/link relative inline-flex w-fit items-center gap-1.5 border-b border-slate-300 pb-1 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:text-amber-400"
              >
                View All Insights
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
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal delay={100} duration={700} distance={24} startOpacity={0.2} className="lg:col-span-7">
            <FeaturedInsightCard insight={FEATURED_INSIGHT} />
          </Reveal>

          <div className="flex flex-col divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-5 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
            {SUPPORTING_INSIGHTS.map((insight, index) => (
              <Reveal
                key={insight.id}
                delay={180 + index * 80}
                duration={700}
                distance={24}
                startOpacity={0.2}
                className={`rounded-xl border border-transparent transition-colors duration-300 ${ACCENT_BORDER_HOVER[insight.accent]}`}
              >
                <SupportingInsightRow insight={insight} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
