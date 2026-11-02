import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useLocale } from '@/context/I18nContext';

export interface AdminFormHeaderHUDProps {
  returnTo: string;
  returnLabel: string;
  systemCode: string;
  title: string;
  titleHighlight?: string;
  discardTo: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function AdminFormHeaderHUDComponent({
  returnTo,
  returnLabel,
  systemCode,
  title,
  titleHighlight,
  discardTo,
  submitLabel,
  isSubmitting,
  onSubmit,
}: AdminFormHeaderHUDProps) {
  const locale = useLocale();
  const isId = locale === 'id';

  return (
    <div className="border-b border-line pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Link
          to={returnTo}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-faint hover:text-ink transition-colors mb-2"
        >
          <ArrowLeft size={13} />
          <span>{returnLabel}</span>
        </Link>
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
          {systemCode}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          {title}{' '}
          {titleHighlight && (
            <span className="font-mono text-faint font-normal">{titleHighlight}</span>
          )}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={discardTo}
          className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink transition-all"
        >
          {isId ? 'BATAL' : 'DISCARD'}
        </Link>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-5 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          <span>{submitLabel}</span>
        </button>
      </div>
    </div>
  );
}

export const AdminFormHeaderHUD = React.memo(AdminFormHeaderHUDComponent);
export default AdminFormHeaderHUD;
