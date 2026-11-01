import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertTriangle, Briefcase, Calendar, MapPin } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';

export default function AdminExperienceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isEditing && id) {
      fetch('/api/about')
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data.experiences) ? data.experiences : [];
          const found = list.find((item: any) => String(item.id) === String(id));
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
        const res = await fetch(`/api/experiences/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
        setFeedback({ type: 'success', message: `Experience at "${company}" updated successfully! Redirecting...` });
      } else {
        const res = await fetch('/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        setFeedback({ type: 'success', message: `Experience at "${company}" created successfully! Redirecting...` });
      }

      setTimeout(() => {
        navigate('/admin/experiences');
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
        <div>RETRIEVING WORK EXPERIENCE RECORD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink max-w-3xl">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/experiences"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-faint hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            <span>RETURN TO EXPERIENCES TIMELINE</span>
          </Link>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
            {isEditing ? '[ 03 // EDIT CAREER DEPLOYMENT ]' : '[ 03 // NEW CAREER DEPLOYMENT ]'}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            {isEditing ? 'EDIT EXPERIENCE //' : 'NEW EXPERIENCE //'} <span className="font-mono text-faint font-normal">TIMELINE</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/experiences"
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
            <span>{isEditing ? 'SAVE CHANGES' : 'CONFIRM ROLE'}</span>
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
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Briefcase size={13} />
            <span>[ ROLE & ORGANIZATIONAL METRICS ]</span>
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
                  placeholder="e.g. Acme Corp"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Position Title *</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Lead Systems Architect"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <MapPin size={12} />
                <span>Location / Workplace Model</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jakarta, Indonesia (Hybrid) / Remote"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Key Responsibilities, Architectural Impact & Technology Used
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Architected distributed event-driven microservices processing 10k req/sec..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 border border-line bg-bg p-4">
                <input
                  type="checkbox"
                  id="currentRoleToggle"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <div>
                  <label htmlFor="currentRoleToggle" className="text-ink font-bold uppercase cursor-pointer block text-xs">
                    Current Active Role
                  </label>
                  <span className="text-[10px] text-faint block">
                    Displays 'Present' as the end period.
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

        {/* Bottom Actions Bar */}
        <div className="border border-line bg-bg-raised p-4 flex items-center justify-between">
          <Link
            to="/admin/experiences"
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
            <span>{isEditing ? 'SAVE EXPERIENCE' : 'CONFIRM ROLE'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
