// src/pages/ProjectsPage/AssembleModal.tsx
import React, { useEffect } from "react";
import { GlassModal } from "@/shared/ui/GlassModal";
import { GlassButton } from "@/shared/ui/GlassButton";
import type { Scene } from "@/shared/types/Scene";
import { VideoPlayer } from "@/components";
import { Loader } from "@/shared/ui/Loader";

type Props = {
  open: boolean;
  onClose: () => void;
  scenes: Scene[];
  storyboardUrl?: string | null;
  storyboardName: string;
  playIdx: number;
  onPick: (idx: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  assembledUrl?: string | null; // НОВОЕ
  assembling?: boolean; // НОВОЕ
};

const AssembleModal: React.FC<Props> = ({
  open,
  onClose,
  scenes,
  storyboardUrl,
  storyboardName,
  playIdx,
  onPick,
  videoRef,
  assembledUrl,
  assembling = false,
}) => {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      onPick((playIdx + 1) % Math.max(1, scenes.length));
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [videoRef, playIdx, scenes.length, onPick]);

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Final Film & Storyboard"
      footer={
        <div className="flex flex-wrap items-center gap-2">
          {storyboardUrl && (
            <a
              href={storyboardUrl}
              download={storyboardName}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ring-black/10 transition hover:bg-black/5 dark:ring-white/20 dark:hover:bg-white/10"
            >
              Download storyboard (.json)
            </a>
          )}

          {/* Кнопка скачивания финального видео */}
          {assembling ? (
            <span className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ring-black/10 dark:ring-white/20">
              <Loader size="sm" />
              Building final .mp4…
            </span>
          ) : assembledUrl ? (
            <a
              href={assembledUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ring-black/10 transition hover:bg-black/5 dark:ring-white/20 dark:hover:bg-white/10"
            >
              Download final .mp4
            </a>
          ) : null}

          <GlassButton variant="ghost" onClick={onClose}>
            Close
          </GlassButton>
        </div>
      }
    >
      {scenes.length === 0 ? (
        <div className="text-sm opacity-80">No scenes to preview</div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10">
            {scenes[playIdx]?.clipUrl ? (
              <VideoPlayer
                key={scenes[playIdx].id}
                ref={videoRef as React.RefObject<HTMLVideoElement>}
                src={scenes[playIdx].clipUrl}
                controls
                autoPlay
                className="h-auto w-full"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center">No clip</div>
            )}
          </div>
          <div className="text-sm opacity-80">
            Scene {playIdx + 1} of {scenes.length}:{" "}
            <span className="font-medium">{scenes[playIdx]?.prompt}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scenes.map((s, i) => (
              <GlassButton
                key={s.id}
                size="sm"
                variant={i === playIdx ? "primary" : "ghost"}
                onClick={() => onPick(i)}
              >
                #{i + 1}
              </GlassButton>
            ))}
          </div>
        </div>
      )}
    </GlassModal>
  );
};

export default AssembleModal;
