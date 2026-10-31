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
        <div className="group flex flex-col items-center w-16 md:w-20 gap-1.5 cursor-pointer pt-2 select-none">
            <div className="relative w-12 h-12 md:w-16 md:h-16 transition-all duration-300 z-10 block">
                {/* Backdrop Card that moves out and rotates on hover like original */}
                <div
                    className={`skill-icon-backdrop absolute inset-0 transition-all duration-300 ease-out translate-x-1.5 -translate-y-1.5 rotate-[12deg] group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:rotate-[30deg] bg-gradient-to-br ${gradient} opacity-35 group-hover:opacity-75`}
                    style={{ willChange: 'transform' }}
                />
                {/* Surface Card with Icon */}
                <div className="skill-icon-surface absolute inset-0 bg-bg-raised border border-line flex items-center justify-center transition-all duration-300 z-10 group-hover:border-ink group-hover:scale-105">
                    {IconComponent ? (
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-ink transition-transform duration-300 relative z-20 group-hover:scale-110" />
                    ) : (
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black/10 dark:bg-white/10 rounded-2xl animate-pulse relative z-20" />
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
            {/* Label: Hidden by default (opacity-0), only appears on hover (group-hover:opacity-100) */}
            <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-ink transition-all duration-200 text-center -translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap h-4">
                {name}
            </span>
        </div>
    );
}
