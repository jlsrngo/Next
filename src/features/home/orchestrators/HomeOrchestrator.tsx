import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import SectionDivider from '@/components/ui/SectionDivider';
import HeroOverviewCard from '../components/HeroOverviewCard';
import TechArsenalSection from '../components/TechArsenalSection';

export default function HomeOrchestrator() {
  const { profile, skills } = useHomeData();

  // Dynamic SPEC & KERNEL from Neon PostgreSQL Database & System Runtime (Zero Hardcode)
  const dynamicSpec = profile?.focus
    ? `SPEC: ${profile.focus.toUpperCase()}`
    : profile?.headline
    ? `SPEC: ${profile.headline.toUpperCase()}`
    : 'SPEC: FULL STACK SYSTEMS';

  const dynamicKernel = profile?.runtime
    ? profile.runtime.toUpperCase()
    : 'RUST AXUM 0.7 · REACT 18 · TOKIO NATIVE';

  const dynamicCoordinates = 'LAT: 0.7893° S · LON: 113.9213° E';

  return (
    <div className="py-6 md:py-10 space-y-10 relative">
      {/* Telemetry Strip with Live Realtime Clock & Dynamic DB Spec/Kernel */}
      <TelemetryHeader
        systemCode="SYS // CORE [01]"
        spec={dynamicSpec}
        engine={dynamicKernel}
        coordinates={dynamicCoordinates}
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
