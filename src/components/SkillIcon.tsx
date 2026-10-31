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
        <div className="group flex flex-col items-center w-16 md:w-20 gap-1.5 cursor-pointer pt-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16 transition-all duration-300 z-10 block">
                <div
                    className={`skill-icon-backdrop absolute inset-0 rounded-none transition-all duration-300 ease-out translate-x-1 -translate-y-1 group-hover:translate-x-2 group-hover:-translate-y-2 bg-gradient-to-br ${gradient} opacity-25`}
                    style={{ willChange: 'transform' }}
                />
                <div className="skill-icon-surface absolute inset-0 rounded-none bg-bg-raised border border-line flex items-center justify-center transition-colors duration-200 z-10 group-hover:border-ink">
                    {IconComponent ? (
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-ink transition-transform duration-200 group-hover:scale-110 relative z-20" />
                    ) : (
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black/10 dark:bg-white/10 rounded-none animate-pulse relative z-20" />
                    )}
                </div>
                {showDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-invert-bg text-invert-fg border border-line rounded-none flex items-center justify-center transition-opacity z-30 hover:scale-105"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-ink transition-colors text-center line-clamp-1 max-w-full">
                {name}
            </span>
        </div>
    );
}
