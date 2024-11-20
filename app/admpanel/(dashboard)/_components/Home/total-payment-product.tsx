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

const CARD_TITLE = "Toplam Ödenen Tutar"
const TOTAL_PREFIX = "Toplam ödenen tutar:"

const TotalPaymentTokens = ({ productList }: Props) => {
  const totalPayment = useMemo(() => {
    return productList
      .filter((product) => {
        return product.isActivated
      }) // Tarih bugünün tarihi mi?
      .reduce((acc, product) => acc + product.price, 0)
  }, [productList])

  return (
    <Card x-chunk="dashboard-01-chunk-0" className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{CARD_TITLE}</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          +{formatCurrency(totalPayment)}
        </div>
        <p className="text-xs text-muted-foreground">
          {`${TOTAL_PREFIX} ${formatCurrency(totalPayment)}`}
        </p>
      </CardContent>
    </Card>
  )
}

export default memo(TotalPaymentTokens)
