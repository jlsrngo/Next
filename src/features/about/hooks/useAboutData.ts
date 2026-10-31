import { useState, useEffect, useCallback } from 'react';
import { profileService, aboutService } from '@/services/api';
import type { Profile, Experience, Education } from '@/types';

export function useAboutData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, aboutData] = await Promise.all([
        profileService.getProfile().catch(() => null),
        aboutService.getAboutData().catch(() => ({ experiences: [], educations: [] })),
      ]);
      setProfile(profileData);
      setExperiences(aboutData?.experiences || []);
      setEducations(aboutData?.educations || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { profile, experiences, educations, loading, error, refetch: loadData };
}
