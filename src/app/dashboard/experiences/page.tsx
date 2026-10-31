import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, Briefcase, MapPin } from 'lucide-react'
import { deleteWorkExperience } from '@/actions/workExperiences'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

async function deleteExpAction(formData: FormData) {
  'use server'
  await deleteWorkExperience(formData.get('id') as string)
}

export default async function ExperiencesPage() {
  const experiences = await prisma.workExperience.findMany({ orderBy: { order: 'asc' } })
  const locale = await getDashboardLocale()
  const displayExps = experiences.map(e => {
    const l = localize(e, locale, ['company', 'position', 'description'])
    return { ...e, company: l.company, position: l.position, description: l.description }
  })

  const formatDate = (d: Date | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{displayExps.length} experience{displayExps.length !== 1 ? 's' : ''} total</p>
        <Link href="/dashboard/experiences/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
          <Plus size={16} />
          Add Experience
        </Link>
      </div>

      {displayExps.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No work experiences yet</p>
          <Link href="/dashboard/experiences/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            <Plus size={16} />
            Add your first experience
          </Link>
        </div>
      ) : (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Position</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayExps.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 dark:text-white">{exp.company}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <MapPin size={11} />
                      {exp.location || 'Remote'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-200">{exp.position}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {exp.employmentType || 'Full-time'} &middot; {exp.workType || 'Remote'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/experiences/${exp.id}/edit`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-none transition" title="Edit">
                        <Edit size={15} />
                      </Link>
                      <form action={deleteExpAction} className="inline">
                        <input type="hidden" name="id" value={exp.id} />
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
