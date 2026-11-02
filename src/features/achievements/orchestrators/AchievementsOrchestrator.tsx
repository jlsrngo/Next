import React, { useState } from 'react';
import { useTranslations, useLocale } from '@/context/I18nContext';
import { useAchievementsData, type AchievementItem } from '../hooks/useAchievementsData';
import TelemetryHeader from '@/components/ui/TelemetryHeader';
import AchievementCard from '../components/AchievementCard';
import AchievementDetailModal from '@/components/AchievementDetailModal';

export default function AchievementsOrchestrator() {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';
  const { achievements, loading } = useAchievementsData();
  const [selected, setSelected] = useState<AchievementItem | null>(null);

  // Dynamic Registry Status from Neon DB
  const dynamicRegistry = isId
    ? `REGISTRI: ${achievements.length} ENTRI`
    : `REGISTRY: ${achievements.length} ENTRIES`;

  const dynamicSpec = isId ? 'SPES: TERVERIFIKASI' : 'SPEC: VERIFIED';
  const dynamicEngine = isId
    ? `${achievements.length} TERVALIDASI`
    : `${achievements.length} ATTESTED`;

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Telemetry Strip with Live Viral GitHub Repo Wire */}
      <TelemetryHeader
        systemCode="SYS // CREDENTIAL [03]"
        coordinates={dynamicRegistry}
        spec={dynamicSpec}
        engine={dynamicEngine}
        liveFeed="viral-repo"
      />

      {/* Header */}
      <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
            {t('achievements.credentials_awards_tag') || (isId ? '[ 05 // KREDENSIAL ]' : '[ 05 // CREDENTIALS ]')}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
            {t('achievements.title') || 'Achievements'}
          </h1>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">
            {t('achievements.subtitle') || 'Certifications, awards, and milestones that I have achieved.'}
          </p>
        </div>
        <div className="font-mono text-[10px] font-bold text-black dark:text-white">
          {achievements.length} {t('achievements.awards_indexed') || 'AWARDS INDEXED'}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 border border-line bg-black/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
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
      )}

      {/* Detail Modal */}
      {selected && (
        <AchievementDetailModal
          isOpen={true}
          achievement={selected as any}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
