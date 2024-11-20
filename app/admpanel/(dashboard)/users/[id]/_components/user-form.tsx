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
import { Seller } from "@prisma/client"
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
import { SELLER_API } from "@/types/api-list"
import { mutate } from "swr"
import { sellerApi } from "@/types/api-folder"

type Props = {
  sellerId: string
  sellerData: Seller
}

const EditUserForm = ({ sellerId, sellerData }: Props) => {
  const userAdmin = useCurrentUser()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const router = useRouter()
  const { updateApi } = useApi()
  const { isBlock, setIsBlock } = useBlock()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof SellerSchema>>({
    resolver: zodResolver(SellerSchema),
    defaultValues: {
      name: sellerData.name ?? undefined,
      isActivated: sellerData.isActivated ?? true,
    },
  })

  const onSubmit = async (values: z.infer<typeof SellerSchema>) => {
    setIsPending(true)
    setIsBlock && setIsBlock(true)
    Wait().then(() => {
      setIsBlock && setIsBlock(false)
      setIsPending(false)
      router.refresh()
    })

    try {
      if (!userAdmin?.isAdmin) {
        showToast({
          title: "Yetkisiz İşlem",
          description: "Bu işlemi yapma yetkiniz bulunmamaktadır.",
          variant: "destructive",
        })
        setIsPending(false)
        return
      } else {
        const [data, error] = await updateApi(sellerId, sellerApi, values)

        if (!error) {
          showToast({
            title: "Satıcı Güncelleme Başarılı",
            description: "Satıcı bilgileri başarıyla güncellendi.",
            variant: "success",
          })
          mutate(`${SELLER_API}/${sellerId}`)
        } else {
          showToast({
            title: "Satıcı Güncelleme Hatası",
            description: `Satıcı güncelleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin. Hata: ${error}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.log("Satıcı Güncelleme Hatası", error)

      showToast({
        title: "Satıcı Güncelleme Hatası",
        description: `Satıcı güncelleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin. Hata: ${error}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto w-full grid flex-1 auto-rows-max gap-4">
      {!userAdmin?.isAdmin ? (
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
                {`${sellerData?.name} Satıcısını Düzenle`}
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
                disabled={!userAdmin?.isAdmin || isPending}
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

export default EditUserForm
