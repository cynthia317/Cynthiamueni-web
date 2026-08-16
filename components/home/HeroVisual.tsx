import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="group/panel relative mx-auto aspect-[3/4] max-h-[520px] w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950 shadow-lg transition-[transform,border-color,box-shadow] duration-500 ease-out [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-amber-500/40 [@media(hover:hover)]:hover:shadow-xl motion-reduce:[@media(hover:hover)]:hover:translate-y-0 sm:max-w-lg lg:aspect-square lg:max-h-none lg:max-w-[520px] dark:border-slate-800">
      <div className="grid h-full w-full grid-cols-[2fr_1fr] grid-rows-[3fr_2fr] gap-1">
        <div className="group/main relative row-span-2 h-full w-full overflow-hidden">
          <Image
            src="/images/home/ehs-digital-safety-inspection.webp"
            alt="Safety officer wearing a hi-vis vest and hard hat reviewing a digital inspection checklist on a tablet while walking a factory floor"
            fill
            priority
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 21rem, 60vw"
            className="object-cover object-[50%_18%] transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover/main:scale-[1.03] motion-reduce:transition-none motion-reduce:[@media(hover:hover)]:group-hover/main:scale-100"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent transition-opacity duration-700 [@media(hover:hover)]:group-hover/main:opacity-90"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 transition-transform duration-700 [@media(hover:hover)]:group-hover/main:-translate-y-1 sm:p-5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber-400">
              Field Practice
            </span>
            <span className="text-sm font-medium leading-tight text-slate-100">
              Workplace risk &amp; safety
            </span>
          </div>
        </div>

        <div className="group/systems relative h-full w-full overflow-hidden">
          <Image
            src="/images/home/digital-ehs-workplace-safety-systems.webp"
            alt="Digital safety monitoring dashboard displaying live equipment data beside a guarded industrial robotic workstation"
            fill
            sizes="(min-width: 640px) 11rem, 30vw"
            className="object-cover object-[68%_65%] transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover/systems:scale-[1.035] [@media(hover:hover)]:group-hover/systems:brightness-110 motion-reduce:transition-none motion-reduce:[@media(hover:hover)]:group-hover/systems:scale-100"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3">
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-amber-400">
              Digital Systems
            </span>
            <span className="text-[0.68rem] font-medium leading-tight text-slate-100">
              Monitoring &amp; visibility
            </span>
            <span
              aria-hidden
              className="mt-0.5 h-[2px] w-6 rounded-full bg-amber-500/70 transition-[width] duration-500 [@media(hover:hover)]:group-hover/systems:w-10"
            />
          </div>
        </div>

        <div className="group/info relative flex flex-col justify-center gap-3 border-t border-slate-800/80 bg-slate-950 p-4">
          <span aria-hidden className="h-1.5 w-6 rounded-full bg-amber-500" />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-100">
            From Risk to Action
          </p>
          <ol className="flex flex-col gap-1 text-[0.68rem] font-medium tracking-wide text-slate-400 transition-[transform,color] duration-500 [@media(hover:hover)]:group-hover/info:translate-x-1 [@media(hover:hover)]:group-hover/info:text-white motion-reduce:[@media(hover:hover)]:group-hover/info:translate-x-0">
            <li>Identify</li>
            <li>Systemise</li>
            <li>Communicate</li>
            <li>Improve</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
