import { db } from "@/lib/db"

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    })
    return account
  } catch (err) {
    console.error("Hata:", err) // Hata mesajını konsola yazdır
    return null
  } finally {
    await db.$disconnect() // Veritabanı bağlantısını güvenli bir şekilde kapat
  }
}
