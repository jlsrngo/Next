import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../messages/en.json'
import id from '../messages/id.json'

export type Locale = 'en' | 'id'
const messages: Record<Locale, any> = { en, id }

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, values?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => k,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolio_locale') as Locale
      if (stored === 'en' || stored === 'id') return stored
    }
    return 'en'
  })

  useEffect(() => {
    const onLocaleChanged = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_locale') as Locale
        if (stored === 'en' || stored === 'id') {
          setLocaleState(stored)
        }
      }
    }
    window.addEventListener('locale-changed', onLocaleChanged)
    window.addEventListener('storage', onLocaleChanged)
    return () => {
      window.removeEventListener('locale-changed', onLocaleChanged)
      window.removeEventListener('storage', onLocaleChanged)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_locale', newLocale)
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
      window.dispatchEvent(new Event('locale-changed'))
    }
  }

  const resolveValue = (dict: any, path: string): string | null => {
    const keys = path.split('.')
    let current: any = dict
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return null
      }
    }
    return typeof current === 'string' ? current : null
  }

  const t = (path: string, values?: Record<string, string | number>): string => {
    let raw = resolveValue(messages[locale], path)
    if (raw === null && locale !== 'en') {
      raw = resolveValue(messages.en, path)
    }

    if (raw !== null) {
      if (values) {
        let text = raw
        for (const [key, val] of Object.entries(values)) {
          text = text.replace(new RegExp(`{${key}}`, 'g'), String(val))
        }
        return text
      }
      return raw
    }

    return path
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslations = (namespace?: string) => {
  const { t } = useContext(I18nContext)
  if (!namespace) return t
  return (key: string, values?: Record<string, string | number>) => {
    const prefixed = `${namespace}.${key}`
    const result = t(prefixed, values)
    if (result !== prefixed) return result
    return t(key, values)
  }
}

export const useLocale = () => {
  const { locale } = useContext(I18nContext)
  return locale
}

export const useI18n = () => useContext(I18nContext)
