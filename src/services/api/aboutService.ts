import { apiClient } from './client';
import type { AboutData } from '@/types';

export async function fetchAboutData(): Promise<AboutData> {
  return apiClient<AboutData>('/api/about');
}

export async function createExperience(payload: Record<string, unknown>): Promise<unknown> {
  return apiClient('/api/experiences', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateExperience(id: string | number, payload: Record<string, unknown>): Promise<unknown> {
  return apiClient(`/api/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteExperience(id: string | number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/experiences/${id}`, {
    method: 'DELETE',
  });
}

export async function createEducation(payload: Record<string, unknown>): Promise<unknown> {
  return apiClient('/api/education', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateEducation(id: string | number, payload: Record<string, unknown>): Promise<unknown> {
  return apiClient(`/api/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteEducation(id: string | number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/education/${id}`, {
    method: 'DELETE',
  });
}

export const aboutService = {
  getAboutData: fetchAboutData,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
};
