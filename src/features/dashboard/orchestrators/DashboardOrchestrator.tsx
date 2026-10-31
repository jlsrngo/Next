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

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip */}
      <TelemetryHeader
        systemCode="SYS // TELEMETRY [04]"
        coordinates="LAT: 0.7893° S · LON: 113.9213° E"
        spec={t('telemetry.dashboard_spec') || 'SPEC: REALTIME METRICS'}
        engine={t('telemetry.dashboard_engine') || 'EVENT STREAM SYNCED'}
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

      {/* Portfolio Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none animate-pulse">
              <CornerCrosses />
              <div className="h-9 w-9 bg-black/10 dark:bg-white/10 rounded-none mb-3" />
              <div className="h-7 w-16 bg-black/10 dark:bg-white/10 rounded-none mb-2" />
              <div className="h-3 w-24 bg-black/10 dark:bg-white/10 rounded-none" />
            </div>
          ))
        ) : (
          statCards.map((card) => (
            <MetricCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
          ))
        )}
      </div>

      {/* GitHub Section Header */}
      <div className="border-b border-line pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Github className="w-5 h-5 text-black dark:text-white" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">
            {t('dashboard.github_activity') || 'GitHub Activity'}
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-4 rounded-none animate-pulse">
                <CornerCrosses />
                <div className="h-5 w-5 bg-black/10 dark:bg-white/10 rounded-none mb-3" />
                <div className="h-6 w-12 bg-black/10 dark:bg-white/10 rounded-none mb-1" />
                <div className="h-3 w-20 bg-black/10 dark:bg-white/10 rounded-none" />
              </div>
            ))}
          </div>
          <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-6 rounded-none">
            <CornerCrosses />
            <div className="h-[120px] w-full bg-black/5 dark:bg-white/5 rounded-none animate-pulse" />
          </div>
        </div>
      ) : github ? (
        <div className="space-y-6">
          {/* GitHub Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ghStatCards.map((card) => (
              <MetricCard key={card.label} label={card.label} value={card.value.toLocaleString()} icon={card.icon} />
            ))}
          </div>

          {/* Contribution Heatmap using Palette */}
          <ContributionHeatmap github={github} />

          {/* Top Languages mapped to Sepidy Palette */}
          <TopLanguagesList languages={github.top_languages} />
        </div>
      ) : (
        <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-8 text-center rounded-none">
          <CornerCrosses />
          <AlertCircle className="w-6 h-6 text-black/40 dark:text-white/40 mx-auto mb-2" />
          <p className="font-mono text-xs uppercase text-black/70 dark:text-white/70 font-bold">
            {t('dashboard.github_error') || 'Failed to load GitHub activity'}
          </p>
        </div>
      )}
    </div>
  );
}
