import { apiClient } from './client';

export interface DashboardMetrics {
  total_projects: number;
  featured_projects: number;
  total_achievements: number;
  total_contributions: number;
  total_repos: number;
  total_prs: number;
  followers: number;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient<DashboardMetrics>('/api/dashboard');
}

export const dashboardService = {
  getDashboardStats: fetchDashboardMetrics,
};
