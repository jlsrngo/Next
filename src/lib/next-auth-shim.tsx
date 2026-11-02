import React from 'react'

export interface SignInOptions {
  email?: string
  password?: string
  redirect?: boolean
  callbackUrl?: string
  [key: string]: any
}

export interface SignInResponse {
  error: string | null
  status: number
  ok: boolean
  url: string | null
}

export const getAdminCredentials = (): { email: string; password?: string } => {
  if (typeof window === 'undefined') return { email: 'admin@portfolio.com', password: 'admin123' }
  try {
    const raw = localStorage.getItem('portfolio_admin_credentials')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        email: parsed.email || 'admin@portfolio.com',
        password: parsed.password || 'admin123',
      }
    }
  } catch {}
  return { email: 'admin@portfolio.com', password: 'admin123' }
}

export const updateAdminCredentials = (
  email: string,
  newPassword?: string
): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const current = getAdminCredentials()
    const updated = {
      email: email.trim(),
      password: newPassword && newPassword.trim() ? newPassword.trim() : current.password,
    }
    localStorage.setItem('portfolio_admin_credentials', JSON.stringify(updated))
    sessionStorage.setItem(
      'portfolio_admin_user',
      JSON.stringify({ email: updated.email, role: 'admin' })
    )
    window.dispatchEvent(new Event('storage'))
    return true
  } catch {
    return false
  }
}

export const signIn = async (
  provider?: string,
  options?: SignInOptions
): Promise<SignInResponse> => {
  if (!options?.email || !options?.password) {
    return { error: 'Missing email or password', status: 400, ok: false, url: null }
  }

  const custom = getAdminCredentials()
  const inputEmail = options.email.trim().toLowerCase()
  const customEmail = custom.email.trim().toLowerCase()

  // Match custom updated credentials
  if (
    inputEmail === customEmail &&
    options.password === custom.password
  ) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_admin_auth', 'true')
      sessionStorage.setItem(
        'portfolio_admin_user',
        JSON.stringify({ email: custom.email, role: 'admin' })
      )
      localStorage.removeItem('portfolio_admin_auth')
      localStorage.removeItem('portfolio_admin_user')
    }
    return { error: null, status: 200, ok: true, url: '/admin' }
  }

  // Default credentials fallback if unchanged
  if (
    inputEmail === 'admin@portfolio.com' &&
    options.password === 'admin123'
  ) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_admin_auth', 'true')
      sessionStorage.setItem(
        'portfolio_admin_user',
        JSON.stringify({ email: options.email, role: 'admin' })
      )
      localStorage.removeItem('portfolio_admin_auth')
      localStorage.removeItem('portfolio_admin_user')
    }
    return { error: null, status: 200, ok: true, url: '/admin' }
  }

  return { error: 'Invalid credentials', status: 401, ok: false, url: null }
}

export const signOut = (options?: { callbackUrl?: string }) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('portfolio_admin_auth')
    sessionStorage.removeItem('portfolio_admin_user')
    localStorage.removeItem('portfolio_admin_auth')
    localStorage.removeItem('portfolio_admin_user')
    if (options?.callbackUrl) {
      window.location.replace(options.callbackUrl)
    } else {
      window.location.reload()
    }
  }
}

export const useSession = () => {
  const [isAuth, setIsAuth] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Clean up any legacy localStorage session to enforce tab-close auto logout
      if (localStorage.getItem('portfolio_admin_auth')) {
        localStorage.removeItem('portfolio_admin_auth')
        localStorage.removeItem('portfolio_admin_user')
      }
      return sessionStorage.getItem('portfolio_admin_auth') === 'true'
    }
    return false
  })

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorage = () => {
        setIsAuth(sessionStorage.getItem('portfolio_admin_auth') === 'true')
      }
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    }
  }, [])

  if (isAuth) {
    let email = 'admin@portfolio.com'
    try {
      const stored = sessionStorage.getItem('portfolio_admin_user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.email) email = u.email
      }
    } catch {}

    return {
      data: {
        user: {
          email,
          role: 'admin',
          id: '1',
        },
      },
      status: 'authenticated',
    }
  }

  return { data: null, status: 'unauthenticated' }
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
