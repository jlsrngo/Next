'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import SidebarWrapper from '@/components/SidebarWrapper'
import TechnicalRuler from '@/components/TechnicalRuler'

interface PortfolioShellProps {
  profile: any
  isMonochrome: boolean
  children: React.ReactNode
}

export default function PortfolioShell({ profile, isMonochrome, children }: PortfolioShellProps) {
  const pathname = usePathname()
  const isArunaki = pathname?.includes('/arunaki')
  const mainRef = useRef<HTMLElement>(null)

  if (isArunaki) {
    return (
      <div
        data-theme-style={isMonochrome ? 'monochrome' : undefined}
        className={`min-h-screen w-full bg-bg text-ink antialiased overflow-x-hidden ${
          isMonochrome ? 'theme-monochrome' : ''
        }`}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      data-theme-style={isMonochrome ? 'monochrome' : undefined}
      className={`h-screen w-full overflow-hidden bg-bg text-ink transition-colors duration-200 ${
        isMonochrome ? 'theme-monochrome' : ''
      }`}
    >
      <div className="w-full flex h-full relative">
        <SidebarWrapper profile={profile} />
        <main
          ref={mainRef}
          className="flex-1 w-full px-6 py-10 lg:px-14 xl:px-20 h-screen overflow-y-auto relative scroll-smooth pr-16 md:pr-20"
        >
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </main>

        {/* ArtCraft Technical Coordinate Scroll Ruler - Pinned to far right with zero gap */}
        <TechnicalRuler scrollContainerRef={mainRef} />
      </div>
    </div>
  )
}
