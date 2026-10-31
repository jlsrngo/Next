import React from 'react';
import { useTranslations } from 'next-intl';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { Profile } from '@/types';

interface BiographyCardProps {
  profile: Profile | null;
}

export default function BiographyCard({ profile }: BiographyCardProps) {
  const t = useTranslations();
  const authorName = profile?.name || 'Julio Siringoringo';
  const firstName = authorName.split(' ')[0] || 'Julio';

  return (
    <section className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 md:p-8 space-y-6 shadow-none">
      <CornerCrosses />

      <div className="font-mono text-[10px] mb-2 border-b border-line pb-2 flex items-center justify-between text-black dark:text-white font-bold select-none">
        <span>BIOGRAPHY & PHILOSOPHY</span>
        <span>AUTHOR: {authorName.toUpperCase()}</span>
      </div>

      <p className="text-base md:text-lg text-black/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
        {profile?.bio_about || profile?.bio_home || 'Passionate developer focused on high-performance web systems, Swiss brutalist aesthetics, and robust software architecture.'}
      </p>

      <div className="pt-4 border-t border-line mt-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-black dark:text-white font-bold">
            {t('about.warm_regards') || 'Warm regards,'}
          </p>
          <p
            className="text-6xl sm:text-7xl mt-1 leading-none select-none font-serif italic"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#FFDB58' }}
          >
            {firstName}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="font-mono text-[9px] font-bold block text-black/60 dark:text-white/60">
            VERIFIED PROFILE
          </span>
          <span className="font-mono text-[10px] font-bold text-black dark:text-white">
            ID: ENG-2026-JS
          </span>
        </div>
      </div>
    </section>
  );
}
