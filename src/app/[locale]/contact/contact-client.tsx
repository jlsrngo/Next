'use client';

import { ExternalLink, Mail, MessageSquare, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SocialLink {
  id: number;
  platform: string;
  title: string;
  description: string | null;
  url: string;
  is_featured: boolean;
}

interface ContactClientProps {
  socialLinks: SocialLink[];
  profile: any;
}

function CornerCrosses() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
    </>
  );
}

const PLATFORM_SVG: Record<string, string> = {
  gmail: 'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
};

const platformLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

export default function ContactClient({ socialLinks = [], profile }: ContactClientProps) {
  const t = useTranslations();

  const safeLinks = Array.isArray(socialLinks) ? socialLinks : [];
  const featuredLinks = safeLinks.filter(l => l.is_featured);
  const otherLinks = safeLinks.filter(l => !l.is_featured);

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Top Header */}
      <div className="border-b border-black dark:border-white pb-4 animate-fade-in">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
          [ 06 // TRANSMISSION & NETWORK ]
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
          {t('contact.title')}
        </h1>
        <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">
          {t('contact.find_me')}
        </p>
      </div>

      {/* Featured Direct Cards */}
      <div className="space-y-5">
        {featuredLinks.map((link, i) => (
          <ContactCard key={link.id} link={link} index={i} isFull />
        ))}
      </div>

      {/* Other Channels Grid */}
      {otherLinks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {otherLinks.map((link, i) => (
            <ContactCard key={link.id} link={link} index={featuredLinks.length + i} />
          ))}
        </div>
      )}

      {safeLinks.length === 0 && (
        <div className="border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-10 text-center relative">
          <CornerCrosses />
          <p className="font-mono text-xs uppercase font-bold text-black/70 dark:text-white/70">
            {t('common.no_data')}
          </p>
        </div>
      )}
    </div>
  );
}

function ContactCard({ link, index, isFull = false }: { link: SocialLink; index: number; isFull?: boolean }) {
  const t = useTranslations();
  const svgPath = PLATFORM_SVG[link.platform.toLowerCase()] || PLATFORM_SVG.website;
  const label = platformLabel(link.platform);

  return (
    <div
      onClick={() => window.open(link.url, '_blank')}
      className="group relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 sm:p-7 overflow-hidden cursor-pointer shadow-none transition-all hover:bg-[#f2f1ed] dark:hover:bg-[#16171d]"
    >
      <CornerCrosses />

      {/* Subtle technical background watermark */}
      {svgPath && (
        <div
          className="absolute -bottom-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-300 pointer-events-none select-none text-black dark:text-white"
          style={{ transform: 'rotate(-12deg)' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d={svgPath} />
          </svg>
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {/* Top telemetry status line */}
        <div className="flex items-center justify-between font-mono text-[10px] text-black dark:text-white border-b border-black dark:border-white pb-2.5 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black dark:bg-white inline-block" />
            <span className="font-bold tracking-wider">{link.platform.toUpperCase()} // DIRECT ROUTE</span>
          </div>
          <span className="font-mono text-[9px] tracking-widest font-bold">
            CHAN. 0{index + 1}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1.5 pr-12">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-black dark:text-white">
            {link.title}
          </h2>
          {link.description && (
            <p className="font-sans text-xs sm:text-sm text-black/80 dark:text-white/80 leading-relaxed max-w-xl">
              {link.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-mono text-[11px] uppercase tracking-wider font-bold transition-all group-hover:opacity-85 shadow-none select-none">
            <span>{t('contact.go_to')} {label}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
