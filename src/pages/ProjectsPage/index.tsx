// src/pages/ProjectsPage/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectHeader from "@/pages/ProjectsPage/ProjectHeader";
import InitialPromptPanel from "@/pages/ProjectsPage/InitialPromptPanel";

import AnimatedBackground from "@/shared/ui/AnimatedBackground";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Loader } from "@/shared/ui/Loader";

import { useGlobalAlert } from "@/context/globalAlertContext";

import { Project } from "@/shared/types/Project";

import { getProject } from "@/api/actions/projects";
import { createInitialGeneration, checkInitialGenerationStatus } from "@/api/actions/generation";

import ScenesTimeline from "@/pages/ProjectsPage/ScenesTimeline";
import CurrentPreviewPanel from "@/pages/ProjectsPage/CurrentPreviewPanel";
import ContinuePanel from "@/pages/ProjectsPage/ContinuePanel";
import AssembleModal from "@/pages/ProjectsPage/AssembleModal";

import { useSegments } from "@/hooks/useSegments";
import { useSuggestions } from "@/hooks/useSuggestions";
import { assembleProject } from "@/api/actions/generation/segments";

const ProjectsPage: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const [initialPrompt, setInitialPrompt] = useState("");
  const [continuePrompt, setContinuePrompt] = useState("");
  const [initialVideoStatus, setInitialVideoStatus] = useState<any | null>(null);
  const [initialGenerating, setInitialGenerating] = useState(false);

  // Сегменты с сервера
  const {
    loading: segmentsLoading,
    scenes,
    lastScene,
    busy,
    reload,
    generateNext,
    removeLast,
  } = useSegments(project?.id || "", {
    initialVideoUrl: project?.initialVideoUrl ?? null,
    initialPrompt: project?.prompt ?? null,
  });

  // Сборка (mock)
  const [isAssembling, setIsAssembling] = useState(false);
  const [open, setOpen] = useState(false);
  const storyboardUrl = undefined;
  const storyboardName = "storyboard.json";
  const [assembledUrl, setAssembledUrl] = useState<string | null>(null);
  const [playIdx, setPlayIdx] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const canGenerateNext = useMemo(
    () => continuePrompt.trim().length > 0 && !busy,
    [continuePrompt, busy],
  );

  // Подсказки — контекст: user input > initial prompt проекта
  const suggestionsContext = (continuePrompt || project?.prompt || "").trim() || undefined;
  const { suggestions } = useSuggestions({
    projectId: project?.id,
    context: suggestionsContext,
    enabled: Boolean(project?.id),
    debounceMs: 300,
  });

  const fetchProject = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data: Project = await getProject(id);
      setProject(data);
    } catch (error: any) {
      setErr(error.message || "Failed to fetch project.");
      showAlert("error", `Error: ${error.message || "Failed to fetch project."}`);
    } finally {
      setLoading(false);
    }
  };

  const assemble = async () => {
    if (!project?.id) return;
    setIsAssembling(true);
    setOpen(true); // открываем модалку заранее — покажем лоадер и потом ссылку
    setAssembledUrl(null);
    try {
      const { assembled_url } = await assembleProject(project.id);
      setAssembledUrl(assembled_url);
    } catch (e: any) {
      setAssembledUrl(null);
      showAlert("error", e?.message || "Failed to assemble film");
    } finally {
      setIsAssembling(false);
    }
  };

  const handleInitialGeneration = async () => {
    try {
      const data = await createInitialGeneration({
        project_id: project?.id || "",
        prompt: initialPrompt,
      });
      setInitialVideoStatus(data);
      setInitialGenerating(true);
      showAlert("success", "Initial generation started.");
    } catch (error: any) {
      showAlert("error", `Error: ${error.message || "Failed to start generation."}`);
    }
  };

  // важно: ScenesTimeline ждёт onDelete(id: string)
  const handleDeleteScene = (/* id: string */) => {
    // удалять можно только последнюю — игнорим переданный id
    if (!canDelete) return;
    void removeLast();
  };

  const handleGenerateNext = async (preset?: string) => {
    const text = (preset ?? continuePrompt).trim();
    if (!text || !project?.id) return;
    await generateNext(text);
    setContinuePrompt("");
    fetchProject(); // вдруг бэк вернёт full_prompt/last_video_url (если добавишь)
  };

  const pollInitialGenerationStatus = async () => {
    if (!project || !initialVideoStatus?.id) return;
    try {
      const statusData: any = await checkInitialGenerationStatus(initialVideoStatus.id);
      if (statusData.status === "completed") {
        setInitialGenerating(false);
        showAlert("success", "Initial generation completed.");
        await fetchProject();
        await reload();
      } else if (statusData.status === "failed") {
        setInitialGenerating(false);
        showAlert("error", "Initial generation failed.");
      } else {
        setTimeout(pollInitialGenerationStatus, 8000);
      }
    } catch (error: any) {
      setInitialGenerating(false);
      showAlert("error", `Error: ${error.message || "Failed to check generation status."}`);
    }
  };

  useEffect(() => {
    if (initialGenerating) {
      pollInitialGenerationStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGenerating]);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-10">
          <GlassCard className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (err || !project) {
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-10">
          <GlassCard className="space-y-4 p-6 text-center">
            <p className="text-red-600 dark:text-red-300">Error: {err || "Project not found"}</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const canDelete = scenes.length > (project.initialVideoUrl ? 1 : 0) && !busy;

  return (
    <div className="relative min-h-screen text-zinc-900 dark:text-white">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <ProjectHeader
          projectName={project.name}
          scenesCount={scenes.length}
          onBack={() => navigate("/")}
        />

        {project.initialVideoUrl ? (
          <>
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CurrentPreviewPanel scene={lastScene} />
              <ContinuePanel
                suggestions={suggestions}
                value={continuePrompt}
                onChange={setContinuePrompt}
                onGenerate={handleGenerateNext}
                canGenerate={canGenerateNext}
              />
            </div>

            {segmentsLoading ? (
              <GlassCard className="flex items-center justify-center py-10">
                <Loader size="md" />
              </GlassCard>
            ) : (
              <ScenesTimeline
                scenes={scenes}
                onDelete={handleDeleteScene}
                onAssemble={assemble}
                isAssembling={isAssembling}
              />
            )}
          </>
        ) : (
          <InitialPromptPanel
            value={initialPrompt}
            onChange={setInitialPrompt}
            onGenerate={handleInitialGeneration}
            canGenerate={initialPrompt.trim().length > 0}
            busy={initialGenerating}
          />
        )}
      </div>

      <AssembleModal
        open={open}
        onClose={() => setOpen(false)}
        scenes={scenes}
        storyboardUrl={storyboardUrl}
        storyboardName={storyboardName}
        playIdx={playIdx}
        onPick={setPlayIdx}
        videoRef={videoRef}
        assembledUrl={assembledUrl} // НОВОЕ
        assembling={isAssembling} // НОВОЕ
      />
    </div>
  );
};

export default ProjectsPage;
