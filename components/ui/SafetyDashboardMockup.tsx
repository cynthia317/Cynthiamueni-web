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
    <div aria-hidden className="flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="ml-2 text-[0.65rem] font-medium text-slate-400 dark:text-slate-500">
            Safety Management System
          </span>
          <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Concept UI
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {STAT_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2 py-3 text-center dark:border-slate-800 dark:bg-slate-900"
                >
                  <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-[0.6rem] font-medium leading-tight text-slate-600 dark:text-slate-400">
                    {tile.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            {RECORDS.map((record) => (
              <div key={record.label} className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                  {record.label}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold ${STATUS_STYLES[record.tone]}`}
                >
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
