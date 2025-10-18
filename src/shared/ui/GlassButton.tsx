/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/shared/lib/cn";
import { Loader } from "@/shared/ui/Loader";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
};

export const GlassButton: React.FC<Props> = ({
  className,
  size = "md",
  variant = "primary",
  loading = false,
  disabled,
  children,
  fullWidth,
  ...rest
}) => {
  const sizeCls =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
        ? "px-5 py-2.5 text-base"
        : "px-4 py-2 text-sm";

  const base =
    "group relative isolate inline-flex items-center justify-center gap-2 rounded-2xl " +
    "backdrop-blur-xl ring-1 transition-all duration-300 motion-ok:animate-breath " +
    "shadow-glass disabled:opacity-60 disabled:cursor-not-allowed " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 " +
    "active:translate-y-[1px] active:scale-[0.99]";

  const primary =
    "ring-[var(--glass-ring)] bg-white/[0.10] dark:bg-white/[0.07] " +
    "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.2xl)-2px)] " +
    "before:bg-gradient-to-b before:from-white/30 before:to-white/[0.05] before:pointer-events-none " +
    "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none " +
    "after:[background:radial-gradient(40%_60%_at_20%_10%,theme(colors.neon.500/0.10),transparent_60%),radial-gradient(55%_45%_at_80%_30%,theme(colors.neon.200/0.08),transparent_60%)] " +
    "motion-ok:after:animate-liquid-slow " +
    "hover:bg-white/[0.12] hover:shadow-glass focus-visible:ring-neon-500/50";

  const ghost =
    "ring-[var(--glass-ring)] bg-transparent hover:bg-white/[0.08] active:bg-white/[0.12] " +
    "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.2xl)-2px)] " +
    "before:bg-white/[0.02] dark:before:bg-white/[0.03] before:pointer-events-none " +
    "focus-visible:ring-neon-500/40";

  const danger =
    "text-red-700 ring-red-300/60 bg-red-100/60 hover:bg-red-100/80 active:bg-red-100 " +
    "dark:text-red-100 dark:ring-red-400/25 dark:bg-red-500/15 dark:hover:bg-red-500/25 " +
    "focus-visible:ring-red-400/50";

  const variantCls = variant === "ghost" ? ghost : variant === "danger" ? danger : primary;

  const loaderSize = size === "lg" ? "md" : "sm";

  return (
    <button
      className={cn(base, sizeCls, variantCls, fullWidth && "w-full", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-live="polite"
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          className={cn(
            "motion-ok:absolute -left-1/3 top-0 h-full w-1/3 rotate-[12deg] opacity-0",
            "bg-gradient-to-r from-transparent via-white/60 to-transparent",
            "transition-opacity duration-300 group-hover:opacity-60",
            "motion-ok:animate-[sheen_1.8s_ease-in-out_1] group-hover:motion-ok:animate-[sheen_1.2s_ease-in-out_1]",
          )}
          style={{ willChange: "background-position, opacity, transform" }}
        />
      </span>

      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-opacity",
          loading && "opacity-0",
        )}
      >
        {children}
      </span>

      {loading && (
        <span className="absolute inset-0 z-10 grid place-items-center">
          <Loader size={loaderSize as any} />
        </span>
      )}
    </button>
  );
};
