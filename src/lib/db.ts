import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Passamos explicitamente a propriedade datasource para o construtor no Prisma 7
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasource: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}