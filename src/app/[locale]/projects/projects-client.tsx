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
        <div className="flex items-center gap-1.5 px-2 py-1 bg-bg-sunken border border-line rounded-none">
            {IconComponent ? (
                <IconComponent
                    className={`w-3.5 h-3.5 ${isMonochrome || isWhite ? 'text-ink' : ''}`}
                    style={{ color: isMonochrome || isWhite ? undefined : brandColor }}
                />
            ) : null}
            <span className="font-mono text-[10px] uppercase font-bold text-ink">{tech}</span>
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
        <div className="py-8 md:py-16 space-y-10">
            <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                    <div className="hud-label">[ 03 // PORTFOLIO WORKS ]</div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink flex items-center gap-3">
                        {t('projects.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-muted max-w-xl">
                        {t('projects.subtitle')}
                    </p>
                </div>
                <div className="hud-label">
                    {projects.length} PROJECTS DISPLAYED
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="group relative border border-line bg-bg-raised overflow-hidden flex flex-col rounded-none animate-fade-in hover:border-line-strong transition-colors"
                        style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                    >
                        <div className="relative h-48 md:h-56 overflow-hidden bg-bg-sunken border-b border-line">
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
                                    <Layout className="w-16 h-16 text-muted" />
                                </div>
                            )}

                            {project.featured && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-bg-raised border border-line text-ink font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current text-accent" /> {t('featured')}
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-display text-xl font-bold text-ink line-clamp-1">{project.title}</h3>
                                    <p className="text-muted text-xs sm:text-sm leading-relaxed line-clamp-2 mt-1">{project.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {(() => {
                                        let techs: string[] = [];
                                        if (Array.isArray(project.tech_stack)) {
                                            techs = project.tech_stack;
                                        } else {
                                            try {
                                                const parsed = JSON.parse(project.tech_stack || '[]');
                                                techs = Array.isArray(parsed) ? parsed : [];
                                            } catch {
                                                techs = String(project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);
                                            }
                                        }
                                        return techs.map((tech, i) => (
                                            <TechBadge key={i} tech={tech} />
                                        ));
                                    })()}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-line mt-4">
                                {project.live_url && (() => {
                                    const isArunaki = project.title.toLowerCase().includes('arunaki') || project.live_url?.includes('arunaki');
                                    return (
                                        <a
                                            href={project.live_url}
                                            target={project.live_url.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            className="btn-primary flex-1 h-9 !text-[10px]"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" /> {isArunaki ? 'Arunaki App' : (t('projects.view_live') || 'Demo')}
                                        </a>
                                    );
                                })()}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary flex-1 h-9 !text-[10px]"
                                    >
                                        <Github className="w-3.5 h-3.5" /> {t('code')}
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
