import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, FolderOpen, Star } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import ImageUploadAdjuster from '@/components/ui/ImageUploadAdjuster';
import { useLocale } from '@/context/I18nContext';
import { projectsService } from '@/services/api';
import type { Project } from '@/types/project.types';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminProjectFormPage() {
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
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [techStackStr, setTechStackStr] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      projectsService
        .getProjects()
        .then((projects: Project[]) => {
          const found = projects.find((p) => String(p.id) === String(id));
          if (found) {
            setTitle(found.title || '');
            setDescription(found.description || '');
            setImageUrl(found.imageUrl || found.image_url || '');
            const stack = found.techStack || found.tech_stack || [];
            setTechStackStr(Array.isArray(stack) ? stack.join(', ') : String(stack));
            setLiveUrl(found.liveUrl || found.live_url || '');
            setGithubUrl(found.githubUrl || found.github_url || '');
            setFeatured(Boolean(found.featured));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: isId ? 'Proyek tidak ditemukan di registri.' : 'Project not found in registry.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, isId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ type: 'error', message: isId ? 'Judul Proyek wajib diisi.' : 'Project Title is required.' });
      return;
    }

    setSubmitting(true);
    const techStack = techStackStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || null,
      image_url: imageUrl.trim() || null,
      techStack,
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      featured,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        await projectsService.updateProject(id, payload);
      } else {
        await projectsService.createProject(payload);
      }
      setFeedback({
        type: 'success',
        message: isId
          ? `Proyek "${title}" berhasil disimpan ke registri! Mengalihkan...`
          : `Project "${title}" saved to PostgreSQL registry! Redirecting...`,
      });

      setTimeout(() => {
        navigate('/admin/projects');
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
        <div>{isId ? 'MEMUAT DATA PROYEK...' : 'RETRIEVING PROJECT RECORD...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/projects"
        returnLabel={isId ? 'KEMBALI KE REGISTRI PROYEK' : 'RETURN TO PROJECTS REGISTRY'}
        systemCode={
          isEditing
            ? (isId ? '[ 02 // EDIT DATA REPOSITORI ]' : '[ 02 // EDIT REPOSITORY RECORD ]')
            : (isId ? '[ 02 // DATA REPOSITORI BARU ]' : '[ 02 // NEW REPOSITORY RECORD ]')
        }
        title={
          isEditing
            ? (isId ? 'EDIT PROYEK //' : 'EDIT PROJECT //')
            : (isId ? 'PROYEK BARU //' : 'NEW PROJECT //')
        }
        titleHighlight={isId ? 'MEJA KERJA' : 'WORKBENCH'}
        discardTo="/admin/projects"
        submitLabel={
          isEditing
            ? (isId ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES')
            : (isId ? 'BUAT PROYEK' : 'CREATE PROJECT')
        }
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 0: Project Thumbnail Media Adjuster */}
        <ImageUploadAdjuster
          value={imageUrl}
          onChange={(newVal) => setImageUrl(newVal)}
          aspectRatio="video"
          label={isId ? 'THUMBNAIL PROYEK // MEDIA PREVIEW' : 'PROJECT THUMBNAIL // MEDIA PREVIEW'}
        />

        {/* Main Details Card */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <FolderOpen size={13} />
            <span>{isId ? '[ SPESIFIKASI & ARSITEKTUR ]' : '[ SPECIFICATION & ARCHITECTURE ]'}</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'Judul Proyek *' : 'Project Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isId ? 'cth. Arunaki Desktop Agent' : 'e.g. Arunaki Desktop Agent'}
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'Sinopsis Teknis & Deskripsi *' : 'Technical Synopsis & Problem Statement *'}
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isId
                    ? 'Ringkasan detail arsitektur sistem, karakteristik kinerja, dan tujuan...'
                    : 'Detailed summary of system architecture, performance characteristics, and purpose...'
                }
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                {isId ? 'Teknologi Stack (Token dipisahkan koma)' : 'Technology Stack (Comma-separated tokens)'}
              </label>
              <input
                type="text"
                value={techStackStr}
                onChange={(e) => setTechStackStr(e.target.value)}
                placeholder="Rust, Axum, React, TypeScript, Docker, PostgreSQL"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
              <span className="text-[10px] text-faint mt-1 block">
                {isId ? 'Tag akan diindeks sebagai lencana token Swiss Brutalist.' : 'Tags will be indexed and rendered as Swiss Brutalist badge tokens.'}
              </span>
            </div>
          </div>
        </div>

        {/* Links & Priority Card */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Star size={13} />
            <span>{isId ? '[ RELAY TELEMETRI & PRIORITAS ]' : '[ TELEMETRY RELAYS & PRIORITY ]'}</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'URL Penerapan Live' : 'Live Production URL'}
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  {isId ? 'URL Repositori GitHub' : 'GitHub Repository URL'}
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 border border-line bg-bg p-4">
                <input
                  type="checkbox"
                  id="featuredProjectToggle"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <label htmlFor="featuredProjectToggle" className="cursor-pointer select-none">
                  <span className="font-bold block uppercase text-ink">
                    {isId ? 'Tampilkan di Showcase Utama' : 'Feature on Showcase HUD'}
                  </span>
                  <span className="text-[10px] text-faint">
                    {isId ? 'Tampilkan dalam grid prioritas dengan lencana unggulan' : 'Render in priority featured grid with badges'}
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
              ? (isId ? 'MENYIMPAN KE POSTGRESQL...' : 'COMMITTING TO POSTGRESQL...')
              : isEditing
              ? (isId ? 'PERBARUI SPESIFIKASI' : 'UPDATE SPECIFICATION')
              : (isId ? 'TERAPKAN KE REGISTRI' : 'DEPLOY TO REGISTRY')}
          </button>
        </div>
      </form>
    </div>
  );
}
