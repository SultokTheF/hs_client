import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Loader } from "@/shared/ui/Loader";
import { Play } from "lucide-react";
import type { Scene } from "@/shared/types/Scene";
import { VideoPlayer } from "@/components";

type Props = {
  scene?: Scene;
};

const CurrentPreviewPanel: React.FC<Props> = ({ scene }) => {
  return (
    <GlassCard className="lg:col-span-2">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Play className="h-5 w-5 opacity-80" />
          <h3 className="text-base font-semibold tracking-tight">Current Preview</h3>
        </div>

        <div className="relative overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
          {scene?.status === "ready" && scene.clipUrl ? (
            <VideoPlayer key={scene.id} src={scene.clipUrl} controls className="h-auto w-full" />
          ) : scene?.status === "generating" ? (
            <div className="flex aspect-video items-center justify-center">
              <Loader size="md" />
            </div>
          ) : scene?.status === "error" ? (
            <div className="flex aspect-video items-center justify-center text-red-500">
              Generation error: {scene.errorMsg}
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center opacity-70">
              No preview
            </div>
          )}
        </div>

        <div className="mt-3 text-sm opacity-80">
          <span className="font-medium">Scene prompt:</span> {scene?.prompt}
        </div>
      </div>
    </GlassCard>
  );
};

export default CurrentPreviewPanel;
