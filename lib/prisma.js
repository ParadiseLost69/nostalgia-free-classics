import { PrismaClient } from '@prisma/client';

/** @type {{ prisma?: PrismaClient }} */
const globalForPrisma = globalThis;

// Reuse one client across hot reloads in development.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
