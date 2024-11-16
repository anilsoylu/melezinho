"use server"
import * as z from "zod"
import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { getUserByUserName } from "@/data/user"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const LoginAction = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" }
  }

  const { username, password } = validatedFields.data

  const existingUser = await getUserByUserName(username)

  if (!existingUser || !existingUser.username || !existingUser.password) {
    return { error: "Kullanıcı adı veya şifre hatalı!" }
  }

  if (existingUser.isActivated === false) {
    return { error: "Kullanıcı hesabınız aktif değil!" }
  }

  try {
    await signIn("credentials", {
      username,
      password,
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Kullanıcı adı veya şifre hatalı!" }
        default:
          return {
            error: "Beklenmedik bir hata oluştu! Lütfen tekrar deneyiniz.",
          }
      }
    }

    throw error
  }
}
