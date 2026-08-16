"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

interface ThemeToggleProps {
  variant?: "dropdown" | "inline";
}

export default function ThemeToggle({ variant = "dropdown" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration-safe mount guard (next-themes' recommended pattern): `theme` is
  // undefined on the server and on the first client render, so the real icon
  // can only be shown once we know we're past hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (variant === "inline") {
    return (
      <div className="flex flex-col gap-2">
        <span className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
          Theme
        </span>
        <div
          role="group"
          aria-label="Theme"
          className="grid grid-cols-3 gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900"
        >
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-1 rounded-md px-2 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                  isActive
                    ? "bg-white text-amber-700 shadow-sm dark:bg-slate-800 dark:text-amber-400"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return <ThemeDropdown theme={mounted ? theme : undefined} setTheme={setTheme} />;
}

function ThemeDropdown({
  theme,
  setTheme,
}: {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeOption = OPTIONS.find((option) => option.value === theme);
  const ActiveIcon = activeOption?.icon ?? Monitor;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Theme: ${activeOption?.label ?? "System"}. Change theme`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
      >
        <ActiveIcon className="h-[18px] w-[18px]" aria-hidden />
      </button>

      {open ? (
        <div
          role="group"
          aria-label="Theme options"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                  isActive
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {option.label}
                {isActive ? <Check className="ml-auto h-3.5 w-3.5" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
