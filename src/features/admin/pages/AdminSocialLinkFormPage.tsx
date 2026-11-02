import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Link2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';
import { socialLinksService } from '@/services/api';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminSocialLinkFormPage() {
  const locale = useLocale();
  const isId = locale === 'id';
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [platform, setPlatform] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      socialLinksService
        .getSocialLinks()
        .then((links) => {
          const found = (links || []).find((l) => String(l.id) === String(id));
          if (found) {
            setPlatform(found.platform || '');
            setTitle(found.title || found.username || '');
            setUrl(found.url || '');
            setDescription(found.description || '');
            setIsFeatured(Boolean(found.isFeatured || found.is_featured));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: isId ? 'Saluran relay tidak ditemukan.' : 'Relay channel not found in database.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, isId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      setFeedback({ type: 'error', message: isId ? 'Nama Platform dan URL tujuan wajib diisi.' : 'Platform Name and Destination URL are required.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      platform: platform.trim(),
      title: title.trim() || platform.trim(),
      url: url.trim(),
      description: description.trim(),
      isFeatured,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await socialLinksService.updateSocialLink(id, payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Relay "${platform}" berhasil diperbarui! Mengalihkan...`
            : `Relay "${platform}" updated successfully! Redirecting...`,
        });
      } else {
        await socialLinksService.createSocialLink(payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Relay "${platform}" berhasil disimpan ke PostgreSQL! Mengalihkan...`
            : `Relay "${platform}" deployed to PostgreSQL! Redirecting...`,
        });
      }

      setTimeout(() => {
        navigate('/admin/social-links');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (isId ? 'Operasi gagal' : 'Operation failed');
      setFeedback({ type: 'error', message });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-line bg-bg-raised p-16 text-center font-mono text-xs text-faint">
        <Loader2 size={24} className="animate-spin mx-auto mb-3 text-ink" />
        <div>{isId ? 'MEMUAT DATA SALURAN RELAY...' : 'RETRIEVING RELAY CHANNEL RECORD...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/social-links"
        returnLabel={isId ? 'KEMBALI KE RELAY SOSIAL' : 'RETURN TO SOCIAL RELAYS'}
        systemCode={
          isEditing
            ? (isId ? '[ 06 // EDIT RELAY KOMUNIKASI ]' : '[ 06 // EDIT COMMUNICATION RELAY ]')
            : (isId ? '[ 06 // RELAY KOMUNIKASI BARU ]' : '[ 06 // NEW COMMUNICATION RELAY ]')
        }
        title={
          isEditing
            ? (isId ? 'EDIT RELAY //' : 'EDIT RELAY //')
            : (isId ? 'RELAY BARU //' : 'NEW RELAY //')
        }
        titleHighlight={isId ? 'SALURAN' : 'CHANNEL'}
        discardTo="/admin/social-links"
        submitLabel={
          isEditing
            ? (isId ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES')
            : (isId ? 'SIMPAN RELAY' : 'CONFIRM RELAY')
        }
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
            <span>{isId ? '[ KONFIGURASI SALURAN & TUJUAN ]' : '[ CHANNEL CONFIGURATION & DESTINATION ]'}</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Identifikasi Platform *' : 'Platform Identifier *'}
                </label>
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
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Nama Tampilan / Username' : 'Display Title / Handle'}
                </label>
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
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'URL Tujuan *' : 'Destination URL *'}
              </label>
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
                {isId ? 'Tujuan Saluran & Catatan' : 'Channel Purpose & Communication Note'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isId
                    ? 'Portofolio publik pengembang, kontribusi sumber terbuka, dan pemikiran rekayasa...'
                    : 'Public developer portfolio, open source contributions, and engineering thoughts...'
                }
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
                    ★ {isId ? 'Saluran Relay Prioritas' : 'Priority Relay Channel'}
                  </label>
                  <span className="text-[10px] text-faint">
                    {isId ? 'Tampilkan dengan sorotan prioritas di kartu kontak' : 'Render with priority accent on contact overview'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Indeks Urutan Tampilan' : 'Sort Sequence Index'}
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
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
            {submitting
              ? (isId ? 'MENYIMPAN KE POSTGRESQL...' : 'SAVING TO POSTGRESQL...')
              : isEditing
              ? (isId ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES')
              : (isId ? 'SIMPAN RELAY' : 'CONFIRM RELAY')}
          </button>
        </div>
      </form>
    </div>
  );
}
