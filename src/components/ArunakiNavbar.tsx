'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ArunakiNavbarProps {
  locale: string;
}

export default function ArunakiNavbar({ locale }: ArunakiNavbarProps) {
  const isId = locale === 'id';
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageSwitch = (lang: 'en' | 'id') => {
    if (lang === locale) return;
    localStorage.setItem('portfolio_locale', lang);
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`;
    router.replace(pathname, { locale: lang });
  };

  const isDocsActive = pathname.startsWith('/arunaki/docs') || pathname.startsWith('/arunaki/features');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: back + brand */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/projects"
            className="text-base sm:text-lg font-medium font-mono text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
            title={isId ? 'Kembali ke Portofolio' : 'Back to Portfolio'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isId ? 'Portofolio' : 'Portfolio'}</span>
          </Link>

          <span className="h-5 w-px bg-zinc-200 dark:border-zinc-800" />

          <Link href="/arunaki" className="text-2xl sm:text-3xl font-bold font-mono tracking-tighter text-black dark:text-white">
            arunaki
          </Link>
        </div>

        {/* Right: GitHub, Docs, Language */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>GitHub</span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>

          <Link
            href="/arunaki/docs"
            className={`text-base sm:text-lg font-mono font-medium transition-colors ${
              isDocsActive
                ? 'text-black dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {isId ? 'Dokumentasi' : 'Docs'}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 p-0.5 text-base font-mono font-medium">
            <Link
              href={pathname}
              locale="id"
              onClick={() => {
                localStorage.setItem('portfolio_locale', 'id');
                document.cookie = 'NEXT_LOCALE=id;path=/;max-age=31536000';
              }}
              className={`px-3 py-0.5 rounded transition-colors ${
                isId
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >ID</Link>
            <Link
              href={pathname}
              locale="en"
              onClick={() => {
                localStorage.setItem('portfolio_locale', 'en');
                document.cookie = 'NEXT_LOCALE=en;path=/;max-age=31536000';
              }}
              className={`px-3 py-0.5 rounded transition-colors ${
                !isId
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="English"
            >EN</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
