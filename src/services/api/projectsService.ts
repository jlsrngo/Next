import { apiClient } from './client';
import type { Project } from '@/types';

export async function fetchProjects(): Promise<Project[]> {
  return apiClient<Project[]>('/api/projects');
}

export async function fetchProjectById(id: string | number): Promise<Project> {
  return apiClient<Project>(`/api/projects/${id}`);
}

export async function createProject(payload: Partial<Project>): Promise<Project> {
  return apiClient<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: string | number, payload: Partial<Project>): Promise<Project> {
  return apiClient<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string | number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

export const projectsService = {
  getProjects: fetchProjects,
  getProjectById: fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
};
