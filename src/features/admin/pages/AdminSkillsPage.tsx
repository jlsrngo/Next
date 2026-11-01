import React, { useState, useEffect, useMemo } from 'react';
import {
  Code,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { skillsService } from '@/services/api';
import { techList } from '@/lib/techList';
import { CATEGORIES, getCategoryForSlug, filterByCategory } from '@/lib/techCategories';
import { TechIcon } from '@/components/TechIcon';

export default function AdminSkillsPage() {
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillIcon, setNewSkillIcon] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillsService.getSkills();
      setDbSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const activeSlugs = useMemo(() => {
    return new Set(
      dbSkills.map((s) => s.iconName || s.icon || s.name?.toLowerCase()).filter(Boolean)
    );
  }, [dbSkills]);

  const toggleSkill = async (tech: (typeof techList)[0]) => {
    const isActive = activeSlugs.has(tech.slug);
    setTogglingSlug(tech.slug);

    try {
      if (isActive) {
        const res = await fetch(`/api/skills?iconName=${encodeURIComponent(tech.slug)}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to deactivate skill');
        setFeedback({ type: 'success', message: `${tech.name} deactivated from registry.` });
      } else {
        const category = getCategoryForSlug(tech.slug);
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: tech.name,
            category,
            iconName: tech.slug,
            proficiency: 85,
            featured: false,
          }),
        });
        if (!res.ok) throw new Error('Failed to activate skill');
        setFeedback({ type: 'success', message: `${tech.name} activated in PostgreSQL.` });
      }
      await fetchSkills();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Toggle failed.' });
    } finally {
      setTogglingSlug(null);
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillName.trim(),
          category: newSkillCategory,
          iconName: newSkillIcon.trim() || newSkillName.toLowerCase().trim(),
          proficiency: 85,
        }),
      });
      if (!res.ok) throw new Error('Creation failed');
      setFeedback({ type: 'success', message: `Custom skill "${newSkillName}" registered.` });
      setIsModalOpen(false);
      setNewSkillName('');
      setNewSkillIcon('');
      await fetchSkills();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Creation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTech = useMemo(() => {
    return techList.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'ACTIVE') return activeSlugs.has(t.slug);
      return filterByCategory(t.slug, selectedCategory);
    });
  }, [search, selectedCategory, activeSlugs]);

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 01 // TECHNICAL CAPABILITY & ENGINE MATRIX ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            SKILLS // <span className="font-mono text-faint font-normal">CRUD MATRIX</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Interactive skill registry. Click any skill card to toggle database state, or register custom technologies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD CUSTOM SKILL</span>
          </button>
          <button
            onClick={fetchSkills}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
          <div className="border border-line bg-bg-raised px-3 py-2 font-mono text-xs">
            <span className="text-faint text-[10px] uppercase mr-2">ACTIVE</span>
            <span className="font-bold">{activeSlugs.size}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`border px-4 py-3 font-mono text-xs flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'border-line bg-bg-raised text-ink'
              : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-faint hover:text-ink">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter and Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-line bg-bg-raised p-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder="Search technologies by name or identifier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 border border-line bg-bg-raised p-2 font-mono text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 uppercase transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-invert-bg text-invert-fg font-bold'
                : 'text-faint hover:text-ink'
            }`}
          >
            ALL ({techList.length})
          </button>
          <button
            onClick={() => setSelectedCategory('ACTIVE')}
            className={`px-3 py-1 uppercase transition-all ${
              selectedCategory === 'ACTIVE'
                ? 'bg-invert-bg text-invert-fg font-bold'
                : 'text-faint hover:text-ink'
            }`}
          >
            ACTIVE IN DB ({activeSlugs.size})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredTech.map((tech) => {
          const isActive = activeSlugs.has(tech.slug);
          const category = getCategoryForSlug(tech.slug);
          const isToggling = togglingSlug === tech.slug;

          return (
            <button
              key={tech.slug}
              onClick={() => toggleSkill(tech)}
              disabled={isToggling}
              className={`relative border p-3 flex flex-col justify-between text-left transition-all group ${
                isActive
                  ? 'border-line bg-bg-raised shadow-xs ring-1 ring-line'
                  : 'border-line/40 bg-bg opacity-60 hover:opacity-100 hover:border-line'
              }`}
            >
              <CornerCrosses />
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="w-8 h-8 flex items-center justify-center border border-line bg-bg">
                  <TechIcon slug={tech.slug} size={18} />
                </div>
                {isToggling ? (
                  <Loader2 size={12} className="animate-spin text-ink" />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-500 animate-pulse' : 'bg-line'
                    }`}
                    title={isActive ? 'Active in DB' : 'Inactive'}
                  />
                )}
              </div>

              <div className="w-full">
                <div className="font-mono font-bold text-xs text-ink truncate">{tech.name}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-faint truncate">
                  {category}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-line/40 flex items-center justify-between font-mono text-[9px] w-full">
                <span className="text-faint uppercase">TOGGLE</span>
                <span className={isActive ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-faint'}>
                  {isActive ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  [ CUSTOM REGISTRATION ]
                </div>
                <h3 className="font-display text-xl font-bold uppercase">ADD NEW SKILL</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-line hover:bg-bg-sunken text-ink transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-faint uppercase font-bold mb-1">Technology Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apache Kafka"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Category *</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Icon Identifier (Slug)</label>
                <input
                  type="text"
                  placeholder="e.g. apachekafka (SimpleIcons slug)"
                  value={newSkillIcon}
                  onChange={(e) => setNewSkillIcon(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="border-t border-line pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-5 py-2 font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>ADD TO REGISTRY</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
