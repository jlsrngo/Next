'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/context/ThemeContext'

interface ProvidersProps {
  children: ReactNode
  locale: string
  messages: any
  initialMonochrome?: boolean
  initialAccentColor?: string
}

export function Providers({ children, locale, messages, initialMonochrome, initialAccentColor }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Jakarta">
        <ThemeProvider initialMonochrome={initialMonochrome} initialAccentColor={initialAccentColor}>
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
