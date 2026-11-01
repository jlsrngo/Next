import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Search,
  RefreshCw,
  Plus,
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
            SKILLS // <span className="font-mono text-faint font-normal">TAXONOMY</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Interactive skill registry. Click any skill card to toggle database state, or register custom technologies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/skills/new"
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>+ ADD CUSTOM SKILL</span>
          </Link>
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
                  <TechIcon slug={tech.slug} icon={tech.icon} name={tech.name} color={tech.color} size={18} />
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
    </div>
  );
}
