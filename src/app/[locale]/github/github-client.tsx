'use client';

import { useEffect, useState, useMemo } from 'react';
import { FolderOpen, Trophy, Star, GitCommit, GitPullRequest, AlertCircle, Users, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { HEATMAP_PALETTE, getLanguageColor } from '@/constants/palette';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubData {
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

function CornerCrosses() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
    </>
  );
}

// Monochrome fallback progression
const MONO_LEVEL_CLASSES = [
  'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10',
  'bg-[#d0cfc8] dark:bg-[#32343d]',
  'bg-[#9d9c94] dark:bg-[#606370]',
  'bg-[#52514c] dark:bg-[#9a9db0]',
  'bg-[#101014] dark:bg-[#ffffff]',
];

// Color palette heatmap progression from user's Sepidy green column
const PALETTE_LEVEL_STYLES = [
  { backgroundColor: undefined }, // empty, handles by CSS
  { backgroundColor: HEATMAP_PALETTE.level1 }, // #B5D2AD
  { backgroundColor: HEATMAP_PALETTE.level2 }, // #BAFCA2
  { backgroundColor: HEATMAP_PALETTE.level3 }, // #90EE90
  { backgroundColor: HEATMAP_PALETTE.level4 }, // #7FBC8C
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let memoryGithubCache: GitHubData | null = null;
let memoryStatsCache: any = null;

export default function GithubClient({ profile, initialStats }: { profile: any; initialStats?: any }) {
  const t = useTranslations();
  const [stats, setStats] = useState<any>(() => initialStats || memoryStatsCache || null);
  const [github, setGithub] = useState<GitHubData | null>(() => memoryGithubCache || null);
  const [loading, setLoading] = useState(() => !(initialStats || memoryStatsCache));
  const [ghLoading, setGhLoading] = useState(() => !memoryGithubCache);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('portfolio_github_cache');
        sessionStorage.removeItem('portfolio_github_cache_v2');
        const stored = sessionStorage.getItem('portfolio_github_cache_v4');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.data && Date.now() - parsed.timestamp < 1000 * 60 * 15) {
            memoryGithubCache = parsed.data;
            setGithub(parsed.data);
            setGhLoading(false);
          }
        }
      } catch {}
    }

    if (initialStats) {
      memoryStatsCache = initialStats;
      setStats(initialStats);
      setLoading(false);
    } else if (!stats) {
      fetch('/api/dashboard')
        .then(r => r.json())
        .then(data => {
          memoryStatsCache = data;
          setStats(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    fetch('/github-contributions.json')
      .then(r => {
        if (!r.ok) return fetch('/api/github/contributions').then(res => res.json());
        return r.json();
      })
      .then(data => {
        if (data.error) {
          if (!memoryGithubCache) setGhLoading(false);
          return;
        }
        memoryGithubCache = data;
        try {
          sessionStorage.setItem('portfolio_github_cache_v4', JSON.stringify({ data, timestamp: Date.now() }));
        } catch {}
        setGithub(data);
        setGhLoading(false);
      })
      .catch(() => {
        if (!memoryGithubCache) setGhLoading(false);
      });
  }, [initialStats]);

  const monthPositions = useMemo(() => {
    if (!github?.weeks) return [];
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    github.weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const month = new Date(week[0].date).getMonth();
        if (month !== lastMonth) {
          positions.push({ label: MONTH_LABELS[month], col: weekIndex });
          lastMonth = month;
        }
      }
    });
    return positions;
  }, [github]);

  const { themeStyle } = useTheme();
  const isMono = themeStyle === 'monochrome';

  const statCards = [
    { label: t('dashboard.total_projects'), value: stats?.total_projects || 0, icon: FolderOpen },
    { label: t('dashboard.featured_projects'), value: stats?.featured_projects || 0, icon: Star },
    { label: t('dashboard.achievements'), value: stats?.total_achievements || 0, icon: Trophy },
  ];

  const ghStatCards = github ? [
    { label: t('dashboard.contributions'), value: github.total_contributions, icon: GitCommit },
    { label: t('dashboard.repositories'), value: github.total_repos, icon: FolderOpen },
    { label: t('dashboard.pull_requests'), value: github.total_prs, icon: GitPullRequest },
    { label: t('dashboard.followers'), value: github.followers, icon: Users },
  ] : [];

  const handleCellHover = (e: React.MouseEvent, day: ContributionDay) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const date = new Date(day.date).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
    const contributionText = day.count !== 1 ? t('dashboard.contributions_plural') : t('dashboard.contribution');
    setTooltip({
      text: `${day.count} ${contributionText} ${t('dashboard.on')} ${date}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-black dark:border-white pb-4 animate-fade-in">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
          [ 04 // METRICS & ACTIVITY ]
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Portfolio Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none animate-pulse">
              <CornerCrosses />
              <div className="h-9 w-9 bg-black/10 dark:bg-white/10 rounded-none mb-3" />
              <div className="h-7 w-16 bg-black/10 dark:bg-white/10 rounded-none mb-2" />
              <div className="h-3 w-24 bg-black/10 dark:bg-white/10 rounded-none" />
            </div>
          ))
        ) : (
          statCards.map(card => (
            <div key={card.label} className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none shadow-none">
              <CornerCrosses />
              <div className="w-9 h-9 rounded-none border border-black dark:border-white bg-white dark:bg-black flex items-center justify-center mb-3">
                <card.icon className="w-4 h-4 text-black dark:text-white" />
              </div>
              <h3 className="font-display text-3xl font-bold text-black dark:text-white mb-1">{card.value}</h3>
              <p className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60">{card.label}</p>
            </div>
          ))
        )}
      </div>

      {/* GitHub Section Header */}
      <div className="border-b border-black dark:border-white pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Github className="w-5 h-5 text-black dark:text-white" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">
            {t('dashboard.github_activity')}
          </h2>
        </div>
        {github && (
          <a
            href={`https://github.com/${github.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-bold text-black dark:text-white hover:underline uppercase"
          >
            @{github.username}
          </a>
        )}
      </div>

      {ghLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-4 rounded-none animate-pulse">
                <CornerCrosses />
                <div className="h-5 w-5 bg-black/10 dark:bg-white/10 rounded-none mb-3" />
                <div className="h-6 w-12 bg-black/10 dark:bg-white/10 rounded-none mb-1" />
                <div className="h-3 w-20 bg-black/10 dark:bg-white/10 rounded-none" />
              </div>
            ))}
          </div>
          <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none">
            <CornerCrosses />
            <div className="h-[120px] w-full bg-black/5 dark:bg-white/5 rounded-none animate-pulse" />
          </div>
        </div>
      ) : github ? (
        <div className="space-y-6">
          {/* GitHub Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ghStatCards.map(card => (
              <div key={card.label} className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-4 rounded-none shadow-none">
                <CornerCrosses />
                <card.icon className="w-4 h-4 mb-2 text-black/60 dark:text-white/60" />
                <h4 className="font-display text-2xl font-bold text-black dark:text-white">{card.value.toLocaleString()}</h4>
                <p className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Contribution Heatmap */}
          <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none shadow-none">
            <CornerCrosses />
            <div className="flex items-center justify-between mb-4 border-b border-black dark:border-white pb-3">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">
                {github.total_contributions.toLocaleString()} {t('dashboard.contributions_last_year')}
              </h3>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[720px]">
                {/* Month labels */}
                <div className="relative mb-2 ml-8 h-4">
                  {monthPositions.map((mp, i) => (
                    <span key={i} className="absolute font-mono text-[10px] text-black/60 dark:text-white/60 uppercase font-bold" style={{ left: `${mp.col * 14}px` }}>
                      {mp.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[2px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] pr-1 pt-0">
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                      <span key={i} className="font-mono text-[9px] text-black/60 dark:text-white/60 uppercase font-bold h-[12px] leading-[12px] flex items-center">
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Weeks columns */}
                  <div className="flex gap-[2px]">
                    {github.weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[2px]">
                        {week.map((day, di) => {
                          const level = Math.min(Math.max(day.level ?? 0, 0), 4);
                          const isEmpty = level === 0;

                          return (
                            <div
                              key={di}
                              className={`w-[12px] h-[12px] rounded-none transition-opacity hover:opacity-75 cursor-pointer ${
                                isMono
                                  ? MONO_LEVEL_CLASSES[level]
                                  : isEmpty
                                  ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10'
                                  : 'border border-black/15'
                              }`}
                              style={!isMono && !isEmpty ? { backgroundColor: PALETTE_LEVEL_STYLES[level].backgroundColor } : undefined}
                              onMouseEnter={(e) => handleCellHover(e, day)}
                              onMouseLeave={() => setTooltip(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-black dark:border-white">
                  <span className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60 mr-1">{t('dashboard.less')}</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-[11px] h-[11px] rounded-none ${
                        isMono
                          ? MONO_LEVEL_CLASSES[level]
                          : level === 0
                          ? 'bg-[#e9e8e4] dark:bg-[#1b1c21] border border-black/10 dark:border-white/10'
                          : 'border border-black/15'
                      }`}
                      style={!isMono && level > 0 ? { backgroundColor: PALETTE_LEVEL_STYLES[level].backgroundColor } : undefined}
                    />
                  ))}
                  <span className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60 ml-1">{t('dashboard.more')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Languages mapped strictly to User Sepidy Palette */}
          {github.top_languages.length > 0 && (
            <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none shadow-none">
              <CornerCrosses />
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-black dark:text-white mb-4 border-b border-black dark:border-white pb-2">
                {t('dashboard.top_languages')}
              </h3>
              <div className="space-y-3">
                {github.top_languages.map(lang => {
                  const maxCount = github.top_languages[0].count;
                  const pct = (lang.count / maxCount) * 100;
                  const mappedColor = getLanguageColor(lang.name);

                  return (
                    <div key={lang.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-none flex-shrink-0 border border-black/20"
                        style={{ backgroundColor: mappedColor }}
                      />
                      <span className="font-mono text-xs uppercase font-bold text-black dark:text-white w-28 flex-shrink-0">
                        {lang.name}
                      </span>
                      <div className="flex-1 h-2.5 bg-black/5 dark:bg-white/5 border border-black dark:border-white rounded-none overflow-hidden">
                        <div
                          className="h-full rounded-none transition-all duration-700"
                          style={{ backgroundColor: mappedColor, width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-black/70 dark:text-white/70 font-bold w-16 text-right">
                        {lang.count} {lang.count !== 1 ? t('dashboard.repos') : t('dashboard.repo')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-8 text-center rounded-none">
          <CornerCrosses />
          <AlertCircle className="w-6 h-6 text-black/40 dark:text-white/40 mx-auto mb-2" />
          <p className="font-mono text-xs uppercase text-black/70 dark:text-white/70 font-bold">
            {t('dashboard.github_error')}
          </p>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-none border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-mono text-[11px] uppercase tracking-wider shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
