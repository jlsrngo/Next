import React from 'react';
import { useTranslations } from 'next-intl';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { getLanguageColor } from '@/constants/palette';

interface TopLanguagesListProps {
  languages: { name: string; color: string; count: number }[];
}

export default function TopLanguagesList({ languages }: TopLanguagesListProps) {
  const t = useTranslations();

  if (!languages || languages.length === 0) return null;

  return (
    <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none shadow-none">
      <CornerCrosses />
      <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-black dark:text-white mb-4 border-b border-line pb-2">
        {t('dashboard.top_languages') || 'Top Languages'}
      </h3>
      <div className="space-y-3">
        {languages.map((lang) => {
          const maxCount = languages[0].count;
          const pct = (lang.count / maxCount) * 100;
          const mappedColor = getLanguageColor(lang.name);

          return (
            <div key={lang.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-none flex-shrink-0 border border-black/20"
                style={{ backgroundColor: mappedColor }}
              />
              <span className="font-mono text-xs uppercase font-bold text-black dark:text-white w-28 flex-shrink-0">
                {lang.name}
              </span>
              <div className="flex-1 h-2.5 bg-black/5 dark:bg-white/5 border border-line rounded-none overflow-hidden">
                <div
                  className="h-full rounded-none transition-all duration-700"
                  style={{ backgroundColor: mappedColor, width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-xs text-black/70 dark:text-white/70 font-bold w-16 text-right">
                {lang.count} {lang.count !== 1 ? (t('dashboard.repos') || 'repos') : (t('dashboard.repo') || 'repo')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
