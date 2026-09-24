'use client';

import { Link } from '@/i18n/navigation';

interface ArunakiFooterProps {
  locale: string;
}

export default function ArunakiFooter({ locale }: ArunakiFooterProps) {
  const isId = locale === 'id';

  return (
    <footer className="shrink-0 border-t border-zinc-200 dark:border-zinc-800/80 h-12 flex items-center bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-4">
        <p className="text-sm sm:text-base font-mono text-zinc-500 truncate">
          {isId ? 'Arunaki • Workstation Agen Dokumen Sandboxed' : 'Arunaki • Open Document Agent Workstation'}
        </p>
        <div className="flex items-center gap-4 text-sm sm:text-base font-mono font-medium text-zinc-500 shrink-0">
          <a href="https://github.com/jlsrngo/Arunaki" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
          <span>•</span>
          <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors">{isId ? 'Portofolio' : 'Portfolio'}</Link>
        </div>
      </div>
    </footer>
  );
}
