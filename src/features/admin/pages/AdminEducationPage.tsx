import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, RefreshCw, Plus } from 'lucide-react';
import useAdminEducation from '../hooks/useAdminEducation';
import EducationAdminCard from '../components/EducationAdminCard';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminEducationPage() {
  const {
    education,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchEducation,
    handleDelete,
  } = useAdminEducation();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 04 // ACADEMIC & INSTITUTIONAL QUALIFICATIONS ]"
        title="EDUCATION //"
        titleHighlight="DOSSIER"
        description="Degrees, formal computer science coursework, and academic milestones recorded in Neon PostgreSQL."
        actions={
          <>
            <Link
              to="/admin/education/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>ADD EDUCATION</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchEducation()}
              className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>SYNC</span>
            </button>
          </>
        }
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Education Grid */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING ACADEMIC DOSSIER...</div>
        </div>
      ) : education.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <GraduationCap size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO FORMAL EDUCATION RECORDS FOUND.</div>
          <Link
            to="/admin/education/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST RECORD</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu, idx) => (
            <EducationAdminCard
              key={edu.id}
              item={edu}
              index={idx}
              isDeleting={deletingId === edu.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
