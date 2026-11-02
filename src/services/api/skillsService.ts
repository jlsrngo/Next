import { apiClient } from './client';
import type { Skill } from '@/types';

export async function fetchSkills(): Promise<Skill[]> {
  return apiClient<Skill[]>('/api/skills');
}

export async function createSkill(payload: Partial<Skill>): Promise<Skill> {
  return apiClient<Skill>('/api/skills', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteSkill(iconName: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/skills?iconName=${encodeURIComponent(iconName)}`, {
    method: 'DELETE',
  });
}

export const skillsService = {
  getSkills: fetchSkills,
  createSkill,
  deleteSkill,
};
