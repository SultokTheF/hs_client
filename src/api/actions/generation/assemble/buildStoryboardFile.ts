import type { Scene } from "@/shared/types/Scene";
import type { Project } from "@/shared/types/Project";

export const buildStoryboardFile = (project: Project, scenes: Scene[]) => {
  const storyboard = {
    project,
    createdAt: new Date().toISOString(),
    totalScenes: scenes.length,
    totalDurationSec: scenes.reduce((acc, s) => acc + (s.durationSec || 0), 0),
    playlist: scenes.map((s, index) => ({
      index: index + 1,
      prompt: s.prompt,
      url: s.clipUrl,
      durationSec: s.durationSec,
      createdAt: s.createdAt,
    })),
  };
  const blob = new Blob([JSON.stringify(storyboard, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const filename = `${project.name.replace(/\s+/g, "_")}_storyboard.json`;
  return { url, filename };
};
