import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';

export default function AdminEducationPage() {
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setEducation(Array.isArray(data.education) ? data.education : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete education record at "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Education record deleted.` });
      await fetchEducation();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Deletion failed.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 04 // ACADEMIC FOUNDATIONS & CREDENTIALS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            EDUCATION // <span className="font-mono text-faint font-normal">DOSSIER REGISTRY</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Formal degrees, academic institutions, and computer science qualifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/education/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD EDUCATION</span>
          </Link>
          <button
            onClick={fetchEducation}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
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

      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING ACADEMIC DOSSIER...</div>
        </div>
      ) : education.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <GraduationCap size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO FORMAL EDUCATION RECORDS FOUND.</div>
          <Link
            to="/admin/education/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST RECORD</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="border border-line bg-bg-raised p-6 relative flex flex-col justify-between">
              <CornerCrosses />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                    DEGREE // #{String(edu.order ?? idx + 1).padStart(2, '0')}
                  </span>
                  {edu.grade && (
                    <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
                      GPA {edu.grade}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-ink">{edu.degree}</h3>
                <div className="font-mono text-xs font-bold text-ink/80 mt-1">{edu.fieldOfStudy || edu.field_of_study}</div>
                <div className="font-mono text-xs text-faint mt-0.5">{edu.institution} • {edu.location || 'Indonesia'}</div>

                {edu.description && (
                  <p className="font-sans text-xs text-faint mt-3 line-clamp-3 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
                <span className="text-faint">{edu.current ? 'CURRENT' : 'COMPLETED'}</span>
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/admin/education/${edu.id}/edit`}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(edu.id, edu.institution)}
                    disabled={deletingId === edu.id}
                    className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all"
                  >
                    {deletingId === edu.id ? (
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
