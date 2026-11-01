import React from 'react';
import { useTranslations } from 'next-intl';
import { useAboutData } from '../hooks/useAboutData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import QuickSpecsHud from '../components/QuickSpecsHud';
import BiographyCard from '../components/BiographyCard';
import ExperienceList from '../components/ExperienceList';
import EducationList from '../components/EducationList';

export default function AboutOrchestrator() {
  const t = useTranslations();
  const { profile, experiences, educations } = useAboutData();

  // Dynamic context from DB: Work status + dossier verification
  const dynamicStatus = profile?.work_status
    ? `STATUS: ${profile.work_status.toUpperCase()} · VERIFIED DOSSIER`
    : 'WORKFORCE ONLINE · VERIFIED DOSSIER';

  const dynamicSpec = profile?.focus
    ? `SPEC: ${profile.focus.toUpperCase()}`
    : 'SPEC: COGNITIVE PROFILE';

  const dynamicEngine = profile?.runtime
    ? profile.runtime.toUpperCase()
    : 'NEURAL INDEX ONLINE';

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip with Live Tech News Feed */}
      <TelemetryHeader
        systemCode="SYS // DOSSIER [02]"
        coordinates={dynamicStatus}
        spec={dynamicSpec}
        engine={dynamicEngine}
        liveFeed="news"
      />

      {/* Header with Technical Line */}
      <div className="border-b border-line pb-4 animate-fade-in">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
          [ 02 // DOSSIER & BACKGROUND ]
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
          {t('about.title') || 'About'}
        </h1>
        <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">
          {t('about.subtitle') || 'A brief introduction about who I am.'}
        </p>
      </div>

      {/* Quick Specs HUD Grid (100% Dynamic from DB) */}
      <QuickSpecsHud profile={profile} />

      {/* Biography & Signature Section */}
      <BiographyCard profile={profile} />

      {/* Experience Section */}
      <ExperienceList experiences={experiences} />

      {/* Education Section */}
      <EducationList educations={educations} />
    </div>
  );
}
