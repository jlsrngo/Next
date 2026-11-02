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

function parseBody(req: any): any {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  const method = (req.method || 'GET').toUpperCase();
  const urlObj = new URL(req.url || '/api/education', 'http://localhost');

  const getQuery = (key: string): string | null => {
    if (req.query && req.query[key]) {
      const v = req.query[key];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(key);
  };

  const id = getQuery('id') || (urlObj.pathname.startsWith('/api/education/') ? urlObj.pathname.split('/')[3] : null);
  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (prisma) {
        const rows = await prisma.education.findMany({ orderBy: { order: 'asc' } });
        res.statusCode = 200;
        res.end(
          JSON.stringify(
            rows.map((ed) => ({
              id: ed.id,
              institution: ed.institution,
              institutionLogoUrl: ed.institutionLogoUrl,
              institution_logo_url: ed.institutionLogoUrl,
              degree: ed.degree,
              fieldOfStudy: ed.fieldOfStudy,
              grade: ed.gpa,
              location: ed.location,
              current: ed.current,
              description: ed.description,
              order: ed.order,
            }))
          )
        );
        return;
      }

      // Snapshot fallback
      try {
        const snapPath = path.join(process.cwd(), 'public', 'db-data.json');
        if (fs.existsSync(snapPath)) {
          const snap = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
          res.statusCode = 200;
          res.end(JSON.stringify(snap?.about?.education || []));
          return;
        }
      } catch {}

      res.statusCode = 200;
      res.end(JSON.stringify([]));
      return;
    }

    if (method === 'POST') {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not configured' }));
        return;
      }
      const b = parseBody(req);
      const created = await prisma.education.create({
        data: {
          institution: b.institution || 'University',
          degree: b.degree || 'Degree',
          institutionLogoUrl: b.institutionLogoUrl || b.institution_logo_url || null,
          fieldOfStudy: b.fieldOfStudy || b.field_of_study || 'Computer Science',
          location: b.location || 'Indonesia',
          gpa: b.grade || b.gpa || null,
          startDate: new Date(),
          current: Boolean(b.current),
          description: b.description || '',
          order: Number(b.order) || 0,
        },
      });
      res.statusCode = 201;
      res.end(JSON.stringify(created));
      return;
    }

    if (method === 'PUT' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not configured' }));
        return;
      }
      const b = parseBody(req);
      const updated = await prisma.education.update({
        where: { id },
        data: {
          institution: b.institution,
          degree: b.degree,
          institutionLogoUrl: b.institutionLogoUrl !== undefined ? b.institutionLogoUrl : b.institution_logo_url,
          fieldOfStudy: b.fieldOfStudy ?? b.field_of_study,
          location: b.location,
          gpa: b.grade ?? b.gpa,
          current: b.current !== undefined ? Boolean(b.current) : undefined,
          description: b.description,
          order: b.order !== undefined ? Number(b.order) : undefined,
        },
      });
      res.statusCode = 200;
      res.end(JSON.stringify(updated));
      return;
    }

    if (method === 'DELETE' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not configured' }));
        return;
      }
      await prisma.education.delete({ where: { id } });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/education error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database error' }));
  }
}
