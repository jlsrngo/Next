import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Link2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { socialLinksService } from '@/services/api';
import type { SocialLinkItemRecord } from '../components/SocialLinkAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminSocialLinkFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [platform, setPlatform] = useState('GitHub');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      socialLinksService
        .getSocialLinks()
        .then((items: unknown) => {
          const list = Array.isArray(items) ? (items as (SocialLinkItemRecord & { title?: string; description?: string; is_featured?: boolean; isFeatured?: boolean })[]) : [];
          const found = list.find((l) => String(l.id) === String(id));
          if (found) {
            setPlatform(found.platform || 'GitHub');
            setTitle(found.title || found.platform || '');
            setUrl(found.url || '');
            setDescription(found.description || '');
            setIsFeatured(Boolean(found.is_featured || found.isFeatured));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: 'Relay channel record not found.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      setFeedback({ type: 'error', message: 'Platform and Channel URL are required.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      platform: platform.trim(),
      title: title.trim() || platform.trim(),
      url: url.trim(),
      description: description.trim(),
      is_featured: isFeatured,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await socialLinksService.updateSocialLink(id, payload);
        setFeedback({ type: 'success', message: `Relay channel "${platform}" updated successfully! Redirecting...` });
      } else {
        await socialLinksService.createSocialLink(payload);
        setFeedback({ type: 'success', message: `Relay channel "${platform}" registered successfully! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/social-links');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setFeedback({ type: 'error', message });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-line bg-bg-raised p-16 text-center font-mono text-xs text-faint">
        <Loader2 size={24} className="animate-spin mx-auto mb-3 text-ink" />
        <div>RETRIEVING RELAY CHANNEL RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/social-links"
        returnLabel="RETURN TO SOCIAL RELAYS"
        systemCode={isEditing ? '[ 06 // EDIT COMMUNICATION RELAY ]' : '[ 06 // NEW COMMUNICATION RELAY ]'}
        title={isEditing ? 'EDIT RELAY //' : 'NEW RELAY //'}
        titleHighlight="CHANNEL"
        discardTo="/admin/social-links"
        submitLabel={isEditing ? 'SAVE CHANGES' : 'CONFIRM RELAY'}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Link2 size={13} />
            <span>[ CHANNEL CONFIGURATION & DESTINATION ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Platform Identifier *</label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. GitHub, LinkedIn, Twitter, Telegram, Discord"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Display Title / Handle</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. @jlsrngo or Julio's GitHub"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Destination URL *</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Channel Purpose & Communication Note
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Public developer portfolio, open source contributions, and engineering thoughts..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 border border-line bg-bg p-4">
                <input
                  type="checkbox"
                  id="featuredRelayToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <div>
                  <label htmlFor="featuredRelayToggle" className="text-ink font-bold uppercase cursor-pointer block text-xs">
                    ★ Priority Relay Channel
                  </label>
                  <span className="text-[10px] text-faint block">
                    Highlighted in footer telemetry and contact channels.
                  </span>
                </div>
              </div>

              <div className="border border-line bg-bg p-4 flex items-center justify-between">
                <div>
                  <label className="text-ink font-bold uppercase block text-xs">Order Index</label>
                  <span className="text-[10px] text-faint block">Sort sequence index</span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-20 border border-line bg-bg-raised px-3 py-1.5 text-ink font-bold text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={submitting}
            className="border border-line bg-invert-bg text-invert-fg px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {submitting ? 'COMMITTING TO NEON...' : isEditing ? 'UPDATE RELAY' : 'DEPLOY RELAY'}
          </button>
        </div>
      </form>
    </div>
  );
}
