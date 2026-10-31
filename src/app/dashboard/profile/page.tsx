import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Mail, Phone, MapPin, Globe, ExternalLink, User } from 'lucide-react'
import { optimizeCloudinaryUrl } from '@/utils/cloudinary'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

export default async function ProfilePage() {
  const session = await auth()
  const profile = await prisma.profile.findUnique({ where: { userId: session!.user.id! } })
  const locale = await getDashboardLocale()
  const p = profile ? localize(profile, locale, ['fullName', 'headline', 'bioHome', 'bioAbout']) : null

  const avatarUrl = optimizeCloudinaryUrl(profile?.avatarUrl)

  const fields = [
    { label: 'Email', value: profile?.email, icon: Mail },
    { label: 'Phone', value: profile?.phone, icon: Phone },
    { label: 'Location', value: p?.location || profile?.location, icon: MapPin },
    { label: 'Website', value: profile?.website, icon: Globe, href: profile?.website },
    { label: 'GitHub', value: profile?.githubUrl, icon: ExternalLink, href: profile?.githubUrl },
    { label: 'LinkedIn', value: profile?.linkedinUrl, icon: ExternalLink, href: profile?.linkedinUrl },
    { label: 'Twitter', value: profile?.twitterUrl, icon: ExternalLink, href: profile?.twitterUrl },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Avatar + Name Header */}
        <div className="flex items-center gap-5 p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="h-20 w-20 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={p?.fullName || profile?.fullName || 'Avatar'} width={80} height={80} unoptimized className="h-full w-full object-cover" />
            ) : (
              <User size={32} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{p?.fullName || profile?.fullName || 'Your Name'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{p?.headline || profile?.headline || 'Add a headline'}</p>
          </div>
          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition shrink-0"
          >
            <Pencil size={14} />
            Edit
          </Link>
        </div>

        {/* Bio */}
        {(p?.bioHome || profile?.bioHome || p?.bioAbout || profile?.bioAbout) && (
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Bio</h3>
            {(p?.bioHome || profile?.bioHome) && (
              <div className="mb-3">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Home</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{p?.bioHome || profile?.bioHome}</p>
              </div>
            )}
            {(p?.bioAbout || profile?.bioAbout) && (
              <div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">About</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{p?.bioAbout || profile?.bioAbout}</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => {
              if (!field.value) return null
              const Icon = field.icon
              const content = (
                <div className="flex items-center gap-3 p-3 rounded-none bg-slate-50 dark:bg-slate-800">
                  <Icon size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{field.label}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{field.value}</p>
                  </div>
                </div>
              )
              return field.href ? (
                <a key={field.label} href={field.href} target="_blank" rel="noopener noreferrer" className="block hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none transition">
                  {content}
                </a>
              ) : (
                <div key={field.label}>{content}</div>
              )
            })}
          </div>
        </div>

        {/* Accent Color Preview */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Accent Color</h3>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-none border border-slate-200 dark:border-slate-700" style={{ backgroundColor: profile?.accentColor || '#00c896' }} />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">{profile?.accentColor || '#00c896'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
