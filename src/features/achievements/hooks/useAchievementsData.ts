import { useState, useEffect } from 'react';
import { profileService } from '@/services/api';

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

const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 1,
    title: 'Full-Stack Engineering Excellence',
    issuer: 'Independent Systems',
    category: 'Certification',
    date: '2024-05-15',
    description: 'Mastery in building high-performance Swiss technical web applications with Rust and modern frontend stacks.',
    credential_id: 'CERT-AC-2024-001',
    credential_url: 'https://juliosiringoringo.space',
    image_url: null,
    is_featured: true,
    order_index: 0,
  },
  {
    id: 2,
    title: 'Rust High-Performance Architecture',
    issuer: 'Rust Foundation Community',
    category: 'Award',
    date: '2024-08-20',
    description: 'Recognition for building sub-millisecond asynchronous API microservices with Axum and Tokio.',
    credential_id: 'RUST-AXUM-2024-99',
    credential_url: undefined,
    image_url: null,
    is_featured: true,
    order_index: 1,
  },
];

export function useAchievementsData() {
  const [achievements, setAchievements] = useState<AchievementItem[]>(DEFAULT_ACHIEVEMENTS);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    profileService.getProfile()
      .then(data => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { achievements, profile, loading };
}
