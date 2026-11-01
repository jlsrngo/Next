import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertTriangle, FolderOpen, ExternalLink, Github, Star } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { projectsService } from '@/services/api';

export default function AdminProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackStr, setTechStackStr] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      projectsService
        .getProjects()
        .then((projects: any[]) => {
          const found = projects.find((p) => String(p.id) === String(id));
          if (found) {
            setTitle(found.title || '');
            setDescription(found.description || '');
            const stack = found.techStack || found.tech_stack || [];
            setTechStackStr(Array.isArray(stack) ? stack.join(', ') : String(stack));
            setLiveUrl(found.liveUrl || found.live_url || '');
            setGithubUrl(found.githubUrl || found.github_url || '');
            setFeatured(Boolean(found.featured));
            setOrder(found.order ?? 0);
          } else {
            setFeedback({ type: 'error', message: 'Project not found in registry.' });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Project Title is required.' });
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
      techStack,
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      featured,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && id) {
        const res = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Project "${title}" updated successfully! Redirecting...` });
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Project "${title}" created successfully! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/projects');
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-line bg-bg-raised p-16 text-center font-mono text-xs text-faint">
        <Loader2 size={24} className="animate-spin mx-auto mb-3 text-ink" />
        <div>RETRIEVING PROJECT RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink max-w-4xl">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-faint hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            <span>RETURN TO PROJECTS REGISTRY</span>
          </Link>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
            {isEditing ? '[ 02 // EDIT REPOSITORY RECORD ]' : '[ 02 // NEW REPOSITORY RECORD ]'}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            {isEditing ? 'EDIT PROJECT //' : 'NEW PROJECT //'} <span className="font-mono text-faint font-normal">WORKBENCH</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink transition-all"
          >
            DISCARD
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-5 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{isEditing ? 'SAVE CHANGES' : 'CREATE PROJECT'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`border px-4 py-3 font-mono text-xs flex items-center gap-2 transition-all ${
            feedback.type === 'success'
              ? 'border-line bg-bg-raised text-ink'
              : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle size={15} className="text-red-500 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <FolderOpen size={13} />
            <span>[ SPECIFICATION & ARCHITECTURE ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Arunaki Desktop Agent"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Technical Synopsis & Problem Statement *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of system architecture, performance characteristics, and purpose..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Technology Stack (Comma-separated tokens)
              </label>
              <input
                type="text"
                value={techStackStr}
                onChange={(e) => setTechStackStr(e.target.value)}
                placeholder="Rust, Axum, React, TypeScript, Docker, PostgreSQL"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
              <span className="text-[10px] text-faint mt-1 block">
                Tags will be indexed and rendered as Swiss Brutalist badge tokens.
              </span>
            </div>
          </div>
        </div>

        {/* Links & Priority Card */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2">
            [ ENDPOINTS & EXHIBITION SETTINGS ]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Github size={12} />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/jlsrngo/repo"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <ExternalLink size={12} />
                <span>Live Deployment URL</span>
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://app.jlsrngo.com"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="flex items-center gap-3 border border-line bg-bg p-4">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
              <div>
                <label htmlFor="featuredToggle" className="text-ink font-bold uppercase cursor-pointer block text-xs">
                  ★ Featured Portfolio Showcase
                </label>
                <span className="text-[10px] text-faint block">
                  Promoted to the priority hero grid on the public projects archive.
                </span>
              </div>
            </div>

            <div className="border border-line bg-bg p-4 flex items-center justify-between">
              <div>
                <label className="text-ink font-bold uppercase block text-xs">Sort Order Sequence</label>
                <span className="text-[10px] text-faint block">Lower numbers appear first.</span>
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

        {/* Bottom Actions Bar */}
        <div className="border border-line bg-bg-raised p-4 flex items-center justify-between">
          <Link
            to="/admin/projects"
            className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink transition-all"
          >
            DISCARD CHANGES
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isEditing ? 'UPDATE PROJECT SPEC' : 'CONFIRM & REGISTER PROJECT'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

