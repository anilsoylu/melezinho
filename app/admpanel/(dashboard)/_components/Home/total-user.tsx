"use client"
import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { SellerType } from "@/types/product"

type Props = {
  sellerList: SellerType[]
}

const CARD_TITLE = "Satıcı Sayısı"
const TOTAL_PREFIX = "Toplam üye:"

const TotalUser = ({ sellerList }: Props) => {
  const totalUser = useMemo(() => {
    return sellerList.reduce(
      (count, seller) => (seller.isActivated ? count + 1 : count),
      0
    )
  }, [sellerList])

  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{CARD_TITLE}</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{totalUser}</div>
        <p className="text-xs text-muted-foreground">{`${TOTAL_PREFIX} ${totalUser}`}</p>
      </CardContent>
    </Card>
  )
}

export default memo(TotalUser)
