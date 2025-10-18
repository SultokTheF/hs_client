/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { uid } from "../shared/lib/id";
import type { Project } from "@/shared/types/Project";

export const attachProjectsMock = (axiosInstance: AxiosInstance, endpoints: any) => {
  const storageKey = "filmgen:projects";

  const read = (): Project[] => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Project[]) : [];
    } catch {
      return [];
    }
  };

  const write = (list: Project[]) => localStorage.setItem(storageKey, JSON.stringify(list));

  const ok = <T>(config: AxiosRequestConfig, payload: T, status = 200): AxiosResponse<T> => ({
    data: payload,
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "ERROR",
    headers: { "x-mock": "projects" },
    config: config as any,
  });

  const withDelay = async <T>(config: AxiosRequestConfig, fn: () => T, ms = 120) =>
    new Promise<AxiosResponse<T>>((resolve) => setTimeout(() => resolve(ok(config, fn())), ms));

  const notFound = (config: AxiosRequestConfig): AxiosResponse<any> =>
    ok(config, { detail: "Not found" }, 404);

  const normalize = (u = "") =>
    u
      .replace(/^https?:\/\/[^/]+/, "")
      .replace(/^\/*/, "")
      .replace(/\/{2,}/g, "/");

  type Route =
    | { kind: "list" }
    | { kind: "create" }
    | { kind: "detail"; id: string }
    | { kind: "rename"; id: string }
    | { kind: "delete"; id: string }
    | null;

  const samePath = (a: string, b: string) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

  const parseRoute = (u = ""): Route => {
    const p = normalize(u);
    if (samePath(p, normalize(endpoints.PROJECTS_LIST))) return { kind: "list" };
    if (samePath(p, normalize(endpoints.PROJECTS_CREATE))) return { kind: "create" };
    if (!p.startsWith("api/projects/")) return null;
    const seg = p.split("/").filter(Boolean);
    if (seg.length >= 3 && seg[0] === "api" && seg[1] === "projects") {
      const id = seg[2];
      if (seg.length === 3) return { kind: "detail", id };
      if (seg.length === 4 && seg[3] === "rename") return { kind: "rename", id };
      if (seg.length === 4 && seg[3] === "delete") return { kind: "delete", id };
    }
    return null;
  };

  const safeParse = (data: any) => {
    try {
      if (typeof data === "string") return JSON.parse(data);
      return data ?? {};
    } catch {
      return {};
    }
  };

  axiosInstance.interceptors.request.use((config) => {
    const route = parseRoute(config.url ?? "");
    if (!route) return config;

    config.baseURL = "";
    config.url = normalize(config.url);

    config.adapter = async (cfg: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
      const method = (cfg.method || "get").toLowerCase();
      const body = safeParse(cfg.data);

      if (route.kind === "list" && method === "get") {
        return withDelay(cfg, () => read());
      }

      if (route.kind === "create" && (method === "post" || method === "put")) {
        const name = String(body?.name ?? "").trim();
        if (!name) return ok(cfg, { detail: "Name required" }, 400);
        const now = new Date().toISOString();
        const proj: Project = { id: uid(), name, createdAt: now, updatedAt: now };
        const list = read();
        write([proj, ...list]);
        return withDelay(cfg, () => proj);
      }

      if (route.kind === "detail" && method === "get") {
        const proj = read().find((p) => p.id === route.id);
        return proj ? withDelay(cfg, () => proj) : notFound(cfg);
      }

      if (
        route.kind === "rename" &&
        (method === "patch" || method === "post" || method === "put")
      ) {
        const name = String(body?.name ?? "").trim();
        if (!name) return ok(cfg, { detail: "Name required" }, 400);
        const list = read();
        const idx = list.findIndex((p) => p.id === route.id);
        if (idx === -1) return notFound(cfg);
        const updated: Project = {
          ...list[idx],
          name,
          updatedAt: new Date().toISOString(),
        };
        list[idx] = updated;
        write(list);
        return withDelay(cfg, () => updated);
      }

      if (route.kind === "delete" && method === "delete") {
        const list = read();
        const next = list.filter((p) => p.id !== route.id);
        write(next);
        return withDelay(cfg, () => ({ detail: "deleted" }));
      }

      return notFound(cfg);
    };

    return config;
  });
};
