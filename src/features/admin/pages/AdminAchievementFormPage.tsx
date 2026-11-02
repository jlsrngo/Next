import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Trophy, Star } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { achievementsService } from '@/services/api';
import type { AchievementItemRecord } from '../components/AchievementAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminAchievementFormPage() {
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
            setFeedback({ type: 'error', message: 'Achievement record not found.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      setFeedback({ type: 'error', message: 'Title and Issuer are required fields.' });
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
        setFeedback({ type: 'success', message: `Achievement "${title}" updated successfully! Redirecting...` });
      } else {
        await achievementsService.createAchievement(payload);
        setFeedback({ type: 'success', message: `Achievement "${title}" recorded in PostgreSQL! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/achievements');
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
        <div>RETRIEVING ACHIEVEMENT RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/achievements"
        returnLabel="RETURN TO ACHIEVEMENTS REGISTRY"
        systemCode={isEditing ? '[ 05 // EDIT CREDENTIAL SPEC ]' : '[ 05 // NEW CREDENTIAL SPEC ]'}
        title={isEditing ? 'EDIT ACHIEVEMENT //' : 'NEW ACHIEVEMENT //'}
        titleHighlight="DOSSIER"
        discardTo="/admin/achievements"
        submitLabel={isEditing ? 'UPDATE RECORD' : 'CONFIRM RECORD'}
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
            <span>[ CREDENTIAL & ISSUER SPEC ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1st Place National Hackathon"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Kementerian Kominfo / Google"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Synopsis & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of credential scope, competition challenge, or verification criteria..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Verification / Credential URL (Optional)
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
            <span>[ NOTABILITY & PRIORITY ]</span>
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
                <span className="font-bold block uppercase text-ink">Notable Honor</span>
                <span className="text-[10px] text-faint">Highlight with badge in public dossier</span>
              </label>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Sort Sequence Index</label>
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
            {submitting ? 'COMMITTING TO POSTGRESQL...' : isEditing ? 'UPDATE DOSSIER' : 'REGISTER HONOR'}
          </button>
        </div>
      </form>
    </div>
  );
}
