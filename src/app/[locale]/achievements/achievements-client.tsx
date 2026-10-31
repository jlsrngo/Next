'use client';

import { useState } from 'react';
import { Award, Calendar, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AchievementDetailModal from '@/components/AchievementDetailModal';

interface Achievement {
    id: string;
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
}

export default function AchievementsClient({ achievements, profile }: AchievementsClientProps) {
    const t = useTranslations();
    const [selected, setSelected] = useState<Achievement | null>(null);

    return (
        <div className="py-8 md:py-16 space-y-10">
            <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                    <div className="hud-label">[ 05 // CREDENTIALS & AWARDS ]</div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink flex items-center gap-3">
                        {t('achievements.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-muted max-w-xl">
                        {t('achievements.subtitle')}
                    </p>
                </div>
                <div className="hud-label">
                    {achievements.length} AWARDS INDEXED
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {achievements.map((item, i) => {
                    const isPdf = item.image_url?.toLowerCase().endsWith('.pdf');
                    const hasImage = !!item.image_url;

                    return (
                        <div
                            key={item.id}
                            className="group relative border border-line bg-bg-raised rounded-none overflow-hidden hover:border-line-strong transition-colors flex flex-col cursor-pointer animate-fade-in"
                            style={{ animationDelay: `${i * 50}ms` }}
                            onClick={() => setSelected(item)}
                        >
                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-0.5 rounded-none bg-bg-raised border border-line text-ink font-mono text-[9px] uppercase font-bold tracking-wider inline-block">
                                    {item.category}
                                </span>
                            </div>

                            <div className="relative h-36 md:h-44 overflow-hidden bg-bg-sunken border-b border-line transition-colors">
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
                                        <Award className="w-10 h-10 text-faint" />
                                        {isPdf && <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-faint">{t('achievements.pdf_certificate')}</span>}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-display font-bold text-base text-ink line-clamp-1">{item.title}</h3>
                                    {item.issuer && (
                                        <p className="hud-label text-accent flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5" /> <span>{item.issuer}</span>
                                        </p>
                                    )}
                                </div>

                                <p className="text-muted text-xs leading-relaxed line-clamp-2">{item.description}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-line font-mono text-[10px] text-faint uppercase font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AchievementDetailModal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                achievement={selected}
            />
        </div>
    );
}
