"use client"

import Unauthorized from "@/components/unauthorized"
import { useCurrentUser } from "@/hooks/use-current-user"
import { dashboardPrefix } from "@/app/admpanel/(dashboard)/routes"
import CreateTokenForm from "./token-form"
import useFetcher from "@/hooks/use-swr"
import { SELLER_API } from "@/types/api-list"
import DataError from "@/components/data-error"
import Loading from "@/components/Loading"
import { SellerType } from "@/types/product"

const PageClient = () => {
  const user = useCurrentUser()
  const { data: sellerListData, isError } = useFetcher<SellerType[]>(SELLER_API)

  if (!user?.isAdmin) {
    return (
      <Unauthorized
        type="Yeni Satıcı Ekleme"
        link={dashboardPrefix}
        buttonName="Geri Dön"
      />
    )
  }

  if (isError)
    return <DataError type="Seller listesi alınırken bir hata oluştu." />
  if (!sellerListData) return <Loading />

  const filteredData = sellerListData.filter((item) => item.isActivated)

  return <CreateTokenForm sellerData={filteredData} />
}

export default PageClient
