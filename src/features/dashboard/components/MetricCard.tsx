import React from 'react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label?: string;
  value?: string | number;
  icon?: LucideIcon;
  stat?: {
    label: string;
    value: string | number;
    icon: LucideIcon;
  };
  loading?: boolean;
}

export default function MetricCard({ label, value, icon, stat, loading }: MetricCardProps) {
  const actualLabel = label || stat?.label || '';
  const actualValue = value !== undefined ? value : (stat?.value ?? 0);
  const Icon = icon || stat?.icon;

  if (loading) {
    return (
      <div className="h-28 border border-line bg-black/5 dark:bg-white/5 animate-pulse" />
    );
  }

  return (
    <div className="relative border border-line bg-[#faf9f7] dark:bg-[#101014] p-5 rounded-none shadow-none">
      <CornerCrosses />
      <div className="w-9 h-9 rounded-none border border-line bg-white dark:bg-black flex items-center justify-center mb-3">
        {Icon ? <Icon className="w-4 h-4 text-black dark:text-white" /> : null}
      </div>
      <h3 className="font-display text-3xl font-bold text-black dark:text-white mb-1">
        {actualValue}
      </h3>
      <p className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60">
        {actualLabel}
      </p>
    </div>
  );
}
