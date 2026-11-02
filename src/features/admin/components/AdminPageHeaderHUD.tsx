import React from 'react';

export interface AdminPageHeaderHUDProps {
  systemCode: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  actions?: React.ReactNode;
}

function AdminPageHeaderHUDComponent({
  systemCode,
  title,
  titleHighlight,
  description,
  actions,
}: AdminPageHeaderHUDProps) {
  return (
    <header className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          {systemCode}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          {title}{' '}
          {titleHighlight && (
            <span className="font-mono text-faint font-normal">{titleHighlight}</span>
          )}
        </h1>
        {description && (
          <p className="text-xs text-faint mt-1 font-mono">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}

export const AdminPageHeaderHUD = React.memo(AdminPageHeaderHUDComponent);
export default AdminPageHeaderHUD;
