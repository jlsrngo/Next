'use client'

import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/context/ThemeContext'

interface SocialLink {
  id: number
  platform: string
  title: string
  description: string | null
  url: string
  is_featured: boolean
}

interface ContactClientProps {
  socialLinks: SocialLink[]
  profile: any
}

const PLATFORM_STYLES: Record<string, { gradient: string }> = {
  gmail: { gradient: 'linear-gradient(135deg, #ea4335 0%, #b31217 50%, #7a0d10 100%)' },
  github: { gradient: 'linear-gradient(135deg, #24292e 0%, #1b1f23 50%, #0d1117 100%)' },
  linkedin: { gradient: 'linear-gradient(135deg, #0077b5 0%, #005885 50%, #003d5c 100%)' },
  instagram: { gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  twitter: { gradient: 'linear-gradient(135deg, #1da1f2 0%, #0d8ddb 50%, #0a6fb0 100%)' },
  youtube: { gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 50%, #990000 100%)' },
  tiktok: { gradient: 'linear-gradient(135deg, #25f4ee 0%, #000000 40%, #fe2c55 100%)' },
  facebook: { gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5cbf 50%, #083d8c 100%)' },
  dribbble: { gradient: 'linear-gradient(135deg, #ea4c89 0%, #c2185b 50%, #880e4f 100%)' },
  behance: { gradient: 'linear-gradient(135deg, #1769ff 0%, #0d47a1 50%, #002171 100%)' },
  discord: { gradient: 'linear-gradient(135deg, #5865f2 0%, #4752c4 50%, #3c45a5 100%)' },
  telegram: { gradient: 'linear-gradient(135deg, #26a5e4 0%, #1a8dc2 50%, #0d6eaa 100%)' },
  whatsapp: { gradient: 'linear-gradient(135deg, #25d366 0%, #128c7e 50%, #075e54 100%)' },
  website: { gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)' },
  medium: { gradient: 'linear-gradient(135deg, #292929 0%, #1a1a1a 50%, #000000 100%)' },
  dev: { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 50%, #000000 100%)' },
}

const PLATFORM_SVG: Record<string, string> = {
  gmail: 'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z',
  twitter: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  dribbble: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12z',
  discord: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z',
  telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  medium: 'M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 00-.143.362v10.052a.376.376 0 00.143.361l1.257 1.234v.271h-6.214v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.489l-3.62 9.195h-.49L6.79 8.489v6.863a.85.85 0 00.233.707l1.694 2.053v.271H5.217v-.27L6.91 16.06a.82.82 0 00.218-.707V8.064a.624.624 0 00-.203-.527L5.135 5.686v-.271h4.774l3.706 8.078 3.275-8.078h4.84v.271z',
  dev: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
}

const platformLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1)

export default function ContactClient({ socialLinks, profile }: ContactClientProps) {
  const t = useTranslations()
  const { themeStyle } = useTheme()
  const isMono = themeStyle === 'monochrome'

  const featuredLinks = socialLinks.filter(l => l.is_featured)
  const otherLinks = socialLinks.filter(l => !l.is_featured)

  return (
    <div className="py-12 md:py-16 space-y-8">
      <div className="space-y-4 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t('contact.title')}
        </h1>
        <div className="h-px bg-slate-200 dark:bg-zinc-800" />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
        <p className="text-base font-bold text-black dark:text-white">
          {t('contact.find_me')}
        </p>
      </div>

      {featuredLinks.map((link, i) => (
        <div key={link.id} className="animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 80}ms`, animationFillMode: 'both' }}>
          <BentoCard link={link} span="full" isMono={isMono} />
        </div>
      ))}

      {otherLinks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {otherLinks.map((link, i) => {
            const isLastOdd = i === otherLinks.length - 1 && otherLinks.length % 2 === 1
            return (
              <div key={link.id} className={`animate-fade-in-up ${isLastOdd ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${(featuredLinks.length + i + 1) * 80}ms`, animationFillMode: 'both' }}>
                <BentoCard link={link} span={isLastOdd ? 'full' : 'half'} isMono={isMono} />
              </div>
            )
          })}
        </div>
      )}

      {socialLinks.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-black dark:text-white font-bold">{t('common.no_data')}</p>
        </div>
      )}
    </div>
  )
}

function BentoCard({ link, span, isMono }: { link: SocialLink; span: 'full' | 'half'; isMono: boolean }) {
  const t = useTranslations()
  const style = PLATFORM_STYLES[link.platform] || PLATFORM_STYLES.website
  const svgPath = PLATFORM_SVG[link.platform] || PLATFORM_SVG.github
  const label = platformLabel(link.platform)

  return (
    <div
      className={`social-bento-card group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        span === 'full' ? 'min-h-[170px]' : 'min-h-[190px]'
      } ${
        isMono
          ? 'bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 shadow-none'
          : 'hover:shadow-2xl'
      }`}
      style={{ background: isMono ? undefined : style.gradient }}
      onClick={() => window.open(link.url, '_blank')}
    >
      <div
        className="absolute -bottom-6 -right-6 w-40 h-40 md:w-48 md:h-48 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ transform: 'rotate(-15deg)' }}
      >
        <svg viewBox="0 0 24 24" fill={isMono ? 'currentColor' : 'white'} className={`w-full h-full ${isMono ? 'text-black dark:text-white' : ''}`}>
          <path d={svgPath} />
        </svg>
      </div>

      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
        <div className="space-y-2 pr-16 md:pr-20">
          <h3 className={`text-xl md:text-2xl font-extrabold leading-tight ${isMono ? 'text-black dark:text-white' : 'text-white'}`}>
            {link.title}
          </h3>
          {link.description && (
            <p className={`font-semibold text-sm leading-relaxed line-clamp-2 ${isMono ? 'text-zinc-600 dark:text-zinc-400' : 'text-white/90'}`}>
              {link.description}
            </p>
          )}
        </div>
        <div className="mt-5">
          <span
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isMono
                ? 'bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800'
                : 'bg-white/15 backdrop-blur-sm border border-white/20 text-white font-bold group-hover:bg-white/25'
            }`}
          >
            {t('contact.go_to')} {label} <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}
