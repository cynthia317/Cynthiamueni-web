import Image from "next/image";
import { HardHat, Code2 } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto hidden w-full max-w-md lg:block">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200 shadow-sm transition-[transform,box-shadow] duration-[1200ms] ease-out hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-slate-800">
        <Image
          src="/images/home/hero-industrial-safety.webp"
          alt="Welder wearing full protective safety equipment while working on a metal fabrication, representing hands-on occupational safety practice"
          fill
          priority
          sizes="(min-width: 1024px) 28rem, 0px"
          className="will-change-transform object-cover transition-[transform,filter] duration-[1400ms] ease-out group-hover:scale-[1.035] group-hover:brightness-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent transition-opacity duration-[1400ms] ease-out group-hover:opacity-75 motion-reduce:transition-none"
        />
      </div>

      <div
        aria-hidden
        className="absolute -left-6 top-8 flex w-48 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
          <HardHat className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Safety-First</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Risk-led systems</p>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute -right-6 bottom-10 flex w-48 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <Code2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Digital Execution</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tools &amp; systems</p>
        </div>
      </div>
    </div>
  );
}
