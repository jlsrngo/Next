import { apiClient } from './client';
import type { SocialLink } from '@/types';

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  return apiClient<SocialLink[]>('/api/social-links');
}

export const socialLinksService = {
  getSocialLinks: fetchSocialLinks,
};

