import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, RefreshCw, Search } from 'lucide-react';
import { projectsService } from '@/services/api';
import type { Project } from '@/types/project.types';
import ProjectAdminCard from '../components/ProjectAdminCard';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

type FilterType = 'all' | 'featured' | 'normal';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<FilterType>('all');
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchProjects = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects();
      if (signal?.aborted) return;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const message = err instanceof Error ? err.message : 'Failed to synchronize projects';
      console.error('[AdminProjects] Fetch error:', message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  const getTechArray = useCallback((p: Project): string[] => {
    const val = p.techStack ?? p.tech_stack;
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, []);

  const handleDelete = useCallback(
    async (id: string | number, title: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete project "${title}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        const res = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Deletion request rejected by server');
        setFeedback({ type: 'success', message: `Project "${title}" deleted from registry.` });
        await fetchProjects();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchProjects]
  );

  const counts = useMemo(
    () => ({
      all: projects.length,
      featured: projects.filter((p) => p.featured).length,
      normal: projects.filter((p) => !p.featured).length,
    }),
    [projects]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((p) => {
      const techList = getTechArray(p);
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        techList.some((t) => t.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (filterFeatured === 'featured') return p.featured;
      if (filterFeatured === 'normal') return !p.featured;
      return true;
    });
  }, [projects, search, filterFeatured, getTechArray]);

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 02 // REPOSITORY ARCHIVE & WORK MATRIX ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            PROJECTS // <span className="font-mono text-faint font-normal">REGISTRY</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Direct inventory management for showcased repositories, engineering deployments, and case studies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>ADD PROJECT</span>
          </Link>
          <button
            type="button"
            onClick={() => fetchProjects()}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            title="Refresh database records"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Banner Component */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-line bg-bg-raised p-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search by title, description, or technology tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-line bg-bg font-mono text-xs">
            <button
              type="button"
              onClick={() => setFilterFeatured('all')}
              className={`px-3 py-1.5 uppercase transition-all ${
                filterFeatured === 'all'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              ALL ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured('featured')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'featured'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              FEATURED ({counts.featured})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured('normal')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'normal'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              NORMAL ({counts.normal})
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display: Separated Swiss Brutalist Cards */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING PROJECT REGISTRY FROM POSTGRESQL DAEMON...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <FolderOpen size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO PROJECTS FOUND IN REGISTRY.</div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST PROJECT</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((proj, idx) => (
            <ProjectAdminCard
              key={proj.id}
              project={proj}
              index={idx}
              techList={getTechArray(proj)}
              isDeleting={deletingId === proj.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
