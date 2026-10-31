import React from 'react';
import { Award, Calendar, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { PALETTE } from '@/constants/palette';
import type { AchievementItem } from '../hooks/useAchievementsData';

interface AchievementCardProps {
  item: AchievementItem;
  index: number;
  onSelect: (item: AchievementItem) => void;
}

export default function AchievementCard({ item, index, onSelect }: AchievementCardProps) {
  const t = useTranslations();
  const isPdf = item.image_url?.toLowerCase().endsWith('.pdf');
  const hasImage = !!item.image_url;

  return (
    <div
      className="group relative border border-line bg-[#faf9f7] dark:bg-[#101014] rounded-none overflow-hidden transition-all hover:bg-[#f2f1ed] dark:hover:bg-[#16171d] flex flex-col cursor-pointer animate-fade-in shadow-none"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onSelect(item)}
    >
      <CornerCrosses />

      <div className="absolute top-3 right-3 z-10">
        <span
          className="px-2 py-0.5 rounded-none bg-black dark:bg-[#121316] border font-mono text-[9px] uppercase font-bold tracking-wider inline-block"
          style={{ borderColor: `${PALETTE.canaryYellow}80`, color: PALETTE.canaryYellow }}
        >
          {item.category}
        </span>
      </div>

      <div className="relative h-36 md:h-44 overflow-hidden bg-black/5 dark:bg-white/5 border-b border-line transition-colors">
        {hasImage && !isPdf ? (
          <img
            src={item.image_url!}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Award className="w-10 h-10 text-black/40 dark:text-white/40" />
            {isPdf && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                {t('achievements.pdf_certificate') || 'PDF Certificate'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-base text-black dark:text-white line-clamp-1">
            {item.title}
          </h3>
          {item.issuer && (
            <p
              className="font-mono text-[10px] font-bold uppercase flex items-center gap-1.5"
              style={{ color: PALETTE.deepCyan }}
            >
              <ShieldCheck className="w-3.5 h-3.5 inline" style={{ color: PALETTE.deepCyan }} />
              <span>{item.issuer}</span>
            </p>
          )}
        </div>

        <p className="text-black/70 dark:text-white/70 text-xs leading-relaxed line-clamp-2 font-sans">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-line font-mono text-[10px] text-black/60 dark:text-white/60 uppercase font-bold">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
