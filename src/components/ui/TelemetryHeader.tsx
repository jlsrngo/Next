import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Clock, ShieldCheck, Flame, GitBranch, Activity } from 'lucide-react';
import { useLocale } from '@/context/I18nContext';
import { telemetryService, type TrendingTech } from '@/services/api';

interface TelemetryHeaderProps {
  sysId?: string;
  systemCode?: string;
  coordinates?: string;
  spec?: string;
  engine?: string;
  liveTime?: boolean;
  liveFeed?: 'news' | 'viral-repo' | 'github' | 'status' | 'none';
}

export function TelemetryHeader({
  sysId,
  systemCode,
  coordinates = 'LAT: 0.7893° S · LON: 113.9213° E',
  spec,
  engine,
  liveTime = false,
  liveFeed = 'none',
}: TelemetryHeaderProps) {
  const locale = useLocale();
  const isId = locale === 'id';
  const resolvedSpec = spec || (isId ? 'SPES: MANDIRI' : 'SPEC: INDEPENDENT');
  const resolvedEngine = engine || 'KERNEL v4.2';
  const code = systemCode || (sysId ? `SYS // CORE [${sysId}]` : 'SYS // CORE [01]');
  const [timeStr, setTimeStr] = useState<string>('');
  const [trending, setTrending] = useState<TrendingTech | null>(null);
  const [repoIndex, setRepoIndex] = useState<number>(0);

  // Live real-time clock
  useEffect(() => {
    if (!liveTime) return;
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(isId ? 'id-ID' : 'en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [liveTime, isId]);

  // Live trending wire (Tech News & Live GitHub Repositories)
  useEffect(() => {
    if (liveFeed === 'news' || liveFeed === 'viral-repo') {
      telemetryService
        .getTrendingTech()
        .then((data) => {
          if (data) {
            setTrending(data);
          }
        })
        .catch(() => {});
    }
  }, [liveFeed]);

  // Rotate viral repos every 6 seconds if multiple repos exist
  useEffect(() => {
    if (liveFeed !== 'viral-repo' || !trending?.trending_repos?.length) return;
    const interval = setInterval(() => {
      setRepoIndex((prev) => (prev + 1) % trending.trending_repos!.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [liveFeed, trending]);

  const displayedCoordinates = timeStr ? `${coordinates} · ${timeStr}` : coordinates;

  // Compute live telemetry content
  let liveSpec = resolvedSpec;
  let liveEngine = resolvedEngine;
  let LiveIcon = Cpu;
  let isPulsing = false;

  if (liveFeed === 'news') {
    LiveIcon = Radio;
    isPulsing = true;
    if (trending?.headline) {
      liveSpec = `TECH WIRE // ${trending.headline.length > 42 ? trending.headline.slice(0, 42) + '...' : trending.headline}`;
      liveEngine = trending.metric || '▲ LIVE FEED';
    }
  } else if (liveFeed === 'viral-repo') {
    LiveIcon = Flame;
    isPulsing = true;
    if (trending?.trending_repos && trending.trending_repos.length > 0) {
      const currentRepo = trending.trending_repos[repoIndex] || trending.trending_repos[0];
      liveSpec = `HOT REPO // ${currentRepo.full_name}`;
      liveEngine = `${currentRepo.stars_formatted} STARS`;
    } else if (trending?.viral_repo) {
      liveSpec = `HOT REPO // ${trending.viral_repo}`;
      liveEngine = `${trending.repo_metric || '★ TOP'} STARS`;
    } else {
      liveSpec = 'HOT REPO // openclaw/openclaw';
      liveEngine = '★ 393.6k STARS';
    }
  } else if (liveFeed === 'github') {
    LiveIcon = GitBranch;
    isPulsing = true;
    liveSpec = spec || (isId ? 'GITHUB // KONTRIBUSI AKTIF' : 'GITHUB // ACTIVE SYNC');
    liveEngine = engine || (isId ? '1.993 KONTRIBUSI' : '1,993 CONTRIBUTIONS');
  } else if (liveFeed === 'status') {
    LiveIcon = Activity;
    isPulsing = true;
    liveSpec = spec || (isId ? 'SISTEM // SIMPUL NOMINAL' : 'SYSTEM // NODES NOMINAL');
    liveEngine = engine || 'RUST AXUM';
  } else if (liveTime) {
    LiveIcon = Clock;
  }

  return (
    <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-[10px] tracking-widest text-black dark:text-white uppercase select-none">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-black dark:bg-white inline-block animate-pulse" />
        <span className="font-bold">{code}</span>
        <span className="text-black dark:text-white font-bold">|</span>
        <span className="hidden sm:inline font-semibold">{displayedCoordinates}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden md:inline font-semibold truncate max-w-sm">{liveSpec}</span>
        <span className="text-black dark:text-white font-bold hidden md:inline">|</span>
        {/* Flat clean text: No gray background box or border, purely Swiss brutalist */}
        <span className="text-black dark:text-white font-bold flex items-center gap-1.5 whitespace-nowrap">
          <LiveIcon className={`w-3.5 h-3.5 text-black dark:text-white inline ${isPulsing ? 'animate-pulse' : ''}`} />
          <span>{liveEngine}</span>
        </span>
      </div>
    </div>
  );
}

export default TelemetryHeader;
