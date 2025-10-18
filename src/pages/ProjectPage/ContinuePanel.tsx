import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassButton } from "@/shared/ui/GlassButton";
import { GlassTextarea } from "@/shared/ui/GlassTextarea";
import { Plus, Wand2 } from "lucide-react";

type Props = {
  suggestions: string[];
  value: string;
  onChange: (v: string) => void;
  onGenerate: (preset?: string) => void;
  canGenerate: boolean;
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
  content,
  children,
}) => {
  return (
    <div className="relative group block w-full">
      {children}
      <div
        role="tooltip"
        className="
          pointer-events-none invisible absolute left-1/2 top-0 z-50
          -translate-x-1/2 -translate-y-full mb-2
          rounded-xl bg-zinc-950/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur
          opacity-0 transition-opacity duration-150
          group-hover:visible group-hover:opacity-100
          group-focus-within:visible group-focus-within:opacity-100
        "
      >
        <div className="max-w-[30rem] whitespace-pre-wrap break-words">{content}</div>
        <div className="absolute left-1/2 top-full -translate-x-1/2 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-zinc-950/90" />
      </div>
    </div>
  );
};

const ContinuePanel: React.FC<Props> = ({
  suggestions,
  value,
  onChange,
  onGenerate,
  canGenerate,
}) => {
  return (
    <GlassCard className="p-4 overflow-hidden">
      <div className="mb-3 flex items-center gap-2">
        <Plus className="h-5 w-5 opacity-80" />
        <h3 className="text-base font-semibold tracking-tight">Continue</h3>
      </div>

      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-white/60">
        System suggestions
      </div>

      <div className="mb-4 flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <Tooltip key={i} content={s}>
            <GlassButton
              variant="ghost"
              onClick={() => onGenerate(s)}
              title={s}
              className="
                h-10 
                w-full 
                text-left 
                overflow-hidden
                px-3 
                truncate
                rounded-xl
                border border-white/5
              "
            >
              <span className="block truncate text-left">{s}</span>
            </GlassButton>
          </Tooltip>
        ))}
      </div>

      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-white/60">
        Your version
      </div>

      <div className="grid gap-3">
        <GlassTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe what happens next…"
          aria-label="Continuation text"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canGenerate) {
              e.preventDefault();
              onGenerate();
            }
          }}
          hint="Tip: use Ctrl/⌘+Enter to add a scene."
        />

        <div className="flex">
          <GlassButton onClick={() => onGenerate()} disabled={!canGenerate}>
            <Wand2 className="h-4 w-4" />
            <span>Add Scene</span>
          </GlassButton>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600 dark:text-white/60">
        The system will generate a new clip starting from the current point in the story.
      </p>
    </GlassCard>
  );
};

export default ContinuePanel;
