import React from 'react';
import { FolderOpen, Star, Trophy, GitCommit, GitPullRequest, Users, Github, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDashboardData } from '../hooks/useDashboardData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import MetricCard from '../components/MetricCard';
import ContributionHeatmap from '../components/ContributionHeatmap';
import TopLanguagesList from '../components/TopLanguagesList';
import CornerCrosses from '@/components/ui/CornerCrosses';

export default function DashboardOrchestrator() {
  const t = useTranslations();
  const { stats, github, loading, ghLoading } = useDashboardData();

  const statCards = [
    { label: t('dashboard.total_projects') || 'Total Projects', value: stats?.total_projects || 0, icon: FolderOpen },
    { label: t('dashboard.featured_projects') || 'Featured Projects', value: stats?.featured_projects || 0, icon: Star },
    { label: t('dashboard.achievements') || 'Achievements', value: stats?.total_achievements || 0, icon: Trophy },
  ];

  const ghStatCards = github ? [
    { label: t('dashboard.contributions') || 'Contributions', value: github.total_contributions, icon: GitCommit },
    { label: t('dashboard.repositories') || 'Repositories', value: github.total_repos, icon: FolderOpen },
    { label: t('dashboard.pull_requests') || 'Pull Requests', value: github.total_prs, icon: GitPullRequest },
    { label: t('dashboard.followers') || 'Followers', value: github.followers, icon: Users },
  ] : [];

  const dynamicSpec = `SPEC: ${stats?.total_projects || 0} REPOS · ${stats?.total_achievements || 0} AWARDS`;

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip with Tokio Daemon & Database Metrics */}
      <TelemetryHeader
        systemCode="SYS // TELEMETRY [05]"
        coordinates="NODE: TOKIO NATIVE DAEMON · 0ms COLD START"
        spec={dynamicSpec}
        engine="RUST AXUM 0.7 · TOKIO DAEMON"
        liveFeed="status"
      />

      {/* Header */}
      <div className="border-b border-line pb-4 animate-fade-in">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
          [ 04 // METRICS & ACTIVITY ]
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
          {t('dashboard.title') || 'Dashboard'}
        </h1>
        <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">
          {t('dashboard.subtitle') || 'Overview of technical activities, metrics, and achievements.'}
        </p>
      </div>

      {/* Database Metrics Grid */}
      <div className="space-y-3">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70">
          [ 01 // SYSTEM & DATABASE TELEMETRY ]
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <MetricCard key={i} stat={stat} loading={loading} />
          ))}
        </div>
      </div>

      {/* GitHub Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70">
            [ 02 // GITHUB TELEMETRY ]
          </div>
          {github?.updated_at && (
            <div className="font-mono text-[10px] text-black/70 dark:text-white/70">
              SYNCED: {new Date(github.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {ghLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 border border-line bg-black/5 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : ghStatCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ghStatCards.map((stat, i) => (
              <MetricCard key={i} stat={stat} loading={false} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Contribution Heatmap */}
      {github && <ContributionHeatmap weeks={github.contribution_calendar} />}

      {/* Top Languages */}
      {github?.top_languages && github.top_languages.length > 0 && (
        <TopLanguagesList languages={github.top_languages} />
      )}
    </div>
  );
}
