import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, GraduationCap, MapPin } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';
import { aboutService } from '@/services/api';
import type { EducationItemRecord } from '../components/EducationAdminCard';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminEducationFormPage() {
  const locale = useLocale();
  const isId = locale === 'id';
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
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
            setFieldOfStudy(found.fieldOfStudy || found.field_of_study || '');
            setGrade(found.grade || '');
            setLocation(found.location || 'Indonesia');
            setDescription(found.description || '');
            setCurrent(Boolean(found.current || found.is_current));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: isId ? 'Data pendidikan tidak ditemukan.' : 'Education record not found.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, isId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      setFeedback({
        type: 'error',
        message: isId ? 'Institusi dan Nama Gelar wajib diisi.' : 'Institution and Degree Title are required.',
      });
      return;
    }

    setSubmitting(true);
    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      grade: grade.trim(),
      location: location.trim(),
      description: description.trim(),
      current,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await aboutService.updateEducation(id, payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Data pendidikan "${degree}" berhasil diperbarui! Mengalihkan...`
            : `Education record "${degree}" updated successfully! Redirecting...`,
        });
      } else {
        await aboutService.createEducation(payload);
        setFeedback({
          type: 'success',
          message: isId
            ? `Data pendidikan "${degree}" berhasil disimpan! Mengalihkan...`
            : `Education record "${degree}" created successfully! Redirecting...`,
        });
      }

      setTimeout(() => {
        navigate('/admin/education');
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
        <div>{isId ? 'MEMUAT DATA PENDIDIKAN...' : 'RETRIEVING EDUCATION RECORD...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/education"
        returnLabel={isId ? 'KEMBALI KE DOSIR PENDIDIKAN' : 'RETURN TO EDUCATION DOSSIER'}
        systemCode={
          isEditing
            ? (isId ? '[ 04 // EDIT KUALIFIKASI AKADEMIK ]' : '[ 04 // EDIT ACADEMIC QUALIFICATION ]')
            : (isId ? '[ 04 // KUALIFIKASI AKADEMIK BARU ]' : '[ 04 // NEW ACADEMIC QUALIFICATION ]')
        }
        title={
          isEditing
            ? (isId ? 'EDIT PENDIDIKAN //' : 'EDIT EDUCATION //')
            : (isId ? 'PENDIDIKAN BARU //' : 'NEW EDUCATION //')
        }
        titleHighlight={isId ? 'DOSIR' : 'DOSSIER'}
        discardTo="/admin/education"
        submitLabel={
          isEditing
            ? (isId ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES')
            : (isId ? 'SIMPAN GELAR' : 'CONFIRM DEGREE')
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
            <GraduationCap size={13} />
            <span>{isId ? '[ FONDASI AKADEMIK & INSTITUSI ]' : '[ ACADEMIC FOUNDATION & INSTITUTION ]'}</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'Institusi / Universitas *' : 'Institution / University *'}
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder={isId ? 'cth. Institut Teknologi Bandung' : 'e.g. Institut Teknologi Bandung'}
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Nama Gelar *' : 'Degree Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder={isId ? 'cth. Sarjana Komputer' : 'e.g. Bachelor of Computer Science'}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'Jurusan / Bidang Studi' : 'Field of Study'}
                </label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder={isId ? 'cth. Rekayasa Perangkat Lunak' : 'e.g. Software Engineering & Distributed Systems'}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'IPK Kumulatif / Predikat' : 'Cumulative GPA / Honors'}
                </label>
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
                  <span>{isId ? 'Lokasi Geografis' : 'Geographic Location'}</span>
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
                {isId ? 'Deskripsi Akademik / Fokus Skripsi' : 'Academic Description / Thesis Focus'}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isId
                    ? 'Fokus perkuliahan, proyek relevan, penghargaan akademik, atau topik skripsi...'
                    : 'Coursework focus, relevant projects, academic honors, or thesis topic...'
                }
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
                <label htmlFor="currentEduToggle" className="cursor-pointer select-none">
                  <span className="font-bold block uppercase text-ink">
                    {isId ? 'Studi Sedang Berjalan' : 'Currently Enrolled'}
                  </span>
                  <span className="text-[10px] text-faint">
                    {isId ? 'Tandai program ini masih ditempuh' : 'Program is actively ongoing'}
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
              : (isId ? 'SIMPAN PENDIDIKAN' : 'CONFIRM DEGREE')}
          </button>
        </div>
      </form>
    </div>
  );
}
