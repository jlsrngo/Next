import { apiClient } from './client';
import type { SocialLink } from '@/types';

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  return apiClient<SocialLink[]>('/api/social-links');
}

export async function createSocialLink(payload: Partial<SocialLink>): Promise<SocialLink> {
  return apiClient<SocialLink>('/api/social-links', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSocialLink(id: string | number, payload: Partial<SocialLink>): Promise<SocialLink> {
  return apiClient<SocialLink>(`/api/social-links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteSocialLink(id: string | number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/social-links/${id}`, {
    method: 'DELETE',
  });
}

export const socialLinksService = {
  getSocialLinks: fetchSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};
