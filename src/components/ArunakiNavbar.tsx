'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Download, ArrowLeft, ExternalLink, Github } from 'lucide-react';

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

  const navItems = [
    { href: '/arunaki', label: isId ? 'Ringkasan' : 'Overview', exact: true },
    { href: '/arunaki/docs', label: isId ? 'Dokumentasi' : 'Docs' },
    { href: '/arunaki/features', label: isId ? 'Fitur' : 'Features' },
    { href: '/arunaki/tools', label: isId ? 'Alat' : 'Tools' },
  ];

  const isCurrentActive = (itemHref: string, exact?: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Portfolio Back & Arunaki Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 mr-2"
            title={isId ? 'Kembali ke Portofolio' : 'Back to Portfolio'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isId ? 'Portofolio' : 'Portfolio'}</span>
          </Link>

          <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          <Link href="/arunaki" className="flex items-center gap-2 tracking-tight">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tighter text-black dark:text-white">
              arunaki
            </span>
          </Link>
        </div>

        {/* Center / Right: Nav links that navigate to separate pages */}
        <nav className="flex items-center gap-3 sm:gap-7 text-sm sm:text-[15px] font-sans font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          {navItems.map((item) => {
            const active = isCurrentActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 ${
                  active
                    ? 'text-black dark:text-white font-semibold border-b-2 border-black dark:border-white -mb-[2px]'
                    : 'hover:text-black dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 p-0.5 text-xs sm:text-sm font-medium">
            <button
              onClick={() => handleLanguageSwitch('id')}
              className={`px-2 py-0.5 rounded transition-colors ${
                isId
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => handleLanguageSwitch('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                !isId
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Download CTA Button */}
          <Link
            href="/arunaki/download"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-sans text-xs sm:text-sm font-semibold transition-all ${
              pathname.includes('/arunaki/download')
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950 ring-2 ring-zinc-400'
                : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isId ? 'Unduh' : 'Download'}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
