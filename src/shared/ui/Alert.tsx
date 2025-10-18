import React from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
  visible: boolean;
  time?: number;
  onClose?: () => void;
}

const tone = {
  success: {
    ring: "focus-visible:ring-emerald-400/40",
    text: "text-emerald-900 dark:text-emerald-100",
    icon: <CheckCircle2 className="h-5 w-5" />,
    liquid:
      "after:[background:radial-gradient(40%_60%_at_20%_15%,theme(colors.emerald.400/0.14),transparent_60%),radial-gradient(55%_45%_at_85%_35%,theme(colors.emerald.200/0.10),transparent_60%)]",
  },
  error: {
    ring: "focus-visible:ring-rose-400/40",
    text: "text-rose-900 dark:text-rose-100",
    icon: <XCircle className="h-5 w-5" />,
    liquid:
      "after:[background:radial-gradient(40%_60%_at_20%_15%,theme(colors.rose.400/0.16),transparent_60%),radial-gradient(55%_45%_at_85%_35%,theme(colors.red.200/0.10),transparent_60%)]",
  },
  info: {
    ring: "focus-visible:ring-cyan-400/40",
    text: "text-cyan-900 dark:text-cyan-100",
    icon: <Info className="h-5 w-5" />,
    liquid:
      "after:[background:radial-gradient(40%_60%_at_20%_15%,theme(colors.cyan.400/0.16),transparent_60%),radial-gradient(55%_45%_at_85%_35%,theme(colors.sky.200/0.10),transparent_60%)]",
  },
};

const formatRelative = (ts?: number) => {
  if (!ts) return "Только что";
  const diffMins = Math.floor((Date.now() - ts) / 60000);
  if (diffMins < 1) return "Только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  const hrs = Math.floor(diffMins / 60);
  return `${hrs} ч назад`;
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  visible,
  time,
  onClose = () => {},
}) => {
  if (!visible) return null;

  const t = tone[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 bottom-6 z-[60] mx-auto w-full max-w-sm px-4",
        "animate-in fade-in slide-in-from-bottom-2 duration-200",
      )}
    >
      <div
        className={cn(
          "group relative isolate overflow-hidden rounded-2xl backdrop-blur-xl",
          "ring-1 ring-[var(--glass-ring)] shadow-glass",
          "bg-white/[0.80] dark:bg-white/[0.08]",
          "before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.2xl)-2px)]",
          "before:bg-gradient-to-b before:from-white/40 before:to-white/[0.06]",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
          "motion-ok:after:animate-liquid-slow",
          t.liquid,
        )}
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
              "motion-ok:animate-[sheen_1.8s_ease-in-out_1]",
            )}
            style={{ willChange: "background-position, opacity, transform" }}
          />
        </span>

        <div className="relative flex items-start gap-3 p-4">
          <div className={cn("mt-0.5 shrink-0", t.text)}>{t.icon}</div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-white/60">
                HiggsSeries
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-white/50">
                {formatRelative(time)}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-800 dark:text-white/90">{message}</p>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all",
              "text-zinc-600 hover:bg-white/[0.65] active:bg-white/80",
              "dark:text-white/70 dark:hover:bg-white/10 dark:active:bg-white/15",
              "focus-visible:outline-none focus-visible:ring-2",
              t.ring,
            )}
            aria-label="Закрыть"
            title="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
