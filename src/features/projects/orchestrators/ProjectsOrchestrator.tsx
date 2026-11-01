import React from 'react';
import { useTranslations } from 'next-intl';
import { useProjectsData } from '../hooks/useProjectsData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsOrchestrator() {
  const t = useTranslations();
  const { projects, profile, loading } = useProjectsData();

  const projectSpec = projects.length > 0
    ? `SPEC: ${projects.length} PRODUCTION DEPLOYMENTS`
    : 'SPEC: PRODUCTION DEPLOYMENTS';

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip with Live GitHub Activity */}
      <TelemetryHeader
        systemCode="SYS // ARCHIVE [04]"
        coordinates={profile?.location ? `LOC: ${profile.location.toUpperCase()} · REGISTRY ONLINE` : 'LAT: 0.7893° S · LON: 113.9213° E'}
        spec={projectSpec}
        engine={t('telemetry.projects_engine') || '1,957 COMMITS ACTIVE'}
        liveFeed="github"
      />

      {/* Header */}
      <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            [ 03 // PORTFOLIO WORKS ]
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
            {t('projects.title') || 'Projects'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('projects.subtitle') || 'A selection of things I have built, open-source projects, and client work.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {projects.length} {projects.length === 1 ? 'PROJECT' : 'PROJECTS'} INDEXED
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
