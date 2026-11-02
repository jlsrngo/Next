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

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  const prisma = getPrisma();

  try {
    if (prisma) {
      try {
        const [expRows, eduRows] = await Promise.all([
          prisma.workExperience.findMany({ orderBy: { order: 'asc' } }),
          prisma.education.findMany({ orderBy: { order: 'asc' } }),
        ]);

        const experiences = expRows.map((e) => ({
          id: e.id,
          company: e.company,
          company_name: e.company,
          companyLogoUrl: e.companyLogoUrl,
          company_logo_url: e.companyLogoUrl,
          position: e.position,
          location: e.location || 'Indonesia',
          startDate: e.startDate?.toISOString() || '2023-01-01',
          start_date: e.startDate?.toISOString() || '2023-01-01',
          endDate: e.endDate?.toISOString() || null,
          end_date: e.endDate?.toISOString() || null,
          current: e.current,
          is_current: e.current,
          description: e.description,
          order: e.order,
        }));

        const education = eduRows.map((ed) => ({
          id: ed.id,
          institution: ed.institution,
          institution_name: ed.institution,
          institutionLogoUrl: ed.institutionLogoUrl,
          institution_logo_url: ed.institutionLogoUrl,
          degree: ed.degree,
          fieldOfStudy: ed.fieldOfStudy,
          field_of_study: ed.fieldOfStudy,
          location: ed.location || 'Indonesia',
          grade: ed.gpa,
          gpa: ed.gpa,
          startDate: ed.startDate?.toISOString() || '2020-01-01',
          start_date: ed.startDate?.toISOString() || '2020-01-01',
          endDate: ed.endDate?.toISOString() || null,
          end_date: ed.endDate?.toISOString() || null,
          current: ed.current,
          is_current: ed.current,
          description: ed.description,
          order: ed.order,
        }));

        res.statusCode = 200;
        res.end(JSON.stringify({ experiences, education }));
        return;
      } catch (e) {
        console.error('[API /api/about Prisma error]', e);
      }
    }

    // Fallback to local snapshot
    try {
      const snapPath = path.join(process.cwd(), 'public', 'db-data.json');
      if (fs.existsSync(snapPath)) {
        const snap = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
        if (snap?.about) {
          res.statusCode = 200;
          res.end(JSON.stringify(snap.about));
          return;
        }
      }
    } catch {}

    res.statusCode = 200;
    res.end(JSON.stringify({ experiences: [], education: [] }));
  } catch (err: any) {
    console.error('[API /api/about error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database error' }));
  }
}
