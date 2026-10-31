import { apiClient } from './client';
import type { Skill } from '@/types';

export async function fetchSkills(): Promise<Skill[]> {
  return apiClient<Skill[]>('/api/skills');
}

export const skillsService = {
  getSkills: fetchSkills,
};
