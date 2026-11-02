import React from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { PALETTE } from '@/constants/palette';
import type { Profile } from '@/types';

interface QuickSpecsHudProps {
  profile: Profile | null;
}

export default function QuickSpecsHud({ profile }: QuickSpecsHudProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
      <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
        <CornerCrosses />
        <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">
          {t('about.specs.focus') || 'SPEC 01 // FOCUS'}
        </span>
        <span
          className="font-mono text-xs font-bold block"
          style={{ color: PALETTE.deepCyan }}
        >
          {profile?.headline || profile?.focus || (isId ? 'Full-Stack & Arsitektur Sistem' : 'Full-Stack & Systems')}
        </span>
      </div>

      <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
        <CornerCrosses />
        <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">
          {t('about.specs.runtime') || 'SPEC 02 // RUNTIME'}
        </span>
        <span
          className="font-mono text-xs font-bold block"
          style={{ color: PALETTE.coralRed }}
        >
          {profile?.runtime || 'Rust Axum 0.7 · React 18'}
        </span>
      </div>

      <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
        <CornerCrosses />
        <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">
          {t('about.specs.location') || 'SPEC 03 // LOCATION'}
        </span>
        <span
          className="font-mono text-xs font-bold block"
          style={{ color: PALETTE.forestSage }}
        >
          {profile?.location || 'Indonesia'}
        </span>
      </div>

      <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
        <CornerCrosses />
        <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">
          {t('about.specs.status') || 'SPEC 04 // STATUS'}
        </span>
        <span
          className="font-mono text-xs font-bold block"
          style={{ color: PALETTE.canaryYellow }}
        >
          {profile?.work_status || (isId ? 'Terbuka untuk Peluang Kerja' : 'Open to Opportunities')}
        </span>
      </div>
    </div>
  );
}
