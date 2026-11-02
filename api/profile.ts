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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  const method = (req.method || 'GET').toUpperCase();
  const prisma = getPrisma();

  try {
    if (method === 'GET') {
      if (prisma) {
        try {
          const p = await prisma.profile.findFirst();
          if (p) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                name: p.fullName,
                fullName: p.fullName,
                username: 'jlsrngo',
                headline: p.headline || 'Full Stack Developer',
                focus: p.headline || 'Full-Stack & Systems',
                runtime: 'Rust Axum 0.7 · React 18 · Neon PostgreSQL',
                bio_home: p.bioHome || '',
                bio_about: p.bioAbout || '',
                bioHome: p.bioHome || '',
                bioAbout: p.bioAbout || '',
                location: p.location || 'Indonesia',
                phone: p.phone || '',
                work_status: 'Open to Opportunities',
                avatar_url: p.avatarUrl || '/avatar.jpg',
                avatarUrl: p.avatarUrl || '/avatar.jpg',
                github_url: p.githubUrl || 'https://github.com/jlsrngo',
                linkedin_url: p.linkedinUrl || 'https://linkedin.com/in/jlsrngo',
                email: p.email || 'juliosiringo777@gmail.com',
                website: p.website || 'https://jlsrngo.com',
                accent_color: p.accentColor || '#3B82F6',
                accentColor: p.accentColor || '#3B82F6',
              })
            );
            return;
          }
        } catch (e) {
          console.error('[API /api/profile GET error]', e);
        }
      }

      // Snapshot fallback
      try {
        const snapPath = path.join(process.cwd(), 'public', 'db-data.json');
        if (fs.existsSync(snapPath)) {
          const snap = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
          if (snap?.profile) {
            res.statusCode = 200;
            res.end(JSON.stringify(snap.profile));
            return;
          }
        }
      } catch {}

      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Profile not found' }));
      return;
    }

    if (method === 'PUT' || method === 'POST') {
      if (!prisma) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: 'DATABASE_URL is not set in Vercel environment' }));
        return;
      }

      const body = parseBody(req);
      const first = await prisma.profile.findFirst();
      if (first) {
        const updated = await prisma.profile.update({
          where: { id: first.id },
          data: {
            fullName: body.fullName || body.name || first.fullName,
            headline: body.headline ?? first.headline,
            bioHome: body.bioHome ?? body.bio_home ?? first.bioHome,
            bioAbout: body.bioAbout ?? body.bio_about ?? first.bioAbout,
            avatarUrl: body.avatarUrl ?? body.avatar_url ?? first.avatarUrl,
            email: body.email ?? first.email,
            phone: body.phone ?? first.phone,
            location: body.location ?? first.location,
            website: body.website ?? first.website,
            githubUrl: body.githubUrl ?? body.github_url ?? first.githubUrl,
            linkedinUrl: body.linkedinUrl ?? body.linkedin_url ?? first.linkedinUrl,
          },
        });
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Profile record not found' }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/profile error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Database query error' }));
  }
}
