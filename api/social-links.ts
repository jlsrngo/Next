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
  const urlObj = new URL(req.url || '/api/social-links', 'http://localhost');

  const getQuery = (key: string): string | null => {
    if (req.query && req.query[key]) {
      const v = req.query[key];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(key);
  };

  const id = getQuery('id') || (urlObj.pathname.startsWith('/api/social-links/') ? urlObj.pathname.split('/')[3] : null);
  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (prisma) {
        const rows = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
        res.statusCode = 200;
        res.end(
          JSON.stringify(
            rows.map((s) => ({
              id: s.id,
              platform: s.platform,
              title: s.title,
              description: s.description || '',
              url: s.url,
              username: s.url,
              isFeatured: s.isFeatured,
              is_featured: s.isFeatured,
              order: s.order,
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
          res.end(JSON.stringify(snap?.socialLinks || []));
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
      const isFeatured = b.isFeatured !== undefined ? Boolean(b.isFeatured) : (b.is_featured !== undefined ? Boolean(b.is_featured) : false);
      const created = await prisma.socialLink.create({
        data: {
          platform: b.platform || 'Network',
          title: b.title || b.platform || 'Network',
          url: b.url || 'https://',
          description: b.description || '',
          isFeatured,
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
      const dataToUpdate: any = {};
      if (b.platform !== undefined) dataToUpdate.platform = b.platform;
      if (b.title !== undefined) dataToUpdate.title = b.title;
      if (b.url !== undefined) dataToUpdate.url = b.url;
      if (b.description !== undefined) dataToUpdate.description = b.description;
      if (b.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(b.isFeatured);
      else if (b.is_featured !== undefined) dataToUpdate.isFeatured = Boolean(b.is_featured);
      if (b.order !== undefined) dataToUpdate.order = Number(b.order);

      const updated = await prisma.socialLink.update({
        where: { id },
        data: dataToUpdate,
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
      await prisma.socialLink.delete({ where: { id } });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/social-links error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database query error' }));
  }
}
