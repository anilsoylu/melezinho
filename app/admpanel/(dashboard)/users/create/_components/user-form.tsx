"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBlock } from "@/context/block-context"
import useApi from "@/hooks/use-api"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Wait from "@/hooks/use-wait"

import { SellerSchema } from "@/schemas"
import { dashboardPrefix } from "../../../routes"
import { ChevronLeft, TriangleAlert } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { sellerApi } from "@/types/api-folder"

const UserForm = () => {
  const user = useCurrentUser()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const { createApi } = useApi()
  const { isBlock, setIsBlock } = useBlock()

  const form = useForm<z.infer<typeof SellerSchema>>({
    resolver: zodResolver(SellerSchema),
    defaultValues: {
      name: "",
      isActivated: true,
    },
  })

  const onSubmit = async (values: z.infer<typeof SellerSchema>) => {
    setIsPending(true)
    setIsBlock && setIsBlock(true)
    Wait().then(() => {
      setIsBlock && setIsBlock(false)
      setIsPending(false)
    })

    try {
      if (!user?.isAdmin) {
        showToast({
          title: "Yetkisiz İşlem",
          description: "Bu işlemi yapma yetkiniz bulunmamaktadır.",
          variant: "destructive",
        })
        setIsPending(false)
        return
      } else {
        const [data, error] = await createApi(sellerApi, values)

        if (!error) {
          showToast({
            title: "Satıcı oluşturuldu",
            description: "Satıcı başarıyla oluşturuldu.",
            variant: "success",
          })
          router.push(`${dashboardPrefix}/${folder}`)
        } else {
          showToast({
            title: "Satıcı oluşturulurken bir hata oluştu",
            description: `Satıcı oluşturulurken bir hata oluştu: ${error}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      showToast({
        title: "Satıcı oluşturulurken bir hata oluştu",
        description: `Satıcı oluşturulurken bir hata oluştu: ${error}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto w-full grid flex-1 auto-rows-max gap-4">
      {!user?.isAdmin ? (
        <div className="flex gap-2 items-center p-2 rounded-md bg-destructive">
          <TriangleAlert />
          <span>{`Bu sayfa da işlem yetkiniz bulunmamaktadır!`}</span>
        </div>
      ) : null}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => router.back()}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{`Geri`}</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-sm md:text-xl font-semibold tracking-tight sm:grow-0">
                {`Yeni Satıcı Ekle`}
              </h1>
            </div>
            <div className="items-center w-full md:w-auto gap-2 md:ml-auto justify-between flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="w-1/2 md:w-auto"
              >
                {`İptal`}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!user?.isAdmin || isPending}
                className="w-1/2 md:w-auto"
              >
                {`Kaydet`}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{`İsim`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            {`Satıcı Adı`}
                          </FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <Input
                                {...field}
                                disabled={isPending}
                                className="w-full"
                                placeholder="Satıcı Adı"
                                autoComplete="off"
                              />
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
                        <CardTitle>{`Durum`}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="status">{`Satıcıyı etkinleştir veya devre dışı bırak`}</Label>
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
          <div className="items-center w-full md:w-auto gap-2 md:ml-auto justify-between flex md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => router.back()}
              className="w-1/2 md:w-auto"
            >
              {`İptal`}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="w-1/2 md:w-auto"
            >
              {`Kaydet`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UserForm
