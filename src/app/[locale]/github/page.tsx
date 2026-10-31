import { prisma } from '@/lib/prisma'
import GithubClient from './github-client'

export const revalidate = 60

export default async function GithubPage() {
  let profile: any = null
  let initialStats = {
    total_projects: 0,
    featured_projects: 0,
    total_achievements: 0,
  }

  try {
    const [rawProfile, totalProjects, featuredProjects, totalAchievements] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.achievement.count(),
    ])

    if (rawProfile) {
      profile = { name: rawProfile.fullName }
    }

    initialStats = {
      total_projects: totalProjects,
      featured_projects: featuredProjects,
      total_achievements: totalAchievements,
    }
  } catch {}

  return <GithubClient profile={profile} initialStats={initialStats} />
}
