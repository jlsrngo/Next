import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Search, RefreshCw, Plus, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { CATEGORIES } from '@/lib/techCategories';
import { TechIcon } from '@/components/TechIcon';
import useAdminSkills from '../hooks/useAdminSkills';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminSkillsPage() {
  const {
    loading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    togglingSlug,
    feedback,
    setFeedback,
    activeSlugs,
    filteredTech,
    fetchSkills,
    toggleSkill,
  } = useAdminSkills();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 01 // TECHNICAL CAPABILITY & ENGINE MATRIX ]"
        title="SKILLS //"
        titleHighlight="TAXONOMY"
        description="Interactive skill registry. Click any skill card to toggle database state, or register custom technologies."
        actions={
          <>
            <Link
              to="/admin/skills/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>ADD CUSTOM SKILL</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchSkills()}
              className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>SYNC</span>
            </button>
            <div className="border border-line bg-bg-raised px-3 py-2 font-mono text-xs">
              <span className="text-faint text-[10px] uppercase mr-2">ACTIVE</span>
              <span className="font-bold">{activeSlugs.size}</span>
            </div>
          </>
        }
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Filter and Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-line bg-bg-raised p-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder="Search technology by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 font-mono text-xs uppercase transition-all border ${
                selectedCategory === 'ALL'
                  ? 'border-line bg-invert-bg text-invert-fg font-bold'
                  : 'border-line bg-bg text-faint hover:text-ink'
              }`}
            >
              ALL ({filteredTech.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('ACTIVE')}
              className={`px-3 py-1.5 font-mono text-xs uppercase transition-all border ${
                selectedCategory === 'ACTIVE'
                  ? 'border-line bg-invert-bg text-invert-fg font-bold'
                  : 'border-line bg-bg text-faint hover:text-ink'
              }`}
            >
              ACTIVE ({activeSlugs.size})
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase transition-all border ${
                selectedCategory === cat
                  ? 'border-line bg-invert-bg text-invert-fg font-bold'
                  : 'border-line bg-bg-raised text-faint hover:text-ink hover:border-line-strong'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING CAPABILITIES MATRIX...</div>
        </div>
      ) : filteredTech.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Code size={32} className="mx-auto mb-2 text-faint" />
          <div>NO TECHNOLOGIES MATCHING ACTIVE QUERY.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredTech.map((tech) => {
            const isActive = activeSlugs.has(tech.slug);
            const isToggling = togglingSlug === tech.slug;

            return (
              <button
                key={tech.slug}
                type="button"
                onClick={() => toggleSkill(tech)}
                disabled={isToggling}
                className={`p-3 border relative text-left transition-all flex flex-col justify-between min-h-[90px] group ${
                  isActive
                    ? 'border-line bg-bg-raised shadow-xs'
                    : 'border-line/40 bg-bg opacity-50 hover:opacity-100 hover:border-line'
                }`}
              >
                <CornerCrosses />
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <TechIcon slug={tech.slug} size={18} className="text-ink" />
                  </div>
                  {isToggling ? (
                    <Loader2 size={12} className="animate-spin text-ink" />
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-emerald-500' : 'bg-transparent border border-line'
                      }`}
                    />
                  )}
                </div>

                <div className="mt-2">
                  <div className="font-mono text-xs font-bold text-ink truncate">{tech.name}</div>
                  <div className="font-mono text-[9px] text-faint uppercase tracking-wider">
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
