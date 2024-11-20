"use client"
import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { ProductType } from "@/types/product"
import { isSameWeek } from "date-fns"

type Props = {
  productList: ProductType[]
}

const CARD_TITLE = "Bu Hafta Üretilen Token"
const TOTAL_PREFIX = "Bu hafta üretilen token:"

const WeekProductTokens = ({ productList }: Props) => {
  const weekCreateProduct = useMemo(() => {
    return productList
      .filter((product) => {
        const date =
          typeof product.date === "string"
            ? new Date(product.date)
            : product.date // Eğer string ise Date'e çevir
        return product.isActivated && isSameWeek(date, new Date())
      }) // Tarih bugünün tarihi mi?
      .reduce((acc, product) => acc + product.quantity, 0)
  }, [productList])

  return (
    <Card x-chunk="dashboard-01-chunk-0" className="w-full lg:w-1/3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{CARD_TITLE}</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{weekCreateProduct}</div>
        <p className="text-xs text-muted-foreground">
          {`${TOTAL_PREFIX} ${weekCreateProduct}`}
        </p>
      </CardContent>
    </Card>
  )
}

export default memo(WeekProductTokens)