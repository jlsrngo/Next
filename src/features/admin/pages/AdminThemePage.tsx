import React from 'react';
import { Palette, Sun, Moon, Check, Monitor, Globe } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';

export default function AdminThemePage() {
  const { isDark, toggle } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <div className="border-b border-line pb-5">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          [ 07 // SYSTEM APPEARANCE & BRUTALIST TOKENS ]
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          THEME // <span className="font-mono text-faint font-normal">SPECIFICATION</span>
        </h1>
        <p className="text-xs text-faint mt-1 font-mono">
          Swiss Brutalist color token configurations, contrast ratios, and typography specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Mode Selector */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            [ DISPLAY MODE ]
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (isDark) toggle();
              }}
              className={`border p-4 text-left transition-all ${
                !isDark
                  ? 'border-line-strong bg-bg font-bold shadow-xs'
                  : 'border-line bg-bg-raised text-faint hover:text-ink'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sun size={20} className={!isDark ? 'text-amber-500' : 'text-faint'} />
                {!isDark && <Check size={16} />}
              </div>
              <div className="font-mono text-xs uppercase font-bold text-ink">LIGHT MODE</div>
              <div className="font-mono text-[10px] text-faint mt-0.5">High-contrast daylight paper</div>
            </button>

            <button
              onClick={() => {
                if (!isDark) toggle();
              }}
              className={`border p-4 text-left transition-all ${
                isDark
                  ? 'border-line-strong bg-bg font-bold shadow-xs'
                  : 'border-line bg-bg-raised text-faint hover:text-ink'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Moon size={20} className={isDark ? 'text-indigo-400' : 'text-faint'} />
                {isDark && <Check size={16} />}
              </div>
              <div className="font-mono text-xs uppercase font-bold text-ink">DARK MODE</div>
              <div className="font-mono text-[10px] text-faint mt-0.5">Midnight brutalist contrast</div>
            </button>
          </div>
        </div>

        {/* Color Tokens Matrix */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            [ DESIGN SYSTEM TOKENS ]
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">BACKGROUND CANVAS</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-line bg-bg inline-block" />
                <span className="font-bold">var(--bg)</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">RAISED SURFACE</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-line bg-bg-raised inline-block" />
                <span className="font-bold">var(--bg-raised)</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">HAIRLINE BORDER</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-line bg-line inline-block" />
                <span className="font-bold">var(--line)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-faint">PRIMARY INK</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-line bg-ink inline-block" />
                <span className="font-bold">var(--ink)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Language Selector */}
        <div className="border border-line bg-bg-raised p-6 relative md:col-span-2">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-2">
            [ {t('admin.language') || 'LANGUAGE CONFIGURATION'} ]
          </div>
          <p className="font-mono text-xs text-faint mb-4">
            {t('admin.language_desc') || 'Select the active system locale for both Admin Workstation and Public interfaces.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setLocale('en')}
              className={`border p-4 text-left transition-all ${
                locale === 'en'
                  ? 'border-line-strong bg-bg font-bold shadow-xs'
                  : 'border-line bg-bg-raised text-faint hover:text-ink'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Globe size={18} className={locale === 'en' ? 'text-ink' : 'text-faint'} />
                {locale === 'en' && <Check size={16} />}
              </div>
              <div className="font-mono text-xs uppercase font-bold text-ink">ENGLISH [EN]</div>
              <div className="font-mono text-[10px] text-faint mt-0.5">International standard specification</div>
            </button>

            <button
              onClick={() => setLocale('id')}
              className={`border p-4 text-left transition-all ${
                locale === 'id'
                  ? 'border-line-strong bg-bg font-bold shadow-xs'
                  : 'border-line bg-bg-raised text-faint hover:text-ink'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Globe size={18} className={locale === 'id' ? 'text-ink' : 'text-faint'} />
                {locale === 'id' && <Check size={16} />}
              </div>
              <div className="font-mono text-xs uppercase font-bold text-ink">INDONESIAN [ID]</div>
              <div className="font-mono text-[10px] text-faint mt-0.5">Bahasa Indonesia terlokalisasi penuh</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

