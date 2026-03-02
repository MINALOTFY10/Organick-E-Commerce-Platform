import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

// Prevent new PrismaClient instances on every hot module reload in development.
// In production a single instance is created for the process lifetime.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const adapter = new PrismaPg({ connectionString })
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export { prisma }