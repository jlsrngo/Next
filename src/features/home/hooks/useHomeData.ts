import { useState, useEffect, useCallback } from 'react';
import { profileService, skillsService } from '@/services/api';
import type { Profile, Skill } from '@/types';

export function useHomeData() {
  const [profile, setProfile] = useState<Profile | null>(null);
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
      setProfile(profileData);
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

  return { profile, skills, loading, error, refetch: loadData };
}
