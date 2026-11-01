import { apiClient } from './client';
import type { AchievementItem } from '@/features/achievements/hooks/useAchievementsData';

export async function fetchAchievements(): Promise<AchievementItem[]> {
  return apiClient<AchievementItem[]>('/api/achievements');
}

export const achievementsService = {
  getAchievements: fetchAchievements,
};

