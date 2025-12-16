import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

if (process.env.NODE_ENV !== 'test') {
    prisma = new PrismaClient();
}

export default prisma;

export function getPrisma(): PrismaClient {
    if (!prisma) throw new Error("Prisma not initialized");
    return prisma;
}