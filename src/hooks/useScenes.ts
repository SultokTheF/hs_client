import { useEffect, useState } from "react";
import type { Scene } from "@/shared/types/Scene";
import { readScenes, writeScenes } from "@/api/actions/generation/storage/scenesStorage";

const uid = () => Math.random().toString(36).slice(2) + "-" + Date.now().toString(36).slice(2);

export const useScenes = (projectId: string) => {
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    setScenes(readScenes(projectId));
  }, [projectId]);

  useEffect(() => {
    if (projectId) writeScenes(projectId, scenes);
  }, [projectId, scenes]);

  const addDraft = (prompt: string) => {
    const draft: Scene = {
      id: uid(),
      prompt,
      createdAt: new Date().toISOString(),
      status: "queued",
    };
    setScenes((prev) => [...prev, draft]);
    return draft.id;
  };

  const setGenerating = (id: string) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, status: "generating" } : s)));
  };

  const setReady = (id: string, clipUrl: string, durationSec: number) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "ready", clipUrl, durationSec } : s)),
    );
  };

  const setError = (id: string, msg: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "error", errorMsg: msg } : s)),
    );
  };

  const remove = (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  };

  return { scenes, addDraft, setGenerating, setReady, setError, remove };
};
