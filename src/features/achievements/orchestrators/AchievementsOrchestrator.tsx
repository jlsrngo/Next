import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAchievementsData, type AchievementItem } from '../hooks/useAchievementsData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import AchievementCard from '../components/AchievementCard';
import AchievementDetailModal from '@/components/AchievementDetailModal';

export default function AchievementsOrchestrator() {
  const t = useTranslations();
  const { achievements } = useAchievementsData();
  const [selected, setSelected] = useState<AchievementItem | null>(null);

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip */}
      <TelemetryHeader
        systemCode="SYS // CREDENTIAL [05]"
        coordinates="LAT: 0.7893° S · LON: 113.9213° E"
        spec={t('telemetry.achievements_spec') || 'SPEC: VERIFIED ATTESTATION'}
        engine={t('telemetry.achievements_engine') || 'CERT PROTOCOL VALIDATED'}
      />

      {/* Header */}
      <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            [ 05 // CREDENTIALS & AWARDS ]
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
            {t('achievements.title') || 'Achievements'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('achievements.subtitle') || 'Certifications, awards, and milestones that I have achieved.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {achievements.length} AWARDS INDEXED
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((item, i) => (
          <AchievementCard
            key={item.id}
            item={item}
            index={i}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <AchievementDetailModal
          isOpen={!!selected}
          achievement={selected as any}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
