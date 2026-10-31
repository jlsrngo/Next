'use client';

import { X } from 'lucide-react';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';

interface SkillIconProps {
    name: string;
    iconSlug: string;
    onDelete?: () => void;
    showDelete?: boolean;
}

export default function SkillIcon({ name, iconSlug, onDelete, showDelete }: SkillIconProps) {
    const { iconName, gradient } = getSkillIconData(iconSlug || name || '');
    const IconComponent = loadIcon(iconName);

    return (
        <div className="group flex flex-col items-center w-16 sm:w-20 cursor-pointer pt-2 select-none">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 z-10 block">
                {/* Backdrop Card that moves out and rotates on hover */}
                <div
                    className={`skill-icon-backdrop absolute inset-0 transition-all duration-300 ease-out translate-x-1.5 -translate-y-1.5 rotate-[8deg] bg-[#e3e2dc] dark:bg-[#25272e] border border-line-strong/30 dark:border-white/10 opacity-75 group-hover:translate-x-3.5 group-hover:-translate-y-3.5 group-hover:rotate-[18deg] group-hover:opacity-100 group-hover:bg-gradient-to-br ${gradient}`}
                    style={{ willChange: 'transform' }}
                />
                {/* Surface Card with Icon */}
                <div className="skill-icon-surface absolute inset-0 bg-white dark:bg-[#16171b] border border-line flex items-center justify-center transition-all duration-300 z-10 group-hover:border-ink group-hover:scale-105 shadow-sm">
                    {IconComponent ? (
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-ink transition-transform duration-300 relative z-20 group-hover:scale-110" />
                    ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black/10 dark:bg-white/10 rounded-2xl animate-pulse relative z-20" />
                    )}
                </div>
                {showDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-invert-bg text-invert-fg border border-line flex items-center justify-center transition-opacity z-30 hover:scale-105"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            {/* Label: Hidden by default (opacity-0), smoothly reveals only on hover */}
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-ink transition-all duration-200 text-center translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap mt-2 h-4">
                {name}
            </span>
        </div>
    );
}
