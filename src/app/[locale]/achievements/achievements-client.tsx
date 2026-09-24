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
        <div className="py-12 md:py-16 space-y-12">
            <div className="animate-fade-in-up flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold flex items-center gap-3">
                        <Award className="w-8 h-8 text-accent" /> {t('achievements.title')}
                    </h1>
                    <p className="text-lg text-black dark:text-white font-bold max-w-xl">
                        {t('achievements.subtitle')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((item, i) => {
                    const isPdf = item.image_url?.toLowerCase().endsWith('.pdf');
                    const hasImage = !!item.image_url;

                    return (
                        <div
                            key={item.id}
                            className="animate-scale-in group relative glass-card border border-slate-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-700 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col cursor-pointer"
                            style={{ animationDelay: `${i * 50}ms` }}
                            onClick={() => setSelected(item)}
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <span className="px-3 py-1 rounded-full bg-zinc-900/90 dark:bg-zinc-800/90 border border-zinc-700/50 text-zinc-300 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-widest inline-block shadow-sm">
                                    {item.category}
                                </span>
                            </div>

                            <div className="relative h-36 md:h-44 overflow-hidden bg-slate-100 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-zinc-800 group-hover:bg-slate-200/50 dark:group-hover:bg-zinc-900/60 transition-colors">
                                {hasImage && !isPdf ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                        <Award className="w-12 h-12 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                                        {isPdf && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('achievements.pdf_certificate')}</span>}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 md:p-5 space-y-3">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base md:text-lg text-black dark:text-white group-hover:text-zinc-200 transition-colors line-clamp-1">{item.title}</h3>
                                    {item.issuer && (
                                        <p className="text-zinc-500 dark:text-zinc-400 font-bold text-xs flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> <span>{item.issuer}</span>
                                        </p>
                                    )}
                                </div>

                                <p className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold leading-relaxed line-clamp-2">{item.description}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}
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
