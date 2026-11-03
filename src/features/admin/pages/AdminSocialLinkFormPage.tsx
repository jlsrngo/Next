import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Link2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';
import { socialLinksService } from '@/services/api';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export const POPULAR_PLATFORMS = [
  { id: 'github', label: 'GitHub', defaultUrl: 'https://github.com/' },
  { id: 'linkedin', label: 'LinkedIn', defaultUrl: 'https://linkedin.com/in/' },
  { id: 'threads', label: 'Threads', defaultUrl: 'https://www.threads.com/@' },
  { id: 'twitter', label: 'Twitter / X', defaultUrl: 'https://x.com/' },
  { id: 'instagram', label: 'Instagram', defaultUrl: 'https://instagram.com/' },
  { id: 'discord', label: 'Discord', defaultUrl: 'https://discord.gg/' },
  { id: 'telegram', label: 'Telegram', defaultUrl: 'https://t.me/' },
  { id: 'youtube', label: 'YouTube', defaultUrl: 'https://youtube.com/@' },
  { id: 'tiktok', label: 'TikTok', defaultUrl: 'https://tiktok.com/@' },
  { id: 'facebook', label: 'Facebook', defaultUrl: 'https://facebook.com/' },
  { id: 'whatsapp', label: 'WhatsApp', defaultUrl: 'https://wa.me/' },
  { id: 'email', label: 'Email / Gmail', defaultUrl: 'mailto:' },
  { id: 'website', label: 'Website / Portfolio', defaultUrl: 'https://' },
  { id: 'custom', label: 'Custom / Other Platform...', defaultUrl: 'https://' },
] as const;

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
  const [selectedPreset, setSelectedPreset] = useState<string>('');
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
            const rawPlatform = (found.platform || '').trim();
            setPlatform(rawPlatform);

            const match = POPULAR_PLATFORMS.find(
              (p) => p.id === rawPlatform.toLowerCase() || p.label.toLowerCase() === rawPlatform.toLowerCase()
            );
            if (match && match.id !== 'custom') {
              setSelectedPreset(match.id);
            } else if (rawPlatform) {
              setSelectedPreset('custom');
            }

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

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'custom') {
      if (POPULAR_PLATFORMS.some((p) => p.id === platform.toLowerCase())) {
        setPlatform('');
      }
      return;
    }

    const matched = POPULAR_PLATFORMS.find((p) => p.id === presetId);
    if (matched) {
      setPlatform(matched.id);
      // Auto-populate Title if empty or was set to previous preset
      if (!title || POPULAR_PLATFORMS.some((p) => p.label === title || p.id === title)) {
        setTitle(matched.label);
      }
      // Auto-populate URL if empty or default template
      if (!url || url === 'https://' || POPULAR_PLATFORMS.some((p) => p.defaultUrl === url)) {
        setUrl(matched.defaultUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPlatform = platform.trim() || selectedPreset;
    if (!finalPlatform || !url.trim()) {
      setFeedback({ type: 'error', message: isId ? 'Pilih Platform dan isi URL tujuan.' : 'Select a Platform and Destination URL.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      platform: finalPlatform,
      title: title.trim() || finalPlatform,
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
            ? `Relay "${finalPlatform}" berhasil diperbarui! Mengalihkan...`
            : `Relay "${finalPlatform}" updated successfully! Redirecting...`,
        });
      } else {
        await socialLinksService.createSocialLink(payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Relay "${finalPlatform}" berhasil disimpan ke PostgreSQL! Mengalihkan...`
            : `Relay "${finalPlatform}" deployed to PostgreSQL! Redirecting...`,
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
                  {isId ? 'Platform Media Sosial *' : 'Social Media Platform *'}
                </label>
                <select
                  required
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all uppercase cursor-pointer"
                >
                  <option value="" disabled>
                    -- {isId ? 'PILIH PLATFORM MEDIA SOSIAL' : 'SELECT SOCIAL PLATFORM'} --
                  </option>
                  {POPULAR_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label.toUpperCase()}
                    </option>
                  ))}
                </select>

                {selectedPreset === 'custom' && (
                  <div className="mt-2.5 space-y-1">
                    <label className="block text-[10px] text-faint uppercase font-bold">
                      {isId ? 'Nama Platform Kustom *' : 'Custom Platform Identifier *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. Mastodon, Medium, Dribbble"
                      className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                    />
                  </div>
                )}
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
                  {isId ? 'Urutan Indeks Relay' : 'Sort Sequence Index'}
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="border border-line bg-invert-bg text-invert-fg px-6 py-3 font-mono text-xs uppercase font-bold hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {submitting
              ? (isId ? 'MENYIMPAN...' : 'SAVING...')
              : (isEditing ? (isId ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES') : (isId ? 'SIMPAN RELAY' : 'CONFIRM RELAY'))}
          </button>
        </div>
      </form>
    </div>
  );
}
