import React, { useEffect, useRef } from "react";
import { GlassModal } from "@/shared/ui/GlassModal";
import { GlassButton } from "@/shared/ui/GlassButton";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "danger" | "default";
};

export const ConfirmDialog: React.FC<Props> = ({
  open,
  title = "Подтверждение",
  description = "Вы уверены, что хотите продолжить?",
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
  tone = "default",
}) => {
  const confirmBtnVariant = tone === "danger" ? "danger" : "primary";
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      } else if (e.key === "Enter") {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        const isTextInput =
          tag === "input" ||
          tag === "textarea" ||
          (document.activeElement as HTMLElement)?.isContentEditable;
        if (
          !isTextInput ||
          (tag === "input" && (document.activeElement as HTMLInputElement).type !== "textarea")
        ) {
          e.preventDefault();
          onConfirm();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onCancel, onConfirm]);

  const badgeTone =
    tone === "danger"
      ? {
          glow: "from-rose-400/20 to-red-300/10",
          ring: "ring-rose-400/25",
          bg: "bg-rose-500/15",
          text: "text-rose-300",
          liquid:
            "after:[background:radial-gradient(45%_55%_at_25%_25%,theme(colors.rose.400/0.28),transparent_60%),radial-gradient(55%_45%_at_80%_40%,theme(colors.red.300/0.18),transparent_60%)]",
        }
      : {
          glow: "from-cyan-400/20 to-emerald-300/10",
          ring: "ring-cyan-400/25",
          bg: "bg-cyan-500/15",
          text: "text-cyan-300",
          liquid:
            "after:[background:radial-gradient(45%_55%_at_25%_25%,theme(colors.cyan.400/0.28),transparent_60%),radial-gradient(55%_45%_at_80%_40%,theme(colors.sky.300/0.18),transparent_60%)]",
        };

  return (
    <GlassModal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex gap-2">
          <GlassButton variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4" />
            <span>{cancelText}</span>
          </GlassButton>
          <GlassButton variant={confirmBtnVariant} onClick={onConfirm} autoFocus>
            <Check className="h-4 w-4" />
            <span>{confirmText}</span>
          </GlassButton>
        </div>
      }
    >
      <div ref={containerRef} className="flex items-start gap-3">
        <div
          className={cn(
            "relative grid h-9 w-9 place-items-center rounded-xl",
            "backdrop-blur-md ring-1",
            badgeTone.bg,
            badgeTone.ring,
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,.18),0_10px_30px_-14px_rgba(0,0,0,.45)]",
            "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.xl)-2px)]",
            "before:bg-gradient-to-b before:from-white/25 before:to-white/[0.06] before:pointer-events-none",
            "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none",
            "motion-ok:after:animate-liquid-slow",
            badgeTone.liquid,
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            <span
              className={cn(
                "motion-ok:absolute -left-1/3 top-0 h-full w-1/3 rotate-[12deg] opacity-0",
                "bg-gradient-to-r from-transparent via-white/70 to-transparent",
                "transition-opacity duration-300 group-hover:opacity-60",
              )}
            />
          </span>

          <AlertTriangle className={cn("h-5 w-5", badgeTone.text)} />
        </div>

        <p className="text-sm text-zinc-800 dark:text-white/90">{description}</p>
      </div>
    </GlassModal>
  );
};

export default ConfirmDialog;
