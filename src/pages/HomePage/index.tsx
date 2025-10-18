/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/shared/types/Project";

import { GlassButton } from "@/shared/ui/GlassButton";
import { GlassCard } from "@/shared/ui/GlassCard";
import { GlassInput } from "@/shared/ui/GlassInput";
import { GlassModal } from "@/shared/ui/GlassModal";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import { Loader } from "@/shared/ui/Loader";

import { createProject, deleteProject, listProjects, renameProject } from "@/api/actions/projects";

import { Plus, RefreshCw, Edit3, Trash2, Check, X } from "lucide-react";
import { useGlobalAlert } from "@/context/globalAlertContext";
import AnimatedBackground from "@/shared/ui/AnimatedBackground";
import LogoWordmark from "@/shared/ui/Logo";

type Sort = "recent" | "az";

const EmptyState: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <GlassCard className="flex flex-col items-center justify-center gap-4 py-14">
    <div className="rounded-xl bg-[linear-gradient(135deg,rgba(169,255,0,0.95),rgba(245,255,200,0.95))] p-3 ring-1 ring-black/5 dark:ring-white/10">
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <path
          d="M10 17c0-3.866 3.134-7 7-7 6 0 8 9 14 9 3.866 0 7-3.134 7-7M10 31c0 3.866 3.134 7 7 7 6 0 8-9 14-9 3.866 0 7 3.134 7 7"
          fill="none"
          stroke="black"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">No projects yet</h3>
    <p className="max-w-md text-center text-zinc-600 dark:text-white/70">
      Create your first project—set a name and start assembling a short film from generated scenes.
    </p>
    <GlassButton onClick={onCreate}>
      <Plus className="h-4 w-4" />
      <span>Create project</span>
    </GlassButton>
  </GlassCard>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<Sort>("recent");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const { showAlert } = useGlobalAlert();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await listProjects();
      setProjects(data);
      setError(null);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Load error";
      setError(msg);
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = async () => {
    try {
      setRefreshing(true);
      const data = await listProjects();
      setProjects(data);
      setError(null);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Load error";
      setError(msg);
      showAlert("error", msg);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const list = useMemo(() => {
    const filtered = projects;
    if (sort === "az") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [projects, sort]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      showAlert("info", "Please enter a project name");
      return;
    }
    try {
      const created = await createProject(name);
      setProjects((prev) => [created, ...prev]);
      setNewName("");
      setCreateOpen(false);
      showAlert("success", "Project created");
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Failed to create project";
      showAlert("error", msg);
    }
  };

  const handleRename = async (id: string, nextName: string) => {
    const name = nextName.trim();
    if (!name) {
      showAlert("info", "Name cannot be empty");
      return;
    }
    try {
      const updated = await renameProject(id, name);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showAlert("success", "Project renamed");
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Failed to rename project";
      showAlert("error", msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showAlert("success", "Project deleted");
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Failed to delete project";
      showAlert("error", msg);
    }
  };

  const openProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="relative min-h-screen text-zinc-900 dark:text-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 rounded-2xl border border-black/5 bg-white/50 p-4 backdrop-blur-md ring-1 ring-black/10 dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <LogoWordmark />
              <div className="flex flex-wrap gap-3">
                <GlassButton onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span>New project</span>
                </GlassButton>
                <GlassButton variant="ghost" onClick={refreshProjects} loading={refreshing}>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </GlassButton>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-white/70">Sort:</span>
              <GlassButton
                variant={sort === "recent" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSort("recent")}
              >
                Recent
              </GlassButton>
              <GlassButton
                variant={sort === "az" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSort("az")}
              >
                A→Z
              </GlassButton>
            </div>
          </div>

          {loading ? (
            <GlassCard className="flex items-center justify-center py-16">
              <Loader size="lg" />
            </GlassCard>
          ) : error ? (
            <GlassCard className="py-10 text-center text-red-600 dark:text-red-300">
              Error: {error}
            </GlassCard>
          ) : projects.length === 0 ? (
            <EmptyState onCreate={() => setCreateOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => openProject(p.id)}
                  onRename={(name) => handleRename(p.id, name)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>

        <GlassModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create project"
          footer={
            <div className="flex gap-2">
              <GlassButton variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton onClick={handleCreate} disabled={!newName.trim()}>
                Create
              </GlassButton>
            </div>
          }
        >
          <div className="space-y-3">
            <GlassInput
              label="Project name"
              placeholder="e.g., Mustang Desert Short"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
            <p className="text-xs text-zinc-600 dark:text-white/60">
              Your project will appear in the list. You can rename it anytime.
            </p>
          </div>
        </GlassModal>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{
  project: Project;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}> = ({ project, onOpen, onRename, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const created = new Date(project.createdAt);
  const updated = new Date(project.updatedAt);

  useEffect(() => {
    setName(project.name);
  }, [project.name]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  const performSave = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(trimmed);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setName(project.name);
    setEditing(false);
  };

  return (
    <>
      <GlassCard className="group flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          {editing ? (
            <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap">
              <div className="min-w-0 flex-1">
                <GlassInput
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") performSave();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  aria-label="Edit project name"
                />
              </div>
              <div className="flex shrink-0 gap-2">
                <GlassButton size="sm" onClick={performSave}>
                  <Check className="h-4 w-4" />
                </GlassButton>
                <GlassButton size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </GlassButton>
              </div>
            </div>
          ) : (
            <h3
              className="line-clamp-2 cursor-text text-lg font-semibold tracking-tight"
              onDoubleClick={() => setEditing(true)}
              title="Double-click to rename"
            >
              {project.name}
            </h3>
          )}
          {!editing && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <GlassButton
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                aria-label="Rename"
                title="Rename"
              >
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Rename</span>
              </GlassButton>
              <GlassButton
                size="sm"
                variant="danger"
                onClick={() => setConfirmOpen(true)}
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </GlassButton>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-white/60">
          <span>Created: {created.toLocaleString()}</span>
          <span>Updated: {updated.toLocaleString()}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <GlassButton onClick={onOpen}>Open</GlassButton>
        </div>
      </GlassCard>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        tone="danger"
        title="Delete project?"
        description="Delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default HomePage;
