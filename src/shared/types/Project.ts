export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  generationStatus?: "queued" | "running" | "completed" | "failed";
  initialVideoUrl?: string | null;
  prompt?: string | null;
};

export type ProjectDTO = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  generation_status?: "queued" | "running" | "completed" | "failed";
  initial_video_url?: string | null;
  prompt?: string | null;
};

export const mapProjectFromDTO = (dto: ProjectDTO): Project => ({
  id: dto.id,
  name: dto.name,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  generationStatus: dto.generation_status,
  initialVideoUrl: dto.initial_video_url ?? null,
  prompt: dto.prompt ?? null,
});
