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
    const { iconName, gradient } = getSkillIconData(iconSlug || '');
    const IconComponent = loadIcon(iconName);

    return (
        <div className="group flex flex-col items-center w-14 md:w-20 gap-1 md:gap-2 cursor-pointer pt-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16 transition-all duration-300 z-10 block">
                <div
                    className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out translate-x-2 -translate-y-2 rotate-[15deg] group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:rotate-[35deg] bg-gradient-to-br ${gradient}`}
                    style={{ willChange: 'transform' }}
                />
                <div className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-white/15 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-transform duration-300 z-10 group-hover:scale-105">
                    {IconComponent ? (
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-white transition-all duration-300 relative z-20" />
                    ) : (
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black/10 dark:bg-white/10 rounded animate-pulse relative z-20" />
                    )}
                </div>
                {showDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity z-30 hover:scale-110"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            <span className="text-[11px] font-semibold tracking-normal text-black dark:text-zinc-300 transition-all duration-300 text-center -translate-y-2 group-hover:translate-y-0 relative z-0 opacity-0 group-hover:opacity-100 shadow-none">
                {name}
            </span>
        </div>
    );
}
