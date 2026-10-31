import { apiClient } from './client';
import type { Profile } from '@/types';

export async function fetchProfile(): Promise<Profile> {
  return apiClient<Profile>('/api/profile');
}

export const profileService = {
  getProfile: fetchProfile,
};
