import React, { useState, useEffect } from 'react';
import {
  Trophy,
  ExternalLink,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { achievementsService } from '@/services/api';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCredentialUrl, setFormCredentialUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formOrder, setFormOrder] = useState<number>(0);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await achievementsService.getAchievements();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormIssuer('');
    setFormDescription('');
    setFormCredentialUrl('');
    setFormFeatured(false);
    setFormOrder(achievements.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormTitle(item.title || '');
    setFormIssuer(item.issuer || '');
    setFormDescription(item.description || '');
    setFormCredentialUrl(item.credentialUrl || item.credential_url || '');
    setFormFeatured(Boolean(item.featured));
    setFormOrder(item.order ?? 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setSubmitting(true);

    const payload = {
      title: formTitle.trim(),
      issuer: formIssuer.trim(),
      description: formDescription.trim(),
      credentialUrl: formCredentialUrl.trim() || null,
      featured: formFeatured,
      order: Number(formOrder) || 0,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/achievements/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Achievement "${formTitle}" updated.` });
      } else {
        const res = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Achievement "${formTitle}" registered.` });
      }

      setIsModalOpen(false);
      await fetchAchievements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete achievement "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Achievement "${title}" deleted.` });
      await fetchAchievements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Deletion failed.' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = achievements.filter((a) => {
    return (
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.issuer?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 05 // VERIFIED CREDENTIALS & AWARDS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            ACHIEVEMENTS // <span className="font-mono text-faint font-normal">HONORS WORKBENCH</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Verified certifications, competitions, and institutional honors recorded in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD ACHIEVEMENT</span>
          </button>
          <button
            onClick={fetchAchievements}
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
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST ACHIEVEMENT</span>
          </button>
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
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </button>
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  {editingItem ? '[ EDIT CREDENTIAL ]' : '[ NEW CREDENTIAL ]'}
                </div>
                <h3 className="font-display text-xl font-bold uppercase">
                  {editingItem ? 'UPDATE ACHIEVEMENT' : 'NEW ACHIEVEMENT'}
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
                <label className="block text-faint uppercase font-bold mb-1">Achievement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place National Hackathon"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Issuing Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Developer Student Clubs"
                  value={formIssuer}
                  onChange={(e) => setFormIssuer(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details of the award or certification..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Credential URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formCredentialUrl}
                  onChange={(e) => setFormCredentialUrl(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <input
                    type="checkbox"
                    id="featuredAchCheckbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <label htmlFor="featuredAchCheckbox" className="text-ink font-bold uppercase cursor-pointer text-[11px]">
                    Notable Badge
                  </label>
                </div>

                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <label className="text-faint uppercase font-bold text-[10px]">Order:</label>
                  <input
                    type="number"
                    min={0}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
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
