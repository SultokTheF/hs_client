/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { createInitialGeneration, checkInitialGenerationStatus } from "@/api/actions/generation";

/** Внутренний канонический статус */
export type Status =
  | "idle"
  | "submitting"
  | "queued"
  | "running"
  | "in_progress"
  | "completed"
  | "failed";

/** Какие статусы может вернуть бэкенд (расширяем при необходимости) */
type BackendStatus =
  | "idle"
  | "submitting"
  | "queued"
  | "running"
  | "processing"
  | "in_progress"
  | "completed"
  | "failed"
  | string;

/** Ответ бэкенда на check */
type BackendCheckResponse = {
  status: BackendStatus;
  initial_video_url?: string | null;
  prompt?: string | null;
};

/** Ответ бэкенда на start */
type BackendStartResponse = {
  id: string;
  status: BackendStatus;
};

/** Маппинг статусов бэкенда к нашим */
const normalizeStatus = (s: BackendStatus): Status => {
  switch (s) {
    case "idle":
      return "idle";
    case "submitting":
      return "submitting";
    case "queued":
      return "queued";
    case "running":
      return "running";
    case "processing":
    case "in_progress":
      return "in_progress";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    default:
      // На неизвестный статус реагируем как на "in_progress", чтобы продолжать опрос
      return "in_progress";
  }
};

/** Базовые интервалы опроса (мс) */
const BASE_DELAY_MS = {
  queued: 2000,
  running: 2000,
  in_progress: 2000,
  completed_wait_url: 2000,
  network_error: 10000,
};

/** Небольшой джиттер, чтобы не биться в такт */
const jitter = (ms: number) => Math.round(ms * (0.9 + Math.random() * 0.2));

/** Максимальное «ожидание URL после completed» (мс) — чтобы не висеть бесконечно */
const MAX_COMPLETED_NO_URL_MS = 60_000;

export const useInitialGeneration = (projectId: string) => {
  const [status, setStatus] = useState<Status>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  /** для отмены/переназначения таймера */
  const timerRef = useRef<number | null>(null);

  /** счетчик попыток сетевых ошибок для легкого backoff-а */
  const netErrAttemptsRef = useRef(0);

  /** «сторож» против бесконечного ожидания URL после completed */
  const completedSinceRef = useRef<number | null>(null);

  /** маркер текущей активной джобы, чтобы игнорировать устаревшие поллинги */
  const generationTokenRef = useRef<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (fn: () => void, ms: number) => {
      clearTimer();
      timerRef.current = window.setTimeout(fn, ms);
    },
    [clearTimer],
  );

  /** Полный сброс локального состояния (не трогаем projectId) */
  const softReset = useCallback(() => {
    clearTimer();
    netErrAttemptsRef.current = 0;
    completedSinceRef.current = null;
    setError(null);
    setVideoUrl(null);
    setPrompt(null);
    setStatus("idle");
  }, [clearTimer]);

  /** ОПРОС: один шаг */
  const pollOnce = useCallback(
    async (id: string, token: string) => {
      try {
        const res = (await checkInitialGenerationStatus(id)) as BackendCheckResponse;

        const norm = normalizeStatus(res.status);
        setStatus(norm);
        setVideoUrl(res.initial_video_url ?? null);
        setPrompt(res.prompt ?? null);

        // Сбросить счетчик сетевых ошибок при успешном запросе
        netErrAttemptsRef.current = 0;

        // Если это уже неактуальный поллинг — выходим
        if (generationTokenRef.current !== token) return;

        // Ошибка на бэке
        if (norm === "failed") {
          completedSinceRef.current = null;
          clearTimer();
          setError("Initial generation failed");
          return;
        }

        // Успех + есть URL — всё, останавливаем
        if (norm === "completed" && res.initial_video_url) {
          completedSinceRef.current = null;
          clearTimer();
          return;
        }

        // Успех, но URL ещё не проставлен — ждём ограниченное время
        if (norm === "completed" && !res.initial_video_url) {
          if (!completedSinceRef.current) {
            completedSinceRef.current = Date.now();
          } else {
            const waited = Date.now() - completedSinceRef.current;
            if (waited > MAX_COMPLETED_NO_URL_MS) {
              clearTimer();
              setError("Video URL was not provided by backend after completion.");
              return;
            }
          }
          scheduleNext(() => pollOnce(id, token), jitter(BASE_DELAY_MS.completed_wait_url));
          return;
        }

        // Иначе продолжаем опрос в зависимости от статуса
        if (norm === "queued") {
          scheduleNext(() => pollOnce(id, token), jitter(BASE_DELAY_MS.queued));
        } else if (norm === "running" || norm === "in_progress") {
          scheduleNext(() => pollOnce(id, token), jitter(BASE_DELAY_MS.in_progress));
        } else {
          // На всякий случай (для неизвестных нормализованных статусов)
          scheduleNext(() => pollOnce(id, token), jitter(BASE_DELAY_MS.in_progress));
        }
      } catch (e: any) {
        // Сетевые/временные ошибки — лёгкий экспоненциальный backoff
        const attempt = ++netErrAttemptsRef.current;
        const base = BASE_DELAY_MS.network_error * Math.min(4, attempt); // максимум ×4
        scheduleNext(() => pollOnce(id, token), jitter(base));
        setError(e?.message || "Failed to check status");
      }
    },
    [clearTimer, scheduleNext],
  );

  /** Публичный запуск генерации */
  const start = useCallback(
    async (textPrompt: string) => {
      // Перед новым стартом — полный soft reset
      softReset();
      setPrompt(textPrompt);
      setStatus("submitting");

      try {
        const job = (await createInitialGeneration({
          project_id: projectId,
          prompt: textPrompt,
        })) as BackendStartResponse;

        const token = `${job.id}:${Date.now()}`; // уникальный маркер «поколения» опроса
        generationTokenRef.current = token;

        setJobId(job.id);
        setStatus(normalizeStatus(job.status));

        // старт поллинга
        scheduleNext(() => pollOnce(job.id, token), 800);
      } catch (e: any) {
        setError(e?.message || "Failed to start generation");
        setStatus("failed");
      }
    },
    [pollOnce, projectId, scheduleNext, softReset],
  );

  /** Чистим таймер при размонтировании и при смене projectId */
  useEffect(() => {
    return () => {
      clearTimer();
      generationTokenRef.current = null;
    };
  }, [clearTimer, projectId]);

  /** Хелперы-флаги */
  const isSubmitting = status === "submitting";
  const isBusy =
    status === "submitting" ||
    status === "queued" ||
    status === "running" ||
    status === "in_progress";
  const isCompleted = status === "completed" && !!videoUrl;
  const isFailed = status === "failed";

  return {
    status,
    isSubmitting,
    isBusy,
    isCompleted,
    isFailed,
    jobId,
    videoUrl,
    prompt,
    error,
    start,
    /** на случай, если снаружи нужно принудительно почистить */
    reset: softReset,
  };
};
