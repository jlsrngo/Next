import type { Metadata, Viewport } from 'next'
import { Inter, Grand_Hotel } from 'next/font/google'
import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import '@/app/globals.css'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
)

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const grandHotel = Grand_Hotel({ weight: '400', subsets: ['latin'], variable: '--font-grand-hotel' })

async function getProfileName(): Promise<string> {
  try {
    const profile = await prisma.profile.findFirst()
    return profile?.fullName || 'Portfolio'
  } catch {
    return 'Portfolio'
  }
}

const BASE_URL = 'https://juliosiringoringo.space'

export async function generateMetadata(): Promise<Metadata> {
  const name = await getProfileName()
  return {
    title: {
      default: `Portfolio | ${name}`,
      template: `%s | ${name}`,
    },
    description: 'Personal portfolio showcasing projects, skills, and experience',
    keywords: ['developer', 'portfolio', 'full stack', 'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI'],
    authors: [{ name }],
    creator: name,
    publisher: name,
    metadataBase: new URL(BASE_URL),
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: BASE_URL,
      siteName: `Portfolio | ${name}`,
      title: `Portfolio | ${name}`,
      description: 'Personal portfolio showcasing projects, skills, and experience',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Portfolio | ${name}`,
      description: 'Personal portfolio showcasing projects, skills, and experience',
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const name = await getProfileName()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: 'https://juliosiringoringo.space',
    jobTitle: 'Full Stack Developer',
    sameAs: [],
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grandHotel.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')};var s=localStorage.getItem('portfolio_theme_style');var c=localStorage.getItem('accent_color');if(s==='monochrome'||c==='#000000'||c==='monochrome'){document.documentElement.classList.add('theme-monochrome');document.documentElement.setAttribute('data-theme-style','monochrome')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
