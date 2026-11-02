import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit3, Trash2, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';

export interface AchievementItemRecord {
  id: string | number;
  title: string;
  issuer: string;
  issueDate?: string;
  issue_date?: string;
  description?: string;
  credentialUrl?: string;
  credential_url?: string;
  credentialId?: string;
  credential_id?: string;
  category?: string;
  featured?: boolean;
  order?: number;
}

export interface AchievementAdminCardProps {
  item: AchievementItemRecord;
  index: number;
  isDeleting: boolean;
  onDelete: (id: string | number, title: string) => void;
}

function AchievementAdminCardComponent({
  item,
  index,
  isDeleting,
  onDelete,
}: AchievementAdminCardProps) {
  const locale = useLocale();
  const isId = locale === 'id';
  const regNumber = String(item.order ?? index + 1).padStart(2, '0');
  const year = item.issueDate ? new Date(item.issueDate).getFullYear() : null;

  return (
    <article
      className="border border-line bg-bg-raised p-5 relative flex flex-col justify-between transition-all hover:border-line-strong"
      aria-label={`Achievement: ${item.title}`}
    >
      <CornerCrosses />
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
            {isId ? 'REG //' : 'REG //'} #{regNumber}
          </span>
          {item.featured && (
            <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
              ★ {isId ? 'UNGGULAN' : 'NOTABLE'}
            </span>
          )}
        </div>

        <h3 className="font-display text-base font-bold text-ink">{item.title}</h3>
        <div className="font-mono text-xs text-faint mt-1 flex items-center gap-2">
          <span className="font-bold text-ink">{item.issuer}</span>
          {year && <span>• {year}</span>}
        </div>

        {item.description && (
          <p className="font-sans text-xs text-faint mt-3 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center gap-2">
          {item.credentialUrl && (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-1 text-ink transition-all"
              aria-label={`Verify credential for ${item.title}`}
            >
              <span>{isId ? 'VERIFIKASI' : 'VERIFY'}</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/achievements/${item.id}/edit`}
            className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all uppercase font-bold"
            aria-label={`Edit ${item.title}`}
          >
            <Edit3 size={11} />
            <span>{isId ? 'EDIT' : 'EDIT'}</span>
          </Link>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.title)}
            disabled={isDeleting}
            className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all disabled:opacity-50"
            title={isId ? 'Hapus pencapaian' : 'Delete achievement'}
            aria-label={`Delete ${item.title}`}
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

export const AchievementAdminCard = React.memo(AchievementAdminCardComponent);
export default AchievementAdminCard;
