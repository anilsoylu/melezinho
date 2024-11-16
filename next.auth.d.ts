import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  username: string
  isActivated: boolean
  isAdmin: boolean
  isOAuth: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
