import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Trophy, Star } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';
import { achievementsService } from '@/services/api';
import type { AchievementItemRecord } from '../components/AchievementAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminAchievementFormPage() {
  const locale = useLocale();
  const isId = locale === 'id';
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [description, setDescription] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      achievementsService
        .getAchievements()
        .then((items: unknown) => {
          const list = Array.isArray(items) ? (items as AchievementItemRecord[]) : [];
          const found = list.find((a) => String(a.id) === String(id));
          if (found) {
            setTitle(found.title || '');
            setIssuer(found.issuer || '');
            setDescription(found.description || '');
            setCredentialUrl(found.credentialUrl || '');
            setFeatured(Boolean(found.featured));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({
              type: 'error',
              message: isId ? 'Data pencapaian tidak ditemukan.' : 'Achievement record not found.',
            });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, isId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      setFeedback({
        type: 'error',
        message: isId ? 'Judul dan Lembaga Penerbit wajib diisi.' : 'Title and Issuer are required fields.',
      });
      return;
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      issuer: issuer.trim(),
      description: description.trim(),
      credentialUrl: credentialUrl.trim() || undefined,
      featured,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await achievementsService.updateAchievement(id, payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Pencapaian "${title}" berhasil diperbarui! Mengalihkan...`
            : `Achievement "${title}" updated successfully! Redirecting...`,
        });
      } else {
        await achievementsService.createAchievement(payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Pencapaian "${title}" berhasil disimpan di PostgreSQL! Mengalihkan...`
            : `Achievement "${title}" recorded in PostgreSQL! Redirecting...`,
        });
      }

      setTimeout(() => {
        navigate('/admin/achievements');
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
        <div>{isId ? 'MEMUAT DATA PENCAPAIAN...' : 'RETRIEVING ACHIEVEMENT RECORD...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/achievements"
        returnLabel={isId ? 'KEMBALI KE REGISTRI PENCAPAIAN' : 'RETURN TO ACHIEVEMENTS REGISTRY'}
        systemCode={
          isEditing
            ? (isId ? '[ 05 // EDIT SPESIFIKASI KREDENSIAL ]' : '[ 05 // EDIT CREDENTIAL SPEC ]')
            : (isId ? '[ 05 // SPESIFIKASI KREDENSIAL BARU ]' : '[ 05 // NEW CREDENTIAL SPEC ]')
        }
        title={
          isEditing
            ? (isId ? 'EDIT PENCAPAIAN //' : 'EDIT ACHIEVEMENT //')
            : (isId ? 'PENCAPAIAN BARU //' : 'NEW ACHIEVEMENT //')
        }
        titleHighlight={isId ? 'DOSIR' : 'DOSSIER'}
        discardTo="/admin/achievements"
        submitLabel={
          isEditing
            ? (isId ? 'SIMPAN PERUBAHAN' : 'UPDATE RECORD')
            : (isId ? 'SIMPAN PENCAPAIAN' : 'CONFIRM RECORD')
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
            <Trophy size={13} />
            <span>{isId ? '[ SPESIFIKASI KREDENSIAL & PENERBIT ]' : '[ CREDENTIAL & ISSUER SPEC ]'}</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Judul Pencapaian *' : 'Achievement Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isId ? 'cth. Juara 1 Hackathon Nasional' : 'e.g. 1st Place National Hackathon'}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Organisasi / Lembaga Penerbit *' : 'Issuing Organization *'}
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder={isId ? 'cth. Kementerian Kominfo / Google' : 'e.g. Kementerian Kominfo / Google'}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'Sinopsis & Cakupan' : 'Synopsis & Scope'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isId
                    ? 'Ringkasan singkat cakupan sertifikat, tantangan kompetisi, atau kriteria verifikasi...'
                    : 'Brief summary of credential scope, competition challenge, or verification criteria...'
                }
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'URL Verifikasi / Kredensial (Opsional)' : 'Verification / Credential URL (Optional)'}
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://verify.example.org/certificate/..."
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Star size={13} />
            <span>{isId ? '[ KEUNGGULAN & PRIORITAS ]' : '[ NOTABILITY & PRIORITY ]'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 border border-line bg-bg p-4">
              <input
                type="checkbox"
                id="featuredAchievementToggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
              <label htmlFor="featuredAchievementToggle" className="cursor-pointer select-none">
                <span className="font-bold block uppercase text-ink">
                  {isId ? 'Penghargaan Unggulan' : 'Notable Honor'}
                </span>
                <span className="text-[10px] text-faint">
                  {isId ? 'Sorot dengan lencana pada dosir publik' : 'Highlight with badge in public dossier'}
                </span>
              </label>
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={submitting}
            className="border border-line bg-invert-bg text-invert-fg px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {submitting
              ? (isId ? 'MENYIMPAN KE POSTGRESQL...' : 'COMMITTING TO POSTGRESQL...')
              : isEditing
              ? (isId ? 'PERBARUI DOSIR' : 'UPDATE DOSSIER')
              : (isId ? 'DAFTARKAN PENGHARGAAN' : 'REGISTER HONOR')}
          </button>
        </div>
      </form>
    </div>
  );
}
