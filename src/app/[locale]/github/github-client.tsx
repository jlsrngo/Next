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

export default function GithubClient({ profile }: { profile: any }) {
  const t = useTranslations()
  const [stats, setStats] = useState<any>(null)
  const [github, setGithub] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [ghLoading, setGhLoading] = useState(true)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))

    fetch('/api/github/contributions')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setGhLoading(false); return }
        setGithub(data)
        setGhLoading(false)
      })
      .catch(() => setGhLoading(false))
  }, [])

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
        <p className="text-black dark:text-white font-bold">{t('dashboard.subtitle')}</p>
      </div>

      {/* Portfolio Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-10 w-10 rounded-xl mb-4" />
              <div className="skeleton h-8 w-16 mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))
        ) : (
          statCards.map(card => (
            <div key={card.label} className="glass-card p-6 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
              </div>
              <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
              <p className="text-sm text-black dark:text-white font-black">{card.label}</p>
            </div>
          ))
        )}
      </div>

      {/* GitHub Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6 text-black dark:text-white" />
          <h2 className="text-2xl font-bold">{t('dashboard.github_activity')}</h2>
          {github && (
            <a
              href={`https://github.com/${github.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline ml-auto"
            >
              @{github.username}
            </a>
          )}
        </div>
      </div>

      {ghLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-4">
                <div className="skeleton h-5 w-5 rounded mb-3" />
                <div className="skeleton h-7 w-12 mb-1" />
                <div className="skeleton h-3 w-20" />
              </div>
            ))}
          </div>
          <div className="glass-card p-6">
            <div className="skeleton h-[120px] w-full rounded-lg" />
          </div>
        </div>
      ) : github ? (
        <div className="space-y-6">
          {/* GitHub Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ghStatCards.map(card => (
              <div key={card.label} className="glass-card p-4 transition-all duration-300">
                <card.icon className="w-5 h-5 mb-2" style={{ color: card.iconColor }} />
                <h4 className="text-2xl font-bold">{card.value.toLocaleString()}</h4>
                <p className="text-xs text-black dark:text-white mt-0.5 font-black">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Contribution Heatmap */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-black dark:text-white">
                {github.total_contributions.toLocaleString()} {t('dashboard.contributions_last_year')}
              </h3>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[720px]">
                {/* Month labels */}
                <div className="relative mb-1 ml-8 h-4">
                  {monthPositions.map((mp, i) => (
                    <span key={i} className="absolute text-[10px] text-black dark:text-white font-bold" style={{ left: `${mp.col * 14}px` }}>
                      {mp.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[2px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] pr-1 pt-0">
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                      <span key={i} className="text-[10px] text-black dark:text-white font-bold h-[12px] leading-[12px] flex items-center">
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
                          className={`w-[12px] h-[12px] rounded-[2px] ${levelColors[Math.min(Math.max(day.level ?? 0, 0), 4)] || levelColors[0]} transition-all duration-150 hover:ring-1 hover:ring-black/40 dark:hover:ring-white/50 cursor-pointer`}
                          onMouseEnter={(e) => handleCellHover(e, day)}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 mt-3">
                  <span className="text-[10px] text-zinc-500 mr-1 font-semibold">{t('dashboard.less')}</span>
                  {levelColors.map((color, i) => (
                    <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${color}`} />
                  ))}
                  <span className="text-[10px] text-zinc-500 ml-1 font-semibold">{t('dashboard.more')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          {github.top_languages.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-sm mb-4 text-black dark:text-white">{t('dashboard.top_languages')}</h3>
              <div className="space-y-3">
                {github.top_languages.map(lang => {
                  const maxCount = github.top_languages[0].count
                  const pct = (lang.count / maxCount) * 100
                  return (
                    <div key={lang.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }} />
                      <span className="text-sm w-24 flex-shrink-0">{lang.name}</span>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ backgroundColor: lang.color, width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-black dark:text-white font-bold w-12 text-right">
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
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-8 h-8 text-black dark:text-white mx-auto mb-3" />
          <p className="text-black dark:text-white font-bold text-sm">{t('dashboard.github_error')}</p>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
