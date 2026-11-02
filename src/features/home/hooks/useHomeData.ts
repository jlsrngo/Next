import { useState, useEffect, useCallback, useMemo } from 'react';
import { profileService, skillsService } from '@/services/api';
import { useLocale } from '@/context/I18nContext';
import { localizeProfile } from '@/lib/localize';
import type { Profile, Skill } from '@/types';

export function useHomeData() {
  const locale = useLocale();
  const [rawProfile, setRawProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, skillsData] = await Promise.all([
        profileService.getProfile().catch(() => null),
        skillsService.getSkills().catch(() => []),
      ]);
      setRawProfile(profileData);
      setSkills(skillsData || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const profile = useMemo(() => {
    return localizeProfile(rawProfile, locale);
  }, [rawProfile, locale]);

  return { profile, skills, loading, error, refetch: loadData };
}
