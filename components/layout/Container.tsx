import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export default function Container({ children, className = "", maxWidth = "max-w-6xl" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full ${maxWidth} px-6 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
