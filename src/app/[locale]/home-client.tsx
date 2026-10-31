'use client';

import { useRef } from 'react';
import SkillIcon from '@/components/SkillIcon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, Code, Terminal, Cpu } from 'lucide-react';

interface Profile {
    name: string;
    location: string | null;
    work_status: string | null;
    bio_home: string | null;
    avatar_url: string | null;
}

interface Skill {
    id: number;
    name: string;
    iconName: string | null;
    category: string;
}

interface HomeClientProps {
    profile: Profile | null;
    skills: Skill[];
}

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'Mobile', 'Database', 'Tools & DevOps', 'Cloud', 'AI'];

function SkillItem({ skill, index }: { skill: Skill; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const iconSlug = (skill as any).iconName || (skill as any).icon || (skill as any).icon_name || skill.name;

    return (
        <div
            ref={ref}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 30, 600)}ms`, animationFillMode: 'both' }}
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
        <div className="py-8 md:py-16 space-y-14">
            {/* Hero / Introduction Header */}
            <div className="space-y-6 animate-fade-in">
                <div className="space-y-3">
                    <div className="hud-label flex items-center gap-2 text-faint">
                        <span className="inline-block w-2 h-2 bg-accent" />
                        <span>[ 01 // OVERVIEW ]</span>
                        <span className="hidden sm:inline">· FULLSTACK & SYSTEMS</span>
                    </div>

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
                            <Cpu className="w-3.5 h-3.5 text-accent" />
                            <span>RUST ENGINE ACTIVE</span>
                        </div>
                    </div>
                </div>

                <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed whitespace-pre-wrap">
                    {profile?.bio_home || '...'}
                </p>

                {/* ArtCraft Signature Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href="/projects" className="btn-primary">
                        <span>Explore Projects</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/contact" className="btn-secondary">
                        <span>Get in Touch</span>
                    </Link>
                </div>
            </div>

            <hr className="border-line" />

            {grouped.length > 0 && (
                <div className="space-y-10 animate-fade-in">
                    <div className="border-b border-line pb-3 flex items-end justify-between">
                        <div>
                            <div className="hud-label mb-1">[ 02 // TECH ARSENAL ]</div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
                                {t('home.skills_title')}
                            </h2>
                        </div>
                        <p className="hud-label hidden sm:block">
                            {skills.length} TECHNOLOGIES INDEXED
                        </p>
                    </div>

                    <div className="space-y-8">
                        {grouped.map(group => (
                            <div key={group.category} className="border border-line bg-bg-raised p-4 sm:p-6">
                                <h3 className="hud-label mb-4 text-faint border-b border-line pb-2 flex items-center justify-between">
                                    <span>{t(`home.categories.${group.category}`)}</span>
                                    <span>{group.items.length} items</span>
                                </h3>
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
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
