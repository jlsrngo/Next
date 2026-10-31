'use client';

import { X } from 'lucide-react';
import { getSkillIconData, loadIcon } from '@/utils/skillIconMap';
import { getLanguageColor } from '@/constants/palette';

interface SkillIconProps {
    name: string;
    iconSlug: string;
    onDelete?: () => void;
    showDelete?: boolean;
}

export default function SkillIcon({ name, iconSlug, onDelete, showDelete }: SkillIconProps) {
    const { iconName } = getSkillIconData(iconSlug || name || '');
    const IconComponent = loadIcon(iconName);
    const accentColor = getLanguageColor(name);

    return (
        <div className="group flex flex-col items-center w-16 sm:w-20 cursor-pointer pt-2 select-none">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 z-10 block">
                {/* Backdrop Card that moves out and reveals our palette color on hover */}
                <div
                    className="skill-icon-backdrop absolute inset-0 transition-all duration-300 ease-out translate-x-1.5 -translate-y-1.5 rotate-[8deg] border border-line opacity-75 group-hover:translate-x-3.5 group-hover:-translate-y-3.5 group-hover:rotate-[16deg] group-hover:opacity-100"
                    style={{
                        backgroundColor: accentColor,
                        willChange: 'transform',
                    }}
                />
                {/* Surface Card with Icon (sharp square with solid technical border) */}
                <div className="skill-icon-surface absolute inset-0 bg-white dark:bg-[#16171b] border border-line flex items-center justify-center transition-all duration-300 z-10 group-hover:scale-105 shadow-sm">
                    {IconComponent ? (
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-black dark:text-white transition-transform duration-300 relative z-20 group-hover:scale-110" />
                    ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black/10 dark:bg-white/10 animate-pulse relative z-20" />
                    )}
                </div>
                {showDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-black dark:bg-white text-white dark:text-black border border-line flex items-center justify-center transition-opacity z-30 hover:scale-105"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            {/* Label: Smoothly reveals on hover with its palette color */}
            <span
                className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 text-center translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap mt-2 h-4 text-black dark:text-white"
            >
                {name}
            </span>
        </div>
    );
}
