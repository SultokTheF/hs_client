import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassButton } from "@/shared/ui/GlassButton";
import { Loader } from "@/shared/ui/Loader";
import { Download, Scissors } from "lucide-react";
import type { Scene } from "@/shared/types/Scene";
import SceneCard from "@/pages/ProjectPage/SceneCard";

type Props = {
  scenes: Scene[];
  onDelete: (id: string) => void;
  onAssemble: () => void;
  isAssembling: boolean;
};

const ScenesTimeline: React.FC<Props> = ({ scenes, onDelete, onAssemble, isAssembling }) => {
  return (
    <GlassCard className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 opacity-80" />
          <h3 className="text-base font-semibold tracking-tight">Scenes</h3>
        </div>
        <GlassButton
          onClick={onAssemble}
          disabled={scenes.every((s) => s.status !== "ready") || isAssembling}
        >
          {isAssembling ? <Loader size="sm" /> : <Download className="h-4 w-4" />}
          <span>{isAssembling ? "Assembling..." : "Assemble film (mock)"}</span>
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {scenes.map((s, idx) => (
          <SceneCard key={s.id} index={idx + 1} scene={s} onDelete={() => onDelete(s.id)} />
        ))}
      </div>
    </GlassCard>
  );
};

export default ScenesTimeline;
