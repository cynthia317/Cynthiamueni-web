import { BadgeCheck } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";

const RESPONSIBILITIES = [
  "Social media management",
  "LinkedIn",
  "Google Business Profile",
  "Website content",
  "Safety-focused content planning",
  "Post scheduling",
  "Digital performance monitoring",
  "Monthly analytics / reporting",
];

export default function SafetecExample() {
  return (
    <section aria-label="Digital communication in practice: Safetec Solutions Ltd" className="py-14 sm:py-16">
      <Container>
        <Reveal className="group">
          <div className="flex flex-col gap-6 rounded-3xl border border-violet-200 bg-white p-8 transition-[box-shadow,border-color] duration-300 hover:border-violet-300 hover:shadow-lg dark:border-violet-500/25 dark:bg-slate-900 dark:hover:border-violet-400/50 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:bg-violet-500">
                  <BadgeCheck className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700 dark:text-violet-400">
                    Digital Communication in Practice
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Safetec Solutions Ltd
                  </h3>
                </div>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Occupational Safety &amp; Health Organisation
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Safetec Solutions Ltd is a real, current example of this expertise in practice. It&apos;s not
              a company I own, but an occupational safety and health organisation whose digital
              communication I actively manage and support. It demonstrates that the connection
              between OSH expertise and digital communication capability described on this page is
              already applied, not theoretical.
            </p>

            <ul className="flex flex-wrap gap-2">
              {RESPONSIBILITIES.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
