import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { getUserByUserName } from "@/data/user"
import { compare } from "bcryptjs"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { username, password } = validatedFields.data

          const user = await getUserByUserName(username)
          if (!user || !user.password) return null

          const passwordsMatch = await compare(password, user.password)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
  trustHost: !!process.env.NEXTAUTH_URL || true,
} satisfies NextAuthConfig
