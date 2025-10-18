import axios from "axios";
import { attachProjectsMock } from "@/api/mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK;

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (USE_MOCK ? "/" : "http://localhost:8000/");

const API_BASE_DOMEN = (import.meta.env.VITE_API_BASE_DOMEN as string | undefined) ?? "localhost";

export const endpoints = {
  PROJECTS_LIST: "api/projects/",
  PROJECTS_CREATE: "api/projects/",
  PROJECT_DETAIL: (id: string) => `api/projects/${id}/`,
  PROJECT_RENAME: (id: string) => `api/projects/${id}/`,
  PROJECT_DELETE: (id: string) => `api/projects/${id}/`,
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

if (USE_MOCK) {
  attachProjectsMock(axiosInstance, endpoints);
}

export { API_BASE_URL, API_BASE_DOMEN };
