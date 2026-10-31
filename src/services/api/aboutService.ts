import { apiClient } from './client';
import type { AboutData } from '@/types';

export async function fetchAboutData(): Promise<AboutData> {
  return apiClient<AboutData>('/api/about');
}

export const aboutService = {
  getAboutData: fetchAboutData,
};
