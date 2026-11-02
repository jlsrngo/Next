import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';

export interface ExperienceItemRecord {
  id: string | number;
  position: string;
  company?: string;
  company_name?: string;
  location?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  current?: boolean;
  is_current?: boolean;
  description?: string;
  order?: number;
}

export interface ExperienceAdminCardProps {
  item: ExperienceItemRecord;
  index: number;
  isDeleting: boolean;
  onDelete: (id: string | number, company: string) => void;
}

function ExperienceAdminCardComponent({
  item,
  index,
  isDeleting,
  onDelete,
}: ExperienceAdminCardProps) {
  const locale = useLocale();
  const isId = locale === 'id';
  const roleNumber = String(item.order ?? index + 1).padStart(2, '0');
  const companyName = item.company || item.company_name || (isId ? 'Organisasi' : 'Organization');

  return (
    <article
      className="border border-line bg-bg-raised p-6 relative transition-all hover:border-line-strong"
      aria-label={`Role: ${item.position} at ${companyName}`}
    >
      <CornerCrosses />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3 mb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
            {isId ? 'PERAN //' : 'ROLE //'} #{roleNumber}
          </div>
          <h3 className="font-display text-lg font-bold text-ink mt-0.5">{item.position}</h3>
          <div className="font-mono text-xs text-faint font-bold text-ink/80">
            {companyName} • {item.location || (isId ? 'Jarak Jauh' : 'Remote')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/experiences/${item.id}/edit`}
            className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all font-mono text-xs uppercase font-bold"
            aria-label={`Edit ${item.position}`}
          >
            <Edit3 size={11} />
            <span>{isId ? 'EDIT' : 'EDIT'}</span>
          </Link>
          <button
            type="button"
            onClick={() => onDelete(item.id, companyName)}
            disabled={isDeleting}
            className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all disabled:opacity-50"
            title={isId ? 'Hapus pengalaman' : 'Delete experience'}
            aria-label={`Delete ${item.position}`}
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>

      {item.description && (
        <p className="font-sans text-xs text-ink/90 leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      )}
    </article>
  );
}

export const ExperienceAdminCard = React.memo(ExperienceAdminCardComponent);
export default ExperienceAdminCard;
