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

function formatAchievement(a: any) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    issuer: a.issuer || '',
    category: a.category || 'Certification',
    date: a.date?.toISOString() || new Date().toISOString(),
    issueDate: a.date?.toISOString() || new Date().toISOString(),
    imageUrl: a.imageUrl,
    image_url: a.imageUrl,
    credentialId: a.credentialId,
    credential_id: a.credentialId,
    credentialUrl: a.credentialUrl,
    credential_url: a.credentialUrl,
    featured: Boolean(a.featured),
    order: typeof a.order === 'number' ? a.order : 0,
  };
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
  const urlObj = new URL(req.url || '/api/achievements', 'http://localhost');

  const getQuery = (key: string): string | null => {
    if (req.query && req.query[key]) {
      const v = req.query[key];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(key);
  };

  const id = getQuery('id') || (urlObj.pathname.startsWith('/api/achievements/') ? urlObj.pathname.split('/')[3] : null);
  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (id && prisma) {
        const item = await prisma.achievement.findUnique({ where: { id } });
        if (item) {
          res.statusCode = 200;
          res.end(JSON.stringify(formatAchievement(item)));
          return;
        }
      }

      if (prisma) {
        try {
          const list = await prisma.achievement.findMany({
            orderBy: [{ order: 'asc' }, { date: 'desc' }],
          });
          if (list.length > 0) {
            res.statusCode = 200;
            res.end(JSON.stringify(list.map(formatAchievement)));
            return;
          }
        } catch (e) {
          console.error('[API /api/achievements GET error]', e);
        }
      }

      // Snapshot fallback
      try {
        const snapPath = path.join(process.cwd(), 'public', 'db-data.json');
        if (fs.existsSync(snapPath)) {
          const snap = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
          res.statusCode = 200;
          res.end(JSON.stringify(snap?.achievements || []));
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
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const body = parseBody(req);
      const title = body.title || 'Untitled Achievement';
      const issuer = body.issuer || '';
      const description = body.description || '';
      const category = body.category || 'Certification';
      const imageUrl = body.imageUrl || body.image_url || null;
      const credentialUrl = body.credentialUrl || body.credential_url || null;
      const credentialId = body.credentialId || body.credential_id || null;
      const featured = Boolean(body.featured);
      const order = typeof body.order === 'number' ? body.order : 0;

      const created = await prisma.achievement.create({
        data: {
          title,
          issuer,
          description,
          category,
          imageUrl,
          credentialUrl,
          credentialId,
          date: new Date(),
          featured,
          order,
        },
      });

      res.statusCode = 201;
      res.end(JSON.stringify(formatAchievement(created)));
      return;
    }

    if (method === 'PUT' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const body = parseBody(req);
      const updated = await prisma.achievement.update({
        where: { id },
        data: {
          title: body.title,
          issuer: body.issuer,
          description: body.description,
          category: body.category,
          imageUrl: body.imageUrl !== undefined ? body.imageUrl : body.image_url,
          credentialUrl: body.credentialUrl !== undefined ? body.credentialUrl : body.credential_url,
          credentialId: body.credentialId !== undefined ? body.credentialId : body.credential_id,
          featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
          order: typeof body.order === 'number' ? body.order : undefined,
        },
      });

      res.statusCode = 200;
      res.end(JSON.stringify(formatAchievement(updated)));
      return;
    }

    if (method === 'DELETE' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      await prisma.achievement.delete({ where: { id } });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/achievements error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database query error' }));
  }
}
