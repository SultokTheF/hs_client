import React from "react";
import { GlassButton } from "@/shared/ui/GlassButton";
import { GlassCard } from "@/shared/ui/GlassCard";
import LogoWordmark from "@/shared/ui/Logo";
import { Film, ListVideo, ArrowLeft } from "lucide-react";

type Props = {
  projectName: string;
  scenesCount: number;
  onBack: () => void;
};

const ProjectHeader: React.FC<Props> = ({ projectName, scenesCount, onBack }) => {
  return (
    <div className="mb-6 rounded-2xl border border-black/5 bg-white/50 p-4 backdrop-blur-md ring-1 ring-black/10 dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <GlassButton variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </GlassButton>
          <LogoWordmark />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <GlassCard className="flex items-center gap-2 px-3 py-2">
            <Film className="h-4 w-4 opacity-70" />
            <span className="text-sm opacity-80">
              <span className="font-semibold">{projectName}</span>
            </span>
          </GlassCard>
          <GlassCard className="flex items-center gap-2 px-3 py-2">
            <ListVideo className="h-4 w-4 opacity-70" />
            <span className="text-sm opacity-80">{scenesCount} scenes</span>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
