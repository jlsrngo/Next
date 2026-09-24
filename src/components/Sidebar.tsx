'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { Home, User, Trophy, FolderOpen, BarChart3, Mail, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useTranslations, useLocale } from 'next-intl'
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
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [profile, setProfile] = useState<Profile | null>(profileProp ?? null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [displayLocale, setDisplayLocale] = useState(locale)
    const [isSwitching, setIsSwitching] = useState(false)

    useEffect(() => {
        setDisplayLocale(locale)
    }, [locale])

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
        setDisplayLocale(lang)
        setIsSwitching(true)
        router.replace(pathname, { locale: lang })
    }

    const avatarUrl = optimizeCloudinaryUrl(profile?.avatar_url)

    const sidebarContent = (
        <>
            {/* Profile Section */}
            <div className="p-8 text-center relative border-b border-slate-200 dark:border-white/10 mb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center ring-2 ring-accent/20">
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
                        <User className="w-10 h-10 text-black dark:text-white" />
                    )}
                </div>
                <h3 className="font-bold text-base text-black dark:text-white">{profile?.name || 'Your Name'}</h3>
                <p className="text-sm text-black dark:text-white mt-1 font-bold">
                    {profile?.username || 'username'}
                </p>

                {/* Language Toggle */}
                <div className="flex justify-center mt-5">
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => handleLanguageSwitch('en')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 ${displayLocale === 'en' ? 'bg-accent text-white' : 'text-black dark:text-white hover:text-accent'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleLanguageSwitch('id')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 ${displayLocale === 'id' ? 'bg-accent text-white' : 'text-black dark:text-white hover:text-accent'}`}
                        >
                            ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        prefetch={true}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 ${isActive(item.to)
                            ? 'bg-accent text-white'
                            : 'text-black dark:text-white hover:bg-accent/10 hover:text-accent'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Bottom Area */}
            <div className="px-6 pb-6">
                <div className="border-t border-slate-200 dark:border-white/10 pt-6 mb-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggle}
                            className="p-2.5 rounded-xl hover:bg-black/10 text-black dark:text-white hover:text-accent transition-all duration-150"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </button>

                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="relative w-9 h-9 rounded-full overflow-hidden hover:ring-2 ring-accent transition-all duration-300 group"
                                title="Dashboard"
                            >
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="User" width={36} height={36} unoptimized className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                ) : (
                                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-accent" />
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className="p-2.5 rounded-xl hover:bg-black/10 text-black dark:text-white hover:text-accent transition-all duration-150"
                                title="Login"
                            >
                                <User className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-center text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium mt-4">
                    <p suppressHydrationWarning>Copyright © {new Date().getFullYear()} {profile?.name || 'Julio Siringoringo'}</p>
                    <p>{t('allRightsReserved')}</p>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-light-sidebar dark:bg-dark-sidebar border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6">
                <h1 className="font-bold text-base tracking-tight">{profile?.name || 'Portfolio'}</h1>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-accent/10 text-accent transition-all duration-150">
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar — sticky within centered container */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[260px] flex-shrink-0 bg-light-sidebar dark:bg-dark-sidebar border-r border-slate-200 dark:border-white/10 flex-col overflow-hidden no-scrollbar z-30">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar — fixed overlay */}
            <aside
                className={`lg:hidden fixed top-0 left-0 z-40 h-[100dvh] w-[240px] bg-light-sidebar dark:bg-dark-sidebar border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-200 ease-in-out overflow-hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex-1 overflow-hidden w-full no-scrollbar pb-20">
                    {sidebarContent}
                </div>
            </aside>

            {/* Login Modal — rendered once outside sidebar content to avoid double mount */}
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

            {/* Language Switch Loading Overlay — content area only */}
            {isSwitching && (
                <div className="fixed top-0 left-0 lg:left-[260px] right-0 bottom-0 z-[25] bg-light-bg dark:bg-dark-bg overflow-hidden animate-fade-in">
                    <div className="py-12 md:py-20 px-6 lg:px-16 space-y-16 animate-pulse">
                        <div className="space-y-4">
                            <div className="h-10 w-64 bg-black/5 dark:bg-white/5 rounded-lg" />
                            <div className="h-4 w-48 bg-black/5 dark:bg-white/5 rounded" />
                            <div className="space-y-2 pt-2">
                                <div className="h-4 w-full bg-black/5 dark:bg-white/5 rounded" />
                                <div className="h-4 w-5/6 bg-black/5 dark:bg-white/5 rounded" />
                                <div className="h-4 w-3/4 bg-black/5 dark:bg-white/5 rounded" />
                            </div>
                        </div>
                        <div className="border-t border-black/5 dark:border-white/5 pt-8 space-y-8">
                            <div className="space-y-2">
                                <div className="h-6 w-32 bg-black/5 dark:bg-white/5 rounded" />
                                <div className="h-3 w-48 bg-black/5 dark:bg-white/5 rounded" />
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl" />
                                        <div className="h-2 w-8 bg-black/5 dark:bg-white/5 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar
