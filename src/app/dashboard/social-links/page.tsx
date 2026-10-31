import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, ExternalLink, Link2 } from 'lucide-react'
import { deleteSocialLink } from '@/actions/socialLinks'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

async function deleteLinkAction(formData: FormData) {
  'use server'
  await deleteSocialLink(formData.get('id') as string)
}

export default async function SocialLinksPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } })
  const locale = await getDashboardLocale()
  const displayLinks = links.map(l => {
    const loc = localize(l, locale, ['title', 'description'])
    return { ...l, title: loc.title, description: loc.description }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{displayLinks.length} link{displayLinks.length !== 1 ? 's' : ''} total</p>
        <Link href="/dashboard/social-links/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
          <Plus size={16} />
          Add Link
        </Link>
      </div>

      {displayLinks.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Link2 size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No social links yet</p>
          <Link href="/dashboard/social-links/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            <Plus size={16} />
            Add your first link
          </Link>
        </div>
      ) : (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Platform</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">URL</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white capitalize">{link.platform}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{link.title}</td>
                  <td className="px-5 py-3.5">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline truncate block max-w-[200px] text-xs">
                      {link.url}
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium ${link.isFeatured ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {link.isFeatured ? 'Featured' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/social-links/${link.id}/edit`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-none transition" title="Edit">
                        <Edit size={15} />
                      </Link>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-none transition" title="Open">
                        <ExternalLink size={15} />
                      </a>
                      <form action={deleteLinkAction} className="inline">
                        <input type="hidden" name="id" value={link.id} />
                        <button type="submit" className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-none transition" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
