import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
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
