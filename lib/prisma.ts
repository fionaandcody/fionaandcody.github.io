import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL ?? 'file:./dev.db';
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }
    const filename = connectionString.replace(/^file:/, '');

    // The adapter constructor apparently takes a config object with url
    const adapter = new PrismaBetterSqlite3({
        url: filename
    });

    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
