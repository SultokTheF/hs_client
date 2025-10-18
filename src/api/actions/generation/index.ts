import { axiosInstance, endpoints } from "@/api";
import type {
  InitialGenerationCreateBody,
  InitialGenerationJob,
} from "@/shared/types/InitialGeneration";

export const createInitialGeneration = async (
  body: InitialGenerationCreateBody,
): Promise<InitialGenerationJob> => {
  const { data } = await axiosInstance.post<InitialGenerationJob>(
    endpoints.INITIAL_GENERATION.CREATE,
    body,
  );
  return data;
};

export const checkInitialGenerationStatus = async (
  jobId: string,
): Promise<InitialGenerationJob> => {
  const { data } = await axiosInstance.get<InitialGenerationJob>(
    endpoints.INITIAL_GENERATION.STATUS(jobId),
  );
  return data;
};
