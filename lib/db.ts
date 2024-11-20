import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export const disconnectDB = async () => {
  try {
    await db.$disconnect()
  } catch (error) {
    console.error("Error disconnecting database:", error)
  }
}
