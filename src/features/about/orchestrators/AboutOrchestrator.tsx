import React from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import { useAboutData } from '../hooks/useAboutData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import QuickSpecsHud from '../components/QuickSpecsHud';
import BiographyCard from '../components/BiographyCard';
import ExperienceList from '../components/ExperienceList';
import EducationList from '../components/EducationList';

export default function AboutOrchestrator() {
  const t = useTranslations();
  const locale = useLocale();
  const { profile, experiences, educations } = useAboutData();

  const isId = locale === 'id';
  const statusLabel = isId ? 'STATUS' : 'STATUS';
  const dossierLabel = isId ? 'DOSIR TERVERIFIKASI' : 'VERIFIED DOSSIER';
  const specLabel = isId ? 'SPES' : 'SPEC';

  // Dynamic context from DB: Work status + dossier verification
  const dynamicStatus = profile?.work_status
    ? `${statusLabel}: ${profile.work_status.toUpperCase()}`
    : `${isId ? 'STATUS: AKTIF' : 'STATUS: ONLINE'}`;

  const dynamicSpec = profile?.focus
    ? `${specLabel}: ${profile.focus.toUpperCase()}`
    : `${specLabel}: ${isId ? 'KOGNITIF' : 'COGNITIVE'}`;

  const dynamicEngine = profile?.runtime
    ? profile.runtime.toUpperCase()
    : isId ? 'NEURAL AKTIF' : 'NEURAL ONLINE';

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
          {isId ? '[ 02 // DOSIR ]' : '[ 02 // DOSSIER ]'}
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
