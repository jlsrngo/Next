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
        className={`min-h-screen w-full bg-light-bg dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased overflow-x-hidden ${
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
      className={`h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-300 ${
        isMonochrome ? 'theme-monochrome' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex w-full h-full">
        <SidebarWrapper profile={profile} />
        <main className="flex-1 w-full max-w-full px-6 py-12 lg:px-16 h-screen overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
