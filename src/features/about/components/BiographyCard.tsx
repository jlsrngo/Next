import React from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { Profile } from '@/types';

interface BiographyCardProps {
  profile: Profile | null;
}

export default function BiographyCard({ profile }: BiographyCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';
  const authorName = profile?.name || 'Julio Siringoringo';
  const firstName = authorName.split(' ')[0] || 'Julio';

  const defaultBio = isId
    ? 'Pengembang yang berfokus pada sistem web berkinerja tinggi, estetika Swiss Brutalist, dan arsitektur perangkat lunak yang tangguh. Menggabungkan ketelitian rekayasa dengan desain fungsional.'
    : 'Passionate developer focused on high-performance web systems, Swiss brutalist aesthetics, and robust software architecture.';

  return (
    <section className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 md:p-8 space-y-6 shadow-none">
      <CornerCrosses />

      <div className="font-mono text-[10px] mb-2 border-b border-line pb-2 flex items-center justify-between text-black dark:text-white font-bold select-none">
        <span>{t('about.biography_philosophy') || 'BIOGRAPHY & PHILOSOPHY'}</span>
        <span>{t('about.author') || 'AUTHOR'}: {authorName.toUpperCase()}</span>
      </div>

      <p className="text-base md:text-lg text-black/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
        {profile?.bio_about || profile?.bio_home || defaultBio}
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
            {isId ? 'PROFIL TERVERIFIKASI' : 'VERIFIED PROFILE'}
          </span>
          <span className="font-mono text-[10px] font-bold text-black dark:text-white">
            ID: ENG-2026-JS
          </span>
        </div>
      </div>
    </section>
  );
}
