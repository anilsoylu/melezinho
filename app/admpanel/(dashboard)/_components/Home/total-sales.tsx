"use client"
import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { ProductType } from "@/types/product"

type Props = {
  productList: ProductType[]
}

const CARD_TITLE = "Toplam Token"
const TOTAL_PREFIX = "Toplam üretilen token:"

const TotalSales = ({ productList }: Props) => {
  const totalSales = useMemo(() => {
    return productList.reduce(
      (count, product) => (product.isActivated ? count + 1 : count),
      0
    )
  }, [productList])

  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{CARD_TITLE}</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{totalSales}</div>
        <p className="text-xs text-muted-foreground">
          {`${TOTAL_PREFIX} ${totalSales}`}
        </p>
      </CardContent>
    </Card>
  )
}

export default memo(TotalSales)
