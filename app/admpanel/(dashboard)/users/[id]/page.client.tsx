"use client"

import DataError from "@/components/data-error"
import Loading from "@/components/Loading"
import { fetcher } from "@/hooks/use-fetcher"
import { SELLER_API } from "@/types/api-list"
import { Seller } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import EditUserForm from "./_components/user-form"

type Props = {
  sellerId: string
}

const PageClient = ({ sellerId }: Props) => {
  const query = useQuery<Seller>({
    queryKey: ["sellerList"],
    queryFn: () => fetcher<Seller>(`${SELLER_API}/${sellerId}`),
  })

  if (query.isLoading) return <Loading />
  if (query.isError)
    return <DataError type="Satıcı verileri alınırken bir hata oluştu" />

  const sellerData: Seller = query.data as Seller

  return <EditUserForm sellerId={sellerId} sellerData={sellerData} />
}

export default PageClient
