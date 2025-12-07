// @ts-nocheck
import { PrismaClient } from '@prisma/client'

// Singleton para evitar múltiples instancias de PrismaClient
const globalForPrisma = global as unknown as { prisma: any }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Exportar tipos útiles
export type * from '@prisma/client'
