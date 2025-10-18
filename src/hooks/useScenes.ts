/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useScenes.ts
import { useEffect, useState, useCallback, useRef } from "react";
import type { Scene } from "@/shared/types/Scene";
import { readScenes, writeScenes } from "@/api/actions/generation/storage/scenesStorage";

// детерминированный id для "initial" сцены конкретного проекта
const initialSceneId = (projectId: string) => `initial-${projectId}`;
const uid = () => Math.random().toString(36).slice(2) + "-" + Date.now().toString(36).slice(2);

type UseScenesOptions = {
  initialVideoUrl?: string | null; // передайте сюда project.initialVideoUrl
};

export const useScenes = (projectId: string, opts: UseScenesOptions = {}) => {
  const { initialVideoUrl } = opts;
  const [scenes, setScenes] = useState<Scene[]>([]);

  // флаг, что мы уже загрузили из хранилища (чтобы избежать гонки чтение→запись)
  const didMountRef = useRef(false);

  // ----- helpers -----
  const makeInitialScene = (clipUrl: string): Scene =>
    ({
      id: initialSceneId(projectId),
      prompt: "Initial preview",
      createdAt: new Date().toISOString(),
      status: "ready",
      clipUrl,
      // durationSec опционален; можно обновить позже, когда будет известна длительность
    }) as unknown as Scene;

  const ensureInitialScenePlacement = (current: Scene[], clipUrl?: string | null): Scene[] => {
    if (!clipUrl || !projectId) return current;

    const id = initialSceneId(projectId);
    const byIdIdx = current.findIndex((s) => s.id === id);
    const byUrlIdx = current.findIndex((s) => (s as any).clipUrl === clipUrl);

    // если это первый запуск страницы (нет сцен в хранилище) — добавляем initial В КОНЕЦ
    if (current.length === 0) {
      return [...current, makeInitialScene(clipUrl)];
    }

    // после появления initialVideoUrl — она должна стать ПЕРВОЙ
    let next = [...current];

    // уже есть по id или по url?
    let idx = byIdIdx !== -1 ? byIdIdx : byUrlIdx;

    if (idx === -1) {
      // не нашли — создаём и ставим первой
      next.unshift(makeInitialScene(clipUrl));
      return next;
    }

    // есть — переносим в начало и синхронизируем поля
    const [item] = next.splice(idx, 1);
    next.unshift({
      ...item,
      id, // нормализуем id на детерминированный
      status: "ready",
      ...(clipUrl ? { clipUrl } : {}),
    } as Scene);

    return next;
  };

  // ----- загрузка из стораджа (+ правил placement initial) -----
  useEffect(() => {
    const stored = readScenes(projectId) || [];
    const withInitial = ensureInitialScenePlacement(stored, initialVideoUrl ?? undefined);
    setScenes(withInitial);
    didMountRef.current = true;
  }, [projectId, initialVideoUrl]);

  // ----- запись в сторадж (пропускаем первый маунт) -----
  useEffect(() => {
    if (!projectId || !didMountRef.current) return;
    writeScenes(projectId, scenes);
  }, [projectId, scenes]);

  // ----- публичные экшены (стабильные по ссылке) -----
  const addDraft = useCallback((prompt: string) => {
    const draft: Scene = {
      id: uid(),
      prompt,
      createdAt: new Date().toISOString(),
      status: "queued",
    } as unknown as Scene;
    setScenes((prev) => [...prev, draft]);
    return draft.id;
  }, []);

  const setGenerating = useCallback((id: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, status: "generating" } as Scene) : s)),
    );
  }, []);

  const setReady = useCallback((id: string, clipUrl: string, durationSec?: number) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === id
          ? ({ ...s, status: "ready", clipUrl, ...(durationSec ? { durationSec } : {}) } as Scene)
          : s,
      ),
    );
  }, []);

  const setError = useCallback((id: string, msg: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, status: "error", errorMsg: msg } as Scene) : s)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { scenes, addDraft, setGenerating, setReady, setError, remove };
};
