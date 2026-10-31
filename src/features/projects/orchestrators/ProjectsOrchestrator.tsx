import React from 'react';
import { useTranslations } from 'next-intl';
import { useProjectsData } from '../hooks/useProjectsData';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsOrchestrator() {
  const t = useTranslations();
  const { projects, loading } = useProjectsData();

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-black dark:border-white pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            [ 03 // PORTFOLIO WORKS ]
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
            {t('projects.title') || 'Projects'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('projects.subtitle') || 'A selection of my professional work and personal projects.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {projects.length} PROJECTS DISPLAYED
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
