"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "fade" | "image" | "node" | "line-x" | "line-y";

interface RevealProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  distance?: 16 | 24;
  duration?: 700 | 850 | 1400;
  variant?: RevealVariant;
  /** Hidden-state opacity for the "fade" variant only. Defaults to 0 (existing behaviour). */
  startOpacity?: 0 | 0.2 | 0.3;
  ariaHidden?: boolean;
}

const DISTANCE_CLASSES: Record<16 | 24, string> = {
  16: "translate-y-4",
  24: "translate-y-6",
};

const START_OPACITY_CLASSES: Record<0 | 0.2 | 0.3, string> = {
  0: "opacity-0",
  0.2: "opacity-[0.2]",
  0.3: "opacity-[0.3]",
};

const DURATION_CLASSES: Record<700 | 850 | 1400, string> = {
  700: "duration-[700ms]",
  850: "duration-[850ms]",
  1400: "duration-[1400ms]",
};

const HIDDEN_CLASSES: Record<RevealVariant, string> = {
  fade: "",
  image: "scale-[1.04] opacity-[0.35]",
  node: "translate-y-4 scale-[0.94] opacity-0",
  "line-x": "origin-left scale-x-0",
  "line-y": "origin-top scale-y-0",
};

const VISIBLE_CLASSES: Record<RevealVariant, string> = {
  fade: "translate-y-0 opacity-100",
  image: "scale-100 opacity-100",
  node: "translate-y-0 scale-100 opacity-100",
  "line-x": "origin-left scale-x-100",
  "line-y": "origin-top scale-y-100",
};

const MOTION_REDUCE_CLASSES: Record<RevealVariant, string> = {
  fade: "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
  image: "motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
  node: "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
  "line-x": "motion-reduce:scale-x-100 motion-reduce:transition-none",
  "line-y": "motion-reduce:scale-y-100 motion-reduce:transition-none",
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 24,
  duration = 850,
  variant = "fade",
  startOpacity = 0,
  ariaHidden,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Expand the trigger zone below the viewport so the reveal finishes
      // by the time a fast scroll actually brings the element into view.
      { threshold: 0.15, rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // "fade" keeps its historical distance-driven hidden state; every other
  // variant carries a fixed hidden/visible pair regardless of `distance`.
  const stateClasses = isVisible
    ? VISIBLE_CLASSES[variant]
    : variant === "fade"
      ? `${DISTANCE_CLASSES[distance]} ${START_OPACITY_CLASSES[startOpacity]}`
      : HIDDEN_CLASSES[variant];

  return (
    <div
      ref={ref}
      aria-hidden={ariaHidden || undefined}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
      className={`transition-all ${DURATION_CLASSES[duration]} ease-out ${MOTION_REDUCE_CLASSES[variant]} ${stateClasses} ${className}`}
    >
      {children}
    </div>
  );
}
