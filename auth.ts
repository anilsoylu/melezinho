import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "./data/account"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id as string)

      if (!existingUser?.isActivated) return false

      await db.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      })

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.username = token.username as string
        session.user.isOAuth = token.isOauth as boolean
        session.user.isActivated = token.isActivated as boolean
        session.user.isAdmin = token.isAdmin as boolean
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOauth = !!existingAccount
      token.picture = existingUser.image
      token.username = existingUser.username
      token.isActivated = existingUser.isActivated
      token.isAdmin = existingUser.isAdmin

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
