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
        <div className="py-6 md:py-10 space-y-10">
            {/* Header with Solid Black Line */}
            <div className="border-b border-black dark:border-white pb-4 animate-fade-in">
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">[ 02 // DOSSIER & BACKGROUND ]</div>
                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">{t('about.title')}</h1>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">{t('about.subtitle')}</p>
            </div>

            {/* Quick Specs HUD Grid - Solid 1px Black Border & Solid BG */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
                    <CornerCrosses />
                    <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">SPEC 01 // FOCUS</span>
                    <span className="font-mono text-xs font-bold text-black dark:text-white">Full-Stack & Systems</span>
                </div>
                <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
                    <CornerCrosses />
                    <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">SPEC 02 // RUNTIME</span>
                    <span className="font-mono text-xs font-bold text-black dark:text-white">Rust Axum + React Vite</span>
                </div>
                <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
                    <CornerCrosses />
                    <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">SPEC 03 // LOCATION</span>
                    <span className="font-mono text-xs font-bold text-black dark:text-white">{profile?.location || 'Indonesia'}</span>
                </div>
                <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-3.5 shadow-none">
                    <CornerCrosses />
                    <span className="font-mono text-[9px] font-bold text-black/60 dark:text-white/60 block mb-1">SPEC 04 // STATUS</span>
                    <span className="font-mono text-xs font-bold text-black dark:text-white">{profile?.work_status || 'Open to Opportunities'}</span>
                </div>
            </div>

            {/* Biography & Signature Section - Solid 1px Black Border */}
            <section className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-6 md:p-8 space-y-6 shadow-none">
                <CornerCrosses />
                <div className="font-mono text-[10px] mb-2 border-b border-black dark:border-white pb-2 flex items-center justify-between text-black dark:text-white font-bold select-none">
                    <span>BIOGRAPHY & PHILOSOPHY</span>
                    <span>AUTHOR: {profile?.name || 'JULIO SIRINGORINGO'}</span>
                </div>
                <p className="text-base md:text-lg text-black/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
                    {profile?.bio_about || profile?.bio_home || '...'}
                </p>
                <div className="pt-4 border-t border-black dark:border-white mt-6 flex items-center justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-black dark:text-white font-bold">{t('about.warm_regards')}</p>
                        <p
                            className="text-6xl sm:text-7xl text-black dark:text-white mt-1 leading-none select-none"
                            style={{ fontFamily: "'Grand Hotel', cursive" }}
                        >
                            {profile?.name ? profile.name.split(' ')[0] : 'Julio'}
                        </p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <span className="font-mono text-[9px] font-bold block text-black/60 dark:text-white/60">VERIFIED PROFILE</span>
                        <span className="font-mono text-[10px] font-bold text-black dark:text-white">ID: ENG-2026-JS</span>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="space-y-6">
                <div className="border-b border-black dark:border-white pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Briefcase className="w-5 h-5 text-black dark:text-white" />
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">{t('about.experience')}</h2>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-black/70 dark:text-white/70">{safeExperiences.length} POSITIONS LOGGED</span>
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
                            className={`group relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] rounded-none overflow-hidden`}
                        >
                            <CornerCrosses />
                            <div
                                className="p-5 cursor-pointer flex items-start gap-4"
                                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                            >
                                <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-white dark:bg-black border border-black dark:border-white p-2">
                                    {exp.company_logo_url ? (
                                        <Image
                                            src={optimizeCloudinaryUrl(exp.company_logo_url || '')}
                                            alt={companyName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-full h-full text-black dark:text-white" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-display font-bold text-base md:text-lg leading-tight text-black dark:text-white">{position}</h3>
                                    <p className="font-mono text-[11px] font-bold text-black/80 dark:text-white/80">{companyName}</p>
                                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-black dark:text-white uppercase font-bold">
                                        <span className="px-2 py-0.5 border border-black dark:border-white bg-white dark:bg-black rounded-none">
                                            {new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {isCurrent ? t('about.present') : (endDate ? new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : t('about.present'))}
                                        </span>
                                        <span className="px-2 py-0.5 border border-black dark:border-white bg-white dark:bg-black rounded-none">
                                            {getDuration(startDate, endDate, isCurrent)}
                                        </span>
                                        <span className="px-2 py-0.5 border border-black dark:border-white bg-white dark:bg-black rounded-none">
                                            {empType} • {workType}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-black dark:text-white transition-transform duration-200 mt-1 ${expandedExp === exp.id ? 'rotate-180' : ''}`} />
                            </div>

                            <div className={`grid-expand ${expandedExp === exp.id ? 'grid-expand-open' : ''}`}>
                                <div>
                                    <div className="border-t border-black dark:border-white">
                                        <div className="p-4 md:p-6 pt-2 space-y-4 md:space-y-6">
                                            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-black dark:border-white">
                                                {(['resp', 'learn', 'impact'] as const).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTabs({ ...activeTabs, [exp.id]: tab })}
                                                        className={`px-4 md:px-6 py-3 whitespace-nowrap flex-shrink-0 text-xs md:text-sm font-mono font-bold transition-all relative ${(activeTabs[exp.id] || 'resp') === tab
                                                            ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                                                            : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                                                        }`}
                                                    >
                                                        {tab === 'resp' && (t('about.tabs.responsibilities') || 'Responsibilities')}
                                                        {tab === 'learn' && (t('about.tabs.learned') || 'What I Learned')}
                                                        {tab === 'impact' && (t('about.tabs.impact') || 'Key Impact')}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="space-y-2 font-mono text-xs leading-relaxed text-black/80 dark:text-white/80">
                                                {tabList.length > 0 ? (
                                                    tabList.map((item: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-2">
                                                            <span className="text-black dark:text-white font-bold select-none">•</span>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-black/40 dark:text-white/40 italic">Information pending synchronization.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-6">
                <div className="border-b border-black dark:border-white pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-5 h-5 text-black dark:text-white" />
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-black dark:text-white">{t('about.education')}</h2>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-black/70 dark:text-white/70">{safeEducations.length} RECORDS LOGGED</span>
                </div>

                <div className="space-y-4">
                    {safeEducations.map((edu: any) => (
                        <div
                            key={edu.id}
                            className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none shadow-none"
                        >
                            <CornerCrosses />
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-white dark:bg-black border border-black dark:border-white p-2">
                                    <GraduationIcon className="w-full h-full text-black dark:text-white" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-display font-bold text-base md:text-lg leading-tight text-black dark:text-white">
                                        {edu.institution_name}
                                    </h3>
                                    <p className="font-mono text-xs font-bold text-black/80 dark:text-white/80">
                                        {edu.degree} • {edu.field_of_study}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-black dark:text-white uppercase font-bold">
                                        {edu.grade && (
                                            <span className="px-2 py-0.5 border border-black dark:border-white bg-white dark:bg-black rounded-none">
                                                {edu.grade}
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 border border-black dark:border-white bg-white dark:bg-black rounded-none">
                                            {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : t('about.present')}
                                        </span>
                                    </div>
                                    {edu.description && (
                                        <p className="text-xs text-black/80 dark:text-white/80 pt-2 leading-relaxed font-sans">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
