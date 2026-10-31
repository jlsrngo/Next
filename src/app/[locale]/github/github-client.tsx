'use client'

import { useEffect, useState, useMemo } from 'react'
import { FolderOpen, Trophy, Star, GitCommit, GitPullRequest, AlertCircle, Users, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/context/ThemeContext'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface GitHubData {
  total_contributions: number
  total_commits: number
  total_prs: number
  total_issues: number
  total_repos: number
  followers: number
  following: number
  weeks: ContributionDay[][]
  top_languages: { name: string; color: string; count: number }[]
  username: string
}

const MONO_LEVEL_COLORS = [
  'bg-slate-100 dark:bg-[#161b22] border border-slate-200/60 dark:border-white/[0.05]',
  'bg-slate-300 dark:bg-white/25',
  'bg-slate-400 dark:bg-white/50',
  'bg-slate-600 dark:bg-white/75',
  'bg-slate-900 dark:bg-white',
]

const ACCENT_LEVEL_COLORS = [
  'bg-slate-100 dark:bg-[#161b22] border border-slate-200/60 dark:border-white/[0.05]',
  'bg-[var(--accent)]/25 dark:bg-[var(--accent)]/30',
  'bg-[var(--accent)]/50 dark:bg-[var(--accent)]/55',
  'bg-[var(--accent)]/75 dark:bg-[var(--accent)]/80',
  'bg-[var(--accent)] dark:bg-[var(--accent)]',
]

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let memoryGithubCache: GitHubData | null = null
let memoryStatsCache: any = null

export default function GithubClient({ profile, initialStats }: { profile: any; initialStats?: any }) {
  const t = useTranslations()
  const [stats, setStats] = useState<any>(() => initialStats || memoryStatsCache || null)
  const [github, setGithub] = useState<GitHubData | null>(() => memoryGithubCache || null)
  const [loading, setLoading] = useState(() => !(initialStats || memoryStatsCache))
  const [ghLoading, setGhLoading] = useState(() => !memoryGithubCache)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    // 1. Restore from sessionStorage if in-memory cache is empty
    if (!github && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('portfolio_github_cache')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && parsed.data && Date.now() - parsed.timestamp < 1000 * 60 * 30) {
            memoryGithubCache = parsed.data
            setGithub(parsed.data)
            setGhLoading(false)
          }
        }
      } catch {}
    }

    if (initialStats) {
      memoryStatsCache = initialStats
      setStats(initialStats)
      setLoading(false)
    } else if (!stats) {
      fetch('/api/dashboard')
        .then(r => r.json())
        .then(data => {
          memoryStatsCache = data
          setStats(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    // Background stale-while-revalidate for GitHub data
    fetch('/api/github/contributions')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          if (!memoryGithubCache) setGhLoading(false)
          return
        }
        memoryGithubCache = data
        try {
          sessionStorage.setItem('portfolio_github_cache', JSON.stringify({ data, timestamp: Date.now() }))
        } catch {}
        setGithub(data)
        setGhLoading(false)
      })
      .catch(() => {
        if (!memoryGithubCache) setGhLoading(false)
      })
  }, [initialStats])

  const monthPositions = useMemo(() => {
    if (!github?.weeks) return []
    const positions: { label: string; col: number }[] = []
    let lastMonth = -1
    github.weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const month = new Date(week[0].date).getMonth()
        if (month !== lastMonth) {
          positions.push({ label: MONTH_LABELS[month], col: weekIndex })
          lastMonth = month
        }
      }
    })
    return positions
  }, [github])

  const { themeStyle } = useTheme()
  const isMono = themeStyle === 'monochrome'
  const levelColors = isMono ? MONO_LEVEL_COLORS : ACCENT_LEVEL_COLORS

  const statCards = [
    { label: t('dashboard.total_projects'), value: stats?.total_projects || 0, icon: FolderOpen, iconColor: isMono ? 'var(--accent)' : '#3b82f6', bg: isMono ? 'bg-black/5 dark:bg-white/5' : 'bg-blue-500/10' },
    { label: t('dashboard.featured_projects'), value: stats?.featured_projects || 0, icon: Star, iconColor: isMono ? 'var(--accent)' : '#f59e0b', bg: isMono ? 'bg-black/5 dark:bg-white/5' : 'bg-amber-500/10' },
    { label: t('dashboard.achievements'), value: stats?.total_achievements || 0, icon: Trophy, iconColor: 'var(--accent)', bg: isMono ? 'bg-black/5 dark:bg-white/5' : 'bg-accent/10' },
  ]

  const ghStatCards = github ? [
    { label: t('dashboard.contributions'), value: github.total_contributions, icon: GitCommit, iconColor: 'var(--accent)' },
    { label: t('dashboard.repositories'), value: github.total_repos, icon: FolderOpen, iconColor: isMono ? 'var(--accent)' : '#8b5cf6' },
    { label: t('dashboard.pull_requests'), value: github.total_prs, icon: GitPullRequest, iconColor: isMono ? 'var(--accent)' : '#3b82f6' },
    { label: t('dashboard.followers'), value: github.followers, icon: Users, iconColor: isMono ? 'var(--accent)' : '#ec4899' },
  ] : []

  const handleCellHover = (e: React.MouseEvent, day: ContributionDay) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const date = new Date(day.date).toLocaleDateString('id-ID', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    })
    const contributionText = day.count !== 1 ? t('dashboard.contributions_plural') : t('dashboard.contribution')
    setTooltip({
      text: `${day.count} ${contributionText} ${t('dashboard.on')} ${date}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }

  return (
    <div className="py-8 md:py-14 space-y-10">
      <div className="border-b border-line pb-4 animate-fade-in">
        <div className="hud-label mb-1">[ 04 // METRICS & ACTIVITY ]</div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink">{t('dashboard.title')}</h1>
        <p className="text-sm sm:text-base text-muted mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Portfolio Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="border border-line bg-bg-raised p-5 rounded-none animate-pulse">
              <div className="h-9 w-9 bg-bg-sunken rounded-none mb-3" />
              <div className="h-7 w-16 bg-bg-sunken rounded-none mb-2" />
              <div className="h-3 w-24 bg-bg-sunken rounded-none" />
            </div>
          ))
        ) : (
          statCards.map(card => (
            <div key={card.label} className="border border-line bg-bg-raised p-5 rounded-none transition-colors hover:border-line-strong">
              <div className="w-9 h-9 rounded-none border border-line bg-bg-sunken flex items-center justify-center mb-3">
                <card.icon className="w-4 h-4 text-ink" />
              </div>
              <h3 className="font-display text-3xl font-bold text-ink mb-1">{card.value}</h3>
              <p className="hud-label text-muted">{card.label}</p>
            </div>
          ))
        )}
      </div>

      {/* GitHub Section */}
      <div className="border-b border-line pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Github className="w-5 h-5 text-ink" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">{t('dashboard.github_activity')}</h2>
        </div>
        {github && (
          <a
            href={`https://github.com/${github.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hud-label text-accent hover:underline"
          >
            @{github.username}
          </a>
        )}
      </div>

      {ghLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border border-line bg-bg-raised p-4 rounded-none animate-pulse">
                <div className="h-5 w-5 bg-bg-sunken rounded-none mb-3" />
                <div className="h-6 w-12 bg-bg-sunken rounded-none mb-1" />
                <div className="h-3 w-20 bg-bg-sunken rounded-none" />
              </div>
            ))}
          </div>
          <div className="border border-line bg-bg-raised p-6 rounded-none">
            <div className="h-[120px] w-full bg-bg-sunken rounded-none animate-pulse" />
          </div>
        </div>
      ) : github ? (
        <div className="space-y-6">
          {/* GitHub Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ghStatCards.map(card => (
              <div key={card.label} className="border border-line bg-bg-raised p-4 rounded-none transition-colors hover:border-line-strong">
                <card.icon className="w-4 h-4 mb-2 text-faint" />
                <h4 className="font-display text-2xl font-bold text-ink">{card.value.toLocaleString()}</h4>
                <p className="hud-label text-muted mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Contribution Heatmap */}
          <div className="border border-line bg-bg-raised p-6 rounded-none">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <h3 className="hud-label text-ink">
                {github.total_contributions.toLocaleString()} {t('dashboard.contributions_last_year')}
              </h3>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[720px]">
                {/* Month labels */}
                <div className="relative mb-2 ml-8 h-4">
                  {monthPositions.map((mp, i) => (
                    <span key={i} className="absolute font-mono text-[10px] text-faint uppercase font-bold" style={{ left: `${mp.col * 14}px` }}>
                      {mp.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[2px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] pr-1 pt-0">
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                      <span key={i} className="font-mono text-[9px] text-faint uppercase font-bold h-[12px] leading-[12px] flex items-center">
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Weeks columns */}
                  {github.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`w-[12px] h-[12px] rounded-none ${levelColors[Math.min(Math.max(day.level ?? 0, 0), 4)] || levelColors[0]} transition-opacity hover:opacity-75 cursor-pointer`}
                          onMouseEnter={(e) => handleCellHover(e, day)}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-line">
                  <span className="hud-label text-faint mr-1">{t('dashboard.less')}</span>
                  {levelColors.map((color, i) => (
                    <div key={i} className={`w-[11px] h-[11px] rounded-none ${color}`} />
                  ))}
                  <span className="hud-label text-faint ml-1">{t('dashboard.more')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          {github.top_languages.length > 0 && (
            <div className="border border-line bg-bg-raised p-6 rounded-none">
              <h3 className="hud-label mb-4 text-ink border-b border-line pb-2">{t('dashboard.top_languages')}</h3>
              <div className="space-y-3">
                {github.top_languages.map(lang => {
                  const maxCount = github.top_languages[0].count
                  const pct = (lang.count / maxCount) * 100
                  return (
                    <div key={lang.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-none flex-shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="font-mono text-xs uppercase font-bold text-ink w-24 flex-shrink-0">{lang.name}</span>
                      <div className="flex-1 h-2 bg-bg-sunken border border-line rounded-none overflow-hidden">
                        <div
                          className="h-full rounded-none transition-all duration-700"
                          style={{ backgroundColor: lang.color, width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted font-bold w-16 text-right">
                        {lang.count} {lang.count !== 1 ? t('dashboard.repos') : t('dashboard.repo')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-line bg-bg-raised p-8 text-center rounded-none">
          <AlertCircle className="w-6 h-6 text-faint mx-auto mb-2" />
          <p className="font-mono text-xs uppercase text-muted font-bold">{t('dashboard.github_error')}</p>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-none border border-line bg-invert-bg text-invert-fg font-mono text-[11px] uppercase tracking-wider shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
