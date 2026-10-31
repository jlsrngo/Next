import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-none font-medium hover:opacity-90 transition">
          <Home className="h-5 w-5" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
