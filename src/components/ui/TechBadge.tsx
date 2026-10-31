import React from 'react';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';

export default function TechBadge({ tech }: { tech: string }) {
  const { iconName } = getSkillIconData(tech);
  const IconComponent = loadIcon(iconName);

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-black border border-black dark:border-white rounded-none">
      {IconComponent && (
        <IconComponent className="w-3 h-3 text-black dark:text-white" />
      )}
      <span className="font-mono text-[9px] uppercase font-bold text-black dark:text-white">{tech}</span>
    </div>
  );
}
