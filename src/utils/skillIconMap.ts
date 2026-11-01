import type { IconType } from 'react-icons';
import { skillIconData, fallbackEntry, nameToSlug, type SkillIconEntry } from './skillIconMeta';
import { iconRegistry } from './iconRegistry';

export type { SkillIconEntry };

export function getSkillIconData(slug: string): SkillIconEntry {
  const key = slug.toLowerCase().trim();
  const resolved = nameToSlug[key] || key;
  return skillIconData[resolved] || skillIconData[key] || fallbackEntry;
}

export function loadIcon(iconName: string): IconType | null {
  if (!iconName) return null;

  // 1. Direct match in iconRegistry (e.g. "FaHtml5", "SiPython", "DiJava")
  if (iconRegistry[iconName]) {
    return iconRegistry[iconName];
  }

  // 2. Lookup in skillIconMeta (by slug or name alias)
  const meta = getSkillIconData(iconName);
  if (meta?.iconName && iconRegistry[meta.iconName]) {
    return iconRegistry[meta.iconName];
  }

  // 3. Fallback: try case-insensitive or prefix matching
  const clean = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchedKey = Object.keys(iconRegistry).find((k) => {
    const kClean = k.toLowerCase();
    return (
      kClean === clean ||
      kClean === `si${clean}` ||
      kClean === `fa${clean}` ||
      kClean === `di${clean}` ||
      kClean === `vsc${clean}`
    );
  });

  if (matchedKey && iconRegistry[matchedKey]) {
    return iconRegistry[matchedKey];
  }

  return iconRegistry['SiSimpleicons'] || null;
}

export { skillIconData, fallbackEntry, nameToSlug };
export default skillIconData;
