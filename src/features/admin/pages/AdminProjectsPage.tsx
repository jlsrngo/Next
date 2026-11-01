import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  ExternalLink,
  Github,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { projectsService } from '@/services/api';
import type { Project } from '@/types/project.types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'normal'>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getTechArray = (p: Project): string[] => {
    const val = p.techStack ?? p.tech_stack;
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val).split(',').map((s) => s.trim()).filter(Boolean);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete project "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Project "${title}" deleted from registry.` });
      await fetchProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Deletion failed.' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter((p) => {
    const techList = getTechArray(p);
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      techList.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterFeatured === 'featured') return p.featured;
    if (filterFeatured === 'normal') return !p.featured;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-ink">
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

        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD PROJECT</span>
          </Link>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            title="Refresh database records"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`border px-4 py-3 font-mono text-xs flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'border-line bg-bg-raised text-ink'
              : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-faint hover:text-ink">
            <X size={14} />
          </button>
        </div>
      )}

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
              onClick={() => setFilterFeatured('all')}
              className={`px-3 py-1.5 uppercase transition-all ${
                filterFeatured === 'all' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
              }`}
            >
              ALL ({projects.length})
            </button>
            <button
              onClick={() => setFilterFeatured('featured')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'featured' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
              }`}
            >
              FEATURED ({projects.filter((p) => p.featured).length})
            </button>
            <button
              onClick={() => setFilterFeatured('normal')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'normal' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
              }`}
            >
              NORMAL ({projects.filter((p) => !p.featured).length})
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
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
        <div className="border border-line bg-bg-raised overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-line bg-bg-sunken text-faint text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-bold">ORD</th>
                  <th className="py-2.5 px-4 font-bold">PROJECT & DESCRIPTION</th>
                  <th className="py-2.5 px-4 font-bold">TECH STACK</th>
                  <th className="py-2.5 px-4 font-bold">STATUS</th>
                  <th className="py-2.5 px-4 font-bold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((proj, idx) => {
                  const techList = getTechArray(proj);
                  const github = proj.githubUrl ?? proj.github_url;
                  const live = proj.liveUrl ?? proj.live_url;

                  return (
                    <tr key={proj.id} className="hover:bg-bg-sunken/60 transition-colors">
                      <td className="py-3 px-4 text-faint align-top font-bold">
                        {String(proj.order ?? idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 align-top max-w-sm">
                        <div className="font-bold text-ink text-sm flex items-center gap-2">
                          <span>{proj.title}</span>
                          {proj.featured && (
                            <span className="border border-line bg-bg px-1.5 py-0.5 text-[9px] uppercase font-bold text-ink">
                              ★ FEATURED
                            </span>
                          )}
                        </div>
                        <p className="text-faint text-xs mt-1 line-clamp-2 font-sans">{proj.description}</p>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {techList.map((t: string) => (
                            <span
                              key={t}
                              className="border border-line bg-bg px-1.5 py-0.5 text-[10px] uppercase text-ink"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold border ${
                            proj.featured
                              ? 'border-line bg-invert-bg text-invert-fg'
                              : 'border-line bg-bg text-faint'
                          }`}
                        >
                          {proj.featured ? 'PRIORITY' : 'INDEXED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {github && (
                            <a
                              href={github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 border border-line bg-bg hover:bg-bg-sunken text-ink transition-all"
                              title="View GitHub"
                            >
                              <Github size={13} />
                            </a>
                          )}
                          {live && (
                            <a
                              href={live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 border border-line bg-bg hover:bg-bg-sunken text-ink transition-all"
                              title="View Live"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <Link
                            to={`/admin/projects/${proj.id}/edit`}
                            className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all font-mono text-[10px] uppercase font-bold"
                            title="Edit Project Specification"
                          >
                            <Edit3 size={11} />
                            <span>EDIT</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(String(proj.id), proj.title)}
                            disabled={deletingId === String(proj.id)}
                            className="p-1.5 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all"
                            title="Delete Project"
                          >
                            {deletingId === String(proj.id) ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
