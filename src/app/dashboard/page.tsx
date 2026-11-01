import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Code, FolderOpen, Trophy, Briefcase, GraduationCap, Link2, ArrowUpRight, TrendingUp, User } from 'lucide-react'
import CornerCrosses from '@/components/ui/CornerCrosses'

export default async function DashboardPage() {
  const session = await auth()
  const profile = await prisma.profile.findFirst()
  const name = profile?.fullName || session?.user?.email?.split('@')[0] || 'Admin'

  const [projectsCount, achievementsCount, skillsCount, experiencesCount, educationCount, socialLinksCount] = await Promise.all([
    prisma.project.count(),
    prisma.achievement.count(),
    prisma.skill.count(),
    prisma.workExperience.count(),
    prisma.education.count(),
    prisma.socialLink.count(),
  ])

  const total = projectsCount + achievementsCount + skillsCount + experiencesCount + educationCount + socialLinksCount

  const stats = [
    { label: 'Skills Matrix', count: skillsCount, icon: Code, href: '/dashboard/skills', id: '01' },
    { label: 'Projects Archive', count: projectsCount, icon: FolderOpen, href: '/dashboard/projects', id: '02' },
    { label: 'Work Experiences', count: experiencesCount, icon: Briefcase, href: '/dashboard/experiences', id: '03' },
    { label: 'Academic Dossier', count: educationCount, icon: GraduationCap, href: '/dashboard/education', id: '04' },
    { label: 'Achievements Index', count: achievementsCount, icon: Trophy, href: '/dashboard/achievements', id: '05' },
    { label: 'Relay Channels', count: socialLinksCount, icon: Link2, href: '/dashboard/social-links', id: '06' },
  ]

  const shortcuts = [
    { label: 'Edit Profile Spec', href: '/dashboard/profile', icon: User },
    { label: 'Add New Skill', href: '/dashboard/skills/new', icon: Code },
    { label: 'Deploy New Project', href: '/dashboard/projects/new', icon: FolderOpen },
    { label: 'Log Experience Record', href: '/dashboard/experiences/new', icon: Briefcase },
  ]

  return (
        <div className="space-y-8 animate-fade-in">
          {/* Top HUD Overview */}
          <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
                  [ 00 // WORKSTATION CONTROL & OVERVIEW ]
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                  SESSION // <span className="font-mono uppercase font-bold">{name}</span>
                </h1>
                <p className="text-sm text-faint mt-1 font-mono">
                  Direct database administration workstation for PostgreSQL & content matrices.
                </p>
            </div>

              <div className="flex items-center gap-2 border border-line bg-bg-raised px-4 py-2 font-mono text-xs">
                <TrendingUp size={14} className="text-ink" />
                <span className="font-bold text-ink">{total}</span>
                <span className="text-[10px] uppercase text-faint tracking-wider">TOTAL RECORDS SYNCED</span>
              </div>
            </div>

                        {/* Stats Grid in Swiss Brutalist Cards */}
                        <div className="space-y-3">
                          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                            [ METRIC REGISTRIES ]
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {stats.map((stat) => {
                              const Icon = stat.icon
                              return (
                                <Link
                                  key={stat.label}
                                  href={stat.href}
                                  className="group relative border border-line bg-bg-raised hover:bg-bg-sunken hover:border-line-strong p-5 transition-all"
                                >
                                  <CornerCrosses />
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-mono text-[10px] uppercase tracking-widest text-faint font-bold">
                                        {stat.id} // {stat.label}
                                      </p>
                                      <p className="font-display text-3xl font-bold text-ink mt-2">
                                        {stat.count}
                                      </p>
                                    </div>
                                    <div className="border border-line bg-bg p-2 text-ink">
                                      <Icon size={16} />
                                    </div>
                                  </div>

                                    <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-faint group-hover:text-ink transition-colors">
                                      <span>DISPATCH MANAGER</span>
                                      <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                          </Link>
                          )
          })}
                        </div>
                      </div>

                          {/* Quick Action Shortcuts */}
                          <div className="space-y-3">
                            <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                              [ RAPID DATA DISPATCH ]
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {shortcuts.map((item) => {
                                const Icon = item.icon
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 border border-line bg-bg-raised hover:bg-bg-sunken hover:border-line-strong px-4 py-3 font-mono text-xs uppercase font-bold text-ink transition-all group"
                                  >
                                    <Icon size={14} className="text-faint group-hover:text-ink transition-colors" />
                                    <span className="truncate">{item.label}</span>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        )
}
