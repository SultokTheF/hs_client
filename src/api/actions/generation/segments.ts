import { axiosInstance, endpoints } from "@/api";
import type { StorySegment } from "@/shared/types/StorySegment";

export const listSegments = async (projectId: string): Promise<StorySegment[]> => {
  const { data } = await axiosInstance.get<StorySegment[]>(endpoints.GENERATOR.LIST(projectId));
  return data;
};

export const continueStory = async (params: {
  project_id: string;
  next_prompt: string;
}): Promise<StorySegment> => {
  const { data } = await axiosInstance.post<StorySegment>(endpoints.GENERATOR.CONTINUE, params);
  return data;
};

export const deleteLastSegment = async (projectId: string): Promise<void> => {
  await axiosInstance.post(endpoints.GENERATOR.DELETE_LAST, { project_id: projectId });
};

export type AssembleResponse = {
  project_id: string;
  assembled_url: string;
};

export const assembleProject = async (projectId: string): Promise<AssembleResponse> => {
  const { data } = await axiosInstance.post<AssembleResponse>(endpoints.GENERATOR.ASSEMBLE, {
    project_id: projectId,
  });
  return data;
};
