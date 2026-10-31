'use client';

import { ExternalLink, Github, Star, Layout } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';

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

function TechBadge({ tech }: { tech: string }) {
    const { iconName } = getSkillIconData(tech);
    const IconComponent = loadIcon(iconName);

    return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-black border border-black dark:border-white rounded-none">
            {IconComponent && (
                <IconComponent className="w-3 h-3 text-black dark:text-white" />
            )}
            <span className="font-mono text-[9px] uppercase font-bold text-black dark:text-white">{tech}</span>
        </div>
    );
}

interface Project {
    id: number;
    title: string;
    description: string;
    image_url: string;
    live_url: string;
    github_url: string;
    tech_stack: string;
    featured: boolean;
    order_index: number;
}

interface ProjectsClientProps {
    projects: Project[];
    profile: any;
}

export default function ProjectsClient({ projects = [], profile }: ProjectsClientProps) {
    const t = useTranslations();
    const safeProjects = Array.isArray(projects) ? projects : [];

    return (
        <div className="py-6 md:py-10 space-y-10">
            {/* Header */}
            <div className="border-b border-black dark:border-white pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                    <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
                        [ 03 // PORTFOLIO WORKS ]
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
                        {t('projects.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
                        {t('projects.subtitle')}
                    </p>
                </div>
                <div className="font-mono text-[10px] font-bold text-black dark:text-white">
                    {safeProjects.length} PROJECTS DISPLAYED
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeProjects.map((project, i) => (
                    <div
                        key={project.id}
                        className="group relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] overflow-hidden flex flex-col rounded-none animate-fade-in shadow-none transition-all hover:bg-[#f2f1ed] dark:hover:bg-[#16171d]"
                        style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                    >
                        <CornerCrosses />

                        <div className="relative h-48 md:h-56 overflow-hidden bg-black/5 dark:bg-white/5 border-b border-black dark:border-white">
                            {project.image_url ? (
                                <img
                                    src={optimizeCloudinaryUrl(project.image_url || '')}
                                    alt={project.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Layout className="w-16 h-16 text-black dark:text-white" />
                                </div>
                            )}

                            {project.featured && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white font-mono text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current text-black dark:text-white" />
                                    <span>{t('featured') || 'FEATURED'}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-display text-xl font-bold text-black dark:text-white line-clamp-1">{project.title}</h3>
                                    <p className="text-black/80 dark:text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2 mt-1 font-sans">{project.description}</p>
                                </div>

                                {project.tech_stack && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {(Array.isArray(project.tech_stack)
                                            ? project.tech_stack
                                            : typeof project.tech_stack === 'string'
                                            ? project.tech_stack.split(',')
                                            : []
                                        ).map((tech: string, idx: number) => (
                                            <TechBadge key={idx} tech={String(tech).trim()} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-black dark:border-white">
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-wider font-bold transition-all hover:opacity-85"
                                    >
                                        <span>Live Demo</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono text-[10px] uppercase tracking-wider font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5"
                                    >
                                        <Github className="w-3 h-3" />
                                        <span>Code</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
