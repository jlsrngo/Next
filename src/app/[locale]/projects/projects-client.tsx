'use client';

import { ExternalLink, Github, Star, Layout } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';
import { useTheme } from '@/context/ThemeContext';

function TechBadge({ tech }: { tech: string }) {
    const { themeStyle } = useTheme();
    const isMonochrome = themeStyle === 'monochrome';
    const { iconName, brandColor } = getSkillIconData(tech);
    const IconComponent = loadIcon(iconName);
    const isWhite = brandColor?.toLowerCase() === '#ffffff' || brandColor?.toLowerCase() === 'white';

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-zinc-700 transition-transform duration-300 hover:scale-110" title={tech}>
                {IconComponent ? (
                    <IconComponent
                        className={`w-6 h-6 ${isMonochrome || isWhite ? 'text-black dark:text-white' : ''}`}
                        style={{ color: isMonochrome || isWhite ? undefined : brandColor }}
                    />
                ) : (
                    <div className="w-6 h-6 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                )}
            </div>
            <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 text-center max-w-[56px] truncate">{tech}</span>
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

export default function ProjectsClient({ projects, profile }: ProjectsClientProps) {
    const t = useTranslations();

    return (
        <div className="py-12 md:py-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold flex items-center gap-3">
                        <Layout className="w-8 h-8 text-accent" /> {t('projects.title')}
                    </h1>
                    <p className="text-lg text-black dark:text-white font-bold max-w-xl">
                        {t('projects.subtitle')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="group relative glass-card border border-slate-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-700 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-[420px] md:h-[480px] animate-fade-in-up"
                        style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                    >
                        <div className="relative h-48 md:h-60 overflow-hidden bg-slate-100 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-zinc-800">
                            {project.image_url ? (
                                <img
                                    src={optimizeCloudinaryUrl(project.image_url || '')}
                                    alt={project.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Layout className="w-20 h-20 text-zinc-400" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {project.featured && (
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-900/90 dark:bg-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                                    <Star className="w-3.5 h-3.5 fill-zinc-300 text-zinc-300" /> {t('featured')}
                                </div>
                            )}
                        </div>

                        <div className="p-5 md:p-7 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-zinc-200 transition-colors line-clamp-1">{project.title}</h3>
                                    <p className="text-zinc-700 dark:text-zinc-300 font-semibold text-xs md:text-sm leading-relaxed line-clamp-3">{project.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    {(() => {
                                        let techs: string[] = [];
                                        try {
                                            const parsed = JSON.parse(project.tech_stack || '[]');
                                            techs = Array.isArray(parsed) ? parsed : [];
                                        } catch {
                                            techs = (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);
                                        }
                                        return techs.map((tech, i) => (
                                            <TechBadge key={i} tech={tech} />
                                        ));
                                    })()}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-zinc-800 mt-6">
                                {project.live_url && (() => {
                                    const isArunaki = project.title.toLowerCase().includes('arunaki') || project.live_url?.includes('arunaki');
                                    return (
                                        <a
                                            href={project.live_url}
                                            target={project.live_url.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs font-bold transition-all group/btn"
                                        >
                                            <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> {isArunaki ? 'Web Arunaki' : (t('projects.view_live') || 'Demo')}
                                        </a>
                                    );
                                })()}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs font-bold transition-all group/btn text-zinc-900 dark:text-zinc-100"
                                    >
                                        <Github className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> {t('code')}
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
