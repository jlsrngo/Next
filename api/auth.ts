import type { IncomingMessage, ServerResponse } from 'http';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  try {
    if (method === 'POST') {
      const body = parseBody(req);
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';

      if (!email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Email and password are required' }));
        return;
      }

      const prisma = getPrisma();
      if (prisma) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: { equals: email, mode: 'insensitive' },
            },
          });

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (isValid) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  ok: true,
                  user: {
                    id: user.id,
                    email: user.email,
                    role: user.role || 'admin',
                  },
                })
              );
              return;
            } else {
              res.statusCode = 401;
              res.end(JSON.stringify({ ok: false, error: 'Invalid password' }));
              return;
            }
          }
        } catch (dbErr) {
          console.error('[API /api/auth POST db error]', dbErr);
        }
      }

      // Fallback for default admin or emergency access
      if (
        (email === 'admin@portfolio.com' || email === 'juliosiringoringo6@gmail.com') &&
        password === 'admin123'
      ) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            ok: true,
            user: {
              id: '1',
              email,
              role: 'admin',
            },
          })
        );
        return;
      }

      res.statusCode = 401;
      res.end(JSON.stringify({ ok: false, error: 'Invalid credentials' }));
      return;
    }

    if (method === 'PUT') {
      const body = parseBody(req);
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';

      const prisma = getPrisma();
      if (prisma) {
        try {
          const user = await prisma.user.findFirst();
          if (user) {
            const dataToUpdate: any = {};
            if (email) dataToUpdate.email = email;
            if (newPassword && newPassword.length >= 6) {
              dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 12);
            }
            const updated = await prisma.user.update({
              where: { id: user.id },
              data: dataToUpdate,
            });
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, email: updated.email }));
            return;
          }
        } catch (e) {
          console.error('[API /api/auth PUT error]', e);
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, email: email || 'admin@portfolio.com' }));
      return;
    }

    if (method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'auth-service-online' }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
  } catch (err: any) {
    console.error('[API /api/auth error]', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'Internal server error' }));
  }
}
