import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, GraduationCap, MapPin } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { aboutService } from '@/services/api';
import type { EducationItemRecord } from '../components/EducationAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminEducationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [grade, setGrade] = useState('');
  const [location, setLocation] = useState('Indonesia');
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      aboutService
        .getAboutData()
        .then((data) => {
          const list = Array.isArray(data?.educations) ? (data.educations as EducationItemRecord[]) : [];
          const found = list.find((item) => String(item.id) === String(id));
          if (found) {
            setInstitution(found.institution || '');
            setDegree(found.degree || '');
            setFieldOfStudy(found.fieldOfStudy || found.field_of_study || 'Computer Science');
            setGrade(found.grade || '');
            setLocation(found.location || 'Indonesia');
            setDescription(found.description || '');
            setCurrent(Boolean(found.current || found.is_current));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: 'Education record not found.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      setFeedback({ type: 'error', message: 'Institution Name and Degree Title are required.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      grade: grade.trim() || null,
      location: location.trim(),
      description: description.trim(),
      current,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await aboutService.updateEducation(id, payload);
        setFeedback({ type: 'success', message: `Education at "${institution}" updated successfully! Redirecting...` });
      } else {
        await aboutService.createEducation(payload);
        setFeedback({ type: 'success', message: `Education at "${institution}" recorded successfully! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/education');
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
        <div>RETRIEVING EDUCATION RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/education"
        returnLabel="RETURN TO EDUCATION DOSSIER"
        systemCode={isEditing ? '[ 04 // EDIT ACADEMIC QUALIFICATION ]' : '[ 04 // NEW ACADEMIC QUALIFICATION ]'}
        title={isEditing ? 'EDIT EDUCATION //' : 'NEW EDUCATION //'}
        titleHighlight="DOSSIER"
        discardTo="/admin/education"
        submitLabel={isEditing ? 'SAVE CHANGES' : 'CONFIRM DEGREE'}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <GraduationCap size={13} />
            <span>[ ACADEMIC FOUNDATION & INSTITUTION ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Institution / University *</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Institut Teknologi Bandung"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Degree Title *</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Field of Study</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Software Engineering & Distributed Systems"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Cumulative GPA / Honors</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 3.85 / 4.00"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span>Geographic Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bandung, Indonesia"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Academic Description / Thesis Focus
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Coursework focus, relevant projects, academic honors, or thesis topic..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 border border-line bg-bg p-4">
                <input
                  type="checkbox"
                  id="currentEduToggle"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <div>
                  <label htmlFor="currentEduToggle" className="text-ink font-bold uppercase cursor-pointer block text-xs">
                    Currently Studying
                  </label>
                  <span className="text-[10px] text-faint block">
                    Displays 'Present' as the end graduation date.
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
            {submitting ? 'COMMITTING TO NEON...' : isEditing ? 'UPDATE DOSSIER' : 'REGISTER RECORD'}
          </button>
        </div>
      </form>
    </div>
  );
}
