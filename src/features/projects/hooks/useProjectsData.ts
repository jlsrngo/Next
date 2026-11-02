import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectsService, profileService } from '@/services/api';
import { useLocale } from '@/context/I18nContext';
import { localizeProject, localizeProfile } from '@/lib/localize';
import type { Project, Profile } from '@/types';

export function useProjectsData() {
  const locale = useLocale();
  const [rawProjects, setRawProjects] = useState<Project[]>([]);
  const [rawProfile, setRawProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, profileData] = await Promise.all([
        projectsService.getProjects().catch(() => []),
        profileService.getProfile().catch(() => null),
      ]);
      setRawProjects(projectsData || []);
      setRawProfile(profileData);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projects = useMemo(() => {
    return (rawProjects || []).map((p) => localizeProject(p, locale));
  }, [rawProjects, locale]);

  const profile = useMemo(() => {
    return localizeProfile(rawProfile, locale);
  }, [rawProfile, locale]);

  return { projects, profile, loading, error, refetch: loadData };
}
