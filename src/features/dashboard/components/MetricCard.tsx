import React from 'react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export default function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none shadow-none">
      <CornerCrosses />
      <div className="w-9 h-9 rounded-none border border-black dark:border-white bg-white dark:bg-black flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-black dark:text-white" />
      </div>
      <h3 className="font-display text-3xl font-bold text-black dark:text-white mb-1">
        {value}
      </h3>
      <p className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60">
        {label}
      </p>
    </div>
  );
}
