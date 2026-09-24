'use client';

import { Link } from '@/i18n/navigation';

interface ArunakiFooterProps {
  locale: string;
}

export default function ArunakiFooter({ locale }: ArunakiFooterProps) {
  const isId = locale === 'id';

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-8 text-sm font-sans text-zinc-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          {isId
            ? 'Arunaki • Workstation & Harness Agen Dokumen Sandboxed'
            : 'Arunaki • The Open Document Agent Workstation & Automation Harness'}
        </p>
        <div className="flex items-center gap-4 font-medium">
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors">
            {isId ? 'Portofolio' : 'Portfolio'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
