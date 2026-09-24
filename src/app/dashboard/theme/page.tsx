'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Palette, Sun, Moon, Globe, Check, Layers, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from '@/context/ThemeContext'
import { updateAccentColor, getProfile } from '@/actions/profile'
import en from '@/messages/en.json'
import id from '@/messages/id.json'

const PRESET_COLORS = [
  { name: 'Monochrome', color: '#000000', isMonochrome: true },
  { name: 'Emerald', color: '#00c896' },
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Teal', color: '#14b8a6' },
]

export default function ThemePage() {
  const router = useRouter()
  const { isDark, toggle, themeStyle, setThemeStyle } = useTheme()
  const [accentColor, setAccentColor] = useState('#00c896')
  const [customColor, setCustomColor] = useState('#00c896')
  const [locale, setLocale] = useState('en')
  const [saving, setSaving] = useState(false)

  const t = useMemo(() => {
    const messages = locale === 'id' ? id : en
    return (key: string): string => {
      const parts = key.split('.')
      let val: any = messages
      for (const p of parts) {
        val = val?.[p]
      }
      return typeof val === 'string' ? val : key
    }
  }, [locale])

  useEffect(() => {
    const savedColor = localStorage.getItem('accent_color')
    if (savedColor) {
      setAccentColor(savedColor)
      setCustomColor(savedColor)
    }
    const savedLocale = localStorage.getItem('portfolio_locale')
    if (savedLocale) setLocale(savedLocale)

    getProfile().then((data: any) => {
      if (data?.accentColor) {
        setAccentColor(data.accentColor)
        setCustomColor(data.accentColor)
        if (data.accentColor === '#000000' || data.accentColor === 'monochrome') {
          setThemeStyle('monochrome')
        }
      }
    }).catch(() => {})
  }, [setThemeStyle])

  const handleAccentChange = async (color: string) => {
    setAccentColor(color)
    setCustomColor(color)

    if (color === '#000000' || color === 'monochrome') {
      setThemeStyle('monochrome')
      localStorage.setItem('portfolio_theme_style', 'monochrome')
    } else {
      setThemeStyle('default')
      localStorage.setItem('portfolio_theme_style', 'default')
      document.documentElement.style.setProperty('--accent', color)
    }

    localStorage.setItem('accent_color', color)
    setSaving(true)
    try {
      await updateAccentColor(color)
      toast.success(color === '#000000' ? 'Tema Monokrom Flat aktif' : 'Warna utama disimpan')
    } catch {
      toast.error('Gagal menyimpan warna')
    }
    setSaving(false)
  }

  const handleStyleSelect = (style: 'default' | 'monochrome') => {
    setThemeStyle(style)
    if (style === 'monochrome') {
      handleAccentChange('#000000')
    } else {
      const fallbackColor = accentColor === '#000000' ? '#f59e0b' : accentColor
      handleAccentChange(fallbackColor)
    }
  }

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
    localStorage.setItem('portfolio_locale', newLocale)
    window.dispatchEvent(new Event('locale-changed'))
  }

  return (
    <div className="space-y-6">
      {/* Dark/Light Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {isDark ? <Moon size={18} className="text-slate-600 dark:text-slate-300" /> : <Sun size={18} className="text-slate-600 dark:text-slate-300" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.appearance')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.appearance_desc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => isDark && toggle()}
            className={`relative rounded-xl border-2 p-4 transition-all ${!isDark ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <div className="w-full h-20 rounded-lg bg-white border border-slate-200 mb-3 flex items-center justify-center">
              <Sun size={24} className="text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.light')}</p>
            {!isDark && <Check size={16} className="absolute top-3 right-3 text-[var(--accent)]" />}
          </button>
          <button
            onClick={() => !isDark && toggle()}
            className={`relative rounded-xl border-2 p-4 transition-all ${isDark ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <div className="w-full h-20 rounded-lg bg-slate-900 border border-slate-700 mb-3 flex items-center justify-center">
              <Moon size={24} className="text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.dark')}</p>
            {isDark && <Check size={16} className="absolute top-3 right-3 text-[var(--accent)]" />}
          </button>
        </div>
      </div>

      {/* Theme Style: Default vs Monochrome Flat */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Layers size={18} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.theme_style')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.theme_style_desc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Default Style */}
          <button
            onClick={() => handleStyleSelect('default')}
            className={`relative text-left rounded-xl border-2 p-4 transition-all flex flex-col justify-between ${themeStyle !== 'monochrome' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <div className="w-full h-20 rounded-lg bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-slate-200 dark:border-slate-700 mb-3 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 shadow-sm" />
                <div className="h-2 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                Gradient
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{t('admin.style_default')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('admin.style_default_desc')}</p>
            </div>
            {themeStyle !== 'monochrome' && <Check size={16} className="absolute top-3 right-3 text-[var(--accent)]" />}
          </button>

          {/* Monochrome Flat Style */}
          <button
            onClick={() => handleStyleSelect('monochrome')}
            className={`relative text-left rounded-xl border-2 p-4 transition-all flex flex-col justify-between ${themeStyle === 'monochrome' ? 'border-slate-950 dark:border-white bg-black/5 dark:bg-white/5 ring-1 ring-black dark:ring-white' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <div className="w-full h-20 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 mb-3 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-black dark:bg-white border border-zinc-400 dark:border-zinc-600" />
                <div className="h-1.5 w-12 rounded bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black text-white dark:bg-white dark:text-black border border-zinc-300 dark:border-zinc-700">
                1px Flat
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {t('admin.style_monochrome')}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black">
                  New
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('admin.style_monochrome_desc')}</p>
            </div>
            {themeStyle === 'monochrome' && <Check size={16} className="absolute top-3 right-3 text-slate-950 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Palette size={18} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.accent_color')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.accent_color_desc')}</p>
          </div>
          {saving && <span className="text-xs text-slate-400 ml-auto">{t('admin.saving')}</span>}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 mb-4">
          {PRESET_COLORS.map(({ name, color, isMonochrome }) => {
            const isSelected = accentColor === color || (isMonochrome && themeStyle === 'monochrome')
            return (
              <button
                key={color}
                onClick={() => handleAccentChange(color)}
                className={`relative rounded-xl border-2 p-3 transition-all flex flex-col items-center gap-2 ${isSelected ? 'border-slate-900 dark:border-white scale-105 ring-1 ring-slate-900 dark:ring-white' : 'border-slate-200 dark:border-slate-700 hover:scale-105'}`}
              >
                {isMonochrome ? (
                  <div className="w-8 h-8 rounded-full border border-zinc-400 dark:border-zinc-500 overflow-hidden relative shadow-sm" style={{ background: 'linear-gradient(135deg, #09090b 50%, #ffffff 50%)' }} />
                ) : (
                  <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                )}
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[60px]">{name}</span>
                {isSelected && <Check size={14} className="absolute top-1.5 right-1.5 text-slate-900 dark:text-white" />}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            onBlur={() => handleAccentChange(customColor)}
            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer flex-shrink-0"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              const val = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                setCustomColor(val)
              }
            }}
            onBlur={() => handleAccentChange(customColor)}
            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-xs font-mono focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            placeholder="#00c896"
          />
        </div>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Globe size={18} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.language')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.language_desc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLocaleChange('en')}
            className={`relative rounded-xl border-2 p-4 transition-all text-left ${locale === 'en' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <p className="text-lg mb-1">🇬🇧</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">English</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.english_version')}</p>
            {locale === 'en' && <Check size={16} className="absolute top-3 right-3 text-[var(--accent)]" />}
          </button>
          <button
            onClick={() => handleLocaleChange('id')}
            className={`relative rounded-xl border-2 p-4 transition-all text-left ${locale === 'id' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
          >
            <p className="text-lg mb-1">🇮🇩</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Indonesia</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.indonesian_version')}</p>
            {locale === 'id' && <Check size={16} className="absolute top-3 right-3 text-[var(--accent)]" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">{t('admin.language_note')}</p>
      </div>
    </div>
  )
}

