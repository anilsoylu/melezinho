"use client"
import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { ProductType } from "@/types/product"

type Props = {
  productList: ProductType[]
}

const CARD_TITLE = "Toplam Ödenmeyen Token"
const TOTAL_PREFIX = "Toplam ödenmeyen:"
const TOKEN_SUFFIX = "token"

const TotalUnPaidSales = ({ productList }: Props) => {
  const totalUnPaidSales = useMemo(() => {
    return productList.reduce(
      (count, product) =>
        product.isActivated && !product.isPaid ? count + 1 : count,
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
        <div className="text-2xl font-bold">+{totalUnPaidSales}</div>
        <p className="text-xs text-muted-foreground">
          {`${TOTAL_PREFIX} ${totalUnPaidSales} ${TOKEN_SUFFIX}`}
        </p>
      </CardContent>
    </Card>
  )
}

export default memo(TotalUnPaidSales)
