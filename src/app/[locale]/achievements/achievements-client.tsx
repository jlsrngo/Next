'use client';

import { useState } from 'react';
import { Award, Calendar, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AchievementDetailModal from '@/components/AchievementDetailModal';

interface Achievement {
    id: string | number;
    title: string;
    description: string;
    issuer: string;
    date: string;
    image_url: string;
    category: string;
    credential_id?: string;
    credential_url?: string;
    type?: string;
}

interface AchievementsClientProps {
    achievements: Achievement[];
    profile: any;
    categories?: string[];
}

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

export default function AchievementsClient({ achievements = [], profile }: AchievementsClientProps) {
    const t = useTranslations();
    const [selected, setSelected] = useState<Achievement | null>(null);

    const safeAchievements = Array.isArray(achievements) ? achievements : [];

    return (
        <div className="py-6 md:py-10 space-y-10">
            {/* Header */}
            <div className="border-b border-black dark:border-white pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                    <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
                        [ 05 // CREDENTIALS & AWARDS ]
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
                        {t('achievements.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
                        {t('achievements.subtitle')}
                    </p>
                </div>
                <div className="font-mono text-[10px] font-bold text-black dark:text-white">
                    {safeAchievements.length} AWARDS INDEXED
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {safeAchievements.map((item, i) => {
                    const isPdf = item.image_url?.toLowerCase().endsWith('.pdf');
                    const hasImage = !!item.image_url;

                    return (
                        <div
                            key={item.id}
                            className="group relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] rounded-none overflow-hidden transition-all hover:bg-[#f2f1ed] dark:hover:bg-[#16171d] flex flex-col cursor-pointer animate-fade-in shadow-none"
                            style={{ animationDelay: `${i * 50}ms` }}
                            onClick={() => setSelected(item)}
                        >
                            <CornerCrosses />

                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-0.5 rounded-none bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white font-mono text-[9px] uppercase font-bold tracking-wider inline-block">
                                    {item.category}
                                </span>
                            </div>

                            <div className="relative h-36 md:h-44 overflow-hidden bg-black/5 dark:bg-white/5 border-b border-black dark:border-white transition-colors">
                                {hasImage && !isPdf ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <Award className="w-10 h-10 text-black/40 dark:text-white/40" />
                                        {isPdf && (
                                            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                                                {t('achievements.pdf_certificate')}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-display font-bold text-base text-black dark:text-white line-clamp-1">
                                        {item.title}
                                    </h3>
                                    {item.issuer && (
                                        <p className="font-mono text-[10px] font-bold text-black dark:text-white uppercase flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-black dark:text-white" />
                                            <span>{item.issuer}</span>
                                        </p>
                                    )}
                                </div>

                                <p className="text-black/70 dark:text-white/70 text-xs leading-relaxed line-clamp-2 font-sans">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-black dark:border-white font-mono text-[10px] text-black/60 dark:text-white/60 uppercase font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
                                        <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Achievement Detail Modal */}
            {selected && (
                <AchievementDetailModal
                    achievement={selected as any}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
