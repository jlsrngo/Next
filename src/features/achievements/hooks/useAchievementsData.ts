import { useState, useEffect } from 'react';
import { profileService, achievementsService } from '@/services/api';

export interface AchievementItem {
  id: number | string;
  title: string;
  issuer: string;
  category: string;
  date: string;
  description: string;
  credential_id?: string;
  credential_url?: string;
  image_url: string | null;
  is_featured: boolean;
  order_index?: number;
}

export function useAchievementsData() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      achievementsService.getAchievements().catch(() => []),
      profileService.getProfile().catch(() => null),
    ])
      .then(([achievementsData, profileData]) => {
        setAchievements(achievementsData || []);
        setProfile(profileData);
      })
      .finally(() => setLoading(false));
  }, []);

  return { achievements, profile, loading };
}
