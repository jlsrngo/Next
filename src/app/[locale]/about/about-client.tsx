'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Briefcase, GraduationCap, ChevronDown, Building, GraduationCap as GraduationIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';

interface Experience {
    id: number;
    company_name: string;
    company_logo_url: string | null;
    position: string;
    location: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    employment_type: string;
    work_type: string;
    responsibilities: string[];
    what_i_learned: string[];
    impact: string[];
}

interface Education {
    id: number;
    institution_name: string;
    institution_logo_url: string | null;
    degree: string;
    field_of_study: string;
    location: string;
    gpa: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
}

interface AboutClientProps {
    profile: any;
    experiences: Experience[];
    educations: Education[];
}

export default function AboutClient({ profile, experiences, educations }: AboutClientProps) {
    const t = useTranslations();
    const [expandedExp, setExpandedExp] = useState<number | null>(null);
    const [activeTabs, setActiveTabs] = useState<Record<number, 'resp' | 'learn' | 'impact'>>({});
    const nowRef = useRef<Date>(new Date());

    const getDuration = (start: string, end: string | null, isCurrent: boolean) => {
        const startDate = new Date(start);
        const endDate = isCurrent ? nowRef.current : (end ? new Date(end) : nowRef.current);
        const diffYears = endDate.getFullYear() - startDate.getFullYear();
        const diffMonths = endDate.getMonth() - startDate.getMonth();
        const totalMonths = diffYears * 12 + diffMonths;
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        let duration = '';
        if (years > 0) duration += `${years} yr `;
        if (months > 0) duration += `${months} mos`;
        return duration || '1 mo';
    };

    return (
        <div className="py-12 md:py-16 space-y-20">
            <section className="space-y-6 relative">
                <h2 className="text-3xl font-extrabold tracking-tight">{t('about.title')}</h2>
                <div className="border-b border-slate-200 dark:border-white/10 pb-8 space-y-6">
                    <p className="text-base md:text-xl text-black dark:text-white leading-relaxed whitespace-pre-wrap font-bold text-justify">
                      {profile?.bio_about || profile?.bio_home || '...'}
                    </p>
                    <div className="pt-4">
                        <p className="text-black dark:text-white font-bold italic">{t('about.warm_regards')}</p>
                        <p
                            className="text-5xl text-accent mt-1"
                            style={{ fontFamily: 'var(--font-grand-hotel), cursive' }}
                        >
                            {profile?.name ? profile.name.split(' ')[0].charAt(0).toUpperCase() + profile.name.split(' ')[0].slice(1).toLowerCase() : '...'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-accent" /> {t('about.experience')}
                </h2>

                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className={`group relative border transition-colors rounded-none overflow-hidden ${expandedExp === exp.id ? 'border-line-strong bg-bg-raised' : 'border-line bg-bg-raised hover:border-line-strong'}`}
                        >
                            <div
                                className="p-5 cursor-pointer flex items-start gap-4"
                                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                            >
                                <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-bg-sunken border border-line p-2">
                                    {exp.company_logo_url ? (
                                        <Image
                                            src={optimizeCloudinaryUrl(exp.company_logo_url || '')}
                                            alt={exp.company_name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-full h-full text-ink" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-display font-bold text-base md:text-lg leading-tight text-ink">{exp.position}</h3>
                                    <p className="hud-label text-accent">{exp.company_name}</p>
                                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-faint uppercase font-bold">
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                            {new Date(exp.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.is_current ? t('about.present') : new Date(exp.end_date!).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                        </span>
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                            {getDuration(exp.start_date, exp.end_date, exp.is_current)}
                                        </span>
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none text-ink">
                                            {exp.employment_type} • {exp.work_type}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-faint transition-transform duration-200 mt-1 ${expandedExp === exp.id ? 'rotate-180 text-ink' : ''}`} />
                            </div>

                            <div className={`grid-expand ${expandedExp === exp.id ? 'grid-expand-open' : ''}`}>
                                <div>
                                    <div className="border-t border-slate-200 dark:border-white/10">
                                        <div className="p-4 md:p-6 pt-2 space-y-4 md:space-y-6">
                                            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-slate-200 dark:border-white/10">
                                                {(['resp', 'learn', 'impact'] as const).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTabs({ ...activeTabs, [exp.id]: tab })}
                                                        className={`px-4 md:px-6 py-3 whitespace-nowrap flex-shrink-0 text-xs md:text-sm font-bold transition-all relative ${(activeTabs[exp.id] || 'resp') === tab
                                                            ? 'text-accent'
                                                            : 'text-black dark:text-white hover:text-accent'
                                                            }`}
                                                    >
                                                        {tab === 'resp' ? t('about.tabs.responsibilities') : tab === 'learn' ? t('about.tabs.learned') : t('about.tabs.impact')}
                                                        {(activeTabs[exp.id] || 'resp') === tab && (
                                                            <span className="tab-underline" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="min-h-[140px]">
                                                <ul className="space-y-3">
                                                    {(
                                                        (activeTabs[exp.id] || 'resp') === 'resp' ? exp.responsibilities :
                                                            (activeTabs[exp.id] || 'resp') === 'learn' ? exp.what_i_learned :
                                                                exp.impact
                                                    ).map((point, i) => (
                                                        <li
                                                            key={`${exp.id}-${(activeTabs[exp.id] || 'resp')}-${i}`}
                                                            className="animate-list-item flex gap-3 text-sm font-medium leading-relaxed"
                                                            style={{ animationDelay: `${i * 50}ms` }}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-none bg-ink mt-2 flex-shrink-0" />
                                                            <span className="text-black dark:text-white font-bold shadow-none text-left">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <p className="text-center py-10 text-black dark:text-white font-bold italic shadow-none">{t('common.no_data')}</p>
                    )}
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-accent" /> {t('about.education')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educations.map((edu) => (
                        <div key={edu.id} className="group relative p-5 border border-line bg-bg-raised rounded-none hover:border-line-strong transition-colors flex items-start gap-4">
                            <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-bg-sunken border border-line p-2">
                                {edu.institution_logo_url ? (
                                    <Image
                                        src={optimizeCloudinaryUrl(edu.institution_logo_url || '')}
                                        alt={edu.institution_name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <GraduationIcon className="w-full h-full text-ink" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="font-display font-bold text-base leading-tight text-ink">{edu.institution_name}</h3>
                                <p className="text-xs text-muted">
                                    {edu.degree} • {edu.field_of_study}
                                </p>
                                {edu.gpa && <p className="hud-label text-accent">GPA: {edu.gpa}</p>}
                                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-faint uppercase font-bold">
                                    <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                        {new Date(edu.start_date).getFullYear()} - {edu.is_current ? t('about.present') : new Date(edu.end_date!).getFullYear()}
                                    </span>
                                    <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                        {edu.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
