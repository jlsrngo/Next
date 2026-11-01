import React, { useState, useEffect } from 'react';
import {
  Briefcase,
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

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState<number>(0);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setExperiences(Array.isArray(data.experiences) ? data.experiences : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setCompany('');
    setPosition('');
    setLocation('Remote');
    setDescription('');
    setCurrent(false);
    setOrder(experiences.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setCompany(item.company || item.company_name || '');
    setPosition(item.position || '');
    setLocation(item.location || 'Remote');
    setDescription(item.description || '');
    setCurrent(Boolean(item.current || item.is_current));
    setOrder(item.order ?? 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;
    setSubmitting(true);

    const payload = {
      company: company.trim(),
      position: position.trim(),
      location: location.trim(),
      description: description.trim(),
      current,
      order: Number(order) || 0,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/experiences/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Experience at "${company}" updated.` });
      } else {
        const res = await fetch('/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Experience at "${company}" recorded.` });
      }

      setIsModalOpen(false);
      await fetchExperiences();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete experience at "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Experience deleted.` });
      await fetchExperiences();
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
            [ 03 // PROFESSIONAL CHRONOLOGY & DEPLOYMENTS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            EXPERIENCES // <span className="font-mono text-faint font-normal">TIMELINE WORKBENCH</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Chronological engineering roles, organizational responsibilities, and system impacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD EXPERIENCE</span>
          </button>
          <button
            onClick={fetchExperiences}
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
          <div>SYNCHRONIZING CAREER TIMELINE...</div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Briefcase size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO WORK EXPERIENCES INDEXED IN POSTGRESQL.</div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST EXPERIENCE</span>
          </button>
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
                  <button
                    onClick={() => openEditModal(exp)}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all font-mono text-xs uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </button>
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  {editingItem ? '[ EDIT ROLE ]' : '[ NEW ROLE ]'}
                </div>
                <h3 className="font-display text-xl font-bold uppercase">
                  {editingItem ? 'UPDATE EXPERIENCE' : 'ADD WORK EXPERIENCE'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Systems"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Position Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Jakarta, Indonesia / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Key Responsibilities / Impact</label>
                <textarea
                  rows={3}
                  placeholder="Summary of engineering achievements and technical contributions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <input
                    type="checkbox"
                    id="currentRoleCheckbox"
                    checked={current}
                    onChange={(e) => setCurrent(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <label htmlFor="currentRoleCheckbox" className="text-ink font-bold uppercase cursor-pointer text-[11px]">
                    Current Position
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
