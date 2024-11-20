import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const getUser = async (whereClause: Prisma.UserWhereUniqueInput) => {
  try {
    const user = await db.user.findUnique({
      where: whereClause,
    })
    return user
  } catch (error) {
    console.error("Veritabanı hatası:", error)
    return null
  } finally {
    await db.$disconnect() // Veritabanı bağlantısını kapatma
  }
}

export const getUserByUserName = async (username: string) => {
  return await getUser({ username }) // Doğru türde nesne geçirildi
}

export const getUserById = async (id: string) => {
  return await getUser({ id }) // Doğru türde nesne geçirildi
}
