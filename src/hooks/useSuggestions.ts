/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useSuggestions.ts
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { getProjectSuggestions } from "@/api/actions/projects";

type UseSuggestionsOpts = {
  projectId?: string;
  context?: string;
  count?: number;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
};

const FALLBACK_EN = ["The bus stops", "He trips hard", "The bus speeds up"];

export const useSuggestions = ({
  projectId,
  context,
  enabled = true,
  debounceMs = 300,
}: UseSuggestionsOpts = {}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canFetch = useMemo(() => Boolean(projectId) && enabled, [projectId, enabled]);

  const fetchNow = async () => {
    if (!canFetch || !projectId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const data = await getProjectSuggestions(projectId, context?.trim() || undefined);
      setSuggestions(data);
    } catch (e: any) {
      setError(e?.message || "Failed to get suggestions");
      setSuggestions(FALLBACK_EN.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canFetch) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      fetchNow();
    }, debounceMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [projectId, context, canFetch, debounceMs]);

  return { suggestions, loading, error, refresh: fetchNow };
};
