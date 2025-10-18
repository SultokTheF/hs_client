import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassButton } from "@/shared/ui/GlassButton";
import { GlassInput } from "@/shared/ui/GlassInput";
import { Sparkles, Wand2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  canGenerate: boolean;
};

const InitialPromptPanel: React.FC<Props> = ({ value, onChange, onGenerate, canGenerate }) => {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 opacity-80" />
        <h2 className="text-lg font-semibold tracking-tight">Start with a short prompt</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <GlassInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="For example: A black Mustang drives through the desert"
          aria-label="Initial prompt"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canGenerate) onGenerate();
          }}
        />
        <GlassButton onClick={onGenerate} disabled={!canGenerate}>
          <Wand2 className="h-4 w-4" />
          <span>Generate scene</span>
        </GlassButton>
      </div>
      <p className="mt-3 text-xs text-zinc-600 dark:text-white/60">
        The system will return a video clip (mock). After that, you can add a continuation.
      </p>
    </GlassCard>
  );
};

export default InitialPromptPanel;
