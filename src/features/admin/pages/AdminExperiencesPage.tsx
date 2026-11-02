import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, RefreshCw, Plus } from 'lucide-react';
import { useLocale } from '@/context/I18nContext';
import useAdminExperiences from '../hooks/useAdminExperiences';
import ExperienceAdminCard from '../components/ExperienceAdminCard';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminExperiencesPage() {
  const locale = useLocale();
  const isId = locale === 'id';
  const {
    experiences,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchExperiences,
    handleDelete,
  } = useAdminExperiences();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode={isId ? '[ 03 // PENGALAMAN PROFESIONAL & KARIR ]' : '[ 03 // PROFESSIONAL EXPERIENCE & CAREER TRAJECTORY ]'}
        title={isId ? 'PENGALAMAN //' : 'EXPERIENCES //'}
        titleHighlight={isId ? 'LINIMASA' : 'TIMELINE'}
        description={
          isId
            ? 'Rekaman kronologis peran software engineering, kepemimpinan tim, dan pencapaian utama.'
            : 'Chronological record of software engineering roles, team leadership, and key achievements.'
        }
        actions={
          <>
            <Link
              to="/admin/experiences/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>{isId ? 'TAMBAH PENGALAMAN' : 'ADD EXPERIENCE'}</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchExperiences()}
              className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{isId ? 'SINKRON' : 'SYNC'}</span>
            </button>
          </>
        }
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Experiences List */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>{isId ? 'MENYINKRONKAN LINIMASA KARIR...' : 'SYNCHRONIZING CAREER TIMELINE...'}</div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Briefcase size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">{isId ? 'BELUM ADA PENGALAMAN KERJA.' : 'NO WORK EXPERIENCES RECORDED.'}</div>
          <Link
            to="/admin/experiences/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>{isId ? 'BUAT PENGALAMAN PERTAMA' : 'CREATE FIRST EXPERIENCE'}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <ExperienceAdminCard
              key={exp.id}
              item={exp}
              index={idx}
              isDeleting={deletingId === exp.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
