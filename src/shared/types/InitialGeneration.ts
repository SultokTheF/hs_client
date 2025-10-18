export type InitialGenerationCreateBody = {
  project_id: string;
  prompt: string;
};

export type InitialGenerationJob = {
  id: string;
  project: string;
  prompt: string;
  job_id: string;
  initial_video_url: string | null;
  status: "queued" | "in_progress" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
};
