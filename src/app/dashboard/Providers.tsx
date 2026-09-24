'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/context/ThemeContext'
import { Toaster } from 'sonner'

export default function Providers({
  children,
  initialMonochrome,
  initialAccentColor,
}: {
  children: React.ReactNode
  initialMonochrome?: boolean
  initialAccentColor?: string
}) {
  return (
    <SessionProvider>
      <ThemeProvider initialMonochrome={initialMonochrome} initialAccentColor={initialAccentColor}>
        <Toaster position="top-center" richColors />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
