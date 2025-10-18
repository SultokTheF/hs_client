/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AnimatedBackground from "@/shared/ui/AnimatedBackground";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Loader } from "@/shared/ui/Loader";
import { useGlobalAlert } from "@/context/globalAlertContext";

import { useProject } from "@/hooks/useProject";
import { useScenes } from "@/hooks/useScenes";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useMockInference } from "@/hooks/useMockInference";
import { useAssemble } from "@/hooks/useAssemble";

import ProjectHeader from "@/pages/ProjectPage/ProjectHeader";
import InitialPromptPanel from "@/pages/ProjectPage/InitialPromptPanel";
import CurrentPreviewPanel from "@/pages/ProjectPage/CurrentPreviewPanel";
import ContinuePanel from "@/pages/ProjectPage/ContinuePanel";
import ScenesTimeline from "@/pages/ProjectPage/ScenesTimeline";
import AssembleModal from "@/pages/ProjectPage/AssembleModal";

const ProjectPage: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

  const { project, loading, err } = useProject(id);
  const { scenes, addDraft, setGenerating, setReady, setError, remove } = useScenes(id);
  const { suggest } = useSuggestions();
  const { generateClip } = useMockInference();
  const {
    isAssembling,
    open,
    setOpen,
    assemble,
    storyboardUrl,
    storyboardName,
    playIdx,
    setPlayIdx,
    videoRef,
  } = useAssemble(project, scenes);

  const [initialPrompt, setInitialPrompt] = useState("");
  const [continuePrompt, setContinuePrompt] = useState("");

  const lastScene = scenes[scenes.length - 1];
  const canGenerateInitial = useMemo(() => initialPrompt.trim().length > 0, [initialPrompt]);
  const canGenerateNext = useMemo(() => continuePrompt.trim().length > 0, [continuePrompt]);
  const suggestions = lastScene ? suggest() : [];

  const handleGenerateInitial = async () => {
    const text = initialPrompt.trim();
    if (!text) return;
    const id = addDraft(text);
    setInitialPrompt("");
    setGenerating(id);
    try {
      const { clipUrl, durationSec } = await generateClip(text);
      setReady(id, clipUrl, durationSec);
      showAlert("success", "Scene created");
    } catch (e: any) {
      setError(id, e?.message || "Error");
      showAlert("error", e?.message || "Failed to generate scene");
    }
  };

  const handleGenerateNext = async (preset?: string) => {
    const text = (preset ?? continuePrompt).trim();
    if (!text) return;
    const id = addDraft(text);
    setContinuePrompt("");
    setGenerating(id);
    try {
      const { clipUrl, durationSec } = await generateClip(text);
      setReady(id, clipUrl, durationSec);
      showAlert("success", "New scene created");
    } catch (e: any) {
      setError(id, e?.message || "Error");
      showAlert("error", e?.message || "Failed to generate scene");
    }
  };

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

  return (
    <div className="relative min-h-screen text-zinc-900 dark:text-white">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <ProjectHeader
          projectName={project.name}
          scenesCount={scenes.length}
          onBack={() => navigate("/")}
        />

        {scenes.length === 0 ? (
          <InitialPromptPanel
            value={initialPrompt}
            onChange={setInitialPrompt}
            onGenerate={handleGenerateInitial}
            canGenerate={canGenerateInitial}
          />
        ) : (
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

            <ScenesTimeline
              scenes={scenes}
              onDelete={remove}
              onAssemble={assemble}
              isAssembling={isAssembling}
            />
          </>
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
      />
    </div>
  );
};

export default ProjectPage;
