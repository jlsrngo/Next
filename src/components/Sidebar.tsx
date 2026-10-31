'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { Home, User, Trophy, FolderOpen, BarChart3, Mail, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useI18n } from '@/context/I18nContext'
import { useSession, signOut } from 'next-auth/react'
import LoginModal from '@/components/LoginModal'
import { optimizeCloudinaryUrl } from '@/utils/cloudinary'

interface Profile {
    id: number
    name: string
    username: string | null
    bio_home: string | null
    bio_about: string | null
    location: string | null
    work_status: string | null
    avatar_url: string | null
    github_url: string | null
    linkedin_url: string | null
    instagram_url: string | null
    accent_color: string | null
}

interface SidebarProps {
    profile?: Profile | null
}

const Sidebar: React.FC<SidebarProps> = ({ profile: profileProp }) => {
    const { isDark, toggle } = useTheme()
    const { data: session } = useSession()
    const isAuthenticated = !!session
    const { locale, setLocale, t } = useI18n()
    const router = useRouter()
    const pathname = usePathname()
    const [profile, setProfile] = useState<Profile | null>(profileProp ?? null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const navItems = [
        { to: '/', icon: Home, label: t('nav.home') },
        { to: '/about', icon: User, label: t('nav.about') },
        { to: '/achievements', icon: Trophy, label: t('nav.achievements') },
        { to: '/projects', icon: FolderOpen, label: t('nav.projects') },
        { to: '/github', icon: BarChart3, label: t('nav.dashboard') },
        { to: '/contact', icon: Mail, label: t('nav.contact') },
    ]

    const fetchProfile = () => {
        fetch('/api/profile')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) setProfile(data)
            })
            .catch(() => {})
    }

    useEffect(() => {
        if (profileProp) {
            setProfile(profileProp)
            return
        }
        fetchProfile()
    }, [profileProp])

    useEffect(() => {
        // Only apply saved locale on very first visit (no locale in URL yet)
        const hasLocaleInUrl = /^\/(en|id)(\/|$)/.test(window.location.pathname)
        if (!hasLocaleInUrl) {
            const savedLocale = localStorage.getItem('portfolio_locale')
            if (savedLocale && (savedLocale === 'en' || savedLocale === 'id')) {
                router.push(pathname, { locale: savedLocale as 'en' | 'id' })
            }
        }
    }, [])

    useEffect(() => {
        const savedStyle = localStorage.getItem('portfolio_theme_style')
        const color = profile?.accent_color || localStorage.getItem('accent_color')
        const isMono = savedStyle === 'monochrome' || color === '#000000' || color === 'monochrome'

        if (isMono) {
            document.documentElement.classList.add('theme-monochrome')
            document.documentElement.setAttribute('data-theme-style', 'monochrome')
            document.documentElement.style.setProperty('--accent', isDark ? '#ffffff' : '#09090b')
            localStorage.setItem('portfolio_theme_style', 'monochrome')
        } else if (color) {
            document.documentElement.classList.remove('theme-monochrome')
            document.documentElement.removeAttribute('data-theme-style')
            document.documentElement.style.setProperty('--accent', color)
            localStorage.setItem('accent_color', color)
        }
    }, [profile?.accent_color, isDark])

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        } else {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
    }, [mobileOpen])

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const handleLanguageSwitch = (lang: 'en' | 'id') => {
        if (lang === locale) return
        localStorage.setItem('portfolio_locale', lang)
        document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`
        setLocale(lang)
    }

    const avatarUrl = optimizeCloudinaryUrl(profile?.avatar_url)

    const sidebarContent = (
        <>
            {/* Profile Section */}
            <div className="p-6 text-center relative border-b border-line mb-3">
                <div className="w-20 h-20 mx-auto mb-3 rounded-none overflow-hidden bg-bg-sunken border border-line flex items-center justify-center">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                        />
                    ) : (
                        <User className="w-8 h-8 text-ink" />
                    )}
                </div>
                <h3 className="font-display font-bold text-base text-ink tracking-tight">{profile?.name || 'Your Name'}</h3>
                <p className="hud-label text-[10px] mt-1">
                    {profile?.username || 'developer'}
                </p>

                {/* Language Toggle */}
                <div className="flex justify-center mt-4">
                    <div className="flex bg-bg-sunken p-0.5 rounded-none border border-line">
                        <button
                            onClick={() => handleLanguageSwitch('en')}
                            className={`px-3 py-0.5 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-150 ${locale === 'en' ? 'bg-invert-bg text-invert-fg' : 'text-faint hover:text-ink'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleLanguageSwitch('id')}
                            className={`px-3 py-0.5 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-150 ${locale === 'id' ? 'bg-invert-bg text-invert-fg' : 'text-faint hover:text-ink'}`}
                        >
                            ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        prefetch={true}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-[11px] uppercase tracking-[0.12em] font-bold border transition-colors duration-150 ${isActive(item.to)
                            ? 'bg-invert-bg text-invert-fg border-transparent shadow-none'
                            : 'border-transparent text-ink hover:border-line hover:bg-bg-sunken'
                        }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Bottom Area */}
            <div className="px-5 pb-5">
                <div className="border-t border-line pt-4 mb-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggle}
                            className="p-2 rounded-none border border-line hover:border-line-strong text-ink hover:bg-bg-sunken transition-colors"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="relative w-8 h-8 rounded-none border border-line overflow-hidden hover:border-ink transition-colors group flex items-center justify-center bg-bg-sunken"
                                title="Dashboard"
                            >
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="User" width={32} height={32} unoptimized className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-ink" />
                                )}
                            </Link>
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className="p-2 rounded-none border border-line hover:border-line-strong text-ink hover:bg-bg-sunken transition-colors"
                                title="Login"
                            >
                                <User className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-center font-mono text-[9px] uppercase tracking-wider text-faint leading-relaxed mt-2">
                    <p suppressHydrationWarning>© {new Date().getFullYear()} {profile?.name || 'Julio Siringoringo'}</p>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bg-raised border-b border-line flex items-center justify-between px-4">
                <h1 className="font-display font-bold text-sm tracking-tight text-ink">{profile?.name || 'Portfolio'}</h1>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-none border border-line text-ink hover:bg-bg-sunken">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar — sticky within centered container */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[260px] flex-shrink-0 bg-bg-raised border-r border-line flex-col overflow-hidden no-scrollbar z-30">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar — fixed overlay */}
            <aside
                className={`lg:hidden fixed top-0 left-0 z-40 h-[100dvh] w-[240px] bg-bg-raised border-r border-line flex flex-col transition-transform duration-200 ease-in-out overflow-hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex-1 overflow-hidden w-full no-scrollbar pb-20">
                    {sidebarContent}
                </div>
            </aside>

            {/* Login Modal — rendered once outside sidebar content to avoid double mount */}
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
    )
}

export default Sidebar
