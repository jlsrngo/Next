import React from 'react';
import { useTranslations } from 'next-intl';
import { useHomeData } from '../hooks/useHomeData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import SectionDivider from '@/components/ui/SectionDivider';
import HeroOverviewCard from '../components/HeroOverviewCard';
import TechArsenalSection from '../components/TechArsenalSection';

export default function HomeOrchestrator() {
  const t = useTranslations();
  const { profile, skills, loading } = useHomeData();

  return (
    <div className="py-6 md:py-10 space-y-10 relative">
      {/* Telemetry Strip with Live Realtime Clock & Coordinates */}
      <TelemetryHeader
        sysId="01"
        spec={t('telemetry.home_spec') || 'SPEC: AUTONOMOUS ARCHITECTURE'}
        engine={t('telemetry.home_engine') || 'KERNEL ACTIVE v4.2'}
        coordinates={profile?.location ? `LAT: 0.7893° S · LON: 113.9213° E · ${profile.location.toUpperCase()}` : 'LAT: 0.7893° S · LON: 113.9213° E'}
        liveTime={true}
      />

      {/* Hero Card */}
      <HeroOverviewCard profile={profile} />

      {/* Technical Divider */}
      <SectionDivider label="SEC.02 // ARSENAL MATRIX" />

      {/* Skills Matrix */}
      <TechArsenalSection skills={skills} />
    </div>
  );
}
