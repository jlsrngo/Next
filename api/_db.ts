import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient({
        log: ['error'],
      });
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
      }
    } catch (err) {
      console.error('[DB] Failed to initialize PrismaClient:', err);
      return null;
    }
  }

  return prismaInstance;
}

let cachedSnapshot: any = null;

export function getDbSnapshot(): any {
  if (cachedSnapshot) return cachedSnapshot;
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'db-data.json'),
      path.join(process.cwd(), 'dist', 'db-data.json'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        cachedSnapshot = JSON.parse(fs.readFileSync(p, 'utf-8'));
        return cachedSnapshot;
      }
    }
  } catch {}
  return null;
}
