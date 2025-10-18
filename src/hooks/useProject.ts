/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getProject } from "@/api/actions/projects";
import type { Project } from "@/shared/types/Project";

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const p = await getProject(projectId);
        if (!mounted) return;
        setProject(p);
        setErr(null);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load project");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  return { project, loading, err };
};
