import { useState, useEffect } from 'react';
import { profileService, socialLinksService } from '@/services/api';
import type { SocialLink } from '@/types';

export function useContactData() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      socialLinksService.getSocialLinks().catch(() => []),
      profileService.getProfile().catch(() => null),
    ])
      .then(([linksData, profileData]) => {
        setSocialLinks(linksData || []);
        setProfile(profileData);
      })
      .finally(() => setLoading(false));
  }, []);

  return { socialLinks, profile, loading };
}
