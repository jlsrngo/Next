'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import TechnicalRuler from '@/components/TechnicalRuler'
import {
  LayoutDashboard,
  User,
  Code,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Trophy,
  Link2,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Loader2,
  Palette,
  Settings,
  Tag,
} from 'lucide-react'
import { optimizeCloudinaryUrl } from '@/utils/cloudinary'
import { getLatestVersion, type ChangelogEntry } from '@/lib/changelog'
import en from '@/messages/en.json'
import id from '@/messages/id.json'

type NavItem =
  | { divider: true }
  | { href: string; labelKey: string; icon: any }

const navItems: NavItem[] = [
  { href: '/admin', labelKey: 'admin.overview', icon: LayoutDashboard },
  { divider: true },
  { href: '/admin/profile', labelKey: 'admin.profile', icon: User },
  { href: '/admin/skills', labelKey: 'admin.skills', icon: Code },
  { href: '/admin/projects', labelKey: 'admin.projects', icon: FolderOpen },
  { href: '/admin/experiences', labelKey: 'admin.experiences', icon: Briefcase },
  { href: '/admin/education', labelKey: 'admin.education', icon: GraduationCap },
  { href: '/admin/achievements', labelKey: 'admin.achievements', icon: Trophy },
  { href: '/admin/social-links', labelKey: 'admin.social_links', icon: Link2 },
  { divider: true },
  { href: '/admin/theme', labelKey: 'admin.theme', icon: Palette },
  { href: '/admin/account', labelKey: 'admin.account', icon: Settings },
  { href: '/admin/changelog', labelKey: 'admin.changelog', icon: Tag },
]

function getPageTitle(pathname: string, t: (key: string) => string): string {
  if (pathname === '/admin' || pathname === '/dashboard') return t('admin.overview')
  const segments = pathname.split('/').filter(Boolean)
  const page = segments[segments.length - 1]
  const parent = segments.length > 2 ? segments[segments.length - 2] : ''

  if (segments.length === 2) {
    const key = `admin.${page}`
    const translated = t(key)
    return translated !== key ? translated : page.charAt(0).toUpperCase() + page.slice(1)
  }

  if (page === 'new') {
    const parentKey = `admin.${parent}`
    const parentName = t(parentKey) !== parentKey ? t(parentKey) : parent
    return `${t('admin.add_new')} ${parentName}`
  }

  if (segments[segments.length - 1] === 'edit' || segments[segments.length - 2] === 'edit') {
    const mainSection = segments[1]
    const sectionKey = `admin.${mainSection}`
    const sectionName = t(sectionKey) !== sectionKey ? t(sectionKey) : mainSection
    return `${t('admin.edit')} ${sectionName}`
  }

  return page.charAt(0).toUpperCase() + page.slice(1)
}

interface DashboardShellProps {
  children: React.ReactNode
  email?: string | null
  profileName?: string | null
  profileAvatar?: string | null
  profileAccent?: string | null
}

export default function DashboardShell({
  children,
  email,
  profileName: initialName,
  profileAvatar: initialAvatar,
  profileAccent: initialAccent,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggle } = useTheme()
  const [latestVersion, setLatestVersion] = useState<ChangelogEntry | null>(null)
  const mainRef = useRef<HTMLElement>(null)

  const [fullName, setFullName] = useState<string | null>(initialName ?? null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar ?? null)

  const [locale, setLocale] = useState<string>('en')

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [pathname])

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_locale')
    if (saved) setLocale(saved)
  }, [])

  const messages = useMemo(() => (locale === 'id' ? id : en), [locale])

  const t = (key: string): string => {
    const keys = key.split('.')
    let current: any = messages
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return key
      }
    }
    return typeof current === 'string' ? current : key
  }

  useEffect(() => {
    const ver = getLatestVersion()
    if (ver) {
      setLatestVersion(ver)
    }
  }, [])

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setFullName(data.fullName || data.name || null)
          setAvatarUrl(optimizeCloudinaryUrl(data.avatarUrl || data.avatar_url))
        }
      })
      .catch(() => {})
  }, [pathname])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin' || pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const pageTitle = getPageTitle(pathname, t)

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-ink font-sans blueprint-grid select-none">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Swiss Brutalist Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-bg-raised border-r border-line transition-transform duration-150 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header HUD / Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-line shrink-0 bg-bg-raised">
          <div className="w-8 h-8 border border-line bg-bg flex items-center justify-center font-mono font-bold text-xs">
            SYS
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-display font-bold tracking-tight text-ink block truncate">
              CONTROL PANEL
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-faint block">
              v{latestVersion?.version || '1.0.0'} // DAEMON
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 border border-line text-ink hover:bg-bg-sunken lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 no-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item, idx) => {
              if ('divider' in item) {
                return (
                  <li key={idx} className="pt-3 pb-1 border-b border-line/40">
                    <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-faint">
                      {idx === 1 ? '[ 01 // CONTENT MATRICES ]' : '[ 02 // CONFIGURATION ]'}
                    </span>
                  </li>
                )
              }
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-mono tracking-wider uppercase transition-all border ${
                      active
                        ? 'bg-invert-bg text-invert-fg border-line font-bold'
                        : 'text-ink/80 hover:text-ink hover:bg-bg-sunken border-transparent hover:border-line'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-invert-fg' : 'text-ink'} />
                    <span className="truncate">{t(item.labelKey)}</span>
                    {active && <ChevronRight size={12} className="ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Actions: Directly Return to Public Site (No 404 signout) */}
        <div className="border-t border-line p-3 shrink-0 bg-bg-raised">
          <Link
            href="/"
            className="flex items-center justify-between border border-line px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-ink hover:bg-bg-sunken hover:border-line-strong transition-all"
          >
            <span className="flex items-center gap-2 font-bold">
              <ExternalLink size={14} />
              <span>{t('admin.view_site') || 'BACK TO PUBLIC SITE'}</span>
            </span>
            <span className="font-bold text-xs">→</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 bg-bg">
        {/* Top Telemetry Header - Same h-16 as sidebar header so border-b connects continuously */}
        <header className="flex h-16 items-center justify-between border-b border-line bg-bg-raised px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 border border-line text-ink hover:bg-bg-sunken lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 bg-black dark:bg-white inline-block animate-pulse" />
              <h1 className="font-bold text-ink">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-1.5 border border-line hover:border-line-strong text-ink hover:bg-bg-sunken transition-colors"
              title={isDark ? t('admin.switch_to_light') : t('admin.switch_to_dark')}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div className="h-4 w-px bg-line" />

            {/* Admin Identity Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 border border-line bg-bg-sunken overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User size={13} className="text-ink" />
                )}
              </div>
              <div className="hidden sm:block text-right">
                <p className="font-mono text-xs font-bold text-ink leading-none">{fullName || 'Julio Siringoringo'}</p>
                <p className="font-mono text-[9px] text-faint tracking-wider mt-0.5">{email || 'admin@portfolio.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body with Swiss Brutalist Layout & Technical Ruler */}
        <div className="relative flex-1 overflow-hidden flex min-h-0">
          <main
            ref={mainRef}
            className="flex-1 h-full overflow-y-auto px-4 sm:px-6 md:pl-8 md:pr-24 lg:pl-10 lg:pr-28 py-4 sm:py-6 md:py-8 select-text scroll-smooth"
          >
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>

          <TechnicalRuler scrollContainerRef={mainRef} />
        </div>
      </div>
    </div>
  )
}
