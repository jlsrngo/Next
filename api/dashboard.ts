import type { IncomingMessage, ServerResponse } from 'http';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({ log: ['error'] });
    } catch (e) {
      console.error('[DB] Prisma init error:', e);
      return null;
    }
  }
  return globalForPrisma.prisma;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  const prisma = getPrisma();
  let totalProjects = 0;
  let featuredProjects = 0;
  let totalAchievements = 0;

  if (prisma) {
    try {
      const [projCount, featCount, achCount] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { featured: true } }),
        prisma.achievement.count(),
      ]);
      totalProjects = projCount;
      featuredProjects = featCount;
      totalAchievements = achCount;
    } catch (e) {
      console.error('[API /api/dashboard count error]', e);
    }
  }

  // Load contributions metrics from public/github-contributions.json
  let totalContribs = 1993;
  let totalRepos = 22;
  let totalPrs = 0;
  let followers = 0;

  try {
    const ghPath = path.join(process.cwd(), 'public', 'github-contributions.json');
    if (fs.existsSync(ghPath)) {
      const gh = JSON.parse(fs.readFileSync(ghPath, 'utf-8'));
      if (gh.total_contributions) totalContribs = gh.total_contributions;
      if (gh.total_repos) totalRepos = gh.total_repos;
      if (gh.total_prs !== undefined) totalPrs = gh.total_prs;
      if (gh.followers !== undefined) followers = gh.followers;
    }
  } catch {}

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      total_projects: totalProjects,
      featured_projects: featuredProjects,
      total_achievements: totalAchievements,
      total_contributions: totalContribs,
      total_repos: totalRepos,
      total_prs: totalPrs,
      followers,
    })
  );
}
