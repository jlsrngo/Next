import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import { deleteEducation } from '@/actions/educations'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

async function deleteEduAction(formData: FormData) {
  'use server'
  await deleteEducation(formData.get('id') as string)
}

export default async function EducationPage() {
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } })
  const locale = await getDashboardLocale()
  const displayEducations = educations.map(e => {
    const l = localize(e, locale, ['institution', 'degree', 'fieldOfStudy', 'description'])
    return { ...e, institution: l.institution, degree: l.degree, fieldOfStudy: l.fieldOfStudy, description: l.description }
  })

  const formatDate = (d: Date | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{displayEducations.length} record{displayEducations.length !== 1 ? 's' : ''} total</p>
        <Link href="/dashboard/education/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
          <Plus size={16} />
          Add Education
        </Link>
      </div>

      {displayEducations.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <GraduationCap size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No education entries yet</p>
          <Link href="/dashboard/education/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            <Plus size={16} />
            Add your first education
          </Link>
        </div>
      ) : (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Institution</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Degree</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayEducations.map((edu) => (
                <tr key={edu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 dark:text-white">{edu.institution}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{edu.degree} in {edu.fieldOfStudy || 'General'}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{edu.fieldOfStudy || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium ${edu.current ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {edu.current ? 'Current' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/education/${edu.id}/edit`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-none transition" title="Edit">
                        <Edit size={15} />
                      </Link>
                      <form action={deleteEduAction} className="inline">
                        <input type="hidden" name="id" value={edu.id} />
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
