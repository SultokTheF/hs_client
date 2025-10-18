import { axiosInstance, endpoints } from "@/api";
import type { Project } from "@/shared/types/Project";

export const listProjects = async () => {
  const { data } = await axiosInstance.get<Project[]>(endpoints.PROJECTS_LIST);
  return data;
};

export const createProject = async (name: string) => {
  const { data } = await axiosInstance.post<Project>(endpoints.PROJECTS_CREATE, { name });
  return data;
};

export const getProject = async (id: string) => {
  const { data } = await axiosInstance.get<Project>(endpoints.PROJECT_DETAIL(id));
  return data;
};

export const renameProject = async (id: string, name: string) => {
  const { data } = await axiosInstance.patch<Project>(endpoints.PROJECT_RENAME(id), { name });
  return data;
};

export const deleteProject = async (id: string) => {
  const { data } = await axiosInstance.delete<{ detail: string }>(endpoints.PROJECT_DELETE(id));
  return data;
};
