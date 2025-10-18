import React, { useState } from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassButton } from "@/shared/ui/GlassButton";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import { Loader } from "@/shared/ui/Loader";
import { Trash2 } from "lucide-react";
import type { Scene } from "@/shared/types/Scene";
import { VideoPlayer } from "@/components";

type Props = {
  index: number;
  scene: Scene;
  onDelete: () => void;
};

const SceneCard: React.FC<Props> = ({ index, scene, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <GlassCard className="flex flex-col">
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="text-xs opacity-70">Scene #{index}</div>
            <div className="line-clamp-2 text-sm font-medium">{scene.prompt}</div>
          </div>
          <div className="shrink-0">
            <GlassButton size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
            {scene.status === "ready" && scene.clipUrl ? (
              <VideoPlayer src={scene.clipUrl} className="h-auto w-full" controls />
            ) : scene.status === "generating" ? (
              <div className="flex aspect-video items-center justify-center">
                <Loader size="sm" />
              </div>
            ) : scene.status === "error" ? (
              <div className="flex aspect-video items-center justify-center text-red-500">
                {scene.errorMsg || "Error"}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center opacity-60">
                Waiting…
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 dark:text-white/60">
            <span>
              Status:{" "}
              <span className="font-medium">
                {scene.status === "ready"
                  ? "ready"
                  : scene.status === "generating"
                    ? "generating…"
                    : scene.status === "queued"
                      ? "queued"
                      : "error"}
              </span>
            </span>
            <span>{scene.durationSec ? `${scene.durationSec}s` : "—"}</span>
          </div>
        </div>
      </GlassCard>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        tone="danger"
        title="Delete scene?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default SceneCard;
