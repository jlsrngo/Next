import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { CATEGORIES } from '@/lib/techCategories';
import { skillsService } from '@/services/api';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminSkillFormPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

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
      await skillsService.createSkill(payload);
      setFeedback({ type: 'success', message: `Technology "${name}" registered successfully! Redirecting...` });

      setTimeout(() => {
        navigate('/admin/skills');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setFeedback({ type: 'error', message });
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/skills"
        returnLabel="RETURN TO SKILLS MATRIX"
        systemCode="[ 01 // CUSTOM TECHNOLOGY REGISTRATION ]"
        title="NEW SKILL //"
        titleHighlight="SPECIFICATION"
        discardTo="/admin/skills"
        submitLabel="ADD TO REGISTRY"
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

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
                <label htmlFor="featuredSkillToggle" className="cursor-pointer select-none">
                  <span className="font-bold block uppercase text-ink">Priority Highlight</span>
                  <span className="text-[10px] text-faint">Feature in prominent telemetry viewports</span>
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
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={submitting}
            className="border border-line bg-invert-bg text-invert-fg px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {submitting ? 'COMMITTING TO NEON...' : 'CONFIRM SPECIFICATION'}
          </button>
        </div>
      </form>
    </div>
  );
}
