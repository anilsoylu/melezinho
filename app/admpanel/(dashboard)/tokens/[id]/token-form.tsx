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
import { useEffect, useState } from "react"
import Wait from "@/hooks/use-wait"

import { TokenSchema } from "@/schemas"
import { tokenApi } from "@/types/api-folder"
import { dashboardPrefix } from "../../routes"
import { CalendarIcon, ChevronLeft, TriangleAlert } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import SellersList from "./seller-list"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { ProductType, SellerType } from "@/types/product"

type Props = {
  tokenId: string
  sellerData: SellerType[]
  tokenData: ProductType
}

const EditTokenForm = ({ tokenId, sellerData, tokenData }: Props) => {
  const user = useCurrentUser()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const { updateApi } = useApi()
  const { isBlock, setIsBlock } = useBlock()

  const [sellerId, setSellerId] = useState<string>(tokenData.sellerId)

  const form = useForm<z.infer<typeof TokenSchema>>({
    resolver: zodResolver(TokenSchema),
    defaultValues: {
      sellerId: tokenData.sellerId ?? undefined,
      title: tokenData.title ?? undefined,
      date: new Date(tokenData.date) ?? new Date(),
      price: tokenData.price ?? 0,
      quantity: tokenData.quantity ?? 0,
      isPaid: tokenData.isPaid ?? false,
      isActivated: tokenData.isActivated ?? true,
    },
  })

  const onSubmit = async (values: z.infer<typeof TokenSchema>) => {
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
        const [data, error] = await updateApi(tokenId, tokenApi, values)

        if (error) {
          showToast({
            title: "Token Oluşturulamadı",
            description: `Token oluşturulurken bir hata oluştu. Hata: ${error}`,
            variant: "destructive",
          })
          setIsPending(false)
          return
        } else {
          showToast({
            title: "Token Oluşturuldu",
            description: "Token başarıyla oluşturuldu.",
            variant: "success",
          })
          router.push(`${dashboardPrefix}/${folder}`)
        }
      }
    } catch (error) {
      showToast({
        title: "Token Oluşturulamadı",
        description: `Token oluşturulurken bir hata oluştu. Hata: ${error}`,
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
                {`Yeni Token Ekle`}
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
                  <CardTitle>{`Token Bilgileri`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="sellerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            {`Satıcı Adı`}
                          </FormLabel>
                          <SellersList
                            disabled={isPending}
                            field={field}
                            sellerId={sellerId}
                            setSellerId={setSellerId}
                            sellerData={sellerData}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            {`Title`}
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
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale: tr,
                                    })
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {`Ürünün üretildiği tarih`}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            {`Birim Fiyat`}
                          </FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <Input
                                {...field}
                                disabled={isPending}
                                className="w-full"
                                placeholder="Birim Fiyat"
                                autoComplete="off"
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            {`Ürünün birim fiyatı`}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full md:w-1/5">
                            {`Miktar`}
                          </FormLabel>
                          <FormControl>
                            <div className="grid gap-3">
                              <Input
                                {...field}
                                disabled={isPending}
                                className="w-full"
                                placeholder="Miktar"
                                autoComplete="off"
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            {`Üretilen token miktarı`}
                          </FormDescription>
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
                name="isPaid"
                render={({ field }) => (
                  <FormItem>
                    <Card>
                      <CardHeader>
                        <CardTitle>{`Ödeme`}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="status">{`Oluşturulan tokenin ücreti ödendi mi ?`}</Label>
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

export default EditTokenForm
