import React from 'react';
import { Cpu } from 'lucide-react';

interface TelemetryHeaderProps {
  systemCode?: string;
  coordinates?: string;
  spec?: string;
  engine?: string;
}

export function TelemetryHeader({
  systemCode = 'SYS // CORE [01]',
  coordinates = 'LAT: 0.7893° S · LON: 113.9213° E',
  spec = 'SPEC: INDEPENDENT ENGINEERING',
  engine = 'RUST AXUM 0.7',
}: TelemetryHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-black dark:border-white pb-3 font-mono text-[10px] tracking-widest text-black dark:text-white uppercase select-none">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-black dark:bg-white inline-block" />
        <span className="font-bold">{systemCode}</span>
        <span className="text-black dark:text-white font-bold">|</span>
        <span className="hidden sm:inline font-semibold">{coordinates}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden md:inline font-semibold">{spec}</span>
        <span className="text-black dark:text-white font-bold hidden md:inline">|</span>
        <span className="text-black dark:text-white font-bold flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-black dark:text-white inline" />
          <span>{engine}</span>
        </span>
      </div>
    </div>
  );
}

export default TelemetryHeader;
