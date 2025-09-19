"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type AnimateOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  animationClassName: string;
  threshold?: number;
  triggerOnce?: boolean;
};

export function AnimateOnScroll({
  children,
  className,
  animationClassName,
  threshold = 0.1,
  triggerOnce = true,
}: AnimateOnScrollProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-1000",
        inView ? "opacity-100" : "opacity-0",
        inView && animationClassName,
        className
      )}
    >
      {children}
    </div>
  );
}
