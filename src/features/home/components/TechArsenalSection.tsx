import React from 'react';
import { useTranslations } from 'next-intl';
import CornerCrosses from '@/components/ui/CornerCrosses';
import SkillIcon from '@/components/SkillIcon';
import type { Skill } from '@/types';

interface TechArsenalSectionProps {
  skills: Skill[];
}

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'Mobile', 'Database', 'Tools & DevOps', 'Cloud', 'AI'];

export default function TechArsenalSection({ skills }: TechArsenalSectionProps) {
  const t = useTranslations();

  const grouped = CATEGORY_ORDER
    .map(cat => ({
      category: cat,
      items: skills.filter(s => s.category === cat),
    }))
    .filter(g => g.items.length > 0);

  const uncategorized = skills.filter(s => !CATEGORY_ORDER.includes(s.category));
  if (uncategorized.length > 0) {
    grouped.push({ category: 'Other', items: uncategorized });
  }

  if (grouped.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-line pb-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            {t('home.tech_arsenal_tag') || '[ 02 // TECH ARSENAL ]'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
            {t('home.skills_title') || 'Skills'}
          </h2>
        </div>
        <div className="text-right hidden sm:block font-mono text-[10px] text-black dark:text-white font-bold">
          <span className="font-bold">{skills.length}</span> {t('home.technologies_indexed') || 'TECHNOLOGIES INDEXED'}
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map((group, groupIdx) => (
          <div
            key={group.category}
            className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-5 sm:p-7 shadow-none"
          >
            <CornerCrosses />
            <div className="font-mono text-[10px] mb-5 border-b border-line pb-2.5 flex items-center justify-between text-black dark:text-white select-none">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black dark:bg-white" />
                <span className="font-bold tracking-wider">
                  {(t(`home.categories.${group.category}`) || group.category).toUpperCase()}
                </span>
              </span>
              <span className="font-mono text-[9px] tracking-widest font-bold">
                FIG. 02.{groupIdx + 1} // {String(group.items.length).padStart(2, '0')} {t('home.items') || 'ITEMS'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              {group.items.map((skill) => {
                const iconSlug = (skill as any).iconName || (skill as any).icon || (skill as any).icon_name || skill.name;
                return (
                  <div key={skill.id} className="animate-fade-in">
                    <SkillIcon name={skill.name} iconSlug={iconSlug} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
