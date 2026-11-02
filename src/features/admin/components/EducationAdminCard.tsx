import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';

export interface EducationItemRecord {
  id: string | number;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  field_of_study?: string;
  grade?: string;
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

export interface EducationAdminCardProps {
  item: EducationItemRecord;
  index: number;
  isDeleting: boolean;
  onDelete: (id: string | number, institution: string) => void;
}

function EducationAdminCardComponent({
  item,
  index,
  isDeleting,
  onDelete,
}: EducationAdminCardProps) {
  const degreeNumber = String(item.order ?? index + 1).padStart(2, '0');
  const field = item.fieldOfStudy || item.field_of_study;

  return (
    <article
      className="border border-line bg-bg-raised p-6 relative flex flex-col justify-between transition-all hover:border-line-strong"
      aria-label={`Education: ${item.degree} at ${item.institution}`}
    >
      <CornerCrosses />
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
            DEGREE // #{degreeNumber}
          </span>
          {item.grade && (
            <span className="border border-line bg-bg px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-ink">
              GPA {item.grade}
            </span>
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-ink">{item.degree}</h3>
        {field && <div className="font-mono text-xs font-bold text-ink/80 mt-1">{field}</div>}
        <div className="font-mono text-xs text-faint mt-0.5">
          {item.institution} • {item.location || 'Indonesia'}
        </div>

        {item.description && (
          <p className="font-sans text-xs text-faint mt-3 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between font-mono text-[10px]">
        <span className="text-faint">{item.current ? 'CURRENT' : 'COMPLETED'}</span>
        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/education/${item.id}/edit`}
            className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-ink transition-all uppercase font-bold"
            aria-label={`Edit ${item.degree}`}
          >
            <Edit3 size={11} />
            <span>EDIT</span>
          </Link>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.institution)}
            disabled={isDeleting}
            className="p-1 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all disabled:opacity-50"
            title="Delete education record"
            aria-label={`Delete ${item.degree}`}
          >
            {isDeleting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export const EducationAdminCard = React.memo(EducationAdminCardComponent);
export default EducationAdminCard;
