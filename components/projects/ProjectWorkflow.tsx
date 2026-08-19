import { ArrowRight } from "lucide-react";

export default function ProjectWorkflow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Process flow">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {step}
          </span>
          {index < steps.length - 1 ? (
            <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
