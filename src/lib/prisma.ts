import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Defer initialization to avoid build-time crashes if DATABASE_URL is missing
const createPrismaClient = () => {
    // During Next.js build phase, we return a mock to satisfy static analysis
    // without requiring a valid DATABASE_URL environment variable.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return {} as any;
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    } as any);
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
