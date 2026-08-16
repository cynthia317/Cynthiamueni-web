import type { ReactNode } from "react";

type Accent = "amber" | "sky" | "violet";

const ACCENT_CLASSES: Record<Accent, string> = {
  amber:
    "[background-image:linear-gradient(100deg,var(--color-amber-600)_0%,var(--color-amber-600)_40%,var(--color-amber-200)_50%,var(--color-amber-600)_60%,var(--color-amber-600)_100%)] motion-reduce:text-amber-700 dark:[background-image:linear-gradient(100deg,var(--color-amber-400)_0%,var(--color-amber-400)_40%,var(--color-amber-100)_50%,var(--color-amber-400)_60%,var(--color-amber-400)_100%)] dark:motion-reduce:text-amber-400",
  sky: "[background-image:linear-gradient(100deg,var(--color-sky-600)_0%,var(--color-sky-600)_40%,var(--color-sky-200)_50%,var(--color-sky-600)_60%,var(--color-sky-600)_100%)] motion-reduce:text-sky-700 dark:[background-image:linear-gradient(100deg,var(--color-sky-400)_0%,var(--color-sky-400)_40%,var(--color-sky-100)_50%,var(--color-sky-400)_60%,var(--color-sky-400)_100%)] dark:motion-reduce:text-sky-400",
  violet:
    "[background-image:linear-gradient(100deg,var(--color-violet-600)_0%,var(--color-violet-600)_40%,var(--color-violet-200)_50%,var(--color-violet-600)_60%,var(--color-violet-600)_100%)] motion-reduce:text-violet-700 dark:[background-image:linear-gradient(100deg,var(--color-violet-400)_0%,var(--color-violet-400)_40%,var(--color-violet-100)_50%,var(--color-violet-400)_60%,var(--color-violet-400)_100%)] dark:motion-reduce:text-violet-400",
};

export default function LightSweepText({
  children,
  accent,
}: {
  children: ReactNode;
  accent: Accent;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent [background-size:300%_100%] motion-safe:animate-[text-sweep_6s_ease-in-out_infinite] motion-reduce:bg-none motion-reduce:animate-none ${ACCENT_CLASSES[accent]}`}
    >
      {children}
    </span>
  );
}
