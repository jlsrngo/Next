import { apiClient } from './client';
import type { Project } from '@/types';

export async function fetchProjects(): Promise<Project[]> {
  return apiClient<Project[]>('/api/projects');
}

export const projectsService = {
  getProjects: fetchProjects,
};
