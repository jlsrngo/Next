import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Loader2,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

interface ExperienceRecord {
  id: string | number;
  position: string;
  company?: string;
  company_name?: string;
  location?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  current?: boolean;
  is_current?: boolean;
  description?: string;
  order?: number;
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchExperiences = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch('/api/about', { signal });
      if (res.ok) {
        const data = await res.json();
        if (signal?.aborted) return;
        setExperiences(Array.isArray(data.experiences) ? data.experiences : []);
      }
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminExperiences] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchExperiences(controller.signal);
    return () => controller.abort();
  }, [fetchExperiences]);

  const handleDelete = useCallback(
    async (id: string | number, name: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete experience at "${name}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        const res = await fetch(`/api/experiences/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Deletion failed');
        setFeedback({ type: 'success', message: `Experience at "${name}" deleted.` });
        await fetchExperiences();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchExperiences]
  );

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 03 // PROFESSIONAL CHRONOLOGY & DEPLOYMENTS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            EXPERIENCES // <span className="font-mono text-faint font-normal">TIMELINE REGISTRY</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Chronological engineering roles, organizational responsibilities, and system impacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/admin/experiences/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>ADD EXPERIENCE</span>
          </Link>
          <button
            onClick={fetchExperiences}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING CAREER TIMELINE...</div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Briefcase size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO WORK EXPERIENCES INDEXED IN POSTGRESQL.</div>
          <Link
            to="/admin/experiences/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST EXPERIENCE</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="border border-line bg-bg-raised p-6 relative">
              <CornerCrosses />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3 mb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    ROLE // #{String(exp.order ?? idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mt-0.5">{exp.position}</h3>
                  <div className="font-mono text-xs text-faint font-bold text-ink/80">
                    {exp.company || exp.company_name} • {exp.location || 'Remote'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/experiences/${exp.id}/edit`}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all font-mono text-xs uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(exp.id, exp.company || exp.company_name)}
                    disabled={deletingId === exp.id}
                    className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all"
                  >
                    {deletingId === exp.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="font-sans text-xs text-ink/90 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
