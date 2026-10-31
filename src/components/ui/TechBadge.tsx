import React from 'react';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';
import { getLanguageColor } from '@/constants/palette';

export default function TechBadge({ tech }: { tech: string }) {
  const { iconName } = getSkillIconData(tech);
  const IconComponent = loadIcon(iconName);
  const color = getLanguageColor(tech);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/95 dark:bg-[#121316] border rounded-none transition-all duration-150 shadow-none"
      style={{ borderColor: `${color}80` }}
    >
      {IconComponent && (
        <span style={{ color }}>
          <IconComponent className="w-3 h-3" />
        </span>
      )}
      <span
        className="font-mono text-[9px] uppercase font-bold tracking-wider"
        style={{ color }}
      >
        {tech}
      </span>
    </div>
  );
}
