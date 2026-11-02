import React, { useMemo, useState } from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { getHeatmapCellColor, HEATMAP_LEGEND_LEVELS } from '@/constants/palette';
import { formatDate } from '@/lib/localize';
import type { GitHubData } from '../hooks/useDashboardData';

const MONTH_LABELS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LABELS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

interface ContributionHeatmapProps {
  github?: GitHubData | any | null;
  weeks?: any;
}

export default function ContributionHeatmap({ github, weeks }: ContributionHeatmapProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';
  const { themeStyle } = useTheme();
  const isMono = themeStyle === 'monochrome';
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const monthLabels = isId ? MONTH_LABELS_ID : MONTH_LABELS_EN;
  const dayLabels = isId ? ['', 'Sen', '', 'Rab', '', 'Jum', ''] : ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  const rawWeeks = (github && Array.isArray(github.weeks)) ? github.weeks : (Array.isArray(weeks) ? weeks : null);

  const monthPositions = useMemo(() => {
    if (!rawWeeks || rawWeeks.length === 0) return [];
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    rawWeeks.forEach((week: any[], weekIndex: number) => {
      if (week && week.length > 0 && week[0]?.date) {
        const month = new Date(week[0].date).getMonth();
        if (month !== lastMonth) {
          positions.push({ label: monthLabels[month], col: weekIndex });
          lastMonth = month;
        }
      }
    });
    return positions;
  }, [rawWeeks, monthLabels]);

  if (!rawWeeks || rawWeeks.length === 0) {
    return null;
  }

  const handleCellHover = (e: React.MouseEvent, day: { date: string; count: number }) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const date = formatDate(day.date, locale, {
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
      <div className="flex items-center justify-between mb-4 border-b border-line pb-2">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
          {t('dashboard.contribution_matrix') || t('dashboard.contribution_heatmap') || 'Contribution Matrix'}
        </h3>
        <span className="font-mono text-[10px] text-black/60 dark:text-white/60">
          {t('dashboard.activity_52_weeks') || '52 WEEKS ACTIVITY'}
        </span>
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
              {dayLabels.map((label, i) => (
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
              {rawWeeks.map((week: any[], wi: number) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day: any, di: number) => {
                    const level = Math.min(Math.max(day.level ?? 0, 0), 4);
                    const isEmpty = level === 0;
                    const cellBg = !isEmpty ? getHeatmapCellColor(day.date, level) : undefined;

                    return (
                      <div
                        key={di}
                        className={`w-[12px] h-[12px] rounded-none transition-opacity hover:opacity-75 cursor-pointer ${
                          isEmpty
                            ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10'
                            : 'border border-black/15'
                        }`}
                        style={!isEmpty && cellBg ? { backgroundColor: cellBg } : undefined}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-line text-[10px] font-mono text-black/60 dark:text-white/60 uppercase font-bold">
        <span>{t('dashboard.less') || 'LESS'}</span>
        <div className="flex items-center gap-1">
          {HEATMAP_LEGEND_LEVELS.map((color, idx) => (
            <div
              key={idx}
              className={`w-[10px] h-[10px] ${!color ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10' : 'border border-black/15'}`}
              style={{
                backgroundColor: !color ? undefined : (isMono ? (idx === 4 ? '#ffffff' : '#32343d') : color),
              }}
            />
          ))}
        </div>
        <span>{t('dashboard.more') || 'MORE'}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-black dark:bg-white text-white dark:text-black font-mono text-[9px] pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
