import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/shared/types/Scene";
import type { Project } from "@/shared/types/Project";
import { buildStoryboardFile } from "@/api/actions/generation/assemble/buildStoryboardFile";

export const useAssemble = (project: Project | null, scenes: Scene[]) => {
  const [isAssembling, setIsAssembling] = useState(false);
  const [open, setOpen] = useState(false);
  const [storyboardUrl, setStoryboardUrl] = useState<string | null>(null);
  const [storyboardName, setStoryboardName] = useState("storyboard.json");
  const [playIdx, setPlayIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setPlayIdx(0);
  }, [open]);

  const assemble = () => {
    if (!project) return;
    setIsAssembling(true);
    setTimeout(() => {
      const { url, filename } = buildStoryboardFile(project, scenes);
      setStoryboardUrl(url);
      setStoryboardName(filename);
      setIsAssembling(false);
      setOpen(true);
    }, 800);
  };

  return {
    isAssembling,
    open,
    setOpen,
    assemble,
    storyboardUrl,
    storyboardName,
    playIdx,
    setPlayIdx,
    videoRef,
  };
};
