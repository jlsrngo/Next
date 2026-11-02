import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, RefreshCw, Plus } from 'lucide-react';
import useAdminSocialLinks from '../hooks/useAdminSocialLinks';
import SocialLinkAdminCard from '../components/SocialLinkAdminCard';
import AdminFeedbackBanner from '../components/AdminFeedbackBanner';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminSocialLinksPage() {
  const {
    links,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchLinks,
    handleDelete,
  } = useAdminSocialLinks();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 06 // EXTERNAL RELAYS & COMMUNICATION CHANNELS ]"
        title="SOCIAL LINKS //"
        titleHighlight="RELAY CHANNELS"
        description="Public profiles, communication relays, and social channels routed to PostgreSQL."
        actions={
          <>
            <Link
              to="/admin/social-links/new"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus size={14} />
              <span>ADD RELAY</span>
            </Link>
            <button
              type="button"
              onClick={() => fetchLinks()}
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

      {/* Relays Grid */}
      {loading ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-ink" />
          <div>SYNCHRONIZING RELAYS DIRECTORY...</div>
        </div>
      ) : links.length === 0 ? (
        <div className="border border-line bg-bg-raised p-12 text-center font-mono text-xs text-faint">
          <Link2 size={32} className="mx-auto mb-2 text-faint" />
          <div className="mb-4">NO SOCIAL RELAYS CONFIGURED.</div>
          <Link
            to="/admin/social-links/new"
            className="inline-flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold"
          >
            <Plus size={14} />
            <span>CREATE FIRST RELAY</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((link, idx) => (
            <SocialLinkAdminCard
              key={link.id}
              item={link}
              index={idx}
              isDeleting={deletingId === link.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
