'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type ThemeStyle = 'default' | 'monochrome'

interface ThemeContextType {
  isDark: boolean
  toggle: () => void
  themeStyle: ThemeStyle
  setThemeStyle: (style: ThemeStyle) => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggle: () => {},
  themeStyle: 'default',
  setThemeStyle: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({
  children,
  initialMonochrome = false,
  initialAccentColor,
}: {
  children: React.ReactNode
  initialMonochrome?: boolean
  initialAccentColor?: string
}) {
  const [isDark, setIsDark] = useState(true)
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(() => (initialMonochrome ? 'monochrome' : 'default'))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const shouldBeDark = storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(shouldBeDark)

    const storedStyle = localStorage.getItem('portfolio_theme_style') as ThemeStyle | null
    const storedColor = localStorage.getItem('accent_color')
    if (storedStyle === 'monochrome' || storedColor === '#000000' || storedColor === 'monochrome') {
      setThemeStyleState('monochrome')
    } else if (storedStyle === 'default' && storedColor && storedColor !== '#000000' && storedColor !== 'monochrome') {
      setThemeStyleState('default')
    } else if (initialMonochrome) {
      setThemeStyleState('monochrome')
    }
    setReady(true)
  }, [initialMonochrome])

  const applyThemeStyle = useCallback((style: ThemeStyle, dark: boolean) => {
    const root = document.documentElement
    if (style === 'monochrome') {
      root.classList.add('theme-monochrome')
      root.setAttribute('data-theme-style', 'monochrome')
      root.style.setProperty('--accent', dark ? '#ffffff' : '#09090b')
      localStorage.setItem('portfolio_theme_style', 'monochrome')
    } else {
      root.classList.remove('theme-monochrome')
      root.removeAttribute('data-theme-style')
      const savedColor = localStorage.getItem('accent_color') || initialAccentColor || '#00c896'
      if (savedColor !== '#000000' && savedColor !== 'monochrome') {
        root.style.setProperty('--accent', savedColor)
      }
      localStorage.setItem('portfolio_theme_style', 'default')
    }
  }, [initialAccentColor])

  useEffect(() => {
    if (!ready) return
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    applyThemeStyle(themeStyle, isDark)
  }, [isDark, themeStyle, ready, applyThemeStyle])

  const toggle = useCallback(() => setIsDark((prev) => !prev), [])

  const setThemeStyle = useCallback((style: ThemeStyle) => {
    setThemeStyleState(style)
    applyThemeStyle(style, isDark)
    window.dispatchEvent(new Event('theme-style-changed'))
  }, [isDark, applyThemeStyle])

  useEffect(() => {
    const handler = () => {
      const storedStyle = localStorage.getItem('portfolio_theme_style') as ThemeStyle | null
      const storedColor = localStorage.getItem('accent_color')
      if (storedStyle === 'monochrome' || storedColor === '#000000' || storedColor === 'monochrome') {
        setThemeStyleState('monochrome')
      } else {
        setThemeStyleState('default')
      }
    }
    window.addEventListener('theme-style-changed', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('theme-style-changed', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggle, themeStyle, setThemeStyle }}>
      {children}
    </ThemeContext.Provider>
  )
}

