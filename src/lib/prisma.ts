import { PrismaClient } from '@prisma/client'

// Define un tipo para tu global extendido
type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient
}

// Haz el cast del globalThis
const globalWithPrisma = globalThis as GlobalWithPrisma

// Crea o reusa la instancia existente
const prisma = globalWithPrisma.prisma || new PrismaClient()

// Configuración para desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prisma
}

export default prisma

