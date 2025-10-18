// src/hooks/useSegments.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Scene, StorySegment } from "@/shared/types/StorySegment";
import { listSegments, continueStory, deleteLastSegment } from "@/api/actions/generation/segments";
import { useGlobalAlert } from "@/context/globalAlertContext";

// детерминированный id для initial
const initialSceneId = (projectId: string) => `initial-${projectId}`;

const toScene = (seg: StorySegment): Scene => ({
  id: seg.id,
  prompt: seg.used_prompt || "(no prompt)",
  createdAt: seg.created_at,
  status: "ready",
  clipUrl: seg.new_video_url,
});

type UseSegmentsOpts = {
  // для “инишал” сцены
  initialVideoUrl?: string | null;
  initialPrompt?: string | null;
};

export const useSegments = (projectId: string, opts: UseSegmentsOpts) => {
  const { initialVideoUrl, initialPrompt } = opts;
  const { showAlert } = useGlobalAlert();

  const [loading, setLoading] = useState(true);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [busy, setBusy] = useState(false); // флаг генерации/удаления
  const mounted = useRef(false);

  const initialScene: Scene | null = useMemo(() => {
    if (!projectId || !initialVideoUrl) return null;
    return {
      id: initialSceneId(projectId),
      prompt: initialPrompt || "Initial prompt",
      createdAt: new Date().toISOString(),
      status: "ready",
      clipUrl: initialVideoUrl,
    };
  }, [projectId, initialVideoUrl, initialPrompt]);

  const fetchAll = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const items = await listSegments(projectId);
      const mapped = items.map(toScene);
      // initial — в начало, если есть
      const next = initialScene ? [initialScene, ...mapped] : mapped;
      setScenes(next);
    } finally {
      setLoading(false);
    }
  }, [projectId, initialScene]);

  useEffect(() => {
    mounted.current = true;
    fetchAll();
    return () => {
      mounted.current = false;
    };
  }, [fetchAll]);

  const lastScene = scenes[scenes.length - 1];

  const generateNext = useCallback(
    async (nextPrompt: string) => {
      if (!projectId || !nextPrompt.trim()) return;
      setBusy(true);
      try {
        const seg = await continueStory({ project_id: projectId, next_prompt: nextPrompt.trim() });
        const scene = toScene(seg);
        setScenes((prev) => [...prev, scene]);
        showAlert("success", "New scene created");
      } catch (e: any) {
        showAlert("error", e?.message || "Failed to generate scene");
      } finally {
        setBusy(false);
      }
    },
    [projectId, showAlert],
  );

  const removeLast = useCallback(async () => {
    if (!projectId) return;
    // нельзя удалить initial — проверим, что последняя не initial
    const last = scenes[scenes.length - 1];
    if (!last) return;
    if (initialScene && last.id === initialScene.id) {
      showAlert("error", "Нельзя удалить initial сцену");
      return;
    }
    setBusy(true);
    try {
      await deleteLastSegment(projectId);
      setScenes((prev) => prev.slice(0, -1));
      showAlert("success", "Last scene removed");
    } catch (e: any) {
      showAlert("error", e?.message || "Failed to remove scene");
    } finally {
      setBusy(false);
    }
  }, [projectId, scenes, initialScene, showAlert]);

  return {
    loading,
    scenes,
    lastScene,
    busy,
    reload: fetchAll,
    generateNext,
    removeLast,
  };
};
