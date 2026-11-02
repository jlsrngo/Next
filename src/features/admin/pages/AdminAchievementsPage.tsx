import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RefreshCw, Search, Plus } from 'lucide-react';
import useAdminAchievements from '../hooks/useAdminAchievements';
import AchievementAdminCard from '../components/AchievementAdminCard';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminAchievementsPage() {
  const {
    achievements,
    filtered,
    loading,
    search,
    setSearch,
    feedback,
    setFeedback,
    deletingId,
    fetchAchievements,
    handleDelete,
  } = useAdminAchievements();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 05 // VERIFIED CREDENTIALS & AWARDS ]"
        title="ACHIEVEMENTS //"
        titleHighlight="HONORS REGISTRY"
        description="Verified certifications, competitions, and institutional honors recorded in PostgreSQL."
        actions={
          <>
            <Link
              to="/admin/achievements/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>ADD ACHIEVEMENT</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchAchievements()}
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

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 border border-line bg-bg-raised p-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search achievements by title, issuer, or synopsis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
          />
        </div>
        <div className="font-mono text-xs text-faint hidden sm:block">
          TOTAL: <span className="text-ink font-bold">{achievements.length}</span>
        </div>
      </div>

      {/* Achievements Grid */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING ACHIEVEMENTS CATALOG...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Trophy size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO ACHIEVEMENTS FOUND IN REGISTRY.</div>
          <Link
            to="/admin/achievements/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST ACHIEVEMENT</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <AchievementAdminCard
              key={item.id}
              item={item}
              index={idx}
              isDeleting={deletingId === item.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
