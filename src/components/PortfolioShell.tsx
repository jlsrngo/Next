'use client'

import { usePathname } from 'next/navigation'
import SidebarWrapper from '@/components/SidebarWrapper'

interface PortfolioShellProps {
  profile: any
  isMonochrome: boolean
  children: React.ReactNode
}

export default function PortfolioShell({ profile, isMonochrome, children }: PortfolioShellProps) {
  const pathname = usePathname()
  const isArunaki = pathname?.includes('/arunaki')

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
      <div className="max-w-[1280px] mx-auto flex w-full h-full border-x border-line relative">
        <SidebarWrapper profile={profile} />
        <main className="flex-1 w-full max-w-full px-6 py-10 lg:px-14 h-screen overflow-y-auto relative">
          <div className="max-w-4xl mx-auto w-full">{children}</div>

          {/* Subtle ArtCraft Technical Coordinate Ruler on Right Border */}
          <div className="hidden xl:flex flex-col justify-between absolute right-2 top-8 bottom-8 pointer-events-none select-none text-[9px] font-mono text-faint">
            <span>00</span>
            <span>05</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </main>
      </div>
    </div>
  )
}
