/* eslint-disable @typescript-eslint/no-explicit-any */
export type StorySegment = {
  id: string;
  project: string;
  position: number;

  previous_video_url: string;
  previous_prompt: string;
  used_prompt: string;
  new_video_url: string;

  cumulative_prompt: string;
  job_set_id?: string | null;
  frame_image_url?: string | null;
  meta?: Record<string, any> | null;

  created_at: string;
  updated_at: string;
};

export type Scene = {
  id: string;
  prompt: string;
  createdAt: string;
  status: "ready" | "generating" | "queued" | "error";
  clipUrl?: string;
  durationSec?: number;
  errorMsg?: string;
};
