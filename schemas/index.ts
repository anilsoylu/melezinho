import * as z from "zod"

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Kullanıcı adı gereklidir",
  }),
  password: z.string().min(1, {
    message: "Şifre gereklidir",
  }),
})

export const ProfileSchema = z
  .object({
    username: z.optional(
      z.string().min(1, { message: "Kullanıcı adı gereklidir" })
    ),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    isActivated: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: "Yeni şifre gereklidir",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: "Şifre gereklidir",
      path: ["password"],
    }
  )

export const OrderBySchema = z.object({
  orderBy: z.number(),
})

export const SellerSchema = z.object({
  name: z.string().min(1, {
    message: "İsim gereklidir",
  }),
  isActivated: z.boolean().optional().default(true),
})
