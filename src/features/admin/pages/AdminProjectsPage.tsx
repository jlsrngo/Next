import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, RefreshCw, Search } from 'lucide-react';
import useAdminProjects from '../hooks/useAdminProjects';
import ProjectAdminCard from '../components/ProjectAdminCard';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminProjectsPage() {
  const {
    filtered,
    loading,
    search,
    setSearch,
    filterFeatured,
    setFilterFeatured,
    counts,
    feedback,
    setFeedback,
    deletingId,
    fetchProjects,
    handleDelete,
    getTechArray,
  } = useAdminProjects();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 02 // REPOSITORY ARCHIVE & WORK MATRIX ]"
        title="PROJECTS //"
        titleHighlight="REGISTRY"
        description="Direct inventory management for showcased repositories, engineering deployments, and case studies."
        actions={
          <>
            <Link
              to="/admin/projects/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>ADD PROJECT</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchProjects()}
              className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
              title="Refresh database records"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>SYNC</span>
            </button>
          </>
        }
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-line bg-bg-raised p-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search by title, description, or technology tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg border border-line pl-9 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:border-line-strong transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-line bg-bg font-mono text-xs">
            <button
              type="button"
              onClick={() => setFilterFeatured('all')}
              className={`px-3 py-1.5 uppercase transition-all ${
                filterFeatured === 'all'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              ALL ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured('featured')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'featured'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              FEATURED ({counts.featured})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured('normal')}
              className={`px-3 py-1.5 uppercase transition-all border-l border-line ${
                filterFeatured === 'normal'
                  ? 'bg-invert-bg text-invert-fg font-bold'
                  : 'text-faint hover:text-ink'
              }`}
            >
              NORMAL ({counts.normal})
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING PROJECT REGISTRY FROM POSTGRESQL DAEMON...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <FolderOpen size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO PROJECTS FOUND IN REGISTRY.</div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST PROJECT</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((proj, idx) => (
            <ProjectAdminCard
              key={proj.id}
              project={proj}
              index={idx}
              techList={getTechArray(proj)}
              isDeleting={deletingId === proj.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
