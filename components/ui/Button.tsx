import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "navyOutline";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  secondary:
    "border border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900",
  accent:
    "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400",
  navyOutline:
    "border border-slate-300 text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-6 py-3.5 text-sm",
  sm: "px-5 py-3 text-sm",
};

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600";

const ICON_WRAP =
  "inline-flex transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0";

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  external,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `${BASE} ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className}`;
  const iconWrapped = icon ? <span className={ICON_WRAP}>{icon}</span> : null;
  const isProtocolLink = href.startsWith("mailto:") || href.startsWith("tel:");

  if (isProtocolLink) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
        {iconWrapped}
      </a>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
        {children}
        {iconWrapped}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
      {iconWrapped}
    </Link>
  );
}
