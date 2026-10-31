'use client';

import { useRef } from 'react';
import SkillIcon from '@/components/SkillIcon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, Cpu } from 'lucide-react';

interface Profile {
    name: string;
    location: string | null;
    work_status: string | null;
    bio_home: string | null;
    avatar_url: string | null;
}

interface Skill {
    id: number | string;
    name: string;
    iconName: string | null;
    category: string;
}

interface HomeClientProps {
    profile: Profile | null;
    skills: Skill[];
}

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'Mobile', 'Database', 'Tools & DevOps', 'Cloud', 'AI'];

function CornerCrosses() {
    return (
        <>
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] leading-none text-faint select-none pointer-events-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] leading-none text-faint select-none pointer-events-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] leading-none text-faint select-none pointer-events-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] leading-none text-faint select-none pointer-events-none">+</span>
        </>
    );
}

function SkillItem({ skill, index }: { skill: Skill; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const iconSlug = (skill as any).iconName || (skill as any).icon || (skill as any).icon_name || skill.name;

    return (
        <div
            ref={ref}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 25, 500)}ms`, animationFillMode: 'both' }}
        >
            <SkillIcon
                name={skill.name}
                iconSlug={iconSlug}
            />
        </div>
    );
}

export default function HomeClient({ profile, skills }: HomeClientProps) {
    const t = useTranslations();

    const grouped = CATEGORY_ORDER
        .map(cat => ({
            category: cat,
            items: skills.filter(s => s.category === cat),
        }))
        .filter(g => g.items.length > 0);

    const uncategorized = skills.filter(s => !CATEGORY_ORDER.includes(s.category));
    if (uncategorized.length > 0) {
        grouped.push({ category: 'Other', items: uncategorized });
    }

    return (
        <div className="py-6 md:py-10 space-y-10 relative">
            {/* Top Telemetry Strip */}
            <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-[10px] tracking-widest text-faint uppercase select-none">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent animate-pulse inline-block" />
                    <span className="text-ink font-bold">SYS // CORE [01]</span>
                    <span className="text-line">|</span>
                    <span className="hidden sm:inline text-muted">LAT: 0.7893° S · LON: 113.9213° E</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="hidden md:inline">SPEC: INDEPENDENT ENGINEERING</span>
                    <span className="text-line hidden md:inline">|</span>
                    <span className="text-accent font-semibold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-accent inline" />
                        <span>RUST AXUM 0.7</span>
                    </span>
                </div>
            </div>

            {/* Hero / Introduction Header Box with Crosshairs */}
            <div className="relative border border-line bg-bg-raised/70 p-6 sm:p-10 backdrop-blur-[1px] space-y-6">
                <CornerCrosses />

                {/* Sub-header spec line */}
                <div className="flex items-center justify-between font-mono text-[9px] text-faint border-b border-line pb-2.5 select-none">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-accent" />
                        <span className="text-ink font-bold">[ 01 // OVERVIEW ]</span>
                        <span className="hidden sm:inline text-muted">· FULLSTACK & SYSTEMS ARCHITECTURE</span>
                    </div>
                    <span className="tracking-widest">FIG. 01.A // 2026</span>
                </div>

                <div className="space-y-4">
                    <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-ink">
                        {t('home.greeting')}{' '}
                        <span className="font-serif italic font-normal text-ink-strong">
                            {profile?.name || '...'}
                        </span>
                    </h1>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted pt-2 border-b border-line pb-4 w-full">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-faint">•</span>
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.work_status && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-faint">•</span>
                                <span>{profile.work_status}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 ml-auto text-[10px] text-faint hidden sm:flex">
                            <span className="w-1.5 h-1.5 bg-accent inline-block" />
                            <span>RUST ENGINE ONLINE</span>
                        </div>
                    </div>
                </div>

                <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed whitespace-pre-wrap">
                    {profile?.bio_home || '...'}
                </p>

                {/* ArtCraft Signature Actions with Brutalist Framing */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href="/projects" className="btn-primary group relative">
                        <span className="flex items-center gap-2">
                            <span>Explore Projects</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </Link>
                    <Link href="/contact" className="btn-secondary group relative">
                        <span className="flex items-center gap-2">
                            <span>Get in Touch</span>
                            <span className="text-faint font-mono text-[10px] group-hover:text-accent transition-colors">[→]</span>
                        </span>
                    </Link>
                </div>
            </div>

            {/* Technical Notched Divider */}
            <div className="relative flex items-center my-8 sm:my-12 select-none">
                <div className="flex-grow border-t border-line"></div>
                <div className="flex-shrink mx-4 font-mono text-[10px] uppercase tracking-[0.25em] text-faint flex items-center gap-2">
                    <span className="text-accent">+</span>
                    <span>SEC.02 // ARSENAL MATRIX</span>
                    <span className="text-accent">+</span>
                </div>
                <div className="flex-grow border-t border-line"></div>
            </div>

            {/* Tech Arsenal Section */}
            {grouped.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-line pb-3 flex items-end justify-between">
                        <div>
                            <div className="hud-label mb-1">[ 02 // TECH ARSENAL ]</div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
                                {t('home.skills_title')}
                            </h2>
                        </div>
                        <div className="text-right hidden sm:block font-mono text-[10px] text-faint">
                            <span className="text-accent font-bold">{skills.length}</span> TECHNOLOGIES INDEXED
                        </div>
                    </div>

                    <div className="space-y-6">
                        {grouped.map((group, groupIdx) => (
                            <div key={group.category} className="relative border border-line bg-bg-raised/70 p-5 sm:p-7 backdrop-blur-[1px]">
                                <CornerCrosses />
                                <div className="hud-label mb-5 border-b border-line pb-2.5 flex items-center justify-between text-faint">
                                    <span className="flex items-center gap-2 text-ink">
                                        <span className="w-1.5 h-1.5 bg-accent" />
                                        <span className="font-bold tracking-wider">{group.category.toUpperCase()}</span>
                                    </span>
                                    <span className="font-mono text-[9px] tracking-widest text-faint">
                                        FIG. 02.{groupIdx + 1} // {String(group.items.length).padStart(2, '0')} ITEMS
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                                    {group.items.map((skill, idx) => (
                                        <SkillItem key={skill.id} skill={skill} index={idx} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
