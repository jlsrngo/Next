import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, Globe, Trophy } from 'lucide-react'
import { deleteAchievement } from '@/actions/achievements'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

async function deleteAchievementAction(formData: FormData) {
  'use server'
  await deleteAchievement(formData.get('id') as string)
}

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: 'asc' },
    include: { translations: true },
  })
  const locale = await getDashboardLocale()
  const displayAchs = achievements.map(a => {
    const t = a.translations?.find((tr: any) => tr.locale === locale)
    return {
      ...a,
      title: t?.title || a.title,
      description: t?.description || a.description,
      issuer: t?.issuer || a.issuer,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{displayAchs.length} achievement{displayAchs.length !== 1 ? 's' : ''} total</p>
        <Link href="/dashboard/achievements/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
          <Plus size={16} />
          Add Achievement
        </Link>
      </div>

      {displayAchs.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Trophy size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No achievements yet</p>
          <Link href="/dashboard/achievements/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            <Plus size={16} />
            Create your first achievement
          </Link>
        </div>
      ) : (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Issuer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayAchs.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 dark:text-white">{a.title}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">{a.description}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{a.issuer || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium ${a.featured ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {a.featured ? 'Featured' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{a.order}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/achievements/${a.id}/edit`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-none transition" title="Edit">
                        <Edit size={15} />
                      </Link>
                      {a.credentialUrl && (
                        <a href={a.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-none transition" title="Credential">
                          <Globe size={15} />
                        </a>
                      )}
                      <form action={deleteAchievementAction} className="inline">
                        <input type="hidden" name="id" value={a.id} />
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
