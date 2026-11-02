import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Briefcase } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { aboutService } from '@/services/api';
import type { ExperienceItemRecord } from '../components/ExperienceAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminExperienceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      aboutService
        .getAboutData()
        .then((data) => {
          const list = Array.isArray(data?.experiences) ? (data.experiences as ExperienceItemRecord[]) : [];
          const found = list.find((item) => String(item.id) === String(id));
          if (found) {
            setCompany(found.company || found.company_name || '');
            setPosition(found.position || '');
            setLocation(found.location || 'Remote');
            setDescription(found.description || '');
            setCurrent(Boolean(found.current || found.is_current));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: 'Work experience record not found.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) {
      setFeedback({ type: 'error', message: 'Company Name and Position Title are required.' });
      return;
    }

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
      if (isEditing && id) {
        await aboutService.updateExperience(id, payload);
        setFeedback({ type: 'success', message: `Experience at "${company}" updated successfully! Redirecting...` });
      } else {
        await aboutService.createExperience(payload);
        setFeedback({ type: 'success', message: `Experience at "${company}" deployed to PostgreSQL! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/experiences');
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
        <div>RETRIEVING WORK EXPERIENCE RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/experiences"
        returnLabel="RETURN TO EXPERIENCES TIMELINE"
        systemCode={isEditing ? '[ 03 // EDIT CAREER DEPLOYMENT ]' : '[ 03 // NEW CAREER DEPLOYMENT ]'}
        title={isEditing ? 'EDIT EXPERIENCE //' : 'NEW EXPERIENCE //'}
        titleHighlight="TIMELINE"
        discardTo="/admin/experiences"
        submitLabel={isEditing ? 'UPDATE RECORD' : 'CONFIRM ROLE'}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Briefcase size={13} />
            <span>[ ROLE & EMPLOYMENT SPEC ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Systems Ltd."
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Position / Job Title *</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Lead Full Stack Architect"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Deployment Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote / Jakarta, ID"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
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

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Role Responsibilities & Engineering Milestones
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key deliverables, system architecture choices, microservices engineered..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="flex items-center gap-3 border border-line bg-bg p-4">
              <input
                type="checkbox"
                id="currentRoleToggle"
                checked={current}
                onChange={(e) => setCurrent(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
              <label htmlFor="currentRoleToggle" className="cursor-pointer select-none">
                <span className="font-bold block uppercase text-ink">Active Career Engagement</span>
                <span className="text-[10px] text-faint">Currently deployed in this capacity</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={submitting}
            className="border border-line bg-invert-bg text-invert-fg px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {submitting ? 'COMMITTING TO POSTGRESQL...' : isEditing ? 'UPDATE TIMELINE' : 'REGISTER ENGAGEMENT'}
          </button>
        </div>
      </form>
    </div>
  );
}
