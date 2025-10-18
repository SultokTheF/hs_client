import type { Scene } from "@/shared/types/Scene";

const key = (projectId: string) => `filmgen:project:${projectId}:scenes`;

export const readScenes = (projectId: string): Scene[] => {
  try {
    const raw = localStorage.getItem(key(projectId));
    return raw ? (JSON.parse(raw) as Scene[]) : [];
  } catch {
    return [];
  }
};

export const writeScenes = (projectId: string, list: Scene[]) => {
  localStorage.setItem(key(projectId), JSON.stringify(list));
};
