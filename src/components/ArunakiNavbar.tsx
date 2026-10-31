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
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-bg-raised/95 backdrop-blur-md border-b border-line transition-colors">
      <div className="max-w-7xl mx-auto flex items-stretch h-12 border-x border-line">
        {/* Left: back + brand */}
        <Link
          href="/projects"
          className="border-r border-line px-4 flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-muted hover:text-ink hover:bg-bg-sunken transition-colors"
          title={isId ? 'Kembali ke Portofolio' : 'Back to Portfolio'}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isId ? 'PORTFOLIO' : 'PORTFOLIO'}</span>
        </Link>

        <Link
          href="/arunaki"
          className="border-r border-line px-5 flex items-center font-display text-lg font-bold tracking-tight text-ink hover:bg-bg-sunken transition-colors"
        >
          ARUNAKI
        </Link>

        {/* Middle Navigation Tabs (ArtCraft style) */}
        <nav className="flex items-stretch">
          <Link
            href="/arunaki"
            className={`border-r border-line px-4 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] font-bold transition-colors ${
              pathname === '/arunaki'
                ? 'bg-invert-bg text-invert-fg'
                : 'text-muted hover:text-ink hover:bg-bg-sunken'
            }`}
          >
            OVERVIEW
          </Link>
          <Link
            href="/arunaki/docs"
            className={`border-r border-line px-4 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] font-bold transition-colors ${
              isDocsActive
                ? 'bg-invert-bg text-invert-fg'
                : 'text-muted hover:text-ink hover:bg-bg-sunken'
            }`}
          >
            {isId ? 'DOKUMENTASI' : 'DOCS'}
          </Link>
          <Link
            href="/arunaki/download"
            className={`border-r border-line px-4 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] font-bold transition-colors hidden md:flex ${
              pathname.includes('/download')
                ? 'bg-invert-bg text-invert-fg'
                : 'text-muted hover:text-ink hover:bg-bg-sunken'
            }`}
          >
            DOWNLOAD
          </Link>
        </nav>

        {/* Right: Language switch + External Link CTA */}
        <div className="ml-auto flex items-stretch">
          {/* Language switcher */}
          <div className="border-l border-line flex items-stretch font-mono text-[10px] uppercase font-bold">
            <Link
              href={pathname}
              locale="id"
              onClick={() => {
                localStorage.setItem('portfolio_locale', 'id');
                document.cookie = 'NEXT_LOCALE=id;path=/;max-age=31536000';
              }}
              className={`px-3 flex items-center transition-colors ${
                isId
                  ? 'bg-invert-bg text-invert-fg'
                  : 'text-muted hover:text-ink hover:bg-bg-sunken'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </Link>
            <Link
              href={pathname}
              locale="en"
              onClick={() => {
                localStorage.setItem('portfolio_locale', 'en');
                document.cookie = 'NEXT_LOCALE=en;path=/;max-age=31536000';
              }}
              className={`px-3 flex items-center transition-colors border-l border-line ${
                !isId
                  ? 'bg-invert-bg text-invert-fg'
                  : 'text-muted hover:text-ink hover:bg-bg-sunken'
              }`}
              title="English"
            >
              EN
            </Link>
          </div>

          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="border-l border-line px-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] font-bold bg-invert-bg text-invert-fg hover:opacity-85 transition-opacity"
          >
            <span>GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
