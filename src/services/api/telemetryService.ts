import { apiClient } from './client';

export interface TrendingRepoItem {
  name: string;
  full_name: string;
  stars: number;
  stars_formatted: string;
  language: string;
  description: string;
  url: string;
}

export interface TrendingTech {
  status: string;
  source: string;
  headline: string;
  metric: string;
  spec: string;
  viral_repo?: string;
  repo_metric?: string;
  repo_spec?: string;
  repo_desc?: string;
  trending_repos?: TrendingRepoItem[];
}

export async function fetchTrendingTech(): Promise<TrendingTech> {
  try {
    return await apiClient<TrendingTech>('/api/trending');
  } catch {
    // Graceful fallback to static cached json from crawler
    const res = await fetch('/trending-tech.json');
    if (!res.ok) throw new Error('Failed to load telemetry cache');
    return (await res.json()) as TrendingTech;
  }
}

export const telemetryService = {
  getTrendingTech: fetchTrendingTech,
};
