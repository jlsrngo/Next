import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Code, FolderOpen, Trophy, Briefcase, GraduationCap, Link2, ArrowUpRight, TrendingUp, User } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  const profile = await prisma.profile.findFirst()
  const name = profile?.fullName || session?.user?.email?.split('@')[0] || 'Admin'

  const [projectsCount, achievementsCount, skillsCount, experiencesCount, educationCount, socialLinksCount, featuredCount] = await Promise.all([
    prisma.project.count(),
    prisma.achievement.count(),
    prisma.skill.count(),
    prisma.workExperience.count(),
    prisma.education.count(),
    prisma.socialLink.count(),
    prisma.project.count({ where: { featured: true } }),
  ])

  const total = projectsCount + achievementsCount + skillsCount + experiencesCount + educationCount + socialLinksCount

  const stats = [
    { label: 'Skills', count: skillsCount, icon: Code, href: '/dashboard/skills', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
    { label: 'Projects', count: projectsCount, icon: FolderOpen, href: '/dashboard/projects', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
    { label: 'Experiences', count: experiencesCount, icon: Briefcase, href: '/dashboard/experiences', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
    { label: 'Education', count: educationCount, icon: GraduationCap, href: '/dashboard/education', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
    { label: 'Achievements', count: achievementsCount, icon: Trophy, href: '/dashboard/achievements', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
    { label: 'Social Links', count: socialLinksCount, icon: Link2, href: '/dashboard/social-links', color: 'text-slate-800 dark:text-zinc-200', bg: 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a]', bar: 'bg-zinc-400 dark:bg-zinc-600' },
  ]

  const shortcuts = [
    { label: 'Edit Profile', href: '/dashboard/profile', icon: User },
    { label: 'Add Skill', href: '/dashboard/skills/new', icon: Code },
    { label: 'Add Project', href: '/dashboard/projects/new', icon: FolderOpen },
    { label: 'Add Experience', href: '/dashboard/experiences/new', icon: Briefcase },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, <span className="text-zinc-900 dark:text-white font-semibold">{name}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage your portfolio content from here</p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-[#27272a] px-4 py-2">
          <TrendingUp size={16} className="text-zinc-700 dark:text-zinc-300" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{total}</span>
          <span className="text-sm text-slate-500 dark:text-zinc-400">total items</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#0c0c0e] p-5 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-[#3f3f46]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.count}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Manage
                <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.bar} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          )
        })}
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#0c0c0e] px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 transition-all hover:border-slate-300 dark:hover:border-[#3f3f46] hover:text-slate-900 dark:hover:text-white hover:shadow-sm"
              >
                <Icon size={16} className="text-slate-400 dark:text-zinc-500" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
