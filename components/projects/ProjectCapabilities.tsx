import type { ProjectCapability } from "@/types";

export default function ProjectCapabilities({ capabilities }: { capabilities: ProjectCapability[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {capabilities.map((capability) => (
        <li
          key={capability.label}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            capability.planned
              ? "border-dashed border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-500"
              : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
          }`}
        >
          {capability.label}
          {capability.planned ? <span className="text-slate-400 dark:text-slate-600"> · Planned</span> : null}
        </li>
      ))}
    </ul>
  );
}
