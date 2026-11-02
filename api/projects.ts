import type { IncomingMessage, ServerResponse } from 'http';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
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

function formatProject(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    image_url: p.imageUrl,
    liveUrl: p.liveUrl,
    live_url: p.liveUrl,
    githubUrl: p.githubUrl,
    github_url: p.githubUrl,
    techStack: Array.isArray(p.techStack) ? p.techStack : [],
    tech_stack: Array.isArray(p.techStack) ? p.techStack : [],
    featured: Boolean(p.featured),
    order: typeof p.order === 'number' ? p.order : 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
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
  const urlObj = new URL(req.url || '/api/projects', 'http://localhost');

  const getQuery = (key: string): string | null => {
    if (req.query && req.query[key]) {
      const v = req.query[key];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(key);
  };

  const id = getQuery('id') || (urlObj.pathname.startsWith('/api/projects/') ? urlObj.pathname.split('/')[3] : null);
  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (id && prisma) {
        const item = await prisma.project.findUnique({ where: { id } });
        if (item) {
          res.statusCode = 200;
          res.end(JSON.stringify(formatProject(item)));
          return;
        }
      }

      if (prisma) {
        try {
          const list = await prisma.project.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          });
          if (list.length > 0) {
            res.statusCode = 200;
            res.end(JSON.stringify(list.map(formatProject)));
            return;
          }
        } catch (e) {
          console.error('[API /api/projects GET error]', e);
        }
      }

      // Snapshot fallback
      try {
        const candidates = [
          path.join(process.cwd(), 'public', 'db-data.json'),
          path.join(process.cwd(), 'dist', 'db-data.json'),
        ];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            const snap = JSON.parse(fs.readFileSync(p, 'utf-8'));
            res.statusCode = 200;
            res.end(JSON.stringify(snap?.projects || []));
            return;
          }
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
      const title = body.title || 'Untitled Project';
      const description = body.description || '';
      const imageUrl = body.imageUrl || body.image_url || null;
      const liveUrl = body.liveUrl || body.live_url || null;
      const githubUrl = body.githubUrl || body.github_url || null;
      const techStack = Array.isArray(body.techStack)
        ? body.techStack
        : Array.isArray(body.tech_stack)
        ? body.tech_stack
        : [];
      const featured = Boolean(body.featured);
      const order = typeof body.order === 'number' ? body.order : 0;

      const created = await prisma.project.create({
        data: {
          title,
          description,
          imageUrl,
          liveUrl,
          githubUrl,
          techStack,
          featured,
          order,
        },
      });

      res.statusCode = 201;
      res.end(JSON.stringify(formatProject(created)));
      return;
    }

    if (method === 'PUT' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const body = parseBody(req);
      const updated = await prisma.project.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          imageUrl: body.imageUrl !== undefined ? body.imageUrl : body.image_url,
          liveUrl: body.liveUrl !== undefined ? body.liveUrl : body.live_url,
          githubUrl: body.githubUrl !== undefined ? body.githubUrl : body.github_url,
          techStack: body.techStack ?? body.tech_stack,
          featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
          order: typeof body.order === 'number' ? body.order : undefined,
        },
      });

      res.statusCode = 200;
      res.end(JSON.stringify(formatProject(updated)));
      return;
    }

    if (method === 'DELETE' && id) {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      await prisma.project.delete({ where: { id } });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/projects error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database query error' }));
  }
}
