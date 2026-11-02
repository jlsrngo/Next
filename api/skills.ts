import type { IncomingMessage, ServerResponse } from 'http';
import { PrismaClient } from '@prisma/client';

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

export default async function handler(req: IncomingMessage & { query?: any; body?: any }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  const method = (req.method || 'GET').toUpperCase();
  const urlObj = new URL(req.url || '/api/skills', 'http://localhost');

  const getQuery = (key: string): string | null => {
    if (req.query && req.query[key]) {
      const v = req.query[key];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(key);
  };

  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const skills = await prisma.skill.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      });

      res.statusCode = 200;
      res.end(
        JSON.stringify(
          skills.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            icon: s.iconName || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            iconName: s.iconName || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            proficiency: s.proficiency,
            featured: s.featured,
            order: s.order,
          }))
        )
      );
      return;
    }

    if (method === 'POST') {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const body = parseBody(req);
      const name = body.name || 'New Skill';
      const category = body.category || 'Tools & DevOps';
      const iconName = body.iconName || body.icon || name;
      const proficiency = typeof body.proficiency === 'number' ? body.proficiency : 80;
      const featured = Boolean(body.featured);
      const order = typeof body.order === 'number' ? body.order : 0;

      const skill = await prisma.skill.create({
        data: {
          name,
          category,
          iconName,
          proficiency,
          featured,
          order,
        },
      });

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          ...skill,
          icon: skill.iconName,
        })
      );
      return;
    }

    if (method === 'DELETE') {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const id = getQuery('id');
      const iconName = getQuery('iconName');

      if (id) {
        await prisma.skill.deleteMany({ where: { id } });
      } else if (iconName) {
        await prisma.skill.deleteMany({
          where: {
            OR: [
              { iconName },
              { name: { equals: iconName, mode: 'insensitive' } },
            ],
          },
        });
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/skills error]', err);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: err?.message || 'Database query error',
        name: err?.name,
      })
    );
  }
}
