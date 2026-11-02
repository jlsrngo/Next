import React, { useState } from 'react';
import { Briefcase, ChevronDown, Building } from 'lucide-react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';
import { formatDuration, formatDate } from '@/lib/localize';
import type { Experience } from '@/types';

interface ExperienceListProps {
  experiences: Experience[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<number, 'resp' | 'learn' | 'impact'>>({});

  const safeExperiences = Array.isArray(experiences) ? experiences : [];

  return (
    <section className="space-y-6">
      <div className="border-b border-line pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-black dark:text-white" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">
            {t('about.experience') || 'Work Experience'}
          </h2>
        </div>
        <span className="font-mono text-[10px] font-bold text-black/70 dark:text-white/70">
          {safeExperiences.length} {t('about.positions_logged') || 'POSITIONS LOGGED'}
        </span>
      </div>

      <div className="space-y-4">
        {safeExperiences.map((exp: any) => {
          const companyName = exp.company_name || exp.company || 'Company';
          const position = exp.position || exp.role || 'Developer';
          const startDate = exp.start_date || '2023-01-01';
          const endDate = exp.end_date;
          const isCurrent = exp.is_current ?? true;
          const empType = exp.employment_type || 'Full-time';
          const workType = exp.work_type || 'Remote';
          const currentTab = activeTabs[exp.id] || 'resp';

          const tabList = currentTab === 'resp'
            ? (Array.isArray(exp.responsibilities) ? exp.responsibilities : [])
            : currentTab === 'learn'
            ? (Array.isArray(exp.what_i_learned) ? exp.what_i_learned : [])
            : (Array.isArray(exp.impact) ? exp.impact : []);

          return (
            <div
              key={exp.id}
              className="group relative border border-line bg-[#faf9f7] dark:bg-[#101014] rounded-none overflow-hidden shadow-none"
            >
              <CornerCrosses />
              <div
                className="p-5 cursor-pointer flex items-start gap-4"
                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
              >
                <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-white dark:bg-black border border-line p-2">
                  {exp.company_logo_url ? (
                    <img
                      src={optimizeCloudinaryUrl(exp.company_logo_url || '')}
                      alt={companyName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building className="w-full h-full text-black dark:text-white" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-display font-bold text-base md:text-lg leading-tight text-black dark:text-white">
                    {position}
                  </h3>
                  <p className="font-mono text-[11px] font-bold text-black/80 dark:text-white/80">
                    {companyName}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-black dark:text-white uppercase font-bold">
                    <span className="px-2 py-0.5 border border-line bg-white dark:bg-black rounded-none">
                      {formatDate(startDate, locale, { year: 'numeric', month: 'short' })} - {isCurrent ? (t('about.present') || 'Present') : (endDate ? formatDate(endDate, locale, { year: 'numeric', month: 'short' }) : (t('about.present') || 'Present'))}
                    </span>
                    <span className="px-2 py-0.5 border border-line bg-white dark:bg-black rounded-none">
                      {formatDuration(startDate, endDate, isCurrent, locale)}
                    </span>
                    <span className="px-2 py-0.5 border border-line bg-white dark:bg-black rounded-none">
                      {empType} • {workType}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-black dark:text-white transition-transform duration-200 mt-1 ${
                    expandedExp === exp.id ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Accordion Body */}
              {expandedExp === exp.id && (
                <div className="border-t border-line animate-fade-in">
                  <div className="p-4 md:p-6 pt-2 space-y-4 md:space-y-6">
                    <div className="flex overflow-x-auto border-b border-line">
                      {(['resp', 'learn', 'impact'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTabs({ ...activeTabs, [exp.id]: tab })}
                          className={`px-4 md:px-6 py-3 whitespace-nowrap flex-shrink-0 text-xs md:text-sm font-mono font-bold transition-all relative ${
                            currentTab === tab
                              ? 'text-black dark:text-white border-b-2 border-line'
                              : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {tab === 'resp' && (t('about.tabs.responsibilities') || 'Responsibilities')}
                          {tab === 'learn' && (t('about.tabs.learned') || 'What I Learned')}
                          {tab === 'impact' && (t('about.tabs.impact') || 'Key Impact')}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 font-mono text-xs leading-relaxed text-black/80 dark:text-white/80">
                      {tabList.length > 0 ? (
                        tabList.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-black dark:text-white font-bold select-none">•</span>
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-black/40 dark:text-white/40 italic">
                          Information pending synchronization.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
