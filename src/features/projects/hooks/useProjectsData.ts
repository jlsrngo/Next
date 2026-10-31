import { useState, useEffect, useCallback } from 'react';
import { projectsService, profileService } from '@/services/api';
import type { Project, Profile } from '@/types';

export function useProjectsData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
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
      setProjects(projectsData || []);
      setProfile(profileData);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { projects, profile, loading, error, refetch: loadData };
}
