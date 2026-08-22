import { Calendar, Globe2, LineChart, Megaphone, Share2 } from "lucide-react";

const FOCUS_AREAS = [
  { label: "Social Media", icon: Share2 },
  { label: "Website Content", icon: Globe2 },
  { label: "Performance Reporting", icon: LineChart },
];

const PLATFORMS = ["LinkedIn", "Google Business Profile", "Website"];

const RESPONSIBILITIES = [
  { label: "Safety Content Planning", icon: Calendar, tag: "Ongoing" },
  { label: "Social & Website Publishing", icon: Megaphone, tag: "Ongoing" },
  { label: "Analytics & Reporting", icon: LineChart, tag: "Monthly" },
];

export default function SocialPresenceMockup() {
  return (
    <div aria-hidden className="flex h-full w-full flex-col bg-white dark:bg-slate-950">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">Safetec Solutions</span>
        <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
          Active Professional Work
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-5 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          {FOCUS_AREAS.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-4 text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium leading-tight text-slate-600 dark:text-slate-400">
                  {tile.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Platforms Managed
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((platform) => (
              <span
                key={platform}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
          {RESPONSIBILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                  <Icon className="h-3 w-3" />
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
