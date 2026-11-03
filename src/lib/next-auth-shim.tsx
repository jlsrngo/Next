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
  if (typeof window === 'undefined') return { email: 'juliosiringoringo6@gmail.com', password: 'admin123' }
  try {
    const raw = localStorage.getItem('portfolio_admin_credentials')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        email: parsed.email || 'juliosiringoringo6@gmail.com',
        password: parsed.password || 'admin123',
      }
    }
  } catch {}
  return { email: 'juliosiringoringo6@gmail.com', password: 'admin123' }
}

export const updateAdminCredentials = async (
  email: string,
  newPassword?: string
): Promise<boolean> => {
  if (typeof window === 'undefined') return false
  try {
    const trimmedEmail = email.trim().toLowerCase()
    const current = getAdminCredentials()
    const updated = {
      email: trimmedEmail,
      password: newPassword && newPassword.trim() ? newPassword.trim() : current.password,
    }
    localStorage.setItem('portfolio_admin_credentials', JSON.stringify(updated))
    sessionStorage.setItem(
      'portfolio_admin_user',
      JSON.stringify({ email: updated.email, role: 'admin' })
    )
    window.dispatchEvent(new Event('storage'))

    // Sync to backend DB via /api/auth
    try {
      await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          newPassword: newPassword && newPassword.trim() ? newPassword.trim() : undefined,
        }),
      })
    } catch (e) {
      console.warn('[Auth] /api/auth PUT sync warning:', e)
    }

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

  const inputEmail = options.email.trim().toLowerCase()
  const password = options.password

  // 1. Try server API /api/auth (Neon PostgreSQL DB verification)
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputEmail, password }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.ok) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('portfolio_admin_auth', 'true')
          sessionStorage.setItem(
            'portfolio_admin_user',
            JSON.stringify({ email: data.user?.email || inputEmail, role: data.user?.role || 'admin' })
          )
          localStorage.removeItem('portfolio_admin_auth')
          localStorage.removeItem('portfolio_admin_user')
          localStorage.setItem(
            'portfolio_admin_credentials',
            JSON.stringify({ email: data.user?.email || inputEmail, password })
          )
        }
        return { error: null, status: 200, ok: true, url: '/admin' }
      }
    } else if (res.status === 401) {
      const data = await res.json().catch(() => ({}))
      return { error: data?.error || 'Invalid credentials', status: 401, ok: false, url: null }
    }
  } catch (err) {
    console.warn('[Auth] /api/auth unreachable, falling back to local credentials:', err)
  }

  // 2. Client fallback
  const custom = getAdminCredentials()
  const customEmail = custom.email.trim().toLowerCase()

  if (
    inputEmail === customEmail &&
    password === custom.password
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

  // Fallback defaults
  if (
    (inputEmail === 'admin@portfolio.com' || inputEmail === 'juliosiringoringo6@gmail.com') &&
    password === 'admin123'
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
    let email = 'juliosiringoringo6@gmail.com'
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
