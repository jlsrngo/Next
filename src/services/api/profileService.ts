import { apiClient } from './client';
import type { Profile } from '@/types';

export async function fetchProfile(): Promise<Profile> {
  return apiClient<Profile>('/api/profile');
}

export async function updateProfile(payload: Partial<Profile>): Promise<Profile> {
  return apiClient<Profile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export const profileService = {
  getProfile: fetchProfile,
  updateProfile,
};
