import { useState, useEffect, useMemo } from 'react';
import { profileService, achievementsService } from '@/services/api';
import { useLocale } from '@/context/I18nContext';
import { localizeAchievement, localizeProfile } from '@/lib/localize';

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
  const locale = useLocale();
  const [rawAchievements, setRawAchievements] = useState<AchievementItem[]>([]);
  const [rawProfile, setRawProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      achievementsService.getAchievements().catch(() => []),
      profileService.getProfile().catch(() => null),
    ])
      .then(([achievementsData, profileData]) => {
        setRawAchievements(achievementsData || []);
        setRawProfile(profileData);
      })
      .finally(() => setLoading(false));
  }, []);

  const achievements = useMemo(() => {
    return (rawAchievements || []).map((a) => localizeAchievement(a, locale));
  }, [rawAchievements, locale]);

  const profile = useMemo(() => {
    return localizeProfile(rawProfile, locale);
  }, [rawProfile, locale]);

  return { achievements, profile, loading };
}
