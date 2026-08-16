import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}

const BASE =
  "group/link inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-100 dark:decoration-slate-700 dark:hover:decoration-slate-100";

export default function ArrowLink({ href, children, external, className = "" }: ArrowLinkProps) {
  const Icon = external ? ExternalLink : ArrowRight;
  const content = (
    <>
      {children}
      <Icon
        className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 motion-reduce:transform-none"
        aria-hidden
      />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${BASE} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${BASE} ${className}`}>
      {content}
    </Link>
  );
}
