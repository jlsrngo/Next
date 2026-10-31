import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/api';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubData {
  total_contributions: number;
  total_commits: number;
  total_prs: number;
  total_issues: number;
  total_repos: number;
  followers: number;
  following: number;
  weeks: ContributionDay[][];
  top_languages: { name: string; color: string; count: number }[];
  username: string;
}

let memoryGithubCache: GitHubData | null = null;
let memoryStatsCache: any = null;

export function useDashboardData() {
  const [stats, setStats] = useState<any>(() => memoryStatsCache || null);
  const [github, setGithub] = useState<GitHubData | null>(() => memoryGithubCache || null);
  const [loading, setLoading] = useState<boolean>(() => !memoryStatsCache);
  const [ghLoading, setGhLoading] = useState<boolean>(() => !memoryGithubCache);

  useEffect(() => {
    // Session cache restoration
    if (!github && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('portfolio_github_cache');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.data && Date.now() - parsed.timestamp < 1000 * 60 * 30) {
            memoryGithubCache = parsed.data;
            setGithub(parsed.data);
            setGhLoading(false);
          }
        }
      } catch {}
    }

    if (!stats) {
      dashboardService.getDashboardStats()
        .then(data => {
          memoryStatsCache = data;
          setStats(data);
        })
        .finally(() => setLoading(false));
    }

    fetch('/api/github/contributions')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          memoryGithubCache = data;
          try {
            sessionStorage.setItem('portfolio_github_cache', JSON.stringify({ data, timestamp: Date.now() }));
          } catch {}
          setGithub(data);
        }
      })
      .finally(() => setGhLoading(false));
  }, []);

  return { stats, github, loading, ghLoading };
}
