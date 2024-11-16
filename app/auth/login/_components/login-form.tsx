"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/schemas"
import { useRouter, useSearchParams } from "next/navigation"
import { useReducer, useCallback } from "react"
import { useCustomToast } from "@/hooks/use-custom-toast"

import { CardWrapper } from "../../_components/card-wrapper"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoginAction } from "@/actions/LoginAction"

// Durum yönetimi için reducer tanımı
type LoginState = {
  error: string
  success: string
  isPending: boolean
}

type LoginAction =
  | { type: "START" }
  | { type: "SUCCESS"; payload: string }
  | { type: "ERROR"; payload: string }

const initialState: LoginState = {
  error: "",
  success: "",
  isPending: false,
}

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "START":
      return { ...state, isPending: true, error: "", success: "" }
    case "SUCCESS":
      return { ...state, isPending: false, success: action.payload }
    case "ERROR":
      return { ...state, isPending: false, error: action.payload }
    default:
      return state
  }
}

const LoginForm = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState)
  const showToast = useCustomToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl")

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof LoginSchema>) => {
      dispatch({ type: "START" })

      try {
        const response = await LoginAction(values, callbackUrl)

        if (response?.error) {
          dispatch({ type: "ERROR", payload: response.error })
          showToast({
            title: "Giriş başarısız!",
            description: `Bir hata oluştu: ${response.error}`,
            variant: "destructive",
          })
        } else {
          form.reset()
          dispatch({ type: "SUCCESS", payload: "Giriş başarılı!" })
          showToast({
            title: "Giriş başarılı!",
            description: "Başarıyla giriş yaptınız, yönlendiriliyorsunuz...",
            variant: "success",
          })
          router.push(callbackUrl || "/")
        }
      } catch {
        dispatch({ type: "ERROR", payload: "Beklenmedik bir hata oluştu!" })
        showToast({
          title: "Giriş başarısız!",
          description: "Beklenmedik bir hata oluştu! Lütfen tekrar deneyiniz.",
          variant: "destructive",
        })
      }
    },
    [callbackUrl, form, router, showToast]
  )

  return (
    <CardWrapper
      headerLabel="Tekrar hoş geldin!"
      backButtonLabel="Hesabınız yok mu? Kayıt olun."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={state.isPending}
                      placeholder="Kullanıcı adınızı girin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={state.isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={state.isPending} type="submit" className="w-full">
            Giriş Yap
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm
