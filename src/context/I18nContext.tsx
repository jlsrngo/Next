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

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_locale', newLocale)
    }
  }

  const t = (path: string, values?: Record<string, string | number>): string => {
    const keys = path.split('.')
    let current: any = messages[locale]
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // Fallback to en
        let fallback: any = messages.en
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk]
          } else {
            fallback = null
            break
          }
        }
        if (typeof fallback === 'string') current = fallback
        else return path
        break
      }
    }

    if (typeof current === 'string') {
      if (values) {
        let text = current
        for (const [key, val] of Object.entries(values)) {
          text = text.replace(new RegExp(`{${key}}`, 'g'), String(val))
        }
        return text
      }
      return current
    }

    return path
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslations = () => {
  const { t } = useContext(I18nContext)
  return t
}

export const useLocale = () => {
  const { locale } = useContext(I18nContext)
  return locale
}

export const useI18n = () => useContext(I18nContext)
