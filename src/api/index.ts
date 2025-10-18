import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
  PROJECTS_LIST: "api/projects/",
  PROJECTS_CREATE: "api/projects/",
  PROJECT_DETAIL: (id: string) => `api/projects/${id}/`,
  PROJECT_RENAME: (id: string) => `api/projects/${id}/`,
  PROJECT_DELETE: (id: string) => `api/projects/${id}/`,
  PROJECT_SUGGEST: (id: string) => `api/projects/${id}/suggest-continuations/`,

  INITIAL_GENERATION: {
    CREATE: "api/initial_generator/generate/",
    STATUS: (id: string) => `api/initial_generator/${id}/check-status/`,
  },

  GENERATOR: {
    LIST: (projectId: string) => `api/generator/?project_id=${projectId}`,
    CONTINUE: "api/generator/continue/",
    DELETE_LAST: "api/generator/delete-last/",
    ASSEMBLE: "api/generator/assemble/",
  },
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 0,
});
