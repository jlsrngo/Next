import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit3, Trash2, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';

export interface SocialLinkItemRecord {
  id: string | number;
  platform: string;
  url: string;
  username?: string;
  order?: number;
}

export interface SocialLinkAdminCardProps {
  item: SocialLinkItemRecord;
  index: number;
  isDeleting: boolean;
  onDelete: (id: string | number, platform: string) => void;
}

function SocialLinkAdminCardComponent({
  item,
  index,
  isDeleting,
  onDelete,
}: SocialLinkAdminCardProps) {
  const locale = useLocale();
  const isId = locale === 'id';
  const channelNumber = String(item.order ?? index + 1).padStart(2, '0');

  return (
    <article
      className="border border-line bg-bg-raised p-5 relative flex flex-col justify-between transition-all hover:border-line-strong"
      aria-label={`Relay channel: ${item.platform}`}
    >
      <CornerCrosses />
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
            {isId ? 'SALURAN //' : 'CH //'} #{channelNumber}
          </span>
          <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
            {isId ? 'AKTIF' : 'ONLINE'}
          </span>
        </div>

        <div className="font-display text-lg font-bold text-ink uppercase">
          {item.platform}
        </div>
        <div className="font-mono text-xs text-faint truncate mt-1">
          {item.username || item.url}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all"
          aria-label={`Test relay link for ${item.platform}`}
        >
          <span>{isId ? 'UJI' : 'TEST'}</span>
          <ExternalLink size={10} />
        </a>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/social-links/${item.id}/edit`}
            className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all uppercase font-bold"
            aria-label={`Edit ${item.platform}`}
          >
            <Edit3 size={11} />
            <span>{isId ? 'EDIT' : 'EDIT'}</span>
          </Link>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.platform)}
            disabled={isDeleting}
            className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all disabled:opacity-50"
            title={isId ? 'Hapus tautan' : 'Delete relay'}
            aria-label={`Delete ${item.platform}`}
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export const SocialLinkAdminCard = React.memo(SocialLinkAdminCardComponent);
export default SocialLinkAdminCard;
