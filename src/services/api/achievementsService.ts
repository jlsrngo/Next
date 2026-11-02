import { apiClient } from './client';
import type { AchievementItem } from '@/features/achievements/hooks/useAchievementsData';

export async function fetchAchievements(): Promise<AchievementItem[]> {
  return apiClient<AchievementItem[]>('/api/achievements');
}

export async function fetchAchievementById(id: string | number): Promise<AchievementItem> {
  return apiClient<AchievementItem>(`/api/achievements/${id}`);
}

export async function createAchievement(payload: Partial<AchievementItem>): Promise<AchievementItem> {
  return apiClient<AchievementItem>('/api/achievements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAchievement(id: string | number, payload: Partial<AchievementItem>): Promise<AchievementItem> {
  return apiClient<AchievementItem>(`/api/achievements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAchievement(id: string | number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/achievements/${id}`, {
    method: 'DELETE',
  });
}

export const achievementsService = {
  getAchievements: fetchAchievements,
  getAchievementById: fetchAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
