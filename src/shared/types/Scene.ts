export type SceneStatus = "queued" | "generating" | "ready" | "error";

export type Scene = {
  id: string;
  prompt: string;
  clipUrl?: string;
  thumbUrl?: string;
  durationSec?: number;
  createdAt: string;
  status: SceneStatus;
  errorMsg?: string;
};
