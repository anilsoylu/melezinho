"use client"

import useFetcher from "@/hooks/use-swr"
import { useCurrentUser } from "@/hooks/use-current-user"

import Unauthorized from "@/components/unauthorized"
import { SELLER_API, TOKEN_API } from "@/types/api-list"
import { ProductType, SellerType } from "@/types/product"
import { dashboardPrefix } from "../../routes"
import DataError from "@/components/data-error"
import Loading from "@/components/Loading"
import EditTokenForm from "./token-form"

type Props = {
  tokenId: string
}

const PageClient = ({ tokenId }: Props) => {
  const user = useCurrentUser()
  const { data: sellerListData, isError } = useFetcher<SellerType[]>(SELLER_API)
  const { data: tokenData, isError: isTokenError } = useFetcher<ProductType>(
    `${TOKEN_API}/${tokenId}`
  )

  if (!user?.isAdmin) {
    return (
      <Unauthorized
        type="Yeni Satıcı Ekleme"
        link={dashboardPrefix}
        buttonName="Geri Dön"
      />
    )
  }

  if (isError || isTokenError)
    return <DataError type="Seller listesi alınırken bir hata oluştu." />
  if (!sellerListData || !tokenData) return <Loading />

  const filteredData = sellerListData.filter((item) => item.isActivated)

  return (
    <EditTokenForm
      tokenId={tokenId}
      sellerData={filteredData}
      tokenData={tokenData}
    />
  )
}

export default PageClient
