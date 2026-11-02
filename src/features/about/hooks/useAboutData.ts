import { useState, useEffect, useCallback, useMemo } from 'react';
import { profileService, aboutService } from '@/services/api';
import { useLocale } from '@/context/I18nContext';
import { localizeProfile, localizeExperience, localizeEducation } from '@/lib/localize';
import type { Profile, Experience, Education } from '@/types';

export function useAboutData() {
  const locale = useLocale();
  const [rawProfile, setRawProfile] = useState<Profile | null>(null);
  const [rawExperiences, setRawExperiences] = useState<Experience[]>([]);
  const [rawEducations, setRawEducations] = useState<Education[]>([]);
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
      setRawProfile(profileData);
      setRawExperiences(aboutData?.experiences || []);
      setRawEducations(aboutData?.educations || []);
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

  const experiences = useMemo(() => {
    return (rawExperiences || []).map((e) => localizeExperience(e, locale));
  }, [rawExperiences, locale]);

  const educations = useMemo(() => {
    return (rawEducations || []).map((ed) => localizeEducation(ed, locale));
  }, [rawEducations, locale]);

  return { profile, experiences, educations, loading, error, refetch: loadData };
}
