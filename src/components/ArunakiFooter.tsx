'use client';

import { Link } from '@/i18n/navigation';

interface ArunakiFooterProps {
  locale: string;
}

export default function ArunakiFooter({ locale }: ArunakiFooterProps) {
  const isId = locale === 'id';

  return (
    <footer className="shrink-0 border-t border-line h-12 flex items-center bg-bg-raised">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-4 border-x border-line h-full">
        <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-faint truncate">
          {isId ? 'ARUNAKI • WORKSTATION AGEN DOKUMEN SANDBOXED' : 'ARUNAKI • OPEN DOCUMENT AGENT WORKSTATION'}
        </p>
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider font-bold text-muted shrink-0">
          <a href="https://github.com/jlsrngo/Arunaki" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">GITHUB</a>
          <span className="text-line">•</span>
          <Link href="/projects" className="hover:text-ink transition-colors">{isId ? 'PORTOFOLIO' : 'PORTFOLIO'}</Link>
        </div>
      </div>
    </footer>
  );
}
