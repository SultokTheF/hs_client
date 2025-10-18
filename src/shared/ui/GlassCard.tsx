import React from "react";
import { cn } from "@/shared/lib/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const GlassCard = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl border p-5 shadow-2xl backdrop-blur-xl backdrop-saturate-150 ring-1 ring-inset transition-colors",
        // light
        "border-zinc-200/70 bg-white/70 ring-zinc-200/70 hover:ring-zinc-300/80",
        // dark
        "dark:border-white/10 dark:bg-white/5 dark:ring-white/10 dark:hover:ring-white/20",
        className,
      )}
      {...rest}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:from-white/10 dark:to-white/5" />
      {children}
    </div>
  );
});
GlassCard.displayName = "GlassCard";
