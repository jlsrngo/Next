import { useState, useEffect } from 'react';
import { profileService } from '@/services/api';
import type { SocialLink } from '@/types';

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 1,
    platform: 'github',
    title: 'GitHub Repository & Code',
    description: 'Explore open-source repositories, Rust microservices, and web experiments.',
    url: 'https://github.com/jlsrngo',
    is_featured: true,
  },
  {
    id: 2,
    platform: 'linkedin',
    title: 'LinkedIn Network',
    description: 'Connect for professional opportunities, engineering collaborations, and partnerships.',
    url: 'https://linkedin.com/in/juliosiringoringo',
    is_featured: true,
  },
  {
    id: 3,
    platform: 'gmail',
    title: 'Direct Email',
    description: 'Send direct inquiries for contracts, projects, or architecture consultations.',
    url: 'mailto:contact@juliosiringoringo.space',
    is_featured: false,
  },
  {
    id: 4,
    platform: 'website',
    title: 'Official Website',
    description: 'Visit the live portfolio and blog platform.',
    url: 'https://juliosiringoringo.space',
    is_featured: false,
  },
];

export function useContactData() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    profileService.getProfile()
      .then(data => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { socialLinks, profile, loading };
}
