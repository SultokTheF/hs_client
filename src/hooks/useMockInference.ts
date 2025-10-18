import { mockGenerateClip } from "@/api/actions/generation/inference/mockGenerateClip";

export const useMockInference = () => {
  const generateClip = async (prompt: string) => {
    return mockGenerateClip(prompt);
  };
  return { generateClip };
};
