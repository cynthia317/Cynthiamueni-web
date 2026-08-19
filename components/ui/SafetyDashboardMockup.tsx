import { AlertTriangle, ClipboardCheck, CheckCircle2 } from "lucide-react";

const STAT_TILES = [
  { label: "Hazard Reports", icon: AlertTriangle },
  { label: "Inspections", icon: ClipboardCheck },
  { label: "Corrective Actions", icon: CheckCircle2 },
];

const RECORDS = [
  { label: "Loading dock guardrail", status: "Open", tone: "amber" },
  { label: "Fire extinguisher check", status: "Resolved", tone: "green" },
  { label: "PPE compliance walk-through", status: "In Review", tone: "slate" },
];

const STATUS_STYLES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function SafetyDashboardMockup() {
  return (
    <div aria-hidden className="flex h-full w-full flex-col bg-white dark:bg-slate-950">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          Safety Management System
        </span>
        <span className="ml-auto rounded-full bg-slate-200 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Concept UI
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-5 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          {STAT_TILES.map((tile) => {
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
            Risk Overview
          </span>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <span className="h-full w-1/4 bg-emerald-500/70" />
            <span className="h-full w-1/3 bg-amber-500/70" />
            <span className="h-full w-1/6 bg-orange-500/70" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
          {RECORDS.map((record) => (
            <div key={record.label} className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-slate-600 dark:text-slate-400">{record.label}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[record.tone]}`}
              >
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
