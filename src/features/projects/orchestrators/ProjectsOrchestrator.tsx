import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import { useProjectsData } from '../hooks/useProjectsData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsOrchestrator() {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';
  const { projects, loading } = useProjectsData();

  const [contributionsCount, setContributionsCount] = useState<number>(() => {
    try {
      const cached = sessionStorage.getItem('portfolio_github_cache_v3');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed?.data?.total_contributions || parsed?.data?.total_commits || 1993;
      }
    } catch {}
    return 1993;
  });

  useEffect(() => {
    fetch('/api/github/contributions')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .catch(() => fetch('/github-contributions.json').then((r) => r.json()))
      .then((data) => {
        if (data?.total_contributions || data?.total_commits) {
          setContributionsCount(data.total_contributions || data.total_commits);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic Repository Status from Neon DB
  const dynamicRepository = isId
    ? `REPOSITORI: ${projects.length} PROYEK`
    : `REPOSITORY: ${projects.length} PROJECTS`;

  const dynamicSpec = isId
    ? `SPES: ${projects.length} DEPLOY`
    : `SPEC: ${projects.length} DEPLOYS`;

  const formattedCount = contributionsCount.toLocaleString(isId ? 'id-ID' : 'en-US');
  const dynamicEngine = isId ? `${formattedCount} KONTRIBUSI` : `${formattedCount} CONTRIBUTIONS`;

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip with Live GitHub Activity */}
      <TelemetryHeader
        systemCode="SYS // ARCHIVE [04]"
        coordinates={dynamicRepository}
        spec={dynamicSpec}
        engine={dynamicEngine}
        liveFeed="github"
      />

      {/* Header */}
      <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            {isId ? '[ 03 // KARYA PORTOFOLIO ]' : '[ 03 // PORTFOLIO WORKS ]'}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
            {t('projects.title') || 'Projects'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('projects.subtitle') || 'A selection of things I have built, open-source projects, and client work.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {projects.length} {t('projects.repositories_indexed') || 'REPOSITORIES INDEXED'}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 border border-line bg-black/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
