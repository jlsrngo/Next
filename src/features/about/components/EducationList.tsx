import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useTranslations } from '@/context/I18nContext';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { Education } from '@/types';

interface EducationListProps {
  educations: Education[];
}

export default function EducationList({ educations }: EducationListProps) {
  const t = useTranslations();
  const safeEducations = Array.isArray(educations) ? educations : [];

  return (
    <section className="space-y-6">
      <div className="border-b border-line pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-black dark:text-white" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">
            {t('about.education') || 'Education'}
          </h2>
        </div>
        <span className="font-mono text-[10px] font-bold text-black/70 dark:text-white/70">
          {safeEducations.length} {t('about.records_logged') || 'RECORDS LOGGED'}
        </span>
      </div>

      <div className="space-y-4">
        {safeEducations.map((edu: any) => (
          <div
            key={edu.id}
            className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none shadow-none"
          >
            <CornerCrosses />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-white dark:bg-black border border-line p-2 flex items-center justify-center">
                <GraduationCap className="w-full h-full text-black dark:text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-display font-bold text-base md:text-lg leading-tight text-black dark:text-white">
                  {edu.institution_name}
                </h3>
                <p className="font-mono text-xs font-bold text-black/80 dark:text-white/80">
                  {edu.degree} • {edu.field_of_study}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-black dark:text-white uppercase font-bold">
                  {edu.gpa && (
                    <span className="px-2 py-0.5 border border-line bg-white dark:bg-black rounded-none">
                      GPA: {edu.gpa}
                    </span>
                  )}
                  <span className="px-2 py-0.5 border border-line bg-white dark:bg-black rounded-none">
                    {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : (t('about.present') || 'Present')}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-xs text-black/80 dark:text-white/80 pt-2 leading-relaxed font-sans">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
