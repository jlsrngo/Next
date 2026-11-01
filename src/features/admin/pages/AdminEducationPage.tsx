import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState<number>(0);

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

  const openCreateModal = () => {
    setEditingItem(null);
    setInstitution('');
    setDegree('');
    setFieldOfStudy('Computer Science');
    setGrade('');
    setDescription('');
    setCurrent(false);
    setOrder(education.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setInstitution(item.institution || '');
    setDegree(item.degree || '');
    setFieldOfStudy(item.fieldOfStudy || item.field_of_study || '');
    setGrade(item.grade || item.gpa || '');
    setDescription(item.description || '');
    setCurrent(Boolean(item.current || item.is_current));
    setOrder(item.order ?? 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;
    setSubmitting(true);

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      grade: grade.trim() || null,
      description: description.trim(),
      current,
      order: Number(order) || 0,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/education/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Education at "${institution}" updated.` });
      } else {
        const res = await fetch('/api/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Education at "${institution}" registered.` });
      }

      setIsModalOpen(false);
      await fetchEducation();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete education at "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Education deleted.` });
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
            EDUCATION // <span className="font-mono text-faint font-normal">DOSSIER WORKBENCH</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Formal degrees, academic institutions, and computer science qualifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD EDUCATION</span>
          </button>
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
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST RECORD</span>
          </button>
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
                <div className="font-mono text-xs text-faint mt-0.5">{edu.institution}</div>

                {edu.description && (
                  <p className="font-sans text-xs text-faint mt-3 line-clamp-3 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
                <span className="text-faint">{edu.current ? 'CURRENT' : 'COMPLETED'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </button>
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  {editingItem ? '[ EDIT EDUCATION ]' : '[ NEW EDUCATION ]'}
                </div>
                <h3 className="font-display text-xl font-bold uppercase">
                  {editingItem ? 'UPDATE EDUCATION' : 'ADD EDUCATION RECORD'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-line hover:bg-bg-sunken text-ink transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-faint uppercase font-bold mb-1">Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Institut Teknologi Bandung"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Degree Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Field of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">GPA / Honors</label>
                <input
                  type="text"
                  placeholder="e.g. 3.85 / 4.00"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Academic achievements, thesis topic, relevant coursework..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <input
                    type="checkbox"
                    id="currentEduCheckbox"
                    checked={current}
                    onChange={(e) => setCurrent(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <label htmlFor="currentEduCheckbox" className="text-ink font-bold uppercase cursor-pointer text-[11px]">
                    Currently Studying
                  </label>
                </div>

                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <label className="text-faint uppercase font-bold text-[10px]">Order:</label>
                  <input
                    type="number"
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-16 border border-line bg-bg px-2 py-0.5 text-ink font-bold text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-line pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-5 py-2 font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingItem ? 'SAVE CHANGES' : 'CREATE RECORD'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
