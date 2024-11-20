"use client"
import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { ProductType } from "@/types/product"
import { isToday } from "date-fns"
import { formatCurrency } from "@/lib/utils"

type Props = {
  productList: ProductType[]
}

const CARD_TITLE = "Bugün Ödenen Tutar"
const TOTAL_PREFIX = "Bugün ödenen tutar:"

const TodayPaymenTokens = ({ productList }: Props) => {
  const todaPayment = useMemo(() => {
    return productList
      .filter((product) => {
        const date =
          typeof product.date === "string"
            ? new Date(product.date)
            : product.date // Eğer string ise Date'e çevir
        return product.isActivated && isToday(date)
      }) // Tarih bugünün tarihi mi?
      .reduce((acc, product) => acc + product.price * product.quantity, 0)
  }, [productList])

  return (
    <Card x-chunk="dashboard-01-chunk-0" className="w-full lg:w-1/3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{CARD_TITLE}</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{formatCurrency(todaPayment)}</div>
        <p className="text-xs text-muted-foreground">
          {`${TOTAL_PREFIX} ${formatCurrency(todaPayment)}`}
        </p>
      </CardContent>
    </Card>
  )
}

export default memo(TodayPaymenTokens)
