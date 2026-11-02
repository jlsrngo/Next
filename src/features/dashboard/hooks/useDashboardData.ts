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
  updated_at?: string;
}

let memoryGithubCache: GitHubData | null = null;
let memoryStatsCache: any = null;

export function useDashboardData() {
  const [stats, setStats] = useState<any>(() => memoryStatsCache || null);
  const [github, setGithub] = useState<GitHubData | null>(() => memoryGithubCache || null);
  const [loading, setLoading] = useState<boolean>(() => !memoryStatsCache);
  const [ghLoading, setGhLoading] = useState<boolean>(() => !memoryGithubCache);

  useEffect(() => {
    // Check cached session
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('portfolio_github_cache');
        const stored = sessionStorage.getItem('portfolio_github_cache_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.data?.weeks && Date.now() - parsed.timestamp < 1000 * 60 * 3) {
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

    // Fetch live contributions dataset from backend API
    fetch('/api/github/contributions')
      .then(r => {
        if (!r.ok) throw new Error('API failed');
        return r.json();
      })
      .then(data => {
        if (data && data.weeks) {
          memoryGithubCache = data;
          try {
            sessionStorage.setItem('portfolio_github_cache_v3', JSON.stringify({ data, timestamp: Date.now() }));
          } catch {}
          setGithub(data);
        }
      })
      .catch(() => {
        // Fallback to static file if API fails
        return fetch('/github-contributions.json')
          .then(r => r.json())
          .then(data => {
            if (data && data.weeks) {
              memoryGithubCache = data;
              setGithub(data);
            }
          });
      })
      .catch(() => {})
      .finally(() => setGhLoading(false));
  }, []);

  return { stats, github, loading, ghLoading };
}
