"use server"

import * as z from "zod"
import { db } from "@/lib/db"
import { ProfileSchema } from "@/schemas"
import { getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { compare, hash } from "bcryptjs"

export const ProfileAction = async (values: z.infer<typeof ProfileSchema>) => {
  const user = await currentUser()

  if (!user) return { error: "Erişim reddedildi" }

  const dbUser = await getUserById(user.id as string)
  if (!dbUser) return { error: "Yanlış kullanıcı" }

  // Parola değiştirme işlemi
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await compare(values.password, dbUser.password)
    if (!passwordsMatch) return { error: "Şifreler eşleşmiyor" }

    // Yeni şifreyi hash'leyin ve password alanına kaydedin
    values.password = await hash(values.newPassword, 10)
  }

  // newPassword alanını Prisma'ya gönderilecek verilerden çıkarın
  delete values.newPassword
  const updateData = values

  // Kullanıcıyı güncelleme
  const updateUser = await db.user.update({
    where: { id: dbUser.id },
    data: updateData,
  })

  return { success: "Kullanıcı güncellendi!", user: updateUser }
}

// Belirli bir kullanıcıyı ID ile getirir
export const profileId = async (id: string) => {
  try {
    const user = await getUserById(id)
    if (!user) return { error: "Kullanıcı bulunamadı" }
    return { success: "Kullanıcı bulundu!", user }
  } catch (error) {
    console.error("Kullanıcı bulunurken hata:", error)
    return { error: "Kullanıcı bulunamadı!" }
  } finally {
    await db.$disconnect()
  }
}
