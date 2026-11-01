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
      className={`h-screen w-full overflow-hidden bg-bg text-ink transition-colors duration-200 blueprint-grid flex justify-center ${
        isMonochrome ? 'theme-monochrome' : ''
      }`}
    >
      {/* Centered Workstation: Sidebar + Content + Ruler together */}
      <div className="flex h-full w-full max-w-[1280px] xl:max-w-[1340px] border-x border-black/20 dark:border-white/20 bg-bg relative">
        <SidebarWrapper profile={profile} />
        <main
          ref={mainRef}
          className="flex-1 h-screen overflow-y-auto relative scroll-smooth px-4 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-4 pb-12 md:pb-16 md:pr-20"
        >
          <div className="w-full max-w-4xl lg:max-w-5xl mx-auto">{children}</div>
        </main>

        {/* Technical Coordinate Scroll Ruler - Pinned to right edge of main on md+ screens */}
        <TechnicalRuler scrollContainerRef={mainRef} />
      </div>
    </div>
  )
}
