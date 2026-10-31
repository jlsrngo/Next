import React from 'react';

interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="relative flex items-center my-8 sm:my-12 select-none">
      <div className="flex-grow border-t border-line" />
      <div className="flex-shrink mx-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black dark:text-white font-bold flex items-center gap-2">
        <span className="font-bold text-line">+</span>
        <span>{label}</span>
        <span className="font-bold text-line">+</span>
      </div>
      <div className="flex-grow border-t border-line" />
    </div>
  );
}

export default SectionDivider;
