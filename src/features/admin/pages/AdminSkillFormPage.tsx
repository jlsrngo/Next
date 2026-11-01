import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertTriangle, Code } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { CATEGORIES } from '@/lib/techCategories';

export default function AdminSkillFormPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Frontend');
  const [iconName, setIconName] = useState('');
  const [proficiency, setProficiency] = useState<number>(85);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Technology Name is required.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      category,
      iconName: iconName.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]/g, ''),
      proficiency: Number(proficiency) || 85,
      featured,
      order: Number(order) || 0,
    };

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Registration failed');
      setFeedback({ type: 'success', message: `Technology "${name}" registered successfully! Redirecting...` });

      setTimeout(() => {
        navigate('/admin/skills');
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-ink max-w-3xl">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/skills"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-faint hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            <span>RETURN TO SKILLS MATRIX</span>
          </Link>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
            [ 01 // CUSTOM TECHNOLOGY REGISTRATION ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            NEW SKILL // <span className="font-mono text-faint font-normal">SPECIFICATION</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/skills"
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
            <span>ADD TO REGISTRY</span>
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
            <Code size={13} />
            <span>[ TAXONOMY & CLASSIFICATION ]</span>
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Technology Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apache Kafka"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Domain Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">
                  SimpleIcons Slug Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="e.g. apachekafka (matches SimpleIcons)"
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1.5">Proficiency Score (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 border border-line bg-bg p-4">
                <input
                  type="checkbox"
                  id="featuredSkillToggle"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <div>
                  <label htmlFor="featuredSkillToggle" className="text-ink font-bold uppercase cursor-pointer block text-xs">
                    ★ Priority Core Skill
                  </label>
                  <span className="text-[10px] text-faint block">
                    Showcase prominently in competency matrices.
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
            to="/admin/skills"
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
            <span>REGISTER SKILL</span>
          </button>
        </div>
      </form>
    </div>
  );
}
