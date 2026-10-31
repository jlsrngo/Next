import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, ExternalLink, Github, FolderOpen } from 'lucide-react'
import { deleteProject } from '@/actions/projects'
import { getDashboardLocale, localize } from '@/lib/dashboard-locale'

async function deleteProjectAction(formData: FormData) {
  'use server'
  await deleteProject(formData.get('id') as string)
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  const locale = await getDashboardLocale()
  const displayProjects = projects.map(p => {
    const l = localize(p, locale, ['title', 'description'])
    return { ...p, title: l.title, description: l.description }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      {displayProjects.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <FolderOpen size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No projects yet</p>
          <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            <Plus size={16} />
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tech Stack</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 dark:text-white">{project.title}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">{project.description}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-none">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-none">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium ${project.featured ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {project.featured ? 'Featured' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{project.order}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/projects/${project.id}/edit`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-none transition" title="Edit">
                        <Edit size={15} />
                      </Link>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-none transition" title="Live">
                          <ExternalLink size={15} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition" title="GitHub">
                          <Github size={15} />
                        </a>
                      )}
                      <form action={deleteProjectAction} className="inline">
                        <input type="hidden" name="id" value={project.id} />
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
