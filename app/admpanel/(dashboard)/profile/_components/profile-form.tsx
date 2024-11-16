"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { memo, useState, useTransition } from "react"

import { ProfileSchema } from "@/schemas"
import { ProfileAction } from "@/actions/ProfileAction"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateRandomPassword } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const ProfileForm = () => {
  const { update } = useSession()
  const user = useCurrentUser()
  const showToast = useCustomToast()
  const router = useRouter()
  const [passwordType, setPasswordType] = useState("password")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      password: undefined,
      username: user?.username ?? undefined,
      isActivated: user?.isActivated ?? true,
    },
  })

  const handlePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"))
  }

  const handleRandomPassword = () => {
    const randomPassword = generateRandomPassword()
    form.setValue("newPassword", randomPassword)
  }

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      ProfileAction(values)
        .then((data) => {
          if (data.error) {
            showToast({
              title: "Hata Oluştu!",
              description: `Bir hata oluştu: ${data.error}`,
              variant: "destructive",
            })
          }

          if (data.success) {
            update()
            showToast({
              title: "Profil Güncellendi!",
              description: "Profiliniz başarıyla güncellendi.",
              variant: "success",
            })
            router.refresh()
          }
        })
        .catch((err) => {
          console.log("err", err)
          showToast({
            title: "Hata Oluştu!",
            description: "Beklenmeyen bir hata oluştu!",
            variant: "destructive",
          })
        })
    })
  }

  const handleBack = () => {
    router.back()
    router.refresh()
  }

  return (
    <div className="mx-auto w-full grid flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex max-md:flex-col items-center gap-4">
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleBack}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Geri</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {user?.username ?? "Kullanıcı"} Profili Düzenle
              </h1>
            </div>
            <div className="items-center gap-2 md:ml-auto md:flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                Vazgeç
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                Kaydet
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            Kullanıcı Adı
                          </FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <Input
                                {...field}
                                disabled={isPending || !user?.isAdmin}
                                className="w-full"
                                placeholder="johndoe"
                              />
                            </div>
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
                          <FormLabel>Eski Şifre</FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <div className="flex items-start w-full justify-between gap-4 flex-col md:flex-row">
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="********"
                                  type={passwordType}
                                  className="w-full"
                                />
                                <Button
                                  type="button"
                                  onClick={handlePasswordType}
                                  variant="outline"
                                >
                                  {passwordType === "password" ? (
                                    <Eye size={24} />
                                  ) : (
                                    <EyeOff size={24} />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            {`Eğer şifrenizi değiştirmek istemiyorsanız bu alanı boş
                          bırakabilirsiniz.`}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yeni Şifre</FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <div className="flex items-start w-full justify-between gap-4 flex-col md:flex-row">
                                <div className="flex justify-between items-start gap-x-3 w-full md:w-10/12">
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="********"
                                    type={passwordType}
                                    className="w-full"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handlePasswordType}
                                    variant="outline"
                                  >
                                    {passwordType === "password" ? (
                                      <Eye size={24} />
                                    ) : (
                                      <EyeOff size={24} />
                                    )}
                                  </Button>
                                </div>
                                <Button
                                  type="button"
                                  onClick={handleRandomPassword}
                                  className="w-full md:w-2/12"
                                >
                                  Random Generation
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <FormField
                control={form.control}
                name="isActivated"
                render={({ field }) => (
                  <FormItem>
                    <Card>
                      <CardHeader>
                        <CardTitle>Available</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="status">
                              {`Enable or disable your account.`}
                            </Label>
                            <FormControl>
                              <Switch
                                disabled={isPending}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default memo(ProfileForm)
