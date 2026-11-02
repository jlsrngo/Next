import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Edit3, Trash2, Loader2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';
import type { Project } from '@/types/project.types';

export interface ProjectAdminCardProps {
  project: Project;
  index: number;
  techList: string[];
  isDeleting: boolean;
  onDelete: (id: string | number, title: string) => void;
}

function ProjectAdminCardComponent({
  project,
  index,
  techList,
  isDeleting,
  onDelete,
}: ProjectAdminCardProps) {
  const locale = useLocale();
  const isId = locale === 'id';
  const github = project.githubUrl ?? project.github_url;
  const live = project.liveUrl ?? project.live_url;
  const ordStr = String(project.order ?? index).padStart(2, '0');

  return (
    <article
      className="border border-line bg-bg-raised p-4 sm:p-5 relative transition-all hover:border-line-strong group"
      aria-label={`Project: ${project.title}`}
    >
      <CornerCrosses />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Info Section */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-faint tracking-wider">
              [{ordStr}]
            </span>
            <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
              {project.title}
            </h3>
            {project.featured && (
              <span className="border border-line bg-bg px-2 py-0.5 text-[9px] uppercase font-bold font-mono text-ink">
                ★ {isId ? 'UNGGULAN' : 'FEATURED'}
              </span>
            )}
            <span
              className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold font-mono border ${
                project.featured
                  ? 'border-line bg-invert-bg text-invert-fg'
                  : 'border-line bg-bg text-faint'
              }`}
            >
              {project.featured ? (isId ? 'PRIORITAS' : 'PRIORITY') : (isId ? 'TERINDEKS' : 'INDEXED')}
            </span>
          </div>

          {project.description && (
            <p className="text-faint text-xs leading-relaxed font-sans line-clamp-2">
              {project.description}
            </p>
          )}

          {techList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {techList.map((t) => (
                <span
                  key={t}
                  className="border border-line bg-bg px-2 py-0.5 font-mono text-[10px] uppercase text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center border-t lg:border-t-0 border-line pt-3 lg:pt-0 w-full lg:w-auto justify-end">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-line bg-bg hover:bg-bg-sunken text-ink transition-all"
              title={isId ? 'Lihat Repositori GitHub' : 'View GitHub Repository'}
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github size={13} />
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-line bg-bg hover:bg-bg-sunken text-ink transition-all"
              title={isId ? 'Lihat Penerapan Live' : 'View Live Deployment'}
              aria-label={`Live site for ${project.title}`}
            >
              <ExternalLink size={13} />
            </a>
          )}
          <Link
            to={`/admin/projects/${project.id}/edit`}
            className="flex items-center gap-1.5 border border-line bg-bg hover:bg-bg-sunken px-3 py-1.5 font-mono text-xs uppercase font-bold text-ink transition-all"
            aria-label={`Edit ${project.title}`}
          >
            <Edit3 size={12} />
            <span>{isId ? 'EDIT' : 'EDIT'}</span>
          </Link>
          <button
            type="button"
            onClick={() => onDelete(project.id, project.title)}
            disabled={isDeleting}
            className="p-2 border border-line bg-bg hover:bg-red-500/10 hover:border-red-500 text-faint hover:text-red-500 transition-all disabled:opacity-50"
            title={isId ? 'Hapus Proyek' : 'Delete Project'}
            aria-label={`Delete ${project.title}`}
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProjectAdminCard = React.memo(ProjectAdminCardComponent);
export default ProjectAdminCard;
