import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslations } from 'next-intl';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { Profile } from '@/types';

interface HeroOverviewCardProps {
  profile: Profile | null;
}

export default function HeroOverviewCard({ profile }: HeroOverviewCardProps) {
  const t = useTranslations();

  return (
    <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 sm:p-10 space-y-6 shadow-none">
      <CornerCrosses />

      {/* Sub-header spec line */}
      <div className="flex items-center justify-between font-mono text-[10px] text-black dark:text-white border-b border-line pb-3 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-black dark:bg-white" />
          <span className="font-bold tracking-wider">{t('home.overview_tag') || '[ 01 // OVERVIEW ]'}</span>
          <span className="hidden sm:inline font-semibold">· {profile?.headline ? profile.headline.toUpperCase() : 'FULLSTACK & SYSTEMS ARCHITECTURE'}</span>
        </div>
        <span className="tracking-widest font-bold">FIG. 01.A // 2026</span>
      </div>

      <div className="space-y-4">
        <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-tight text-black dark:text-white whitespace-normal sm:whitespace-nowrap">
          {t('home.greeting') || "Hi, I'm"}{' '}
          <span
            className="font-serif italic font-normal"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#FFDB58' }}
          >
            {profile?.name || 'Julio Siringoringo'}
          </span>
        </h1>

        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-black dark:text-white pt-2 border-b border-line pb-4 w-full">
          {profile?.location && (
            <div className="flex items-center gap-1.5 font-medium">
              <span>•</span>
              <span>{profile.location}</span>
            </div>
          )}
          {profile?.work_status && (
            <div className="flex items-center gap-1.5 font-medium">
              <span>•</span>
              <span>{profile.work_status}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto text-[10px] font-bold text-black dark:text-white hidden sm:flex">
            <span className="w-2 h-2 bg-black dark:bg-white inline-block" />
            <span>{t('telemetry.home_status') || 'CORE SYSTEM ONLINE'}</span>
          </div>
        </div>
      </div>

      <p className="text-base sm:text-lg text-black/80 dark:text-white/80 max-w-2xl leading-relaxed whitespace-pre-wrap font-normal">
        {profile?.bio_home || 'I am a web developer with expertise in building fast, scalable applications using modern technologies.'}
      </p>

      {/* Signature Actions with 1px Brutalist Framing */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-line bg-black dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-wider font-bold transition-all hover:opacity-85 shadow-none"
        >
          <span>{t('home.explore_projects') || 'Explore Projects'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-line bg-white dark:bg-black text-black dark:text-white font-mono text-xs uppercase tracking-wider font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 shadow-none"
        >
          <span>{t('home.get_in_touch') || 'Get in Touch'}</span>
          <span className="font-mono text-[10px]">[→]</span>
        </Link>
      </div>
    </div>
  );
}
