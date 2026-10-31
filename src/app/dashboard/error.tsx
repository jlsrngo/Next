'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [details, setDetails] = useState('')

  useEffect(() => {
    console.error('[Dashboard Error]', error)
    setDetails(error?.message || 'Unknown error')
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center p-8 max-w-md">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h2>
        <p className="text-sm text-slate-500 mb-2">An unexpected error occurred. Please try again.</p>
        {details && (
          <p className="text-xs text-red-400 mb-4 font-mono bg-red-50 dark:bg-red-500/10 rounded p-2 break-all">{details}</p>
        )}
        {error?.digest && (
          <p className="text-xs text-slate-400 mb-4">Digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </div>
  )
}
