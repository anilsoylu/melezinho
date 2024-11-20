"use client"

import { memo, useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ProductType, SellerType } from "@/types/product"
import { useCurrentUser } from "@/hooks/use-current-user"
import { customFetcher } from "@/hooks/use-fetcher"
import { SELLER_API, TOKEN_API } from "@/types/api-list"
import Loading from "@/components/Loading"
import DataError from "@/components/data-error"
import TotalUser from "./total-user"
import TotalSales from "./total-sales"
import TotalPaidSales from "./total-sales-paid"
import TotalUnPaidSales from "./total-sales-unpaid"
import TodayProductTokens from "./today-product-tokens"
import WeekProductTokens from "./week-product-tokens"
import MonthlyProductTokens from "./monthly-product-tokens"
import TodayPaymenTokens from "./today-payment-product"
import WeekPaymenTokens from "./week-payment-product"
import MonthlyPaymenTokens from "./monthly-payment-product"
import TotalPaymentTokens from "./total-payment-product"

type DashboardData = {
  sellers: SellerType[]
  products: ProductType[]
}

const formatDate = (date: Date) => format(date, "dd MMMM yyyy", { locale: tr })

const HomePage = () => {
  const user = useCurrentUser()

  const [data, setData] = useState<DashboardData>({
    sellers: [],
    products: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Veri çekme işlemi
  const fetchData = useCallback(async () => {
    if (!user?.id) return

    try {
      const [sellers, products] = await Promise.all([
        customFetcher<SellerType[]>(SELLER_API),
        customFetcher<ProductType[]>(TOKEN_API),
      ])

      setData({ sellers, products })
    } catch (err) {
      console.error("Veri çekme hatası:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // İlk yüklemede veri çekme
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Yükleme veya hata durumu kontrolü
  if (loading) return <Loading />
  if (error) return <DataError type="Veri" />

  const { sellers, products } = data

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <TotalUser sellerList={sellers} />
        <TotalSales productList={products} />
        <TotalPaidSales productList={products} />
        <TotalUnPaidSales productList={products} />
      </div>
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        {[
          <TodayProductTokens key="today-product" productList={products} />,
          <WeekProductTokens key="week-product" productList={products} />,
          <MonthlyProductTokens key="monthly-product" productList={products} />,
        ]}
      </div>
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        {[
          <TodayPaymenTokens key="today-payment" productList={products} />,
          <WeekPaymenTokens key="week-payment" productList={products} />,
          <MonthlyPaymenTokens key="monthly-payment" productList={products} />,
        ]}
      </div>
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <TotalPaymentTokens productList={products} />
      </div>
    </div>
  )
}

export default memo(HomePage)
