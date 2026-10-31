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

export default function AboutClient({ profile, experiences = [], educations = [] }: AboutClientProps) {
    const t = useTranslations();
    const [expandedExp, setExpandedExp] = useState<number | null>(null);
    const [activeTabs, setActiveTabs] = useState<Record<number, 'resp' | 'learn' | 'impact'>>({});
    const nowRef = useRef<Date>(new Date());

    const safeExperiences = Array.isArray(experiences) ? experiences : [];
    const safeEducations = Array.isArray(educations) ? educations : [];

    const getDuration = (start: string | null | undefined, end: string | null | undefined, isCurrent: boolean) => {
        if (!start) return '1 yr';
        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) return '1 yr';
        const endDate = isCurrent ? nowRef.current : (end ? new Date(end) : nowRef.current);
        const validEndDate = isNaN(endDate.getTime()) ? nowRef.current : endDate;
        const diffYears = validEndDate.getFullYear() - startDate.getFullYear();
        const diffMonths = validEndDate.getMonth() - startDate.getMonth();
        const totalMonths = Math.max(diffYears * 12 + diffMonths, 1);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        let duration = '';
        if (years > 0) duration += `${years} yr `;
        if (months > 0) duration += `${months} mos`;
        return duration.trim() || '1 mo';
    };

    return (
        <div className="py-8 md:py-16 space-y-12">
            {/* Header with ArtCraft HUD Dossier Label */}
            <div className="border-b border-line pb-4 animate-fade-in">
                <div className="hud-label mb-1">[ 02 // DOSSIER & BACKGROUND ]</div>
                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink">{t('about.title')}</h1>
                <p className="text-sm sm:text-base text-muted mt-1">{t('about.subtitle')}</p>
            </div>

            {/* Quick Specs HUD Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                <div className="border border-line bg-bg-raised p-3.5">
                    <span className="hud-label text-faint block mb-1">SPEC 01 // FOCUS</span>
                    <span className="font-mono text-xs font-bold text-ink">Full-Stack & Systems</span>
                </div>
                <div className="border border-line bg-bg-raised p-3.5">
                    <span className="hud-label text-faint block mb-1">SPEC 02 // RUNTIME</span>
                    <span className="font-mono text-xs font-bold text-ink">Rust Axum + React Vite</span>
                </div>
                <div className="border border-line bg-bg-raised p-3.5">
                    <span className="hud-label text-faint block mb-1">SPEC 03 // LOCATION</span>
                    <span className="font-mono text-xs font-bold text-ink">{profile?.location || 'Indonesia'}</span>
                </div>
                <div className="border border-line bg-bg-raised p-3.5">
                    <span className="hud-label text-faint block mb-1">SPEC 04 // STATUS</span>
                    <span className="font-mono text-xs font-bold text-accent">{profile?.work_status || 'Open to Opportunities'}</span>
                </div>
            </div>

            {/* Biography & Signature Section */}
            <section className="space-y-6 relative border border-line bg-bg-raised p-6 md:p-8">
                <div className="hud-label mb-2 border-b border-line pb-2 flex items-center justify-between">
                    <span>BIOGRAPHY & PHILOSOPHY</span>
                    <span>AUTHOR: {profile?.name || 'JULIO SIRINGORINGO'}</span>
                </div>
                <p className="text-base md:text-lg text-ink leading-relaxed whitespace-pre-wrap font-sans">
                    {profile?.bio_about || profile?.bio_home || '...'}
                </p>
                <div className="pt-4 border-t border-line mt-6 flex items-center justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-muted font-bold">{t('about.warm_regards')}</p>
                        <p
                            className="text-6xl sm:text-7xl text-accent mt-1 leading-none select-none"
                            style={{ fontFamily: "'Grand Hotel', cursive" }}
                        >
                            {profile?.name ? profile.name.split(' ')[0] : 'Julio'}
                        </p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <span className="hud-label block text-faint">VERIFIED PROFILE</span>
                        <span className="font-mono text-[10px] text-muted">ID: ENG-2026-JS</span>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="border-b border-line pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Briefcase className="w-5 h-5 text-ink" />
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">{t('about.experience')}</h2>
                    </div>
                    <span className="hud-label">{safeExperiences.length} POSITIONS LOGGED</span>
                </div>

                <div className="space-y-4">
                    {safeExperiences.map((exp: any) => {
                        const companyName = exp.company_name || exp.company || 'Company';
                        const position = exp.position || exp.role || 'Developer';
                        const startDate = exp.start_date || '2023-01-01';
                        const endDate = exp.end_date;
                        const isCurrent = exp.is_current ?? true;
                        const empType = exp.employment_type || 'Full-time';
                        const workType = exp.work_type || 'Remote';
                        const tabList = (activeTabs[exp.id] || 'resp') === 'resp' 
                            ? (Array.isArray(exp.responsibilities) ? exp.responsibilities : [])
                            : (activeTabs[exp.id] || 'resp') === 'learn'
                            ? (Array.isArray(exp.what_i_learned) ? exp.what_i_learned : [])
                            : (Array.isArray(exp.impact) ? exp.impact : []);

                        return (
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
                                            alt={companyName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-full h-full text-ink" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-display font-bold text-base md:text-lg leading-tight text-ink">{position}</h3>
                                    <p className="hud-label text-accent">{companyName}</p>
                                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-faint uppercase font-bold">
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                            {new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {isCurrent ? t('about.present') : (endDate ? new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : t('about.present'))}
                                        </span>
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                            {getDuration(startDate, endDate, isCurrent)}
                                        </span>
                                        <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none text-ink">
                                            {empType} • {workType}
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
                                                    {tabList.map((point: string, i: number) => (
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
                        );
                    })}
                    {safeExperiences.length === 0 && (
                        <p className="text-center py-10 text-black dark:text-white font-bold italic shadow-none">{t('common.no_data')}</p>
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <div className="border-b border-line pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-5 h-5 text-ink" />
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">{t('about.education')}</h2>
                    </div>
                    <span className="hud-label">{safeEducations.length} CREDENTIALS VERIFIED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safeEducations.map((edu: any) => {
                        const institution = edu.institution_name || edu.institution || 'University';
                        const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : 2020;
                        const endYear = edu.is_current ? t('about.present') : (edu.end_date ? new Date(edu.end_date).getFullYear() : 2024);

                        return (
                        <div key={edu.id} className="group relative p-5 border border-line bg-bg-raised rounded-none hover:border-line-strong transition-colors flex items-start gap-4">
                            <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-bg-sunken border border-line p-2">
                                {edu.institution_logo_url ? (
                                    <Image
                                        src={optimizeCloudinaryUrl(edu.institution_logo_url || '')}
                                        alt={institution}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <GraduationIcon className="w-full h-full text-ink" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="font-display font-bold text-base leading-tight text-ink">{institution}</h3>
                                <p className="text-xs text-muted">
                                    {edu.degree} • {edu.field_of_study}
                                </p>
                                {edu.gpa && <p className="hud-label text-accent">GPA: {edu.gpa}</p>}
                                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-faint uppercase font-bold">
                                    <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                        {startYear} - {endYear}
                                    </span>
                                    <span className="px-2 py-0.5 border border-line bg-bg-sunken rounded-none">
                                        {edu.location || 'Indonesia'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
