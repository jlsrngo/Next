import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { HEATMAP_PALETTE } from '@/constants/palette';
import type { GitHubData } from '../hooks/useDashboardData';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONO_LEVEL_CLASSES = [
  'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10',
  'bg-[#d0cfc8] dark:bg-[#32343d]',
  'bg-[#9d9c94] dark:bg-[#606370]',
  'bg-[#52514c] dark:bg-[#9a9db0]',
  'bg-[#101014] dark:bg-[#ffffff]',
];

const PALETTE_LEVEL_STYLES = [
  { backgroundColor: undefined },
  { backgroundColor: HEATMAP_PALETTE.level1 }, // #B5D2AD
  { backgroundColor: HEATMAP_PALETTE.level2 }, // #BAFCA2
  { backgroundColor: HEATMAP_PALETTE.level3 }, // #90EE90
  { backgroundColor: HEATMAP_PALETTE.level4 }, // #7FBC8C
];

export default function ContributionHeatmap({ github }: { github: GitHubData }) {
  const t = useTranslations();
  const { themeStyle } = useTheme();
  const isMono = themeStyle === 'monochrome';
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const monthPositions = useMemo(() => {
    if (!github?.weeks) return [];
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    github.weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const month = new Date(week[0].date).getMonth();
        if (month !== lastMonth) {
          positions.push({ label: MONTH_LABELS[month], col: weekIndex });
          lastMonth = month;
        }
      }
    });
    return positions;
  }, [github]);

  const handleCellHover = (e: React.MouseEvent, day: { date: string; count: number }) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const date = new Date(day.date).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
    const contributionText = day.count !== 1 ? (t('dashboard.contributions_plural') || 'contributions') : (t('dashboard.contribution') || 'contribution');
    setTooltip({
      text: `${day.count} ${contributionText} ${t('dashboard.on') || 'on'} ${date}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none shadow-none">
      <CornerCrosses />
      <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
          {github.total_contributions.toLocaleString()} {t('dashboard.contributions_last_year') || 'contributions in the last year'}
        </h3>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="relative mb-2 ml-8 h-4">
            {monthPositions.map((mp, i) => (
              <span
                key={i}
                className="absolute font-mono text-[10px] text-black/60 dark:text-white/60 uppercase font-bold"
                style={{ left: `${mp.col * 14}px` }}
              >
                {mp.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[2px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] pr-1 pt-0">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                <span
                  key={i}
                  className="font-mono text-[9px] text-black/60 dark:text-white/60 uppercase font-bold h-[12px] leading-[12px] flex items-center"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Weeks columns */}
            <div className="flex gap-[2px]">
              {github.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => {
                    const level = Math.min(Math.max(day.level ?? 0, 0), 4);
                    const isEmpty = level === 0;

                    return (
                      <div
                        key={di}
                        className={`w-[12px] h-[12px] rounded-none transition-opacity hover:opacity-75 cursor-pointer ${
                          isEmpty
                            ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10'
                            : 'border border-black/20'
                        }`}
                        style={!isEmpty ? { backgroundColor: PALETTE_LEVEL_STYLES[level].backgroundColor } : undefined}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-line">
            <span className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60 mr-1">
              {t('dashboard.less') || 'Less'}
            </span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-[11px] h-[11px] rounded-none ${
                  level === 0
                    ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10'
                    : 'border border-black/20'
                }`}
                style={level > 0 ? { backgroundColor: PALETTE_LEVEL_STYLES[level].backgroundColor } : undefined}
              />
            ))}
            <span className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60 ml-1">
              {t('dashboard.more') || 'More'}
            </span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-none border border-line bg-black dark:bg-white text-white dark:text-black font-mono text-[11px] uppercase tracking-wider shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
