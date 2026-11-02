import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  ExternalLink,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit3,
  Loader2,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { achievementsService } from '@/services/api';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

interface AchievementRecord {
  id: string | number;
  title: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  credentialUrl?: string;
  featured?: boolean;
  order?: number;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchAchievements = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await achievementsService.getAchievements();
      if (signal?.aborted) return;
      setAchievements(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminAchievements] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAchievements(controller.signal);
    return () => controller.abort();
  }, [fetchAchievements]);

  const handleDelete = useCallback(
    async (id: string | number, title: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete achievement "${title}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        const res = await fetch(`/api/achievements/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Deletion failed');
        setFeedback({ type: 'success', message: `Achievement "${title}" deleted from registry.` });
        await fetchAchievements();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchAchievements]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter((a) => {
      return (
        a.title?.toLowerCase().includes(q) ||
        a.issuer?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      );
    });
  }, [achievements, search]);

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 05 // VERIFIED CREDENTIALS & AWARDS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            ACHIEVEMENTS // <span className="font-mono text-faint font-normal">HONORS REGISTRY</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Verified certifications, competitions, and institutional honors recorded in PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/admin/achievements/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>ADD ACHIEVEMENT</span>
          </Link>
          <button
            onClick={fetchAchievements}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Search Bar */}
      <div className="border border-line bg-bg-raised p-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search credentials by title, issuing entity, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING ACHIEVEMENTS CATALOG...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Trophy size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO ACHIEVEMENTS FOUND IN REGISTRY.</div>
          <Link
            to="/admin/achievements/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST ACHIEVEMENT</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div key={item.id || idx} className="border border-line bg-bg-raised p-5 relative flex flex-col justify-between">
              <CornerCrosses />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                    REG // #{String(item.order ?? idx + 1).padStart(2, '0')}
                  </span>
                  {item.featured && (
                    <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
                      ★ NOTABLE
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-bold text-ink">{item.title}</h3>
                <div className="font-mono text-xs text-faint mt-1 flex items-center gap-2">
                  <span className="font-bold text-ink">{item.issuer}</span>
                  {item.issueDate && <span>• {new Date(item.issueDate).getFullYear()}</span>}
                </div>

                {item.description && (
                  <p className="font-sans text-xs text-faint mt-3 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all"
                    >
                      <span>VERIFY</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/admin/achievements/${item.id}/edit`}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deletingId === item.id}
                    className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
