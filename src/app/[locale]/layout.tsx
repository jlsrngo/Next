import { Providers } from '@/components/Providers'
import { getMessages } from 'next-intl/server'
import { Locale, routing } from '@/i18n/routing'
import SidebarWrapper from '@/components/SidebarWrapper'
import { prisma } from '@/lib/prisma'
import { localize } from '@/lib/localize'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  const messages = await getMessages()

  let profile: any = null
  try {
    const rawProfile = await prisma.profile.findFirst()
    if (rawProfile) {
      const p = localize(rawProfile, locale, ['fullName', 'headline', 'bioHome', 'bioAbout'])
      profile = {
        id: p.id,
        name: p.fullName,
        username: p.email || 'username',
        bio_home: p.bioHome,
        bio_about: p.bioAbout,
        location: p.location,
        work_status: p.headline,
        avatar_url: p.avatarUrl,
        github_url: p.githubUrl,
        linkedin_url: p.linkedinUrl,
        instagram_url: null,
        accent_color: p.accentColor,
        email: p.email,
        phone: p.phone,
        website: p.website,
        twitterUrl: p.twitterUrl,
      }
    }
  } catch (err) {
    console.error('Error fetching profile in server layout:', err)
  }

  const accentColor = profile?.accent_color || '#00c896'
  const isMonochrome = accentColor === '#000000' || accentColor === 'monochrome'

  return (
    <Providers
      locale={locale}
      messages={messages}
      initialMonochrome={isMonochrome}
      initialAccentColor={accentColor}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('portfolio_theme_style');var c=localStorage.getItem('accent_color');var m=${isMonochrome};if(s==='monochrome'||c==='#000000'||c==='monochrome'||(!s&&!c&&m)){document.documentElement.classList.add('theme-monochrome');document.documentElement.setAttribute('data-theme-style','monochrome')}else if(s==='default'||(c&&c!=='#000000'&&c!=='monochrome')){document.documentElement.classList.remove('theme-monochrome');document.documentElement.removeAttribute('data-theme-style')}}catch(e){}})()`,
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: isMonochrome
          ? `:root { --accent: #09090b; } .dark { --accent: #ffffff; }`
          : `:root { --accent: ${accentColor}; }`
      }} />
      <div
        data-theme-style={isMonochrome ? 'monochrome' : undefined}
        className={`h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-300 ${isMonochrome ? 'theme-monochrome' : ''}`}
      >
        <div className="max-w-[1200px] mx-auto flex w-full h-full">
          <SidebarWrapper profile={profile} />
          <main className="flex-1 w-full max-w-full px-6 py-12 lg:px-16 h-screen overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Providers>
  )
}
