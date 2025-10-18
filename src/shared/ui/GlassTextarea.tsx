import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className, label, hint, error, success, leftIcon, rightIcon, disabled, ...rest } = props;

  const ringBase = "ring-1 ring-inset ring-[var(--glass-ring)]";
  const bgBase = "bg-white/[0.10] dark:bg-white/[0.07] backdrop-blur-xl";
  const textBase = "text-zinc-900 dark:text-white placeholder-zinc-400";
  const radius = "rounded-2xl";
  const paddingX =
    leftIcon && rightIcon
      ? "pl-10 pr-10"
      : leftIcon
        ? "pl-10 pr-4"
        : rightIcon
          ? "pl-4 pr-10"
          : "px-4";

  const stateCls = error
    ? "focus:ring-2 focus:ring-red-400/60"
    : success
      ? "focus:ring-2 focus:ring-emerald-400/60"
      : "focus:ring-2 focus:ring-neon-500/50";

  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span className="text-sm text-zinc-700 dark:text-white/80">{label}</span>}

      <div
        className={cn(
          "group relative",
          radius,
          bgBase,
          ringBase,
          "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.2xl)-2px)] before:bg-gradient-to-b before:from-white/30 before:to-white/[0.05] before:pointer-events-none",
          "shadow-glass",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:[background:radial-gradient(45%_60%_at_25%_15%,theme(colors.neon.500/0.10),transparent_60%),radial-gradient(55%_45%_at_80%_35%,theme(colors.neon.200/0.08),transparent_60%)] motion-ok:after:animate-liquid-slow",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-4 text-zinc-500 dark:text-zinc-400">
            {leftIcon}
          </span>
        )}
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-4 text-zinc-500 dark:text-zinc-400">
            {rightIcon}
          </span>
        )}

        <textarea
          ref={ref}
          className={cn(
            "relative z-10 w-full bg-transparent",
            radius,
            textBase,
            "py-2.5",
            paddingX,
            "focus:outline-none",
            "min-h-[84px] resize-y", // уютный дефолт
            className,
          )}
          disabled={disabled}
          {...rest}
          onFocus={(e) => {
            (e.currentTarget.parentElement as HTMLElement)?.classList.add(...stateCls.split(" "));
          }}
          onBlur={(e) => {
            (e.currentTarget.parentElement as HTMLElement)?.classList.remove(
              ...stateCls.split(" "),
            );
          }}
          aria-invalid={!!error || undefined}
          aria-describedby={hint ? `${rest.id || rest.name}-hint` : undefined}
        />
      </div>

      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span
          id={`${rest.id || rest.name}-hint`}
          className="text-xs text-zinc-500 dark:text-white/50"
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
});
GlassTextarea.displayName = "GlassTextarea";
