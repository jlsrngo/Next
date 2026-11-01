import React from 'react';
import { useTranslations } from 'next-intl';
import { useContactData } from '../hooks/useContactData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import ContactCard from '../components/ContactCard';

export default function ContactOrchestrator() {
  const t = useTranslations();
  const { socialLinks, profile, loading } = useContactData();

  // Dynamic Relay Status from Neon DB (Zero hardcode)
  const dynamicCoordinates = `CHANNELS: ${socialLinks.length} SECURE ENDPOINTS READY`;
  const dynamicSpec = `DIRECT DISPATCH // ${profile?.fullName?.toUpperCase() || 'JULIO SIRINGORINGO'}`;

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip (Dynamic from DB) */}
      <TelemetryHeader
        systemCode="SYS // RELAY [06]"
        coordinates={dynamicCoordinates}
        spec={dynamicSpec}
        engine="COMMUNICATION RELAY ONLINE"
      />

      {/* Top Header */}
      <div className="border-b border-line pb-4 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            [ 06 // TRANSMISSION & NETWORK ]
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
            {t('contact.title') || 'Contact'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('contact.subtitle') || 'Feel free to reach out for collaborations, questions, or just to say hi.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {socialLinks.length} {socialLinks.length === 1 ? 'CHANNEL' : 'CHANNELS'} INDEXED
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 border border-line bg-black/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.map((item, i) => (
            <ContactCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
