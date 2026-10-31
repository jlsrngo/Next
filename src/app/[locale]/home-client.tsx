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
            <span className="absolute -top-2 -left-2 font-mono text-xs font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
            <span className="absolute -top-2 -right-2 font-mono text-xs font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
            <span className="absolute -bottom-2 -left-2 font-mono text-xs font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
            <span className="absolute -bottom-2 -right-2 font-mono text-xs font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
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
            {/* Top Telemetry Strip with Solid Black Borders */}
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 font-mono text-[10px] tracking-widest text-black dark:text-white uppercase select-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent inline-block" />
                    <span className="font-bold">SYS // CORE [01]</span>
                    <span className="text-black dark:text-white font-bold">|</span>
                    <span className="hidden sm:inline font-semibold">LAT: 0.7893° S · LON: 113.9213° E</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="hidden md:inline font-semibold">SPEC: INDEPENDENT ENGINEERING</span>
                    <span className="text-black dark:text-white font-bold hidden md:inline">|</span>
                    <span className="text-accent font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-accent inline" />
                        <span>RUST AXUM 0.7</span>
                    </span>
                </div>
            </div>

            {/* Hero / Introduction Header Box - Solid Background & Solid Black Borders */}
            <div className="relative border-2 border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 sm:p-10 space-y-6 shadow-none">
                <CornerCrosses />

                {/* Sub-header spec line */}
                <div className="flex items-center justify-between font-mono text-[10px] text-black dark:text-white border-b border-black dark:border-white pb-3 select-none">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 bg-black dark:bg-white" />
                        <span className="font-bold tracking-wider">[ 01 // OVERVIEW ]</span>
                        <span className="hidden sm:inline font-semibold">· FULLSTACK & SYSTEMS ARCHITECTURE</span>
                    </div>
                    <span className="tracking-widest font-bold">FIG. 01.A // 2026</span>
                </div>

                <div className="space-y-4">
                    <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-black dark:text-white">
                        {t('home.greeting')}{' '}
                        <span className="font-serif italic font-normal text-black dark:text-white">
                            {profile?.name || '...'}
                        </span>
                    </h1>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-black dark:text-white pt-2 border-b border-black dark:border-white pb-4 w-full">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 font-medium">
                                <span>•</span>
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.work_status && (
                            <div className="flex items-center gap-1.5 font-medium">
                                <span>•</span>
                                <span>{profile.work_status}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 ml-auto text-[10px] font-bold text-black dark:text-white hidden sm:flex">
                            <span className="w-2 h-2 bg-black dark:bg-white inline-block" />
                            <span>RUST ENGINE ONLINE</span>
                        </div>
                    </div>
                </div>

                <p className="text-base sm:text-lg text-black/80 dark:text-white/80 max-w-2xl leading-relaxed whitespace-pre-wrap font-normal">
                    {profile?.bio_home || '...'}
                </p>

                {/* Signature Actions with Solid Brutalist Framing */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href="/projects" className="btn-primary group relative border-2 border-black dark:border-white">
                        <span className="flex items-center gap-2">
                            <span>Explore Projects</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </Link>
                    <Link href="/contact" className="btn-secondary group relative border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
                        <span className="flex items-center gap-2">
                            <span>Get in Touch</span>
                            <span className="font-mono text-[10px]">[→]</span>
                        </span>
                    </Link>
                </div>
            </div>

            {/* Technical Notched Divider - Solid Black */}
            <div className="relative flex items-center my-8 sm:my-12 select-none">
                <div className="flex-grow border-t-2 border-black dark:border-white"></div>
                <div className="flex-shrink mx-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black dark:text-white font-bold flex items-center gap-2">
                    <span className="text-accent">+</span>
                    <span>SEC.02 // ARSENAL MATRIX</span>
                    <span className="text-accent">+</span>
                </div>
                <div className="flex-grow border-t-2 border-black dark:border-white"></div>
            </div>

            {/* Tech Arsenal Section - Solid Background & Solid Black Borders */}
            {grouped.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-b-2 border-black dark:border-white pb-3 flex items-end justify-between">
                        <div>
                            <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">[ 02 // TECH ARSENAL ]</div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
                                {t('home.skills_title')}
                            </h2>
                        </div>
                        <div className="text-right hidden sm:block font-mono text-[10px] text-black dark:text-white font-bold">
                            <span className="text-accent">{skills.length}</span> TECHNOLOGIES INDEXED
                        </div>
                    </div>

                    <div className="space-y-6">
                        {grouped.map((group, groupIdx) => (
                            <div key={group.category} className="relative border-2 border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-5 sm:p-7 shadow-none">
                                <CornerCrosses />
                                <div className="font-mono text-[10px] mb-5 border-b border-black dark:border-white pb-2.5 flex items-center justify-between text-black dark:text-white select-none">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-black dark:bg-white" />
                                        <span className="font-bold tracking-wider">{group.category.toUpperCase()}</span>
                                    </span>
                                    <span className="font-mono text-[9px] tracking-widest font-bold">
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
