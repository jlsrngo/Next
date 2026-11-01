import React, { useState, useEffect } from 'react';
import {
  Link2,
  ExternalLink,
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
import { socialLinksService } from '@/services/api';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [platform, setPlatform] = useState('GitHub');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await socialLinksService.getSocialLinks();
      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setPlatform('GitHub');
    setTitle('');
    setUrl('');
    setDescription('');
    setIsFeatured(false);
    setOrder(links.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setPlatform(item.platform || 'GitHub');
    setTitle(item.title || item.platform || '');
    setUrl(item.url || '');
    setDescription(item.description || '');
    setIsFeatured(Boolean(item.is_featured || item.isFeatured));
    setOrder(item.order ?? 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;
    setSubmitting(true);

    const payload = {
      platform: platform.trim(),
      title: (title.trim() || platform.trim()),
      url: url.trim(),
      description: description.trim(),
      is_featured: isFeatured,
      order: Number(order) || 0,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/social-links/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Relay channel "${platform}" updated.` });
      } else {
        const res = await fetch('/api/social-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Relay channel "${platform}" registered.` });
      }

      setIsModalOpen(false);
      await fetchLinks();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Permanently delete relay channel "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      setFeedback({ type: 'success', message: `Relay channel deleted.` });
      await fetchLinks();
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
            [ 06 // RELAY CHANNELS & COMMUNICATION ENDPOINTS ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            SOCIAL LINKS // <span className="font-mono text-faint font-normal">RELAY WORKBENCH</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Outbound relays, developer networks, and communication handles recorded in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD RELAY</span>
          </button>
          <button
            onClick={fetchLinks}
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
          <div>SYNCHRONIZING SOCIAL RELAYS...</div>
        </div>
      ) : links.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Link2 size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO SOCIAL RELAY CHANNELS CONFIGURED.</div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST RELAY</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((link, idx) => (
            <div key={link.id || idx} className="border border-line bg-bg-raised p-5 relative flex flex-col justify-between">
              <CornerCrosses />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                    CH // #{String(link.order ?? idx + 1).padStart(2, '0')}
                  </span>
                  <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
                    ONLINE
                  </span>
                </div>

                <div className="font-display text-lg font-bold text-ink uppercase">
                  {link.platform}
                </div>
                <div className="font-mono text-xs text-faint truncate mt-1">
                  {link.username || link.url}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all"
                >
                  <span>TEST</span>
                  <ExternalLink size={10} />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(link)}
                    className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all uppercase font-bold"
                  >
                    <Edit3 size={11} />
                    <span>EDIT</span>
                  </button>
                  <button
                    onClick={() => handleDelete(link.id, link.platform)}
                    disabled={deletingId === link.id}
                    className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all"
                  >
                    {deletingId === link.id ? (
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
          <div className="relative w-full max-w-md border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  {editingItem ? '[ EDIT RELAY ]' : '[ NEW RELAY ]'}
                </div>
                <h3 className="font-display text-xl font-bold uppercase">
                  {editingItem ? 'UPDATE CHANNEL' : 'ADD RELAY CHANNEL'}
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
                <label className="block text-faint uppercase font-bold mb-1">Platform *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub, LinkedIn, Twitter, Telegram"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Channel URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. @username or Julio's GitHub"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief note on communication purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 border border-line bg-bg-raised p-2">
                  <input
                    type="checkbox"
                    id="featuredRelayCheckbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <label htmlFor="featuredRelayCheckbox" className="text-ink font-bold uppercase cursor-pointer text-[11px]">
                    Featured Relay
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
