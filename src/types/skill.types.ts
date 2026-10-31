export interface Skill {
  id: number | string;
  name: string;
  icon?: string | null;
  iconName?: string | null;
  icon_name?: string | null;
  category: string;
  proficiency?: number;
  featured?: boolean;
  order?: number;
}

export type SkillCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Database'
  | 'Tools & DevOps'
  | 'Cloud'
  | 'AI'
  | 'Other';
