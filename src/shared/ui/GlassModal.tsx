import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassButton } from "@/shared/ui/GlassButton";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export const GlassModal: React.FC<Props> = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />
      <GlassCard className="relative z-10 w-full max-w-lg">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
          <GlassButton size="sm" variant="ghost" onClick={onClose} aria-label="Close">
            ✕
          </GlassButton>
        </div>
        <div className="text-zinc-800 dark:text-white/90">{children}</div>
        {footer && <div className="mt-4 flex justify-end">{footer}</div>}
      </GlassCard>
    </div>
  );
};
